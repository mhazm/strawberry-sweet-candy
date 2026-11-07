export interface StatMeta {
  key: string;
  name: string;
  nameId: string;
  abbr: string;
  category: 'combat' | 'mental' | 'physical' | 'role';
  desc: string;
  descId: string;
}

export const COMBAT_ATTRIBUTES: StatMeta[] = [
  // 1. Combat (8 Attributes)
  {
    key: 'weaponSkill',
    name: 'Weapon Skill',
    nameId: 'Keahlian Senjata',
    abbr: 'Wea',
    category: 'combat',
    desc: 'Melee accuracy, rolled directly against the target\'s Evasion.',
    descId: 'Akurasi serangan jarak dekat, diadu langsung melawan Evasion (kelincahan) musuh.',
  },
  {
    key: 'marksmanship',
    name: 'Marksmanship',
    nameId: 'Ketepatan Menembak',
    abbr: 'Mar',
    category: 'combat',
    desc: 'Primary damage source for ranged fighters (alongside Agility), with aim governed by Reflexes.',
    descId: 'Sumber damage utama penyerang jarak jauh (bersama Agility), dengan bidikan dipengaruhi Reflexes.',
  },
  {
    key: 'power',
    name: 'Might',
    nameId: 'Kekuatan Serang (Might)',
    abbr: 'Mgt',
    category: 'combat',
    desc: 'The main source of raw damage for melee fighters, paired with Strength.',
    descId: 'Sumber utama kekuatan serangan dasar petarung jarak dekat, berpasangan dengan Strength.',
  },
  {
    key: 'spellcraft',
    name: 'Spellcraft',
    nameId: 'Keahlian Sihir',
    abbr: 'Spl',
    category: 'combat',
    desc: 'Primary source of caster damage and mana depth, paired with Anticipation.',
    descId: 'Sumber utama damage sihir dan kedalaman mana caster, berpasangan dengan Anticipation.',
  },
  {
    key: 'armorUse',
    name: 'Armour Use',
    nameId: 'Penggunaan Zirah',
    abbr: 'Arm',
    category: 'combat',
    desc: 'The largest component of Mitigation (share of incoming blows glanced off), adding +2% mitigation per point.',
    descId: 'Komponen terbesar mitigasi kerusakan (+2% mitigasi damage per poin yang diserap zirah).',
  },
  {
    key: 'parry',
    name: 'Parry & Block',
    nameId: 'Tangkisan & Blok',
    abbr: 'Par',
    category: 'combat',
    desc: 'Each point adds +2.5% to chance to block melee hits (up to 50% cap).',
    descId: 'Setiap poin menambah +2.5% peluang menangkis atau memblokir serangan fisik (maksimal 50%).',
  },
  {
    key: 'evasion',
    name: 'Evasion',
    nameId: 'Kelincahan Menghindar',
    abbr: 'Eva',
    category: 'combat',
    desc: 'Chance to completely dodge incoming physical and ranged attacks.',
    descId: 'Peluang untuk sepenuhnya meloloskan diri dan menghindar dari serangan fisik dan proyektil.',
  },
  {
    key: 'criticalStrike',
    name: 'Critical Strike',
    nameId: 'Serangan Kritis',
    abbr: 'Cri',
    category: 'combat',
    desc: 'Directly determines critical hit chance and lethal strike multipliers.',
    descId: 'Menentukan peluang pukulan mematikan dan pengali damage serangan kritis.',
  },

  // 2. Mental (10 Attributes)
  {
    key: 'composure',
    name: 'Composure',
    nameId: 'Ketenangan',
    abbr: 'Cmp',
    category: 'mental',
    desc: 'Caster accuracy (vs Evasion). Below half HP, scales damage up/down based on composure maintaining nerve.',
    descId: 'Akurasi mantra caster. Saat darah di bawah 50%, menjaga damage agar tidak goyah atau anjlok.',
  },
  {
    key: 'bravery',
    name: 'Bravery',
    nameId: 'Keberanian',
    abbr: 'Brv',
    category: 'mental',
    desc: 'Courage so heroes hold the line. In the frontline, reduces damage taken by 2.5% per point above 10.',
    descId: 'Keberanian menahan garis depan. Memotong 2.5% damage yang diterima per poin di atas 10.',
  },
  {
    key: 'decisions',
    name: 'Decisions',
    nameId: 'Pengambilan Keputusan',
    abbr: 'Dec',
    category: 'mental',
    desc: 'Each point above 10 makes attacks 2% quicker and brings signature moves around 1.5% sooner.',
    descId: 'Setiap poin di atas 10 membuat serangan 2% lebih cepat & jurus andalan muncul 1.5% lebih awal.',
  },
  {
    key: 'anticipation',
    name: 'Anticipation',
    nameId: 'Antisipasi',
    abbr: 'Ant',
    category: 'mental',
    desc: 'Predicting enemy movements and patterns; contributes to caster magical damage output.',
    descId: 'Membaca arah gerakan musuh; berkontribusi langsung pada perhitungan output damage sihir.',
  },
  {
    key: 'teamwork',
    name: 'Teamwork',
    nameId: 'Kerjasama Tim',
    abbr: 'Tea',
    category: 'mental',
    desc: 'Party synergy: party average shifts overall damage by 1% per point above or below 10 (up to 15%).',
    descId: 'Sinergi regu: rata-rata tim mendongkrak total output damage hingga 15% jika di atas 10.',
  },
  {
    key: 'leadership',
    name: 'Leadership',
    nameId: 'Kepemimpinan',
    abbr: 'Ldr',
    category: 'mental',
    desc: 'When party leader: +1% damage, -0.5% damage taken, and +3% plan strength per point above 10. Also scales tank/healer efficiency.',
    descId: 'Pemimpin regu: +1% damage tim, -0.5% damage diterima, dan +3% kekuatan rencana tempur per poin di atas 10.',
  },
  {
    key: 'concentration',
    name: 'Concentration',
    nameId: 'Konsentrasi',
    abbr: 'Cnc',
    category: 'mental',
    desc: 'Focus when casting or executing complex spells, preventing interrupts when struck.',
    descId: 'Fokus tinggi saat merapal mantra, mencegah kegagalan mantra saat terhantam serangan musuh.',
  },
  {
    key: 'aggression',
    name: 'Aggression',
    nameId: 'Agresivitas',
    abbr: 'Agg',
    category: 'mental',
    desc: 'Ferocity and drive to press advantages and exploit staggered enemies for burst damage.',
    descId: 'Naluri agresif mendominasi pertempuran dan mengeksekusi musuh yang sedang limbung (staggered).',
  },
  {
    key: 'discipline',
    name: 'Discipline',
    nameId: 'Disiplin',
    abbr: 'Dis',
    category: 'mental',
    desc: 'Strengthens stances (+5% stance effects per point above 10) and ensures adherence to tactical orders.',
    descId: 'Memperkuat kuda-kuda (+5% efek stance per poin di atas 10) dan patuh pada instruksi taktis.',
  },
  {
    key: 'resolve',
    name: 'Resolve',
    nameId: 'Keteguhan Hati',
    abbr: 'Rsv',
    category: 'mental',
    desc: 'Mental tenacity to fight through extreme pain, injury penalties, and mortal terror.',
    descId: 'Ketangguhan batin untuk terus bertarung meski menderita luka parah, kelelahan, dan teror.',
  },

  // 3. Physical (6 Attributes)
  {
    key: 'strength',
    name: 'Strength',
    nameId: 'Kekuatan Fisik',
    abbr: 'Str',
    category: 'physical',
    desc: 'Adds directly to melee damage and adds 1.5 max HP per point. Tested by physical hazard rooms.',
    descId: 'Menambah damage serangan melee dan memberi +1.5 HP per poin. Diuji pada ruang bahaya labirin.',
  },
  {
    key: 'agility',
    name: 'Agility',
    nameId: 'Kelincahan Gerak',
    abbr: 'Agi',
    category: 'physical',
    desc: 'Adds to ranged damage, makes delvers harder to hit (Evasion), and raises Mobility rating.',
    descId: 'Menambah damage panah, meningkatkan Evasion (sulit diserang), dan menaikkan mobilitas regu.',
  },
  {
    key: 'stamina',
    name: 'Stamina',
    nameId: 'Stamina',
    abbr: 'Sta',
    category: 'physical',
    desc: 'Endurance and longevity, determining how long a delver can fight before fatigue accumulates.',
    descId: 'Daya tahan napas dan fisik, menentukan seberapa lama delver bertarung sebelum kelelahan.',
  },
  {
    key: 'vitality',
    name: 'Vitality',
    nameId: 'Ketahanan Tubuh',
    abbr: 'Vit',
    category: 'physical',
    desc: 'Primary health pool scaling, providing 6 HP per point (core foundation of survivability).',
    descId: 'Fondasi utama ketahanan hidup (+6 HP per poin, penentu utama jumlah maksimal darah).',
  },
  {
    key: 'speed',
    name: 'Speed',
    nameId: 'Kecepatan Gerak',
    abbr: 'Spd',
    category: 'physical',
    desc: 'Movement tempo, combat reaction cadence, and turn initiative in dungeon rooms.',
    descId: 'Tempo pergerakan di ruang bawah tanah, kecepatan reaksi aksi, dan inisiatif giliran bertarung.',
  },
  {
    key: 'reflexes',
    name: 'Reflexes',
    nameId: 'Refleks Spontan',
    abbr: 'Rfx',
    category: 'physical',
    desc: 'Split-second dodging, ranged accuracy calculations, and disarming trap hazards.',
    descId: 'Gerak refleks spontan, kalkulasi bidikan panah, dan kemampuan melucuti perangkap dungeon.',
  },

  // 4. Role (6 Attributes)
  {
    key: 'threat',
    name: 'Threat',
    nameId: 'Ancaman / Taunt',
    abbr: 'Thr',
    category: 'role',
    desc: 'Multiplies threat built against monsters by 6% per point, causing taunt aggro to spill onto surrounding packs.',
    descId: 'Menaikkan ancaman taunt (+6% per poin) agar monster terfokus menyerang tank garis depan.',
  },
  {
    key: 'mitigation',
    name: 'Mitigation',
    nameId: 'Mitigasi Kerusakan',
    abbr: 'Mit',
    category: 'role',
    desc: 'Adds directly to the percentage of every blow shrugged off (1.5% per point), working with Armour Use.',
    descId: 'Menangkis persentase damage secara langsung (+1.5% per poin) bekerja sama dengan pelindung zirah.',
  },
  {
    key: 'healing',
    name: 'Healing',
    nameId: 'Penyembuhan',
    abbr: 'Heal',
    category: 'role',
    desc: 'The primary scaling attribute for restorative magic, salves, and curative spell output.',
    descId: 'Kapasitas pemulihan darah untuk mantra penyembuh, ramuan herbal, dan restorasi kesehatan.',
  },
  {
    key: 'support',
    name: 'Support',
    nameId: 'Dukungan / Buff',
    abbr: 'Sup',
    category: 'role',
    desc: 'Lifts bard songs / buffs by up to 15%, and enables any delver to strike harder into openings created by allies.',
    descId: 'Meningkatkan buff nyanyian hingga 15% & melipatgandakan serangan saat kawan membuka celah musuh.',
  },
  {
    key: 'crowdControl',
    name: 'Crowd Control',
    nameId: 'Pengendalian Massa',
    abbr: 'CC',
    category: 'role',
    desc: 'Dictates how many foes a single blow catches; adds 2.5% chance per point to stagger enemies before attacks land.',
    descId: 'Jangkauan target serangan sapuan & memberi peluang 2.5%/poin membuat musuh limbung seketika.',
  },
  {
    key: 'positioning',
    name: 'Positioning',
    nameId: 'Penempatan Posisi',
    abbr: 'Pos',
    category: 'role',
    desc: 'Reduces area blast/cleave damage by up to 15%; reduces damage taken from backline-diving foes by 3% per point.',
    descId: 'Mengurangi damage ledakan area hingga 15% & memotong serangan musuh yang menyusup ke barisan belakang.',
  },
];

