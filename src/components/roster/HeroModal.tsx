import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Heart,
  Swords,
  Brain,
  EyeOff,
  Tag,
  Shield,
  Zap,
  Search,
  Check,
  Plus,
  Trash2,
  Star,
  Package,
  Dices,
} from 'lucide-react';
import { Adventurer, EquipmentItem } from '../../types/savegame';
import {
  COMBAT_ATTRIBUTES,
  HIDDEN_ATTRIBUTES,
  RACES,
  CLASSES,
  ROLES,
  TRAIT_CATALOG,
  RARITIES,
  isClassPillar,
  getStatLabel,
  getStatDesc,
} from '../../lib/constants';
import { rollWonderkidGacha } from '../../lib/wonderkid';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { StatSlider } from './StatSlider';
import { RaceInfoTooltip } from './RaceInfoTooltip';
import { useTranslation } from '../../lib/i18n';
import { Tooltip } from '../ui/Tooltip';

interface HeroModalProps {
  hero: Adventurer;
  isOpen: boolean;
  initialTab?: 'attributes' | 'hidden' | 'health' | 'traits' | 'equipment';
  onClose: () => void;
  onSave: (updated: Adventurer) => void;
}

export const HeroModal: React.FC<HeroModalProps> = ({
  hero,
  isOpen,
  initialTab = 'attributes',
  onClose,
  onSave,
}) => {
  const {
    t,
    language,
    getAttrName,
    getAttrDesc,
    getHiddenName,
    getHiddenDesc,
    getTraitName,
    getTraitDesc,
  } = useTranslation();
  if (!isOpen) return null;

  const [form, setForm] = useState<Adventurer>({
    ...hero,
    attributes: { ...hero.attributes },
    hidden: { ...hero.hidden },
    traitIds: [...(hero.traitIds || [])],
    equipment: {
      weapon: hero.equipment?.weapon ? { ...hero.equipment.weapon, mods: { ...(hero.equipment.weapon.mods || {}) } } : null,
      armour: hero.equipment?.armour ? { ...hero.equipment.armour, mods: { ...(hero.equipment.armour.mods || {}) } } : null,
      trinket: hero.equipment?.trinket ? { ...hero.equipment.trinket, mods: { ...(hero.equipment.trinket.mods || {}) } } : null,
    },
  });

  const [activeTab, setActiveTab] = useState<
    'attributes' | 'hidden' | 'health' | 'traits' | 'equipment'
  >(initialTab);

  const [traitSearch, setTraitSearch] = useState('');
  const [traitFilter, setTraitFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [statCatFilter, setStatCatFilter] = useState<'all' | 'combat' | 'mental' | 'physical' | 'role'>('all');
  const [customTrait, setCustomTrait] = useState('');
  const [gachaRollCount, setGachaRollCount] = useState(0);
  const [lastGachaMessage, setLastGachaMessage] = useState<string | null>(null);

  // Wonderkid Gacha System: Job-optimized stats, explosive growth & high PA
  const handleGachaWonderkid = () => {
    const rolled = rollWonderkidGacha(form);
    setForm((prev) => ({
      ...prev,
      age: rolled.age,
      level: rolled.level,
      potentialAbility: rolled.potentialAbility,
      currentAbility: rolled.currentAbility,
      attributes: rolled.attributes,
      hidden: rolled.hidden,
      traitIds: rolled.traitIds,
      condition: rolled.condition,
      morale: rolled.morale,
      stress: rolled.stress,
      fatigue: rolled.fatigue,
      injury: null,
    }));
    setGachaRollCount((c) => c + 1);
    setLastGachaMessage(
      `🎲 Roll #${gachaRollCount + 1}: Age ${rolled.age} Wonderkid with PA ${rolled.potentialAbility} and optimized ${form.classId.toUpperCase()} stats!`
    );
  };

  const updateAttr = (key: string, val: number) => {
    setForm((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: val,
      },
    }));
  };

  const updateHidden = (key: string, val: number) => {
    setForm((prev) => ({
      ...prev,
      hidden: {
        ...prev.hidden,
        [key]: val,
      },
    }));
  };

  const maxAllCombatStats = (val: number) => {
    const updatedAttrs = { ...form.attributes };
    COMBAT_ATTRIBUTES.forEach((attr) => {
      (updatedAttrs as any)[attr.key] = val;
    });
    setForm((prev) => ({ ...prev, attributes: updatedAttrs }));
  };

  const fullRestoreHealth = () => {
    setForm((prev) => ({
      ...prev,
      condition: 100,
      morale: 100,
      stress: 0,
      fatigue: 0,
      injury: null,
    }));
  };

  // Trait toggle
  const toggleTrait = (traitId: string) => {
    setForm((prev) => {
      const exists = prev.traitIds?.includes(traitId);
      if (exists) {
        return {
          ...prev,
          traitIds: prev.traitIds.filter((t) => t !== traitId),
        };
      } else {
        return {
          ...prev,
          traitIds: [...(prev.traitIds || []), traitId],
        };
      }
    });
  };

  const addCustomTrait = () => {
    const trimmed = customTrait.trim().toLowerCase().replace(/\s+/g, '-');
    if (trimmed && !form.traitIds?.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        traitIds: [...(prev.traitIds || []), trimmed],
      }));
      setCustomTrait('');
    }
  };

  // Equipment helpers
  const updateEquipment = (
    slot: 'weapon' | 'armour' | 'trinket',
    item: EquipmentItem | null
  ) => {
    setForm((prev) => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [slot]: item,
      },
    }));
  };

  const createDefaultItem = (slot: 'weapon' | 'armour' | 'trinket') => {
    const id = `it_${slot}_${Date.now()}`;
    if (slot === 'weapon') {
      return {
        id,
        name: `${form.classId.toUpperCase()} Relic Blade`,
        slot: 'weapon',
        rarity: 'rare',
        weaponKind: form.role === 'healer' ? 'spell' : 'melee',
        tier: 4,
        quality: 1.25,
        value: 180,
        mods: {
          attackPct: 0.2,
          accuracy: 5,
        },
      } as EquipmentItem;
    }
    if (slot === 'armour') {
      return {
        id,
        name: 'Reinforced Citadel Plate',
        slot: 'armour',
        rarity: 'rare',
        tier: 4,
        quality: 1.25,
        value: 160,
        mods: {
          mitigation: 0.08,
          hpPct: 0.15,
        },
      } as EquipmentItem;
    }
    return {
      id,
      name: 'Pendant of the Deeps',
      slot: 'trinket',
      rarity: 'rare',
      tier: 4,
      quality: 1.25,
      value: 140,
      mods: {
        critChance: 0.05,
        speed: 3,
      },
    } as EquipmentItem;
  };

  const upgradeItemToLegendary = (slot: 'weapon' | 'armour' | 'trinket') => {
    const item = form.equipment?.[slot];
    if (!item) return;
    const upgradedMods = { ...(item.mods || {}) };
    if (slot === 'weapon') {
      upgradedMods.attackPct = 0.35;
      upgradedMods.critChance = 0.15;
      upgradedMods.accuracy = 8;
    } else if (slot === 'armour') {
      upgradedMods.hpPct = 0.3;
      upgradedMods.mitigation = 0.15;
      upgradedMods.healTakenPct = 0.2;
    } else {
      upgradedMods.speed = 5;
      upgradedMods.critDamage = 0.4;
    }

    updateEquipment(slot, {
      ...item,
      rarity: 'legendary',
      tier: 5,
      quality: 2.0,
      value: (item.value || 100) * 3,
      mods: upgradedMods,
    });
  };

  // Filtered trait catalog
  const filteredCatalog = TRAIT_CATALOG.filter((traitItem) => {
    const locName = getTraitName(traitItem.id, traitItem.name).toLowerCase();
    const locDesc = getTraitDesc(traitItem.id, traitItem.desc).toLowerCase();
    const searchLower = traitSearch.toLowerCase();
    const behaviorKeys = traitItem.behaviorEffect ? Object.keys(traitItem.behaviorEffect).join(' ').toLowerCase() : '';
    const tagLower = traitItem.tag ? traitItem.tag.toLowerCase() : '';
    const matchesSearch =
      locName.includes(searchLower) ||
      locDesc.includes(searchLower) ||
      traitItem.name.toLowerCase().includes(searchLower) ||
      traitItem.id.toLowerCase().includes(searchLower) ||
      traitItem.desc.toLowerCase().includes(searchLower) ||
      behaviorKeys.includes(searchLower) ||
      tagLower.includes(searchLower);
    const matchesFilter = traitFilter === 'all' || traitItem.type === traitFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#16131c] border border-[#382b3d] rounded-2xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-[#c9bea9]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#2d2333] bg-[#1a1622] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#2a1e12] border border-[#594426] text-[#dfb15b]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-rpg font-bold text-lg text-[#f0e8db]">
                  {form.name}
                </h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#201a14] text-[#dfb15b] border border-[#443828]">
                  Lv.{form.level}
                </span>
                {form.age <= 19 && form.potentialAbility >= 180 && (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#332410] text-[#f5cb71] border border-[#6e532b] flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#f5cb71] fill-[#f5cb71]" />
                    Wonderkid (PA {form.potentialAbility})
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8e8273] capitalize mt-0.5">
                {form.raceId} • {form.classId} ({form.role}) • {t.ageLabel} {form.age}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Make Wonderkid Button */}
            <Button
              variant="gold"
              size="sm"
              icon={<Dices className="w-4 h-4 text-[#151218]" />}
              onClick={handleGachaWonderkid}
              title={t.makeWonderkidDesc}
            >
              {t.makeWonderkid}
            </Button>

            {/* Full Restore Button */}
            <Button
              variant="emerald"
              size="sm"
              icon={<Heart className="w-3.5 h-3.5" />}
              onClick={fullRestoreHealth}
            >
              {t.fullRestore}
            </Button>

            <button
              onClick={onClose}
              className="p-2 text-[#8e8273] hover:text-[#f0e8db] hover:bg-[#231e2c] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gacha Notification Banner */}
        {lastGachaMessage && (
          <div className="px-6 py-2 bg-[#2d2214] border-b border-[#5e4726] flex items-center justify-between text-xs text-[#f5cb71]">
            <span className="flex items-center gap-2 font-medium">
              <Sparkles className="w-4 h-4 text-[#f5cb71]" />
              {lastGachaMessage}
            </span>
            <button
              onClick={() => setLastGachaMessage(null)}
              className="text-[#8e8273] hover:text-[#f5cb71] ml-2 cursor-pointer font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Identity & Level Top Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 bg-[#1b1723] rounded-xl border border-[#312739]">
            <div>
              <label className="text-[11px] text-[#8e8273] block mb-1">
                {t.delverName}
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#131018] border border-[#3b2e44] rounded px-2.5 py-1 text-xs text-[#f0e8db] font-semibold focus:outline-none focus:border-[#dfb15b]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#8e8273] block mb-1">
                {t.classLabel}
              </label>
              <select
                value={form.classId}
                onChange={(e) => setForm({ ...form, classId: e.target.value })}
                className="w-full bg-[#131018] border border-[#3b2e44] rounded px-2.5 py-1 text-xs text-[#f0e8db] capitalize focus:outline-none focus:border-[#dfb15b]"
              >
                {CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] text-[#8e8273]">
                  {t.race}
                </label>
                <RaceInfoTooltip raceId={form.raceId} />
              </div>
              <select
                value={form.raceId}
                onChange={(e) => setForm({ ...form, raceId: e.target.value })}
                className="w-full bg-[#131018] border border-[#3b2e44] rounded px-2.5 py-1 text-xs text-[#f0e8db] capitalize focus:outline-none focus:border-[#dfb15b]"
              >
                {RACES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-[#8e8273] block mb-1">
                {t.roleLabel}
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full bg-[#131018] border border-[#3b2e44] rounded px-2.5 py-1 text-xs text-[#f0e8db] uppercase focus:outline-none focus:border-[#dfb15b]"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-[#8e8273] block mb-1">
                {t.levelLabel}
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={form.level}
                onChange={(e) =>
                  setForm({ ...form, level: parseInt(e.target.value) || 1 })
                }
                className="w-full bg-[#131018] border border-[#3b2e44] rounded px-2.5 py-1 text-xs text-[#dfb15b] font-mono font-bold focus:outline-none focus:border-[#dfb15b]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#8e8273] block mb-1">
                {t.ageLabel}
              </label>
              <input
                type="number"
                min="16"
                max="120"
                value={form.age}
                onChange={(e) =>
                  setForm({ ...form, age: parseInt(e.target.value) || 18 })
                }
                className="w-full bg-[#131018] border border-[#3b2e44] rounded px-2.5 py-1 text-xs text-[#c9bea9] font-mono focus:outline-none focus:border-[#dfb15b]"
              />
            </div>
          </div>

          {/* CA & PA Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#1b1723] rounded-xl border border-[#312739]">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#c9bea9] font-semibold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#dfb15b]" /> {t.currentAbilityCA}
                </span>
                <span className="font-mono text-[#dfb15b] font-bold">
                  {form.currentAbility} / 200
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="200"
                value={form.currentAbility}
                onChange={(e) =>
                  setForm({
                    ...form,
                    currentAbility: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full accent-[#dfb15b] h-2 bg-[#131018] rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#c9bea9] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#c78ade]" /> {t.potentialAbilityPA}
                </span>
                <span className="font-mono text-[#c78ade] font-bold">
                  {form.potentialAbility} / 200
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="200"
                value={form.potentialAbility}
                onChange={(e) =>
                  setForm({
                    ...form,
                    potentialAbility: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full accent-[#c78ade] h-2 bg-[#131018] rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Subtabs Selector */}
          <div className="flex items-center gap-2 border-b border-[#2d2333] pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('attributes')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'attributes'
                  ? 'bg-[#2f2214] text-[#f5cb71] border border-[#5e4726]'
                  : 'text-[#8e8273] hover:text-[#c9bea9]'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              {t.tab30Combat}
            </button>
            <button
              onClick={() => setActiveTab('hidden')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'hidden'
                  ? 'bg-[#2e1d38] text-[#c78ade] border border-[#552e69]'
                  : 'text-[#8e8273] hover:text-[#c9bea9]'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              {t.tabHidden}
            </button>
            <button
              onClick={() => setActiveTab('traits')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'traits'
                  ? 'bg-[#182638] text-[#86afdf] border border-[#294269]'
                  : 'text-[#8e8273] hover:text-[#c9bea9]'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              {t.tabTraits} ({form.traitIds?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'equipment'
                  ? 'bg-[#143023] text-[#71caa2] border border-[#21573d]'
                  : 'text-[#8e8273] hover:text-[#c9bea9]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              {t.tabGear}
            </button>
            <button
              onClick={() => setActiveTab('health')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'health'
                  ? 'bg-[#3d1822] text-[#e67e8c] border border-[#6e2533]'
                  : 'text-[#8e8273] hover:text-[#c9bea9]'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              {t.tabHealth}
            </button>
          </div>

          {/* Tab 1: 30 Combat Attributes */}
          {activeTab === 'attributes' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(
                    [
                      { id: 'all', label: t.catAll },
                      { id: 'combat', label: t.catCombat },
                      { id: 'mental', label: t.catMental },
                      { id: 'physical', label: t.catPhysical },
                      { id: 'role', label: t.catRole },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setStatCatFilter(cat.id)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        statCatFilter === cat.id
                          ? 'bg-[#2f2214] text-[#f5cb71] border border-[#5e4726]'
                          : 'bg-[#1b1723] text-[#8e8273] hover:text-[#c9bea9] border border-[#2d2333]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="amber"
                    size="sm"
                    className="text-xs"
                    icon={<Dices className="w-3.5 h-3.5" />}
                    onClick={handleGachaWonderkid}
                  >
                    {t.wonderkidRoll}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-xs"
                    onClick={() => maxAllCombatStats(15)}
                  >
                    {t.normalizeStats}
                  </Button>
                  <Button
                    variant="gold"
                    size="sm"
                    className="text-xs font-semibold"
                    icon={<Sparkles className="w-3.5 h-3.5" />}
                    onClick={() => maxAllCombatStats(20)}
                  >
                    {t.maxAll20}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {COMBAT_ATTRIBUTES
                  .filter((attr) => statCatFilter === 'all' || attr.category === statCatFilter)
                  .map((attr) => (
                    <StatSlider
                      key={attr.key}
                      label={getAttrName(attr.key, attr.name)}
                      abbr={attr.abbr}
                      desc={getAttrDesc(attr.key, attr.desc)}
                      value={(form.attributes as any)[attr.key] || 1}
                      isPillar={isClassPillar(form.classId, attr.key)}
                      onChange={(val) => updateAttr(attr.key, val)}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Tab 2: Hidden Attributes */}
          {activeTab === 'hidden' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8e8273]">
                  {t.hiddenAttrDesc}
                </span>
                <Button
                  variant="purple"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const updatedHidden = { ...form.hidden };
                    HIDDEN_ATTRIBUTES.forEach((attr) => {
                      (updatedHidden as any)[attr.key] = 20;
                    });
                    setForm((prev) => ({ ...prev, hidden: updatedHidden }));
                  }}
                >
                  {t.maxAllHidden}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {HIDDEN_ATTRIBUTES.map((attr) => (
                  <StatSlider
                    key={attr.key}
                    label={getHiddenName(attr.key, attr.name)}
                    desc={getHiddenDesc(attr.key, attr.desc)}
                    value={(form.hidden as any)[attr.key] || 1}
                    onChange={(val) => updateHidden(attr.key, val)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Traits & Perks */}
          {activeTab === 'traits' && (
            <div className="space-y-5">
              {/* Currently Equipped Traits */}
              <div className="p-4 bg-[#1b1723] border border-[#312739] rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-[#c9bea9]">
                    {t.equippedTraits} ({form.traitIds?.length || 0})
                  </span>
                  {form.traitIds?.length > 0 && (
                    <button
                      onClick={() => setForm({ ...form, traitIds: [] })}
                      className="text-[11px] text-[#e67e8c] hover:underline cursor-pointer"
                    >
                      {t.clearAllTraits}
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 min-h-[36px]">
                  {form.traitIds?.length === 0 ? (
                    <span className="text-xs text-[#8e8273] italic">
                      {t.noTraitsEquipped}
                    </span>
                  ) : (
                    form.traitIds?.map((traitId) => {
                      const meta = TRAIT_CATALOG.find((x) => x.id === traitId);
                      const traitName = getTraitName(traitId, meta?.name);
                      const traitDesc = getTraitDesc(traitId, meta?.desc);
                      let style = 'bg-[#201a14] text-[#c9bea9] border-[#443828]';
                      let typeBadge = t.traitNeutral;
                      let badgeColor = 'text-[#dfb15b] bg-[#221a11] border-[#4a3a22]';

                      if (meta?.type === 'positive') {
                        style = 'bg-[#143023] text-[#71caa2] border-[#255e42]';
                        typeBadge = t.traitPositive;
                        badgeColor = 'text-[#71caa2] bg-[#122b1e] border-[#1d4d35]';
                      } else if (meta?.type === 'negative') {
                        style = 'bg-[#3d1822] text-[#e67e8c] border-[#6e2533]';
                        typeBadge = t.traitNegative;
                        badgeColor = 'text-[#e67e8c] bg-[#2d1419] border-[#5e222c]';
                      }
                      return (
                        <Tooltip
                          key={traitId}
                          title={traitName}
                          badge={typeBadge}
                          badgeColor={badgeColor}
                          content={traitDesc}
                        >
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium cursor-help ${style}`}
                          >
                            <span>{traitName}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTrait(traitId);
                              }}
                              className="hover:text-[#e67e8c] font-bold ml-1 cursor-pointer"
                              title={t.unequipTrait || 'Remove'}
                            >
                              ×
                            </button>
                          </span>
                        </Tooltip>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Trait Catalog Search & Filter */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-3.5 h-3.5 text-[#8e8273] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={t.searchTraits}
                      value={traitSearch}
                      onChange={(e) => setTraitSearch(e.target.value)}
                      className="w-full bg-[#131018] border border-[#3b2e44] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#f0e8db] placeholder:text-[#6e6355] focus:outline-none focus:border-[#dfb15b]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 text-xs">
                    {(['all', 'positive', 'negative', 'neutral'] as const).map((type) => {
                      const label =
                        type === 'all'
                          ? t.filterAll
                          : type === 'positive'
                          ? t.filterPositive
                          : type === 'negative'
                          ? t.filterNegative
                          : t.filterNeutral;
                      return (
                        <button
                          key={type}
                          onClick={() => setTraitFilter(type)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase cursor-pointer transition-colors ${
                            traitFilter === type
                              ? 'bg-[#2d2214] text-[#dfb15b] border border-[#594426]'
                              : 'bg-[#201a14] text-[#8e8273] hover:text-[#c9bea9]'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Trait Catalog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
                  {filteredCatalog.map((traitItem) => {
                    const isEquipped = form.traitIds?.includes(traitItem.id);
                    const traitName = getTraitName(traitItem.id, traitItem.name);
                    const traitDesc = getTraitDesc(traitItem.id, traitItem.desc);
                    let borderClass = 'border-[#2d2333] hover:border-[#473850] bg-[#1a1622]';
                    let typeBadge = 'bg-[#201a14] text-[#8e8273] border-[#443828]';

                    if (traitItem.type === 'positive') {
                      typeBadge = 'bg-[#143023] text-[#71caa2] border-[#255e42]';
                    } else if (traitItem.type === 'negative') {
                      typeBadge = 'bg-[#3d1822] text-[#e67e8c] border-[#6e2533]';
                    }

                    if (isEquipped) {
                      borderClass = 'border-[#dfb15b]/60 bg-[#2d2214] shadow-sm';
                    }

                    return (
                      <button
                        key={traitItem.id}
                        onClick={() => toggleTrait(traitItem.id)}
                        className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${borderClass}`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-semibold text-xs text-[#f0e8db] truncate">
                              {traitName}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              {traitItem.tag && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-[#2a2233] text-[#c2b6cb] font-mono">
                                  {traitItem.tag}
                                </span>
                              )}
                              <span
                                className={`text-[9px] uppercase px-1.5 py-0.2 rounded border font-sans font-bold ${typeBadge}`}
                              >
                                {traitItem.type === 'positive'
                                  ? t.filterPositive
                                  : traitItem.type === 'negative'
                                  ? t.filterNegative
                                  : t.filterNeutral}
                              </span>
                              {isEquipped && (
                                <Check className="w-3.5 h-3.5 text-[#dfb15b] shrink-0" />
                              )}
                            </div>
                          </div>
                          <p className="text-[11px] text-[#8e8273] line-clamp-2 leading-relaxed">
                            {traitDesc}
                          </p>

                          {/* Combat AI parameters badge chips */}
                          {traitItem.behaviorEffect && (
                            <div className="mt-1.5 pt-1.5 border-t border-[#2b2438]/50 flex flex-wrap gap-1">
                              {Object.entries(traitItem.behaviorEffect).map(([k, v]) => {
                                const pct = Math.round(v * 100);
                                const isPos = pct > 0;
                                return (
                                  <span
                                    key={k}
                                    className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                                      isPos
                                        ? 'bg-[#22c55e]/15 text-[#4ade80]'
                                        : 'bg-[#ef4444]/15 text-[#f87171]'
                                    }`}
                                  >
                                    {k}: {pct > 0 ? `+${pct}%` : `${pct}%`}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Trait Input */}
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={t.customTraitPlaceholder}
                    value={customTrait}
                    onChange={(e) => setCustomTrait(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomTrait()}
                    className="flex-1 bg-[#131018] border border-[#3b2e44] rounded-lg px-3 py-1.5 text-xs text-[#f0e8db] focus:outline-none focus:border-[#dfb15b]"
                  />
                  <Button variant="secondary" size="sm" onClick={addCustomTrait}>
                    {t.addCustomTrait}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Equipped Gear Editor */}
          {activeTab === 'equipment' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8e8273]">
                  {t.gearDesc}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['weapon', 'armour', 'trinket'] as const).map((slot) => {
                  const item = form.equipment?.[slot];
                  const slotLabel =
                    slot === 'weapon'
                      ? t.weapon
                      : slot === 'armour'
                      ? t.armour
                      : t.trinket;
                  return (
                    <div
                      key={slot}
                      className="bg-[#1b1723] border border-[#312739] rounded-xl p-4 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        {/* Slot Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-[#2d2333]">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#c9bea9] flex items-center gap-1.5">
                            {slot === 'weapon' ? (
                              <Swords className="w-4 h-4 text-[#e67e8c]" />
                            ) : slot === 'armour' ? (
                              <Shield className="w-4 h-4 text-[#86afdf]" />
                            ) : (
                              <Package className="w-4 h-4 text-[#dfb15b]" />
                            )}
                            {slotLabel}
                          </span>
                          {item && (
                            <Badge variant="rarity">{item.rarity || 'common'}</Badge>
                          )}
                        </div>

                        {!item ? (
                          <div className="py-8 text-center text-xs text-[#8e8273] italic space-y-2">
                            <p>{t.noGearEquipped}</p>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="text-xs"
                              icon={<Plus className="w-3 h-3" />}
                              onClick={() =>
                                updateEquipment(slot, createDefaultItem(slot))
                              }
                            >
                              {t.equipSlot}
                            </Button>
                          </div>
                        ) : (
                          <div className="mt-3 space-y-3 text-xs">
                            {/* Item Name */}
                            <div>
                              <label className="text-[10px] text-[#8e8273] block mb-1">
                                {t.itemName}
                              </label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) =>
                                  updateEquipment(slot, {
                                    ...item,
                                    name: e.target.value,
                                  })
                                }
                                className="w-full bg-[#131018] border border-[#3b2e44] rounded px-2.5 py-1 text-[#f0e8db] font-semibold focus:outline-none focus:border-[#dfb15b]"
                              />
                            </div>

                            {/* Rarity & Tier */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-[#8e8273] block mb-1">
                                  {t.rarity}
                                </label>
                                <select
                                  value={item.rarity}
                                  onChange={(e) =>
                                    updateEquipment(slot, {
                                      ...item,
                                      rarity: e.target.value,
                                    })
                                  }
                                  className="w-full bg-[#131018] border border-[#3b2e44] rounded px-2.5 py-1 text-[#c9bea9] capitalize focus:outline-none"
                                >
                                  {RARITIES.map((r) => (
                                    <option key={r} value={r}>
                                      {r}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="text-[10px] text-[#8e8273] block mb-1">
                                  {t.tier}
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={item.tier || 1}
                                  onChange={(e) =>
                                    updateEquipment(slot, {
                                      ...item,
                                      tier: parseInt(e.target.value) || 1,
                                    })
                                  }
                                  className="w-full bg-[#131018] border border-[#3b2e44] rounded px-2.5 py-1 text-[#dfb15b] font-mono font-bold focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Quality & Value */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-[#8e8273] block mb-1">
                                  {t.quality}
                                </label>
                                <input
                                  type="number"
                                  step="0.05"
                                  min="0.5"
                                  max="5.0"
                                  value={item.quality || 1.0}
                                  onChange={(e) =>
                                    updateEquipment(slot, {
                                      ...item,
                                      quality: parseFloat(e.target.value) || 1.0,
                                    })
                                  }
                                  className="w-full bg-[#131018] border border-[#3b2e44] rounded px-2.5 py-1 text-[#c9bea9] font-mono focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-[#8e8273] block mb-1">
                                  {t.goldValue}
                                </label>
                                <input
                                  type="number"
                                  value={item.value || 0}
                                  onChange={(e) =>
                                    updateEquipment(slot, {
                                      ...item,
                                      value: parseInt(e.target.value) || 0,
                                    })
                                  }
                                  className="w-full bg-[#131018] border border-[#3b2e44] rounded px-2.5 py-1 text-[#dfb15b] font-mono focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Affixes / Mods */}
                            <div className="pt-2 border-t border-[#2d2333] space-y-1.5">
                              <span className="text-[10px] font-semibold text-[#8e8273] uppercase block">
                                {t.affixMods}
                              </span>
                              {item.mods &&
                                Object.entries(item.mods).map(([k, v]) => (
                                  <div
                                    key={k}
                                    className="flex items-center justify-between text-[11px] font-mono"
                                  >
                                    <span className="text-[#71caa2]">+{k}:</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      value={v}
                                      onChange={(e) => {
                                        const parsed = parseFloat(e.target.value) || 0;
                                        updateEquipment(slot, {
                                          ...item,
                                          mods: {
                                            ...item.mods,
                                            [k]: parsed,
                                          },
                                        });
                                      }}
                                      className="w-16 bg-[#131018] border border-[#3b2e44] rounded px-1.5 py-0.5 text-right text-[#71caa2] font-bold focus:outline-none"
                                    />
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {item && (
                        <div className="pt-3 border-t border-[#2d2333] flex items-center justify-between gap-1">
                          <Button
                            variant="amber"
                            size="sm"
                            className="text-[11px] px-2 py-1"
                            onClick={() => upgradeItemToLegendary(slot)}
                          >
                            {t.maxLegendary}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="text-[11px] px-2 py-1"
                            onClick={() => updateEquipment(slot, null)}
                          >
                            {t.unequip}
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 5: Health & Morale */}
          {activeTab === 'health' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1b1723] p-4 rounded-xl border border-[#312739] space-y-4">
                <h3 className="text-sm font-semibold text-[#f0e8db] flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#71caa2]" />
                  {t.healthSectionTitle}
                </h3>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#8e8273]">{t.conditionLabel}</span>
                    <span className="font-mono text-[#71caa2] font-bold">
                      {form.condition}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.condition}
                    onChange={(e) =>
                      setForm({ ...form, condition: parseInt(e.target.value) || 0 })
                    }
                    className="w-full accent-[#71caa2] h-2 bg-[#131018] rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#8e8273]">{t.moraleLabel}</span>
                    <span className="font-mono text-[#dfb15b] font-bold">
                      {form.morale}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.morale}
                    onChange={(e) =>
                      setForm({ ...form, morale: parseInt(e.target.value) || 0 })
                    }
                    className="w-full accent-[#dfb15b] h-2 bg-[#131018] rounded-lg cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] text-[#8e8273] block mb-1">
                      {t.stressLabel}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={form.stress || 0}
                      onChange={(e) =>
                        setForm({ ...form, stress: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-[#131018] border border-[#3b2e44] rounded px-2.5 py-1 text-xs text-[#f0e8db] font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#8e8273] block mb-1">
                      {t.fatigueLabel}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={form.fatigue || 0}
                      onChange={(e) =>
                        setForm({ ...form, fatigue: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-[#131018] border border-[#3b2e44] rounded px-2.5 py-1 text-xs text-[#f0e8db] font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Injury state */}
              <div className="bg-[#1b1723] p-4 rounded-xl border border-[#312739] space-y-4">
                <h3 className="text-sm font-semibold text-[#f0e8db] flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[#e67e8c]" />
                  {t.injuryStatus}
                </h3>

                <div className="p-3 rounded-lg bg-[#131018] border border-[#2d2333]">
                  {form.injury ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#e67e8c]">
                        <span className="font-semibold uppercase">{t.currentlyInjured}</span>
                        <Button
                          variant="emerald"
                          size="sm"
                          className="text-xs"
                          onClick={() => setForm({ ...form, injury: null })}
                        >
                          {t.cureInjury}
                        </Button>
                      </div>
                      <p className="text-xs text-[#8e8273]">
                        Injury data: {JSON.stringify(form.injury)}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-[#71caa2] text-xs font-medium">
                      {t.noInjuries}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#2d2333] bg-[#1a1622] flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button
            variant="gold"
            size="md"
            onClick={() => {
              onSave(form);
              onClose();
            }}
          >
            {t.saveDelver}
          </Button>
        </div>
      </div>
    </div>
  );
};
