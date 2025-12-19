const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'docs';
const DEST_DIR = path.join('public', 'docs');

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

try {
    console.log(`Syncing assets from ${SOURCE_DIR} to ${DEST_DIR}...`);
    
    // Ensure public folder exists
    if (!fs.existsSync('public')) {
        fs.mkdirSync('public', { recursive: true });
    }

    if (fs.existsSync(SOURCE_DIR)) {
        copyDir(SOURCE_DIR, DEST_DIR);
        console.log('Asset sync complete.');
    } else {
        console.warn(`Source directory '${SOURCE_DIR}' not found. Skipping asset sync.`);
    }
} catch (error) {
    console.error('Asset sync failed:', error);
    process.exit(1);
}
