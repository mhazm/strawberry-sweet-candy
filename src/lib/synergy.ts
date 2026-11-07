import { Adventurer } from '../types/savegame';

export interface ClassMeta {
  id: string;
  name: string;
  role: 'tank' | 'dps' | 'healer';
  attackType: 'melee' | 'ranged' | 'spell';
}

export const CLASSES_META: Record<string, ClassMeta> = {
  guardian: { id: 'guardian', name: 'Guardian', role: 'tank', attackType: 'melee' },
  warden: { id: 'warden', name: 'Warden', role: 'tank', attackType: 'melee' },
  paladin: { id: 'paladin', name: 'Paladin', role: 'tank', attackType: 'melee' },
  blademaster: { id: 'blademaster', name: 'Blademaster', role: 'dps', attackType: 'melee' },
  arcanist: { id: 'arcanist', name: 'Arcanist', role: 'dps', attackType: 'spell' },
  ranger: { id: 'ranger', name: 'Ranger', role: 'dps', attackType: 'ranged' },
  cleric: { id: 'cleric', name: 'Cleric', role: 'healer', attackType: 'spell' },
  druid: { id: 'druid', name: 'Druid', role: 'healer', attackType: 'spell' },
  bard: { id: 'bard', name: 'Bard', role: 'healer', attackType: 'ranged' },
};

export interface SynergyRequirement {
  k: 'has' | 'role' | 'dps' | 'size';
  cls?: string;
  role?: 'tank' | 'dps' | 'healer';
  op?: 'gte' | 'eq';
  n?: number;
  dtype?: 'arms' | 'spell';
}

export interface SynergyBonuses {
  damage: number;
  healing: number;
  mitigation: number;
}

export interface SynergyDefinition {
  id: string;
  name: string;
  members: string[];
  blurb: string;
  effectDesc: string;
  bonuses: SynergyBonuses;
  requirements: SynergyRequirement[];
}

