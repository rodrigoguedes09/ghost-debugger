import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ErrorSnapshot, GhostPackage } from '../types';
import { captureGitContext } from './git';
import { captureEnvContext } from './env';
import { parseStackTrace } from './stacktrace';
import { extractRelevantFiles } from './files';

const execAsync = promisify(exec);

export async function captureError(
  command: string,
  exitCode: number
): Promise<{ snapshot: ErrorSnapshot; ghostPackage: GhostPackage }> {
  const id = uuidv4();
  const timestamp = new Date();
  const cwd = process.cwd();

  let stdout = '';
  let stderr = '';

  try {
    const result = await execAsync(command, { cwd });
    stdout = result.stdout;
    stderr = result.stderr;
  } catch (error: any) {
    stdout = error.stdout || '';
    stderr = error.stderr || '';
  }

  const snapshot: ErrorSnapshot = {
    id,
    command,
    exitCode,
    stdout,
    stderr,
    timestamp,
    cwd,
  };

  const git = await captureGitContext(cwd);
  const environment = await captureEnvContext(cwd);
  const stackTrace = parseStackTrace(stderr || stdout);
  const relevantFiles = await extractRelevantFiles(stackTrace, cwd);

  const ghostPackage: GhostPackage = {
    snapshot,
    git,
    environment,
    stackTrace,
    relevantFiles,
    metadata: {
      version: '1.0.0',
      capturedAt: timestamp,
    },
  };

  return { snapshot, ghostPackage };
}
