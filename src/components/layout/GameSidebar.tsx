import React from 'react';
import {
  Shield,
  Users,
  Castle,
  Package,
  UserPlus,
  Skull,
  Zap,
  Settings,
} from 'lucide-react';
import { GuildData } from '../../types/savegame';
import { useTranslation } from '../../lib/i18n';

export type NavTabId =
  | 'roster'
  | 'recruits'
  | 'graveyard'
  | 'guild'
  | 'armoury'
  | 'cheats';

interface GameSidebarProps {
  guild: GuildData;
  activeTab: NavTabId;
  onChangeTab: (tab: NavTabId) => void;
  onOpenSettings: () => void;
}

export const GameSidebar: React.FC<GameSidebarProps> = ({
  guild,
  activeTab,
  onChangeTab,
  onOpenSettings,
}) => {
  const { t } = useTranslation();
  const rosterCount = guild.roster?.length || 0;
  const recruitsCount = guild.recruits?.length || 0;
  const stashCount = guild.stash?.length || 0;
  const fallenCount = guild.fallen?.length || 0;

  return (
    <aside className="w-56 shrink-0 bg-[#0f0c13] border-r border-[#241c29] flex flex-col justify-between h-screen select-none text-[#a69888] font-sans text-xs">
      {/* Top Guild Brand Section */}
      <div className="overflow-y-auto overflow-x-hidden flex-1">
        <div className="p-4 pb-3 border-b border-[#211926] flex items-center gap-3">
          {/* Guild Crest */}
          <div className="relative w-10 h-11 shrink-0 flex items-center justify-center bg-gradient-to-b from-[#2a1d12] to-[#120d09] border border-[#5e4726] rounded-md shadow-md">
            <Shield className="w-6 h-6 text-[#dfb15b]" />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[#f5cb71]/10 rounded-md pointer-events-none" />
          </div>

          <div className="min-w-0">
            <h1 className="font-rpg font-bold text-sm tracking-wider text-[#f0e8db] truncate uppercase">
              {guild.name || 'White Tiger'}
            </h1>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-[#a4864c] truncate">
              Dungeons & Dynasties
            </div>
            <div className="text-[9px] text-[#635545] font-mono">Save Editor</div>
          </div>
        </div>

        {/* Section 1: DELVERS & ROSTER */}
        <div className="pt-3 pb-2">
          <div className="px-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#6b5d4c]">
            {t.navSectionDelvers}
          </div>
          <nav className="space-y-0.5 px-2">
            <SidebarItem
              label={t.navRoster}
              icon={<Users className="w-3.5 h-3.5" />}
              badge={`${rosterCount}/9`}
              isActive={activeTab === 'roster'}
              onClick={() => onChangeTab('roster')}
            />
            <SidebarItem
              label={t.navRecruits}
              icon={<UserPlus className="w-3.5 h-3.5" />}
              badge={recruitsCount > 0 ? recruitsCount : undefined}
              dot={recruitsCount > 0}
              isActive={activeTab === 'recruits'}
              onClick={() => onChangeTab('recruits')}
            />
            <SidebarItem
              label={t.navFallen}
              icon={<Skull className="w-3.5 h-3.5 text-[#e67e8c]" />}
              badge={fallenCount > 0 ? fallenCount : undefined}
              isActive={activeTab === 'graveyard'}
              onClick={() => onChangeTab('graveyard')}
            />
          </nav>
        </div>

        {/* Section 2: GUILD MANAGEMENT */}
        <div className="pt-2 pb-2">
          <div className="px-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#6b5d4c]">
            {t.navSectionGuild}
          </div>
          <nav className="space-y-0.5 px-2">
            <SidebarItem
              label={t.navGuildOverview}
              icon={<Castle className="w-3.5 h-3.5" />}
              isActive={activeTab === 'guild'}
              onClick={() => onChangeTab('guild')}
            />
            <SidebarItem
              label={t.navArmoury}
              icon={<Package className="w-3.5 h-3.5" />}
              badge={stashCount > 0 ? stashCount : undefined}
              isActive={activeTab === 'armoury'}
              onClick={() => onChangeTab('armoury')}
            />
          </nav>
        </div>

        {/* Section 3: EDITOR TOOLS */}
        <div className="pt-2 pb-2 border-t border-[#211926]">
          <div className="px-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#dfb15b] flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-[#dfb15b]" />
            {t.navSectionCheats}
          </div>
          <nav className="space-y-0.5 px-2">
            <SidebarItem
              label={t.navQuickCheats}
              icon={<Zap className="w-3.5 h-3.5 text-[#f5cb71]" />}
              isActive={activeTab === 'cheats'}
              onClick={() => onChangeTab('cheats')}
              highlight={true}
            />
          </nav>
        </div>
      </div>

      {/* Bottom Settings & Save Management */}
      <div className="p-2 border-t border-[#211926] bg-[#0b080e] space-y-1">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md text-[#9e8f7c] hover:text-[#f0e8db] hover:bg-[#1a1420] transition-colors cursor-pointer text-left"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{t.navSettings}</span>
        </button>
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  badge?: string | number;
  dot?: boolean;
  highlight?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon,
  isActive,
  onClick,
  badge,
  dot,
  highlight,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer relative ${
        isActive
          ? 'bg-[#291e14] text-[#f5cb71] font-semibold border-l-2 border-[#dfb15b] shadow-sm'
          : 'text-[#8e8070] hover:text-[#c9bea9] hover:bg-[#16121b]'
      } ${highlight && !isActive ? 'text-[#e5bf73]' : ''}`}
    >
      <div className="flex items-center gap-2.5 truncate">
        <span className={isActive ? 'text-[#dfb15b]' : 'text-[#6e6051]'}>
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {dot && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#dfb15b] shadow-[0_0_5px_#dfb15b]" />
        )}
        {badge !== undefined && (
          <span
            className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
              isActive
                ? 'bg-[#1a1208] text-[#f5cb71] border border-[#544122]'
                : 'bg-[#18131e] text-[#786c5f]'
            }`}
          >
            {badge}
          </span>
        )}
      </div>
    </button>
  );
};