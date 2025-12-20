import { getPageConfig, getMarkdownContent, getBibtexContent } from '@/lib/content';
import { getConfig } from '@/lib/config';
import { parseBibTeX } from '@/lib/bibtexParser';
import ClientDynamicPage from '@/components/ClientDynamicPage';
import {
    BasePageConfig,
    PublicationPageConfig,
    TextPageConfig,
    CardPageConfig,
    ListPageConfig
} from '@/types/page';

import { Metadata } from 'next';

export function generateStaticParams() {
    const config = getConfig();
    return config.navigation
        .filter(nav => nav.type === 'page' && nav.target !== 'about') // 'about' is handled by root page
        .filter(nav => {
            // only include pages that have a corresponding TOML config file
            const pageConfig = getPageConfig(nav.target);
            return pageConfig !== null;
        })
        .map(nav => ({
            slug: nav.target,
        }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const pageConfig = getPageConfig(slug) as BasePageConfig | null;

    if (!pageConfig) {
        return {};
    }

    return {
        title: pageConfig.title,
        description: pageConfig.description,
    };
}

function loadPageContentForLanguage(slug: string, language: string) {
    const pageConfig = getPageConfig(slug, language) as BasePageConfig | null;
    if (!pageConfig) return null;

    if (pageConfig.type === 'publication') {
        const pubConfig = pageConfig as PublicationPageConfig;
        const bibtex = getBibtexContent(pubConfig.source, language);
        return {
            type: 'publication' as const,
            config: pubConfig,
            publications: parseBibTeX(bibtex)
        };
    } else if (pageConfig.type === 'text') {
        const textConfig = pageConfig as TextPageConfig;
        return {
            type: 'text' as const,
            config: textConfig,
            content: getMarkdownContent(textConfig.source, language)
        };
    } else if (pageConfig.type === 'card') {
        return {
            type: 'card' as const,
            config: pageConfig as CardPageConfig
        };
    } else if (pageConfig.type === 'list') {
        return {
            type: 'list' as const,
            config: pageConfig as ListPageConfig
        };
    }
    return null;
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    // Load content for both languages
    const enContent = loadPageContentForLanguage(slug, 'en');
    const zhContent = loadPageContentForLanguage(slug, 'zh');

    return <ClientDynamicPage enContent={enContent} zhContent={zhContent} />;
}
