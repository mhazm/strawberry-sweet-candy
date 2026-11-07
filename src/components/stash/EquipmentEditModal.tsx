import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Trash2, Plus, Info, Zap } from 'lucide-react';
import { EquipmentItem } from '../../types/savegame';
import {
  ItemRarity,
  QUALITY_BANDS,
  QualityBandId,
  RARITY_CONFIGS,
  SUPPORTED_MODIFIERS,
  STAT_PRESETS,
  getQualityBandFromMultiplier,
  getModifierDefinition,
  formatModifierDisplay,
} from '../../lib/equipment';
import { useTranslation } from '../../lib/i18n';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';

interface EquipmentEditModalProps {
  item: EquipmentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: EquipmentItem) => void;
}

export const EquipmentEditModal: React.FC<EquipmentEditModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();

  if (!isOpen || !item) return null;

  const [name, setName] = useState<string>(item.name);
  const [rarity, setRarity] = useState<string>(item.rarity || 'common');
  const [tier, setTier] = useState<number>(item.tier || 1);
  const [quality, setQuality] = useState<number>(item.quality ?? 1.0);
  const [value, setValue] = useState<number>(item.value || 0);
  const [counters, setCounters] = useState<string>(item.counters || 'none');
  const [grantsTrait, setGrantsTrait] = useState<string>(item.grantsTrait || 'none');
  const [mods, setMods] = useState<Record<string, number>>({ ...(item.mods || {}) });

  // Add stat state
  const [selectedModKey, setSelectedModKey] = useState<string>('attackPct');
  const [customKeyText, setCustomKeyText] = useState<string>('');
  const [modValInput, setModValInput] = useState<number>(0.25);

  const currentBand = getQualityBandFromMultiplier(quality);

  useEffect(() => {
    if (selectedModKey === '__custom__') {
      setModValInput(0.2);
    } else {
      const def = getModifierDefinition(selectedModKey);
      setModValInput(def.defaultVal);
    }
  }, [selectedModKey]);

  const handleBandSelect = (bandId: QualityBandId) => {
    const band = QUALITY_BANDS[bandId];
    setQuality(band.multiplier);
  };

  const handleModChange = (key: string, val: number) => {
    setMods((prev) => ({ ...prev, [key]: val }));
  };

  const handleRemoveMod = (key: string) => {
    setMods((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleApplyPreset = (presetMods: Record<string, number>) => {
    const scaled: Record<string, number> = {};
    const mult = Math.max(0.5, quality);
    for (const [k, v] of Object.entries(presetMods)) {
      const def = getModifierDefinition(k);
      if (def.isPct) {
        scaled[k] = Math.round(v * mult * 1000) / 1000;
      } else {
        scaled[k] = Math.round(v * mult);
      }
    }
    setMods(scaled);
  };

  const handleAddMod = () => {
    const finalKey =
      selectedModKey === '__custom__' ? customKeyText.trim() : selectedModKey;
    if (!finalKey) return;
    setMods((prev) => ({ ...prev, [finalKey]: modValInput }));
    if (selectedModKey === '__custom__') setCustomKeyText('');
  };

  const handleSave = () => {
    const updated: EquipmentItem = {
      ...item,
      name: name.trim() || item.name,
      rarity,
      tier,
      quality,
      value,
      mods: { ...mods },
    };

    if (counters && counters !== 'none') {
      updated.counters = counters;
    } else {
      delete updated.counters;
    }

    if (grantsTrait && grantsTrait !== 'none') {
      updated.grantsTrait = grantsTrait;
    } else {
      delete updated.grantsTrait;
    }

    onSave(updated);
    onClose();
  };

  const activeDef =
    selectedModKey !== '__custom__'
      ? getModifierDefinition(selectedModKey)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#141018] border border-[#3b2e47] rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#c9bea9]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2e2338] bg-[#1a1520] flex items-center justify-between">
          <div>
            <h3 className="font-rpg text-base font-bold text-[#f0e8db] flex items-center gap-2">
              {t.editModalTitle}
              <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-[#201827] text-[#dfb15b] border border-[#3b2e47]">
                {item.slot}
              </span>
            </h3>
            <p className="text-xs text-[#8e8273]">
              {item.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8e8273] hover:text-[#f0e8db] hover:bg-[#251e2e] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Item Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#8e8273]">
              {t.itemName}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1b1622] border border-[#382b45] rounded-lg px-3 py-1.5 text-[#f0e8db] font-medium focus:outline-none focus:border-[#dfb15b]"
            />
          </div>

          {/* Rarity & Tier */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#8e8273]">
                {t.selectRarity}
              </label>
              <select
                value={rarity}
                onChange={(e) => setRarity(e.target.value)}
                className="w-full bg-[#1b1622] border border-[#382b45] rounded-lg px-2.5 py-1.5 text-[#f0e8db] font-medium focus:outline-none capitalize"
              >
                <option value="common">Common (80%)</option>
                <option value="rare">Rare (16%)</option>
                <option value="mythic">Mythic (3.5%)</option>
                <option value="legendary">Legendary (0.5%)</option>
              </select>
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
                className="w-full bg-[#1b1622] border border-[#382b45] rounded-lg px-2.5 py-1.5 text-[#dfb15b] font-mono font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* Quality Bands */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#8e8273]">
                {t.qualityBandLabel}: <span style={{ color: currentBand.color }} className="font-bold">{currentBand.label} (x{quality})</span>
              </label>
              <span className="text-[10px] text-[#695d4e]">
                {currentBand.odds} roll odds ({currentBand.overallDrop})
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
              {(Object.keys(QUALITY_BANDS) as QualityBandId[]).map((bandId) => {
                const b = QUALITY_BANDS[bandId];
                const isSelected = currentBand.id === bandId;
                return (
                  <button
                    key={bandId}
                    type="button"
                    onClick={() => handleBandSelect(bandId)}
                    className={`p-1.5 rounded border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#dfb15b] bg-[#2a2015]'
                        : 'border-[#271f30] bg-[#15111a] hover:border-[#423252]'
                    }`}
                  >
                    <div className="text-[10px] font-bold" style={{ color: b.color }}>
                      {b.label}
                    </div>
                    <div className="text-[9px] text-[#dfb15b] font-mono">
                      x{b.multiplier}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Environmental Counter & Relic Trait */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#8e8273]">
                {t.selectConditionCounter}
              </label>
              <select
                value={counters}
                onChange={(e) => setCounters(e.target.value)}
                className="w-full bg-[#1b1622] border border-[#382b45] rounded-lg px-2.5 py-1.5 text-[#f0e8db] font-medium focus:outline-none"
              >
                <option value="none">None</option>
                <option value="flooded">Flooded</option>
                <option value="darkness">Pitch Dark</option>
                <option value="cursed">Cursed Ground</option>
                <option value="deepcold">Deep Cold</option>
                <option value="infernal">Infernal Heat</option>
                <option value="frozen">Numbing Frost</option>
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
                <option value="none">None</option>
                <option value="lone-wolf">Lone Wolf</option>
                <option value="reckless">Reckless</option>
                <option value="stalwart">Stalwart</option>
                <option value="brave">Brave</option>
                <option value="iron-willed">Iron-Willed</option>
                <option value="arrogant">Arrogant</option>
                <option value="greedy">Greedy</option>
              </select>
            </div>
          </div>

          {/* Value in Gold */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#8e8273]">
              {t.goldValue} (g)
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(parseInt(e.target.value) || 0)}
              className="w-full bg-[#1b1622] border border-[#382b45] rounded-lg px-2.5 py-1.5 text-[#f5cb71] font-mono font-bold focus:outline-none"
            />
          </div>

          {/* Combat Modifiers Section */}
          <div className="p-3.5 rounded-xl bg-[#17131d] border border-[#2e2338] space-y-3">
            <div className="flex items-center justify-between border-b border-[#271f30] pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#dfb15b] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {t.affixMods}
              </span>
            </div>

            {/* Quick Stat Presets */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#695d4e] flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#dfb15b]" />
                {t.statPresetsTitle}
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {STAT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset.mods)}
                    className="px-2 py-0.5 rounded border border-[#3b2e47] bg-[#1d1626] hover:bg-[#2b1f38] hover:border-[#dfb15b] text-[#f0e8db] text-[10px] font-medium flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Modifiers List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(mods).map(([k, v]) => {
                const def = getModifierDefinition(k);
                return (
                  <div
                    key={k}
                    className="p-2.5 rounded-lg bg-[#110e16] border border-[#271f30] flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1 truncate">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-[#f0e8db] font-semibold text-xs truncate">
                          {def.name}
                        </span>
                        <span className="text-[9px] font-mono text-[#695d4e] px-1 rounded bg-[#18131f] border border-[#261f2e]">
                          {k}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#7a6f60] truncate">{def.description}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <input
                        type="number"
                        step={def.isPct ? 0.01 : 1}
                        value={v}
                        onChange={(e) =>
                          handleModChange(k, parseFloat(e.target.value) || 0)
                        }
                        className={`w-20 bg-[#18131f] border border-[#3b2e47] rounded px-2 py-1 text-right font-mono font-bold text-xs focus:outline-none focus:border-[#dfb15b] ${
                          v >= 0 ? 'text-[#71caa2]' : 'text-[#e67e8c]'
                        }`}
                      />
                      <span className="text-[10px] font-mono font-bold text-[#dfb15b] w-12 text-right">
                        {formatModifierDisplay(k, v)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMod(k)}
                        className="text-[#e67e8c] hover:text-red-400 p-1 rounded"
                        title="Delete stat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Stat Control */}
            <div className="pt-2 border-t border-[#271f30] space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-[#695d4e] block">
                {t.addModLine}
              </span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <select
                  value={selectedModKey}
                  onChange={(e) => setSelectedModKey(e.target.value)}
                  className="flex-1 bg-[#110e16] border border-[#382b45] rounded-lg px-2.5 py-1.5 text-xs text-[#f0e8db] font-medium focus:outline-none focus:border-[#dfb15b]"
                >
                  <optgroup label="⚔️ Offensive Stats">
                    {SUPPORTED_MODIFIERS.filter((m) => m.category === 'offensive').map((m) => (
                      <option key={m.key} value={m.key}>
                        {m.name} ({m.key}) — {m.isPct ? '+%' : '+Flat'}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🛡️ Defensive Stats">
                    {SUPPORTED_MODIFIERS.filter((m) => m.category === 'defensive').map((m) => (
                      <option key={m.key} value={m.key}>
                        {m.name} ({m.key}) — {m.isPct ? '+%' : '+Flat'}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🌿 Support & Utility">
                    {SUPPORTED_MODIFIERS.filter((m) => m.category === 'utility').map((m) => (
                      <option key={m.key} value={m.key}>
                        {m.name} ({m.key}) — {m.isPct ? '+%' : '+Flat'}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="⚙️ Custom Key">
                    <option value="__custom__">{t.customKeyOption}</option>
                  </optgroup>
                </select>

                {selectedModKey === '__custom__' && (
                  <input
                    type="text"
                    placeholder="Custom key name"
                    value={customKeyText}
                    onChange={(e) => setCustomKeyText(e.target.value)}
                    className="w-36 bg-[#110e16] border border-[#382b45] rounded-lg px-2 py-1 text-xs text-[#f0e8db] font-mono focus:outline-none"
                  />
                )}

                <div className="relative w-28 shrink-0">
                  <input
                    type="number"
                    step={activeDef ? (activeDef.isPct ? 0.01 : 1) : 0.05}
                    value={modValInput}
                    onChange={(e) => setModValInput(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#110e16] border border-[#382b45] rounded-lg px-2.5 py-1.5 text-xs text-[#71caa2] font-mono font-bold focus:outline-none"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#8e8273] font-mono">
                    {activeDef ? (activeDef.isPct ? '%' : 'flat') : ''}
                  </span>
                </div>

                <Button
                  variant="gold"
                  size="sm"
                  className="text-xs px-3 py-1.5 whitespace-nowrap"
                  icon={<Plus className="w-3.5 h-3.5 text-[#151218]" />}
                  onClick={handleAddMod}
                >
                  {t.addCustomStatBtn}
                </Button>
              </div>

              {activeDef && (
                <p className="text-[10px] text-[#7e7261]">
                  💡 <span className="text-[#c9bea9] font-medium">{activeDef.name}</span>: {activeDef.description} ({activeDef.isPct ? t.pctStatNotice : t.flatStatNotice})
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#2e2338] bg-[#1a1520] flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            {t.cancelBtn}
          </Button>
          <Button
            variant="gold"
            size="sm"
            icon={<Check className="w-4 h-4 text-[#151218]" />}
            onClick={handleSave}
          >
            {t.saveChangesBtn}
          </Button>
        </div>
      </div>
    </div>
  );
};
