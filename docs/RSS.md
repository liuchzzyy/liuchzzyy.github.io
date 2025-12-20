# RSS Feed Feature

This site provides RSS and Atom feeds for publications and news updates.

## Available Feeds

### Publications
- **RSS 2.0**: [/rss/publications.xml](/rss/publications.xml)
- **Atom 1.0**: [/rss/publications-atom.xml](/rss/publications-atom.xml)

### News & Updates
- **RSS 2.0**: [/rss/news.xml](/rss/news.xml)
- **Atom 1.0**: [/rss/news-atom.xml](/rss/news-atom.xml)

## Feed Details

### Publications Feed
Contains the latest 20 publications from the BibTeX file, sorted by publication date (newest first). Each entry includes:
- Publication title
- Authors
- Abstract (if available)
- Journal/Conference information
- DOI link (if available)
- Publication date

### News Feed
Contains the latest 20 news items, sorted by date (newest first). Each entry includes:
- News content
- Date
- Link to news page

## Subscribing to Feeds

You can subscribe to these feeds using any RSS reader application such as:
- Feedly
- Inoreader
- NewsBlur
- NetNewsWire (macOS/iOS)
- Thunderbird (with RSS support)

Simply copy one of the feed URLs above and add it to your RSS reader.

## Technical Details

RSS feeds are automatically generated during the build process using the `feed` npm package. The generation script (`scripts/generate-rss.js`) reads content from:
- `content/publications.bib` for publications
- `content/news.toml` for news items

Feeds are generated as static XML files in the `out/rss/` directory during the build process.

## Metadata

The RSS feed links are automatically included in the site's HTML `<head>` section, allowing browsers and RSS readers to auto-discover the feeds.
