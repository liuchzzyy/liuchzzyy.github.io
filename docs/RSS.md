# RSS Feed Feature

This site provides a unified RSS/Atom feed that combines publications and news updates.

## Available Feeds

### Unified Feed (Publications + News)
- **RSS 2.0**: [/rss/feed.xml](/rss/feed.xml)
- **Atom 1.0**: [/rss/feed-atom.xml](/rss/feed-atom.xml)

## Feed Details

The unified feed combines both publications and news items, sorted by date (newest first). Each entry is tagged with its type:

### Publication Entries
- Title prefixed with `[Publication]`
- Category tag: `publication`
- Content includes:
  - Type marker: "Publication"
  - Authors
  - Abstract (if available)
  - Journal/Conference information
  - DOI link (if available)
  - Publication date

### News Entries
- Title prefixed with `[News]`
- Category tag: `news`
- Content includes:
  - Type marker: "News"
  - News content
  - Date

The feed includes up to 20 of the most recent items (publications and news combined).

## Subscribing to Feeds

You can subscribe to the feed using any RSS reader application such as:
- Feedly
- Inoreader
- NewsBlur
- NetNewsWire (macOS/iOS)
- Thunderbird (with RSS support)

Simply copy the feed URL above and add it to your RSS reader. RSS readers can filter by category if you want to see only publications or only news items.

## Technical Details

RSS feeds are automatically generated during the build process using the `feed` npm package. The generation script (`scripts/generate-rss.js`) reads content from:
- `content/publications.bib` for publications
- `content/news.toml` for news items

Both content types are merged, sorted by date, and generated as static XML files in the `out/rss/` directory during the build process.

## Metadata

The RSS feed links are automatically included in the site's HTML `<head>` section, allowing browsers and RSS readers to auto-discover the feed.
