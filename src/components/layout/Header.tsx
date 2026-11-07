import React from 'react';
import {
  Shield,
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  FolderOpen,
  FileCheck,
  XCircle,
  Coins,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { SaveGameRoot } from '../../types/savegame';
import { formatGold } from '../../lib/utils';
import { isTauri, listGameBackups, BackupFileInfo } from '../../lib/tauri';

interface HeaderProps {
  saveData: SaveGameRoot | null;
  filename: string;
  isModified: boolean;
  onOpenFile: () => void;
  onSaveFile: () => void;
  onExportDownload: () => void;
  onReset: () => void;
  onSelectBackup?: (backup: BackupFileInfo) => void;
  onCloseSave?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  saveData,
  filename,
  isModified,
  onOpenFile,
  onSaveFile,
  onExportDownload,
  onReset,
  onSelectBackup,
  onCloseSave,
}) => {
  const [backups, setBackups] = React.useState<BackupFileInfo[]>([]);
  const [showBackupList, setShowBackupList] = React.useState(false);

  React.useEffect(() => {
    if (isTauri()) {
      listGameBackups().then((files) => setBackups(files));
    }
  }, []);

  const guild = saveData?.guild;

  return (
    <header className="sticky top-0 z-40 bg-[#16131c]/95 backdrop-blur-md border-b border-[#2d2333] px-6 py-3 shadow-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: App Logo & Guild Status matching In-Game Header */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#2f2214] via-[#1c150e] to-[#120e09] border border-[#594426] shadow-[0_0_15px_rgba(223,177,91,0.25)]">
            <Shield className="w-6 h-6 text-[#dfb15b]" />
            <Sparkles className="w-3.5 h-3.5 text-[#f5cb71] absolute -top-1 -right-1" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-rpg font-bold tracking-wide text-lg text-[#f0e8db] flex items-center gap-2">
                Dungeons & Dynasties
                <span className="text-[10px] font-sans uppercase font-bold px-2 py-0.5 rounded bg-[#2c2012] text-[#dfb15b] border border-[#594426]">
                  Save Editor
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#8e8273] mt-0.5">
              {guild ? (
                <>
                  <span className="text-[#dfb15b] font-semibold">{guild.name}</span>
                  <span className="text-[#4a3f32]">•</span>
                  <span>Day {guild.day}</span>
                  <span className="text-[#4a3f32]">•</span>
                  <span>{guild.roster?.length || 0} Delvers</span>
                  <span className="text-[#4a3f32]">•</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-[#20180f] border border-[#44331d] text-[#f5cb71] font-mono font-bold text-[11px]">
                    <Coins className="w-3 h-3 text-[#f5cb71]" />
                    {formatGold(guild.gold)}g
                  </span>
                  {isModified && (
                    <span className="text-[#e67e8c] font-medium animate-pulse">
                      (Unsaved changes)
                    </span>
                  )}
                </>
              ) : (
                <span>No save file loaded</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons matching In-Game styling */}
        <div className="flex items-center gap-2.5 flex-wrap justify-end w-full md:w-auto">
          {/* Native Backup Loader (Tauri mode) */}
          {backups.length > 0 && onSelectBackup && (
            <div className="relative">
              <Button
                variant="amber"
                size="sm"
                icon={<FolderOpen className="w-4 h-4" />}
                onClick={() => setShowBackupList(!showBackupList)}
              >
                Game Backups ({backups.length})
              </Button>

              {showBackupList && (
                <div className="absolute right-0 mt-2 w-72 bg-[#18141f] border border-[#3b2e44] rounded-xl shadow-2xl py-2 z-50 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 text-xs font-semibold uppercase text-[#8e8273] border-b border-[#281f2f]">
                    Detected Game Backups
                  </div>
                  {backups.map((b) => (
                    <button
                      key={b.path}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-[#231b2c] text-[#c9bea9] hover:text-[#dfb15b] transition-colors flex flex-col cursor-pointer"
                      onClick={() => {
                        onSelectBackup(b);
                        setShowBackupList(false);
                      }}
                    >
                      <span className="font-medium truncate">{b.name}</span>
                      <span className="text-[10px] text-[#695d4e] font-mono">
                        {(b.size / 1024).toFixed(1)} KB •{' '}
                        {new Date(b.modified * 1000).toLocaleTimeString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Open File Button */}
          <Button
            variant="secondary"
            size="sm"
            icon={<Upload className="w-4 h-4" />}
            onClick={onOpenFile}
          >
            Open File
          </Button>

          {/* Reset / Revert Button */}
          {isModified && (
            <Button
              variant="ghost"
              size="sm"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={onReset}
              title="Revert all changes since last load"
            >
              Revert
            </Button>
          )}

          {/* Direct Save Button (if in Tauri with loaded file) */}
          {isTauri() && saveData && (
            <Button
              variant="secondary"
              size="sm"
              icon={<FileCheck className="w-4 h-4" />}
              onClick={onSaveFile}
            >
              Save Overwrite
            </Button>
          )}

          {/* Export & Download JSON Button (Styled like In-Game CONTINUE button) */}
          {saveData && (
            <Button
              variant="primary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={onExportDownload}
            >
              Export JSON Save
            </Button>
          )}

          {/* Close Save Button */}
          {saveData && onCloseSave && (
            <Button
              variant="ghost"
              size="sm"
              className="text-[#8e8273] hover:text-[#e67e8c]"
              icon={<XCircle className="w-4 h-4" />}
              onClick={onCloseSave}
              title="Close current save and return to welcome screen"
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
