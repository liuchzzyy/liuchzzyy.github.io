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
            <header className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-primary mb-3">{config.title}</h1>
                {config.description && (
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{config.description}</p>
                )}
            </header>
            <div className="space-y-4">
                {sortedItems.map((item) => (
                    <article
                        key={`${item.date}-${item.content}`}
                        className="flex items-start space-x-4 border-l-2 border-accent/30 pl-4 py-1"
                    >
                        <time className="text-xs text-neutral-500 mt-1 w-16 flex-shrink-0">{item.date}</time>
                        <div className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            <ReactMarkdown
                                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                                components={{ p: ({ children }) => <span>{children}</span> }}
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
