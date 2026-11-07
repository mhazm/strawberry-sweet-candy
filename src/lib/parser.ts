import { SaveGameRoot } from '../types/savegame';

export interface ParseResult {
  success: boolean;
  data?: SaveGameRoot;
  error?: string;
}

export function parseSaveFile(content: string): ParseResult {
  try {
    const raw = JSON.parse(content);
    if (!raw || typeof raw !== 'object') {
      return { success: false, error: 'File is not a valid JSON object.' };
    }

    if (!raw.guild || typeof raw.guild !== 'object') {
      return { success: false, error: 'Missing "guild" object in save file.' };
    }

    if (!Array.isArray(raw.guild.roster)) {
      raw.guild.roster = [];
    }

    return {
      success: true,
      data: raw as SaveGameRoot,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `JSON parse error: ${err.message || String(err)}`,
    };
  }
}

export function exportSaveFile(save: SaveGameRoot): string {
  // Format with 2 spaces to preserve identical game save readability
  return JSON.stringify(save, null, 2);
}

export function downloadJsonFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

