// 🎃 GhostFrame Analytics Plugin
// Tracks module build stats and provides insights

const fs = require('fs-extra');
const path = require('path');
const os = require('os');

class AnalyticsPlugin {
  constructor() {
    this.analyticsFile = path.join(
      os.homedir(),
      '.ghostframe',
      'analytics.json'
    );
    this.stats = {
      builds: 0,
      tests: 0,
      validations: 0,
      publishes: 0,
      modules: {},
      lastActivity: null
    };
  }

  async initialize() {
    console.log('📊 Analytics plugin initialized');
    await this.loadStats();
  }

  async loadStats() {
    try {
      if (await fs.pathExists(this.analyticsFile)) {
        this.stats = await fs.readJson(this.analyticsFile);
      }
    } catch (error) {
      console.warn('Failed to load analytics:', error.message);
    }
  }

  async saveStats() {
    try {
      await fs.ensureDir(path.dirname(this.analyticsFile));
      await fs.writeJson(this.analyticsFile, this.stats, { spaces: 2 });
    } catch (error) {
      console.warn('Failed to save analytics:', error.message);
    }
  }

  async trackEvent(event, data) {
    this.stats.lastActivity = new Date().toISOString();
    
    switch (event) {
      case 'build':
        this.stats.builds++;
        break;
      case 'test':
        this.stats.tests++;
        break;
      case 'validate':
        this.stats.validations++;
        break;
      case 'publish':
        this.stats.publishes++;
        break;
    }

    // Track per-module stats
    if (data && data.moduleId) {
      if (!this.stats.modules[data.moduleId]) {
        this.stats.modules[data.moduleId] = {
          builds: 0,
          tests: 0,
          validations: 0,
          publishes: 0,
          created: new Date().toISOString()
        };
      }
      
      if (event === 'build') this.stats.modules[data.moduleId].builds++;
      if (event === 'test') this.stats.modules[data.moduleId].tests++;
      if (event === 'validate') this.stats.modules[data.moduleId].validations++;
      if (event === 'publish') this.stats.modules[data.moduleId].publishes++;
    }

    await this.saveStats();
  }

  async cleanup() {
    await this.saveStats();
    console.log('📊 Analytics plugin cleaned up');
  }
}

const analyticsPlugin = new AnalyticsPlugin();

module.exports = {
  metadata: {
    name: 'ghostframe-plugin-analytics',
    version: '1.0.0',
    description: 'Analytics plugin for GhostFrame CLI',
    author: 'GhostFrame Team',
    homepage: 'https://ghostframe.dev/plugins/analytics'
  },

  hooks: {
    async afterInit(context) {
      console.log('📊 Tracking module initialization...');
      await analyticsPlugin.trackEvent('init', {
        moduleId: context.moduleId,
        template: context.template
      });
    },

    async afterBuild(context) {
      console.log('📊 Tracking build...');
      await analyticsPlugin.trackEvent('build', {
        moduleId: context.moduleId,
        duration: context.duration
      });
    },

    async afterTest(context) {
      console.log('📊 Tracking test run...');
      await analyticsPlugin.trackEvent('test', {
        moduleId: context.moduleId,
        passed: context.passed,
        failed: context.failed
      });
    },

    async onValidate(context) {
      console.log('📊 Tracking validation...');
      await analyticsPlugin.trackEvent('validate', {
        moduleId: context.moduleId,
        score: context.score
      });
    },

    async afterPublish(context) {
      console.log('📊 Tracking publish...');
      await analyticsPlugin.trackEvent('publish', {
        moduleId: context.moduleId,
        version: context.version
      });
    }
  },

  async initialize() {
    await analyticsPlugin.initialize();
  },

  async cleanup() {
    await analyticsPlugin.cleanup();
  },

  // Expose analytics data
  getStats() {
    return analyticsPlugin.stats;
  }
};
