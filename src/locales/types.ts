export type LanguageCode = 'en' | 'id' | 'zh' | 'de' | 'ja' | 'es' | 'ru' | 'fr';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
}

export interface AttributeLocalization {
  name: string;
  desc: string;
}

export interface TraitLocalization {
  name: string;
  desc: string;
}

export interface TranslationSchema {
  // App & General
  appName: string;
  saveGame: string;
  saving: string;
  exportJson: string;
  unsavedChanges: string;
  revertChanges: string;
  day: string;
  year: string;
  delvers: string;
  gold: string;
  searchDelvers: string;

  // Sidebar Navigation
  navSectionDelvers: string;
  navSectionGuild: string;
  navSectionCheats: string;
  navRoster: string;
  navRecruits: string;
  navFallen: string;
  navArmoury: string;
  navGuildOverview: string;
  navQuickCheats: string;
  navSettings: string;

  // Roster View & Table
  rosterTitle: string;
  allRoles: string;
  allPosts: string;
  vanguard: string;
  secondWatch: string;
  reserves: string;
  sortBy: string;
  sortRating: string;
  sortCA: string;
  sortPA: string;
  sortLevel: string;
  sortName: string;
  tableView: string;
  cardView: string;
  healAll: string;
  gachaAllRecruits: string;

  // Table Headers
  colName: string;
  colRole: string;
  colVeterancy: string;
  colAge: string;
  colFit: string;
  colMood: string;
  colRating: string;
  colAbility: string;

  // Inspector Panel
  whoTheyAre: string;
  conviction: string;
  leans: string;
  vow: string;
  flaw: string;
  yourNotes: string;
  notesPlaceholder: string;
  howTheyPlay: string;
  editTraits: string;
  noTraits: string;
  loadout: string;
  weapon: string;
  armour: string;
  trinket: string;
  editGearStats: string;
  attributes: string;
  combat: string;
  mental: string;
  editAllAttributes: string;
  makeWonderkid: string;
  makeWonderkidDesc: string;
  releaseDelver: string;
  releaseConfirm: string;

  // Categories for 30 Attributes
  catAll: string;
  catCombat: string;
  catMental: string;
  catPhysical: string;
  catRole: string;

  // Flat Attribute Name Getters (backward compatibility)
  attrWeaponSkill: string;
  attrMarksmanship: string;
  attrMight: string;
  attrSpellcraft: string;
  attrArmorUse: string;
  attrParry: string;
  attrEvasion: string;
  attrCriticalStrike: string;
  attrComposure: string;
  attrBravery: string;
  attrDecisions: string;
  attrAnticipation: string;
  attrTeamwork: string;
  attrLeadership: string;
  attrConcentration: string;
  attrAggression: string;
  attrDiscipline: string;
  attrResolve: string;
  attrStrength: string;
  attrAgility: string;
  attrStamina: string;
  attrVitality: string;
  attrSpeed: string;
  attrReflexes: string;
  attrThreat: string;
  attrMitigation: string;
  attrHealing: string;
  attrSupport: string;
  attrCrowdControl: string;
  attrPositioning: string;

  // Trait Tooltips & Types
  traitPositive: string;
  traitNegative: string;
  traitNeutral: string;

  // Class Pillars & Hero Modal
  keyPillar: string;
  raceTooltip: string;
  modalHeroTitle: string;
  tab30Combat: string;
  tabHidden: string;
  tabHealth: string;
  tabTraits: string;
  tabGear: string;
  currentAbilityCA: string;
  potentialAbilityPA: string;
  fullRestore: string;
  normalizeStats: string;
  maxAll20: string;
  maxAllHidden: string;
  saveDelver: string;
  cancel: string;
  equipTrait: string;
  unequipTrait: string;
  searchTraits: string;
  filterAll: string;
  filterPositive: string;
  filterNegative: string;
  filterNeutral: string;
  gearModifiers: string;
  addModifier: string;
  race: string;
  classRole: string;
  levelLabel: string;
  ageLabel: string;
  delverName: string;
  classLabel: string;
  roleLabel: string;
  combatAttrDesc: string;
  hiddenAttrDesc: string;
  equippedTraits: string;
  clearAllTraits: string;
  noTraitsEquipped: string;
  addCustomTrait: string;
  customTraitPlaceholder: string;
  gearDesc: string;
  noGearEquipped: string;
  equipSlot: string;
  itemName: string;
  rarity: string;
  tier: string;
  quality: string;
  goldValue: string;
  affixMods: string;
  maxLegendary: string;
  unequip: string;
  healthSectionTitle: string;
  conditionLabel: string;
  moraleLabel: string;
  stressLabel: string;
  fatigueLabel: string;
  injuryStatus: string;
  currentlyInjured: string;
  cureInjury: string;
  noInjuries: string;
  wonderkidRoll: string;

  // Guild Editor
  treasuryGold: string;
  realmRenown: string;
  seasonCalendar: string;
  currentDay: string;
  patronFavor: string;
  guildIdentityTreasury: string;
  guildName: string;
  exactGold: string;
  renownScore: string;
  patronConfidence: string;
  gameModeRules: string;
  ironmanMode: string;
  ironmanDesc: string;
  powerFantasyMode: string;
  powerFantasyDesc: string;
  dungeonbornOrigin: string;
  dungeonbornDesc: string;
  townRuleModel: string;
  guildStaffTitle: string;
  maxStaffSkills: string;
  expertiseSkill: string;
  wage: string;

  // Settings & Backups
  settingsTitle: string;
  activeFile: string;
  fileActions: string;
  loadAnotherSave: string;
  closeCurrentSave: string;
  safeBackupTitle: string;
  safeBackupDesc: string;
  safeBackupNote: string;
  detectedSaves: string;
  close: string;

  // Cheats
  cheatsTitle: string;
  godModeDesc: string;
  infiniteGold: string;
  infiniteGoldDesc: string;
  maxRenown: string;
  maxRenownDesc: string;
  healAllDesc: string;
  batchWonderkid: string;
  batchWonderkidDesc: string;
  maxStats: string;
  maxStatsDesc: string;
  reviveAll: string;
  reviveAllDesc: string;

  // Dynamic Dictionary for 30 Attributes: names & descriptions
  attrs: Record<string, AttributeLocalization>;

  // Dynamic Dictionary for 7 Hidden FM Attributes
  hiddenAttrs: Record<string, AttributeLocalization>;

  // Dynamic Dictionary for 84+ Character Traits
  traits?: Record<string, TraitLocalization>;
}

