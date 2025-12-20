'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CardPageConfig } from '@/types/page';

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
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

            <div className={`grid ${embedded ? "gap-4" : "gap-6"}`}>
                {config.items.map((item, index) => {
                    const cardContent = (
                        <div className={`flex flex-col h-full bg-white dark:bg-neutral-900 ${embedded ? "p-4" : "p-6"} rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}>
                            
                            {/* Image Rendering */}
                            {item.image && (
                                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary group-hover:text-accent transition-colors`}>
                                    {item.title}
                                </h3>
                                {item.date && (
                                    <span className="text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded shrink-0 ml-2">
                                        {item.date}
                                    </span>
                                )}
                            </div>
                            {item.subtitle && (
                                <p className={`${embedded ? "text-sm" : "text-base"} text-accent font-medium mb-3`}>{item.subtitle}</p>
                            )}
                            {item.content && (
                                <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 leading-relaxed flex-grow`}>
                                    {item.content}
                                </p>
                            )}
                            {item.tags && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1 rounded border border-neutral-100 dark:border-neutral-800">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    );

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                            className="h-full"
                        >
                            {item.link ? (
                                <Link href={item.link} className="block h-full">
                                    {cardContent}
                                </Link>
                            ) : (
                                <div className="h-full">
                                    {cardContent}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
