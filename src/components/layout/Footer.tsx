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
    <footer className="border-t border-border-subtle bg-surface-subtle/50 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-neutral-500">
          <p className="font-mono tracking-tight">
            {messages.footer.lastUpdated}: {resolvedLastUpdated}
          </p>
          <p className="flex items-center gap-3">
            <a
              href="/rss/feed.xml"
              className="inline-flex items-center gap-1 hover:text-accent transition-colors"
              title="RSS Feed"
              aria-label="RSS Feed"
            >
              <Rss className="h-3.5 w-3.5" aria-hidden="true" />
              <span>RSS</span>
            </a>
            <span className="text-border-strong" aria-hidden="true">·</span>
            <a
              href="https://github.com/xyjoey/PRISM"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              {messages.footer.builtWithPrism}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
