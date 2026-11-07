import { CLASSES_META } from './synergy';

export interface RoleTraitRecommendation {
  recommended: string[];
  optimalPreset: string[]; // 4 core traits to apply with 1-click
  harmful: string[];
  roleName: 'tank' | 'dps' | 'healer';
}

export const ROLE_TRAIT_MAP: Record<'tank' | 'dps' | 'healer', RoleTraitRecommendation> = {
  tank: {
    roleName: 'tank',
    recommended: [
      'brave',
      'dauntless',
      'unbreakable',
      'humble',
      'stalwart',
      'thick-skinned',
      'hardy',
      'death-defying',
      'indomitable',
      'stone-still',
      'sure-footed',
      'hard-headed',
    ],
    optimalPreset: ['dauntless', 'unbreakable', 'thick-skinned', 'hardy'],
    harmful: ['cowardly', 'brittle', 'frail', 'glass-jawed', 'shaken'],
  },
  dps: {
    roleName: 'dps',
    recommended: [
      'giant-killer',
      'big-game-player',
      'ambitious',
      'methodical',
      'crucible-raised',
      'sure-footed',
      'quick-witted',
      'blood-drunk',
      'hard-headed',
      'death-defying',
      'road-hardened',
    ],
    optimalPreset: ['giant-killer', 'big-game-player', 'ambitious', 'methodical'],
    harmful: ['glass-jawed', 'clumsy', 'sore-loser', 'frail'],
  },
  healer: {
    roleName: 'healer',
    recommended: [
      'field-medic',
      'hopeful',
      'quick-to-mend',
      'tireless',
      'iron-willed',
      'peacemaker',
      'unbreakable',
      'cool-headed',
      'dutiful',
      'sure-footed',
    ],
    optimalPreset: ['field-medic', 'hopeful', 'quick-to-mend', 'iron-willed'],
    harmful: ['hollow-willed', 'unforgiving', 'haunted', 'shaken'],
  },
};

export function getRoleForDelver(classId?: string, fallbackRole?: string): 'tank' | 'dps' | 'healer' {
  if (classId) {
    const meta = CLASSES_META[classId.toLowerCase()];
    if (meta && meta.role) return meta.role;
  }
  const normalized = (fallbackRole || '').toLowerCase();
  if (normalized === 'tank') return 'tank';
  if (normalized === 'healer') return 'healer';
  return 'dps';
}

export function isTraitRecommendedForRole(traitId: string, role: 'tank' | 'dps' | 'healer'): boolean {
  const norm = traitId.toLowerCase().trim();
  const rec = ROLE_TRAIT_MAP[role];
  return rec ? rec.recommended.includes(norm) : false;
}

export function isTraitHarmfulForRole(traitId: string, role: 'tank' | 'dps' | 'healer'): boolean {
  const norm = traitId.toLowerCase().trim();
  const rec = ROLE_TRAIT_MAP[role];
  return rec ? rec.harmful.includes(norm) : false;
}

export function getOptimalPresetForRole(role: 'tank' | 'dps' | 'healer'): string[] {
  return ROLE_TRAIT_MAP[role]?.optimalPreset || [];
}
