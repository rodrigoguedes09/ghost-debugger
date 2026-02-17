import { mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import { KiloConfig } from '../types';

const GHOST_DIR = join(homedir(), '.kilo-ghost');
const CONFIG_FILE = join(GHOST_DIR, 'config.json');

const DEFAULT_CONFIG: KiloConfig = {
  apiUrl: 'https://api.kilo.ai',
  timeout: 30000,
  saveHistory: true,
  maxSnapshots: 10,
};

async function ensureDirectory(): Promise<void> {
  try {
    await mkdir(GHOST_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

export async function loadConfig(): Promise<KiloConfig> {
  await ensureDirectory();

  try {
    const content = await readFile(CONFIG_FILE, 'utf-8');
    const config = JSON.parse(content);
    return { ...DEFAULT_CONFIG, ...config };
  } catch (error) {
    return { ...DEFAULT_CONFIG };
  }
}

export async function saveConfig(config: Partial<KiloConfig>): Promise<void> {
  await ensureDirectory();

  const currentConfig = await loadConfig();
  const newConfig = { ...currentConfig, ...config };

  await writeFile(CONFIG_FILE, JSON.stringify(newConfig, null, 2), 'utf-8');
}
