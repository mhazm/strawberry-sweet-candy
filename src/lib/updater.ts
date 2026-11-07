import { isTauri } from './tauri';

export interface UpdateInfo {
  version: string;
  currentVersion: string;
  body?: string;
  date?: string;
}

export type DownloadProgressCallback = (downloaded: number, total: number | null, percent: number) => void;

let activeUpdateHandle: any = null;

/**
 * Checks for updates using Tauri v2 Updater Plugin.
 * Returns update info if a new version is available, or null otherwise.
 */
export async function checkForUpdate(): Promise<UpdateInfo | null> {
  if (!isTauri()) {
    return null;
  }

  try {
    const { check } = await import('@tauri-apps/plugin-updater');
    const update = await check();

    if (!update || !update.available) {
      activeUpdateHandle = null;
      return null;
    }

    activeUpdateHandle = update;

    return {
      version: update.version,
      currentVersion: update.currentVersion,
      body: update.body || undefined,
      date: update.date || undefined,
    };
  } catch (err) {
    console.warn('[AutoUpdater] Failed to check for updates:', err);
    activeUpdateHandle = null;
    return null;
  }
}

/**
 * Downloads and installs the pending update, then relaunches the application.
 */
export async function installUpdate(onProgress?: DownloadProgressCallback): Promise<void> {
  if (!activeUpdateHandle) {
    throw new Error('No pending update to install');
  }

  let totalBytes: number | null = null;
  let downloadedBytes = 0;

  await activeUpdateHandle.downloadAndInstall((event: any) => {
    switch (event.event) {
      case 'Started':
        totalBytes = event.data.contentLength || null;
        if (onProgress) {
          onProgress(0, totalBytes, 0);
        }
        break;
      case 'Progress':
        downloadedBytes += event.data.chunkLength;
        if (onProgress) {
          const percent = totalBytes ? Math.min(100, Math.round((downloadedBytes / totalBytes) * 100)) : 50;
          onProgress(downloadedBytes, totalBytes, percent);
        }
        break;
      case 'Finished':
        if (onProgress) {
          onProgress(downloadedBytes, totalBytes, 100);
        }
        break;
    }
  });

  // Relaunch the application to finalize update
  try {
    const { relaunch } = await import('@tauri-apps/plugin-process');
    await relaunch();
  } catch (err) {
    console.error('[AutoUpdater] Failed to relaunch application:', err);
  }
}