export function getStatLabel(attr: StatMeta, lang: 'en' | 'id' = 'en'): string {
  return lang === 'id' ? attr.nameId : attr.name;
}

export function getStatDesc(attr: StatMeta, lang: 'en' | 'id' = 'en'): string {
  return lang === 'id' ? attr.descId : attr.desc;
}

export const HIDDEN_ATTRIBUTES = [
  {
    key: 'consistency',
    name: 'Consistency',
    nameId: 'Konsistensi',
    desc: 'How reliably the delver plays at peak potential',
    descId: 'Seberapa stabil delver bertanding di level kemampuan puncaknya tanpa fluktuasi',
  },
  {
    key: 'bigGame',
    name: 'Big Match / Boss Fights',
    nameId: 'Laga Krusial & Pertempuran Boss',
    desc: 'Performance during critical cup or boss battles',
    descId: 'Performa mental saat menghadapi laga penentuan, turnamen, dan pertarungan boss berbahaya',
  },
  {
    key: 'pressure',
    name: 'Pressure Handling',
    nameId: 'Ketahanan Tekanan',
    desc: 'Resilience against high-stakes tension',
    descId: 'Kemampuan menjaga fokus dalam situasi terjepit dan tekanan tinggi',
  },
  {
    key: 'deathProneness',
    name: 'Death Resistance',
    nameId: 'Ketahanan Maut',
    desc: 'Resistance against permanent death on down',
    descId: 'Daya juang melawan kematian permanen saat pingsan/tumbang di ruang dungeon',
  },
  {
    key: 'loyalty',
    name: 'Guild Loyalty',
    nameId: 'Loyalitas Guild',
    desc: 'Willingness to renew oath and resist poach offers',
    descId: 'Kesetiaan pada panji guild dan ketahanan menolak godaan tawaran dari guild saingan',
  },
  {
    key: 'adaptability',
    name: 'Adaptability',
    nameId: 'Adaptabilitas',
    desc: 'Quickness in settling into new roles and teams',
    descId: 'Kecepatan beradaptasi dengan formasi regu baru, peran taktik, dan rekan bertualang',
  },
  {
    key: 'dirtiness',
    name: 'Ruthlessness',
    nameId: 'Kekejaman Taktis',
    desc: 'Use of underhanded tactics in the dungeon',
    descId: 'Kecenderungan memakai taktik licik dan tanpa ampun demi bertahan hidup di dungeon',
  },
];

