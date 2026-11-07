import { Adventurer, AdventurerAttributes, AdventurerHiddenAttributes } from '../types/savegame';

function randBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface WonderkidGachaResult {
  age: number;
  level: number;
  currentAbility: number;
  potentialAbility: number;
  attributes: AdventurerAttributes;
  hidden: AdventurerHiddenAttributes;
  traitIds: string[];
  morale: number;
  condition: number;
  stress: number;
  fatigue: number;
  injury: null;
}

// Class-specific attribute weighting profiles based on official data from dungeonsanddynasties.com/class
const CLASS_STAT_PROFILES: Record<
  string,
  {
    primary: (keyof AdventurerAttributes)[];
    secondary: (keyof AdventurerAttributes)[];
    traits: string[];
  }
> = {
  arcanist: {
    primary: ['spellcraft', 'criticalStrike', 'concentration', 'decisions', 'anticipation', 'crowdControl', 'power'],
    secondary: ['evasion', 'speed', 'reflexes', 'teamwork', 'resolve', 'discipline', 'vitality', 'composure'],
    traits: ['quick-witted', 'diligent', 'consistent', 'cool-headed', 'big-game-player'],
  },
  blademaster: {
    primary: ['weaponSkill', 'power', 'criticalStrike', 'agility', 'speed', 'positioning', 'strength'],
    secondary: ['parry', 'evasion', 'stamina', 'vitality', 'bravery', 'aggression', 'reflexes', 'decisions', 'discipline'],
    traits: ['quick-witted', 'diligent', 'giant-killer', 'dauntless', 'big-game-player'],
  },
  guardian: {
    primary: ['threat', 'armorUse', 'parry', 'mitigation', 'vitality', 'bravery', 'strength', 'resolve'],
    secondary: ['stamina', 'composure', 'positioning', 'teamwork', 'discipline', 'weaponSkill', 'decisions'],
    traits: ['quick-witted', 'diligent', 'stalwart', 'unbreakable', 'thick-skinned'],
  },
  warden: {
    primary: ['vitality', 'mitigation', 'armorUse', 'threat', 'strength', 'aggression', 'crowdControl', 'bravery'],
    secondary: ['stamina', 'composure', 'power', 'resolve', 'parry', 'discipline', 'positioning', 'weaponSkill'],
    traits: ['quick-witted', 'diligent', 'stalwart', 'sure-footed', 'unbreakable'],
  },
  cleric: {
    primary: ['healing', 'composure', 'decisions', 'concentration', 'anticipation', 'spellcraft', 'support'],
    secondary: ['armorUse', 'vitality', 'resolve', 'positioning', 'teamwork', 'discipline', 'stamina'],
    traits: ['quick-witted', 'diligent', 'field-medic', 'inspiring', 'hopeful'],
  },
  bard: {
    primary: ['support', 'teamwork', 'healing', 'leadership', 'anticipation', 'decisions', 'crowdControl'],
    secondary: ['spellcraft', 'evasion', 'speed', 'composure', 'vitality', 'stamina', 'reflexes', 'discipline'],
    traits: ['quick-witted', 'diligent', 'charismatic', 'crowd-pleaser', 'inspiring'],
  },
  ranger: {
    primary: ['marksmanship', 'anticipation', 'agility', 'positioning', 'reflexes', 'criticalStrike', 'speed'],
    secondary: ['stamina', 'composure', 'decisions', 'evasion', 'power', 'vitality', 'discipline'],
    traits: ['quick-witted', 'diligent', 'pathfinder', 'trap-wise', 'sure-footed'],
  },
};

export function rollWonderkidGacha(hero: Adventurer): WonderkidGachaResult {
  const classKey = hero.classId.toLowerCase();
  const profile = CLASS_STAT_PROFILES[classKey] || CLASS_STAT_PROFILES.blademaster;

  // 1. Generate core 30 attributes tuned to the class profile
  const allStatKeys: (keyof AdventurerAttributes)[] = [
    'weaponSkill', 'marksmanship', 'power', 'spellcraft', 'armorUse', 'parry', 'evasion', 'criticalStrike',
    'composure', 'bravery', 'decisions', 'anticipation', 'teamwork', 'leadership', 'concentration', 'aggression',
    'discipline', 'resolve', 'strength', 'agility', 'stamina', 'vitality', 'speed', 'reflexes',
    'threat', 'mitigation', 'healing', 'support', 'crowdControl', 'positioning',
  ];

  const rolledAttrs: any = {};
  allStatKeys.forEach((key) => {
    if (profile.primary.includes(key)) {
      // Primary core pillar stat: roll 17 to 20 (elite superstar!)
      rolledAttrs[key] = randBetween(17, 20);
    } else if (profile.secondary.includes(key)) {
      // Secondary supporting stat: roll 13 to 16
      rolledAttrs[key] = randBetween(13, 16);
    } else {
      // Tertiary base stat: roll 8 to 11 (clean, balanced base)
      rolledAttrs[key] = randBetween(8, 11);
    }
  });

  // 2. High Potential & Current Ability
  // Potential: 192 - 200 (True generational wonderkid)
  const potentialAbility = randBetween(192, 200);
  // Current Ability: 120 - 138 (Remarkably polished for age 17-18)
  const currentAbility = randBetween(120, 138);

  // 3. Elite Hidden Attributes (Football Manager style)
  const rolledHidden: AdventurerHiddenAttributes = {
    consistency: randBetween(18, 20), // Peak consistency
    bigGame: randBetween(18, 20),     // Clutch in major matches & boss delves
    pressure: randBetween(18, 20),    // Calm under pressure
    deathProneness: randBetween(1, 2), // Minimal permadeath risk
    loyalty: randBetween(19, 20),     // Faithful to the guild hall
    adaptability: randBetween(18, 20),// Learns any tactic instantly
    dirtiness: randBetween(6, 11),
  };

  // 4. Traits: Cleanse flaws, inject class-tailored wonderkid synergy perks
  const negativeFlaws = new Set([
    'lazy', 'frail', 'glass-jawed', 'cowardly', 'insubordinate',
    'slow-to-mend', 'fair-weather', 'clumsy', 'brittle', 'jinxed',
    'sore-loser', 'haunted', 'death-seeker', 'hot-headed', 'reckless',
  ]);

  const existingGoodTraits = (hero.traitIds || []).filter((t) => !negativeFlaws.has(t));
  const newTraitsSet = new Set<string>([...existingGoodTraits, ...profile.traits]);

  return {
    age: randBetween(17, 18),
    level: Math.max(hero.level, randBetween(2, 4)),
    currentAbility,
    potentialAbility,
    attributes: rolledAttrs as AdventurerAttributes,
    hidden: rolledHidden,
    traitIds: Array.from(newTraitsSet),
    morale: 100,
    condition: 100,
    stress: 0,
    fatigue: 0,
    injury: null,
  };
}

