'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import {
    EnvelopeIcon,
    AcademicCapIcon,
    HeartIcon,
    MapPinIcon,
    ClipboardDocumentIcon,
    CheckIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import {
    MapPinIcon as MapPinSolidIcon,
    EnvelopeIcon as EnvelopeSolidIcon,
    HeartIcon as HeartSolidIcon,
} from '@heroicons/react/24/solid';
import { Github } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useMessages } from '@/lib/i18n/useMessages';
import { cn } from '@/lib/utils';

// Custom ORCID icon component
const OrcidIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
    </svg>
);

const XiaohongshuIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="4" y="4" width="16" height="16" rx="3" fill="currentColor" />
        <text
            x="12"
            y="16"
            fontSize="10"
            fontWeight="bold"
            fill="var(--surface)"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
        >
            书
        </text>
    </svg>
);

interface ProfileProps {
    author: SiteConfig['author'];
    social: SiteConfig['social'];
    features: SiteConfig['features'];
    researchInterests?: string[];
}

export default function Profile({ author, social, features, researchInterests }: ProfileProps) {
    const messages = useMessages();

    const [hasLiked, setHasLiked] = useState(false);
    const [showThanks, setShowThanks] = useState(false);
    const [activePopover, setActivePopover] = useState<'email' | 'address' | null>(null);
    const [emailCopied, setEmailCopied] = useState(false);
    const contactRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!features.enable_likes) return;

        const userHasLiked = localStorage.getItem('cheng-liu-website-user-liked');
        if (userHasLiked === 'true') {
            setHasLiked(true);
        }
    }, [features.enable_likes]);

    useEffect(() => {
        if (!activePopover) return;

        const handleOutsideClick = (event: MouseEvent) => {
            if (contactRef.current && !contactRef.current.contains(event.target as Node)) {
                setActivePopover(null);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setActivePopover(null);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [activePopover]);

    const handleLike = () => {
        const newLikedState = !hasLiked;
        setHasLiked(newLikedState);

        if (newLikedState) {
            localStorage.setItem('cheng-liu-website-user-liked', 'true');
            setShowThanks(true);
            setTimeout(() => setShowThanks(false), 2000);
        } else {
            localStorage.removeItem('cheng-liu-website-user-liked');
            setShowThanks(false);
        }
    };

    const handleCopyEmail = async () => {
        if (!social.email) return;
        try {
            await navigator.clipboard.writeText(social.email);
            setEmailCopied(true);
            setTimeout(() => setEmailCopied(false), 1800);
        } catch {
            // Clipboard may be unavailable in restricted contexts
        }
    };

    const externalLinks = [
        ...(social.google_scholar ? [{
            name: 'Google Scholar',
            href: social.google_scholar,
            icon: AcademicCapIcon,
        }] : []),
        ...(social.orcid ? [{
            name: 'ORCID',
            href: social.orcid,
            icon: OrcidIcon,
        }] : []),
        ...(social.github ? [{
            name: 'GitHub',
            href: social.github,
            icon: Github,
        }] : []),
        ...(social.xiaohongshu ? [{
            name: 'Xiaohongshu',
            href: social.xiaohongshu,
            icon: XiaohongshuIcon,
        }] : []),
    ];

    const iconBtnClass =
        'inline-flex items-center justify-center w-9 h-9 rounded-full border border-border-subtle bg-surface text-neutral-600 hover:border-accent/60 hover:text-accent hover:bg-accent-soft transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50';

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:sticky lg:top-24"
        >
            {/* Profile Portrait Frame */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-60 lg:h-60 mx-auto mb-6 p-1.5 rounded-2xl bg-surface border border-border-subtle shadow-[0_14px_34px_-16px_rgba(22,32,50,0.22)] hover:border-border-strong transition-all duration-300">
                <div className="w-full h-full rounded-[0.8rem] overflow-hidden bg-surface-subtle">
                    <Image
                        src={author.avatar}
                        alt={author.name}
                        width={256}
                        height={256}
                        className="w-full h-full object-cover object-[32%_center] transition-transform duration-500 hover:scale-[1.03]"
                        priority
                    />
                </div>
            </div>

            {/* Identity & Affiliation */}
            <div className="text-center mb-5 px-2">
                <h1 className="text-[1.85rem] font-serif font-semibold tracking-tight text-primary leading-tight">
                    {author.name}
                </h1>
                <div className="w-10 h-[1.5px] bg-accent/60 mx-auto my-3 rounded-full" aria-hidden="true" />
                <p className="text-[0.95rem] text-accent font-medium mb-2">
                    {author.title}
                </p>
                <p className="text-[0.84rem] text-neutral-600 leading-relaxed">
                    {author.institution.split(/\r?\n/).map((line, index) => (
                        <span key={`${line}-${index}`} className="block">{line}</span>
                    ))}
                </p>
            </div>

            {/* Contact & Academic Links + Centered Inline Popover */}
            <div ref={contactRef} className="mb-6">
                <div className="flex flex-wrap justify-center gap-2.5 px-2">
                    {social.email && (
                        <button
                            type="button"
                            onClick={() => setActivePopover((prev) => (prev === 'email' ? null : 'email'))}
                            className={cn(
                                iconBtnClass,
                                activePopover === 'email' && 'border-accent text-accent bg-accent-soft'
                            )}
                            aria-label={messages.profile.email}
                            aria-expanded={activePopover === 'email'}
                            title={messages.profile.email}
                        >
                            {activePopover === 'email' ? (
                                <EnvelopeSolidIcon className="h-[18px] w-[18px]" />
                            ) : (
                                <EnvelopeIcon className="h-[18px] w-[18px]" />
                            )}
                        </button>
                    )}

                    {(social.location || social.location_details) && (
                        <button
                            type="button"
                            onClick={() => setActivePopover((prev) => (prev === 'address' ? null : 'address'))}
                            className={cn(
                                iconBtnClass,
                                activePopover === 'address' && 'border-accent text-accent bg-accent-soft'
                            )}
                            aria-label={messages.profile.location}
                            aria-expanded={activePopover === 'address'}
                            title={messages.profile.location}
                        >
                            {activePopover === 'address' ? (
                                <MapPinSolidIcon className="h-[18px] w-[18px]" />
                            ) : (
                                <MapPinIcon className="h-[18px] w-[18px]" />
                            )}
                        </button>
                    )}

                    {externalLinks.map((link) => {
                        const IconComponent = link.icon;
                        return (
                            <a
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={iconBtnClass}
                                aria-label={link.name}
                                title={link.name}
                            >
                                <IconComponent className="h-[18px] w-[18px]" />
                            </a>
                        );
                    })}
                </div>

                {/* Cleanly contained popover directly beneath icons: never clips viewport or covers author name */}
                <AnimatePresence mode="wait">
                    {activePopover === 'email' && social.email && (
                        <motion.div
                            key="email-popover"
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.18 }}
                            className="mt-3 mx-auto max-w-[310px] rounded-xl bg-surface border border-border-strong p-4 shadow-md text-center relative"
                        >
                            <button
                                type="button"
                                onClick={() => setActivePopover(null)}
                                className="absolute top-2.5 right-2.5 p-1 rounded-md text-neutral-400 hover:text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
                                aria-label="Close"
                            >
                                <XMarkIcon className="h-3.5 w-3.5" />
                            </button>
                            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">
                                {messages.profile.email}
                            </p>
                            <p className="text-sm font-mono text-primary break-all mb-3">
                                {social.email}
                            </p>
                            <div className="flex items-center justify-center gap-2">
                                <a
                                    href={`mailto:${social.email}`}
                                    className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent-dark text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                >
                                    <EnvelopeIcon className="h-3.5 w-3.5" />
                                    <span>{messages.profile.sendEmail}</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={handleCopyEmail}
                                    title={messages.common.copyToClipboard}
                                    className="inline-flex items-center gap-1.5 border border-border-subtle bg-surface-subtle hover:border-border-strong text-primary px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                                >
                                    {emailCopied ? (
                                        <>
                                            <CheckIcon className="h-3.5 w-3.5 text-accent" />
                                            <span>{messages.common.copied}</span>
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
                    )}

                    {activePopover === 'address' && (social.location || social.location_details) && (
                        <motion.div
                            key="address-popover"
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.18 }}
                            className="mt-3 mx-auto max-w-[310px] rounded-xl bg-surface border border-border-strong p-4 shadow-md text-center relative"
                        >
                            <button
                                type="button"
                                onClick={() => setActivePopover(null)}
                                className="absolute top-2.5 right-2.5 p-1 rounded-md text-neutral-400 hover:text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
                                aria-label="Close"
                            >
                                <XMarkIcon className="h-3.5 w-3.5" />
                            </button>
                            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1.5">
                                {messages.profile.workAddress}
                            </p>
                            <div className="text-xs text-neutral-700 leading-relaxed space-y-0.5 mb-3">
                                {social.location_details?.map((line, i) => (
                                    <p key={i} className="break-words">{line}</p>
                                ))}
                            </div>
                            {social.location_url && (
                                <a
                                    href={social.location_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-1.5 bg-accent hover:bg-accent-dark text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                >
                                    <MapPinIcon className="h-3.5 w-3.5" />
                                    <span>{messages.profile.googleMap}</span>
                                </a>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Research Interests Card */}
            {researchInterests && researchInterests.length > 0 && (
                <div className="editorial-card rounded-xl p-5 mb-5">
                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-primary mb-3.5">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
                        <span>{messages.profile.researchInterests}</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                        {researchInterests.map((interest, index) => (
                            <span
                                key={index}
                                className="inline-block text-[0.78rem] leading-snug text-neutral-700 bg-surface-subtle border border-border-subtle/85 px-2.5 py-1 rounded-md"
                            >
                                <ReactMarkdown
                                    components={{ p: ({ children }) => <>{children}</> }}
                                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                                >
                                    {interest}
                                </ReactMarkdown>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Subtle Appreciation Button */}
            {features.enable_likes && (
                <div className="flex justify-center">
                    <div className="relative">
                        <motion.button
                            onClick={handleLike}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            className={cn(
                                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer',
                                hasLiked
                                    ? 'bg-accent-soft border-accent/40 text-accent'
                                    : 'bg-surface border-border-subtle text-neutral-600 hover:border-accent/50 hover:text-accent'
                            )}
                        >
                            {hasLiked ? (
                                <HeartSolidIcon className="h-3.5 w-3.5" />
                            ) : (
                                <HeartIcon className="h-3.5 w-3.5" />
                            )}
                            <span>{hasLiked ? messages.profile.liked : messages.profile.like}</span>
                        </motion.button>

                        <AnimatePresence>
                            {showThanks && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6, scale: 0.92 }}
                                    animate={{ opacity: 1, y: -8, scale: 1 }}
                                    exit={{ opacity: 0, y: -14, scale: 0.92 }}
                                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-primary text-background px-3 py-1.5 rounded-lg text-xs font-medium shadow-md whitespace-nowrap"
                                >
                                    {messages.profile.thanks}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
