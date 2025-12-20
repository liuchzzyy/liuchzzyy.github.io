'use client';

import { motion } from 'framer-motion';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

export default function News({ items, title = 'News' }: NewsProps) {
    // sort items by date descending (newest first)
    const sortedItems = items.slice().sort((a, b) => {
        const ta = new Date(a.date).getTime();
        const tb = new Date(b.date).getTime();
        return tb - ta;
    });

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>
            <div className="space-y-4">
                {sortedItems.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all duration-200">
                        <span className="text-sm font-medium text-accent bg-accent/10 px-3 py-1 rounded-md shrink-0">{item.date}</span>
                        <p className="text-base text-neutral-700 dark:text-neutral-300">{item.content}</p>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
