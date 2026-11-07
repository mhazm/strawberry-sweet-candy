import React, { useState, useRef } from 'react';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { SaveGameRoot, GuildData, Adventurer, RecruitCandidate } from './types/savegame';
import { parseSaveFile, exportSaveFile, downloadJsonFile } from './lib/parser';
import {
  isTauri,
  readSaveFileTauri,
  writeSaveFileTauri,
  BackupFileInfo,
} from './lib/tauri';
import { WelcomeScreen } from './components/layout/WelcomeScreen';
import { GameSidebar, NavTabId } from './components/layout/GameSidebar';
import { GameTopBar } from './components/layout/GameTopBar';
import { SettingsModal } from './components/layout/SettingsModal';
import { GuildEditor } from './components/guild/GuildEditor';
import { RosterView } from './components/roster/RosterView';
import { QuickCheats } from './components/cheats/QuickCheats';
import { StashEditor } from './components/stash/StashEditor';
import { GraveyardView } from './components/fallen/GraveyardView';

export function App() {
  const [saveData, setSaveData] = useState<SaveGameRoot | null>(null);
  const [originalSave, setOriginalSave] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>('');
  const [filePath, setFilePath] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<NavTabId>('roster');
  const [isModified, setIsModified] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  // Update Guild Data
  const handleUpdateGuild = (updatedGuild: GuildData) => {
    if (!saveData) return;
    setSaveData({
      ...saveData,
      guild: updatedGuild,
    });
    setIsModified(true);
  };

  // Update Treasury Gold directly from Top Bar
  const handleUpdateGold = (newGold: number) => {
    if (!saveData) return;
    setSaveData({
      ...saveData,
      guild: {
        ...saveData.guild,
        gold: Math.max(0, newGold),
      },
    });
    setIsModified(true);
    showToast('success', `Treasury gold updated to ${new Intl.NumberFormat().format(newGold)}g`);
  };

  // Update Roster Data
  const handleUpdateRoster = (updatedRoster: Adventurer[]) => {
    if (!saveData) return;
    setSaveData({
      ...saveData,
      guild: {
        ...saveData.guild,
        roster: updatedRoster,
      },
    });
    setIsModified(true);
  };

  // Update Recruits Data
  const handleUpdateRecruits = (updatedRecruits: RecruitCandidate[]) => {
    if (!saveData) return;
    setSaveData({
      ...saveData,
      guild: {
        ...saveData.guild,
        recruits: updatedRecruits,
      },
    });
    setIsModified(true);
  };

  // Process Raw File Content
  const loadContent = (content: string, name: string, path: string | null = null) => {
    const res = parseSaveFile(content);
    if (!res.success || !res.data) {
      showToast('error', res.error || 'Failed to parse JSON save file.');
      return;
    }
    setSaveData(res.data);
    setOriginalSave(content);
    setFilename(name);
    setFilePath(path);
    setIsModified(false);
    setActiveTab('roster');
    showToast('success', `Loaded "${name}" (${res.data.guild.name})!`);
  };

  // Open File via Browser Input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      loadContent(content, file.name);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Load from detected Tauri Backup
  const handleSelectBackup = async (backup: BackupFileInfo) => {
    const content = await readSaveFileTauri(backup.path);
    if (content) {
      loadContent(content, backup.name, backup.path);
    } else {
      showToast('error', `Failed to read ${backup.name}`);
    }
  };

  // Load sample save on demand
  const handleLoadSample = () => {
    fetch('/sample-save.json')
      .then((res) => res.text())
      .then((text) => {
        loadContent(text, 'White Tiger 2026-11-07 05-00.json');
      })
      .catch((err) => {
        showToast('error', `Failed to load sample save: ${err.message || String(err)}`);
      });
  };

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        loadContent(content, file.name);
      };
      reader.readAsText(file);
    } else {
      showToast('error', 'Please drop a valid .json save file.');
    }
  };

  // Export JSON Download
  const handleExportDownload = () => {
    if (!saveData) return;
    const jsonStr = exportSaveFile(saveData);
    const exportName = filename.endsWith('.json')
      ? filename.replace('.json', '_edited.json')
      : `${filename || 'save'}_edited.json`;
    downloadJsonFile(jsonStr, exportName);
    setIsModified(false);
    showToast('success', `Exported to "${exportName}"!`);
  };

  // Save Overwrite directly (Tauri) with Dedicated Editor Backup
  const handleSaveOverwrite = async () => {
    if (!saveData || !filePath) {
      handleExportDownload();
      return;
    }
    try {
      const jsonStr = exportSaveFile(saveData);
      await writeSaveFileTauri(filePath, jsonStr, true);
      setIsModified(false);
      showToast(
        'success',
        `Saved to ${filename}! Previous version safely archived in %APPDATA%\\dnd-saveeditor\\editor-backups.`
      );
    } catch (err: any) {
      showToast('error', `Save failed: ${err.message || String(err)}`);
    }
  };

  // Reset to original loaded file
  const handleReset = () => {
    if (originalSave) {
      loadContent(originalSave, filename, filePath);
      showToast('success', 'Changes reverted.');
    }
  };

  // Close Save & return to welcome screen
  const handleCloseSave = () => {
    setSaveData(null);
    setOriginalSave(null);
    setFilename('');
    setFilePath(null);
    setIsModified(false);
  };

  return (
    <div
      className="h-screen w-screen flex flex-col bg-[#131017] text-[#c9bea9] overflow-hidden select-none"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Drag Overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-amber-500/10 backdrop-blur-sm border-4 border-dashed border-[#dfb15b] flex items-center justify-center pointer-events-none">
          <div className="p-8 rounded-2xl bg-[#18131e]/95 border border-[#dfb15b] text-center shadow-2xl">
            <Upload className="w-12 h-12 text-[#dfb15b] mx-auto mb-2 animate-bounce" />
            <p className="text-lg font-bold text-[#f5cb71]">
              Drop your save file (.json) here to load
            </p>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl transition-all animate-in slide-in-from-bottom max-w-md ${
            notification.type === 'success'
              ? 'bg-[#141d18] border-emerald-500/50 text-emerald-300'
              : 'bg-[#241517] border-rose-500/50 text-rose-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}

      {/* View Switch: Welcome Screen vs Full In-Game App */}
      {!saveData ? (
        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
          <WelcomeScreen
            onOpenFile={() => fileInputRef.current?.click()}
            onSelectBackup={handleSelectBackup}
            onLoadSample={handleLoadSample}
          />
        </div>
      ) : (
        /* Authentic In-Game Master Layout */
        <div className="flex h-full w-full overflow-hidden">
          {/* Left Navigation Sidebar */}
          <GameSidebar
            guild={saveData.guild}
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Right Main Column (TopBar + Content Area) */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#131017]">
            {/* Top Bar */}
            <GameTopBar
              guild={saveData.guild}
              activeTab={activeTab}
              isModified={isModified}
              onSaveFile={handleSaveOverwrite}
              onExportDownload={handleExportDownload}
              onReset={handleReset}
              onUpdateGold={handleUpdateGold}
            />

            {/* Main Content Workspace */}
            <main className="flex-1 p-4 overflow-hidden min-h-0">
              {activeTab === 'roster' && (
                <RosterView
                  roster={saveData.guild.roster || []}
                  recruits={saveData.guild.recruits || []}
                  currentDay={saveData.guild.day || 1}
                  initialViewMode="roster"
                  onChange={handleUpdateRoster}
                  onChangeRecruits={handleUpdateRecruits}
                />
              )}

              {activeTab === 'recruits' && (
                <RosterView
                  roster={saveData.guild.roster || []}
                  recruits={saveData.guild.recruits || []}
                  currentDay={saveData.guild.day || 1}
                  initialViewMode="recruits"
                  onChange={handleUpdateRoster}
                  onChangeRecruits={handleUpdateRecruits}
                />
              )}

              {activeTab === 'guild' && (
                <div className="h-full overflow-y-auto pr-1">
                  <GuildEditor
                    guild={saveData.guild}
                    onChange={handleUpdateGuild}
                  />
                </div>
              )}

              {activeTab === 'armoury' && (
                <div className="h-full overflow-y-auto pr-1">
                  <StashEditor
                    guild={saveData.guild}
                    onChange={handleUpdateGuild}
                  />
                </div>
              )}

              {activeTab === 'graveyard' && (
                <div className="h-full overflow-y-auto pr-1">
                  <GraveyardView
                    guild={saveData.guild}
                    onChange={handleUpdateGuild}
                  />
                </div>
              )}

              {activeTab === 'cheats' && (
                <div className="h-full overflow-y-auto pr-1">
                  <QuickCheats
                    saveData={saveData}
                    onUpdateGuild={handleUpdateGuild}
                  />
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* Settings & Save Management Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        filename={filename}
        onOpenFile={() => fileInputRef.current?.click()}
        onSelectBackup={handleSelectBackup}
        onCloseSave={handleCloseSave}
        onReset={handleReset}
        isModified={isModified}
      />
    </div>
  );
}

export default App;