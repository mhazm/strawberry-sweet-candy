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
  navSynergy: string;
  navConditions: string;
  navGuildOverview: string;
  navQuickCheats: string;
  navSettings: string;

  // Party Synergy Planner
  synergyTitle: string;
  synergySubtitle: string;
  synergyActiveParty: string;
  synergyEmptyParty: string;
  synergyTotalBonuses: string;
  synergyDamage: string;
  synergyHealing: string;
  synergyMitigation: string;
  synergyActiveList: string;
  synergyInactiveList: string;
  synergyAvailableRoster: string;
  synergyRecommendedTitle: string;
  synergyRecommendedSubtitle: string;
  synergyApplyParty: string;
  synergyClearParty: string;
  synergySlotsUsed: string;
  synergyNoSynergyFound: string;

  // Dungeon Conditions Scout
  conditionTitle: string;
  conditionSubtitle: string;
  conditionTabContracts: string;
  conditionTabPresets: string;
  conditionNoContracts: string;
  conditionContractLabel: string;
  conditionBiomeLabel: string;
  conditionDangerLabel: string;
  conditionPossibleHazards: string;
  conditionNoActiveHazard: string;
  conditionDossierTitle: string;
  conditionPenaltyLabel: string;
  conditionImmuneStyle: string;
  conditionPenalizedStyle: string;
  conditionCounterGearLabel: string;
  conditionCounterTraitsLabel: string;
  conditionInStashBadge: string;
  conditionEquippedBadge: string;
  conditionRecommendedSquad: string;
  conditionSquadSubtitle: string;
  conditionDeploySynergy: string;
  conditionRosterReadiness: string;
  conditionFilterAll: string;
  conditionFilterOptimal: string;
  conditionFilterViable: string;
  conditionFilterVulnerable: string;
  conditionReadinessScore: string;
  conditionFactorsLabel: string;
  conditionGearAvailableStash: string;

  // Condition Names, Descriptions & Penalties
  condFlooded: string;
  condFloodedDesc: string;
  condFloodedPenalty: string;
  condPitchDark: string;
  condPitchDarkDesc: string;
  condPitchDarkPenalty: string;
  condCursedGround: string;
  condCursedGroundDesc: string;
  condCursedGroundPenalty: string;
  condDeepCold: string;
  condDeepColdDesc: string;
  condDeepColdPenalty: string;
  condInfernal: string;
  condInfernalDesc: string;
  condInfernalPenalty: string;
  condNumbingFrost: string;
  condNumbingFrostDesc: string;
  condNumbingFrostPenalty: string;

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
  filterRoleRecommended: string;
  filterPositive: string;
  filterNegative: string;
  filterNeutral: string;
  btnApplyRoleTraits: string;
  badgeRoleRecommended: string;
  warningHarmfulTrait: string;
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

  // Equipment Forge & Vault
  armouryVaultTitle: string;
  armouryVaultSubtitle: string;
  forgeCustomGear: string;
  forgeRelicGear: string;
  forgeCounterPack: string;
  upgradeAllSovereign: string;
  emptyVaultTitle: string;
  emptyVaultDesc: string;
  searchEquipmentPlaceholder: string;
  filterAllEquipment: string;
  filterWeapons: string;
  filterArmours: string;
  filterTrinkets: string;
  filterRelics: string;
  filterCounters: string;
  filterMinorTrinkets: string;
  sortItemValue: string;
  sortItemQuality: string;
  sortItemTier: string;
  sortItemName: string;
  qualityBandLabel: string;
  rollOddsLabel: string;
  multiplierLabel: string;
  conditionCounterTag: string;
  grantsTraitTag: string;
  weaponKindLabel: string;
  duplicateItem: string;
  deleteItem: string;
  editItem: string;
  forgeModalTitle: string;
  forgeModalSubtitle: string;
  editModalTitle: string;
  selectTemplate: string;
  customTemplateOption: string;
  selectCategory: string;
  selectSlot: string;
  selectWeaponKind: string;
  selectRarity: string;
  selectQualityBand: string;
  selectConditionCounter: string;
  selectGrantsTrait: string;
  previewAffixes: string;
  addModLine: string;
  modKeyLabel: string;
  modValueLabel: string;
  forgeActionBtn: string;
  saveChangesBtn: string;
  cancelBtn: string;
  equipFromStash: string;
  equippedSuccess: string;
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

  // Auto-Updater & Software Updates
  updaterSectionTitle: string;
  updaterDesc: string;
  checkUpdatesBtn: string;
  checkingUpdatesStatus: string;
  upToDateStatus: string;
  updateAvailableTitle: string;
  updateAvailableSubtitle: string;
  releaseNotesTitle: string;
  downloadingAndInstalling: string;
  restartNotice: string;
  updateAndRestartBtn: string;
  updateLaterBtn: string;
  installInProgress: string;
  updateFailedError: string;

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

