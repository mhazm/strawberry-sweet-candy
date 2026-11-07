import { Adventurer, EquipmentItem } from '../types/savegame';
import { CLASSES_META, SYNERGIES, evaluatePartySynergies, SynergyDefinition } from './synergy';

export type ConditionId =
  | 'flooded'
  | 'darkness'
  | 'cursed'
  | 'deepcold'
  | 'infernal'
  | 'frozen';

export interface ConditionDefinition {
  id: ConditionId;
  aliases: string[];
  nameKey: string;
  descKey: string;
  biomes: string[];
  penaltySummaryKey: string;
  counterItems: string[];
  counterTraits: string[];
  vulnerableTraits?: string[];
  penalizedAttackTypes?: ('melee' | 'ranged' | 'spell')[];
  immuneAttackTypes?: ('melee' | 'ranged' | 'spell')[];
  penalizedResources?: ('mana' | 'focus' | 'stamina' | 'rage')[];
  immuneResources?: ('mana' | 'focus' | 'stamina' | 'rage')[];
  preferredRoles?: ('tank' | 'dps' | 'healer')[];
  accentColor: string; // Tailwind color class for border/accents
  badgeBg: string;
}

export const CONDITIONS: Record<ConditionId, ConditionDefinition> = {
  flooded: {
    id: 'flooded',
    aliases: ['flooded', 'water', 'flood'],
    nameKey: 'condFlooded',
    descKey: 'condFloodedDesc',
    biomes: ['warren', 'crypt', 'ruin', 'cavern'],
    penaltySummaryKey: 'condFloodedPenalty',
    counterItems: ['Stormwax Waders', 'Sealskin Greaves', 'Barrow-Kelp Boots'],
    counterTraits: ['sure-footed', 'pathfinder'],
    vulnerableTraits: ['clumsy'],
    penalizedAttackTypes: ['melee'],
    immuneAttackTypes: ['ranged', 'spell'],
    accentColor: '#38bdf8',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
  },
  darkness: {
    id: 'darkness',
    aliases: ['darkness', 'pitch-dark', 'pitchdark', 'dark'],
    nameKey: 'condPitchDark',
    descKey: 'condPitchDarkDesc',
    biomes: ['den', 'crypt', 'ruin', 'cavern'],
    penaltySummaryKey: 'condPitchDarkPenalty',
    counterItems: ['Everburning Torch', 'Sunstone Lantern', 'Marmot-Fat Lamp'],
    counterTraits: ['night-eyed', 'sure-footed'],
    vulnerableTraits: ['clumsy'],
    penalizedAttackTypes: ['ranged', 'spell'],
    immuneAttackTypes: ['melee'],
    accentColor: '#a855f7',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
  },
  cursed: {
    id: 'cursed',
    aliases: ['cursed', 'cursed-ground', 'cursedground'],
    nameKey: 'condCursedGround',
    descKey: 'condCursedGroundDesc',
    biomes: ['crypt', 'ruin', 'infernal'],
    penaltySummaryKey: 'condCursedGroundPenalty',
    counterItems: ['Warding Charm', 'Spirit Ward', 'Kingsfoil Knot'],
    counterTraits: ['unbreakable', 'iron-willed', 'stalwart', 'tireless'],
    vulnerableTraits: ['superstitious', 'haunted', 'cowardly'],
    penalizedResources: ['mana', 'focus'],
    immuneResources: ['stamina', 'rage'],
    accentColor: '#ec4899',
    badgeBg: 'rgba(236, 72, 153, 0.15)',
  },
  deepcold: {
    id: 'deepcold',
    aliases: ['deepcold', 'deep-cold', 'deepCold', 'cold'],
    nameKey: 'condDeepCold',
    descKey: 'condDeepColdDesc',
    biomes: ['frozen', 'cavern'],
    penaltySummaryKey: 'condDeepColdPenalty',
    counterItems: ['Furred Mantle', 'Rimeguard Cloak', 'Eagle-Down Mantle'],
    counterTraits: [
      'cold-tempered',
      'hardy',
      'death-defying',
      'field-medic',
      'stalwart',
      'hopeful',
      'unbreakable',
      'tireless',
      'quick-to-mend',
    ],
    vulnerableTraits: ['brittle', 'cowardly', 'haunted', 'shaken'],
    preferredRoles: ['healer'],
    accentColor: '#06b6d4',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
  },
  infernal: {
    id: 'infernal',
    aliases: ['infernal', 'fire', 'scorch'],
    nameKey: 'condInfernal',
    descKey: 'condInfernalDesc',
    biomes: ['infernal', 'warren'],
    penaltySummaryKey: 'condInfernalPenalty',
    counterItems: ["Kingsfoil Pouch", 'Scorchwort Satchel', "Physician's Roll"],
    counterTraits: ['ash-hardened', 'thick-skinned', 'hardy', 'quick-to-mend', 'field-medic'],
    vulnerableTraits: ['brittle', 'clumsy'],
    preferredRoles: ['healer', 'dps'],
    accentColor: '#f97316',
    badgeBg: 'rgba(249, 115, 22, 0.15)',
  },
  frozen: {
    id: 'frozen',
    aliases: ['frozen', 'numbing-frost', 'numbingfrost', 'frost'],
    nameKey: 'condNumbingFrost',
    descKey: 'condNumbingFrostDesc',
    biomes: ['frozen'],
    penaltySummaryKey: 'condNumbingFrostPenalty',
    counterItems: ['Barkweave Tunic', 'Mossback Jerkin', 'Stag-Hide Coat'],
    counterTraits: ['cold-tempered', 'tireless', 'iron-willed'],
    vulnerableTraits: ['brittle', 'shaken'],
    penalizedResources: ['stamina', 'rage'],
    immuneResources: ['mana', 'focus'],
    accentColor: '#14b8a6',
    badgeBg: 'rgba(20, 184, 166, 0.15)',
  },
};

