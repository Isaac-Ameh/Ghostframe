// 🎃 GhostFrame CLI - Marketplace Commands
// Real API integration for marketplace operations

import chalk from 'chalk';
import ora from 'ora';
import { apiClient } from '../api/client';

export async function searchMarketplace(query: string, options: any): Promise<void> {
  const spinner = ora(`Searching for "${query}"...`).start();

  try {
    const result = await apiClient.searchModules(query, {
      category: options.category,
      limit: parseInt(options.limit) || 10
    });

    spinner.stop();

    if (result.modules.length === 0) {
      console.log(chalk.yellow('No modules found'));
      return;
    }

    console.log(chalk.cyan(`\n📦 Found ${result.total} modules:\n`));

    result.modules.forEach((module: any) => {
      console.log(chalk.white(`  ${module.name}`));
      console.log(chalk.gray(`    ${module.description}`));
      console.log(chalk.gray(`    ⭐ ${module.ratings.average.toFixed(1)} | ⬇️  ${module.marketplace.downloads} downloads`));
      console.log(chalk.blue(`    ghostframe registry install ${module.id}\n`));
    });
  } catch (error: any) {
    spinner.fail(chalk.red('Search failed'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

export async function installModule(moduleId: string, options: any): Promise<void> {
  const spinner = ora(`Installing ${moduleId}...`).start();

  try {
    const result = await apiClient.installModule(moduleId);

    spinner.succeed(chalk.green(`✅ ${moduleId} installed successfully!`));

    console.log(chalk.cyan('\n📋 Installation Instructions:'));
    result.instructions.steps.forEach((step: string, index: number) => {
      console.log(chalk.white(`  ${index + 1}. ${step}`));
    });

    console.log(chalk.cyan('\n💻 CLI Commands:'));
    result.instructions.cliCommands.forEach((cmd: string) => {
      console.log(chalk.gray(`  $ ${cmd}`));
    });
  } catch (error: any) {
    spinner.fail(chalk.red('Installation failed'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

export async function publishToMarketplace(moduleId: string, metadata: any): Promise<void> {
  const spinner = ora('Publishing module...').start();

  try {
    const result = await apiClient.publishModule({
      moduleId,
      marketplaceMetadata: metadata
    });

    if (result.status === 'published') {
      spinner.succeed(chalk.green('✅ Module published successfully!'));
      console.log(chalk.cyan(`\n🔗 Marketplace URL: ${result.marketplaceUrl}`));
    } else if (result.status === 'rejected') {
      spinner.fail(chalk.red('❌ Module rejected'));
      console.log(chalk.yellow('\nRejection reasons:'));
      result.rejectionReasons?.forEach((reason: string) => {
        console.log(chalk.red(`  • ${reason}`));
      });
    } else {
      spinner.warn(chalk.yellow('⏳ Module submitted for review'));
    }

    // Show checklist
    if (result.checklist) {
      console.log(chalk.cyan('\n📋 Publication Checklist:'));
      Object.entries(result.checklist).forEach(([key, item]: [string, any]) => {
        const icon = item.passed ? '✅' : '❌';
        console.log(`  ${icon} ${item.message}`);
      });
    }
  } catch (error: any) {
    spinner.fail(chalk.red('Publication failed'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}
