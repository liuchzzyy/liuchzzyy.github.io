export const translations = {
  en: {
    nav: {
      aboutMe: 'About Me',
      publications: 'Publications',
      projects: 'Projects',
      news: 'News',
      techniques: 'Techniques',
      resume: 'Resume',
    },
    common: {
      readMore: 'Read More',
      viewAll: 'View All',
      loading: 'Loading...',
    },
    home: {
      researchInterests: 'Research Interests',
      aboutMe: 'About Me',
      selectedPublications: 'Selected Publications',
      news: 'News',
    },
  },
  zh: {
    nav: {
      aboutMe: '关于我',
      publications: '学术成果',
      projects: '项目',
      news: '新闻',
      techniques: '技术',
      resume: '简历',
    },
    common: {
      readMore: '阅读更多',
      viewAll: '查看全部',
      loading: '加载中...',
    },
    home: {
      researchInterests: '研究兴趣',
      aboutMe: '关于我',
      selectedPublications: '精选论文',
      news: '新闻动态',
    },
  },
} as const;

export type TranslationKey = typeof translations.en;
export type NavTranslationKey = keyof typeof translations.en.nav;
