import { exec } from 'child_process';
import { promisify } from 'util';
import { GitContext } from '../types';

const execAsync = promisify(exec);

export async function captureGitContext(cwd: string): Promise<GitContext> {
  const git: GitContext = {
    branch: '',
    lastCommit: {
      hash: '',
      message: '',
      author: '',
      date: new Date(),
    },
    modifiedFiles: [],
    untrackedFiles: [],
    hasUncommittedChanges: false,
  };

  try {
    const branchResult = await execAsync('git rev-parse --abbrev-ref HEAD', { cwd });
    git.branch = branchResult.stdout.trim();

    const commitResult = await execAsync(
      'git log -1 --format=%H|%s|%an|%aI',
      { cwd }
    );
    const [hash, message, author, date] = commitResult.stdout.trim().split('|');
    git.lastCommit = {
      hash,
      message,
      author,
      date: new Date(date),
    };

    const modifiedResult = await execAsync('git diff --name-only', { cwd });
    git.modifiedFiles = modifiedResult.stdout
      .trim()
      .split('\n')
      .filter((f) => f.length > 0);

    const untrackedResult = await execAsync(
      'git ls-files --others --exclude-standard',
      { cwd }
    );
    git.untrackedFiles = untrackedResult.stdout
      .trim()
      .split('\n')
      .filter((f) => f.length > 0);

    git.hasUncommittedChanges =
      git.modifiedFiles.length > 0 || git.untrackedFiles.length > 0;
  } catch (error) {
    console.warn('Warning: Could not capture git context. Is this a git repository?');
  }

  return git;
}
