'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { useMessages } from '@/lib/i18n/useMessages';

interface AboutProps {
    content: string;
    title?: string;
}

export default function About({ content, title }: AboutProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.about;

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <div className="flex items-baseline justify-between border-b border-border-subtle pb-2.5 mb-5">
                <h2 className="text-[1.6rem] font-serif font-semibold tracking-tight text-primary">
                    {resolvedTitle}
                </h2>
            </div>
            <div className="text-[0.965rem] text-neutral-700 leading-[1.82] space-y-4">
                <ReactMarkdown
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                        h1: ({ children }) => <h1 className="text-3xl font-serif font-semibold text-primary mt-8 mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-serif font-semibold text-primary mt-8 mb-4 border-b border-border-subtle pb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-semibold text-primary mt-6 mb-3">{children}</h3>,
                        p: ({ children }) => (
                            <p className="first:text-[1.03rem] first:text-primary/95 text-pretty">
                                {children}
                            </p>
                        ),
                        ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 ml-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 ml-2">{children}</ol>,
                        li: ({ children }) => <li>{children}</li>,
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
                        em: ({ children }) => <em className="italic text-neutral-600">{children}</em>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </motion.section>
    );
}
