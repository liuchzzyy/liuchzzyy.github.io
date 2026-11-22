'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { useMessages } from '@/lib/i18n/useMessages';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function News({ items, title, enableOnePageMode = false }: NewsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.news;
    const viewAllHref = enableOnePageMode ? '/#news' : '/news';

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <div className="flex items-baseline justify-between border-b border-border-subtle pb-2.5 mb-5">
                <h2 className="text-[1.6rem] font-serif font-semibold tracking-tight text-primary">
                    {resolvedTitle}
                </h2>
                <Link
                    href={viewAllHref}
                    prefetch={true}
                    className="group inline-flex items-center gap-1 text-accent hover:text-accent-dark text-sm font-medium transition-colors"
                >
                    <span>{messages.home.viewAll}</span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">→</span>
                </Link>
            </div>

            <div className="relative border-l border-border-subtle ml-2 pl-5 space-y-4">
                {items.map((item, index) => (
                    <div key={index} className="relative flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-4">
                        <span
                            className="absolute -left-[25px] top-[7px] w-2 h-2 rounded-full bg-accent ring-4 ring-background"
                            aria-hidden="true"
                        />
                        <time className="font-mono text-xs text-accent bg-accent-soft px-2 py-0.5 rounded w-fit flex-shrink-0">
                            {item.date}
                        </time>
                        <div className="text-[0.9rem] text-neutral-700 leading-relaxed">
                            <ReactMarkdown
                                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                                components={{
                                    p: ({ children }) => <span>{children}</span>,
                                    em: ({ children }) => <em className="font-serif italic text-primary">{children}</em>,
                                    a: ({ ...props }) => (
                                        <a
                                            {...props}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
                                        />
                                    ),
                                }}
                            >
                                {item.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
