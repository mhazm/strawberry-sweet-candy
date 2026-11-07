import React, { useState } from 'react';
import {
  X,
  Hammer,
  Sparkles,
  Shield,
  Swords,
  Gem,
  Plus,
  Trash2,
  Info,
} from 'lucide-react';
import { EquipmentItem } from '../../types/savegame';
import {
  EQUIPMENT_TEMPLATES,
  EquipmentTemplate,
  ItemRarity,
  QUALITY_BANDS,
  QualityBandId,
  RARITY_CONFIGS,
  calculateEquipmentStats,
  calculateItemValue,
  forgeItem,
} from '../../lib/equipment';
import { useTranslation } from '../../lib/i18n';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tooltip } from '../ui/Tooltip';

interface EquipmentForgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onForge: (item: EquipmentItem) => void;
}

export const EquipmentForgeModal: React.FC<EquipmentForgeModalProps> = ({
  isOpen,
  onClose,
  onForge,
}) => {
  const { t } = useTranslation();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    EQUIPMENT_TEMPLATES[0].id
  );
  const [customName, setCustomName] = useState<string>('');
  const [selectedRarity, setSelectedRarity] = useState<ItemRarity>('legendary');
  const [selectedBand, setSelectedBand] = useState<QualityBandId>('sovereign');
  const [tier, setTier] = useState<number>(5);
  const [customSlot, setCustomSlot] = useState<'weapon' | 'armour' | 'trinket'>('weapon');
  const [customWeaponKind, setCustomWeaponKind] = useState<'melee' | 'ranged' | 'spell'>('melee');
  const [counterCondition, setCounterCondition] = useState<string>('none');
  const [grantsTrait, setGrantsTrait] = useState<string>('none');
  const [customMods, setCustomMods] = useState<Array<{ key: string; value: number }>>([]);
  const [newModKey, setNewModKey] = useState<string>('attackPct');
  const [newModVal, setNewModVal] = useState<number>(0.2);

  if (!isOpen) return null;

  const currentTemplate = EQUIPMENT_TEMPLATES.find(
    (tmpl) => tmpl.id === selectedTemplateId
  );

  const qualityConfig = QUALITY_BANDS[selectedBand];
  const rarityConfig = RARITY_CONFIGS[selectedRarity];

  // Compute stats preview
  let previewMods: Record<string, number> = {};
  if (currentTemplate) {
    previewMods = calculateEquipmentStats(
      currentTemplate,
      selectedRarity,
      qualityConfig.multiplier,
      tier
    );
  }

  // Merge in custom extra mods
  customMods.forEach((cm) => {
    if (cm.key) {
      previewMods[cm.key] = cm.value;
    }
  });

  const previewValue = calculateItemValue(
    selectedRarity,
    tier,
    qualityConfig.multiplier
  );

  const handleTemplateChange = (tmplId: string) => {
    setSelectedTemplateId(tmplId);
    const tmpl = EQUIPMENT_TEMPLATES.find((x) => x.id === tmplId);
    if (tmpl) {
      setCustomName(tmpl.names[0]);
      setCustomSlot(tmpl.slot);
      if (tmpl.weaponKind) setCustomWeaponKind(tmpl.weaponKind);
      if (tmpl.counters) setCounterCondition(tmpl.counters);
      else setCounterCondition('none');
      if (tmpl.grantsTrait) setGrantsTrait(tmpl.grantsTrait);
      else setGrantsTrait('none');
      if (tmpl.minRarity && (selectedRarity === 'common' || selectedRarity === 'rare')) {
        setSelectedRarity(tmpl.minRarity);
      }
    }
  };

  const handleAddCustomMod = () => {
    if (!newModKey) return;
    setCustomMods((prev) => [...prev, { key: newModKey, value: newModVal }]);
  };

  const handleRemoveCustomMod = (index: number) => {
    setCustomMods((prev) => prev.filter((_, i) => i !== index));
  };

  const handleForge = () => {
    const finalItemName =
      customName.trim() ||
      (currentTemplate
        ? currentTemplate.names[0]
        : 'Forged Masterpiece');

    const item: EquipmentItem = {
      id: `it_forge_${Date.now()}_${Math.floor(Math.random() * 99999)}`,
      name: finalItemName,
      slot: currentTemplate ? currentTemplate.slot : customSlot,
      rarity: selectedRarity,
      mods: { ...previewMods },
      tier,
      quality: qualityConfig.multiplier,
      value: previewValue,
    };

    if (item.slot === 'weapon') {
      item.weaponKind = currentTemplate?.weaponKind || customWeaponKind;
    }

    if (counterCondition && counterCondition !== 'none') {
      item.counters = counterCondition;
    }

    if (grantsTrait && grantsTrait !== 'none') {
      item.grantsTrait = grantsTrait;
    }

    onForge(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#141018] border border-[#3b2e47] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#c9bea9]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2e2338] bg-[#1a1520] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#2a1d12] border border-[#5e4726] text-[#dfb15b]">
              <Hammer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-rpg text-base font-bold text-[#f0e8db] flex items-center gap-2">
                {t.forgeModalTitle}
                <Sparkles className="w-4 h-4 text-[#dfb15b]" />
              </h3>
              <p className="text-xs text-[#8e8273]">
                {t.forgeModalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8e8273] hover:text-[#f0e8db] hover:bg-[#251e2e] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Row 1: Archetype / Line Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#dfb15b] block">
              {t.selectTemplate}
            </label>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full bg-[#1b1622] border border-[#382b45] rounded-lg px-3 py-2 text-[#f0e8db] font-medium focus:outline-none focus:border-[#dfb15b]"
            >
              <optgroup label="⚔️ Official Weapons">
                {EQUIPMENT_TEMPLATES.filter((tmpl) => tmpl.category === 'weapon').map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.names[0]} ({tmpl.weaponKind || 'weapon'})
                  </option>
                ))}
              </optgroup>
              <optgroup label="✨ Mythic & Relic Weapons (Grants Trait)">
                {EQUIPMENT_TEMPLATES.filter((tmpl) => tmpl.category === 'relic' && tmpl.slot === 'weapon').map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.names[0]} ({tmpl.grantsTrait ? `Grants: ${tmpl.grantsTrait}` : ''})
                  </option>
                ))}
              </optgroup>
              <optgroup label="🛡️ Official Armours">
                {EQUIPMENT_TEMPLATES.filter((tmpl) => tmpl.category === 'armour').map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.names[0]}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🌊 Environmental Counter Armours">
                {EQUIPMENT_TEMPLATES.filter((tmpl) => tmpl.category === 'counter' && tmpl.slot === 'armour').map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.names[0]} (Counters: {tmpl.counters})
                  </option>
                ))}
              </optgroup>
              <optgroup label="🛡️ Relic Armour">
                {EQUIPMENT_TEMPLATES.filter((tmpl) => tmpl.category === 'relic' && tmpl.slot === 'armour').map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.names[0]} (Grants: {tmpl.grantsTrait})
                  </option>
                ))}
              </optgroup>
              <optgroup label="💍 Official Trinkets">
                {EQUIPMENT_TEMPLATES.filter((tmpl) => tmpl.category === 'trinket').map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.names[0]}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🔥 Environmental Counter Trinkets">
                {EQUIPMENT_TEMPLATES.filter((tmpl) => tmpl.category === 'counter' && tmpl.slot === 'trinket').map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.names[0]} (Counters: {tmpl.counters})
                  </option>
                ))}
              </optgroup>
              <optgroup label="👑 Relic Trinkets (Grants Trait)">
                {EQUIPMENT_TEMPLATES.filter((tmpl) => tmpl.category === 'relic' && tmpl.slot === 'trinket').map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.names[0]} (Grants: {tmpl.grantsTrait})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Row 2: Item Name & Slot */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[11px] font-semibold text-[#8e8273]">
                {t.itemName}
              </label>
              <input
                type="text"
                value={customName}
                placeholder={currentTemplate?.names[0] || 'Equipment Name'}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-[#1b1622] border border-[#382b45] rounded-lg px-3 py-1.5 text-[#f0e8db] font-medium focus:outline-none focus:border-[#dfb15b]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#8e8273]">
                {t.tier} (1 - 5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={tier}
                onChange={(e) => setTier(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
                className="w-full bg-[#1b1622] border border-[#382b45] rounded-lg px-3 py-1.5 text-[#dfb15b] font-mono font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* Row 3: Rarity Selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#8e8273]">
              {t.selectRarity}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['common', 'rare', 'mythic', 'legendary'] as ItemRarity[]).map((r) => {
                const conf = RARITY_CONFIGS[r];
                const isSelected = selectedRarity === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRarity(r)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-[#dfb15b] bg-[#271d18] shadow-md'
                        : 'border-[#2e2338] bg-[#17131d] hover:border-[#4d3b5d]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold capitalize" style={{ color: conf.color }}>
                        {r}
                      </span>
                      <span className="text-[10px] text-[#695d4e] font-mono">
                        {conf.dropRate}
                      </span>
                    </div>
                    <div className="mt-1 text-[10px] text-[#8e8273] font-mono">
                      pct: +{(conf.pct * 100).toFixed(0)}% · flat: +{(conf.flat * 100).toFixed(0)}%
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Quality Band Selection (Official Multipliers) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#8e8273] flex items-center gap-1.5">
                {t.selectQualityBand}
                <Tooltip content="Only legendaries naturally roll quality. Cursed (-1.0x) inverts all bonuses into debuffs; Sovereign (1.8x) is the 1-in-20,000 pinnacle drop.">
                  <Info className="w-3.5 h-3.5 text-[#8e8273] cursor-pointer" />
                </Tooltip>
              </label>
              <span className="text-[10px] text-[#dfb15b] font-mono font-bold">
                {qualityConfig.label} ({qualityConfig.multiplier > 0 ? `+${(qualityConfig.multiplier * 100).toFixed(0)}%` : `${(qualityConfig.multiplier * 100).toFixed(0)}%`} · {qualityConfig.overallDrop})
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
              {(Object.keys(QUALITY_BANDS) as QualityBandId[]).map((bandId) => {
                const b = QUALITY_BANDS[bandId];
                const isSelected = selectedBand === bandId;
                return (
                  <button
                    key={bandId}
                    type="button"
                    onClick={() => setSelectedBand(bandId)}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'border-[#dfb15b] bg-[#2a2015] shadow-sm'
                        : 'border-[#271f30] bg-[#15111a] hover:border-[#423252]'
                    }`}
                  >
                    <div className="font-bold text-[11px]" style={{ color: b.color }}>
                      {b.label}
                    </div>
                    <div className="text-[10px] text-[#dfb15b] font-mono font-semibold">
                      x{b.multiplier}
                    </div>
                    <div className="text-[9px] text-[#695d4e]">
                      {b.odds}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 5: Environmental Counter & Relic Trait Attachments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#241c2c]">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#8e8273]">
                {t.selectConditionCounter}
              </label>
              <select
                value={counterCondition}
                onChange={(e) => setCounterCondition(e.target.value)}
                className="w-full bg-[#1b1622] border border-[#382b45] rounded-lg px-2.5 py-1.5 text-[#f0e8db] font-medium focus:outline-none"
              >
                <option value="none">None</option>
                <option value="flooded">Flooded (Waterlogged Delves)</option>
                <option value="darkness">Pitch Dark (Light / Lanterns)</option>
                <option value="cursed">Cursed Ground (Ward Charms)</option>
                <option value="deepcold">Deep Cold (Furred Mantles)</option>
                <option value="infernal">Infernal Heat (Cooling Satchels)</option>
                <option value="frozen">Numbing Frost (Barkweave / Insulation)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#8e8273]">
                {t.selectGrantsTrait}
              </label>
              <select
                value={grantsTrait}
                onChange={(e) => setGrantsTrait(e.target.value)}
                className="w-full bg-[#1b1622] border border-[#382b45] rounded-lg px-2.5 py-1.5 text-[#f0e8db] font-medium focus:outline-none"
              >
                <option value="none">None (Standard Gear)</option>
                <option value="lone-wolf">Lone Wolf (Relic Weapon)</option>
                <option value="reckless">Reckless (Relic Weapon)</option>
                <option value="stalwart">Stalwart (Relic Armour)</option>
                <option value="brave">Brave (Banner of Valour)</option>
                <option value="iron-willed">Iron-Willed (Sage's Circlet)</option>
                <option value="arrogant">Arrogant (Crown of Hubris)</option>
                <option value="greedy">Greedy (Hungering Coffer)</option>
              </select>
            </div>
          </div>

          {/* Row 6: Live Stats Computed Preview */}
          <div className="p-3.5 rounded-xl bg-[#17131d] border border-[#2e2338] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#dfb15b] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {t.previewAffixes}
              </span>
              <span className="text-[11px] font-mono text-[#f5cb71] font-bold">
                Value: {previewValue.toLocaleString()}g
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(previewMods).map(([stat, val]) => (
                <div
                  key={stat}
                  className="px-2.5 py-1.5 rounded-lg bg-[#110e16] border border-[#271f30] flex items-center justify-between font-mono text-xs"
                >
                  <span className="text-[#a89c8a]">{stat}:</span>
                  <span
                    className={`font-bold ${
                      val >= 0 ? 'text-[#71caa2]' : 'text-[#e67e8c]'
                    }`}
                  >
                    {typeof val === 'number' && Math.abs(val) <= 1
                      ? `${val >= 0 ? '+' : ''}${(val * 100).toFixed(1)}%`
                      : `${val >= 0 ? '+' : ''}${val}`}
                  </span>
                </div>
              ))}
            </div>

            {/* Custom Mod Line Adder */}
            <div className="pt-2 border-t border-[#271f30] flex items-center gap-2 flex-wrap">
              <input
                type="text"
                placeholder="Custom mod key (e.g. speed)"
                value={newModKey}
                onChange={(e) => setNewModKey(e.target.value)}
                className="w-36 bg-[#110e16] border border-[#382b45] rounded px-2 py-1 text-xs text-[#f0e8db] font-mono focus:outline-none"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Value"
                value={newModVal}
                onChange={(e) => setNewModVal(parseFloat(e.target.value) || 0)}
                className="w-20 bg-[#110e16] border border-[#382b45] rounded px-2 py-1 text-xs text-[#71caa2] font-mono font-bold focus:outline-none"
              />
              <Button
                variant="secondary"
                size="sm"
                className="text-xs px-2.5 py-1"
                icon={<Plus className="w-3 h-3" />}
                onClick={handleAddCustomMod}
              >
                {t.addModLine}
              </Button>
            </div>

            {/* Added custom mods list */}
            {customMods.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {customMods.map((cm, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#201827] text-[#c9bea9] border border-[#3b2e47] text-[11px] font-mono"
                  >
                    <span>{cm.key}: {cm.value}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomMod(idx)}
                      className="text-[#e67e8c] hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#2e2338] bg-[#1a1520] flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            {t.cancelBtn}
          </Button>
          <Button
            variant="gold"
            size="sm"
            icon={<Hammer className="w-4 h-4 text-[#151218]" />}
            onClick={handleForge}
          >
            {t.forgeActionBtn}
          </Button>
        </div>
      </div>
    </div>
  );
};

