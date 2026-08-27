'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { Feed } = require('feed');
const bibtexParse = require('bibtex-parse-js');
const TOML = require('smol-toml');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const OUTPUT_DIR = path.join(__dirname, '..', 'out', 'rss');
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://liuchzzyy.github.io';
const MONTH_INDEX_BY_NAME = Object.freeze({
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
});

function readToml(filename) {
  return TOML.parse(fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8'));
}

function toPublicationDate(yearValue, monthValue) {
  const year = Number.parseInt(String(yearValue || ''), 10);
  if (!Number.isInteger(year)) {
    throw new Error(`Invalid publication year: ${String(yearValue)}`);
  }

  const monthName = String(monthValue || '').toLowerCase();
  const monthNumber = Number.parseInt(monthName, 10);
  const monthIndex = MONTH_INDEX_BY_NAME[monthName] ?? (Number.isInteger(monthNumber) ? monthNumber - 1 : 0);

  if (monthIndex < 0 || monthIndex > 11) {
    throw new Error(`Invalid publication month: ${String(monthValue)}`);
  }

  return new Date(Date.UTC(year, monthIndex, 1));
}

function toNewsDate(value) {
  const match = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(value);
  if (!match) {
    throw new Error(`Invalid news date: ${value}`);
  }

  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2] || '01', 10);
  const day = Number.parseInt(match[3] || '01', 10);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error(`Invalid news date: ${value}`);
  }

  return date;
}

function buildFeed(config, items) {
  const feed = new Feed({
    title: config.site.title,
    description: `Latest publications and updates from ${config.author.name}`,
    id: `${SITE_URL}/`,
    link: `${SITE_URL}/`,
    language: 'en',
    image: `${SITE_URL}${config.author.avatar}`,
    favicon: `${SITE_URL}${config.site.favicon}`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${config.author.name}`,
    updated: new Date(),
    generator: 'PRISM RSS Generator',
    feedLinks: {
      rss2: `${SITE_URL}/rss/feed.xml`,
      atom: `${SITE_URL}/rss/feed-atom.xml`,
    },
    author: {
      name: config.author.name,
      email: config.social.email,
    },
  });

  items.forEach((item, index) => {
    if (item.type === 'publication') {
      const description = [
        '<p><strong>Type:</strong> Publication</p>',
        `<p><strong>Authors:</strong> ${item.data.author || 'Unknown'}</p>`,
        item.data.abstract ? `<p>${item.data.abstract}</p>` : '',
        item.data.journal ? `<p><strong>Journal:</strong> ${item.data.journal}</p>` : '',
        item.data.booktitle ? `<p><strong>Conference:</strong> ${item.data.booktitle}</p>` : '',
        item.data.doi ? `<p><strong>DOI:</strong> <a href="https://doi.org/${item.data.doi}">${item.data.doi}</a></p>` : '',
      ].join('');

      feed.addItem({
        title: `[Publication] ${item.data.title || 'Untitled'}`,
        id: item.data.id,
        link: `${SITE_URL}/publications/#${item.data.id}`,
        description,
        content: description,
        author: [{ name: config.author.name, email: config.social.email }],
        date: item.date,
        category: [{ name: 'publication' }],
      });
      return;
    }

    const description = `<p><strong>Type:</strong> News</p><p>${item.data.content}</p>`;
    feed.addItem({
      title: `[News] ${item.data.content.substring(0, 100)}${item.data.content.length > 100 ? '...' : ''}`,
      id: `news-${index}`,
      link: `${SITE_URL}/`,
      description,
      content: description,
      author: [{ name: config.author.name, email: config.social.email }],
      date: item.date,
      category: [{ name: 'news' }],
    });
  });

  return feed;
}

function generateRssFeeds() {
  const config = readToml('config.toml');
  const publications = bibtexParse.toJSON(fs.readFileSync(path.join(CONTENT_DIR, 'publications.bib'), 'utf8'));
  const news = readToml('news.toml').news || [];
  const items = [
    ...publications.map((publication) => ({
      type: 'publication',
      date: toPublicationDate(publication.entryTags.year, publication.entryTags.month),
      data: {
        id: publication.citationKey,
        ...publication.entryTags,
      },
    })),
    ...news.map((item) => ({
      type: 'news',
      date: toNewsDate(item.date),
      data: item,
    })),
  ].sort((left, right) => right.date.getTime() - left.date.getTime());

  const feed = buildFeed(config, items.slice(0, 20));
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'feed.xml'), feed.rss2(), 'utf8');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'feed-atom.xml'), feed.atom1(), 'utf8');
  console.log(`Generated RSS and Atom feeds with ${Math.min(items.length, 20)} items.`);
}

generateRssFeeds();
