import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { EnvContext } from '../types';

const execAsync = promisify(exec);

export async function captureEnvContext(cwd: string): Promise<EnvContext> {
  const env: EnvContext = {
    packageManager: 'unknown',
    dependencies: {},
    envVars: {},
    platform: process.platform,
    arch: process.arch,
  };

  try {
    const nodeResult = await execAsync('node --version');
    env.nodeVersion = nodeResult.stdout.trim();
  } catch {
    // Node not in PATH
  }

  try {
    const pythonResult = await execAsync('python --version');
    env.pythonVersion = pythonResult.stdout.trim();
  } catch {
    try {
      const python3Result = await execAsync('python3 --version');
      env.pythonVersion = python3Result.stdout.trim();
    } catch {
      // Python not in PATH
    }
  }

  try {
    const packageJson = await readFile(join(cwd, 'package.json'), 'utf-8');
    const pkg = JSON.parse(packageJson);
    env.dependencies = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };
    env.packageManager = await detectPackageManager(cwd);
  } catch {
    // Not a Node.js project
  }

  try {
    const requirementsTxt = await readFile(join(cwd, 'requirements.txt'), 'utf-8');
    const deps = requirementsTxt
      .split('\n')
      .filter((line) => line.trim() && !line.startsWith('#'))
      .reduce((acc, line) => {
        const [pkg, version] = line.split('==');
        if (pkg && version) {
          acc[pkg.trim()] = version.trim();
        }
        return acc;
      }, {} as Record<string, string>);
    env.dependencies = { ...env.dependencies, ...deps };
    env.packageManager = 'pip';
  } catch {
    // Not a Python project with requirements.txt
  }

  const filteredEnvVars = Object.entries(process.env)
    .filter(([key]) => {
      const lowerKey = key.toLowerCase();
      return !lowerKey.includes('secret') && 
             !lowerKey.includes('password') && 
             !lowerKey.includes('token') &&
             !lowerKey.includes('key');
    })
    .reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

  env.envVars = filteredEnvVars;

  return env;
}

async function detectPackageManager(cwd: string): Promise<EnvContext['packageManager']> {
  try {
    await readFile(join(cwd, 'yarn.lock'), 'utf-8');
    return 'yarn';
  } catch {
    // Not yarn
  }

  try {
    await readFile(join(cwd, 'pnpm-lock.yaml'), 'utf-8');
    return 'pnpm';
  } catch {
    // Not pnpm
  }

  try {
    await readFile(join(cwd, 'package-lock.json'), 'utf-8');
    return 'npm';
  } catch {
    // Not npm
  }

  return 'unknown';
}
