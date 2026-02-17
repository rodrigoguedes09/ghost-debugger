#!/usr/bin/env node

import { Command } from 'commander';
import { runCommand } from './commands/run';
import { fixCommand } from './commands/fix';
import { authCommand } from './commands/auth';
import { historyCommand } from './commands/history';

const program = new Command();

program
  .name('kilo-ghost')
  .description('Ghost Debugger - Auto-exorcism for bugs')
  .version('1.0.0');

program
  .command('run <command>')
  .description('Run a command and capture errors if it fails')
  .option('-v, --verbose', 'Verbose output')
  .action(runCommand);

program
  .command('fix')
  .description('Fix the last captured error')
  .option('--apply', 'Apply the fix automatically')
  .option('--preview', 'Preview the fix without applying')
  .option('--timeout <seconds>', 'Timeout for agent response', '30')
  .action(fixCommand);

program
  .command('auth')
  .description('Configure Kilo API authentication')
  .option('--token <token>', 'API token')
  .action(authCommand);

program
  .command('history')
  .description('Show history of captured errors')
  .option('-n, --limit <number>', 'Number of entries to show', '10')
  .action(historyCommand);

program.parse(process.argv);
