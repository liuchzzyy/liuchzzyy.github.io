'use client';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import type { ListPageConfig } from '@/types/page';

interface ListPageProps {
    config: ListPageConfig;
    embedded?: boolean;
}

export default function ListPage({ config, embedded = false }: ListPageProps) {
    const sortedItems = config.items.slice().sort((left, right) => right.date.localeCompare(left.date));

    return (
        <section className={embedded ? '' : 'max-w-4xl mx-auto'}>
            <header className="mb-8 border-b border-border-subtle pb-5">
                <h1 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-primary mb-2">
                    {config.title}
                </h1>
                {config.description && (
                    <p className="text-neutral-600 text-[1.02rem] leading-relaxed">{config.description}</p>
                )}
            </header>
            <div className="relative border-l border-border-subtle ml-2 pl-6 space-y-5">
                {sortedItems.map((item) => (
                    <article
                        key={`${item.date}-${item.content}`}
                        className="relative flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4"
                    >
                        <span
                            className="absolute -left-[29px] top-[7px] w-2 h-2 rounded-full bg-accent ring-4 ring-background"
                            aria-hidden="true"
                        />
                        <time className="font-mono text-xs text-accent bg-accent-soft px-2 py-0.5 rounded w-fit flex-shrink-0">
                            {item.date}
                        </time>
                        <div className="text-[0.94rem] text-neutral-700 leading-relaxed">
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
                    </article>
                ))}
            </div>
        </section>
    );
}
