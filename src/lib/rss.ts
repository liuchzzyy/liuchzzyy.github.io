import { Feed } from 'feed';
import { getConfig } from './config';
import { parseBibTeX } from './bibtexParser';
import { getBibtexContent, getTomlContent } from './content';
import { Publication } from '@/types/publication';
import { NewsItem } from '@/types/page';

// Define unified feed item type
interface UnifiedFeedItem {
  type: 'publication' | 'news';
  date: Date;
  data: Publication | NewsItem;
}

export function generateUnifiedFeed(language: string = 'en'): string {
  const config = getConfig(language);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://liuchzzyy.github.io';
  
  const feed = new Feed({
    title: config.site.title,
    description: `Latest updates from ${config.author.name}`,
    id: `${siteUrl}/`,
    link: `${siteUrl}/`,
    language: language,
    image: `${siteUrl}${config.author.avatar}`,
    favicon: `${siteUrl}${config.site.favicon}`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${config.author.name}`,
    updated: new Date(),
    generator: 'PRISM RSS Generator',
    feedLinks: {
      rss2: `${siteUrl}/rss/feed.xml`,
      atom: `${siteUrl}/rss/feed-atom.xml`,
    },
    author: {
      name: config.author.name,
      email: config.social.email,
    },
  });

  // Collect all items with their types
  const allItems: UnifiedFeedItem[] = [];

  // Get publications
  const bibtex = getBibtexContent('publications.bib', language);
  const publications = parseBibTeX(bibtex);
  publications.forEach((pub) => {
    const pubDate = new Date(pub.year, pub.month ? parseInt(pub.month) - 1 : 0);
    allItems.push({
      type: 'publication',
      date: pubDate,
      data: pub,
    });
  });

  // Get news items
  try {
    const newsContent = getTomlContent('news.toml', language) as { items?: NewsItem[] };
    const newsItems = newsContent.items || [];
    newsItems.forEach((item) => {
      allItems.push({
        type: 'news',
        date: new Date(item.date),
        data: item,
      });
    });
  } catch {
    console.log('No news items found or error reading news.toml');
  }

  // Sort all items by date (newest first)
  allItems.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Add items to feed (limit to most recent 20)
  allItems.slice(0, 20).forEach((item, index) => {
    if (item.type === 'publication') {
      const pub = item.data as Publication;
      const authorNames = pub.authors.map(a => a.name).join(', ');
      
      let description = `<p><strong>Type:</strong> Publication</p>`;
      description += `<p><strong>Authors:</strong> ${authorNames}</p>`;
      
      if (pub.abstract) {
        description += `<p>${pub.abstract}</p>`;
      }
      
      if (pub.journal) {
        description += `<p><strong>Journal:</strong> ${pub.journal}</p>`;
      } else if (pub.conference) {
        description += `<p><strong>Conference:</strong> ${pub.conference}</p>`;
      }
      
      if (pub.doi) {
        description += `<p><strong>DOI:</strong> <a href="https://doi.org/${pub.doi}">${pub.doi}</a></p>`;
      }

      feed.addItem({
        title: `[Publication] ${pub.title}`,
        id: pub.id,
        link: `${siteUrl}/publications/#${pub.id}`,
        description: description,
        content: description,
        author: [
          {
            name: config.author.name,
            email: config.social.email,
          },
        ],
        date: item.date,
        category: [{ name: 'publication' }, ...(pub.keywords?.map(k => ({ name: k })) || [])],
      });
    } else {
      const newsItem = item.data as NewsItem;
      
      let description = `<p><strong>Type:</strong> News</p>`;
      description += `<p>${newsItem.content}</p>`;

      feed.addItem({
        title: `[News] ${newsItem.content.substring(0, 100)}${newsItem.content.length > 100 ? '...' : ''}`,
        id: `news-${index}`,
        link: `${siteUrl}/news/`,
        description: description,
        content: description,
        author: [
          {
            name: config.author.name,
            email: config.social.email,
          },
        ],
        date: item.date,
        category: [{ name: 'news' }],
      });
    }
  });

  return feed.rss2();
}

export function generateUnifiedAtomFeed(language: string = 'en'): string {
  const config = getConfig(language);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://liuchzzyy.github.io';
  
  const feed = new Feed({
    title: config.site.title,
    description: `Latest updates from ${config.author.name}`,
    id: `${siteUrl}/`,
    link: `${siteUrl}/`,
    language: language,
    image: `${siteUrl}${config.author.avatar}`,
    favicon: `${siteUrl}${config.site.favicon}`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${config.author.name}`,
    updated: new Date(),
    generator: 'PRISM RSS Generator',
    feedLinks: {
      rss2: `${siteUrl}/rss/feed.xml`,
      atom: `${siteUrl}/rss/feed-atom.xml`,
    },
    author: {
      name: config.author.name,
      email: config.social.email,
    },
  });

  // Collect all items with their types
  const allItems: UnifiedFeedItem[] = [];

  // Get publications
  const bibtex = getBibtexContent('publications.bib', language);
  const publications = parseBibTeX(bibtex);
  publications.forEach((pub) => {
    const pubDate = new Date(pub.year, pub.month ? parseInt(pub.month) - 1 : 0);
    allItems.push({
      type: 'publication',
      date: pubDate,
      data: pub,
    });
  });

  // Get news items
  try {
    const newsContent = getTomlContent('news.toml', language) as { items?: NewsItem[] };
    const newsItems = newsContent.items || [];
    newsItems.forEach((item) => {
      allItems.push({
        type: 'news',
        date: new Date(item.date),
        data: item,
      });
    });
  } catch {
    console.log('No news items found or error reading news.toml');
  }

  // Sort all items by date (newest first)
  allItems.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Add items to feed (limit to most recent 20)
  allItems.slice(0, 20).forEach((item, index) => {
    if (item.type === 'publication') {
      const pub = item.data as Publication;
      const authorNames = pub.authors.map(a => a.name).join(', ');
      
      let description = `<p><strong>Type:</strong> Publication</p>`;
      description += `<p><strong>Authors:</strong> ${authorNames}</p>`;
      if (pub.abstract) description += `<p>${pub.abstract}</p>`;
      if (pub.journal) description += `<p><strong>Journal:</strong> ${pub.journal}</p>`;
      else if (pub.conference) description += `<p><strong>Conference:</strong> ${pub.conference}</p>`;
      if (pub.doi) description += `<p><strong>DOI:</strong> <a href="https://doi.org/${pub.doi}">${pub.doi}</a></p>`;

      feed.addItem({
        title: `[Publication] ${pub.title}`,
        id: pub.id,
        link: `${siteUrl}/publications/#${pub.id}`,
        description: description,
        content: description,
        author: [{ name: config.author.name, email: config.social.email }],
        date: item.date,
        category: [{ name: 'publication' }, ...(pub.keywords?.map(k => ({ name: k })) || [])],
      });
    } else {
      const newsItem = item.data as NewsItem;
      
      let description = `<p><strong>Type:</strong> News</p>`;
      description += `<p>${newsItem.content}</p>`;

      feed.addItem({
        title: `[News] ${newsItem.content.substring(0, 100)}${newsItem.content.length > 100 ? '...' : ''}`,
        id: `news-${index}`,
        link: `${siteUrl}/news/`,
        description: description,
        content: description,
        author: [{ name: config.author.name, email: config.social.email }],
        date: item.date,
        category: [{ name: 'news' }],
      });
    }
  });

  return feed.atom1();
}