export const RACES = [
  'human',
  'dwarf',
  'elf',
  'aasimar',
  'tiefling',
  'gnome',
  'halfling',
  'dragonborn',
  'orc',
];

export interface RaceInfo {
  id: string;
  name: string;
  growth: string;
  careerWindow: string;
  peakAge: number;
  strengths: string[];
  weaknesses: string[];
  summary: string;
  favoredClasses: string[];
}

export const RACE_CATALOG: Record<string, RaceInfo> = {
  human: {
    id: 'human',
    name: 'Human',
    growth: '×1.08',
    careerWindow: '16–40 (Peak ~23)',
    peakAge: 23,
    strengths: ['High Growth Modifier (+8%)', 'Adaptable', 'Decisions'],
    weaknesses: ['Moderate baseline stats', 'Standard lifespan'],
    summary: 'Features the highest general growth modifier in the game (×1.08). Highly versatile across all class roles with early maturity.',
    favoredClasses: ['Blademaster', 'Guardian', 'Ranger', 'Arcanist', 'Cleric', 'Bard'],
  },
  dwarf: {
    id: 'dwarf',
    name: 'Dwarf',
    growth: '×0.95',
    careerWindow: '25–63 (Peak ~41)',
    peakAge: 41,
    strengths: ['Vitality', 'Armor Use', 'Parry', 'Resolve', 'Mitigation'],
    weaknesses: ['Speed', 'Agility'],
    summary: 'Naturally tough frontliners with substantial bonuses to health, armour usage, and parry. Long peak career window.',
    favoredClasses: ['Guardian', 'Warden', 'Cleric'],
  },
  elf: {
    id: 'elf',
    name: 'Elf',
    growth: '×0.95',
    careerWindow: '30–80 (Peak ~56)',
    peakAge: 56,
    strengths: ['Agility', 'Spellcraft', 'Reflexes', 'Marksmanship', 'Concentration'],
    weaknesses: ['Strength', 'Vitality'],
    summary: 'Exquisite agility and arcane potency with longest career lifespan in the realm. Fragile physically, requiring front-line protection.',
    favoredClasses: ['Arcanist', 'Ranger'],
  },
  halfling: {
    id: 'halfling',
    name: 'Halfling',
    growth: '×1.00',
    careerWindow: '20–56 (Peak ~33)',
    peakAge: 33,
    strengths: ['Agility', 'Reflexes', 'Evasion', 'Anticipation', 'Teamwork'],
    weaknesses: ['Power', 'Strength'],
    summary: 'Nimble and naturally evasive. Excellent for precision ranged combat, skirmishing, and synergistic party support.',
    favoredClasses: ['Ranger', 'Bard'],
  },
  gnome: {
    id: 'gnome',
    name: 'Gnome',
    growth: '×0.95',
    careerWindow: '22–64 (Peak ~43)',
    peakAge: 43,
    strengths: ['Spellcraft', 'Decisions', 'Concentration', 'Anticipation'],
    weaknesses: ['Strength (-3)', 'Power'],
    summary: 'Features a heavy penalty to raw muscle, but heavily compensated by premier tactical decision-making, focus, and spell execution.',
    favoredClasses: ['Arcanist', 'Cleric', 'Bard'],
  },
  tiefling: {
    id: 'tiefling',
    name: 'Tiefling',
    growth: '×1.00',
    careerWindow: '18–42 (Peak ~26)',
    peakAge: 26,
    strengths: ['Spellcraft', 'Critical Strike', 'Aggression', 'Concentration'],
    weaknesses: ['Teamwork'],
    summary: 'Infused with abyssal heritage, leaning heavily into offensive spell potency, ferocity, and lethal critical strikes.',
    favoredClasses: ['Arcanist', 'Blademaster'],
  },
  dragonborn: {
    id: 'dragonborn',
    name: 'Dragonborn',
    growth: '×1.00',
    careerWindow: '16–46 (Peak ~28)',
    peakAge: 28,
    strengths: ['Strength', 'Threat', 'Power', 'Bravery'],
    weaknesses: ['Evasion'],
    summary: 'Imposing draconic presence with natural aggro generation, immense muscle force, and raw brute impact in dungeon brawls.',
    favoredClasses: ['Guardian', 'Warden', 'Blademaster'],
  },
  aasimar: {
    id: 'aasimar',
    name: 'Aasimar',
    growth: '×1.00',
    careerWindow: '20–58 (Peak ~34)',
    peakAge: 34,
    strengths: ['Leadership', 'Composure', 'Healing', 'Bravery', 'Support'],
    weaknesses: ['Threat'],
    summary: 'Blessed with celestial grace. Inspires allies, excels at recovery spells, and maintains steadfast composure under deep dungeon terror.',
    favoredClasses: ['Cleric', 'Bard', 'Guardian'],
  },
  orc: {
    id: 'orc',
    name: 'Orc / Half-Orc',
    growth: '×1.05',
    careerWindow: '14–36 (Peak ~22)',
    peakAge: 22,
    strengths: ['Strength', 'Power', 'Aggression', 'Stamina'],
    weaknesses: ['Decisions', 'Concentration'],
    summary: 'Fearsome early peak, ferocious muscle force, and relentless stamina. Dominates the front lines as devastating brawlers.',
    favoredClasses: ['Warden', 'Blademaster'],
  },
};

export const CLASS_PILLARS: Record<string, string[]> = {
  guardian: ['threat', 'armorUse', 'parry', 'mitigation', 'vitality', 'bravery'],
  warden: ['vitality', 'mitigation', 'armorUse', 'threat', 'strength', 'aggression', 'crowdControl'],
  blademaster: ['weaponSkill', 'power', 'criticalStrike', 'agility', 'speed', 'positioning', 'strength'],
  arcanist: ['spellcraft', 'criticalStrike', 'concentration', 'decisions', 'anticipation', 'crowdControl'],
  ranger: ['marksmanship', 'anticipation', 'agility', 'positioning', 'reflexes', 'criticalStrike'],
  cleric: ['healing', 'composure', 'decisions', 'concentration', 'anticipation', 'spellcraft'],
  bard: ['support', 'teamwork', 'healing', 'leadership', 'anticipation', 'decisions'],
};

export function isClassPillar(classId: string, attrKey: string): boolean {
  const c = classId.toLowerCase();
  const pillars = CLASS_PILLARS[c];
  if (!pillars) return false;
  return pillars.includes(attrKey);
}

export const CLASSES = [
  'blademaster',
  'arcanist',
  'cleric',
  'warden',
  'guardian',
  'ranger',
  'bard',
  'rogue',
];

export const ROLES = ['tank', 'dps', 'healer', 'support'];

export interface TraitInfo {
  id: string;
  name: string;
  type: 'positive' | 'negative' | 'neutral';
  desc: string;
  tag?: string;
  behaviorEffect?: Record<string, number> | null;
  nonCombat?: {
    tag?: string;
    summary?: string;
    systems?: string[];
    detail?: string[];
  } | null;
}

