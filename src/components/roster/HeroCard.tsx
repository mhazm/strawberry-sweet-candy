import React from 'react';
import {
  Heart,
  Smile,
  Zap,
  Activity,
  Edit3,
  HeartPulse,
  Star,
  Swords,
  Shield,
} from 'lucide-react';
import { Adventurer } from '../../types/savegame';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { getAbilityTier } from '../../lib/utils';
import { useTranslation } from '../../lib/i18n';

interface HeroCardProps {
  hero: Adventurer;
  onEdit: (hero: Adventurer) => void;
  onQuickHeal: (hero: Adventurer) => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  hero,
  onEdit,
  onQuickHeal,
}) => {
  const { t, getTraitName, getTraitDesc } = useTranslation();
  const tier = getAbilityTier(hero.currentAbility, hero.potentialAbility);
  const isInjured = !!hero.injury;
  const isWonderkid = hero.age <= 19 && hero.potentialAbility >= 180;

  return (
    <div className="bg-[#18151f] border border-[#2e2536] hover:border-[#dfb15b]/50 rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header: Name, Wonderkid star, Class & Level */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-rpg font-bold text-[#f0e8db] group-hover:text-[#f5cb71] transition-colors text-base truncate">
                {hero.name}
              </h3>
              {isWonderkid && (
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#332410] text-[#f5cb71] border border-[#6e532b] flex items-center gap-0.5 shadow-sm">
                  <Star className="w-2.5 h-2.5 text-[#f5cb71] fill-[#f5cb71]" />
                  WK
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#8e8273] capitalize mt-0.5">
              <span>{hero.raceId}</span>
              <span>•</span>
              <span className="text-[#c9bea9] font-medium">{hero.classId}</span>
              <span>•</span>
              <span>{t.ageLabel} {hero.age}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge variant="class" classType={hero.classId} roleType={hero.role}>
              {hero.classId}
            </Badge>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#201a14] text-[#dfb15b] border border-[#443828]">
              Lv.{hero.level}
            </span>
          </div>
        </div>

        {/* CA & PA Bar */}
        <div className="mt-3.5 p-2.5 rounded-lg bg-[#131018] border border-[#261f2e] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8e8273] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#dfb15b]" />
              CA / PA:
            </span>
            <div className="flex items-center gap-1.5 font-mono">
              <span className="font-bold text-[#dfb15b]">
                {hero.currentAbility}
              </span>
              <span className="text-[#594d42]">/</span>
              <span className="font-bold text-[#c78ade]">
                {hero.potentialAbility}
              </span>
              <span
                className={`text-[10px] uppercase px-1.5 py-0.2 rounded border font-sans font-bold ${tier.badgeClass}`}
              >
                {tier.badge}
              </span>
            </div>
          </div>
          <div className="relative w-full h-1.5 bg-[#1e1926] rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#c78ade]/40 rounded-full"
              style={{
                width: `${Math.min(100, (hero.potentialAbility / 200) * 100)}%`,
              }}
            />
            <div
              className="absolute top-0 left-0 h-full bg-[#dfb15b] rounded-full"
              style={{
                width: `${Math.min(100, (hero.currentAbility / 200) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Condition & Morale Bars */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {/* Condition */}
          <div className="bg-[#1b1723] border border-[#2d2333] rounded p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#8e8273] flex items-center gap-1 text-[11px]">
                <Activity className="w-3 h-3 text-[#71caa2]" />
                {t.colFit}
              </span>
              <span className="font-mono font-semibold text-[#71caa2]">
                {hero.condition}%
              </span>
            </div>
            <div className="w-full h-1 bg-[#131018] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#71caa2] rounded-full"
                style={{ width: `${Math.min(100, hero.condition || 0)}%` }}
              />
            </div>
          </div>

          {/* Morale */}
          <div className="bg-[#1b1723] border border-[#2d2333] rounded p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#8e8273] flex items-center gap-1 text-[11px]">
                <Smile className="w-3 h-3 text-[#dfb15b]" />
                {t.colMood}
              </span>
              <span className="font-mono font-semibold text-[#dfb15b]">
                {hero.morale}%
              </span>
            </div>
            <div className="w-full h-1 bg-[#131018] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#dfb15b] rounded-full"
                style={{ width: `${Math.min(100, hero.morale || 0)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Equipment Preview Tags */}
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap text-[11px]">
          {hero.equipment?.weapon && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#131018] border border-[#2d2333] text-[#c9bea9] truncate max-w-[150px]"
              title={`${t.weapon}: ${hero.equipment.weapon.name}`}
            >
              <Swords className="w-3 h-3 text-[#e67e8c] shrink-0" />
              <span className="truncate">{hero.equipment.weapon.name}</span>
            </span>
          )}
          {hero.equipment?.armour && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#131018] border border-[#2d2333] text-[#c9bea9] truncate max-w-[150px]"
              title={`${t.armour}: ${hero.equipment.armour.name}`}
            >
              <Shield className="w-3 h-3 text-[#86afdf] shrink-0" />
              <span className="truncate">{hero.equipment.armour.name}</span>
            </span>
          )}
        </div>

        {/* Injury or Traits Preview */}
        <div className="mt-2 flex items-center gap-1.5 flex-wrap min-h-[22px]">
          {isInjured && (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#38161f] text-[#e67e8c] border border-[#632330] flex items-center gap-1">
              <HeartPulse className="w-3 h-3 text-[#e67e8c] animate-pulse" />
              {t.currentlyInjured}
            </span>
          )}
          {hero.traitIds?.slice(0, 3).map((trId) => (
            <Tooltip
              key={trId}
              title={getTraitName(trId)}
              content={getTraitDesc(trId)}
            >
              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-[#1b1723] text-[#8e8273] hover:text-[#c9bea9] border border-[#2d2333] cursor-help">
                {getTraitName(trId)}
              </span>
            </Tooltip>
          ))}
          {hero.traitIds && hero.traitIds.length > 3 && (
            <span className="text-[10px] text-[#695d4e]">
              +{hero.traitIds.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-[#261f2e] flex items-center justify-between gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="text-xs text-[#71caa2] hover:text-[#88d6b4]"
          icon={<Heart className="w-3.5 h-3.5 text-[#71caa2]" />}
          onClick={() => onQuickHeal(hero)}
          title={t.fullRestore}
        >
          {t.healAll}
        </Button>

        <Button
          variant="primary"
          size="sm"
          className="text-xs"
          icon={<Edit3 className="w-3.5 h-3.5" />}
          onClick={() => onEdit(hero)}
        >
          {t.editAllAttributes}
        </Button>
      </div>
    </div>
  );
};
