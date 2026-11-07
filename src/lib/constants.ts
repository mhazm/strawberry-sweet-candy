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
}

export const TRAIT_CATALOG: TraitInfo[] = [
  // Positive Combat & Survival
  { id: 'brave', name: 'Brave', type: 'positive', desc: 'Exceptional valor against terrifying monsters' },
  { id: 'dauntless', name: 'Dauntless', type: 'positive', desc: 'Unshakable when confronted with insurmountable odds' },
  { id: 'big-game-player', name: 'Big Game Player', type: 'positive', desc: 'Levels up combat performance during boss encounters' },
  { id: 'death-defying', name: 'Death Defying', type: 'positive', desc: 'Incredible ability to survive mortal strikes' },
  { id: 'giant-killer', name: 'Giant Killer', type: 'positive', desc: 'Bonus damage and precision against massive brutes' },
  { id: 'unbreakable', name: 'Unbreakable', type: 'positive', desc: 'Body and spirit cannot be broken by dungeon despair' },
  { id: 'hardy', name: 'Hardy', type: 'positive', desc: 'Naturally high constitution and wound resilience' },
  { id: 'thick-skinned', name: 'Thick Skinned', type: 'positive', desc: 'Reduces damage received from physical blows' },
  { id: 'tireless', name: 'Tireless', type: 'positive', desc: 'Rarely suffers from expedition fatigue' },
  { id: 'quick-to-mend', name: 'Quick to Mend', type: 'positive', desc: 'Heals wounds and injuries twice as fast' },
  { id: 'quick-witted', name: 'Quick Witted', type: 'positive', desc: 'Rapid learner who absorbs tactical feedback immediately' },
  { id: 'consistent', name: 'Consistent', type: 'positive', desc: 'Consistently performs at peak ability week in and week out' },
  { id: 'sure-footed', name: 'Sure Footed', type: 'positive', desc: 'Immune to trip hazards and rough terrain stumbling' },
  { id: 'trap-wise', name: 'Trap Wise', type: 'positive', desc: 'Easily spots hidden pressure plates and dungeon snares' },
  { id: 'field-medic', name: 'Field Medic', type: 'positive', desc: 'Provides emergency first aid to wounded comrades' },
  { id: 'crucible-raised', name: 'Crucible Raised', type: 'positive', desc: 'Forged in tournament fires with fierce competitive drive' },
  { id: 'stalwart', name: 'Stalwart', type: 'positive', desc: 'Unmoving anchor for party formations' },
  { id: 'steady', name: 'Steady', type: 'positive', desc: 'Reliable under all combat conditions' },
  { id: 'stoic', name: 'Stoic', type: 'positive', desc: 'Endures pain and hardship without losing focus' },
  { id: 'pathfinder', name: 'Pathfinder', type: 'positive', desc: 'Guides the party safely through treacherous dungeon paths' },
  { id: 'ash-hardened', name: 'Ash Hardened', type: 'positive', desc: 'Resistant to fire and scorched ground' },
  { id: 'deeps-taught', name: 'Deeps Taught', type: 'positive', desc: 'Instinctive mastery of the underdark tunnels' },
  { id: 'deep-seasoned', name: 'Deep Seasoned', type: 'positive', desc: 'Decades of surviving deep delve horrors' },
  { id: 'vigilant', name: 'Vigilant', type: 'positive', desc: 'Never ambushed or caught unprepared' },
  { id: 'watchful', name: 'Watchful', type: 'positive', desc: 'Keeps an eye on the shadows at all times' },
  { id: 'weathered', name: 'Weathered', type: 'positive', desc: 'Seasoned traveler hardened to all elements' },
  { id: 'well-preserved', name: 'Well Preserved', type: 'positive', desc: 'Ages gracefully with minimal attribute decline' },
  { id: 'lucky', name: 'Lucky', type: 'positive', desc: 'Fortune favors them in critical moments' },
  { id: 'hopeful', name: 'Hopeful', type: 'positive', desc: 'Keeps high party morale even when dark falls' },
  { id: 'iron-willed', name: 'Iron Willed', type: 'positive', desc: 'Resistant to mental manipulation and charm' },
  { id: 'indomitable', name: 'Indomitable', type: 'positive', desc: 'Refuses to accept defeat under any condition' },
  { id: 'inspiring', name: 'Inspiring', type: 'positive', desc: 'Rallies all party members in desperate moments' },
  { id: 'team-player', name: 'Team Player', type: 'positive', desc: 'Maximizes bond gains and synergy power' },
  { id: 'professional', name: 'Professional', type: 'positive', desc: 'Treats dungeoneering with utmost tactical seriousness' },
  { id: 'diligent', name: 'Diligent', type: 'positive', desc: 'Trains harder and gains extra XP per training session' },
  { id: 'dutiful', name: 'Dutiful', type: 'positive', desc: 'Always obeys tactical instructions without hesitation' },
  { id: 'mentor', name: 'Mentor', type: 'positive', desc: 'Helps younger delvers grow and level up quicker' },
  { id: 'quiet-example', name: 'Quiet Example', type: 'positive', desc: 'Leads by deeds rather than words' },
  { id: 'cool-headed', name: 'Cool Headed', type: 'positive', desc: 'Composed under high stress conditions' },
  { id: 'charismatic', name: 'Charismatic', type: 'positive', desc: 'Loved by the crowd and respected by peers' },
  { id: 'crowd-pleaser', name: 'Crowd Pleaser', type: 'positive', desc: 'Earns extra renown and spectator cheers' },
  { id: 'loyal', name: 'Loyal', type: 'positive', desc: 'Will never accept poach offers from rival guilds' },
  { id: 'oathbound', name: 'Oathbound', type: 'positive', desc: 'Bound by sacred honor to serve the guild hall' },

  // Negative / Flaws
  { id: 'cowardly', name: 'Cowardly', type: 'negative', desc: 'Prone to fleeing in terror when HP gets low' },
  { id: 'claustrophobic', name: 'Claustrophobic', type: 'negative', desc: 'Suffers severe stress in tight corridors and tunnels' },
  { id: 'clumsy', name: 'Clumsy', type: 'negative', desc: 'Prone to tripping and making noise in stealth situations' },
  { id: 'frail', name: 'Frail', type: 'negative', desc: 'Lower natural health and prone to sudden injuries' },
  { id: 'glass-jawed', name: 'Glass Jawed', type: 'negative', desc: 'Susceptible to knockouts and critical injuries' },
  { id: 'brittle', name: 'Brittle', type: 'negative', desc: 'Bones break easily under brute attacks' },
  { id: 'insubordinate', name: 'Insubordinate', type: 'negative', desc: 'Occasionally ignores tactical instructions during delves' },
  { id: 'jinxed', name: 'Jinxed', type: 'negative', desc: 'Unfortunate random events seem to follow them' },
  { id: 'slow-to-mend', name: 'Slow to Mend', type: 'negative', desc: 'Takes far longer to recover from dungeon injuries' },
  { id: 'hot-headed', name: 'Hot Headed', type: 'negative', desc: 'Loses temper easily and rushes ahead foolishly' },
  { id: 'reckless', name: 'Reckless', type: 'negative', desc: 'Takes unnecessary risks that endanger the whole party' },
  { id: 'sore-loser', name: 'Sore Loser', type: 'negative', desc: 'Suffers massive morale loss on defeats' },
  { id: 'vain', name: 'Vain', type: 'negative', desc: 'Obsessed with appearances over substance' },
  { id: 'arrogant', name: 'Arrogant', type: 'negative', desc: 'Underestimates opponents and ignores warnings' },
  { id: 'fair-weather', name: 'Fair Weather', type: 'negative', desc: 'Morale collapses when the guild faces tough times' },
  { id: 'haunted', name: 'Haunted', type: 'negative', desc: 'Plagued by nightmares of past fallen comrades' },
  { id: 'death-seeker', name: 'Death Seeker', type: 'negative', desc: 'Subconsciously seeks an honorable end in battle' },
  { id: 'light-sleeper', name: 'Light Sleeper', type: 'negative', desc: 'Struggles to rest and recover stamina in damp camps' },
  { id: 'streaky', name: 'Streaky', type: 'negative', desc: 'Wildly inconsistent form—brilliant one day, awful the next' },
  { id: 'unforgiving', name: 'Unforgiving', type: 'negative', desc: 'Holds grudges against allies who make tactical mistakes' },

  // Neutral / Roleplay / Economy
  { id: 'coin-minded', name: 'Coin Minded', type: 'neutral', desc: 'Motivated primarily by gold bonuses and wages' },
  { id: 'greedy', name: 'Greedy', type: 'neutral', desc: 'Demands a larger share of the dungeon plunder' },
  { id: 'thrifty', name: 'Thrifty', type: 'neutral', desc: 'Maintains equipment carefully to save gold' },
  { id: 'hard-bargainer', name: 'Hard Bargainer', type: 'neutral', desc: 'Fierce contract negotiator' },
  { id: 'gambler', name: 'Gambler', type: 'neutral', desc: 'Loves high-stakes bets in tavern halls' },
  { id: 'glory-hunter', name: 'Glory Hunter', type: 'neutral', desc: 'Craves renown and public fame above all else' },
  { id: 'generous', name: 'Generous', type: 'neutral', desc: 'Shares bonuses freely with fellow guild members' },
  { id: 'traditional', name: 'Traditional', type: 'neutral', desc: 'Prefers standard ancient techniques over new tactics' },
  { id: 'old-school', name: 'Old School', type: 'neutral', desc: 'Believes the old dungeon codes were the best' },
  { id: 'old-soldier', name: 'Old Soldier', type: 'neutral', desc: 'Hardened veteran who has seen it all' },
  { id: 'homebody', name: 'Homebody', type: 'neutral', desc: 'Dislikes long expeditions away from the guild hall' },
  { id: 'restless', name: 'Restless', type: 'neutral', desc: 'Gets irritable if benched for more than a few days' },
  { id: 'curious', name: 'Curious', type: 'neutral', desc: 'Investigates strange arcane symbols and curios' },
  { id: 'early-riser', name: 'Early Riser', type: 'neutral', desc: 'First to awaken and prepare gear for the day' },
  { id: 'easygoing', name: 'Easygoing', type: 'neutral', desc: 'Gets along easily with almost any party member' },
  { id: 'companionable', name: 'Companionable', type: 'neutral', desc: 'Fast friendships with fellow adventurers' },
  { id: 'lone-wolf', name: 'Lone Wolf', type: 'neutral', desc: 'Prefers fighting independently rather than in tight formations' },
  { id: 'late-bloomer', name: 'Late Bloomer', type: 'neutral', desc: 'Reaches peak development later in life' },
  { id: 'blood-drunk', name: 'Blood Drunk', type: 'neutral', desc: 'Enters a blood frenzy when slaying foes' },
  { id: 'bearer-of-the-fallen', name: 'Bearer of the Fallen', type: 'neutral', desc: 'Carries tokens of deceased heroes into battle' },
  { id: 'superstitious', name: 'Superstitious', type: 'neutral', desc: 'Performs rituals before opening chests or doors' },
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
