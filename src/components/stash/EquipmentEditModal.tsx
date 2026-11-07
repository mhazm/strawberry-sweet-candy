import React, { useState } from 'react';
import { X, Sparkles, Check, Trash2, Plus, Info } from 'lucide-react';
import { EquipmentItem } from '../../types/savegame';
import {
  ItemRarity,
  QUALITY_BANDS,
  QualityBandId,
  RARITY_CONFIGS,
  getQualityBandFromMultiplier,
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
  const [newKey, setNewKey] = useState<string>('');
  const [newVal, setNewVal] = useState<number>(0.1);

  const currentBand = getQualityBandFromMultiplier(quality);

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

  const handleAddMod = () => {
    if (!newKey.trim()) return;
    setMods((prev) => ({ ...prev, [newKey.trim()]: newVal }));
    setNewKey('');
    setNewVal(0.1);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#141018] border border-[#3b2e47] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-[#c9bea9]">
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
                    className={`p-1.5 rounded border text-center transition-all ${
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

          {/* Modifiers List */}
          <div className="space-y-2 pt-2 border-t border-[#2e2338]">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#dfb15b] block">
              {t.affixMods}
            </label>
            <div className="space-y-1.5">
              {Object.entries(mods).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#18131f] border border-[#271f30] font-mono text-xs"
                >
                  <span className="text-[#c9bea9] font-medium">{k}:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={v}
                      onChange={(e) =>
                        handleModChange(k, parseFloat(e.target.value) || 0)
                      }
                      className="w-24 bg-[#110e16] border border-[#3b2e47] rounded px-2 py-0.5 text-right font-bold text-[#71caa2] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMod(k)}
                      className="text-[#e67e8c] hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Mod */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Mod key (e.g. critDamage)"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="flex-1 bg-[#110e16] border border-[#382b45] rounded px-2 py-1 text-xs text-[#f0e8db] font-mono focus:outline-none"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Value"
                value={newVal}
                onChange={(e) => setNewVal(parseFloat(e.target.value) || 0)}
                className="w-20 bg-[#110e16] border border-[#382b45] rounded px-2 py-1 text-xs text-[#71caa2] font-mono font-bold focus:outline-none"
              />
              <Button
                variant="secondary"
                size="sm"
                className="text-xs px-2.5 py-1"
                icon={<Plus className="w-3 h-3" />}
                onClick={handleAddMod}
              >
                {t.addModLine}
              </Button>
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