export const TRAIT_CATALOG: TraitInfo[] = [
  {
    "id": "broad-hand",
    "name": "A Broad Hand",
    "type": "positive",
    "desc": "Reduces the cross-role teaching penalty when mentoring delvers.",
    "tag": "Training",
    "behaviorEffect": null,
    "nonCombat": {
      "tag": "Training",
      "summary": "Reduces the cross-role teaching penalty.",
      "systems": [
        "Training"
      ],
      "detail": [
        "Non-matching-class fit moves halfway toward 1.",
        "Cross-role fit becomes 0.775 instead of 0.55."
      ]
    }
  },
  {
    "id": "quiet-example",
    "name": "Quiet Example",
    "type": "positive",
    "desc": "Leads by deeds rather than words",
    "tag": "Training",
    "behaviorEffect": null,
    "nonCombat": {
      "tag": "Training",
      "summary": "Adds an automatic mentoring place.",
      "systems": [
        "Training"
      ],
      "detail": [
        "An available Seasoned, Veteran or Twilight carrier supplies one extra teaching place.",
        "This does not add a physical Training Yard bench."
      ]
    }
  },
  {
    "id": "ambitious",
    "name": "Ambitious",
    "type": "positive",
    "desc": "Aggressively pursues enemy eliminations (+15% Kill Hunger).",
    "tag": "Combat AI",
    "behaviorEffect": {
      "killHunger": 0.15
    },
    "nonCombat": null
  },
  {
    "id": "arrogant",
    "name": "Arrogant",
    "type": "positive",
    "desc": "Underestimates opponents and ignores warnings",
    "tag": "Combat AI",
    "behaviorEffect": {
      "courage": 0.3,
      "recklessness": 0.15,
      "protectiveness": -0.2
    },
    "nonCombat": null
  },
  {
    "id": "ash-hardened",
    "name": "Ash Hardened",
    "type": "positive",
    "desc": "Resistant to fire and scorched ground",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "bearer-of-the-fallen",
    "name": "Bearer of the Fallen",
    "type": "positive",
    "desc": "Carries tokens of deceased heroes into battle",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "big-game-player",
    "name": "Big Game Player",
    "type": "positive",
    "desc": "Levels up combat performance during boss encounters",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "blood-drunk",
    "name": "Blood Drunk",
    "type": "positive",
    "desc": "Enters a blood frenzy when slaying foes",
    "tag": "Combat AI",
    "behaviorEffect": {
      "courage": 0.2
    },
    "nonCombat": null
  },
  {
    "id": "bog-bred",
    "name": "Bog-Bred",
    "type": "positive",
    "desc": "Native familiarity with foul bogs, swamps, and flooded tunnels.",
    "tag": "Environment",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "mentor",
    "name": "Mentor",
    "type": "positive",
    "desc": "Helps younger delvers grow and level up quicker",
    "tag": "Combat AI",
    "behaviorEffect": {
      "lead": 0.03,
      "protectiveness": 0.25
    },
    "nonCombat": null
  },
  {
    "id": "brave",
    "name": "Brave",
    "type": "positive",
    "desc": "Exceptional valor against terrifying monsters",
    "tag": "Combat AI",
    "behaviorEffect": {
      "threatMult": 0.08,
      "courage": 0.12
    },
    "nonCombat": null
  },
  {
    "id": "brittle",
    "name": "Brittle",
    "type": "positive",
    "desc": "Bones break easily under brute attacks",
    "tag": "Combat AI",
    "behaviorEffect": {
      "courage": -0.26,
      "poise": 0.05,
      "steady": 0.06
    },
    "nonCombat": null
  },
  {
    "id": "cave-grown",
    "name": "Cave-Grown",
    "type": "positive",
    "desc": "Born in deep subterranean caverns; immune to underground disorientation.",
    "tag": "Environment",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "charismatic",
    "name": "Charismatic",
    "type": "positive",
    "desc": "Loved by the crowd and respected by peers",
    "tag": "Relationships",
    "behaviorEffect": null,
    "nonCombat": {
      "tag": "Relationships",
      "summary": "Speeds up how heroes bond — every surviving pair that includes a Charismatic hero gains extra relationship growth after a delve.",
      "systems": [
        "Relationships"
      ],
      "detail": [
        "Adds to a party's positive social pull: each Charismatic hero raises the affinity between any two heroes by +1 (capped at plus or minus 3).",
        "After a delve, a surviving pair's relationship shifts by 7 + affinity x3 — so one Charismatic in the pair is usually +3 on top.",
        "Can tip the 12% relationship-event roll toward a warm bond instead of a clash."
      ]
    }
  },
  {
    "id": "child-of-the-halls",
    "name": "Child of the Halls",
    "type": "positive",
    "desc": "Raised in fortified halls; high morale and defense in ruin dungeons.",
    "tag": "Social",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "claustrophobic",
    "name": "Claustrophobic",
    "type": "positive",
    "desc": "Suffers severe stress in tight corridors and tunnels",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "clumsy",
    "name": "Clumsy",
    "type": "negative",
    "desc": "Prone to tripping and making noise in stealth situations",
    "tag": "Traps",
    "behaviorEffect": null,
    "nonCombat": {
      "tag": "Traps",
      "summary": "A double-edged trap trait: often stumbles through danger unhurt, but tends to leave gear behind in the dark.",
      "systems": [
        "Traps",
        "Loot"
      ],
      "detail": [
        "After failing a trap check, a Clumsy hero has a 50% chance to blunder through anyway — the party skips the usual HP and stress hit.",
        "The catch: they drop their lowest-value non-Legendary item, lost to that dungeon's theme (Legendary gear is never dropped).",
        "Lost kit isn't gone for good — a later delve of the same theme has a 55% chance to recover it, up to 3 items at once.",
        "Never rolls onto a hero who is also Sure-Footed, Methodical or Professional."
      ]
    }
  },
  {
    "id": "coin-minded",
    "name": "Coin Minded",
    "type": "positive",
    "desc": "Motivated primarily by gold bonuses and wages",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "cold-tempered",
    "name": "Cold-Tempered",
    "type": "positive",
    "desc": "Natural resistance against Deep Cold and freezing conditions.",
    "tag": "Environment",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "companionable",
    "name": "Companionable",
    "type": "positive",
    "desc": "Fast friendships with fellow adventurers",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "consistent",
    "name": "Consistent",
    "type": "positive",
    "desc": "Consistently performs at peak ability week in and week out",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "cool-headed",
    "name": "Cool Headed",
    "type": "positive",
    "desc": "Composed under high stress conditions",
    "tag": "Combat AI",
    "behaviorEffect": {
      "courage": 0.1,
      "poise": -0.04,
      "steady": -0.05,
      "killHunger": -0.15
    },
    "nonCombat": null
  },
  {
    "id": "cowardly",
    "name": "Cowardly",
    "type": "positive",
    "desc": "Prone to fleeing in terror when HP gets low",
    "tag": "Combat AI",
    "behaviorEffect": {
      "threatMult": -0.22,
      "courage": -0.25
    },
    "nonCombat": null
  },
  {
    "id": "crowd-pleaser",
    "name": "Crowd Pleaser",
    "type": "positive",
    "desc": "Earns extra renown and spectator cheers",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "crucible-raised",
    "name": "Crucible Raised",
    "type": "positive",
    "desc": "Forged in tournament fires with fierce competitive drive",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "curious",
    "name": "Curious",
    "type": "positive",
    "desc": "Investigates strange arcane symbols and curios",
    "tag": "Combat AI",
    "behaviorEffect": {
      "recklessness": 0.06
    },
    "nonCombat": null
  },
  {
    "id": "dauntless",
    "name": "Dauntless",
    "type": "positive",
    "desc": "Unshakable when confronted with insurmountable odds",
    "tag": "Combat AI",
    "behaviorEffect": {
      "threatMult": 0.09,
      "courage": 0.18
    },
    "nonCombat": null
  },
  {
    "id": "death-defying",
    "name": "Death Defying",
    "type": "positive",
    "desc": "Incredible ability to survive mortal strikes",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "death-seeker",
    "name": "Death Seeker",
    "type": "positive",
    "desc": "Subconsciously seeks an honorable end in battle",
    "tag": "Combat AI",
    "behaviorEffect": {
      "recklessness": 0.15
    },
    "nonCombat": null
  },
  {
    "id": "deep-seasoned",
    "name": "Deep Seasoned",
    "type": "positive",
    "desc": "Decades of surviving deep delve horrors",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "deeps-taught",
    "name": "Deeps Taught",
    "type": "positive",
    "desc": "Instinctive mastery of the underdark tunnels",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "diligent",
    "name": "Diligent",
    "type": "positive",
    "desc": "Trains harder and gains extra XP per training session",
    "tag": "Jobs & loadout",
    "behaviorEffect": null,
    "nonCombat": {
      "tag": "Jobs & loadout",
      "summary": "The disciplined worker: banks found gear for the armoury instead of swapping it in mid-delve, and performs better on Expedition contracts.",
      "systems": [
        "Contracts",
        "Loadout"
      ],
      "detail": [
        "Under a 'Gear up now' standing order, Diligent heroes won't auto-equip upgrades found in the dungeon — they pack them back to the armoury instead.",
        "Liked by Expedition contracts: each matching hero adds +0.05 to the party's job suitability, nudging the outcome tier — and so the payout and renown — upward.",
        "Never rolls alongside Reckless or Insubordinate."
      ]
    }
  },
  {
    "id": "dutiful",
    "name": "Dutiful",
    "type": "positive",
    "desc": "Always obeys tactical instructions without hesitation",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "early-riser",
    "name": "Early Riser",
    "type": "positive",
    "desc": "First to awaken and prepare gear for the day",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "easygoing",
    "name": "Easygoing",
    "type": "positive",
    "desc": "Gets along easily with almost any party member",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "exacting",
    "name": "Exacting",
    "type": "neutral",
    "desc": "High mentor quality (x1.18), but adds stress to pupils during progress.",
    "tag": "Training",
    "behaviorEffect": null,
    "nonCombat": {
      "tag": "Training",
      "summary": "Stronger teaching adds stress when the pupil makes progress.",
      "systems": [
        "Training"
      ],
      "detail": [
        "Mentor quality ×1.18.",
        "Successful mentored CA progress adds stress at 4 times the elapsed training scale."
      ]
    }
  },
  {
    "id": "fair-weather",
    "name": "Fair Weather",
    "type": "positive",
    "desc": "Morale collapses when the guild faces tough times",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "field-medic",
    "name": "Field Medic",
    "type": "positive",
    "desc": "Provides emergency first aid to wounded comrades",
    "tag": "Combat AI",
    "behaviorEffect": {
      "protectiveness": 0.42
    },
    "nonCombat": null
  },
  {
    "id": "frail",
    "name": "Frail",
    "type": "positive",
    "desc": "Lower natural health and prone to sudden injuries",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "gambler",
    "name": "Gambler",
    "type": "positive",
    "desc": "Loves high-stakes bets in tavern halls",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "generous",
    "name": "Generous",
    "type": "positive",
    "desc": "Shares bonuses freely with fellow guild members",
    "tag": "Combat AI",
    "behaviorEffect": {
      "protectiveness": 0.1
    },
    "nonCombat": null
  },
  {
    "id": "giant-killer",
    "name": "Giant Killer",
    "type": "positive",
    "desc": "Bonus damage and precision against massive brutes",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "glass-jawed",
    "name": "Glass Jawed",
    "type": "positive",
    "desc": "Susceptible to knockouts and critical injuries",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "glory-hunter",
    "name": "Glory Hunter",
    "type": "positive",
    "desc": "Craves renown and public fame above all else",
    "tag": "Combat AI",
    "behaviorEffect": {
      "threatMult": 0.08,
      "recklessness": 0.2,
      "killHunger": 0.5
    },
    "nonCombat": null
  },
  {
    "id": "gold-nosed",
    "name": "Gold-Nosed",
    "type": "positive",
    "desc": "Sharp instinct for sniffing out hidden strongboxes and treasure caches.",
    "tag": "Dungeon",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "greedy",
    "name": "Greedy",
    "type": "positive",
    "desc": "Demands a larger share of the dungeon plunder",
    "tag": "Combat AI",
    "behaviorEffect": {
      "recklessness": 0.1,
      "killHunger": 0.25,
      "protectiveness": -0.15
    },
    "nonCombat": null
  },
  {
    "id": "hard-bargainer",
    "name": "Hard Bargainer",
    "type": "positive",
    "desc": "Fierce contract negotiator",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "hard-headed",
    "name": "Hard-Headed",
    "type": "positive",
    "desc": "Stubborn refusal to retreat or panic under heavy enemy pressure.",
    "tag": "Combat AI",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "hardy",
    "name": "Hardy",
    "type": "positive",
    "desc": "Naturally high constitution and wound resilience",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "haunted",
    "name": "Haunted",
    "type": "positive",
    "desc": "Plagued by nightmares of past fallen comrades",
    "tag": "Combat AI",
    "behaviorEffect": {
      "courage": -0.16,
      "recklessness": -0.1
    },
    "nonCombat": null
  },
  {
    "id": "hollow-willed",
    "name": "Hollow-Willed",
    "type": "negative",
    "desc": "Fragile spirit easily drained by cursed ground and dark magic.",
    "tag": "Flaw",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "homebody",
    "name": "Homebody",
    "type": "positive",
    "desc": "Dislikes long expeditions away from the guild hall",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "hopeful",
    "name": "Hopeful",
    "type": "positive",
    "desc": "Keeps high party morale even when dark falls",
    "tag": "Dungeon events",
    "behaviorEffect": null,
    "nonCombat": {
      "tag": "Dungeon events",
      "summary": "Keeps the party's spirits up: unlocks the good ending on several rest-and-relief dungeon events, and helps on Expedition contracts.",
      "systems": [
        "Dungeon events",
        "Contracts"
      ],
      "detail": [
        "The Quiet Shrine: opens the blessed branch — active members lose 18 stress instead of 6.",
        "The Wounded Beast (only when the party has no healer): the merciful outcome grants gold, an item, and heals 12% max HP to everyone.",
        "The Lost Party and The Starving Pilgrim: unlock the kind outcome — 12 stress off the party and a new bond pair (+7 to their bond if both survive).",
        "Liked by Expedition contracts (+0.05 suitability). Never rolls alongside Superstitious or Haunted."
      ]
    }
  },
  {
    "id": "horn-called",
    "name": "Horn-Called",
    "type": "positive",
    "desc": "Rallies instantly to battle horns and guild mobilization orders.",
    "tag": "Combat AI",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "hot-headed",
    "name": "Hot Headed",
    "type": "positive",
    "desc": "Loses temper easily and rushes ahead foolishly",
    "tag": "Combat AI",
    "behaviorEffect": {
      "threatMult": 0.14,
      "recklessness": 0.25,
      "discipline": -0.2,
      "killHunger": 0.1
    },
    "nonCombat": null
  },
  {
    "id": "humble",
    "name": "Humble",
    "type": "positive",
    "desc": "Fights selflessly (+8% Courage, +10% Protectiveness toward allies).",
    "tag": "Combat AI",
    "behaviorEffect": {
      "courage": 0.08,
      "protectiveness": 0.1
    },
    "nonCombat": null
  },
  {
    "id": "indomitable",
    "name": "Indomitable",
    "type": "positive",
    "desc": "Refuses to accept defeat under any condition",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "inspiring",
    "name": "Inspiring",
    "type": "positive",
    "desc": "Rallies all party members in desperate moments",
    "tag": "Combat AI",
    "behaviorEffect": {
      "lead": 0.06,
      "protectiveness": 0.18
    },
    "nonCombat": null
  },
  {
    "id": "insubordinate",
    "name": "Insubordinate",
    "type": "positive",
    "desc": "Occasionally ignores tactical instructions during delves",
    "tag": "Combat AI",
    "behaviorEffect": {
      "discipline": -0.18,
      "protectiveness": -0.18
    },
    "nonCombat": null
  },
  {
    "id": "iron-willed",
    "name": "Iron Willed",
    "type": "positive",
    "desc": "Resistant to mental manipulation and charm",
    "tag": "Combat AI",
    "behaviorEffect": {
      "threatMult": 0.06,
      "courage": 0.12
    },
    "nonCombat": null
  },
  {
    "id": "jinxed",
    "name": "Jinxed",
    "type": "positive",
    "desc": "Unfortunate random events seem to follow them",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "keeper-of-the-scorch",
    "name": "Keeper of the Scorch",
    "type": "positive",
    "desc": "Hardened survivor of burning wastes; high fire and burn resilience.",
    "tag": "Environment",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "kin-proud",
    "name": "Kin-Proud",
    "type": "positive",
    "desc": "Fights with enhanced morale and coordination alongside members of the same race.",
    "tag": "Social",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "late-bloomer",
    "name": "Late Bloomer",
    "type": "positive",
    "desc": "Reaches peak development later in life",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "light-sleeper",
    "name": "Light Sleeper",
    "type": "positive",
    "desc": "Struggles to rest and recover stamina in damp camps",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "light-fingered",
    "name": "Light-Fingered",
    "type": "positive",
    "desc": "Adept at picking complex lockboxes and disarming trap triggers.",
    "tag": "Dungeon",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "lone-wolf",
    "name": "Lone Wolf",
    "type": "positive",
    "desc": "Prefers fighting independently rather than in tight formations",
    "tag": "Combat AI",
    "behaviorEffect": {
      "protectiveness": -0.5
    },
    "nonCombat": null
  },
  {
    "id": "long-rooted",
    "name": "Long-Rooted",
    "type": "positive",
    "desc": "Enduring patience and stability during long encounters and sieges.",
    "tag": "Combat AI",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "loyal",
    "name": "Loyal",
    "type": "positive",
    "desc": "Will never accept poach offers from rival guilds",
    "tag": "Combat AI",
    "behaviorEffect": {
      "protectiveness": 0.4
    },
    "nonCombat": null
  },
  {
    "id": "lucky",
    "name": "Lucky",
    "type": "positive",
    "desc": "Fortune favors them in critical moments",
    "tag": "Combat AI",
    "behaviorEffect": {
      "luck": 0.45
    },
    "nonCombat": null
  },
  {
    "id": "market-day-friend",
    "name": "Market-Day Friend",
    "type": "positive",
    "desc": "Charismatic negotiator welcomed by merchants, reducing town store markups.",
    "tag": "Guild",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "methodical",
    "name": "Methodical",
    "type": "positive",
    "desc": "Disciplined and composed (+15% Discipline, -15% Recklessness, -5% Threat).",
    "tag": "Combat AI",
    "behaviorEffect": {
      "threatMult": -0.05,
      "recklessness": -0.15,
      "discipline": 0.15,
      "killHunger": -0.15
    },
    "nonCombat": null
  },
  {
    "id": "night-eyed",
    "name": "Night-Eyed",
    "type": "positive",
    "desc": "Keen dark vision that completely negates Pitch Dark accuracy penalties.",
    "tag": "Environment",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "oathbound",
    "name": "Oathbound",
    "type": "positive",
    "desc": "Bound by sacred honor to serve the guild hall",
    "tag": "Oaths",
    "behaviorEffect": null,
    "nonCombat": {
      "tag": "Oaths",
      "summary": "Cheaper renewals and stronger retention.",
      "systems": [
        "Oaths"
      ],
      "detail": [
        "Renewal ask ×0.62; haggle odds +35 percentage points.",
        "Adds 10 to the rival-approach retention score.",
        "Takes precedence over Loyal and Greedy in the renewal helper."
      ]
    }
  },
  {
    "id": "old-school",
    "name": "Old School",
    "type": "positive",
    "desc": "Believes the old dungeon codes were the best",
    "tag": "Training",
    "behaviorEffect": null,
    "nonCombat": {
      "tag": "Training",
      "summary": "Better at teaching the same class; worse outside it.",
      "systems": [
        "Training"
      ],
      "detail": [
        "Exact-class teaching fit is 1.55 instead of 1.3.",
        "Other fits are multiplied by 0.7 unless A Broad Hand takes precedence."
      ]
    }
  },
  {
    "id": "old-soldier",
    "name": "Old Soldier",
    "type": "positive",
    "desc": "Hardened veteran who has seen it all",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "old-voice",
    "name": "Old Voice",
    "type": "positive",
    "desc": "Respected presence that calms younger comrades and reduces party panic.",
    "tag": "Social",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "pathfinder",
    "name": "Pathfinder",
    "type": "positive",
    "desc": "Guides the party safely through treacherous dungeon paths",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "peacemaker",
    "name": "Peacemaker",
    "type": "positive",
    "desc": "Calms campfire disputes, preventing party friction and morale drops.",
    "tag": "Social",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "professional",
    "name": "Professional",
    "type": "positive",
    "desc": "Treats dungeoneering with utmost tactical seriousness",
    "tag": "Combat AI",
    "behaviorEffect": {
      "recklessness": -0.1,
      "discipline": 0.15,
      "killHunger": -0.1
    },
    "nonCombat": null
  },
  {
    "id": "quick-to-mend",
    "name": "Quick to Mend",
    "type": "positive",
    "desc": "Heals wounds and injuries twice as fast",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "quick-witted",
    "name": "Quick Witted",
    "type": "positive",
    "desc": "Rapid learner who absorbs tactical feedback immediately",
    "tag": "Contracts",
    "behaviorEffect": null,
    "nonCombat": {
      "tag": "Contracts",
      "summary": "Reads a dungeon fast — valued on Gear Hunt contracts, though it doesn't change any combat or attribute rolls.",
      "systems": [
        "Contracts"
      ],
      "detail": [
        "Liked by Gear Hunt (relic) contracts: each matching hero adds +0.05 to job suitability, nudging the outcome tier, payout and renown.",
        "Its listed Decisions / Anticipation are display flavour only — no event, puzzle or stat roll actually uses them.",
        "Never rolls alongside Hot-Headed."
      ]
    }
  },
  {
    "id": "reckless",
    "name": "Reckless",
    "type": "positive",
    "desc": "Takes unnecessary risks that endanger the whole party",
    "tag": "Combat AI",
    "behaviorEffect": {
      "threatMult": 0.16,
      "recklessness": 0.3,
      "discipline": -0.2
    },
    "nonCombat": null
  },
  {
    "id": "restless",
    "name": "Restless",
    "type": "positive",
    "desc": "Gets irritable if benched for more than a few days",
    "tag": "Combat AI",
    "behaviorEffect": {
      "recklessness": 0.08
    },
    "nonCombat": null
  },
  {
    "id": "road-hardened",
    "name": "Road-Hardened",
    "type": "positive",
    "desc": "Endures long overland marches without suffering traveling fatigue.",
    "tag": "Environment",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "shaken",
    "name": "Shaken",
    "type": "negative",
    "desc": "Nerves frayed by past horrors (-15% Courage, +5% Steady).",
    "tag": "Flaw",
    "behaviorEffect": {
      "courage": -0.15,
      "steady": 0.05
    },
    "nonCombat": null
  },
  {
    "id": "slow-to-mend",
    "name": "Slow to Mend",
    "type": "positive",
    "desc": "Takes far longer to recover from dungeon injuries",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "sore-loser",
    "name": "Sore Loser",
    "type": "positive",
    "desc": "Suffers massive morale loss on defeats",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "stalwart",
    "name": "Stalwart",
    "type": "positive",
    "desc": "Unmoving anchor for party formations",
    "tag": "Combat AI",
    "behaviorEffect": {
      "courage": 0.08
    },
    "nonCombat": {
      "tag": "Events & jobs",
      "summary": "The steadfast presence: unlocks brave outcomes at several dungeon events, is prized on Sellsword contracts, and can even be earned or granted by gear.",
      "systems": [
        "Dungeon events",
        "Contracts",
        "Acquisition"
      ],
      "detail": [
        "The Quiet Shrine: opens the blessed branch (party stress -18).",
        "The Whispering Idol: forces the good outcome even past a Greedy, Arrogant or Reckless party — gold and party stress -5.",
        "The Echoing Tomb: unlocks the tomb-opening reward (gold + an item) even over Superstitious, Cowardly or Shaken heroes.",
        "Liked by Sellsword contracts (+0.05 suitability). Earnable by completing the Standard-Bearer vow, or granted by Mythic/Legendary armour (Aegis of the Steadfast, Mantle of Resolve).",
        "Note: gear-granted Stalwart only feeds combat and the UI — the event and contract perks check the hero's own earned trait. Never rolls with Cowardly or Brittle."
      ]
    }
  },
  {
    "id": "steady",
    "name": "Steady",
    "type": "positive",
    "desc": "Reliable under all combat conditions",
    "tag": "Combat AI",
    "behaviorEffect": {
      "discipline": 0.08
    },
    "nonCombat": null
  },
  {
    "id": "stoic",
    "name": "Stoic",
    "type": "positive",
    "desc": "Endures pain and hardship without losing focus",
    "tag": "Combat AI",
    "behaviorEffect": {
      "courage": 0.12,
      "recklessness": -0.06,
      "poise": -0.03,
      "steady": -0.04
    },
    "nonCombat": null
  },
  {
    "id": "stone-still",
    "name": "Stone-Still",
    "type": "positive",
    "desc": "Immovable composure when ambushed or surrounded by enemy forces.",
    "tag": "Combat AI",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "streaky",
    "name": "Streaky",
    "type": "positive",
    "desc": "Wildly inconsistent form—brilliant one day, awful the next",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "sun-warmed",
    "name": "Sun-Warmed",
    "type": "positive",
    "desc": "High spirits and increased movement speed when fighting in open biomes.",
    "tag": "Environment",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "superstitious",
    "name": "Superstitious",
    "type": "positive",
    "desc": "Performs rituals before opening chests or doors",
    "tag": "Combat AI",
    "behaviorEffect": {
      "courage": -0.1
    },
    "nonCombat": null
  },
  {
    "id": "sure-footed",
    "name": "Sure Footed",
    "type": "positive",
    "desc": "Immune to trip hazards and rough terrain stumbling",
    "tag": "Combat AI",
    "behaviorEffect": {
      "recklessness": -0.1,
      "luck": 0.12
    },
    "nonCombat": null
  },
  {
    "id": "tally-keeper",
    "name": "Tally-Keeper",
    "type": "positive",
    "desc": "Meticulously tallies slain foes, earning bonus guild renown on contracts.",
    "tag": "Guild",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "team-player",
    "name": "Team Player",
    "type": "positive",
    "desc": "Maximizes bond gains and synergy power",
    "tag": "Combat AI",
    "behaviorEffect": {
      "protectiveness": 0.4
    },
    "nonCombat": null
  },
  {
    "id": "thick-skinned",
    "name": "Thick Skinned",
    "type": "positive",
    "desc": "Reduces damage received from physical blows",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "thrifty",
    "name": "Thrifty",
    "type": "positive",
    "desc": "Maintains equipment carefully to save gold",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "tireless",
    "name": "Tireless",
    "type": "positive",
    "desc": "Rarely suffers from expedition fatigue",
    "tag": "Combat AI",
    "behaviorEffect": {
      "threatMult": 0.04,
      "discipline": 0.12
    },
    "nonCombat": null
  },
  {
    "id": "traditional",
    "name": "Traditional",
    "type": "positive",
    "desc": "Prefers standard ancient techniques over new tactics",
    "tag": "Combat AI",
    "behaviorEffect": {
      "discipline": 0.06,
      "killHunger": -0.05
    },
    "nonCombat": null
  },
  {
    "id": "trap-wise",
    "name": "Trap Wise",
    "type": "positive",
    "desc": "Easily spots hidden pressure plates and dungeon snares",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "unbreakable",
    "name": "Unbreakable",
    "type": "positive",
    "desc": "Body and spirit cannot be broken by dungeon despair",
    "tag": "Combat AI",
    "behaviorEffect": {
      "threatMult": 0.1,
      "courage": 0.25
    },
    "nonCombat": null
  },
  {
    "id": "unforgiving",
    "name": "Unforgiving",
    "type": "positive",
    "desc": "Holds grudges against allies who make tactical mistakes",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "vain",
    "name": "Vain",
    "type": "positive",
    "desc": "Obsessed with appearances over substance",
    "tag": "Combat AI",
    "behaviorEffect": {
      "recklessness": 0.12,
      "killHunger": 0.3,
      "protectiveness": -0.3
    },
    "nonCombat": null
  },
  {
    "id": "vigilant",
    "name": "Vigilant",
    "type": "positive",
    "desc": "Never ambushed or caught unprepared",
    "tag": "Combat AI",
    "behaviorEffect": {
      "recklessness": -0.09,
      "discipline": 0.1
    },
    "nonCombat": null
  },
  {
    "id": "watchful",
    "name": "Watchful",
    "type": "positive",
    "desc": "Keeps an eye on the shadows at all times",
    "tag": "Combat AI",
    "behaviorEffect": {
      "recklessness": -0.07
    },
    "nonCombat": null
  },
  {
    "id": "weathered",
    "name": "Weathered",
    "type": "positive",
    "desc": "Seasoned traveler hardened to all elements",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  },
  {
    "id": "well-preserved",
    "name": "Well Preserved",
    "type": "positive",
    "desc": "Ages gracefully with minimal attribute decline",
    "tag": "General",
    "behaviorEffect": null,
    "nonCombat": null
  }
];

