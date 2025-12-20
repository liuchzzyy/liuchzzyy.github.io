'use client';

import { motion } from 'framer-motion';
import { NewsItem } from '@/types/page';
import { useLanguageStore } from '@/lib/stores/languageStore';

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

const titleTranslations: Record<string, Record<string, string>> = {
    'News': { zh: '新闻', en: 'News' },
};

export default function News({ items, title = 'News' }: NewsProps) {
    const { language } = useLanguageStore();
    
    const getTranslatedTitle = (t: string): string => {
        if (titleTranslations[t] && titleTranslations[t][language]) {
            return titleTranslations[t][language];
        }
        return t;
    };
    
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
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{getTranslatedTitle(title)}</h2>
            <div className="space-y-4">
                {sortedItems.map((item) => (
                    <div key={`${item.date}-${item.content.substring(0, 20)}`} className="p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all duration-200">
                        <div className="flex flex-col space-y-3">
                            <span className="text-2xl font-medium text-accent bg-accent/10 px-3 py-1 rounded-md w-fit">{item.date}</span>
                            <p className="text-base text-neutral-700 dark:text-neutral-300">{item.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
