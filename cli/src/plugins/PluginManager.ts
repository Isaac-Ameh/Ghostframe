// 🎃 GhostFrame Plugin Manager
// Manages plugin lifecycle, loading, and hook execution

import fs from 'fs-extra';
import path from 'path';
import { ConfigManager } from '../utils/ConfigManager';

export interface PluginHooks {
  beforeInit?: (context: any) => Promise<void> | void;
  afterInit?: (context: any) => Promise<void> | void;
  beforePublish?: (context: any) => Promise<void> | void;
  afterPublish?: (context: any) => Promise<void> | void;
  onValidate?: (context: any) => Promise<void> | void;
  beforeBuild?: (context: any) => Promise<void> | void;
  afterBuild?: (context: any) => Promise<void> | void;
  beforeTest?: (context: any) => Promise<void> | void;
  afterTest?: (context: any) => Promise<void> | void;
}

export interface PluginMetadata {
  name: string;
  version: string;
  description: string;
  author?: string;
  homepage?: string;
  repository?: string;
  keywords?: string[];
}

export interface Plugin {
  metadata: PluginMetadata;
  hooks: PluginHooks;
  initialize?: () => Promise<void> | void;
  cleanup?: () => Promise<void> | void;
}

export interface InstalledPlugin {
  name: string;
  version: string;
  path: string;
  enabled: boolean;
  global: boolean;
}

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private config: ConfigManager;
  private globalPluginsDir: string;
  private localPluginsDir: string;

  constructor() {
    this.config = new ConfigManager();
    this.globalPluginsDir = path.join(
      require('os').homedir(),
      '.ghostframe',
      'plugins'
    );
    this.localPluginsDir = path.join(process.cwd(), '.ghostframe', 'plugins');
  }

  /**
   * Load all installed plugins
   */
  async loadPlugins(): Promise<void> {
    // Load global plugins
    await this.loadPluginsFromDirectory(this.globalPluginsDir, true);

    // Load local plugins (project-specific)
    await this.loadPluginsFromDirectory(this.localPluginsDir, false);
  }

  /**
   * Load plugins from a directory
   */
  private async loadPluginsFromDirectory(
    directory: string,
    isGlobal: boolean
  ): Promise<void> {
    if (!(await fs.pathExists(directory))) {
      return;
    }

    const entries = await fs.readdir(directory);

    for (const entry of entries) {
      const pluginPath = path.join(directory, entry);
      const stat = await fs.stat(pluginPath);

      if (stat.isDirectory()) {
        await this.loadPlugin(pluginPath, isGlobal);
      }
    }
  }

  /**
   * Load a single plugin
   */
  private async loadPlugin(pluginPath: string, isGlobal: boolean): Promise<void> {
    try {
      // Check if plugin is enabled
      const pluginName = path.basename(pluginPath);
      const disabledPlugins = this.config.get('disabledPlugins') || [];

      if (disabledPlugins.includes(pluginName)) {
        return;
      }

      // Load plugin package.json
      const packagePath = path.join(pluginPath, 'package.json');
      if (!(await fs.pathExists(packagePath))) {
        console.warn(`Plugin ${pluginName} missing package.json`);
        return;
      }

      const packageJson = await fs.readJson(packagePath);

      // Load plugin entry point
      const entryPoint = path.join(pluginPath, packageJson.main || 'index.js');
      if (!(await fs.pathExists(entryPoint))) {
        console.warn(`Plugin ${pluginName} entry point not found`);
        return;
      }

      // Require the plugin
      const pluginModule = require(entryPoint);
      const plugin: Plugin = pluginModule.default || pluginModule;

      // Validate plugin structure
      if (!plugin.metadata || !plugin.hooks) {
        console.warn(`Plugin ${pluginName} has invalid structure`);
        return;
      }

      // Initialize plugin
      if (plugin.initialize) {
        await plugin.initialize();
      }

      // Store plugin
      this.plugins.set(pluginName, plugin);

      console.log(`✅ Loaded plugin: ${pluginName} v${plugin.metadata.version}`);
    } catch (error) {
      console.error(`Failed to load plugin from ${pluginPath}:`, error);
    }
  }

  /**
   * Execute a hook across all plugins
   */
  async executeHook(
    hookName: keyof PluginHooks,
    context: any
  ): Promise<void> {
    for (const [name, plugin] of this.plugins) {
      const hook = plugin.hooks[hookName];
      if (hook) {
        try {
          await hook(context);
        } catch (error) {
          console.error(`Plugin ${name} hook ${hookName} failed:`, error);
        }
      }
    }
  }

  /**
   * Install a plugin
   */
  async installPlugin(
    pluginName: string,
    options: { global?: boolean; version?: string } = {}
  ): Promise<void> {
    const isGlobal = options.global !== false;
    const targetDir = isGlobal ? this.globalPluginsDir : this.localPluginsDir;

    // Ensure directory exists
    await fs.ensureDir(targetDir);

    // Install using npm
    const installCmd = `npm install ${pluginName}${
      options.version ? `@${options.version}` : ''
    } --prefix ${targetDir}`;

    console.log(`Installing plugin: ${pluginName}...`);

    // Execute npm install
    const { execSync } = require('child_process');
    try {
      execSync(installCmd, { stdio: 'inherit' });
      console.log(`✅ Plugin ${pluginName} installed successfully`);

      // Reload plugins
      await this.loadPlugins();
    } catch (error) {
      throw new Error(`Failed to install plugin: ${error}`);
    }
  }

  /**
   * Uninstall a plugin
   */
  async uninstallPlugin(
    pluginName: string,
    options: { global?: boolean } = {}
  ): Promise<void> {
    const isGlobal = options.global !== false;
    const targetDir = isGlobal ? this.globalPluginsDir : this.localPluginsDir;
    const pluginPath = path.join(targetDir, 'node_modules', pluginName);

    if (!(await fs.pathExists(pluginPath))) {
      throw new Error(`Plugin ${pluginName} not found`);
    }

    // Cleanup plugin
    const plugin = this.plugins.get(pluginName);
    if (plugin && plugin.cleanup) {
      await plugin.cleanup();
    }

    // Remove from plugins map
    this.plugins.delete(pluginName);

    // Remove directory
    await fs.remove(pluginPath);

    console.log(`✅ Plugin ${pluginName} uninstalled successfully`);
  }

  /**
   * List all installed plugins
   */
  async listPlugins(): Promise<InstalledPlugin[]> {
    const plugins: InstalledPlugin[] = [];

    // List global plugins
    if (await fs.pathExists(this.globalPluginsDir)) {
      const globalPlugins = await this.getPluginsFromDirectory(
        this.globalPluginsDir,
        true
      );
      plugins.push(...globalPlugins);
    }

    // List local plugins
    if (await fs.pathExists(this.localPluginsDir)) {
      const localPlugins = await this.getPluginsFromDirectory(
        this.localPluginsDir,
        false
      );
      plugins.push(...localPlugins);
    }

    return plugins;
  }

  /**
   * Get plugins from a directory
   */
  private async getPluginsFromDirectory(
    directory: string,
    isGlobal: boolean
  ): Promise<InstalledPlugin[]> {
    const plugins: InstalledPlugin[] = [];
    const nodeModulesPath = path.join(directory, 'node_modules');

    if (!(await fs.pathExists(nodeModulesPath))) {
      return plugins;
    }

    const entries = await fs.readdir(nodeModulesPath);
    const disabledPlugins = this.config.get('disabledPlugins') || [];

    for (const entry of entries) {
      if (entry.startsWith('ghostframe-plugin-') || entry.startsWith('@')) {
        const pluginPath = path.join(nodeModulesPath, entry);
        const packagePath = path.join(pluginPath, 'package.json');

        if (await fs.pathExists(packagePath)) {
          const packageJson = await fs.readJson(packagePath);

          plugins.push({
            name: packageJson.name,
            version: packageJson.version,
            path: pluginPath,
            enabled: !disabledPlugins.includes(packageJson.name),
            global: isGlobal
          });
        }
      }
    }

    return plugins;
  }

  /**
   * Enable a plugin
   */
  async enablePlugin(pluginName: string): Promise<void> {
    const disabledPlugins = this.config.get('disabledPlugins') || [];
    const index = disabledPlugins.indexOf(pluginName);

    if (index > -1) {
      disabledPlugins.splice(index, 1);
      this.config.set('disabledPlugins', disabledPlugins);
      console.log(`✅ Plugin ${pluginName} enabled`);

      // Reload plugins
      await this.loadPlugins();
    }
  }

  /**
   * Disable a plugin
   */
  async disablePlugin(pluginName: string): Promise<void> {
    const disabledPlugins = this.config.get('disabledPlugins') || [];

    if (!disabledPlugins.includes(pluginName)) {
      disabledPlugins.push(pluginName);
      this.config.set('disabledPlugins', disabledPlugins);
      console.log(`✅ Plugin ${pluginName} disabled`);

      // Remove from loaded plugins
      const plugin = this.plugins.get(pluginName);
      if (plugin && plugin.cleanup) {
        await plugin.cleanup();
      }
      this.plugins.delete(pluginName);
    }
  }

  /**
   * Get plugin information
   */
  getPlugin(pluginName: string): Plugin | undefined {
    return this.plugins.get(pluginName);
  }

  /**
   * Get all loaded plugins
   */
  getAllPlugins(): Map<string, Plugin> {
    return this.plugins;
  }

  /**
   * Cleanup all plugins
   */
  async cleanup(): Promise<void> {
    for (const [name, plugin] of this.plugins) {
      if (plugin.cleanup) {
        try {
          await plugin.cleanup();
        } catch (error) {
          console.error(`Plugin ${name} cleanup failed:`, error);
        }
      }
    }

    this.plugins.clear();
  }
}
