#!/usr/bin/env node

// 🎃 GhostFrame CLI - Professional Developer Tool
// Modern TypeScript CLI for GhostFrame module development

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import { GhostFrameCLI } from './GhostFrameCLI';
import { getAPIClient } from './api/client';

const program = new Command();
const cli = new GhostFrameCLI();

program
  .name('ghostframe')
  .description('🎃 GhostFrame CLI - Where dead tech learns new tricks!')
  .version('1.0.0');

// Initialize command
program
  .command('init')
  .description('Initialize a new GhostFrame module')
  .option('-t, --template <type>', 'Module template (education, creative, productivity, research)', 'education')
  .option('-n, --name <name>', 'Module name')
  .option('--skip-install', 'Skip npm install')
  .action(async (options) => {
    await cli.initModule(options);
  });

// Development server command
program
  .command('dev')
  .description('Start development server with live reload')
  .option('-p, --port <port>', 'Port number', '3000')
  .option('--watch', 'Enable file watching', true)
  .action(async (options) => {
    await cli.startDev(options);
  });

// Validation command
program
  .command('validate')
  .description('Run Kiro compliance validation on module')
  .option('-s, --strict', 'Enable strict validation mode')
  .option('--performance', 'Include performance benchmarks', true)
  .option('--security', 'Include security scanning', true)
  .action(async (options) => {
    await cli.validateModule(options);
  });

// Publish command
program
  .command('publish')
  .description('Publish module to GhostFrame Registry')
  .option('--dry-run', 'Simulate publish without actually publishing')
  .option('--tag <tag>', 'Publish with specific tag', 'latest')
  .action(async (options) => {
    await cli.publishModule(options);
  });

// Test command
program
  .command('test')
  .description('Run module tests')
  .option('--watch', 'Run tests in watch mode')
  .option('--coverage', 'Generate coverage report')
  .option('--verbose', 'Verbose output')
  .action(async (options) => {
    await cli.runTests(options);
  });

// Info command
program
  .command('info')
  .description('Show module analytics and status')
  .option('--analytics', 'Show detailed analytics')
  .option('--validation', 'Show validation status')
  .action(async (options) => {
    await cli.showModuleInfo(options);
  });

// Login command
program
  .command('login')
  .description('Authenticate with GhostFrame')
  .option('--api-key <key>', 'Use API key for authentication')
  .action(async (options) => {
    await cli.login(options);
  });

// Logout command
program
  .command('logout')
  .description('Clear authentication credentials')
  .action(async () => {
    await cli.logout();
  });

// Create command (alias for init)
program
  .command('create <name>')
  .description('Create a new GhostFrame module')
  .option('-t, --template <type>', 'Module template', 'education')
  .action(async (name, options) => {
    await cli.initModule({ ...options, name });
  });

// Build command
program
  .command('build')
  .description('Build module for production')
  .option('--minify', 'Minify output')
  .option('--source-maps', 'Generate source maps')
  .action(async (options) => {
    await cli.buildModule(options);
  });

// Registry commands
const registryCmd = program
  .command('registry')
  .description('Interact with GhostFrame Registry');

registryCmd
  .command('search <query>')
  .description('Search modules in registry')
  .option('-c, --category <category>', 'Filter by category')
  .option('-a, --author <author>', 'Filter by author')
  .option('--limit <limit>', 'Limit results', '10')
  .action(async (query, options) => {
    await cli.searchRegistry(query, options);
  });

registryCmd
  .command('install <moduleId>')
  .description('Install module from registry')
  .option('--save-dev', 'Save as dev dependency')
  .action(async (moduleId, options) => {
    await cli.installModule(moduleId, options);
  });

// Config commands
const configCmd = program
  .command('config')
  .description('Manage CLI configuration');

configCmd
  .command('set <key> <value>')
  .description('Set configuration value')
  .action(async (key, value) => {
    await cli.setConfig(key, value);
  });

configCmd
  .command('get <key>')
  .description('Get configuration value')
  .action(async (key) => {
    await cli.getConfig(key);
  });

configCmd
  .command('list')
  .description('List all configuration')
  .action(async () => {
    await cli.listConfig();
  });

// Plugin commands
const pluginCmd = program
  .command('plugin')
  .description('Manage CLI plugins');

pluginCmd
  .command('install <name>')
  .description('Install a plugin')
  .option('--global', 'Install globally', true)
  .option('--version <version>', 'Specific version')
  .action(async (name, options) => {
    await cli.installPlugin(name, options);
  });

pluginCmd
  .command('list')
  .description('List installed plugins')
  .action(async () => {
    await cli.listPlugins();
  });

pluginCmd
  .command('remove <name>')
  .description('Remove a plugin')
  .option('--global', 'Remove from global', true)
  .action(async (name, options) => {
    await cli.removePlugin(name, options);
  });

pluginCmd
  .command('enable <name>')
  .description('Enable a plugin')
  .action(async (name) => {
    await cli.enablePlugin(name);
  });

pluginCmd
  .command('disable <name>')
  .description('Disable a plugin')
  .action(async (name) => {
    await cli.disablePlugin(name);
  });

// AI Module Generation
program
  .command('create-ai')
  .description('Generate module using AI from natural language description')
  .argument('[description]', 'Module description')
  .action(async (description) => {
    await cli.createAIModule(description);
  });

// Error handling
program.exitOverride();

try {
  program.parse();
} catch (err) {
  console.error(chalk.red('❌ CLI Error:'), err instanceof Error ? err.message : err);
  process.exit(1);
}