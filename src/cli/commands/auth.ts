import chalk from 'chalk';
import { input } from '@inquirer/prompts';
import { saveConfig, loadConfig } from '../../utils/config';

interface AuthOptions {
  token?: string;
}

export async function authCommand(options: AuthOptions): Promise<void> {
  console.log(chalk.bold('Ghost Debugger - Authentication\n'));

  let token = options.token;
  
  if (!token) {
    token = await input({
      message: 'Enter your Kilo API token:',
    });
  }

  if (!token || token.trim() === '') {
    console.log(chalk.red('Token is required'));
    return;
  }

  try {
    const config = await loadConfig();
    config.apiKey = token.trim();
    await saveConfig(config);
    
    console.log(chalk.green('\nAuthentication configured successfully!'));
    console.log(chalk.gray('You can now use "kilo-ghost fix" to diagnose errors'));
  } catch (error) {
    console.error(chalk.red('Failed to save configuration:'), error);
  }
}
