'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
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
                        key={`${item.date}-${item.content.substring(0, 20)}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex flex-col gap-4">
                            <span className="text-2xl font-medium text-accent bg-accent/10 px-3 py-1 rounded-md shrink-0 w-fit">
                                {item.date}
                            </span>
                            <div className="flex flex-col md:flex-row gap-6">
                                {item.image && (
                                    <div className="w-full md:w-48 flex-shrink-0">
                                        <div className="aspect-video md:aspect-[4/3] relative rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                            <Image
                                                src={`/docs/public/papers/${item.image}`}
                                                alt={`${item.date} - ${item.content}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="flex-grow flex flex-col justify-center">
                                    <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-700 dark:text-neutral-300 leading-relaxed`}>
                                        {item.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
