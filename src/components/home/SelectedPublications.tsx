'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRightIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from '@/components/publications/FormattedBibTeXText';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title, enableOnePageMode = false }: SelectedPublicationsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedPublications;
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopyBibtex = async (pub: Publication) => {
        if (!pub.bibtex) return;
        try {
            await navigator.clipboard.writeText(pub.bibtex);
            setCopiedId(pub.id);
            setTimeout(() => {
                setCopiedId((prev) => (prev === pub.id ? null : prev));
            }, 1800);
        } catch {
            // Clipboard unavailable
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="flex items-baseline justify-between border-b border-border-subtle pb-2.5 mb-5">
                <h2 className="text-[1.6rem] font-serif font-semibold tracking-tight text-primary">
                    {resolvedTitle}
                </h2>
                <Link
                    href={enableOnePageMode ? '/#publications' : '/publications'}
                    prefetch={true}
                    className="group inline-flex items-center gap-1 text-accent hover:text-accent-dark text-sm font-medium transition-colors"
                >
                    <span>{messages.home.viewAll}</span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">→</span>
                </Link>
            </div>
            <p className="text-xs text-neutral-500 -mt-3 mb-4">
                {messages.publications.authorLegend}
            </p>

            <div className="space-y-4">
                {publications.map((pub, index) => {
                    const paperUrl = pub.doi ? `https://doi.org/${pub.doi}` : pub.url;
                    const isPreprint = pub.type === 'preprint' || pub.description?.toLowerCase().includes('preprint');

                    return (
                        <motion.article
                            key={pub.id}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.08 * index }}
                            className="editorial-card group rounded-xl p-4 sm:p-5"
                        >
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
                                {pub.preview && (
                                    <div className="w-full sm:w-44 flex-shrink-0">
                                        <div className="aspect-[16/10] sm:aspect-[4/3] relative rounded-lg overflow-hidden border border-border-subtle bg-white">
                                            <Image
                                                src={`/papers/${pub.preview}`}
                                                alt={`${pub.title} graphical abstract`}
                                                fill
                                                className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-[1.02]"
                                                sizes="(max-width: 640px) 100vw, 176px"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    {/* Venue & Year Metadata Strip */}
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5">
                                        {(pub.journal || pub.conference) && (
                                            <span className="font-serif italic text-[0.86rem] text-accent font-medium">
                                                {pub.journal || pub.conference}
                                            </span>
                                        )}
                                        <span className="font-mono text-[0.75rem] text-neutral-500">
                                            {pub.year}
                                        </span>
                                        {isPreprint && (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[0.68rem] font-medium bg-surface-subtle text-neutral-600 border border-border-subtle">
                                                Preprint
                                            </span>
                                        )}
                                    </div>

                                    {/* Paper Title */}
                                    <h3 className="text-[1.02rem] font-semibold text-primary mb-2 leading-snug">
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
                                    <p className="text-[0.8125rem] text-neutral-600 leading-relaxed mb-3">
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

                                    {/* Subtle Action Pills */}
                                    {(paperUrl || pub.bibtex) && (
                                        <div className="flex flex-wrap items-center gap-2">
                                            {paperUrl && (
                                                <a
                                                    href={paperUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[0.74rem] font-medium bg-surface-subtle border border-border-subtle text-neutral-700 hover:border-accent/60 hover:text-accent hover:bg-accent-soft transition-colors"
                                                >
                                                    <span>DOI</span>
                                                    <ArrowUpRightIcon className="h-3 w-3" />
                                                </a>
                                            )}
                                            {pub.bibtex && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopyBibtex(pub)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[0.74rem] font-medium bg-surface-subtle border border-border-subtle text-neutral-700 hover:border-accent/60 hover:text-accent hover:bg-accent-soft transition-colors cursor-pointer"
                                                >
                                                    {copiedId === pub.id ? (
                                                        <>
                                                            <CheckIcon className="h-3 w-3 text-accent" />
                                                            <span className="text-accent">{messages.common.copied}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ClipboardDocumentIcon className="h-3 w-3" />
                                                            <span>{messages.publications.bibtex}</span>
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.article>
                    );
                })}
            </div>
        </motion.section>
    );
}
