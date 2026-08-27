'use client';

import { useLocaleStore } from '@/lib/stores/localeStore';
import { useMessages } from '@/lib/i18n/useMessages';
import { Rss } from 'lucide-react';

interface FooterProps {
  lastUpdated?: string;
  lastUpdatedByLocale?: Record<string, string | undefined>;
  defaultLocale?: string;
}

export default function Footer({ lastUpdated, lastUpdatedByLocale, defaultLocale = 'en' }: FooterProps) {
  const locale = useLocaleStore((state) => state.locale);
  const messages = useMessages();

  const resolvedLastUpdated =
    lastUpdatedByLocale?.[locale] ||
    (defaultLocale ? lastUpdatedByLocale?.[defaultLocale] : undefined) ||
    lastUpdated ||
    new Date().toLocaleDateString(locale || 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <footer className="border-t border-neutral-200/50 bg-neutral-50/50 dark:bg-neutral-900/50 dark:border-neutral-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-neutral-500">
            {messages.footer.lastUpdated}: {resolvedLastUpdated}
          </p>
          <p className="text-xs text-neutral-500 flex items-center">
            <a
              href="/rss/feed.xml"
              className="mr-3 inline-flex items-center gap-1 hover:text-neutral-700 dark:hover:text-neutral-300"
              title="RSS Feed"
              aria-label="RSS Feed"
            >
              <Rss className="h-3.5 w-3.5" aria-hidden="true" />
              RSS
            </a>
            <a href="https://github.com/liuchzzyy/PRISM" target="_blank" rel="noopener noreferrer">
              {messages.footer.builtWithPrism}
            </a>
            <span className="ml-2">🚀</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
