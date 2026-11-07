import { EquipmentItem } from '../types/savegame';

/**
 * Dungeons & Dynasties Equipment Reference Engine
 * Datamined from official game v3.0.0 (https://dungeonsanddynasties.com/equipment)
 */

export type ItemRarity = 'common' | 'rare' | 'mythic' | 'legendary';

export interface RarityConfig {
  id: ItemRarity;
  label: string;
  weight: number;
  dropRate: string;
  pct: number;
  flat: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const RARITY_CONFIGS: Record<ItemRarity, RarityConfig> = {
  common: {
    id: 'common',
    label: 'Common',
    weight: 800,
    dropRate: '80.0%',
    pct: 0.09,
    flat: 0.05,
    color: '#9ca3af',
    bgColor: 'rgba(75, 85, 99, 0.2)',
    borderColor: '#4b5563',
  },
  rare: {
    id: 'rare',
    label: 'Rare',
    weight: 160,
    dropRate: '16.0%',
    pct: 0.15,
    flat: 0.09,
    color: '#60a5fa',
    bgColor: 'rgba(37, 99, 235, 0.2)',
    borderColor: '#2563eb',
  },
  mythic: {
    id: 'mythic',
    label: 'Mythic',
    weight: 35,
    dropRate: '3.5%',
    pct: 0.22,
    flat: 0.13,
    color: '#c084fc',
    bgColor: 'rgba(147, 51, 234, 0.2)',
    borderColor: '#9333ea',
  },
  legendary: {
    id: 'legendary',
    label: 'Legendary',
    weight: 5,
    dropRate: '0.5%',
    pct: 0.30,
    flat: 0.17,
    color: '#fbbf24',
    bgColor: 'rgba(217, 119, 6, 0.2)',
    borderColor: '#d97706',
  },
};

export type QualityBandId =
  | 'cursed'
  | 'flawed'
  | 'worn'
  | 'potent'
  | 'vaunted'
  | 'exalted'
  | 'sovereign';

export interface QualityBandConfig {
  id: QualityBandId;
  label: string;
  rollRange: string;
  odds: string;
  overallDrop: string;
  multiplier: number;
  color: string;
  description: string;
}

export const QUALITY_BANDS: Record<QualityBandId, QualityBandConfig> = {
  cursed: {
    id: 'cursed',
    label: 'Cursed',
    rollRange: '1',
    odds: '1%',
    overallDrop: '1 in 20,000',
    multiplier: -1.0,
    color: '#ef4444',
    description: 'Inverts all modifiers into negative penalties. Actively harms the bearer.',
  },
  flawed: {
    id: 'flawed',
    label: 'Flawed',
    rollRange: '2–20',
    odds: '19%',
    overallDrop: '1 in 1,053',
    multiplier: 0.55,
    color: '#f97316',
    description: 'Significantly degraded output with weakened scaling.',
  },
  worn: {
    id: 'worn',
    label: 'Worn',
    rollRange: '21–40',
    odds: '20%',
    overallDrop: '1 in 1,000',
    multiplier: 0.75,
    color: '#eab308',
    description: 'Standard battle-tested condition with minor performance loss.',
  },
  potent: {
    id: 'potent',
    label: 'Potent',
    rollRange: '41–60',
    odds: '20%',
    overallDrop: '1 in 1,000',
    multiplier: 1.0,
    color: '#10b981',
    description: 'Standard true legendary baseline modifier with 100% full scaling.',
  },
  vaunted: {
    id: 'vaunted',
    label: 'Vaunted',
    rollRange: '61–80',
    odds: '20%',
    overallDrop: '1 in 1,000',
    multiplier: 1.25,
    color: '#06b6d4',
    description: 'Elevated quality providing 125% magnified bonuses.',
  },
  exalted: {
    id: 'exalted',
    label: 'Exalted',
    rollRange: '81–99',
    odds: '19%',
    overallDrop: '1 in 1,053',
    multiplier: 1.45,
    color: '#a855f7',
    description: 'Exceptional master craftsmanship with 145% empowered attributes.',
  },
  sovereign: {
    id: 'sovereign',
    label: 'Sovereign',
    rollRange: '100',
    odds: '1%',
    overallDrop: '1 in 20,000',
    multiplier: 1.8,
    color: '#dfb15b',
    description: 'The crowning masterpiece roll. 180% maximum stat amplification.',
  },
};

export function getQualityBandFromMultiplier(mult: number = 1.0): QualityBandConfig {
  if (mult < 0) return QUALITY_BANDS.cursed;
  if (mult <= 0.65) return QUALITY_BANDS.flawed;
  if (mult <= 0.85) return QUALITY_BANDS.worn;
  if (mult <= 1.15) return QUALITY_BANDS.potent;
  if (mult <= 1.35) return QUALITY_BANDS.vaunted;
  if (mult <= 1.6) return QUALITY_BANDS.exalted;
  return QUALITY_BANDS.sovereign;
}

export interface EquipmentTemplate {
  id: string;
  slot: 'weapon' | 'armour' | 'trinket';
  names: string[];
  weaponKind?: 'melee' | 'ranged' | 'spell';
  minRarity?: ItemRarity;
  counters?: string;
  grantsTrait?: string;
  favours?: string[];
  baseMods: Record<string, { kind: 'pct' | 'flat'; ratio: number }>;
  category: 'weapon' | 'armour' | 'trinket' | 'relic' | 'counter' | 'minor';
}

export const EQUIPMENT_TEMPLATES: EquipmentTemplate[] = [
  // ==================== WEAPONS ====================
  {
    id: 'keen_blade',
    slot: 'weapon',
    weaponKind: 'melee',
    category: 'weapon',
    names: ['Keen Blade', 'Honed Edge', 'Fine Sabre', "Duelist's Rapier", 'Ashgate Sabre', 'Deepforge Edge'],
    baseMods: {
      attackPct: { kind: 'pct', ratio: 1.0 }, // 9% -> 30%
      critChance: { kind: 'flat', ratio: 0.5 }, // 2.5% -> 8.5%
    },
  },
  {
    id: 'heavy_maul',
    slot: 'weapon',
    weaponKind: 'melee',
    category: 'weapon',
    names: ['Heavy Maul', 'Brutal Cleaver', 'Warhammer', 'Greataxe', 'Great-Bone Maul', 'Slagiron Hammer'],
    baseMods: {
      attackPct: { kind: 'pct', ratio: 1.3 }, // 11.7% -> 39%
    },
  },
  {
    id: 'balanced_spear',
    slot: 'weapon',
    weaponKind: 'melee',
    category: 'weapon',
    names: ['Balanced Spear', 'Bardiche', 'Warpike', "Footman's Halberd", 'Border Pike', 'Tally-Notched Spear'],
    baseMods: {
      attackPct: { kind: 'pct', ratio: 0.8 }, // 7.2% -> 24%
      accuracy: { kind: 'flat', ratio: 41.18 }, // flat accuracy: 2 -> 7
    },
  },
  {
    id: 'warded_longsword',
    slot: 'weapon',
    weaponKind: 'melee',
    category: 'weapon',
    names: ['Warded Longsword', 'Bulwark Axe', "Sentinel's Mace", 'East-Wall Axe', 'Mootstone Mace'],
    baseMods: {
      attackPct: { kind: 'pct', ratio: 0.7 }, // 6.3% -> 21%
      blockChance: { kind: 'pct', ratio: 0.68 }, // 6% -> 20.4%
      mitigation: { kind: 'pct', ratio: 0.17 }, // 1.5% -> 5.1%
    },
  },
  {
    id: 'recurve_bow',
    slot: 'weapon',
    weaponKind: 'ranged',
    category: 'weapon',
    names: ['Recurve Bow', 'Truesight Bow', 'Yew Warbow', "Hunter's Longbow", 'Peak Eagle Bow', 'Stag-Horn Recurve'],
    favours: ['ranger'],
    baseMods: {
      attackPct: { kind: 'pct', ratio: 1.0 }, // 9% -> 30%
      critChance: { kind: 'flat', ratio: 0.5 }, // 2.5% -> 8.5%
    },
  },
  {
    id: 'heavy_arbalest',
    slot: 'weapon',
    weaponKind: 'ranged',
    category: 'weapon',
    names: ['Heavy Arbalest', 'Siege Crossbow', 'Ironwood Warbow', 'Goat-Horn Crossbow', 'Ironroot Warbow'],
    favours: ['ranger'],
    baseMods: {
      attackPct: { kind: 'pct', ratio: 1.3 }, // 11.7% -> 39%
    },
  },
  {
    id: 'marksmans_sling',
    slot: 'weapon',
    weaponKind: 'ranged',
    category: 'weapon',
    names: ["Marksman's Sling", 'Balanced Javelins', 'Hunting Crossbow', "Ranger's Shortbow", 'Trench-Hare Sling', 'Crow-Fletched Crossbow'],
    favours: ['ranger'],
    baseMods: {
      attackPct: { kind: 'pct', ratio: 0.8 }, // 7.2% -> 24%
      accuracy: { kind: 'flat', ratio: 41.18 }, // 2 -> 7
    },
  },
  {
    id: 'travellers_harp',
    slot: 'weapon',
    weaponKind: 'ranged',
    category: 'weapon',
    names: ["Traveller's Harp", 'Silver Chanter', 'Bone Flute', 'Lute of the Long Road', 'Drowned-Rush Pipes', 'Crown Orchard Lute'],
    favours: ['bard'],
    baseMods: {
      attackPct: { kind: 'pct', ratio: 0.9 }, // 8.1% -> 27%
      healPct: { kind: 'pct', ratio: 0.5 }, // 4.5% -> 15%
    },
  },
  {
    id: 'stormcallers_rod',
    slot: 'weapon',
    weaponKind: 'spell',
    category: 'weapon',
    names: ["Stormcaller's Rod", 'Blackglass Focus', 'Ashen Sceptre', 'Witchfire Brand', 'Emberbloom Focus', 'Scorch-Lichen Brand'],
    favours: ['arcanist'],
    baseMods: {
      attackPct: { kind: 'pct', ratio: 1.0 }, // 9% -> 30%
      critChance: { kind: 'flat', ratio: 0.5 }, // 2.5% -> 8.5%
    },
  },
  {
    id: 'elder_greatstaff',
    slot: 'weapon',
    weaponKind: 'spell',
    category: 'weapon',
    names: ['Elder Greatstaff', "Doomspeaker's Rod", 'Basalt Sceptre', 'Bonewhite Staff', 'Warsroot Sceptre'],
    favours: ['arcanist'],
    baseMods: {
      attackPct: { kind: 'pct', ratio: 1.3 }, // 11.7% -> 39%
    },
  },
  {
    id: 'seekers_wand',
    slot: 'weapon',
    weaponKind: 'spell',
    category: 'weapon',
    names: ["Seeker's Wand", "Auger's Rod", 'Clearsight Focus', "Diviner's Staff", 'Deep-Lichen Focus', 'Rimeflower Wand'],
    favours: ['arcanist', 'cleric'],
    baseMods: {
      attackPct: { kind: 'pct', ratio: 0.8 }, // 7.2% -> 24%
      accuracy: { kind: 'flat', ratio: 41.18 }, // 2 -> 7
    },
  },
  {
    id: 'channeling_wand',
    slot: 'weapon',
    weaponKind: 'spell',
    category: 'weapon',
    names: ['Channeling Wand', 'Runed Staff', 'Focus Orb', "Mercy's Sceptre", 'Kingsfoil Staff', 'Wound-Knit Rod'],
    favours: ['cleric'],
    baseMods: {
      attackPct: { kind: 'pct', ratio: 0.9 }, // 8.1% -> 27%
      healPct: { kind: 'pct', ratio: 0.5 }, // 4.5% -> 15%
    },
  },

  // ==================== RELIC WEAPONS (MYTHIC+) ====================
  {
    id: 'relic_coldheart',
    slot: 'weapon',
    weaponKind: 'melee',
    category: 'relic',
    minRarity: 'mythic',
    names: ['Coldheart', 'The Selfish Blade'],
    grantsTrait: 'lone-wolf',
    baseMods: {
      attackPct: { kind: 'pct', ratio: 1.5 }, // 13.5% -> 45%
      critChance: { kind: 'flat', ratio: 1.0 }, // 5% -> 17%
    },
  },
  {
    id: 'relic_bloodthirster',
    slot: 'weapon',
    weaponKind: 'melee',
    category: 'relic',
    minRarity: 'mythic',
    names: ['Bloodthirster', 'The Red Edge'],
    grantsTrait: 'reckless',
    baseMods: {
      attackPct: { kind: 'pct', ratio: 1.6 }, // 14.4% -> 48%
    },
  },
  {
    id: 'relic_the_long_silence',
    slot: 'weapon',
    weaponKind: 'ranged',
    category: 'relic',
    minRarity: 'mythic',
    names: ['The Long Silence', 'Widowmaker'],
    grantsTrait: 'lone-wolf',
    favours: ['ranger'],
    baseMods: {
      attackPct: { kind: 'pct', ratio: 1.5 }, // 13.5% -> 45%
      critChance: { kind: 'flat', ratio: 1.0 }, // 5% -> 17%
    },
  },
  {
    id: 'relic_hungerstring',
    slot: 'weapon',
    weaponKind: 'ranged',
    category: 'relic',
    minRarity: 'mythic',
    names: ['Hungerstring', 'The Loosed Oath'],
    grantsTrait: 'reckless',
    favours: ['ranger'],
    baseMods: {
      attackPct: { kind: 'pct', ratio: 1.6 }, // 14.4% -> 48%
    },
  },
  {
    id: 'relic_the_cold_word',
    slot: 'weapon',
    weaponKind: 'spell',
    category: 'relic',
    minRarity: 'mythic',
    names: ['The Cold Word', "Solitude's Focus"],
    grantsTrait: 'lone-wolf',
    favours: ['arcanist'],
    baseMods: {
      attackPct: { kind: 'pct', ratio: 1.5 }, // 13.5% -> 45%
      critChance: { kind: 'flat', ratio: 1.0 }, // 5% -> 17%
    },
  },
  {
    id: 'relic_ruinsong',
    slot: 'weapon',
    weaponKind: 'spell',
    category: 'relic',
    minRarity: 'mythic',
    names: ['Ruinsong', 'The Burning Answer'],
    grantsTrait: 'reckless',
    favours: ['arcanist', 'bard'],
    baseMods: {
      attackPct: { kind: 'pct', ratio: 1.6 }, // 14.4% -> 48%
    },
  },

  // ==================== ARMOURS ====================
  {
    id: 'plated_hauberk',
    slot: 'armour',
    category: 'armour',
    names: ['Plated Hauberk', 'Reinforced Mail', 'Banded Cuirass', 'Scale Coat', 'Ashgate Hauberk'],
    baseMods: {
      mitigation: { kind: 'pct', ratio: 0.567 }, // 5% -> 17%
      hpPct: { kind: 'pct', ratio: 0.6 }, // 5.4% -> 18%
    },
  },
  {
    id: 'bulwark_harness',
    slot: 'armour',
    category: 'armour',
    names: ['Bulwark Harness', 'Tower Plate', 'Aegis Plate', 'Ironhold Plate'],
    baseMods: {
      mitigation: { kind: 'pct', ratio: 0.793 }, // 7% -> 23.8%
    },
  },
  {
    id: 'padded_jerkin',
    slot: 'armour',
    category: 'armour',
    names: ['Padded Jerkin', 'Travelworn Leathers', 'Riven Goat Hide', "Roadwarden's Jack"],
    baseMods: {
      hpPct: { kind: 'pct', ratio: 1.0 }, // 9% -> 30%
      mitigation: { kind: 'pct', ratio: 0.227 }, // 2% -> 6.8%
    },
  },
  {
    id: 'oaken_shield',
    slot: 'armour',
    category: 'armour',
    names: ['Oaken Shield', 'Kite Shield', 'Bastion Buckler', 'Ashgate Pavise'],
    baseMods: {
      blockChance: { kind: 'pct', ratio: 0.85 }, // 7.5% -> 25.5%
      mitigation: { kind: 'pct', ratio: 0.17 }, // 1.5% -> 5.1%
    },
  },
  {
    id: 'field_dressing_rig',
    slot: 'armour',
    category: 'armour',
    names: ['Field Dressing Rig', 'Bound Splintmail', 'Menders Harness', "Physician's Apron", 'Bandage-Flax Rig'],
    baseMods: {
      healTakenPct: { kind: 'pct', ratio: 1.6 }, // 14.4% -> 48%
      hpPct: { kind: 'pct', ratio: 0.3 }, // 2.7% -> 9%
    },
  },
  {
    id: 'skirmishers_jack',
    slot: 'armour',
    category: 'armour',
    names: ["Skirmisher's Jack", 'Cutpurse Leathers', 'Marches Brigandine'],
    baseMods: {
      mitigation: { kind: 'pct', ratio: 0.283 }, // 2.5% -> 8.5%
      critChance: { kind: 'pct', ratio: 0.34 }, // 3% -> 10.2%
    },
  },
  {
    id: 'warded_vestments',
    slot: 'armour',
    category: 'armour',
    names: ['Warded Vestments', "Pilgrim's Robe", 'Chapter Cassock', 'Hedgewise Shawl', 'Skyshrine Vestments'],
    baseMods: {
      healPct: { kind: 'pct', ratio: 0.8 }, // 7.2% -> 24%
      hpPct: { kind: 'pct', ratio: 0.4 }, // 3.6% -> 12%
    },
  },
  {
    id: 'duelists_doublet',
    slot: 'armour',
    category: 'armour',
    names: ["Duelist's Doublet", "Blade-Dancer's Coat", 'Gambeson of the Line'],
    baseMods: {
      mitigation: { kind: 'pct', ratio: 0.283 }, // 2.5% -> 8.5%
      attackPct: { kind: 'pct', ratio: 0.5 }, // 4.5% -> 15%
    },
  },
  {
    id: 'heraldic_surcoat',
    slot: 'armour',
    category: 'armour',
    names: ['Heraldic Surcoat', "Sentinel's Tabard", "Gatekeeper's Harness", 'Crucible Surcoat'],
    baseMods: {
      blockChance: { kind: 'pct', ratio: 0.51 }, // 4.5% -> 15.3%
      hpPct: { kind: 'pct', ratio: 0.5 }, // 4.5% -> 15%
    },
  },

  // ==================== CONDITION COUNTER ARMOURS ====================
  {
    id: 'stormwax_waders',
    slot: 'armour',
    category: 'counter',
    counters: 'flooded',
    names: ['Stormwax Waders', 'Sealskin Greaves', 'Barrow-Kelp Boots'],
    baseMods: {
      mitigation: { kind: 'pct', ratio: 0.34 }, // 3% -> 10.2%
    },
  },
  {
    id: 'furred_mantle',
    slot: 'armour',
    category: 'counter',
    counters: 'deepcold',
    names: ['Furred Mantle', 'Rimeguard Cloak', 'Eagle-Down Mantle'],
    baseMods: {
      hpPct: { kind: 'pct', ratio: 0.6 }, // 5.4% -> 18%
    },
  },
  {
    id: 'barkweave_tunic',
    slot: 'armour',
    category: 'counter',
    counters: 'frozen',
    names: ['Barkweave Tunic', 'Mossback Jerkin', 'Stag-Hide Coat'],
    baseMods: {
      hpPct: { kind: 'pct', ratio: 0.7 }, // 6.3% -> 21%
      healTakenPct: { kind: 'pct', ratio: 0.8 }, // 7.2% -> 24%
    },
  },

  // ==================== RELIC ARMOUR (MYTHIC+) ====================
  {
    id: 'relic_aegis_steadfast',
    slot: 'armour',
    category: 'relic',
    minRarity: 'mythic',
    grantsTrait: 'stalwart',
    names: ['Aegis of the Steadfast', 'Mantle of Resolve'],
    baseMods: {
      mitigation: { kind: 'pct', ratio: 0.68 }, // 6% -> 20.4%
      hpPct: { kind: 'pct', ratio: 0.5 }, // 4.5% -> 15%
    },
  },

  // ==================== TRINKETS ====================
  {
    id: 'vital_pendant',
    slot: 'trinket',
    category: 'trinket',
    names: ['Vital Pendant', 'Heartstone Amulet', 'Keepsake Locket', 'Oyster-Shell Pendant'],
    baseMods: {
      hpPct: { kind: 'pct', ratio: 1.0 }, // 9% -> 30%
    },
  },
  {
    id: 'lucky_charm',
    slot: 'trinket',
    category: 'trinket',
    names: ['Lucky Charm', "Gambler's Coin", 'Loaded Knucklebones', 'Snow-Hare Foot'],
    baseMods: {
      critChance: { kind: 'pct', ratio: 0.567 }, // 5% -> 17%
    },
  },
  {
    id: 'sigil_of_focus',
    slot: 'trinket',
    category: 'trinket',
    names: ['Sigil of Focus', "Mender's Talisman", 'Skyshrine Token'],
    baseMods: {
      healPct: { kind: 'pct', ratio: 1.0 }, // 9% -> 30%
      accuracy: { kind: 'flat', ratio: 17.65 }, // 1 -> 3
    },
  },
  {
    id: 'whetstone_fetish',
    slot: 'trinket',
    category: 'trinket',
    names: ['Whetstone Fetish', "Soldier's Token", 'Bloodied Knucklebone', 'Carrion-Crow Fetish'],
    baseMods: {
      attackPct: { kind: 'pct', ratio: 0.8 }, // 7.2% -> 24%
    },
  },
  {
    id: 'ashgate_warhorn',
    slot: 'trinket',
    category: 'trinket',
    names: ['Ashgate Warhorn', "Hunter's Horn", 'Peak Eagle Feather'],
    baseMods: {
      accuracy: { kind: 'flat', ratio: 17.65 }, // 1 -> 3
      attackPct: { kind: 'pct', ratio: 0.4 }, // 3.6% -> 12%
    },
  },
  {
    id: 'marrow_talisman',
    slot: 'trinket',
    category: 'trinket',
    names: ['Marrow Talisman', 'Tally Stone', 'Bonewhite Token'],
    baseMods: {
      mitigation: { kind: 'pct', ratio: 0.397 }, // 3.5% -> 11.9%
    },
  },
  {
    id: 'vigil_candle',
    slot: 'trinket',
    category: 'trinket',
    names: ['Vigil Candle', "Pilgrim's Taper", 'Mootstone Chip'],
    baseMods: {
      healTakenPct: { kind: 'pct', ratio: 1.2 }, // 10.8% -> 36%
    },
  },
  {
    id: 'guardians_seal',
    slot: 'trinket',
    category: 'trinket',
    names: ["Guardian's Seal", 'Bastion Knot', 'Oathward Ring', 'Drowned Barrow Seal'],
    baseMods: {
      blockChance: { kind: 'pct', ratio: 0.623 }, // 5.5% -> 18.7%
    },
  },
  {
    id: 'archers_loupe',
    slot: 'trinket',
    category: 'trinket',
    names: ["Archer's Loupe", 'Truesight Lens', "Glasswright's Eye", 'Eagle-Eye Lens'],
    baseMods: {
      critChance: { kind: 'pct', ratio: 0.34 }, // 3% -> 10.2%
      accuracy: { kind: 'flat', ratio: 17.65 }, // 1 -> 3
    },
  },

  // ==================== CONDITION COUNTER TRINKETS ====================
  {
    id: 'everburning_torch',
    slot: 'trinket',
    category: 'counter',
    counters: 'darkness',
    names: ['Everburning Torch', 'Sunstone Lantern', 'Marmot-Fat Lamp'],
    baseMods: {
      accuracy: { kind: 'flat', ratio: 29.41 }, // 2 -> 5
    },
  },
  {
    id: 'warding_charm',
    slot: 'trinket',
    category: 'counter',
    counters: 'cursed',
    names: ['Warding Charm', 'Spirit Ward', 'Kingsfoil Knot'],
    baseMods: {
      hpPct: { kind: 'pct', ratio: 0.4 }, // 3.6% -> 12%
    },
  },
  {
    id: 'kingsfoil_pouch',
    slot: 'trinket',
    category: 'counter',
    counters: 'infernal',
    names: ['Kingsfoil Pouch', 'Scorchwort Satchel', "Physician's Roll"],
    baseMods: {
      healPct: { kind: 'pct', ratio: 1.0 }, // 9% -> 30%
    },
  },

  // ==================== RELIC TRINKETS (MYTHIC+) ====================
  {
    id: 'relic_crown_of_hubris',
    slot: 'trinket',
    category: 'relic',
    minRarity: 'mythic',
    grantsTrait: 'arrogant',
    names: ['Crown of Hubris', 'Vainglory Circlet'],
    baseMods: {
      attackPct: { kind: 'pct', ratio: 1.0 }, // 9% -> 30%
      hpPct: { kind: 'pct', ratio: 1.0 }, // 9% -> 30%
    },
  },
  {
    id: 'relic_hungering_coffer',
    slot: 'trinket',
    category: 'relic',
    minRarity: 'mythic',
    grantsTrait: 'greedy',
    names: ['Hungering Coffer', "Miser's Chain"],
    baseMods: {
      critChance: { kind: 'pct', ratio: 0.793 }, // 7% -> 23.8%
    },
  },
  {
    id: 'relic_banner_of_valour',
    slot: 'trinket',
    category: 'relic',
    minRarity: 'mythic',
    grantsTrait: 'brave',
    names: ['Banner of Valour', 'Heart of the Lion'],
    baseMods: {
      hpPct: { kind: 'pct', ratio: 0.6 }, // 5.4% -> 18%
    },
  },
  {
    id: 'relic_sages_circlet',
    slot: 'trinket',
    category: 'relic',
    minRarity: 'mythic',
    grantsTrait: 'iron-willed',
    names: ["Sage's Circlet", "Oathkeeper's Seal"],
    baseMods: {
      healPct: { kind: 'pct', ratio: 0.8 }, // 7.2% -> 24%
    },
  },
];

// ==================== MINOR TRINKETS (24 FIXED ITEMS) ====================
export interface MinorTrinketDef {
  name: string;
  mods: Record<string, number>;
  value: number;
}

export const MINOR_TRINKETS: MinorTrinketDef[] = [
  { name: "Gambler's Coin", mods: { critChance: 0.04 }, value: 25 },
  { name: "Mourner's Locket", mods: { hpPct: 0.05 }, value: 25 },
  { name: 'Tarnished Compass', mods: { accuracy: 2 }, value: 25 },
  { name: 'Knucklebone Charm', mods: { critChance: 0.03, accuracy: 1 }, value: 28 },
  { name: "Pilgrim's Token", mods: { mitigation: 0.03 }, value: 25 },
  { name: 'Fang of the First Hunt', mods: { attackPct: 0.05 }, value: 25 },
  { name: "Saint's Knuckle", mods: { healPct: 0.06 }, value: 25 },
  { name: 'Cracked Hourglass', mods: { critChance: 0.03 }, value: 22 },
  { name: "Drunkard's Ring", mods: { hpPct: 0.03, critChance: 0.02 }, value: 28 },
  { name: 'Ravenfeather Quill', mods: { accuracy: 3 }, value: 26 },
  { name: 'Crown Orchard Seed', mods: { hpPct: 0.05 }, value: 25 },
  { name: 'Throne-Ground Honeycomb', mods: { healPct: 0.06 }, value: 25 },
  { name: 'Anvil-Moss Pouch', mods: { mitigation: 0.03 }, value: 25 },
  { name: 'Shaftcap Spore-Lamp', mods: { accuracy: 2 }, value: 24 },
  { name: 'Counsel Fern Frond', mods: { accuracy: 2 }, value: 24 },
  { name: 'Hollow-Oak Acorn', mods: { hpPct: 0.05 }, value: 25 },
  { name: "Soldier's Root Twist", mods: { accuracy: 3 }, value: 26 },
  { name: 'Ashgate Hound Collar', mods: { attackPct: 0.05 }, value: 25 },
  { name: 'Tally Notch', mods: { critChance: 0.03 }, value: 22 },
  { name: 'Rimeflower Pressing', mods: { mitigation: 0.03 }, value: 25 },
  { name: 'Barrow-Kelp Braid', mods: { hpPct: 0.05 }, value: 25 },
  { name: 'Drowned Town Bell', mods: { accuracy: 2 }, value: 24 },
  { name: 'Warsroot Knot', mods: { attackPct: 0.05 }, value: 25 },
  { name: 'Ember-Smoked Bone', mods: { critChance: 0.04 }, value: 25 },
];

/**
 * Calculates concrete stats given a template, rarity, quality multiplier, and tier.
 */
export function calculateEquipmentStats(
  template: EquipmentTemplate,
  rarity: ItemRarity,
  qualityMultiplier: number = 1.0,
  tier: number = 1
): Record<string, number> {
  const rConf = RARITY_CONFIGS[rarity] || RARITY_CONFIGS.common;
  const mods: Record<string, number> = {};

  // Quality multiplier applies only to legendaries in natural rolls, but editor can apply custom quality
  const effectiveQuality = rarity === 'legendary' ? qualityMultiplier : 1.0;

  for (const [key, rule] of Object.entries(template.baseMods)) {
    const baseValue = rule.kind === 'pct' ? rConf.pct : rConf.flat;
    let computed = baseValue * rule.ratio * effectiveQuality;

    // Scale slightly by tier (tier 1 to 5)
    if (tier > 1) {
      computed *= 1 + (tier - 1) * 0.08;
    }

    if (key === 'accuracy') {
      mods[key] = Math.round(computed);
    } else {
      // Round to 4 decimal places for clean floats
      mods[key] = Math.round(computed * 10000) / 10000;
    }
  }

  return mods;
}

/**
 * Calculates estimated gold resale/purchase value
 */
export function calculateItemValue(
  rarity: ItemRarity,
  tier: number = 1,
  qualityMultiplier: number = 1.0
): number {
  const basePrices: Record<ItemRarity, number> = {
    common: 40,
    rare: 150,
    mythic: 450,
    legendary: 1200,
  };
  const base = basePrices[rarity] || 40;
  const tierMult = 1 + (tier - 1) * 0.5;
  const qualityFactor = Math.max(0.2, qualityMultiplier);
  return Math.round(base * tierMult * qualityFactor);
}

/**
 * Forges an authentic EquipmentItem object based on parameters
 */
export function forgeItem(
  template: EquipmentTemplate,
  options: {
    name?: string;
    rarity?: ItemRarity;
    quality?: number;
    tier?: number;
  } = {}
): EquipmentItem {
  const rarity = options.rarity || template.minRarity || 'common';
  const quality = options.quality ?? (rarity === 'legendary' ? 1.8 : 1.0);
  const tier = options.tier ?? (rarity === 'legendary' ? 5 : 1);
  const name =
    options.name ||
    template.names[Math.floor(Math.random() * template.names.length)];

  const mods = calculateEquipmentStats(template, rarity, quality, tier);
  const value = calculateItemValue(rarity, tier, quality);

  const item: EquipmentItem = {
    id: `it_forge_${Date.now()}_${Math.floor(Math.random() * 99999)}`,
    name,
    slot: template.slot,
    rarity,
    mods,
    value,
    tier,
    quality,
  };

  if (template.weaponKind) item.weaponKind = template.weaponKind;
  if (template.counters) item.counters = template.counters;
  if (template.grantsTrait) item.grantsTrait = template.grantsTrait;
  if (template.favours) item.favours = [...template.favours];

  return item;
}

/**
 * Forges a minor fixed trinket
 */
export function forgeMinorTrinket(def: MinorTrinketDef): EquipmentItem {
  return {
    id: `it_minor_${Date.now()}_${Math.floor(Math.random() * 99999)}`,
    name: def.name,
    slot: 'trinket',
    rarity: 'common',
    mods: { ...def.mods },
    value: def.value,
    tier: 1,
    quality: 1.0,
  };
}

/**
 * Preset: Forges the complete 6-piece environmental counter set to prepare for any delve!
 */
export function forgeConditionCounterPack(): EquipmentItem[] {
  const flooded = EQUIPMENT_TEMPLATES.find((t) => t.counters === 'flooded')!;
  const deepcold = EQUIPMENT_TEMPLATES.find((t) => t.counters === 'deepcold')!;
  const frozen = EQUIPMENT_TEMPLATES.find((t) => t.counters === 'frozen')!;
  const darkness = EQUIPMENT_TEMPLATES.find((t) => t.counters === 'darkness')!;
  const cursed = EQUIPMENT_TEMPLATES.find((t) => t.counters === 'cursed')!;
  const infernal = EQUIPMENT_TEMPLATES.find((t) => t.counters === 'infernal')!;

  return [
    forgeItem(flooded, { rarity: 'rare', tier: 3, quality: 1.0 }),
    forgeItem(deepcold, { rarity: 'rare', tier: 3, quality: 1.0 }),
    forgeItem(frozen, { rarity: 'rare', tier: 3, quality: 1.0 }),
    forgeItem(darkness, { rarity: 'rare', tier: 3, quality: 1.0 }),
    forgeItem(cursed, { rarity: 'rare', tier: 3, quality: 1.0 }),
    forgeItem(infernal, { rarity: 'rare', tier: 3, quality: 1.0 }),
  ];
}

