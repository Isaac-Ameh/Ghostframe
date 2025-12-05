// 🎃 GhostFrame CLI Configuration Manager
// Handles CLI configuration storage and retrieval

import fs from 'fs-extra';
import path from 'path';
import os from 'os';

export class ConfigManager {
  private configPath: string;
  private config: Record<string, any>;

  constructor() {
    this.configPath = path.join(os.homedir(), '.ghostframe', 'config.json');
    this.config = {};
    this.loadConfig();
  }

  /**
   * Get configuration value
   */
  get(key: string): any {
    return this.config[key];
  }

  /**
   * Set configuration value
   */
  set(key: string, value: any): void {
    this.config[key] = value;
    this.saveConfig();
  }

  /**
   * Delete configuration key
   */
  delete(key: string): void {
    delete this.config[key];
    this.saveConfig();
  }

  /**
   * Get all configuration
   */
  getAll(): Record<string, any> {
    return { ...this.config };
  }

  /**
   * Clear all configuration
   */
  clear(): void {
    this.config = {};
    this.saveConfig();
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    return key in this.config;
  }

  private loadConfig(): void {
    try {
      if (fs.existsSync(this.configPath)) {
        this.config = fs.readJsonSync(this.configPath);
      } else {
        // Initialize with default config
        this.config = {
          apiUrl: 'http://localhost:3001/api',
          registryUrl: 'http://localhost:3001/api/registry',
          defaultTemplate: 'education',
          autoValidate: true,
          colorOutput: true
        };
        this.saveConfig();
      }
    } catch (error) {
      console.warn('Failed to load config, using defaults');
      this.config = {};
    }
  }

  private saveConfig(): void {
    try {
      fs.ensureDirSync(path.dirname(this.configPath));
      fs.writeJsonSync(this.configPath, this.config, { spaces: 2 });
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }
}