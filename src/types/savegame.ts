export interface SaveGameRoot {
  version: number;
  guild: GuildData;
  sig: string;
}

export interface GuildCrest {
  field?: number;
  second?: number;
  metal?: number;
  division?: string;
  charge?: string;
  shape?: string;
}

export interface PatronData {
  id?: string;
  name?: string;
  blurb?: string;
  ideal?: string;
  creed?: {
    kind?: string;
    text?: string;
  };
  temperament?: string;
  stipend?: number;
  mandate?: {
    kind?: string;
    target?: number;
    text?: string;
  };
  sigilSeed?: string;
  rarity?: string;
}

export interface AdventurerAttributes {
  // Physical / Combat stats (1-20 standard scale)
  weaponSkill: number;
  marksmanship: number;
  power: number;
  spellcraft: number;
  armorUse: number;
  parry: number;
  evasion: number;
  criticalStrike: number;
  composure: number;
  bravery: number;
  decisions: number;
  anticipation: number;
  teamwork: number;
  leadership: number;
  concentration: number;
  aggression: number;
  discipline: number;
  resolve: number;
  strength: number;
  agility: number;
  stamina: number;
  vitality: number;
  speed: number;
  reflexes: number;
  threat: number;
  mitigation: number;
  healing: number;
  support: number;
  crowdControl: number;
  positioning: number;
}

export interface AdventurerHiddenAttributes {
  consistency: number;
  bigGame: number;
  pressure: number;
  deathProneness: number;
  loyalty: number;
  adaptability: number;
  dirtiness: number;
}

export interface EquipmentItem {
  id: string;
  name: string;
  slot: string; // 'weapon' | 'armour' | 'trinket'
  rarity: string; // 'common' | 'rare' | 'mythic' | 'legendary'
  mods?: Record<string, number>;
  weaponKind?: string;
  value?: number;
  tier?: number;
  quality?: number;
  counters?: string;
  grantsTrait?: string;
  favours?: string[];
}

export interface AdventurerEquipment {
  weapon?: EquipmentItem | null;
  armour?: EquipmentItem | null;
  trinket?: EquipmentItem | null;
}

export interface AdventurerStakes {
  conviction?: string;
  vow?: {
    kind?: string;
    templateId?: string;
    name?: string;
    text?: string;
  };
  flaw?: string;
}

export interface Adventurer {
  id: string;
  name: string;
  homeRegion?: string;
  stakes?: AdventurerStakes;
  raceId: string; // 'dwarf' | 'aasimar' | 'elf' | 'gnome' | 'human' | 'halfling' | 'tiefling'
  classId: string; // 'arcanist' | 'cleric' | 'warden' | 'ranger' | 'blademaster' | 'guardian' | 'bard'
  role: string; // 'dps' | 'tank' | 'healer'
  age: number;
  career?: [number, number];
  experience: number;
  level: number;
  attributes: AdventurerAttributes;
  hidden: AdventurerHiddenAttributes;
  currentAbility: number; // CA (1-200)
  potentialAbility: number; // PA (1-200)
  peakFraction?: number;
  abilityStars?: number;
  potentialStars?: number;
  traitIds: string[];
  morale: number; // 0-100
  condition: number; // 0-100
  stress: number;
  fatigue: number;
  injury?: any | null;
  oathLeft?: number;
  oathWage?: number;
  oathCa?: number;
  oathTier?: number;
  equipment?: AdventurerEquipment;
  post?: string;
  notes?: string;
  firstJoin?: {
    day?: number;
    rating?: number;
    a?: number[];
  };
  joinMark?: any;
  deeds?: Record<string, number>;
  deedTotals?: Record<string, number>;
  form?: any[];
  rescues?: number;
  delves?: number;
  wipeScarred?: boolean;
  away?: boolean;
}

export interface GuildStaff {
  id: string;
  name: string;
  role: string; // 'envoy' | 'quartermaster' | 'trainer' | 'scryer' | 'physician'
  skill: number;
  rarity: string;
  wage: number;
  oathLeft?: number;
  arrivesOn?: number;
}

export interface RecruitCandidate {
  adventurer: Adventurer;
  departsDay: number;
}

export interface GuildData {
  name: string;
  rulesEra?: number;
  crestSeed?: string;
  crest?: GuildCrest;
  realmSeed?: string;
  patron?: PatronData;
  patronConfidence?: number;
  ideals?: string[];
  guildmasterId?: string;
  ironman?: boolean;
  powerFantasy?: boolean;
  dungeonborn?: boolean;
  townRule?: string;
  townsMet?: boolean;
  day: number;
  gold: number;
  renown: number;
  roster: Adventurer[];
  fallen?: Adventurer[];
  recruits?: RecruitCandidate[];
  stash?: EquipmentItem[];
  staff?: GuildStaff[];
  staffCandidates?: GuildStaff[];
  discoveredSynergies?: string[];
  bonds?: Record<string, { value: number }>;
  assignments?: Record<string, string>;
  [key: string]: any;
}

