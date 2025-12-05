// 🎃 GhostFrame CLI API Client
// HTTP client for communicating with GhostFrame backend

import axios, { AxiosInstance, AxiosError } from 'axios';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

interface APIConfig {
  apiUrl: string;
  apiKey?: string;
}

export class APIClient {
  private client: AxiosInstance;
  private config: APIConfig;
  private configPath: string;

  constructor() {
    this.configPath = path.join(os.homedir(), '.ghostframe', 'config.json');
    this.config = this.loadConfig();
    
    this.client = axios.create({
      baseURL: this.config.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
      }
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => this.handleError(error)
    );
  }

  private loadConfig(): APIConfig {
    try {
      if (fs.existsSync(this.configPath)) {
        return JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
      }
    } catch (error) {
      // Ignore errors, use default config
    }

    return {
      apiUrl: process.env.GHOSTFRAME_API_URL || 'http://localhost:3001/api'
    };
  }

  private saveConfig(config: APIConfig): void {
    try {
      fs.ensureDirSync(path.dirname(this.configPath));
      fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
      this.config = config;
      
      // Update client headers
      if (config.apiKey) {
        this.client.defaults.headers.common['Authorization'] = `Bearer ${config.apiKey}`;
      }
    } catch (error) {
      throw new Error(`Failed to save configuration: ${error}`);
    }
  }

  private handleError(error: AxiosError): Promise<never> {
    if (error.response) {
      // Server responded with error
      const message = (error.response.data as any)?.error || error.message;
      throw new Error(`API Error (${error.response.status}): ${message}`);
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Is the backend running?');
    } else {
      // Something else happened
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  // ============================================================================
  // Authentication
  // ============================================================================

  async login(apiKey: string): Promise<boolean> {
    try {
      const response = await this.client.post('/auth/verify', { apiKey });
      if (response.data.valid) {
        this.saveConfig({ ...this.config, apiKey });
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(`Login failed: ${error}`);
    }
  }

  logout(): void {
    this.saveConfig({ ...this.config, apiKey: undefined });
  }

  // ============================================================================
  // Module Management
  // ============================================================================

  async publishModule(moduleData: any): Promise<any> {
    const response = await this.client.post('/marketplace/publish', moduleData);
    return response.data;
  }

  async getModuleStatus(moduleId: string): Promise<any> {
    const response = await this.client.get(`/marketplace/modules/${moduleId}`);
    return response.data;
  }

  async validateModule(moduleData: any): Promise<any> {
    const response = await this.client.post('/modules/validate', moduleData);
    return response.data;
  }

  // ============================================================================
  // Registry Operations
  // ============================================================================

  async searchRegistry(query: string, options: any = {}): Promise<any> {
    const params = new URLSearchParams({ query, ...options });
    const response = await this.client.get(`/marketplace/modules?${params}`);
    return response.data;
  }

  async installModule(moduleId: string): Promise<any> {
    const response = await this.client.post(`/marketplace/modules/${moduleId}/install`, {});
    return response.data;
  }

  async getFeaturedModules(): Promise<any> {
    const response = await this.client.get('/marketplace/featured');
    return response.data;
  }

  // ============================================================================
  // Module Deployment
  // ============================================================================

  async deployModule(moduleId: string, environment: string, version: string): Promise<any> {
    const response = await this.client.post('/modules/deploy', {
      moduleId,
      environment,
      version
    });
    return response.data;
  }

  async getDeploymentStatus(deploymentId: string): Promise<any> {
    const response = await this.client.get(`/modules/deployments/${deploymentId}`);
    return response.data;
  }

  async getModuleLogs(moduleId: string, options: any = {}): Promise<any> {
    const params = new URLSearchParams(options);
    const response = await this.client.get(`/modules/${moduleId}/logs?${params}`);
    return response.data;
  }

  // ============================================================================
  // Templates
  // ============================================================================

  async getTemplates(): Promise<any> {
    const response = await this.client.get('/templates');
    return response.data;
  }

  async getTemplate(templateId: string): Promise<any> {
    const response = await this.client.get(`/templates/${templateId}`);
    return response.data;
  }

  // ============================================================================
  // Configuration
  // ============================================================================

  getConfig(): APIConfig {
    return { ...this.config };
  }

  setConfig(key: string, value: string): void {
    this.saveConfig({ ...this.config, [key]: value });
  }

  // ============================================================================
  // Health Check
  // ============================================================================

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

// Singleton instance
let apiClient: APIClient | null = null;

export function getAPIClient(): APIClient {
  if (!apiClient) {
    apiClient = new APIClient();
  }
  return apiClient;
}