export const SYNERGIES: SynergyDefinition[] = [
  {
    id: 'sanctuary-engine',
    name: 'Sanctuary Engine',
    members: ['guardian', 'cleric'],
    blurb: 'A Guardian holds the line while a Cleric mends behind the shield, and wounds close as fast as they open.',
    effectDesc: '+15% healing · +3% mitigation',
    bonuses: { damage: 0, healing: 0.15, mitigation: 0.03 },
    requirements: [
      { k: 'has', cls: 'guardian' },
      { k: 'has', cls: 'cleric' },
    ],
  },
  {
    id: 'sword-and-sorcery',
    name: 'Sword & Sorcery',
    members: ['blademaster', 'arcanist'],
    blurb: 'A Blademaster draws the eye while an Arcanist burns the enemy down from behind the steel.',
    effectDesc: '+7% party damage',
    bonuses: { damage: 0.07, healing: 0, mitigation: 0 },
    requirements: [
      { k: 'has', cls: 'blademaster' },
      { k: 'has', cls: 'arcanist' },
    ],
  },
  {
    id: 'skirmish-line',
    name: 'Skirmish Line',
    members: ['ranger', 'blademaster'],
    blurb: 'A Ranger and a Blademaster bracket the foe, no escape near or far.',
    effectDesc: '+5% party damage',
    bonuses: { damage: 0.05, healing: 0, mitigation: 0 },
    requirements: [
      { k: 'has', cls: 'ranger' },
      { k: 'has', cls: 'blademaster' },
    ],
  },
  {
    id: 'storm-and-cinder',
    name: 'Storm and Cinder',
    members: ['warden', 'arcanist'],
    blurb: 'A Warden opens the pack up and an Arcanist drops fire into the gap.',
    effectDesc: '+7% party damage',
    bonuses: { damage: 0.07, healing: 0, mitigation: 0 },
    requirements: [
      { k: 'has', cls: 'warden' },
      { k: 'has', cls: 'arcanist' },
    ],
  },
  {
    id: 'phalanx',
    name: 'Phalanx',
    members: ['tank', 'tank'],
    blurb: 'Two shields locked into an unbroken wall: the enemy breaks against it.',
    effectDesc: '+7% mitigation',
    bonuses: { damage: 0, healing: 0, mitigation: 0.07 },
    requirements: [
      { k: 'role', role: 'tank', op: 'gte', n: 2 },
    ],
  },
  {
    id: 'warsong',
    name: 'Warsong',
    members: ['bard', 'dps', 'dps'],
    blurb: 'A Bard at the back and blades enough at the front. The attackers set the pace and hold it.',
    effectDesc: '+6% party damage',
    bonuses: { damage: 0.06, healing: 0, mitigation: 0 },
    requirements: [
      { k: 'has', cls: 'bard' },
      { k: 'role', role: 'dps', op: 'gte', n: 2 },
    ],
  },
  {
    id: 'holy-order',
    name: 'Holy Order',
    members: ['paladin', 'cleric'],
    blurb: 'A Paladin and a Cleric fight as a consecrated order, righteous and unyielding.',
    effectDesc: '+10% healing · +3% party damage',
    bonuses: { damage: 0.03, healing: 0.10, mitigation: 0 },
    requirements: [
      { k: 'has', cls: 'paladin' },
      { k: 'has', cls: 'cleric' },
    ],
  },
  {
    id: 'thoughts-and-prayers',
    name: 'Thoughts and Prayers',
    members: ['tank', 'healer', 'healer', 'healer'],
    blurb: 'One shield and three sets of folded hands. Nobody is dying today, though nobody is killing much either.',
    effectDesc: '+10% party damage',
    bonuses: { damage: 0.10, healing: 0, mitigation: 0 },
    requirements: [
      { k: 'role', role: 'tank', op: 'gte', n: 1 },
      { k: 'role', role: 'healer', op: 'gte', n: 3 },
    ],
  },
  {
    id: 'you-shall-not-pass',
    name: 'You Shall Not Pass',
    members: ['tank', 'tank', 'tank', 'healer'],
    blurb: 'Three shields set in a line and one pair of hands behind them. Whatever is coming can stop where it stands.',
    effectDesc: '+3% mitigation · +10% healing · +5% party damage',
    bonuses: { damage: 0.05, healing: 0.10, mitigation: 0.03 },
    requirements: [
      { k: 'role', role: 'tank', op: 'gte', n: 3 },
      { k: 'role', role: 'healer', op: 'gte', n: 1 },
    ],
  },
  {
    id: 'the-last-wall',
    name: 'The Last Wall',
    members: ['tank', 'healer', 'dps:arms', 'dps:spell'],
    blurb: 'Sword, shield, spell and prayer, one of each and not one to spare. The line as it was first drawn.',
    effectDesc: '+5% party damage · +5% healing',
    bonuses: { damage: 0.05, healing: 0.05, mitigation: 0 },
    requirements: [
      { k: 'role', role: 'tank', op: 'eq', n: 1 },
      { k: 'role', role: 'healer', op: 'eq', n: 1 },
      { k: 'dps', dtype: 'arms', n: 1 },
      { k: 'dps', dtype: 'spell', n: 1 },
      { k: 'size', n: 4 },
    ],
  },
  {
    id: 'wild-bond',
    name: 'Wild Bond',
    members: ['druid', 'ranger'],
    blurb: 'A Druid and a Ranger move as hunter and wild as one, instinct shared between them.',
    effectDesc: '+4% party damage · +6% healing',
    bonuses: { damage: 0.04, healing: 0.06, mitigation: 0 },
    requirements: [
      { k: 'has', cls: 'druid' },
      { k: 'has', cls: 'ranger' },
    ],
  },
];

export interface PartySynergyResult {
  activeSynergies: SynergyDefinition[];
  inactiveSynergies: SynergyDefinition[];
  totalBonuses: SynergyBonuses;
  totalDamagePct: number;
  totalHealingPct: number;
  totalMitigationPct: number;
}

/**
 * Checks if a specific synergy requirement is satisfied by the party
 */
