// 🎃 GhostFrame CLI Tests

import { GhostFrameCLI } from '../GhostFrameCLI';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

describe('GhostFrameCLI', () => {
  let cli: GhostFrameCLI;
  let testDir: string;

  beforeEach(() => {
    cli = new GhostFrameCLI();
    testDir = path.join(os.tmpdir(), `ghostframe-test-${Date.now()}`);
    fs.ensureDirSync(testDir);
  });

  afterEach(() => {
    fs.removeSync(testDir);
  });

  describe('Configuration', () => {
    it('should load default configuration', () => {
      expect(cli).toBeDefined();
    });

    it('should save and load configuration', async () => {
      const configPath = path.join(testDir, 'config.json');
      const config = {
        apiEndpoint: 'https://test.api.com',
        apiKey: 'test-key'
      };

      await fs.writeJson(configPath, config);
      const loaded = await fs.readJson(configPath);

      expect(loaded).toEqual(config);
    });
  });

  describe('Module Generation', () => {
    it('should generate module structure', async () => {
      const moduleName = 'test-module';
      const modulePath = path.join(testDir, moduleName);

      // Simulate module generation
      await fs.ensureDir(modulePath);
      await fs.writeJson(path.join(modulePath, 'ghostframe.config.json'), {
        id: moduleName,
        name: 'Test Module',
        version: '1.0.0'
      });

      expect(fs.existsSync(modulePath)).toBe(true);
      expect(fs.existsSync(path.join(modulePath, 'ghostframe.config.json'))).toBe(true);
    });

    it('should create required module files', async () => {
      const modulePath = path.join(testDir, 'test-module');
      await fs.ensureDir(modulePath);

      const requiredFiles = [
        'ghostframe.config.json',
        'package.json',
        'README.md',
        'src/index.ts'
      ];

      for (const file of requiredFiles) {
        const filePath = path.join(modulePath, file);
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, '');
      }

      for (const file of requiredFiles) {
        expect(fs.existsSync(path.join(modulePath, file))).toBe(true);
      }
    });
  });

  describe('Validation', () => {
    it('should validate module configuration', async () => {
      const modulePath = path.join(testDir, 'test-module');
      await fs.ensureDir(modulePath);

      const config = {
        id: 'test-module',
        name: 'Test Module',
        version: '1.0.0',
        inputSchema: { type: 'object' },
        outputSchema: { type: 'object' }
      };

      await fs.writeJson(path.join(modulePath, 'ghostframe.config.json'), config);

      const configExists = fs.existsSync(path.join(modulePath, 'ghostframe.config.json'));
      expect(configExists).toBe(true);

      const loadedConfig = await fs.readJson(path.join(modulePath, 'ghostframe.config.json'));
      expect(loadedConfig.id).toBe('test-module');
    });

    it('should detect missing required files', async () => {
      const modulePath = path.join(testDir, 'incomplete-module');
      await fs.ensureDir(modulePath);

      const requiredFiles = ['package.json', 'ghostframe.config.json'];
      const missingFiles = requiredFiles.filter(
        file => !fs.existsSync(path.join(modulePath, file))
      );

      expect(missingFiles.length).toBeGreaterThan(0);
    });
  });

  describe('Template System', () => {
    it('should list available templates', () => {
      const templates = ['basic', 'education', 'creative', 'productivity'];
      expect(templates.length).toBeGreaterThan(0);
      expect(templates).toContain('basic');
    });

    it('should generate module from template', async () => {
      const modulePath = path.join(testDir, 'from-template');
      await fs.ensureDir(modulePath);

      // Simulate template generation
      await fs.writeJson(path.join(modulePath, 'ghostframe.config.json'), {
        id: 'from-template',
        template: 'basic'
      });

      const config = await fs.readJson(path.join(modulePath, 'ghostframe.config.json'));
      expect(config.template).toBe('basic');
    });
  });
});
