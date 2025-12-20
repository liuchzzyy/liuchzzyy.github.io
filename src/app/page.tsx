import { getConfig } from '@/lib/config';
import { getMarkdownContent, getBibtexContent, getTomlContent, getPageConfig } from '@/lib/content';
import { parseBibTeX } from '@/lib/bibtexParser';
import ClientHome from '@/components/ClientHome';

import { Publication } from '@/types/publication';
import { BasePageConfig, PublicationPageConfig, TextPageConfig, CardPageConfig, ListPageConfig, NewsItem } from '@/types/page';

// Define types for section config
interface SectionConfig {
  id: string;
  type: 'markdown' | 'publications' | 'list';
  title?: string;
  source?: string;
  filter?: string;
  limit?: number;
  content?: string;
  publications?: Publication[];
  items?: NewsItem[];
}

type PageData =
  | { type: 'about', id: string, sections: SectionConfig[] }
  | { type: 'publication', id: string, config: PublicationPageConfig, publications: Publication[] }
  | { type: 'text', id: string, config: TextPageConfig, content: string }
  | { type: 'card', id: string, config: CardPageConfig }
  | { type: 'list', id: string, config: ListPageConfig };

function loadContentForLanguage(config: ReturnType<typeof getConfig>, language: string): PageData[] {
  const enableOnePageMode = config.features.enable_one_page_mode;

  // Always load about page config for profile info
  const aboutConfig = getPageConfig('about', language);

  // Helper function to process sections (for about page)
  const processSections = (sections: SectionConfig[]) => {
    return sections.map((section: SectionConfig) => {
      switch (section.type) {
        case 'markdown':
          return {
            ...section,
            content: section.source ? getMarkdownContent(section.source, language) : ''
          };
        case 'publications': {
          const bibtex = getBibtexContent('publications.bib', language);
          const allPubs = parseBibTeX(bibtex);
          const filteredPubs = section.filter === 'selected'
            ? allPubs.filter(p => p.selected)
            : allPubs;
          return {
            ...section,
            publications: filteredPubs.slice(0, section.limit || 5)
          };
        }
        case 'list': {
          const newsData = section.source ? getTomlContent<{ items: NewsItem[] }>(section.source, language) : null;
          return {
            ...section,
            items: newsData?.items || []
          };
        }
        default:
          return section;
      }
    });
  };

  // Determine which pages to show
  let pagesToShow: PageData[] = [];

  if (enableOnePageMode) {
    pagesToShow = config.navigation
      .filter(item => item.type === 'page')
      .map(item => {
        const rawConfig = getPageConfig(item.target, language);
        if (!rawConfig) return null;

        const pageConfig = rawConfig as BasePageConfig;

        if (pageConfig.type === 'about' || 'sections' in (rawConfig as object)) {
          return {
            type: 'about',
            id: item.target,
            sections: processSections((rawConfig as { sections: SectionConfig[] }).sections || [])
          } as PageData;
        } else if (pageConfig.type === 'publication') {
          const pubConfig = pageConfig as PublicationPageConfig;
          const bibtex = getBibtexContent(pubConfig.source, language);
          return {
            type: 'publication',
            id: item.target,
            config: pubConfig,
            publications: parseBibTeX(bibtex)
          } as PageData;
        } else if (pageConfig.type === 'text') {
          const textConfig = pageConfig as TextPageConfig;
          return {
            type: 'text',
            id: item.target,
            config: textConfig,
            content: getMarkdownContent(textConfig.source, language)
          } as PageData;
        } else if (pageConfig.type === 'card') {
          return {
            type: 'card',
            id: item.target,
            config: pageConfig as CardPageConfig
          } as PageData;
        } else if (pageConfig.type === 'list') {
          return {
            type: 'list',
            id: item.target,
            config: pageConfig as ListPageConfig
          } as PageData;
        }
        return null;
      })
      .filter((item): item is PageData => item !== null);
  } else {
    if (aboutConfig) {
      pagesToShow = [{
        type: 'about',
        id: 'about',
        sections: processSections((aboutConfig as { sections: SectionConfig[] }).sections || [])
      }];
    }
  }

  return pagesToShow;
}

export default function Home() {
  const configEn = getConfig('en');
  const configZh = getConfig('zh');
  const enableOnePageMode = configEn.features.enable_one_page_mode;

  // Load content for both languages at build time
  const pagesEn = loadContentForLanguage(configEn, 'en');
  const pagesZh = loadContentForLanguage(configZh, 'zh');

  // Get research interests for both languages
  const aboutConfigEn = getPageConfig('about', 'en');
  const aboutConfigZh = getPageConfig('about', 'zh');
  const researchInterestsEn = (aboutConfigEn as { profile?: { research_interests?: string[] } })?.profile?.research_interests;
  const researchInterestsZh = (aboutConfigZh as { profile?: { research_interests?: string[] } })?.profile?.research_interests;

  return (
    <ClientHome
      authorDataEn={configEn.author}
      authorDataZh={configZh.author}
      socialData={configEn.social}
      featuresData={configEn.features}
      researchInterestsEn={researchInterestsEn}
      researchInterestsZh={researchInterestsZh}
      enableOnePageMode={enableOnePageMode ?? false}
      pagesEn={pagesEn}
      pagesZh={pagesZh}
    />
  );
}

