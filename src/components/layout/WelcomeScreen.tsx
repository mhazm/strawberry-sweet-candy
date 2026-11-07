import React, { useEffect, useState } from 'react';
import {
  Shield,
  Upload,
  FolderOpen,
  Sparkles,
  FileText,
  Clock,
  HardDrive,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { isTauri, listGameBackups, BackupFileInfo } from '../../lib/tauri';

interface WelcomeScreenProps {
  onOpenFile: () => void;
  onSelectBackup: (backup: BackupFileInfo) => void;
  onLoadSample: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onOpenFile,
  onSelectBackup,
  onLoadSample,
}) => {
  const [detectedBackups, setDetectedBackups] = useState<BackupFileInfo[]>([]);
  const [isLoadingBackups, setIsLoadingBackups] = useState(true);

  useEffect(() => {
    if (isTauri()) {
      listGameBackups()
        .then((files) => setDetectedBackups(files))
        .finally(() => setIsLoadingBackups(false));
    } else {
      setIsLoadingBackups(false);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto my-8 space-y-8 animate-in fade-in">
      {/* Title & Hero Banner */}
      <div className="text-center space-y-3">
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500/20 via-slate-800 to-amber-950/40 border border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.25)]">
          <Shield className="w-10 h-10 text-amber-400" />
          <Sparkles className="w-5 h-5 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
        </div>
        <h1 className="font-rpg text-3xl font-extrabold text-slate-100 tracking-wide">
          Dungeons & Dynasties
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Guild & Roster Save Game Editor. Customize treasury gold, delver attributes, 99 traits, equipped gear, and wonderkid prospects.
        </p>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        onClick={onOpenFile}
        className="group relative p-10 bg-slate-900/80 hover:bg-slate-900 border-2 border-dashed border-slate-750 hover:border-amber-500/60 rounded-2xl shadow-xl text-center cursor-pointer transition-all duration-200"
      >
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto text-amber-400 group-hover:scale-110 transition-transform">
          <Upload className="w-7 h-7" />
        </div>
        <h2 className="mt-4 font-rpg font-bold text-lg text-slate-200 group-hover:text-amber-300 transition-colors">
          Drag & Drop Save File (.json) Here
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Supports any backup ledger from Dungeons & Dynasties
        </p>
        <div className="mt-5">
          <Button
            variant="primary"
            size="md"
            icon={<FolderOpen className="w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              onOpenFile();
            }}
          >
            Browse & Select Save File
          </Button>
        </div>
      </div>

      {/* Detected Game Backups in AppData */}
      {detectedBackups.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-amber-400" />
              <h3 className="font-rpg font-bold text-base text-slate-100">
                Detected Saves in Game Directory ({detectedBackups.length})
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              %APPDATA%\io.itch.brettlittle.dungeons-and-dynasties\backups
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {detectedBackups.map((backup) => (
              <div
                key={backup.path}
                className="p-4 bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 rounded-xl flex items-center justify-between gap-3 group transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-amber-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 truncate">
                      {backup.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(backup.modified * 1000).toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>{(backup.size / 1024).toFixed(0)} KB</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="amber"
                  size="sm"
                  className="shrink-0 text-xs"
                  onClick={() => onSelectBackup(backup)}
                >
                  Load Save
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Backup Safety Guarantee Banner */}
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-emerald-300 block">
            Dedicated Editor Backup System
          </span>
          <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
            When you save or overwrite, the previous unedited save is safely duplicated into a dedicated <code className="text-slate-200 font-mono">editor-backups/</code> folder. Your game's official backups folder will remain clean without cluttering <code className="text-slate-200 font-mono">.bak</code> files.
          </p>
        </div>
      </div>

      {/* Demo sample save button */}
      <div className="text-center pt-2">
        <button
          onClick={onLoadSample}
          className="text-xs text-slate-500 hover:text-amber-400 underline underline-offset-4 transition-colors cursor-pointer"
        >
          Or load sample save for preview / demo testing
        </button>
      </div>
    </div>
  );
};

