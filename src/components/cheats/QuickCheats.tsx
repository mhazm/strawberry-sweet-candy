import React from 'react';
import {
  Coins,
  Heart,
  Sparkles,
  Zap,
  Award,
  Users2,
  Skull,
  ShieldAlert,
  Dices,
} from 'lucide-react';
import { GuildData, SaveGameRoot } from '../../types/savegame';
import { Button } from '../ui/Button';
import { COMBAT_ATTRIBUTES, HIDDEN_ATTRIBUTES } from '../../lib/constants';
import { rollWonderkidGacha } from '../../lib/wonderkid';
import { useTranslation } from '../../lib/i18n';

interface QuickCheatsProps {
  saveData: SaveGameRoot;
  onUpdateGuild: (updated: GuildData) => void;
}

export const QuickCheats: React.FC<QuickCheatsProps> = ({
  saveData,
  onUpdateGuild,
}) => {
  const { t } = useTranslation();
  const guild = saveData.guild;

  // 1. Max Gold
  const handleMaxGold = () => {
    onUpdateGuild({ ...guild, gold: 999999999 });
  };

  // 2. Max Renown
  const handleMaxRenown = () => {
    onUpdateGuild({ ...guild, renown: 1000 });
  };

  // 3. Heal All Roster
  const handleHealAll = () => {
    const healed = (guild.roster || []).map((h) => ({
      ...h,
      condition: 100,
      morale: 100,
      stress: 0,
      fatigue: 0,
      injury: null,
    }));
    onUpdateGuild({ ...guild, roster: healed });
  };

  // 4. Wonderkid Gacha All Roster (Job Optimal)
  const handleGachaAllWonderkids = () => {
    const wonderkids = (guild.roster || []).map((h) => {
      const rolled = rollWonderkidGacha(h);
      return {
        ...h,
        age: rolled.age,
        level: rolled.level,
        potentialAbility: rolled.potentialAbility,
        currentAbility: rolled.currentAbility,
        attributes: rolled.attributes,
        hidden: rolled.hidden,
        traitIds: rolled.traitIds,
        condition: rolled.condition,
        morale: rolled.morale,
        stress: rolled.stress,
        fatigue: rolled.fatigue,
        injury: null,
      };
    });
    onUpdateGuild({ ...guild, roster: wonderkids });
  };

  // 5. Max All 30 Combat Stats
  const handleMaxCombatStats = () => {
    const godmode = (guild.roster || []).map((h) => {
      const attrs = { ...h.attributes };
      COMBAT_ATTRIBUTES.forEach((attr) => {
        (attrs as any)[attr.key] = 20;
      });
      return {
        ...h,
        attributes: attrs,
        currentAbility: 200,
        potentialAbility: 200,
      };
    });
    onUpdateGuild({ ...guild, roster: godmode });
  };

  // 6. Max Hidden Stats
  const handleMaxHiddenStats = () => {
    const godmode = (guild.roster || []).map((h) => {
      const hidden = { ...h.hidden };
      HIDDEN_ATTRIBUTES.forEach((attr) => {
        (hidden as any)[attr.key] = 20;
      });
      return {
        ...h,
        hidden,
      };
    });
    onUpdateGuild({ ...guild, roster: godmode });
  };

  // 7. Revive All Fallen
  const handleReviveAllFallen = () => {
    if (!guild.fallen || guild.fallen.length === 0) return;
    const revived = guild.fallen.map((f) => ({
      ...f,
      condition: 100,
      morale: 100,
      stress: 0,
      fatigue: 0,
      injury: null,
    }));
    onUpdateGuild({
      ...guild,
      roster: [...(guild.roster || []), ...revived],
      fallen: [],
    });
  };

  // 8. Max Staff
  const handleMaxStaff = () => {
    if (!guild.staff) return;
    const maxedStaff = guild.staff.map((s) => ({
      ...s,
      skill: 100,
      wage: 0,
    }));
    onUpdateGuild({ ...guild, staff: maxedStaff });
  };

  const cheatCards = [
    {
      title: t.infiniteGold,
      desc: t.infiniteGoldDesc,
      icon: <Coins className="w-5 h-5 text-[#dfb15b]" />,
      actionLabel: '999,999,999 Gold',
      action: handleMaxGold,
      variant: 'amber' as const,
    },
    {
      title: t.maxRenown,
      desc: t.maxRenownDesc,
      icon: <Award className="w-5 h-5 text-[#86afdf]" />,
      actionLabel: '1,000 Renown',
      action: handleMaxRenown,
      variant: 'secondary' as const,
    },
    {
      title: t.healAll,
      desc: t.healAllDesc,
      icon: <Heart className="w-5 h-5 text-[#71caa2]" />,
      actionLabel: t.fullRestore,
      action: handleHealAll,
      variant: 'emerald' as const,
    },
    {
      title: t.batchWonderkid,
      desc: t.batchWonderkidDesc,
      icon: <Dices className="w-5 h-5 text-[#f5cb71]" />,
      actionLabel: t.makeWonderkid,
      action: handleGachaAllWonderkids,
      variant: 'primary' as const,
    },
    {
      title: t.maxStats,
      desc: t.maxStatsDesc,
      icon: <Zap className="w-5 h-5 text-[#dfb15b]" />,
      actionLabel: t.maxAll20,
      action: handleMaxCombatStats,
      variant: 'amber' as const,
    },
    {
      title: t.maxAllHidden,
      desc: t.hiddenAttrDesc,
      icon: <ShieldAlert className="w-5 h-5 text-[#c78ade]" />,
      actionLabel: t.maxAllHidden,
      action: handleMaxHiddenStats,
      variant: 'secondary' as const,
    },
    {
      title: t.reviveAll,
      desc: `${t.reviveAllDesc} (${guild.fallen?.length || 0})`,
      icon: <Skull className="w-5 h-5 text-[#e67e8c]" />,
      actionLabel: `${t.reviveAll} (${guild.fallen?.length || 0})`,
      action: handleReviveAllFallen,
      variant: 'danger' as const,
      disabled: !guild.fallen || guild.fallen.length === 0,
    },
    {
      title: t.guildStaffTitle,
      desc: t.maxStaffSkills,
      icon: <Users2 className="w-5 h-5 text-[#71caa2]" />,
      actionLabel: t.maxStaffSkills,
      action: handleMaxStaff,
      variant: 'secondary' as const,
      disabled: !guild.staff || guild.staff.length === 0,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-[#c9bea9]">
      <div className="bg-[#1b1622] border border-[#594426] rounded-2xl p-5 shadow-lg flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-rpg text-[#f5cb71] flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#dfb15b]" />
            {t.cheatsTitle}
          </h2>
          <p className="text-xs text-[#8e8273] mt-1 max-w-2xl">
            {t.godModeDesc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cheatCards.map((c, idx) => (
          <div
            key={idx}
            className="p-5 bg-[#18151f] border border-[#2e2536] hover:border-[#42364c] rounded-xl shadow-sm flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-2 rounded-lg bg-[#141117] border border-[#2b2230]">
                  {c.icon}
                </div>
                <h3 className="text-sm font-semibold text-[#f0e8db]">
                  {c.title}
                </h3>
              </div>
              <p className="text-xs text-[#8e8273] leading-relaxed">
                {c.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#261f2e]">
              <Button
                variant={c.variant}
                size="sm"
                className="w-full text-xs"
                onClick={c.action}
                disabled={c.disabled}
              >
                {c.actionLabel}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
