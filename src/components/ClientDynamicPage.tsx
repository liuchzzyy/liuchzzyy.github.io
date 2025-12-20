'use client';

import { useLanguageStore } from '@/lib/stores/languageStore';
import PublicationsList from '@/components/publications/PublicationsList';
import TextPage from '@/components/pages/TextPage';
import CardPage from '@/components/pages/CardPage';
import ListPage from '@/components/pages/ListPage';
import {
    PublicationPageConfig,
    TextPageConfig,
    CardPageConfig,
    ListPageConfig
} from '@/types/page';
import { Publication } from '@/types/publication';

interface PageContentData {
    type: 'publication' | 'text' | 'card' | 'list';
    config: PublicationPageConfig | TextPageConfig | CardPageConfig | ListPageConfig;
    content?: string;
    publications?: Publication[];
}

interface ClientDynamicPageProps {
    enContent: PageContentData | null;
    zhContent: PageContentData | null;
}

export default function ClientDynamicPage({ enContent, zhContent }: ClientDynamicPageProps) {
    const language = useLanguageStore((state) => state.language);
    
    const pageContent = language === 'zh' ? zhContent : enContent;

    if (!pageContent) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <p>Page not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {pageContent.type === 'publication' && (
                <PublicationsList 
                    config={pageContent.config as PublicationPageConfig} 
                    publications={pageContent.publications || []} 
                />
            )}
            {pageContent.type === 'text' && (
                <TextPage 
                    config={pageContent.config as TextPageConfig} 
                    content={pageContent.content || ''} 
                />
            )}
            {pageContent.type === 'card' && (
                <CardPage config={pageContent.config as CardPageConfig} />
            )}
            {pageContent.type === 'list' && (
                <ListPage config={pageContent.config as ListPageConfig} />
            )}
        </div>
    );
}
