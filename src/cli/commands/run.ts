import { spawn } from 'child_process';
import chalk from 'chalk';
import { captureError } from '../../capture/error';
import { saveSnapshot } from '../../utils/storage';

interface RunOptions {
  verbose?: boolean;
}

export async function runCommand(command: string, options: RunOptions): Promise<void> {
  console.log(chalk.blue('Ghost Debugger is watching...'));
  console.log(chalk.gray(`Running: ${command}\n`));

  const startTime = Date.now();
  
  const childProcess = spawn(command, {
    shell: true,
    stdio: 'inherit',
    cwd: process.cwd(),
  });

  childProcess.on('exit', async (code) => {
    const duration = Date.now() - startTime;
    
    if (code === 0) {
      console.log(chalk.green(`\nCommand succeeded in ${duration}ms`));
    } else {
      console.log(chalk.red(`\nCommand failed with exit code ${code}`));
      console.log(chalk.yellow('Capturing error snapshot...'));

      try {
        const snapshot = await captureError(command, code || 1);
        await saveSnapshot(snapshot);
        
        console.log(chalk.green('Error captured successfully!'));
        console.log(chalk.cyan('\nRun "kilo-ghost fix" to diagnose and fix this error'));
      } catch (error) {
        console.error(chalk.red('Failed to capture error:'), error);
      }
    }
  });

  childProcess.on('error', (error) => {
    console.error(chalk.red('Failed to run command:'), error.message);
    process.exit(1);
  });
}
