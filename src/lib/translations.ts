import { Language } from './stores/languageStore';

// Translation dictionary type
export type TranslationKey = keyof typeof translations.en;

// All translations
export const translations = {
  en: {
    // Site
    'site.title': 'Here is Cheng Liu',
    
    // Navigation
    'nav.about': 'About Me',
    'nav.publications': 'Publications',
    'nav.projects': 'Projects',
    'nav.news': 'News',
    'nav.techniques': 'Techniques',
    'nav.resume': 'Resume',
    
    // Common
    'common.viewMore': 'View More',
    'common.readMore': 'Read More',
    'common.download': 'Download',
    
    // Footer
    'footer.lastUpdated': 'Last updated',
    'footer.builtWith': 'Built with PRISM',
    
    // News
    'news.title': 'News',
    'news.description': 'Latest updates and announcements.',
    
    // Theme
    'theme.system': 'System',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    
    // Language
    'language.english': 'English',
    'language.chinese': '中文',
  },
  zh: {
    // Site
    'site.title': '刘程的主页',
    
    // Navigation
    'nav.about': '关于我',
    'nav.publications': '发表论文',
    'nav.projects': '项目',
    'nav.news': '新闻',
    'nav.techniques': '技术',
    'nav.resume': '简历',
    
    // Common
    'common.viewMore': '查看更多',
    'common.readMore': '阅读更多',
    'common.download': '下载',
    
    // Footer
    'footer.lastUpdated': '最后更新',
    'footer.builtWith': '使用 PRISM 构建',
    
    // News
    'news.title': '新闻',
    'news.description': '最新动态和公告',
    
    // Theme
    'theme.system': '系统',
    'theme.light': '亮色',
    'theme.dark': '暗色',
    
    // Language
    'language.english': 'English',
    'language.chinese': '中文',
  },
};

// Hook to get translation function
export function useTranslation(language: Language) {
  return (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };
}

// Direct translation function
export function translate(key: TranslationKey, language: Language): string {
  return translations[language][key] || translations.en[key] || key;
}