export const RARITIES = ['common', 'rare', 'epic', 'legendary'];
export const EQUIPMENT_SLOTS = ['weapon', 'armour', 'trinket'];
export const WEAPON_KINDS = ['melee', 'ranged', 'spell'];
export const COMMON_MODS = [
  { key: 'attackPct', name: 'Attack Power (%)', default: 0.15 },
  { key: 'accuracy', name: 'Accuracy', default: 5 },
  { key: 'critChance', name: 'Critical Strike Chance (%)', default: 0.05 },
  { key: 'critDamage', name: 'Critical Strike Damage (%)', default: 0.25 },
  { key: 'hpPct', name: 'Max Hit Points (%)', default: 0.15 },
  { key: 'mitigation', name: 'Damage Mitigation (%)', default: 0.08 },
  { key: 'healTakenPct', name: 'Healing Received (%)', default: 0.12 },
  { key: 'speed', name: 'Combat Speed', default: 3 },
];

export interface ConvictionInfo {
  id: string;
  name: string;
  text: string;
  leans: string;
}

export const CONVICTION_CATALOG: Record<string, ConvictionInfo> = {
  'last-to-fall': {
    id: 'last-to-fall',
    name: 'The Last to Fall',
    text: 'Holds that the leader eats last and dies last, or is no leader.',
    leans: 'Honourable',
  },
  'word-given': {
    id: 'word-given',
    name: 'Word Given',
    text: 'Holds that a promise made in daylight cannot be broken in the deep.',
    leans: 'Honourable',
  },
  'waste-nothing': {
    id: 'waste-nothing',
    name: 'Waste Nothing',
    text: 'Holds that every scrap, torch, and coin must be accounted for.',
    leans: 'Pragmatic',
  },
  'quiet-life-one-day': {
    id: 'quiet-life-one-day',
    name: 'Quiet Life One Day',
    text: 'Holds that the dungeon is only a bridge to a peaceful hearth.',
    leans: 'Peaceable',
  },
  'change-or-die': {
    id: 'change-or-die',
    name: 'Change or Die',
    text: 'Holds that rigidity is death; the adaptable inherit the delve.',
    leans: 'Pragmatic',
  },
  'luck-is-real': {
    id: 'luck-is-real',
    name: 'Luck is Real',
    text: 'Holds that fortune smiles upon the bold and superstitious.',
    leans: 'Reckless',
  },
  'quiet-hand': {
    id: 'quiet-hand',
    name: 'A Quiet Hand',
    text: 'Holds that measured restraint solves what frenzy cannot.',
    leans: 'Disciplined',
  },
  'mend-not-end': {
    id: 'mend-not-end',
    name: 'Mend, Not End',
    text: 'Holds that preservation of companions outweighs any glory.',
    leans: 'Compassionate',
  },
  'work-is-meaning': {
    id: 'work-is-meaning',
    name: 'Work is Meaning',
    text: 'Holds that an idle delver rusts; purpose is found in the struggle.',
    leans: 'Dedicated',
  },
  'faith-holds': {
    id: 'faith-holds',
    name: 'Faith Holds',
    text: 'Holds that divine providence illuminates the darkest cavern.',
    leans: 'Devout',
  },
  'first-through-door': {
    id: 'first-through-door',
    name: 'First Through the Door',
    text: 'Holds that courage is showing the shadows your shield first.',
    leans: 'Valiant',
  },
  'no-cowards-death': {
    id: 'no-cowards-death',
    name: 'No Coward’s Death',
    text: 'Holds that dying on your feet is better than crawling away.',
    leans: 'Fierce',
  },
  'sharp-tongue': {
    id: 'sharp-tongue',
    name: 'A Sharp Tongue',
    text: 'Holds that hard truths spoken early save lives in the end.',
    leans: 'Blunt',
  },
};