export const CLASS_RESOURCES: Record<string, 'mana' | 'focus' | 'stamina' | 'rage'> = {
  guardian: 'stamina',
  warden: 'stamina',
  paladin: 'focus',
  blademaster: 'rage',
  ranger: 'stamina',
  arcanist: 'mana',
  cleric: 'mana',
  druid: 'mana',
  bard: 'focus',
};

export interface EvaluationFactor {
  text: string;
  delta: number;
  type: 'positive' | 'negative' | 'neutral';
}

export interface DelverEvaluation {
  delver: Adventurer;
  score: number;
  tier: 'optimal' | 'viable' | 'vulnerable';
  factors: EvaluationFactor[];
  matchedCounterTraits: string[];
  matchedVulnerableTraits: string[];
  equippedCounterItem: EquipmentItem | null;
  stashCounterItem: EquipmentItem | null;
}

export function matchesConditionItem(item: EquipmentItem, cond: ConditionDefinition): boolean {
  if (item.counters) {
    const cLower = item.counters.toLowerCase();
    if (cond.aliases.some((a) => a.toLowerCase() === cLower)) return true;
  }
  const nameLower = item.name.toLowerCase();
  return cond.counterItems.some((ci) => nameLower.includes(ci.toLowerCase()));
}

export function evaluateDelverForCondition(
  delver: Adventurer,
  cond: ConditionDefinition,
  guildStash: EquipmentItem[] = []
): DelverEvaluation {
  const meta = CLASSES_META[delver.classId.toLowerCase()];
  const attackType = meta ? meta.attackType : 'melee';
  const resource = CLASS_RESOURCES[delver.classId.toLowerCase()] || 'stamina';

  let score = 50; // baseline
  const factors: EvaluationFactor[] = [];

  // 1. Attack type impact
  if (cond.penalizedAttackTypes?.includes(attackType)) {
    score -= 25;
    factors.push({
      text: `Penalized attack style: ${attackType.toUpperCase()} suffers condition penalty`,
      delta: -25,
      type: 'negative',
    });
  } else if (cond.immuneAttackTypes?.includes(attackType)) {
    score += 20;
    factors.push({
      text: `Immune attack style: ${attackType.toUpperCase()} bypasses condition penalty`,
      delta: +20,
      type: 'positive',
    });
  }

  // 2. Resource impact
  if (cond.penalizedResources?.includes(resource)) {
    score -= 25;
    factors.push({
      text: `Penalized resource: ${resource.toUpperCase()} is drained by condition`,
      delta: -25,
      type: 'negative',
    });
  } else if (cond.immuneResources?.includes(resource)) {
    score += 20;
    factors.push({
      text: `Immune resource: ${resource.toUpperCase()} is unaffected by condition`,
      delta: +20,
      type: 'positive',
    });
  }

  // 3. Preferred roles (e.g. Healers in Deep Cold or Infernal)
  if (cond.preferredRoles && meta && cond.preferredRoles.includes(meta.role)) {
    score += 15;
    factors.push({
      text: `Essential role: ${meta.role.toUpperCase()} critical for mitigating condition hazard`,
      delta: +15,
      type: 'positive',
    });
  }

  // 4. Counter traits
  const matchedCounterTraits: string[] = [];
  const delverTraits = delver.traitIds || [];
  for (const tid of delverTraits) {
    const tidLower = tid.toLowerCase();
    if (cond.counterTraits.some((ct) => ct.toLowerCase() === tidLower)) {
      matchedCounterTraits.push(tid);
      score += 20;
      factors.push({
        text: `Counter trait possessed: ${tid}`,
        delta: +20,
        type: 'positive',
      });
    }
  }

  // 5. Vulnerable traits
  const matchedVulnerableTraits: string[] = [];
  if (cond.vulnerableTraits) {
    for (const tid of delverTraits) {
      const tidLower = tid.toLowerCase();
      if (cond.vulnerableTraits.some((vt) => vt.toLowerCase() === tidLower)) {
        matchedVulnerableTraits.push(tid);
        score -= 15;
        factors.push({
          text: `Vulnerability trait possessed: ${tid}`,
          delta: -15,
          type: 'negative',
        });
      }
    }
  }

  // 6. Equipped gear counters
  let equippedCounterItem: EquipmentItem | null = null;
  if (delver.equipment) {
    for (const slotKey of ['weapon', 'armour', 'trinket'] as const) {
      const eq = delver.equipment[slotKey];
      if (eq && matchesConditionItem(eq, cond)) {
        equippedCounterItem = eq;
        score += 25;
        factors.push({
          text: `Equipped counter item: ${eq.name}`,
          delta: +25,
          type: 'positive',
        });
        break;
      }
    }
  }

  // 7. Stash gear counter available
  let stashCounterItem: EquipmentItem | null = null;
  if (!equippedCounterItem && guildStash && guildStash.length > 0) {
    for (const item of guildStash) {
      if (matchesConditionItem(item, cond)) {
        stashCounterItem = item;
        score += 10;
        factors.push({
          text: `Counter gear available in Guild Stash: ${item.name}`,
          delta: +10,
          type: 'positive',
        });
        break;
      }
    }
  }

  // 8. Delver condition & fatigue penalties
  if (delver.condition < 40) {
    score -= 15;
    factors.push({
      text: `Low delver condition (${delver.condition}%)`,
      delta: -15,
      type: 'negative',
    });
  }
  if (delver.stress > 60) {
    score -= 15;
    factors.push({
      text: `High stress level (${delver.stress})`,
      delta: -15,
      type: 'negative',
    });
  }

  // Ability competence scaling (CA scaled by 0.1)
  const caBonus = Math.round((delver.currentAbility || 100) * 0.1);
  score += caBonus;
  factors.push({
    text: `Combat ability rating (CA ${delver.currentAbility})`,
    delta: caBonus,
    type: 'neutral',
  });

  // Clamp score
  const finalScore = Math.max(5, Math.min(100, score));

  let tier: 'optimal' | 'viable' | 'vulnerable';
  if (finalScore >= 75) {
    tier = 'optimal';
  } else if (finalScore >= 55) {
    tier = 'viable';
  } else {
    tier = 'vulnerable';
  }

  return {
    delver,
    score: finalScore,
    tier,
    factors,
    matchedCounterTraits,
    matchedVulnerableTraits,
    equippedCounterItem,
    stashCounterItem,
  };
}

