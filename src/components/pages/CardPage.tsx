'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { CardPageConfig } from '@/types/page';

const markdownComponents = {
    p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }: React.ComponentProps<'ul'>) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
    ol: ({ children }: React.ComponentProps<'ol'>) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
    li: ({ children }: React.ComponentProps<'li'>) => <li className="mb-1">{children}</li>,
    a: ({ ...props }) => (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-medium underline decoration-accent/40 underline-offset-4 hover:decoration-accent transition-colors"
        />
    ),
    blockquote: ({ children }: React.ComponentProps<'blockquote'>) => (
        <blockquote className="border-l-2 border-accent pl-4 italic my-4 text-neutral-600">
            {children}
        </blockquote>
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-semibold text-primary">{children}</strong>,
    em: ({ children }: React.ComponentProps<'em'>) => <em className="font-serif italic">{children}</em>,
    code: ({ children }: React.ComponentProps<'code'>) => (
        <code className="px-1.5 py-0.5 rounded bg-surface-subtle border border-border-subtle font-mono text-[0.88em]">{children}</code>
    ),
};

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
        >
            <header className={embedded ? 'mb-5 border-b border-border-subtle pb-3' : 'mb-8 border-b border-border-subtle pb-5'}>
                <h1 className={`${embedded ? 'text-2xl' : 'text-3xl sm:text-4xl'} font-serif font-semibold tracking-tight text-primary mb-2`}>
                    {config.title}
                </h1>
                {config.description && (
                    <div className={`${embedded ? 'text-base' : 'text-[1.02rem]'} text-neutral-600 max-w-2xl leading-relaxed`}>
                        <ReactMarkdown components={markdownComponents} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                            {config.description}
                        </ReactMarkdown>
                    </div>
                )}
            </header>

            <div className={`grid ${embedded ? 'gap-4' : 'gap-5'}`}>
                {config.items.map((item, index) => (
                    <motion.article
                        key={index}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.06 * index }}
                        className={`editorial-card ${embedded ? 'p-4' : 'p-6'} rounded-xl`}
                    >
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start mb-2">
                            <h3 className={`${embedded ? 'text-lg' : 'text-[1.12rem]'} font-semibold text-primary leading-snug`}>
                                {item.title}
                            </h3>
                            {item.date && (
                                <span className="self-start sm:self-auto whitespace-nowrap font-mono text-xs text-accent bg-accent-soft px-2.5 py-1 rounded-md">
                                    {item.date}
                                </span>
                            )}
                        </div>
                        {item.subtitle && (
                            <p className={`${embedded ? 'text-sm' : 'text-[0.94rem]'} font-serif italic text-accent font-medium mb-3`}>
                                {item.subtitle}
                            </p>
                        )}
                        {item.content && (
                            <div className={`${embedded ? 'text-sm' : 'text-[0.94rem]'} text-neutral-700 leading-relaxed`}>
                                <ReactMarkdown components={markdownComponents} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                                    {item.content}
                                </ReactMarkdown>
                            </div>
                        )}
                        {item.tags && (
                            <div className="flex flex-wrap gap-1.5 mt-4">
                                {item.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs text-neutral-600 bg-surface-subtle px-2.5 py-0.5 rounded-md border border-border-subtle"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </motion.article>
                ))}
            </div>
        </motion.div>
    );
}