function checkRequirement(req: SynergyRequirement, party: { classId: string; role: string; attackType: string }[], partySize: number): boolean {
  if (req.k === 'has' && req.cls) {
    return party.some((p) => p.classId === req.cls);
  }

  if (req.k === 'role' && req.role) {
    const count = party.filter((p) => p.role === req.role).length;
    return req.op === 'gte' ? count >= (req.n || 0) : count === (req.n || 0);
  }

  if (req.k === 'dps' && req.dtype) {
    const count = party.filter((p) => {
      if (p.role !== 'dps') return false;
      return req.dtype === 'spell' ? p.attackType === 'spell' : p.attackType !== 'spell';
    }).length;
    return count === (req.n || 0);
  }

  if (req.k === 'size' && req.n !== undefined) {
    return partySize === req.n;
  }

  return false;
}

/**
 * Evaluates all synergies for a given list of party delvers
 */
export function evaluatePartySynergies(party: Adventurer[]): PartySynergyResult {
  const normalizedParty = party.map((delver) => {
    const classId = (delver.classId || '').toLowerCase();
    const meta = CLASSES_META[classId] || {
      id: classId,
      name: delver.classId,
      role: (delver.role?.toLowerCase() || 'dps') as 'tank' | 'dps' | 'healer',
      attackType: 'melee' as const,
    };
    return {
      classId,
      role: meta.role,
      attackType: meta.attackType,
    };
  });

  const activeSynergies: SynergyDefinition[] = [];
  const inactiveSynergies: SynergyDefinition[] = [];

  for (const synergy of SYNERGIES) {
    const isFired =
      synergy.requirements.length > 0 &&
      synergy.requirements.every((req) => checkRequirement(req, normalizedParty, party.length));

    if (isFired) {
      activeSynergies.push(synergy);
    } else {
      inactiveSynergies.push(synergy);
    }
  }

  const totalBonuses = activeSynergies.reduce(
    (acc, syn) => ({
      damage: acc.damage + syn.bonuses.damage,
      healing: acc.healing + syn.bonuses.healing,
      mitigation: acc.mitigation + syn.bonuses.mitigation,
    }),
    { damage: 0, healing: 0, mitigation: 0 }
  );

  return {
    activeSynergies,
    inactiveSynergies,
    totalBonuses,
    totalDamagePct: Math.round(totalBonuses.damage * 100),
    totalHealingPct: Math.round(totalBonuses.healing * 100),
    totalMitigationPct: Math.round(totalBonuses.mitigation * 100),
  };
}

export interface RecommendedParty {
  members: Adventurer[];
  activeSynergies: SynergyDefinition[];
  totalScore: number;
  totalDamagePct: number;
  totalHealingPct: number;
  totalMitigationPct: number;
}

/**
 * Finds top party combinations from the player's roster that maximize synergy triggers.
 */
export function findRecommendedParties(roster: Adventurer[], partySize = 4, limit = 5): RecommendedParty[] {
  if (roster.length < partySize) {
    return [];
  }

  const combinations: Adventurer[][] = [];

  function helper(start: number, current: Adventurer[]) {
    if (current.length === partySize) {
      combinations.push([...current]);
      return;
    }
    for (let i = start; i < roster.length; i++) {
      current.push(roster[i]);
      helper(i + 1, current);
      current.pop();
      // Cap at 150 combinations to prevent high CPU in huge rosters
      if (combinations.length > 150) return;
    }
  }

  helper(0, []);

  const results: RecommendedParty[] = combinations.map((party) => {
    const evalResult = evaluatePartySynergies(party);
    // Score based on number of active synergies and weighted stat bonuses
    const totalScore =
      evalResult.activeSynergies.length * 100 +
      evalResult.totalDamagePct * 1.5 +
      evalResult.totalHealingPct * 1.2 +
      evalResult.totalMitigationPct * 1.8;

    return {
      members: party,
      activeSynergies: evalResult.activeSynergies,
      totalScore,
      totalDamagePct: evalResult.totalDamagePct,
      totalHealingPct: evalResult.totalHealingPct,
      totalMitigationPct: evalResult.totalMitigationPct,
    };
  });

  // Sort descending by total score and return unique/diverse top compositions
  results.sort((a, b) => b.totalScore - a.totalScore);

  return results.slice(0, limit);
}
