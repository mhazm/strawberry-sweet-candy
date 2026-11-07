import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RACE_CATALOG, RaceInfo } from '../../lib/constants';
import { useTranslation } from '../../lib/i18n';
import { Info, Sparkles, TrendingUp, Clock, Swords } from 'lucide-react';

interface RaceInfoTooltipProps {
  raceId: string;
  children?: React.ReactNode;
}

export const RaceInfoTooltip: React.FC<RaceInfoTooltipProps> = ({ raceId, children }) => {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const raceKey = raceId.toLowerCase().replace(/[^a-z]/g, '');
  const info: RaceInfo = RACE_CATALOG[raceKey] || RACE_CATALOG.human;

  const handleMouseEnter = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 300;
    const tooltipHeight = 180;

    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    if (left < 16) left = 16;
    if (left + tooltipWidth > window.innerWidth - 16) {
      left = window.innerWidth - tooltipWidth - 16;
    }

    let top = rect.bottom + 8;
    if (rect.bottom + tooltipHeight > window.innerHeight - 20) {
      top = rect.top - tooltipHeight - 8;
    }

    setCoords({ top, left });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  useEffect(() => {
    if (!showTooltip) return;
    const handleDismiss = () => setShowTooltip(false);
    window.addEventListener('scroll', handleDismiss, true);
    window.addEventListener('resize', handleDismiss);
    return () => {
      window.removeEventListener('scroll', handleDismiss, true);
      window.removeEventListener('resize', handleDismiss);
    };
  }, [showTooltip]);

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-flex items-center gap-1 cursor-help"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children || (
          <span className="text-xs text-[#c9bea9] hover:text-[#dfb15b] transition-colors flex items-center gap-1">
            <span className="capitalize font-semibold">{info.name}</span>
            <Info className="w-3 h-3 text-[#a4864c]" />
          </span>
        )}
      </div>

      {showTooltip &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 99999,
            }}
            className="w-72 p-3.5 bg-[#17121c] border border-[#3d2e47] rounded-xl shadow-2xl text-left pointer-events-none backdrop-blur-md animate-in fade-in duration-100 text-xs text-[#c9bea9]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#291f33] pb-2 mb-2">
              <span className="font-rpg font-bold text-sm text-[#f0e8db] capitalize flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#dfb15b]" />
                {info.name}
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#2a1d12] text-[#f5cb71] border border-[#5e4726]">
                Growth {info.growth}
              </span>
            </div>

            {/* Career Window & Peak */}
            <div className="flex items-center gap-1.5 text-[11px] text-[#86afdf] mb-2 font-mono">
              <Clock className="w-3 h-3 text-[#86afdf] shrink-0" />
              <span>Career: {info.careerWindow}</span>
            </div>

            {/* Summary */}
            <p className="text-[11px] text-[#8e8070] leading-snug mb-2.5">
              {info.summary}
            </p>

            {/* Strengths & Weaknesses */}
            <div className="space-y-1.5 pt-2 border-t border-[#231a2c] text-[11px]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#6bc79d] block mb-0.5">
                  Stat Strengths (+)
                </span>
                <div className="flex items-center gap-1 flex-wrap">
                  {info.strengths.map((s) => (
                    <span
                      key={s}
                      className="px-1.5 py-0.2 rounded bg-[#13281c] text-[#71caa2] border border-[#205439] text-[10px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {info.weaknesses.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#e67e8c] block mb-0.5">
                    Stat Leanings / Trade-offs (-)
                  </span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {info.weaknesses.map((w) => (
                      <span
                        key={w}
                        className="px-1.5 py-0.2 rounded bg-[#30161a] text-[#e67e8c] border border-[#5e2730] text-[10px]"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Favored Classes */}
              <div className="pt-1">
                <span className="text-[10px] uppercase font-bold text-[#dfb15b] block mb-0.5 flex items-center gap-1">
                  <Swords className="w-2.5 h-2.5" /> Optimal Classes
                </span>
                <span className="text-[10px] text-[#c9bea9]">
                  {info.favoredClasses.join(', ')}
                </span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
