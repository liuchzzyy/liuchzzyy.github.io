'use client';

import { motion } from 'framer-motion';
import { ListPageConfig } from '@/types/page';

export default function ListPage({ config, embedded = false }: { config: ListPageConfig; embedded?: boolean }) {
    // sort items by date descending (newest first)
    const sortedItems = config.items.slice().sort((a, b) => {
        const ta = new Date(a.date).getTime();
        const tb = new Date(b.date).getTime();
        return tb - ta;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-4" : "mb-8"}>
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 max-w-2xl`}>
                        {config.description}
                    </p>
                )}
            </div>

            <div className="space-y-6">
                {sortedItems.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex items-start space-x-4">
                            <span className="text-sm font-medium text-accent bg-accent/10 px-3 py-1 rounded-md shrink-0">
                                {item.date}
                            </span>
                            <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-700 dark:text-neutral-300 leading-relaxed`}>
                                {item.content}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
