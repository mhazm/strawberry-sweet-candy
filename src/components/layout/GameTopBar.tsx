import React, { useState } from 'react';
import {
  Coins,
  Trophy,
  Calendar,
  Globe,
  Save,
  Download,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { GuildData } from '../../types/savegame';
import { formatGold } from '../../lib/utils';
import { NavTabId } from './GameSidebar';
import { useTranslation, Language } from '../../lib/i18n';

interface GameTopBarProps {
  guild: GuildData;
  activeTab: NavTabId;
  isModified: boolean;
  onSaveFile: () => void;
  onExportDownload: () => void;
  onReset: () => void;
  onUpdateGold: (newGold: number) => void;
}

export const GameTopBar: React.FC<GameTopBarProps> = ({
  guild,
  activeTab,
  isModified,
  onSaveFile,
  onExportDownload,
  onReset,
  onUpdateGold,
}) => {
  const { t, language, setLanguage, languages } = useTranslation();
  const [isEditingGold, setIsEditingGold] = useState(false);
  const [tempGold, setTempGold] = useState(String(guild.gold || 0));

  const currentYear =
    guild.year ||
    guild.ledgerYears?.[guild.ledgerYears.length - 1]?.year ||
    guild.cupBracket?.year ||
    1;

  const getTabTitle = (tab: NavTabId) => {
    switch (tab) {
      case 'roster':
        return t.navRoster;
      case 'recruits':
        return t.navRecruits;
      case 'graveyard':
        return t.navFallen;
      case 'guild':
        return t.navGuildOverview;
      case 'armoury':
        return t.navArmoury;
      case 'cheats':
        return t.navQuickCheats;
      default:
        return t.rosterTitle;
    }
  };

  const handleGoldSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(tempGold.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(val)) {
      onUpdateGold(val);
    }
    setIsEditingGold(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  return (
    <header className="h-14 shrink-0 bg-[#131017] border-b border-[#231b26] px-5 flex items-center justify-between select-none">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <h2 className="font-rpg font-bold text-base text-[#f0e8db] tracking-wide">
          {getTabTitle(activeTab)}
        </h2>
        {isModified && (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[#f5cb71] px-2 py-0.5 rounded bg-[#2b2012] border border-[#594426] animate-pulse">
            <AlertCircle className="w-3 h-3" />
            {t.unsavedChanges}
          </span>
        )}
      </div>

      {/* Middle & Right In-Game Status Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Gold Capsule (Click to edit directly) */}
        {isEditingGold ? (
          <form onSubmit={handleGoldSubmit} className="flex items-center">
            <input
              type="text"
              autoFocus
              value={tempGold}
              onChange={(e) => setTempGold(e.target.value)}
              onBlur={() => setIsEditingGold(false)}
              className="w-28 px-2 py-1 text-xs font-mono font-bold bg-[#1b1521] border border-[#dfb15b] rounded text-[#f5cb71] focus:outline-none"
            />
            <button type="submit" className="hidden" />
          </form>
        ) : (
          <button
            onClick={() => {
              setTempGold(String(guild.gold));
              setIsEditingGold(true);
            }}
            title="Click to edit treasury gold"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#18141f] hover:bg-[#201a29] border border-[#31253a] hover:border-[#dfb15b]/60 transition-colors cursor-pointer group"
          >
            <Coins className="w-3.5 h-3.5 text-[#dfb15b] group-hover:scale-110 transition-transform" />
            <span className="font-mono text-xs font-bold text-[#f5cb71]">
              {formatGold(guild.gold)}g
            </span>
          </button>
        )}

        {/* Renown Capsule (Actual data from savegame) */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#18141f] border border-[#261f2e] text-[#dfb15b] text-xs font-semibold"
          title={`${t.realmRenown}: ${guild.renown ?? 0}`}
        >
          <Trophy className="w-3.5 h-3.5 text-[#dfb15b]" />
          <span className="font-mono text-[#f5cb71]">{guild.renown ?? 0}</span>
          <span className="text-[10px] text-[#7e7161] font-sans font-normal uppercase hidden sm:inline">
            {t.realmRenown}
          </span>
        </div>

        {/* Calendar Capsule (Day & Year only from actual savegame) */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#18141f] border border-[#261f2e] text-[#b8ab96] text-xs"
          title={`${t.currentDay}: ${guild.day || 1}, ${t.year}: ${currentYear}`}
        >
          <Calendar className="w-3.5 h-3.5 text-[#86afdf]" />
          <span className="font-mono text-[#c9bea9]">
            {t.day} {guild.day || 1} · {t.year} {currentYear}
          </span>
        </div>

        {/* Interactive Multi-Language Dropdown (8 Languages) */}
        <div className="relative flex items-center">
          <Globe className="w-3.5 h-3.5 text-[#dfb15b] absolute left-2.5 pointer-events-none" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="pl-7 pr-2.5 py-1.5 rounded-md bg-[#18141f] hover:bg-[#241c2c] border border-[#31253a] hover:border-[#dfb15b]/60 text-[#dfb15b] text-xs font-semibold cursor-pointer focus:outline-none focus:border-[#dfb15b]"
            title="Switch Language / Ganti Bahasa"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-[#1a1622] text-[#f0e8db]">
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Revert Changes */}
        {isModified && (
          <button
            onClick={onReset}
            title={t.revertChanges}
            className="p-1.5 rounded bg-[#18141f] hover:bg-[#26191b] border border-[#38262b] text-[#e67e8c] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Export JSON Secondary */}
        <button
          onClick={onExportDownload}
          title={t.exportJson}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1d1726] hover:bg-[#2b2138] border border-[#41324f] text-[#c9bea9] hover:text-[#f0e8db] text-xs font-semibold transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#dfb15b]" />
          <span className="hidden sm:inline">{t.exportJson}</span>
        </button>

        {/* In-Game Big Golden Save Button */}
        <button
          onClick={onSaveFile}
          className="flex items-center gap-2 px-4 py-1.5 rounded bg-gradient-to-b from-[#e5ab37] to-[#b88226] hover:from-[#f3be51] hover:to-[#c69131] active:translate-y-px text-[#150f06] font-bold text-xs shadow-md border border-[#f5cb71]/40 transition-all cursor-pointer font-rpg tracking-wider uppercase"
        >
          <Save className="w-3.5 h-3.5 text-[#150f06]" />
          <span>{t.saveGame}</span>
          <span className="font-sans font-normal opacity-70 ml-0.5">→</span>
        </button>
      </div>
    </header>
  );
};