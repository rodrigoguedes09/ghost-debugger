import chalk from 'chalk';
import { getAllSnapshots } from '../../utils/storage';

interface HistoryOptions {
  limit?: string;
}

export async function historyCommand(options: HistoryOptions): Promise<void> {
  const limit = parseInt(options.limit || '10');
  
  try {
    const snapshots = await getAllSnapshots(limit);
    
    if (snapshots.length === 0) {
      console.log(chalk.yellow('No error history found'));
      console.log(chalk.gray('Run commands with "kilo-ghost run" to start capturing errors'));
      return;
    }

    console.log(chalk.bold(`\nError History (last ${snapshots.length})\n`));
    
    for (let i = 0; i < snapshots.length; i++) {
      const snapshot = snapshots[i];
      const time = new Date(snapshot.timestamp).toLocaleString();
      
      console.log(chalk.gray(`[${i + 1}]`), chalk.cyan(time));
      console.log(chalk.gray('   Command:'), snapshot.command);
      console.log(chalk.gray('   Exit Code:'), chalk.red(snapshot.exitCode));
      console.log(chalk.gray('   Directory:'), snapshot.cwd);
      console.log();
    }
  } catch (error) {
    console.error(chalk.red('Failed to load history:'), error);
  }
}
