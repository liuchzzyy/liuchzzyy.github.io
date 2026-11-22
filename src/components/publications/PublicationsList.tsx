'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    CalendarIcon,
    BookOpenIcon,
    ClipboardDocumentIcon,
    DocumentTextIcon,
    CheckIcon,
    ArrowUpRightIcon,
} from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';
import { cn } from '@/lib/utils';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from './FormattedBibTeXText';

interface PublicationsListProps {
    config: PublicationPageConfig;
    publications: Publication[];
    embedded?: boolean;
}

export default function PublicationsList({ config, publications, embedded = false }: PublicationsListProps) {
    const messages = useMessages();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
    const [selectedType, setSelectedType] = useState<string | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);
    const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const years = useMemo(() => {
        const uniqueYears = Array.from(new Set(publications.map((p) => p.year)));
        return uniqueYears.sort((a, b) => b - a);
    }, [publications]);

    const types = useMemo(() => {
        const uniqueTypes = Array.from(new Set(publications.map((p) => p.type)));
        return uniqueTypes.sort();
    }, [publications]);

    const filteredPublications = useMemo(() => {
        return publications.filter((pub) => {
            const matchesSearch =
                pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.authors.some((author) => author.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                pub.journal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.conference?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesYear = selectedYear === 'all' || pub.year === selectedYear;
            const matchesType = selectedType === 'all' || pub.type === selectedType;

            return matchesSearch && matchesYear && matchesType;
        });
    }, [publications, searchQuery, selectedYear, selectedType]);

    const handleCopyBibtex = async (id: string, bibtex?: string) => {
        if (!bibtex) return;
        try {
            await navigator.clipboard.writeText(bibtex);
            setCopiedId(id);
            setTimeout(() => {
                setCopiedId((prev) => (prev === id ? null : prev));
            }, 1800);
        } catch {
            // Clipboard unavailable
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
        >
            <header className="mb-8 border-b border-border-subtle pb-5">
                <div className="flex items-baseline justify-between gap-4">
                    <h1 className={`${embedded ? 'text-2xl' : 'text-3xl sm:text-4xl'} font-serif font-semibold tracking-tight text-primary mb-2`}>
                        {config.title}
                    </h1>
                    <span className="font-mono text-xs text-neutral-500 flex-shrink-0">
                        {filteredPublications.length} / {publications.length}
                    </span>
                </div>
                {config.description && (
                    <p className={`${embedded ? 'text-base' : 'text-[1.02rem]'} text-neutral-600 max-w-2xl leading-relaxed`}>
                        {config.description}
                    </p>
                )}
                <p className="mt-2 text-xs text-neutral-500">
                    {messages.publications.authorLegend}
                </p>
            </header>

            {/* Search and Filter Controls */}
            <div className="mb-8 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input
                            type="text"
                            placeholder={messages.publications.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border-subtle bg-surface text-primary placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors duration-200 cursor-pointer',
                            showFilters
                                ? 'bg-accent text-white border-accent'
                                : 'bg-surface border-border-subtle text-neutral-700 hover:border-accent/60 hover:text-accent hover:bg-accent-soft'
                        )}
                    >
                        <FunnelIcon className="h-4 w-4" />
                        <span>{messages.publications.filters}</span>
                    </button>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 bg-surface rounded-xl border border-border-subtle flex flex-wrap gap-6">
                                {/* Year Filter */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                                        <CalendarIcon className="h-3.5 w-3.5 text-accent" />
                                        {messages.publications.year}
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedYear('all')}
                                            className={cn(
                                                'px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer',
                                                selectedYear === 'all'
                                                    ? 'bg-accent text-white border-accent'
                                                    : 'bg-surface-subtle border-border-subtle text-neutral-700 hover:border-border-strong'
                                            )}
                                        >
                                            {messages.common.all}
                                        </button>
                                        {years.map((year) => (
                                            <button
                                                type="button"
                                                key={year}
                                                onClick={() => setSelectedYear(year)}
                                                className={cn(
                                                    'px-3 py-1 text-xs font-mono rounded-full border transition-colors cursor-pointer',
                                                    selectedYear === year
                                                        ? 'bg-accent text-white border-accent'
                                                        : 'bg-surface-subtle border-border-subtle text-neutral-700 hover:border-border-strong'
                                                )}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Type Filter */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                                        <BookOpenIcon className="h-3.5 w-3.5 text-accent" />
                                        {messages.publications.type}
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedType('all')}
                                            className={cn(
                                                'px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer',
                                                selectedType === 'all'
                                                    ? 'bg-accent text-white border-accent'
                                                    : 'bg-surface-subtle border-border-subtle text-neutral-700 hover:border-border-strong'
                                            )}
                                        >
                                            {messages.common.all}
                                        </button>
                                        {types.map((type) => (
                                            <button
                                                type="button"
                                                key={type}
                                                onClick={() => setSelectedType(type)}
                                                className={cn(
                                                    'px-3 py-1 text-xs rounded-full border capitalize transition-colors cursor-pointer',
                                                    selectedType === type
                                                        ? 'bg-accent text-white border-accent'
                                                        : 'bg-surface-subtle border-border-subtle text-neutral-700 hover:border-border-strong'
                                                )}
                                            >
                                                {type.replace('-', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Publications List */}
            <div className="space-y-5">
                {filteredPublications.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500 editorial-card rounded-xl">
                        {messages.publications.noResults}
                    </div>
                ) : (
                    filteredPublications.map((pub, index) => {
                        const paperUrl = pub.doi ? `https://doi.org/${pub.doi}` : pub.url;
                        const isPreprint = pub.type === 'preprint' || pub.description?.toLowerCase().includes('preprint');

                        return (
                            <motion.article
                                key={pub.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: Math.min(0.05 * index, 0.35) }}
                                className="editorial-card group p-5 sm:p-6 rounded-xl"
                            >
                                <div className="flex flex-col md:flex-row gap-5 items-start">
                                    {pub.preview && (
                                        <div className="w-full md:w-48 flex-shrink-0">
                                            <div className="aspect-[16/10] md:aspect-[4/3] relative rounded-lg overflow-hidden border border-border-subtle bg-surface-subtle">
                                                <Image
                                                    src={`/papers/${pub.preview}`}
                                                    alt={`${pub.title} graphical abstract`}
                                                    fill
                                                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                                    sizes="(max-width: 768px) 100vw, 192px"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex-grow min-w-0">
                                        {/* Venue & Year */}
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5">
                                            {(pub.journal || pub.conference) && (
                                                <span className="font-serif italic text-[0.9rem] text-accent font-medium">
                                                    {pub.journal || pub.conference}
                                                </span>
                                            )}
                                            <span className="font-mono text-xs text-neutral-500">
                                                {pub.year}
                                            </span>
                                            {isPreprint && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[0.7rem] font-medium bg-surface-subtle text-neutral-600 border border-border-subtle">
                                                    Preprint
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className={`${embedded ? 'text-lg' : 'text-[1.1rem]'} font-semibold text-primary mb-2 leading-snug`}>
                                            {paperUrl ? (
                                                <a
                                                    href={paperUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-accent transition-colors"
                                                >
                                                    <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                                                </a>
                                            ) : (
                                                <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                                            )}
                                        </h3>

                                        {/* Authors */}
                                        <p className="text-sm text-neutral-600 leading-relaxed mb-3">
                                            {pub.authors.map((author, idx) => (
                                                <span key={idx}>
                                                    <span
                                                        className={`${author.isHighlighted ? 'font-semibold text-accent' : ''} ${
                                                            author.isCoAuthor
                                                                ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}`
                                                                : ''
                                                        }`}
                                                    >
                                                        {author.orcid ? (
                                                            <a
                                                                href={author.orcid}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                aria-label={`${author.name} ORCID profile`}
                                                                className="hover:text-accent transition-colors"
                                                            >
                                                                {author.name}
                                                            </a>
                                                        ) : (
                                                            author.name
                                                        )}
                                                    </span>
                                                    {author.isCorresponding && (
                                                        <sup
                                                            className={`ml-0.5 font-semibold ${author.isHighlighted ? 'text-accent' : 'text-neutral-600'}`}
                                                            title="Corresponding author"
                                                            aria-label="Corresponding author"
                                                        >
                                                            *
                                                        </sup>
                                                    )}
                                                    {idx < pub.authors.length - 1 && ', '}
                                                </span>
                                            ))}
                                        </p>

                                        {pub.description && !pub.description.toLowerCase().includes('crossref metadata unavailable') && (
                                            <p className="text-xs text-neutral-500 mb-3 line-clamp-2">
                                                {pub.description}
                                            </p>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {pub.doi && (
                                                <a
                                                    href={`https://doi.org/${pub.doi}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-surface-subtle border border-border-subtle text-neutral-700 hover:border-accent/60 hover:text-accent hover:bg-accent-soft transition-colors"
                                                >
                                                    <span>DOI</span>
                                                    <ArrowUpRightIcon className="h-3 w-3" />
                                                </a>
                                            )}
                                            {pub.code && (
                                                <a
                                                    href={pub.code}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-surface-subtle border border-border-subtle text-neutral-700 hover:border-accent/60 hover:text-accent hover:bg-accent-soft transition-colors"
                                                >
                                                    {messages.publications.code}
                                                </a>
                                            )}
                                            {pub.abstract && (
                                                <button
                                                    type="button"
                                                    onClick={() => setExpandedAbstractId(expandedAbstractId === pub.id ? null : pub.id)}
                                                    className={cn(
                                                        'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer',
                                                        expandedAbstractId === pub.id
                                                            ? 'bg-accent text-white border-accent'
                                                            : 'bg-surface-subtle border-border-subtle text-neutral-700 hover:border-accent/60 hover:text-accent hover:bg-accent-soft'
                                                    )}
                                                >
                                                    <DocumentTextIcon className="h-3.5 w-3.5 mr-1.5" />
                                                    {messages.publications.abstract}
                                                </button>
                                            )}
                                            {pub.bibtex && (
                                                <button
                                                    type="button"
                                                    onClick={() => setExpandedBibtexId(expandedBibtexId === pub.id ? null : pub.id)}
                                                    className={cn(
                                                        'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer',
                                                        expandedBibtexId === pub.id
                                                            ? 'bg-accent text-white border-accent'
                                                            : 'bg-surface-subtle border-border-subtle text-neutral-700 hover:border-accent/60 hover:text-accent hover:bg-accent-soft'
                                                    )}
                                                >
                                                    <BookOpenIcon className="h-3.5 w-3.5 mr-1.5" />
                                                    {messages.publications.bibtex}
                                                </button>
                                            )}
                                        </div>

                                        <AnimatePresence>
                                            {expandedAbstractId === pub.id && pub.abstract ? (
                                                <motion.div
                                                    key="abstract"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden mt-4"
                                                >
                                                    <div className="bg-surface-subtle rounded-lg p-4 border border-border-subtle">
                                                        <p className="text-sm text-neutral-700 leading-relaxed">
                                                            {pub.abstract}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ) : null}
                                            {expandedBibtexId === pub.id && pub.bibtex ? (
                                                <motion.div
                                                    key="bibtex"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden mt-4"
                                                >
                                                    <div className="relative bg-surface-subtle rounded-lg p-4 border border-border-subtle">
                                                        <pre className="text-xs text-neutral-700 overflow-x-auto whitespace-pre-wrap font-mono pr-20">
                                                            {pub.bibtex}
                                                        </pre>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopyBibtex(pub.id, pub.bibtex)}
                                                            className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface text-neutral-600 hover:text-accent border border-border-subtle hover:border-accent/60 text-xs font-medium shadow-sm transition-colors cursor-pointer"
                                                            title={messages.common.copyToClipboard}
                                                        >
                                                            {copiedId === pub.id ? (
                                                                <>
                                                                    <CheckIcon className="h-3.5 w-3.5 text-accent" />
                                                                    <span className="text-accent">{messages.common.copied}</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ClipboardDocumentIcon className="h-3.5 w-3.5" />
                                                                    <span>{messages.common.copy}</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ) : null}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })
                )}
            </div>
        </motion.div>
    );
}
