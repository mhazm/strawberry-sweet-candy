import React from 'react';
import { getStatTierColor } from '../../lib/utils';
import { Star } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

interface StatSliderProps {
  label: string;
  value: number;
  abbr?: string;
  min?: number;
  max?: number;
  desc?: string;
  isPillar?: boolean;
  onChange: (val: number) => void;
}

export const StatSlider: React.FC<StatSliderProps> = ({
  label,
  value,
  abbr,
  min = 1,
  max = 20,
  desc,
  isPillar = false,
  onChange,
}) => {
  const tier = getStatTierColor(value);
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div
      className={`rounded-lg p-2.5 transition-all ${
        isPillar
          ? 'bg-[#1e1724] border border-[#594220] shadow-[0_0_10px_rgba(223,177,91,0.08)]'
          : 'bg-[#1a1622] border border-[#2d2333] hover:border-[#473850]'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <Tooltip
          title={label}
          badge={abbr ? abbr.toUpperCase() : undefined}
          content={desc}
          extra={
            isPillar ? (
              <div className="flex items-center gap-1.5 text-[11px] text-[#f5cb71] font-semibold">
                <Star className="w-3.5 h-3.5 fill-[#f5cb71] text-[#f5cb71] shrink-0" />
                <span>Class Key Pillar</span>
              </div>
            ) : undefined
          }
          className="truncate max-w-[calc(100%-52px)]"
        >
          <span className="text-xs font-medium text-[#c9bea9] truncate cursor-help flex items-center gap-1">
            {isPillar && (
              <Star className="w-3 h-3 text-[#f5cb71] fill-[#f5cb71] shrink-0" />
            )}
            <span className={isPillar ? 'text-[#f5cb71] font-semibold' : ''}>
              {label}
            </span>
            {abbr && (
              <span className="text-[10px] font-mono text-[#6e6153] uppercase ml-0.5">
                {abbr}
              </span>
            )}
          </span>
        </Tooltip>

        <div className="flex items-center gap-1.5 shrink-0">
          <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={(e) => {
              const parsed = parseInt(e.target.value);
              if (!isNaN(parsed)) {
                onChange(Math.max(min, Math.min(max, parsed)));
              }
            }}
            className={`w-11 text-right bg-[#131018] border ${tier.border} rounded px-1.5 py-0.5 text-xs font-mono font-bold ${tier.text} focus:outline-none`}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 h-2 bg-[#120f16] rounded-full overflow-hidden border border-[#231b29]">
          <div
            className={`h-full ${tier.bar} transition-all duration-150 rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || min)}
          className="w-16 accent-[#dfb15b] h-1 bg-transparent cursor-pointer"
        />
      </div>
    </div>
  );
};
