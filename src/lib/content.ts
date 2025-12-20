import fs from 'fs';
import path from 'path';
import { parse } from 'smol-toml';

const CONTENT_DIR = path.join(process.cwd(), 'content');

// Helper to get language-aware file path
function getLocalizedPath(filename: string, language?: string): string {
    if (!language || language === 'en') {
        return path.join(CONTENT_DIR, filename);
    }
    
    // Try to find a language-specific file (e.g., bio.zh.md, news.zh.toml)
    const ext = path.extname(filename);
    const basename = path.basename(filename, ext);
    const localizedFilename = `${basename}.${language}${ext}`;
    const localizedPath = path.join(CONTENT_DIR, localizedFilename);
    
    // Check if the localized file exists, otherwise fallback to default
    if (fs.existsSync(localizedPath)) {
        return localizedPath;
    }
    
    return path.join(CONTENT_DIR, filename);
}

export function getMarkdownContent(filename: string, language?: string): string {
    try {
        const filePath = getLocalizedPath(filename, language);
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error(`Error loading markdown file ${filename}:`, error);
        return '';
    }
}

export function getBibtexContent(filename: string, language?: string): string {
    try {
        const filePath = getLocalizedPath(filename, language);
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error(`Error loading bibtex file ${filename}:`, error);
        return '';
    }
}

export function getTomlContent<T>(filename: string, language?: string): T | null {
    try {
        const filePath = getLocalizedPath(filename, language);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return parse(fileContent) as unknown as T;
    } catch (error) {
        console.error(`Error loading TOML file ${filename}:`, error);
        return null;
    }
}

export function getPageConfig<T = unknown>(pageName: string, language?: string): T | null {
    return getTomlContent<T>(`${pageName}.toml`, language);
}