export interface FlawInfo {
  id: string;
  name: string;
  text: string;
}

export const FLAW_CATALOG: Record<string, FlawInfo> = {
  'hoards-glory': {
    id: 'hoards-glory',
    name: 'Hoards the Glory',
    text: 'Cannot share a win, and has soured a triumph counting who got the credit.',
  },
  'haunted': {
    id: 'haunted',
    name: 'Haunted',
    text: 'Sees the faces of fallen comrades in the dark and hesitates when echoes call.',
  },
  'freezes-at-fork': {
    id: 'freezes-at-fork',
    name: 'Freezes at the Fork',
    text: 'Paralyzed by equal choices when paths split, losing vital momentum.',
  },
  'cant-take-yes': {
    id: 'cant-take-yes',
    name: 'Cannot Take Yes',
    text: 'Argues even when victorious, finding fault where none was asked.',
  },
  'loose-tongue': {
    id: 'loose-tongue',
    name: 'Loose Tongue',
    text: 'Speaks out of turn in tense negotiations and taunts beasts unwisely.',
  },
  'quick-to-despair': {
    id: 'quick-to-despair',
    name: 'Quick to Despair',
    text: 'Convinced disaster is inevitable at the first sign of injury.',
  },
  'the-bottle': {
    id: 'the-bottle',
    name: 'The Bottle',
    text: 'Seeks solace in strong spirits at every rest, dulled for the morning watch.',
  },
  'golden-cage': {
    id: 'golden-cage',
    name: 'Golden Cage',
    text: 'Obsessed with status symbols and prestige beyond their means.',
  },
  'trusts-too-easy': {
    id: 'trusts-too-easy',
    name: 'Trusts Too Easy',
    text: 'Believes sweet words and falls prey to underworld ruses.',
  },
  'heros-habit': {
    id: 'heros-habit',
    name: 'Hero’s Habit',
    text: 'Takes reckless hits meant for others without checking their own stance.',
  },
  'never-asks': {
    id: 'never-asks',
    name: 'Never Asks for Help',
    text: 'Refuses healing and hides bleeding wounds until collapse.',
  },
  'greed': {
    id: 'greed',
    name: 'Bottomless Greed',
    text: 'Eyes stray toward jeweled urns even while fighting for survival.',
  },
  'spends-it-first': {
    id: 'spends-it-first',
    name: 'Spends It First',
    text: 'Commits future earnings to tavern debts before the haul is brought home.',
  },
};

export function getConvictionInfo(id?: string): ConvictionInfo {
  if (!id) return { id: '', name: 'Undetermined', text: 'No conviction recorded.', leans: 'Neutral' };
  if (CONVICTION_CATALOG[id]) return CONVICTION_CATALOG[id];
  const formatted = id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return { id, name: formatted, text: `Holds fast to the ideal of ${formatted}.`, leans: 'Honourable' };
}

export function getFlawInfo(id?: string): FlawInfo {
  if (!id) return { id: '', name: 'None', text: 'No fatal flaw recorded.' };
  if (FLAW_CATALOG[id]) return FLAW_CATALOG[id];
  const formatted = id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return { id, name: formatted, text: `Struggles with ${formatted} under stress.` };
}
