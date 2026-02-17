import chalk from 'chalk';
import inquirer from 'inquirer';
import { saveConfig, loadConfig } from '../../utils/config';

interface AuthOptions {
  token?: string;
}

export async function authCommand(options: AuthOptions): Promise<void> {
  console.log(chalk.bold('Ghost Debugger - Authentication\n'));

  let token = options.token;
  
  if (!token) {
    const answers = await inquirer.prompt([{
      type: 'input',
      name: 'token',
      message: 'Enter your Kilo API token:',
    }]);
    token = answers.token;
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
