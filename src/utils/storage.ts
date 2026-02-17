import { mkdir, writeFile, readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import { ErrorSnapshot, GhostPackage } from '../types';

const GHOST_DIR = join(homedir(), '.kilo-ghost');
const SNAPSHOTS_DIR = join(GHOST_DIR, 'snapshots');
const MAX_SNAPSHOTS = 10;

interface StoredSnapshot {
  snapshot: ErrorSnapshot;
  ghostPackage: GhostPackage;
  timestamp: Date;
}

async function ensureDirectory(): Promise<void> {
  try {
    await mkdir(SNAPSHOTS_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

export async function saveSnapshot(data: {
  snapshot: ErrorSnapshot;
  ghostPackage: GhostPackage;
}): Promise<void> {
  await ensureDirectory();

  const stored: StoredSnapshot = {
    ...data,
    timestamp: data.snapshot.timestamp,
  };

  const filename = `snapshot-${data.snapshot.id}.json`;
  const filepath = join(SNAPSHOTS_DIR, filename);

  await writeFile(filepath, JSON.stringify(stored, null, 2), 'utf-8');

  await cleanOldSnapshots();
}

export async function getLastSnapshot(): Promise<StoredSnapshot | null> {
  await ensureDirectory();

  try {
    const files = await readdir(SNAPSHOTS_DIR);
    const snapshotFiles = files.filter((f) => f.startsWith('snapshot-'));

    if (snapshotFiles.length === 0) {
      return null;
    }

    const snapshots: Array<{ file: string; data: StoredSnapshot }> = [];

    for (const file of snapshotFiles) {
      try {
        const content = await readFile(join(SNAPSHOTS_DIR, file), 'utf-8');
        const data = JSON.parse(content);
        snapshots.push({ file, data });
      } catch (error) {
        console.warn(`Warning: Could not read snapshot ${file}`);
      }
    }

    snapshots.sort((a, b) => {
      const dateA = new Date(a.data.timestamp).getTime();
      const dateB = new Date(b.data.timestamp).getTime();
      return dateB - dateA;
    });

    return snapshots[0]?.data || null;
  } catch (error) {
    return null;
  }
}

export async function getAllSnapshots(limit: number = MAX_SNAPSHOTS): Promise<ErrorSnapshot[]> {
  await ensureDirectory();

  try {
    const files = await readdir(SNAPSHOTS_DIR);
    const snapshotFiles = files.filter((f) => f.startsWith('snapshot-'));

    const snapshots: Array<{ data: StoredSnapshot }> = [];

    for (const file of snapshotFiles) {
      try {
        const content = await readFile(join(SNAPSHOTS_DIR, file), 'utf-8');
        const data = JSON.parse(content);
        snapshots.push({ data });
      } catch (error) {
        // Skip invalid snapshots
      }
    }

    snapshots.sort((a, b) => {
      const dateA = new Date(a.data.timestamp).getTime();
      const dateB = new Date(b.data.timestamp).getTime();
      return dateB - dateA;
    });

    return snapshots.slice(0, limit).map((s) => s.data.snapshot);
  } catch (error) {
    return [];
  }
}

async function cleanOldSnapshots(): Promise<void> {
  try {
    const files = await readdir(SNAPSHOTS_DIR);
    const snapshotFiles = files.filter((f) => f.startsWith('snapshot-'));

    if (snapshotFiles.length <= MAX_SNAPSHOTS) {
      return;
    }

    const snapshots: Array<{ file: string; data: StoredSnapshot }> = [];

    for (const file of snapshotFiles) {
      try {
        const content = await readFile(join(SNAPSHOTS_DIR, file), 'utf-8');
        const data = JSON.parse(content);
        snapshots.push({ file, data });
      } catch (error) {
        // Skip invalid files
      }
    }

    snapshots.sort((a, b) => {
      const dateA = new Date(a.data.timestamp).getTime();
      const dateB = new Date(b.data.timestamp).getTime();
      return dateB - dateA;
    });

    const toDelete = snapshots.slice(MAX_SNAPSHOTS);
    const fs = await import('fs/promises');
    
    for (const snapshot of toDelete) {
      await fs.unlink(join(SNAPSHOTS_DIR, snapshot.file));
    }
  } catch (error) {
    console.warn('Warning: Could not clean old snapshots');
  }
}