export function evaluateRosterForCondition(
  roster: Adventurer[],
  cond: ConditionDefinition,
  guildStash: EquipmentItem[] = []
): DelverEvaluation[] {
  return roster
    .map((d) => evaluateDelverForCondition(d, cond, guildStash))
    .sort((a, b) => b.score - a.score);
}

export interface RecommendedSquad {
  members: Adventurer[];
  totalScore: number;
  averageScore: number;
  synergies: SynergyDefinition[];
  compositionSummary: {
    tanks: number;
    dps: number;
    healers: number;
  };
}

export function findRecommendedSquadForCondition(
  roster: Adventurer[],
  cond: ConditionDefinition,
  guildStash: EquipmentItem[] = []
): RecommendedSquad | null {
  if (!roster || roster.length === 0) return null;

  const evaluations = evaluateRosterForCondition(roster, cond, guildStash);
  if (evaluations.length < 4) {
    // If fewer than 4 members, just take all available
    const members = evaluations.map((e) => e.delver);
    const totalScore = evaluations.reduce((sum, e) => sum + e.score, 0);
    const synergiesResult = evaluatePartySynergies(members);
    return {
      members,
      totalScore,
      averageScore: Math.round(totalScore / members.length),
      synergies: synergiesResult.activeSynergies,
      compositionSummary: getPartyComposition(members),
    };
  }

  // Group by role
  const tanks = evaluations.filter((e) => CLASSES_META[e.delver.classId.toLowerCase()]?.role === 'tank');
  const dps = evaluations.filter((e) => CLASSES_META[e.delver.classId.toLowerCase()]?.role === 'dps');
  const healers = evaluations.filter((e) => CLASSES_META[e.delver.classId.toLowerCase()]?.role === 'healer');

  // Candidate generation
  // Standard party: 1 Tank, 1 Healer, 2 DPS
  // Or alternative: 2 Tanks, 1 Healer, 1 DPS / 1 Tank, 2 Healers, 1 DPS
  const candidates: Adventurer[][] = [];

  // 1. Balanced: Tank + Healer + 2 DPS
  if (tanks.length >= 1 && healers.length >= 1 && dps.length >= 2) {
    for (let t = 0; t < Math.min(2, tanks.length); t++) {
      for (let h = 0; h < Math.min(2, healers.length); h++) {
        for (let d1 = 0; d1 < Math.min(3, dps.length); d1++) {
          for (let d2 = d1 + 1; d2 < Math.min(4, dps.length); d2++) {
            candidates.push([tanks[t].delver, healers[h].delver, dps[d1].delver, dps[d2].delver]);
          }
        }
      }
    }
  }

  // 2. Defensive (Phalanx): 2 Tanks + 1 Healer + 1 DPS
  if (tanks.length >= 2 && healers.length >= 1 && dps.length >= 1) {
    for (let t1 = 0; t1 < Math.min(2, tanks.length); t1++) {
      for (let t2 = t1 + 1; t2 < Math.min(3, tanks.length); t2++) {
        for (let h = 0; h < Math.min(2, healers.length); h++) {
          for (let d = 0; d < Math.min(2, dps.length); d++) {
            candidates.push([tanks[t1].delver, tanks[t2].delver, healers[h].delver, dps[d].delver]);
          }
        }
      }
    }
  }

  // 3. Fallback: Top 4 highest scoring delvers
  candidates.push(evaluations.slice(0, 4).map((e) => e.delver));

  // Score candidates: combine condition scores + synergy bonuses
  const evalMap = new Map<string, number>();
  evaluations.forEach((e) => evalMap.set(e.delver.id, e.score));

  let bestParty: Adventurer[] = candidates[0];
  let bestValue = -1;
  let bestSynergies: SynergyDefinition[] = [];

  for (const party of candidates) {
    const condScoreSum = party.reduce((sum, d) => sum + (evalMap.get(d.id) || 50), 0);
    const synResult = evaluatePartySynergies(party);
    // Each active synergy adds 15 value points
    const synergyBonusValue = synResult.activeSynergies.length * 15;
    const totalValue = condScoreSum + synergyBonusValue;

    if (totalValue > bestValue) {
      bestValue = totalValue;
      bestParty = party;
      bestSynergies = synResult.activeSynergies;
    }
  }

  const finalPartyScores = bestParty.reduce((sum, d) => sum + (evalMap.get(d.id) || 50), 0);

  return {
    members: bestParty,
    totalScore: finalPartyScores,
    averageScore: Math.round(finalPartyScores / bestParty.length),
    synergies: bestSynergies,
    compositionSummary: getPartyComposition(bestParty),
  };
}

function getPartyComposition(party: Adventurer[]): { tanks: number; dps: number; healers: number } {
  let tanks = 0;
  let dps = 0;
  let healers = 0;
  for (const d of party) {
    const role = CLASSES_META[d.classId.toLowerCase()]?.role;
    if (role === 'tank') tanks++;
    else if (role === 'healer') healers++;
    else if (role === 'dps') dps++;
  }
  return { tanks, dps, healers };
}

export function findConditionByIdOrAlias(input: string): ConditionDefinition | undefined {
  const normalized = input.toLowerCase().trim();
  for (const cond of Object.values(CONDITIONS)) {
    if (cond.id.toLowerCase() === normalized) return cond;
    if (cond.aliases.some((a) => a.toLowerCase() === normalized)) return cond;
  }
  return undefined;
}

export function getConditionsForBiome(biome: string): ConditionDefinition[] {
  const bLower = biome.toLowerCase().trim();
  return Object.values(CONDITIONS).filter((c) => c.biomes.some((b) => b.toLowerCase() === bLower));
}
