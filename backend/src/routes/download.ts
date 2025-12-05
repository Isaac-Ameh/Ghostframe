// 🎃 GhostFrame Download Routes
// API endpoints for downloading the framework

import express, { Request, Response } from 'express';
import archiver from 'archiver';
import path from 'path';
import fs from 'fs';

const router = express.Router();

/**
 * GET /api/download/framework
 * Download the complete GhostFrame framework as a ZIP file
 */
router.get('/framework', async (req: Request, res: Response) => {
  try {
    console.log('📦 Preparing GhostFrame framework download...');

    // Set response headers for ZIP download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=ghostframe-framework.zip');

    // Create archiver instance
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Handle archiver errors
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      res.status(500).json({ error: 'Failed to create archive' });
    });

    // Pipe archive to response
    archive.pipe(res);

    // Get the project root directory (2 levels up from this file)
    const projectRoot = path.resolve(__dirname, '../../../');

    // Files and directories to include
    const includePatterns = [
      // Core framework files
      'backend/**/*',
      'frontend/**/*',
      'sdk/**/*',
      'cli/**/*',
      'modules/**/*',
      
      // Documentation
      'README.md',
      'QUICKSTART.md',
      'SETUP.md',
      'FRAMEWORK_GUIDE.md',
      'LICENSE',
      
      // Configuration files
      'package.json',
      'package-lock.json',
      '.prettierrc',
      'vercel.json',
      'render.yaml',
      
      // Example environment files
      'backend/.env.example',
      'frontend/.env.example'
    ];

    // Files and directories to exclude
    const excludePatterns = [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/.git/**',
      '**/logs/**',
      '**/uploads/**',
      '**/.env',
      '**/*.log',
      '**/coverage/**',
      '**/.DS_Store',
      '**/Thumbs.db'
    ];

    // Add files to archive
    for (const pattern of includePatterns) {
      const fullPath = path.join(projectRoot, pattern);
      
      // Check if it's a directory pattern
      if (pattern.endsWith('/**/*')) {
        const dirPath = pattern.replace('/**/*', '');
        const fullDirPath = path.join(projectRoot, dirPath);
        
        if (fs.existsSync(fullDirPath) && fs.statSync(fullDirPath).isDirectory()) {
          archive.directory(fullDirPath, dirPath, (entry) => {
            // Exclude patterns
            for (const exclude of excludePatterns) {
              if (entry.name.includes(exclude.replace('**/', '').replace('/**', ''))) {
                return false;
              }
            }
            return entry;
          });
        }
      } else {
        // Single file
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
          archive.file(fullPath, { name: pattern });
        }
      }
    }

    // Add a README for the download
    const downloadReadme = `# GhostFrame Framework

Thank you for downloading GhostFrame! 🎃

## Quick Start

1. **Install Dependencies**
   \`\`\`bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   \`\`\`

2. **Configure Environment**
   \`\`\`bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env and add your API keys
   
   # Frontend
   cd ../frontend
   cp .env.example .env.local
   \`\`\`

3. **Start Development Servers**
   \`\`\`bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   \`\`\`

4. **Open in Browser**
   Navigate to: http://localhost:3000

## Documentation

- **Quick Start**: See QUICKSTART.md
- **Setup Guide**: See SETUP.md
- **Framework Guide**: See FRAMEWORK_GUIDE.md
- **API Docs**: http://localhost:3001/api-docs (when backend is running)

## Support

- GitHub: https://github.com/Isaac-Ameh/Ghostframe
- Discord: https://discord.gg/vXjncVTx
- Docs: https://ghostframe.dev/docs

Happy building! 👻
`;

    archive.append(downloadReadme, { name: 'DOWNLOAD_README.md' });

    // Finalize the archive
    await archive.finalize();

    console.log('✅ Framework download complete');
  } catch (error) {
    console.error('Download error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Download failed'
      });
    }
  }
});

/**
 * GET /api/download/sdk
 * Download just the SDK package
 */
router.get('/sdk', async (req: Request, res: Response) => {
  try {
    console.log('📦 Preparing SDK download...');

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=ghostframe-sdk.zip');

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      res.status(500).json({ error: 'Failed to create archive' });
    });

    archive.pipe(res);

    const projectRoot = path.resolve(__dirname, '../../../');
    const sdkPath = path.join(projectRoot, 'sdk');

    if (fs.existsSync(sdkPath)) {
      archive.directory(sdkPath, 'ghostframe-sdk', {
        filter: (entry: string) => !entry.includes('node_modules')
      } as any);
    }

    await archive.finalize();
    console.log('✅ SDK download complete');
  } catch (error) {
    console.error('SDK download error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Download failed' });
    }
  }
});

/**
 * GET /api/download/cli
 * Download just the CLI tool
 */
router.get('/cli', async (req: Request, res: Response) => {
  try {
    console.log('📦 Preparing CLI download...');

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=ghostframe-cli.zip');

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      res.status(500).json({ error: 'Failed to create archive' });
    });

    archive.pipe(res);

    const projectRoot = path.resolve(__dirname, '../../../');
    const cliPath = path.join(projectRoot, 'cli');

    if (fs.existsSync(cliPath)) {
      archive.directory(cliPath, 'ghostframe-cli', {
        filter: (entry: string) => !entry.includes('node_modules')
      } as any);
    }

    await archive.finalize();
    console.log('✅ CLI download complete');
  } catch (error) {
    console.error('CLI download error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Download failed' });
    }
  }
});

/**
 * GET /api/download/info
 * Get information about available downloads
 */
router.get('/info', (req: Request, res: Response) => {
  res.json({
    success: true,
    downloads: [
      {
        id: 'framework',
        name: 'Complete Framework',
        description: 'Full GhostFrame framework with backend, frontend, SDK, and CLI',
        endpoint: '/api/download/framework',
        estimatedSize: '~50MB',
        includes: ['Backend API', 'Frontend UI', 'SDK', 'CLI', 'Modules', 'Documentation']
      },
      {
        id: 'sdk',
        name: 'SDK Only',
        description: 'Just the GhostFrame SDK for integration',
        endpoint: '/api/download/sdk',
        estimatedSize: '~500KB',
        includes: ['SDK Package', 'TypeScript Types', 'Documentation']
      },
      {
        id: 'cli',
        name: 'CLI Tool',
        description: 'Command-line interface for GhostFrame',
        endpoint: '/api/download/cli',
        estimatedSize: '~2MB',
        includes: ['CLI Tool', 'Templates', 'Documentation']
      }
    ]
  });
});

export default router;
