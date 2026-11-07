import React, { useState } from 'react';
import { Sparkles, Download, CheckCircle, AlertCircle, RefreshCw, X } from 'lucide-react';
import { UpdateInfo, installUpdate } from '../../lib/updater';
import { Button } from '../ui/Button';

interface UpdateModalProps {
  updateInfo: UpdateInfo;
  onClose: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({ updateInfo, onClose }) => {
  const [isInstalling, setIsInstalling] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInstall = async () => {
    setIsInstalling(true);
    setErrorMessage(null);
    try {
      await installUpdate((_downloaded, _total, percent) => {
        setProgressPercent(percent);
      });
    } catch (err: any) {
      console.error('Update failed:', err);
      setErrorMessage(err?.message || 'Gagal mengunduh pembaruan. Silakan coba lagi nanti.');
      setIsInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#130f17] border border-[#3e2d1d] rounded-2xl shadow-[0_0_50px_rgba(223,177,91,0.15)] overflow-hidden flex flex-col text-[#cfc2b2] text-xs">
        {/* Header */}
        <div className="relative px-5 py-4 border-b border-[#281d2c] bg-gradient-to-r from-[#211612] via-[#17111b] to-[#120d16] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#dfb15b]/15 border border-[#dfb15b]/40 flex items-center justify-center text-[#dfb15b] shadow-[0_0_12px_rgba(223,177,91,0.25)]">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-sm tracking-wide text-[#f5cb71]">
                Pembaruan Tersedia
              </h2>
              <p className="text-[10px] text-[#9c8e7e]">Versi baru telah dirilis ke publik</p>
            </div>
          </div>
          {!isInstalling && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[#8c7e6e] hover:text-[#e8d5be] hover:bg-[#251b29] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Version Pill */}
          <div className="flex items-center justify-center gap-3 py-2.5 px-4 bg-[#18121e] border border-[#2e2136] rounded-xl text-center">
            <span className="font-mono text-[#8b7d6e] line-through text-[11px]">
              v{updateInfo.currentVersion}
            </span>
            <span className="text-[#dfb15b] text-xs">➔</span>
            <span className="font-mono font-bold text-[#4ade80] text-sm bg-[#4ade80]/10 px-2 py-0.5 rounded border border-[#4ade80]/30 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
              v{updateInfo.version}
            </span>
          </div>

          {/* Release Notes */}
          {updateInfo.body && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#dfb15b]">
                Catatan Rilis:
              </span>
              <div className="max-h-36 overflow-y-auto p-3 bg-[#0d0910] border border-[#251a2b] rounded-lg text-[11px] leading-relaxed text-[#b5a796] whitespace-pre-wrap font-sans">
                {updateInfo.body}
              </div>
            </div>
          )}

          {/* Progress Bar during install */}
          {isInstalling && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#dfb15b] flex items-center gap-1.5 font-medium">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Sedang mengunduh dan memasang...
                </span>
                <span className="font-mono font-bold text-[#f5cb71]">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-[#1b1422] rounded-full overflow-hidden border border-[#3b2a45]">
                <div
                  className="h-full bg-gradient-to-r from-[#dfb15b] to-[#4ade80] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-[#786b5c] text-center italic">
                Aplikasi akan otomatis restart setelah instalasi selesai.
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 bg-red-950/40 border border-red-800/60 rounded-lg flex items-center gap-2 text-red-300 text-[11px]">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#0f0b13] border-t border-[#231a27] flex items-center justify-end gap-2.5">
          {!isInstalling ? (
            <>
              <Button variant="ghost" size="sm" onClick={onClose}>
                Nanti Saja
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleInstall}
                className="flex items-center gap-1.5 shadow-[0_0_15px_rgba(223,177,91,0.3)]"
              >
                <Download className="w-3.5 h-3.5" />
                Perbarui & Restart
              </Button>
            </>
          ) : (
            <div className="text-[11px] text-[#8e806f] flex items-center gap-1.5 py-1">
              <span className="w-2 h-2 rounded-full bg-[#dfb15b] animate-ping" />
              Proses instalasi sedang berjalan...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
