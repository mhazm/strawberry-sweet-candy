import React from 'react';
import { TRAIT_CATALOG, TraitInfo } from '../../lib/constants';
import { useTranslation } from '../../lib/i18n';
import { Tooltip } from '../ui/Tooltip';

interface TraitBadgeProps {
  traitId: string;
}

export const TraitBadge: React.FC<TraitBadgeProps> = ({ traitId }) => {
  const { t, getTraitName, getTraitDesc } = useTranslation();

  const trait: TraitInfo | undefined = TRAIT_CATALOG.find(
    (c) => c.id === traitId || c.id === traitId.toLowerCase().replace(/\s+/g, '-')
  );

  const name = getTraitName(traitId, trait?.name);
  const type = trait?.type || 'neutral';
  const desc = getTraitDesc(traitId, trait?.desc);

  // Color Styles based on positive / negative / neutral
  let badgeStyle = 'bg-[#231b14] text-[#dfb15b] border-[#4d3a24] hover:border-[#dfb15b]/60';
  let dotStyle = 'bg-[#dfb15b]';
  let typeLabel = t.traitNeutral;
  let badgeColor = 'text-[#dfb15b] bg-[#221a11] border-[#4a3a22]';

  if (type === 'positive') {
    badgeStyle = 'bg-[#13281c] text-[#71caa2] border-[#205439] hover:border-[#42a874]/60';
    dotStyle = 'bg-[#71caa2]';
    typeLabel = t.traitPositive;
    badgeColor = 'text-[#71caa2] bg-[#122b1e] border-[#1d4d35]';
  } else if (type === 'negative') {
    badgeStyle = 'bg-[#30161a] text-[#e67e8c] border-[#5e2730] hover:border-[#e67e8c]/60';
    dotStyle = 'bg-[#e67e8c]';
    typeLabel = t.traitNegative;
    badgeColor = 'text-[#e67e8c] bg-[#2d1419] border-[#5e222c]';
  }

  // Extra mechanics information (Combat AI parameters or event details)
  let extraContent: React.ReactNode = null;
  if (trait?.behaviorEffect) {
    const entries = Object.entries(trait.behaviorEffect);
    extraContent = (
      <div className="mt-2 pt-2 border-t border-[#3d324f]/60 flex flex-wrap gap-1">
        {entries.map(([k, v]) => {
          const pct = Math.round(v * 100);
          const sign = pct > 0 ? `+${pct}%` : `${pct}%`;
          const isPos = pct > 0;
          return (
            <span
              key={k}
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                isPos ? 'bg-[#22c55e]/15 text-[#4ade80]' : 'bg-[#ef4444]/15 text-[#f87171]'
              }`}
            >
              {k}: {sign}
            </span>
          );
        })}
      </div>
    );
  } else if (trait?.nonCombat && trait.nonCombat.detail && trait.nonCombat.detail.length > 0) {
    extraContent = (
      <div className="mt-2 pt-2 border-t border-[#3d324f]/60 text-[10px] text-[#c2b6cb] space-y-0.5">
        {trait.nonCombat.detail.map((d, i) => (
          <div key={i} className="flex items-start gap-1">
            <span className="text-[#dfb15b]">•</span>
            <span>{d}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Tooltip
      title={name}
      badge={typeLabel}
      badgeColor={badgeColor}
      content={desc}
      extra={extraContent}
    >
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-all cursor-help select-none ${badgeStyle}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyle}`} />
        <span className="truncate">{name}</span>
      </span>
    </Tooltip>
  );
};
