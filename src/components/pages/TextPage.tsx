'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { TextPageConfig } from '@/types/page';
import { useLocaleStore } from '@/lib/stores/localeStore';

interface TextPageProps {
    config: TextPageConfig;
    content: string;
    embedded?: boolean;
}

export default function TextPage({ config, content, embedded = false }: TextPageProps) {
    const locale = useLocaleStore((state) => state.locale);
    const isZh = locale.startsWith('zh');

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className={embedded ? '' : 'max-w-3xl mx-auto'}
        >
            <header className="mb-8 border-b border-border-subtle pb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className={`${embedded ? 'text-2xl' : 'text-3xl sm:text-4xl'} font-serif font-semibold tracking-tight text-primary mb-2`}>
                        {config.title}
                    </h1>
                    {config.description && (
                        <p className={`${embedded ? 'text-base' : 'text-[1.02rem]'} text-neutral-600 max-w-2xl leading-relaxed`}>
                            {config.description}
                        </p>
                    )}
                </div>
                {!embedded && config.pdf && (
                    <a
                        href={config.pdf}
                        download={config.pdf_filename || 'CV.pdf'}
                        className="no-print self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border-subtle bg-surface hover:bg-accent-soft hover:border-accent/60 hover:text-accent text-xs font-medium text-neutral-700 transition-colors"
                    >
                        <ArrowDownTrayIcon className="h-3.5 w-3.5 text-accent" />
                        <span>{isZh ? '下载 PDF' : 'Download PDF'}</span>
                    </a>
                )}
            </header>

            <div className="editorial-card rounded-xl p-6 sm:p-8 text-[0.95rem] text-neutral-700 leading-[1.8]">
                <ReactMarkdown
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                        h1: ({ children }) => <h1 className="text-2xl font-serif font-semibold text-primary mt-2 mb-4">{children}</h1>,
                        h2: ({ children }) => (
                            <h2 className="text-xl font-serif font-semibold text-primary mt-8 first:mt-0 mb-3.5 border-b border-border-subtle pb-2">
                                {children}
                            </h2>
                        ),
                        h3: ({ children }) => <h3 className="text-base font-semibold text-primary mt-5 mb-2">{children}</h3>,
                        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-outside mb-4 space-y-1.5 ml-5">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-outside mb-4 space-y-1.5 ml-5">{children}</ol>,
                        li: ({ children }) => <li className="pl-1">{children}</li>,
                        a: ({ ...props }) => (
                            <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent font-medium underline decoration-accent/40 underline-offset-4 hover:decoration-accent transition-colors"
                            />
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-accent pl-4 italic my-4 text-neutral-600">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="font-serif italic text-neutral-600">{children}</em>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </motion.div>
    );
}
