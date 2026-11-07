import React, { useState, useEffect } from 'react';
import {
  X,
  FolderArchive,
  Upload,
  RotateCcw,
  Clock,
  Sparkles,
  RefreshCw,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { isTauri, listGameBackups, BackupFileInfo } from '../../lib/tauri';
import { checkForUpdate, UpdateInfo } from '../../lib/updater';
import { useTranslation } from '../../lib/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  filename: string;
  onOpenFile: () => void;
  onSelectBackup: (backup: BackupFileInfo) => void;
  onCloseSave: () => void;
  onReset: () => void;
  isModified: boolean;
  onUpdateFound?: (update: UpdateInfo) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  filename,
  onOpenFile,
  onSelectBackup,
  onCloseSave,
  onReset,
  isModified,
  onUpdateFound,
}) => {
  const { t } = useTranslation();
  const [backups, setBackups] = useState<BackupFileInfo[]>([]);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && isTauri()) {
      listGameBackups().then((files) => setBackups(files));
    }
    if (isOpen) {
      setUpdateStatus(null);
    }
  }, [isOpen]);

  const handleCheckUpdate = async () => {
    setIsCheckingUpdate(true);
    setUpdateStatus(null);
    try {
      const update = await checkForUpdate();
      if (update) {
        if (onUpdateFound) {
          onUpdateFound(update);
        }
      } else {
        setUpdateStatus('Aplikasi Anda sudah dalam versi terbaru (v1.0.0).');
      }
    } catch {
      setUpdateStatus('Tidak dapat terhubung ke server pembaruan.');
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-[#141018] border border-[#2e2536] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs text-[#c9bea9]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#241c29] bg-[#18131e]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#2a1d12] border border-[#5e4726] text-[#dfb15b]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-rpg font-bold text-sm text-[#f0e8db]">
                {t.settingsTitle}
              </h3>
              <p className="text-[11px] text-[#7e7161]">
                {t.activeFile}: <span className="text-[#dfb15b] font-mono">{filename}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#7e7161] hover:text-[#f0e8db] hover:bg-[#201826] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* File Operations */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7e7161]">
              {t.fileActions}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<Upload className="w-3.5 h-3.5" />}
                onClick={() => {
                  onClose();
                  onOpenFile();
                }}
              >
                {t.loadAnotherSave}
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<X className="w-3.5 h-3.5" />}
                onClick={() => {
                  onClose();
                  onCloseSave();
                }}
              >
                {t.closeCurrentSave}
              </Button>
            </div>
            {isModified && (
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-rose-400 hover:text-rose-300"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={() => {
                  onReset();
                  onClose();
                }}
              >
                {t.revertChanges}
              </Button>
            )}
          </div>

          {/* Dedicated Backups System Info */}
          <div className="p-3.5 rounded-xl bg-[#110d14] border border-[#3b2d47] space-y-2">
            <div className="flex items-center gap-2 text-[#dfb15b] font-semibold text-xs">
              <FolderArchive className="w-4 h-4 text-[#dfb15b]" />
              {t.safeBackupTitle}
            </div>
            <p className="text-[11px] text-[#8e8070] leading-relaxed">
              {t.safeBackupDesc}
            </p>
            <div className="p-2 rounded bg-[#0b080e] border border-[#241c29] font-mono text-[10px] text-[#dfb15b] select-all break-all">
              %APPDATA%\dnd-saveeditor\editor-backups\
            </div>
            <p className="text-[10px] text-[#635545]">
              {t.safeBackupNote}
            </p>
          </div>

          {/* Software Version & Auto-Updater Section */}
          <div className="p-3.5 rounded-xl bg-[#110d14] border border-[#2e2336] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#dfb15b] font-semibold text-xs">
                <Sparkles className="w-4 h-4 text-[#dfb15b]" />
                <span>Pembaruan Aplikasi (Auto-Update)</span>
              </div>
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#1f1726] border border-[#3f2e4d] text-[#e8d5be]">
                v1.0.0
              </span>
            </div>
            <p className="text-[11px] text-[#8e8070] leading-relaxed">
              Aplikasi ini otomatis memeriksa pembaruan resmi dari GitHub Releases saat dibuka. Anda juga dapat memeriksanya secara manual kapan saja.
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCheckUpdate}
                disabled={isCheckingUpdate}
                className="w-full flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingUpdate ? 'animate-spin text-[#dfb15b]' : ''}`} />
                {isCheckingUpdate ? 'Memeriksa GitHub...' : 'Periksa Pembaruan Sekarang'}
              </Button>
              {updateStatus && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20 rounded-md px-2.5 py-1.5">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{updateStatus}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tauri Detected Backups */}
          {backups.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7e7161]">
                {t.detectedSaves} ({backups.length})
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {backups.slice(0, 8).map((b) => (
                  <button
                    key={b.path}
                    onClick={() => {
                      onSelectBackup(b);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-[#18131e] hover:bg-[#241b2c] border border-[#2b2133] hover:border-[#dfb15b]/40 text-left transition-colors cursor-pointer group"
                  >
                    <div className="truncate pr-2">
                      <div className="font-medium text-[#f0e8db] group-hover:text-[#f5cb71] truncate text-[11px]">
                        {b.name}
                      </div>
                      <div className="text-[9px] text-[#6e6051] flex items-center gap-1 mt-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(b.modified).toLocaleString()}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#86afdf] shrink-0">
                      {(b.size / 1024).toFixed(0)} KB
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#241c29] bg-[#0f0c13] flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            {t.close}
          </Button>
        </div>
      </div>
    </div>
  );
};