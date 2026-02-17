import chalk from 'chalk';
import ora from 'ora';
import { getLastSnapshot } from '../../utils/storage';
import { KiloClient } from '../../api/kilo';
import { loadConfig } from '../../utils/config';

interface FixOptions {
  apply?: boolean;
  preview?: boolean;
  timeout?: string;
}

export async function fixCommand(options: FixOptions): Promise<void> {
  const spinner = ora('Loading last error snapshot...').start();

  try {
    const snapshot = await getLastSnapshot();
    
    if (!snapshot) {
      spinner.fail('No error snapshot found');
      console.log(chalk.yellow('Run a command with "kilo-ghost run <command>" first'));
      return;
    }

    spinner.succeed('Snapshot loaded');
    
    const config = await loadConfig();
    if (!config.apiKey) {
      console.log(chalk.red('API key not configured'));
      console.log(chalk.yellow('Run "kilo-ghost auth --token YOUR_TOKEN" first'));
      return;
    }

    const client = new KiloClient(config);
    
    spinner.start('Sending to Kilo Cloud Agent...');
    const agentId = await client.spawnCloudAgent(snapshot.ghostPackage);
    spinner.succeed(`Cloud Agent spawned: ${agentId}`);

    spinner.start('Agent is reproducing the error...');
    
    const timeout = parseInt(options.timeout || '30') * 1000;
    const result = await client.waitForResult(agentId, timeout);

    if (result.status === 'failed') {
      spinner.fail('Agent failed to reproduce the error');
      console.log(chalk.red(result.message));
      return;
    }

    spinner.succeed('Error reproduced and analyzed!');
    
    console.log(chalk.bold('\n--- Diagnosis ---'));
    console.log(chalk.yellow('Root Cause:'), result.rootCause);
    console.log(chalk.gray('\n' + result.explanation));
    
    if (result.suggestedFix && result.suggestedFix.length > 0) {
      console.log(chalk.bold('\n--- Suggested Fix ---'));
      console.log(chalk.cyan(`Confidence: ${result.confidence}%`));
      
      for (const fix of result.suggestedFix) {
        console.log(chalk.bold(`\nFile: ${fix.file}`));
        console.log(fix.unified);
      }

      if (options.apply) {
        spinner.start('Applying fix...');
        await applyFixes(result.suggestedFix);
        spinner.succeed('Fix applied successfully!');
      } else if (!options.preview) {
        console.log(chalk.cyan('\nRun with --apply to apply this fix automatically'));
      }
    }
  } catch (error) {
    spinner.fail('Failed to fix error');
    console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
  }
}

async function applyFixes(fixes: any[]): Promise<void> {
  const fs = await import('fs/promises');
  
  for (const fix of fixes) {
    await fs.writeFile(fix.file, fix.newContent, 'utf-8');
  }
}
