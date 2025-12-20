import fs from 'fs';
import path from 'path';
import { parse } from 'smol-toml';

export interface SiteConfig {
    site: {
        title: string;
        description: string;
        favicon: string;
        last_updated?: string;
    };
    author: {
        name: string;
        title: string;
        institution: string;
        avatar: string;
    };
    social: {
        email?: string;
        location?: string;
        location_url?: string;
        location_details?: string[];
        google_scholar?: string;
        orcid?: string;
        github?: string;
        xiaohongshu?: string;
        [key: string]: string | string[] | undefined;
    };
    features: {
        enable_likes: boolean;
        enable_one_page_mode?: boolean;
    };
    navigation: Array<{
        title: string;
        type: 'section' | 'page' | 'link';
        target: string;
        href: string;
    }>;
    sections: Array<{
        id: string;
        type: 'markdown' | 'publications' | 'list' | 'cards';
        source?: string;
        title?: string;
        filter?: string;
        limit?: number;
    }>;
}

const CONTENT_DIR = path.join(process.cwd(), 'content');

// Helper to get language-aware config path
function getConfigPath(language?: string): string {
    if (!language || language === 'en') {
        return path.join(CONTENT_DIR, 'config.toml');
    }
    
    // Try to find a language-specific config file (e.g., config.zh.toml)
    const localizedFilename = `config.${language}.toml`;
    const localizedPath = path.join(CONTENT_DIR, localizedFilename);
    
    // Check if the localized file exists, otherwise fallback to default
    if (fs.existsSync(localizedPath)) {
        return localizedPath;
    }
    
    return path.join(CONTENT_DIR, 'config.toml');
}

export function getConfig(language?: string): SiteConfig {
    try {
        const configPath = getConfigPath(language);
        const fileContent = fs.readFileSync(configPath, 'utf-8');
        const config = parse(fileContent) as unknown as SiteConfig;
        return config;
    } catch (error) {
        console.error('Error loading config:', error);
        // Return a default config or throw
        throw new Error('Failed to load content/config.toml');
    }
}
