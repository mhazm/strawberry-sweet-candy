import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatGold(amount: number): string {
  if (amount == null) return '0';
  return new Intl.NumberFormat('en-US').format(amount);
}

export function getStatTierColor(val: number): {
  text: string;
  bg: string;
  border: string;
  bar: string;
  hex: string;
} {
  // In-Game Attributes Color Coding (matching exact screenshot palette)
  // Tier 4 (14-20): Radiant warm gold
  if (val >= 14) {
    return {
      text: 'text-[#f5cb71] font-bold',
      bg: 'bg-[#332410]',
      border: 'border-[#6e532b]',
      bar: 'bg-[#f5cb71] shadow-[0_0_8px_rgba(245,203,113,0.35)]',
      hex: '#f5cb71',
    };
  }
  // Tier 3 (10-13): Warm Amber
  if (val >= 10) {
    return {
      text: 'text-[#dfb15b] font-semibold',
      bg: 'bg-[#2b2012]',
      border: 'border-[#544122]',
      bar: 'bg-[#dfb15b]',
      hex: '#dfb15b',
    };
  }
  // Tier 2 (5-9): Orange-Rust
  if (val >= 5) {
    return {
      text: 'text-[#bd5d3b] font-medium',
      bg: 'bg-[#241714]',
      border: 'border-[#4e2720]',
      bar: 'bg-[#bd5d3b]',
      hex: '#bd5d3b',
    };
  }
  // Tier 1 (1-4): Deep Rust Red
  return {
    text: 'text-[#a04a3e]',
    bg: 'bg-[#261518]',
    border: 'border-[#4f272c]',
    bar: 'bg-[#a04a3e]',
    hex: '#a04a3e',
  };
}

export function getAbilityTier(ca: number, pa: number): {
  badge: string;
  badgeClass: string;
} {
  if (pa >= 170) {
    return { badge: 'World Class', badgeClass: 'bg-[#332410] text-[#f5cb71] border-[#6e532b]' };
  }
  if (pa >= 130) {
    return { badge: 'Elite Hero', badgeClass: 'bg-[#2e1d38] text-[#c78ade] border-[#552e69]' };
  }
  if (pa >= 90) {
    return { badge: 'Veteran', badgeClass: 'bg-[#182638] text-[#86afdf] border-[#294269]' };
  }
  if (pa >= 60) {
    return { badge: 'Established', badgeClass: 'bg-[#143023] text-[#71caa2] border-[#255e42]' };
  }
  return { badge: 'Novice', badgeClass: 'bg-[#201a14] text-[#8e8273] border-[#443828]' };
}
