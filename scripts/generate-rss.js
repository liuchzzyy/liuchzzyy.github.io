const fs = require('fs');
const path = require('path');
const { Feed } = require('feed');
const TOML = require('smol-toml');

// Load config
function loadConfig(language = 'en') {
  const configPath = path.join(__dirname, '../content', `config${language === 'zh' ? '.zh' : ''}.toml`);
  const configContent = fs.readFileSync(configPath, 'utf-8');
  return TOML.parse(configContent);
}

// Load BibTeX and parse publications
function loadPublications(language = 'en') {
  const bibPath = path.join(__dirname, '../content/publications.bib');
  const bibContent = fs.readFileSync(bibPath, 'utf-8');
  
  // Simple BibTeX parser - extract entries
  const entries = [];
  const entryRegex = /@(\w+)\{([^,]+),\s*([\s\S]+?)\n\}/g;
  let match;
  
  while ((match = entryRegex.exec(bibContent)) !== null) {
    const type = match[1];
    const key = match[2];
    const content = match[3];
    
    const entry = { type, key, fields: {} };
    
    // Parse fields
    const fieldRegex = /(\w+)\s*=\s*\{([^}]+)\}/g;
    let fieldMatch;
    while ((fieldMatch = fieldRegex.exec(content)) !== null) {
      entry.fields[fieldMatch[1]] = fieldMatch[2];
    }
    
    entries.push(entry);
  }
  
  return entries;
}

// Load news
function loadNews(language = 'en') {
  try {
    const newsPath = path.join(__dirname, '../content', `news${language === 'zh' ? '.zh' : ''}.toml`);
    const newsContent = fs.readFileSync(newsPath, 'utf-8');
    const parsed = TOML.parse(newsContent);
    return parsed.items || [];
  } catch (error) {
    return [];
  }
}

async function generateRSSFeeds() {
  const config = loadConfig('en');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://liuchzzyy.github.io';
  
  const outDir = path.join(__dirname, '../out/rss');
  
  // Create rss directory if it doesn't exist
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log('Generating RSS feeds...');

  // Unified Feed - Combining publications and news
  const unifiedFeed = new Feed({
    title: config.site.title,
    description: `Latest updates from ${config.author.name}`,
    id: `${siteUrl}/`,
    link: `${siteUrl}/`,
    language: 'en',
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

  // Collect all items
  const allItems = [];

  // Add publications
  const publications = loadPublications('en');
  publications.forEach((pub) => {
    const year = pub.fields.year || new Date().getFullYear();
    const month = pub.fields.month || 'jan';
    const monthMap = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
    const pubDate = new Date(parseInt(year), monthMap[month.toLowerCase()] || 0);
    
    allItems.push({
      type: 'publication',
      date: pubDate,
      data: pub
    });
  });

  // Add news items
  const newsItems = loadNews('en');
  newsItems.forEach((item) => {
    allItems.push({
      type: 'news',
      date: new Date(item.date),
      data: item
    });
  });

  // Sort by date (newest first)
  allItems.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Add items to feed (limit to most recent 20)
  allItems.slice(0, 20).forEach((item, index) => {
    if (item.type === 'publication') {
      const pub = item.data;
      let description = `<p><strong>Type:</strong> Publication</p>`;
      description += `<p><strong>Authors:</strong> ${pub.fields.author || 'Unknown'}</p>`;
      if (pub.fields.abstract) description += `<p>${pub.fields.abstract}</p>`;
      if (pub.fields.journal) description += `<p><strong>Journal:</strong> ${pub.fields.journal}</p>`;
      if (pub.fields.booktitle) description += `<p><strong>Conference:</strong> ${pub.fields.booktitle}</p>`;
      if (pub.fields.doi) description += `<p><strong>DOI:</strong> <a href="https://doi.org/${pub.fields.doi}">${pub.fields.doi}</a></p>`;

      unifiedFeed.addItem({
        title: `[Publication] ${pub.fields.title || 'Untitled'}`,
        id: pub.key,
        link: `${siteUrl}/publications/#${pub.key}`,
        description: description,
        content: description,
        author: [{ name: config.author.name, email: config.social.email }],
        date: item.date,
        category: [{ name: 'publication' }],
      });
    } else {
      const newsItem = item.data;
      let description = `<p><strong>Type:</strong> News</p>`;
      description += `<p>${newsItem.content}</p>`;

      unifiedFeed.addItem({
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

  fs.writeFileSync(path.join(outDir, 'feed.xml'), unifiedFeed.rss2());
  console.log('✓ Generated feed.xml');

  fs.writeFileSync(path.join(outDir, 'feed-atom.xml'), unifiedFeed.atom1());
  console.log('✓ Generated feed-atom.xml');

  console.log('RSS feed generation complete.');
}

// Run if called directly
if (require.main === module) {
  generateRSSFeeds().catch(console.error);
}

module.exports = { generateRSSFeeds };
