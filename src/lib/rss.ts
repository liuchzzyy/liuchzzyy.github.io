import { Feed } from 'feed';
import { getConfig } from './config';
import { parseBibTeX } from './bibtexParser';
import { getBibtexContent, getTomlContent } from './content';
import { Publication } from '@/types/publication';
import { NewsItem } from '@/types/page';

export function generatePublicationsFeed(language: string = 'en'): string {
  const config = getConfig(language);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://liuchzzyy.github.io';
  
  const feed = new Feed({
    title: `${config.site.title} - Publications`,
    description: `Latest publications from ${config.author.name}`,
    id: `${siteUrl}/`,
    link: `${siteUrl}/`,
    language: language,
    image: `${siteUrl}${config.author.avatar}`,
    favicon: `${siteUrl}${config.site.favicon}`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${config.author.name}`,
    updated: new Date(),
    generator: 'PRISM RSS Generator',
    feedLinks: {
      rss2: `${siteUrl}/rss/publications.xml`,
      atom: `${siteUrl}/rss/publications-atom.xml`,
    },
    author: {
      name: config.author.name,
      email: config.social.email,
    },
  });

  // Get publications
  const bibtex = getBibtexContent('publications.bib', language);
  const publications = parseBibTeX(bibtex);

  // Sort by date (newest first)
  const sortedPublications = publications.sort((a, b) => {
    const dateA = new Date(a.year, a.month ? parseInt(a.month) - 1 : 0);
    const dateB = new Date(b.year, b.month ? parseInt(b.month) - 1 : 0);
    return dateB.getTime() - dateA.getTime();
  });

  // Add publications to feed (limit to most recent 20)
  sortedPublications.slice(0, 20).forEach((pub: Publication) => {
    const pubDate = new Date(pub.year, pub.month ? parseInt(pub.month) - 1 : 0);
    const authorNames = pub.authors.map(a => a.name).join(', ');
    
    let description = `<p><strong>Authors:</strong> ${authorNames}</p>`;
    
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
      title: pub.title,
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
      date: pubDate,
      category: pub.keywords?.map(k => ({ name: k })) || [],
    });
  });

  return feed.rss2();
}

export function generateNewsFeed(language: string = 'en'): string {
  const config = getConfig(language);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://liuchzzyy.github.io';
  
  const feed = new Feed({
    title: `${config.site.title} - News & Updates`,
    description: `Latest news and updates from ${config.author.name}`,
    id: `${siteUrl}/`,
    link: `${siteUrl}/`,
    language: language,
    image: `${siteUrl}${config.author.avatar}`,
    favicon: `${siteUrl}${config.site.favicon}`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${config.author.name}`,
    updated: new Date(),
    generator: 'PRISM RSS Generator',
    feedLinks: {
      rss2: `${siteUrl}/rss/news.xml`,
      atom: `${siteUrl}/rss/news-atom.xml`,
    },
    author: {
      name: config.author.name,
      email: config.social.email,
    },
  });

  try {
    // Get news items
    const newsContent = getTomlContent('news.toml', language) as { items?: NewsItem[] };
    const newsItems = newsContent.items || [];

    // Sort by date (newest first)
    const sortedNews = newsItems.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    // Add news to feed (limit to most recent 20)
    sortedNews.slice(0, 20).forEach((item: NewsItem, index: number) => {
      const newsDate = new Date(item.date);
      
      feed.addItem({
        title: item.content,
        id: `${siteUrl}/news/#news-${index}`,
        link: `${siteUrl}/news/`,
        description: item.content,
        content: item.content,
        author: [
          {
            name: config.author.name,
            email: config.social.email,
          },
        ],
        date: newsDate,
      });
    });
  } catch {
    console.log('No news items found or error reading news.toml');
  }

  return feed.rss2();
}

export function generateAtomFeed(feedType: 'publications' | 'news', language: string = 'en'): string {
  const config = getConfig(language);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://liuchzzyy.github.io';
  
  const feed = new Feed({
    title: `${config.site.title} - ${feedType === 'publications' ? 'Publications' : 'News & Updates'}`,
    description: feedType === 'publications' 
      ? `Latest publications from ${config.author.name}`
      : `Latest news and updates from ${config.author.name}`,
    id: `${siteUrl}/`,
    link: `${siteUrl}/`,
    language: language,
    image: `${siteUrl}${config.author.avatar}`,
    favicon: `${siteUrl}${config.site.favicon}`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${config.author.name}`,
    updated: new Date(),
    generator: 'PRISM RSS Generator',
    feedLinks: {
      rss2: `${siteUrl}/rss/${feedType}.xml`,
      atom: `${siteUrl}/rss/${feedType}-atom.xml`,
    },
    author: {
      name: config.author.name,
      email: config.social.email,
    },
  });

  if (feedType === 'publications') {
    const bibtex = getBibtexContent('publications.bib', language);
    const publications = parseBibTeX(bibtex);
    const sortedPublications = publications.sort((a, b) => {
      const dateA = new Date(a.year, a.month ? parseInt(a.month) - 1 : 0);
      const dateB = new Date(b.year, b.month ? parseInt(b.month) - 1 : 0);
      return dateB.getTime() - dateA.getTime();
    });

    sortedPublications.slice(0, 20).forEach((pub: Publication) => {
      const pubDate = new Date(pub.year, pub.month ? parseInt(pub.month) - 1 : 0);
      const authorNames = pub.authors.map(a => a.name).join(', ');
      
      let description = `<p><strong>Authors:</strong> ${authorNames}</p>`;
      if (pub.abstract) description += `<p>${pub.abstract}</p>`;
      if (pub.journal) description += `<p><strong>Journal:</strong> ${pub.journal}</p>`;
      else if (pub.conference) description += `<p><strong>Conference:</strong> ${pub.conference}</p>`;
      if (pub.doi) description += `<p><strong>DOI:</strong> <a href="https://doi.org/${pub.doi}">${pub.doi}</a></p>`;

      feed.addItem({
        title: pub.title,
        id: pub.id,
        link: `${siteUrl}/publications/#${pub.id}`,
        description: description,
        content: description,
        author: [{ name: config.author.name, email: config.social.email }],
        date: pubDate,
        category: pub.keywords?.map(k => ({ name: k })) || [],
      });
    });
  } else {
    try {
      const newsContent = getTomlContent('news.toml', language) as { items?: NewsItem[] };
      const newsItems = newsContent.items || [];
      const sortedNews = newsItems.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      sortedNews.slice(0, 20).forEach((item: NewsItem, index: number) => {
        const newsDate = new Date(item.date);
        feed.addItem({
          title: item.content,
          id: `${siteUrl}/news/#news-${index}`,
          link: `${siteUrl}/news/`,
          description: item.content,
          content: item.content,
          author: [{ name: config.author.name, email: config.social.email }],
          date: newsDate,
        });
      });
    } catch {
      console.log('No news items found or error reading news.toml');
    }
  }

  return feed.atom1();
}
