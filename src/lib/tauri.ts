export interface BackupFileInfo {
  name: string;
  path: string;
  modified: number;
  size: number;
}

export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

export async function getBackupsDir(): Promise<string | null> {
  if (!isTauri()) return null;
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    return await invoke<string | null>('get_backups_dir');
  } catch (err) {
    console.warn('Tauri get_backups_dir error:', err);
    return null;
  }
}

export async function listGameBackups(): Promise<BackupFileInfo[]> {
  if (!isTauri()) return [];
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    return await invoke<BackupFileInfo[]>('list_game_backups');
  } catch (err) {
    console.warn('Tauri list_game_backups error:', err);
    return [];
  }
}

export async function readSaveFileTauri(path: string): Promise<string | null> {
  if (!isTauri()) return null;
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    return await invoke<string>('read_save_file', { path });
  } catch (err) {
    console.warn('Tauri read_save_file error:', err);
    return null;
  }
}

export async function writeSaveFileTauri(
  path: string,
  content: string,
  makeBackup = true
): Promise<string | null> {
  if (!isTauri()) return null;
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    return await invoke<string>('write_save_file', { path, content, makeBackup });
  } catch (err) {
    console.error('Tauri write_save_file error:', err);
    throw err;
  }
}
