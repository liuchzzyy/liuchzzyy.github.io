'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { Rss } from 'lucide-react';

interface FooterProps {
  lastUpdatedEn?: string;
  lastUpdatedZh?: string;
}

export default function Footer({ lastUpdatedEn, lastUpdatedZh }: FooterProps) {
  const { t, language } = useTranslation();
  const lastUpdated = language === 'zh' ? lastUpdatedZh : lastUpdatedEn;
  
  return (
    <footer className="border-t border-neutral-200/50 bg-neutral-50/50 dark:bg-neutral-900/50 dark:border-neutral-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-neutral-500">
            {t.common.lastUpdated} {lastUpdated || new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <a 
                href="/rss/publications.xml" 
                className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 flex items-center gap-1"
                title="Publications RSS Feed"
              >
                <Rss className="w-3 h-3" />
                Publications
              </a>
              <a 
                href="/rss/news.xml" 
                className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 flex items-center gap-1"
                title="News RSS Feed"
              >
                <Rss className="w-3 h-3" />
                News
              </a>
            </div>
            <p className="text-xs text-neutral-500 flex items-center">
              <a href="https://github.com/xyjoey/PRISM" target="_blank" rel="noopener noreferrer">
                Built with PRISM
              </a>
              <span className="ml-2">🚀</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}