import React from 'react';
import {
  Castle,
  Users,
  Zap,
  Package,
  Skull,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../lib/i18n';

export type ActiveTab = 'guild' | 'roster' | 'cheats' | 'stash' | 'graveyard';

interface TabNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  rosterCount: number;
  stashCount: number;
  fallenCount: number;
}

export const TabNav: React.FC<TabNavProps> = ({
  activeTab,
  onChangeTab,
  rosterCount,
  stashCount,
  fallenCount,
}) => {
  const { t } = useTranslation();

  const tabs = [
    {
      id: 'guild' as ActiveTab,
      label: t.navGuildOverview,
      icon: <Castle className="w-4 h-4" />,
    },
    {
      id: 'roster' as ActiveTab,
      label: t.navRoster,
      icon: <Users className="w-4 h-4" />,
      count: rosterCount,
    },
    {
      id: 'cheats' as ActiveTab,
      label: t.navQuickCheats,
      icon: <Zap className="w-4 h-4 text-[#dfb15b]" />,
      highlight: true,
    },
    {
      id: 'stash' as ActiveTab,
      label: t.navArmoury,
      icon: <Package className="w-4 h-4" />,
      count: stashCount,
    },
    {
      id: 'graveyard' as ActiveTab,
      label: t.navFallen,
      icon: <Skull className="w-4 h-4 text-[#e67e8c]" />,
      count: fallenCount,
    },
  ];

  return (
    <nav className="flex items-center gap-1.5 px-6 py-2.5 border-b border-[#2d2333] bg-[#141117] overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap',
              isActive
                ? 'bg-[#2a1e12] text-[#f5cb71] border border-[#5e4726] shadow-sm'
                : 'text-[#8e8273] hover:text-[#c9bea9] hover:bg-[#1a1622] border border-transparent',
              tab.highlight && !isActive && 'hover:text-[#dfb15b]'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold',
                  isActive
                    ? 'bg-[#181108] text-[#f5cb71] border border-[#594426]'
                    : 'bg-[#1c1722] text-[#8e8273]'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
