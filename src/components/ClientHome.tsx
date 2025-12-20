'use client';

import { useLanguageStore } from '@/lib/stores/languageStore';
import Profile from '@/components/home/Profile';
import About from '@/components/home/About';
import SelectedPublications from '@/components/home/SelectedPublications';
import News from '@/components/home/News';
import PublicationsList from '@/components/publications/PublicationsList';
import TextPage from '@/components/pages/TextPage';
import CardPage from '@/components/pages/CardPage';
import ListPage from '@/components/pages/ListPage';

import { Publication } from '@/types/publication';
import { PublicationPageConfig, TextPageConfig, CardPageConfig, ListPageConfig, NewsItem } from '@/types/page';

interface SectionData {
  id: string;
  type: 'markdown' | 'publications' | 'list';
  title?: string;
  content?: string;
  publications?: Publication[];
  items?: NewsItem[];
}

interface PageData {
  type: 'about' | 'publication' | 'text' | 'card' | 'list';
  id: string;
  config?: PublicationPageConfig | TextPageConfig | CardPageConfig | ListPageConfig;
  sections?: SectionData[];
  content?: string;
  publications?: Publication[];
}

interface ClientHomeProps {
  authorDataEn: {
    name: string;
    title: string;
    institution: string;
    avatar: string;
  };
  authorDataZh: {
    name: string;
    title: string;
    institution: string;
    avatar: string;
  };
  socialData: Record<string, string | string[] | undefined>;
  featuresData: {
    enable_likes: boolean;
    enable_one_page_mode?: boolean;
  };
  researchInterestsEn?: string[];
  researchInterestsZh?: string[];
  enableOnePageMode: boolean;
  pagesEn: PageData[];
  pagesZh: PageData[];
}

export default function ClientHome({
  authorDataEn,
  authorDataZh,
  socialData,
  featuresData,
  researchInterestsEn,
  researchInterestsZh,
  enableOnePageMode,
  pagesEn,
  pagesZh,
}: ClientHomeProps) {
  const language = useLanguageStore((state) => state.language);
  
  // Select data based on current language
  const pagesToShow = language === 'zh' ? pagesZh : pagesEn;
  const researchInterests = language === 'zh' ? researchInterestsZh : researchInterestsEn;
  const authorData = language === 'zh' ? authorDataZh : authorDataEn;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background min-h-screen">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Left Column - Profile */}
        <div className="lg:col-span-1">
          <Profile
            author={authorData}
            social={socialData}
            features={featuresData}
            researchInterests={researchInterests}
          />
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-2 space-y-8">
          {pagesToShow.map((page) => (
            <section key={page.id} id={page.id} className="scroll-mt-24 space-y-8">
              {page.type === 'about' && page.sections?.map((section: SectionData) => {
                switch (section.type) {
                  case 'markdown':
                    return (
                      <About
                        key={section.id}
                        content={section.content || ''}
                        title={section.title}
                      />
                    );
                  case 'publications':
                    return (
                      <SelectedPublications
                        key={section.id}
                        publications={section.publications || []}
                        title={section.title}
                        enableOnePageMode={enableOnePageMode}
                      />
                    );
                  case 'list':
                    return (
                      <News
                        key={section.id}
                        items={section.items || []}
                        title={section.title}
                        enableOnePageMode={enableOnePageMode}
                      />
                    );
                  default:
                    return null;
                }
              })}
              {page.type === 'publication' && (
                <PublicationsList
                  config={page.config as PublicationPageConfig}
                  publications={page.publications || []}
                  embedded={true}
                />
              )}
              {page.type === 'text' && (
                <TextPage
                  config={page.config as TextPageConfig}
                  content={page.content || ''}
                  embedded={true}
                />
              )}
              {page.type === 'card' && (
                <CardPage
                  config={page.config as CardPageConfig}
                  embedded={true}
                />
              )}
              {page.type === 'list' && (
                <ListPage
                  config={page.config as ListPageConfig}
                  embedded={true}
                />
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
