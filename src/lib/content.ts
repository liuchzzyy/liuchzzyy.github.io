import fs from 'fs';
import path from 'path';
import { parse } from 'smol-toml';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function getMarkdownContent(filename: string, language?: 'en' | 'zh'): string {
    try {
        // Try language-specific file first
        if (language === 'zh') {
            const baseName = filename.replace(/\.md$/, '');
            const zhFilePath = path.join(CONTENT_DIR, `${baseName}_zh.md`);
            if (fs.existsSync(zhFilePath)) {
                return fs.readFileSync(zhFilePath, 'utf-8');
            }
        }
        
        // Fallback to default file
        const filePath = path.join(CONTENT_DIR, filename);
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error(`Error loading markdown file ${filename}:`, error);
        return '';
    }
}

export function getBibtexContent(filename: string): string {
    try {
        const filePath = path.join(CONTENT_DIR, filename);
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error(`Error loading bibtex file ${filename}:`, error);
        return '';
    }
}

export function getTomlContent<T>(filename: string, language?: 'en' | 'zh'): T | null {
    try {
        // Try language-specific file first
        if (language === 'zh') {
            const baseName = filename.replace(/\.toml$/, '');
            const zhFilePath = path.join(CONTENT_DIR, `${baseName}_zh.toml`);
            if (fs.existsSync(zhFilePath)) {
                const fileContent = fs.readFileSync(zhFilePath, 'utf-8');
                return parse(fileContent) as unknown as T;
            }
        }
        
        // Fallback to default file
        const filePath = path.join(CONTENT_DIR, filename);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return parse(fileContent) as unknown as T;
    } catch (error) {
        console.error(`Error loading TOML file ${filename}:`, error);
        return null;
    }
}

export function getPageConfig<T = unknown>(pageName: string, language?: 'en' | 'zh'): T | null {
    return getTomlContent<T>(`${pageName}.toml`, language);
}
