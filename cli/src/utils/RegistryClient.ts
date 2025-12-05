// 🎃 GhostFrame CLI Registry Client
// Handles interactions with GhostFrame Module Registry

import axios, { AxiosInstance } from 'axios';
import fs from 'fs-extra';
import path from 'path';

export interface PublishOptions {
  moduleConfig: any;
  tag: string;
}

export interface PublishResult {
  name: string;
  version: string;
  url: string;
  moduleId: string;
}

export interface SearchOptions {
  query: string;
  category?: string;
  author?: string;
  limit: number;
}

export interface SearchResult {
  modules: Array<{
    id: string;
    name: string;
    version: string;
    description: string;
    author: string;
    category: string;
    rating: number;
    downloads: number;
  }>;
  total: number;
}

export interface ModuleInfo {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  analytics?: {
    downloads: number;
    activeUsers: number;
    executions: number;
    rating: number;
  };
  validation?: {
    status: string;
    score: number;
    lastValidated: string;
  };
}

export interface InstallOptions {
  moduleId: string;
  saveDev: boolean;
}

export interface InstallResult {
  name: string;
  version: string;
  installed: boolean;
}

export class RegistryClient {
  private apiClient: AxiosInstance;
  private registryUrl: string;

  constructor() {
    this.registryUrl = process.env.GHOSTFRAME_REGISTRY_URL || 'http://localhost:3001/api';
    
    this.apiClient = axios.create({
      baseURL: this.registryUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'GhostFrame-CLI/1.0.0'
      }
    });

    this.setupInterceptors();
  }

  /**
   * Publish module to registry
   */
  async publishModule(options: PublishOptions): Promise<PublishResult> {
    try {
      // Prepare module package
      const packageData = await this.prepareModulePackage(options.moduleConfig);

      // Upload to registry
      const response = await this.apiClient.post('/modules/management', {
        ...packageData,
        tag: options.tag
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Publish failed');
      }

      const module = response.data.data.module;

      return {
        name: module.name,
        version: module.version,
        url: `${this.registryUrl}/modules/${module.id}`,
        moduleId: module.id
      };

    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Registry error: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Search modules in registry
   */
  async searchModules(options: SearchOptions): Promise<SearchResult> {
    try {
      const params: any = {
        search: options.query,
        limit: options.limit
      };

      if (options.category) params.domain = options.category;
      if (options.author) params.author = options.author;

      const response = await this.apiClient.get('/modules/management', { params });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Search failed');
      }

      const data = response.data.data;

      return {
        modules: data.modules.map((m: any) => ({
          id: m.id,
          name: m.name,
          version: m.version,
          description: m.description,
          author: m.author,
          category: m.category,
          rating: m.rating || 0,
          downloads: m.downloads || 0
        })),
        total: data.pagination?.total || data.modules.length
      };

    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Search error: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get module information
   */
  async getModuleInfo(moduleId: string): Promise<ModuleInfo> {
    try {
      const response = await this.apiClient.get(`/modules/management/${moduleId}`);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to get module info');
      }

      const module = response.data.data.module;

      return {
        id: module.id,
        name: module.name,
        version: module.version,
        description: module.description,
        author: module.author,
        category: module.category,
        createdAt: module.createdAt,
        updatedAt: module.updatedAt,
        analytics: module.analytics,
        validation: module.validation
      };

    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Module info error: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Install module from registry
   */
  async installModule(options: InstallOptions): Promise<InstallResult> {
    try {
      // Get module info
      const moduleInfo = await this.getModuleInfo(options.moduleId);

      // Download and install module
      // In a real implementation, this would download the module package
      // and install it in the local project

      // For now, we'll simulate the installation
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        
        const depKey = options.saveDev ? 'devDependencies' : 'dependencies';
        if (!packageJson[depKey]) {
          packageJson[depKey] = {};
        }

        packageJson[depKey][moduleInfo.name] = `^${moduleInfo.version}`;
        
        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
      }

      return {
        name: moduleInfo.name,
        version: moduleInfo.version,
        installed: true
      };

    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Install error: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Unpublish module from registry
   */
  async unpublishModule(moduleId: string): Promise<void> {
    try {
      const response = await this.apiClient.post(`/modules/management/${moduleId}/unpublish`);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Unpublish failed');
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Unpublish error: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get module download URL
   */
  async getModuleDownloadUrl(moduleId: string, version?: string): Promise<string> {
    const versionParam = version ? `?version=${version}` : '';
    return `${this.registryUrl}/modules/${moduleId}/download${versionParam}`;
  }

  /**
   * Check if module exists in registry
   */
  async moduleExists(moduleId: string): Promise<boolean> {
    try {
      await this.getModuleInfo(moduleId);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Private methods

  private async prepareModulePackage(moduleConfig: any): Promise<any> {
    // Read package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);

    // Prepare module data
    return {
      id: moduleConfig.id,
      name: moduleConfig.name || packageJson.name,
      version: moduleConfig.version || packageJson.version,
      description: moduleConfig.description || packageJson.description,
      author: packageJson.author || 'Unknown',
      category: moduleConfig.category,
      kiroCompatibility: moduleConfig.kiroCompatibility,
      config: moduleConfig.config,
      specs: moduleConfig.specs,
      hooks: moduleConfig.hooks,
      steering: moduleConfig.steering,
      keywords: packageJson.keywords || [],
      license: packageJson.license || 'MIT',
      repository: packageJson.repository,
      homepage: packageJson.homepage
    };
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.apiClient.interceptors.request.use((config) => {
      // Try to get auth token from config file
      const configPath = path.join(require('os').homedir(), '.ghostframe', 'config.json');
      
      try {
        if (fs.existsSync(configPath)) {
          const cliConfig = fs.readJsonSync(configPath);
          
          if (cliConfig.authToken) {
            config.headers.Authorization = `Bearer ${cliConfig.authToken}`;
          } else if (cliConfig.apiKey) {
            config.headers['X-API-Key'] = cliConfig.apiKey;
          }
        }
      } catch (error) {
        // Ignore config read errors
      }

      return config;
    });

    // Response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error('Authentication required. Please run: ghostframe login');
        } else if (error.response?.status === 403) {
          console.error('Access denied. Check your permissions.');
        } else if (error.response?.status === 404) {
          console.error('Resource not found.');
        } else if (error.response?.status >= 500) {
          console.error('Registry server error. Please try again later.');
        }
        
        return Promise.reject(error);
      }
    );
  }
}
