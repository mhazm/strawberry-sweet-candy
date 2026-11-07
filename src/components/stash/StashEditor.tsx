import React, { useState, useMemo } from 'react';
import {
  Package,
  Shield,
  Swords,
  Sparkles,
  Trash2,
  Plus,
  Gem,
  Hammer,
  Copy,
  Edit3,
  Search,
  Filter,
  Flame,
  Droplets,
  Eye,
  Crosshair,
  Crown,
} from 'lucide-react';
import { EquipmentItem, GuildData } from '../../types/savegame';
import {
  ItemRarity,
  QUALITY_BANDS,
  RARITY_CONFIGS,
  EQUIPMENT_TEMPLATES,
  forgeConditionCounterPack,
  forgeItem,
  getQualityBandFromMultiplier,
} from '../../lib/equipment';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tooltip } from '../ui/Tooltip';
import { formatGold } from '../../lib/utils';
import { useTranslation } from '../../lib/i18n';
import { EquipmentForgeModal } from './EquipmentForgeModal';
import { EquipmentEditModal } from './EquipmentEditModal';

interface StashEditorProps {
  guild: GuildData;
  onChange: (updated: GuildData) => void;
}

export const StashEditor: React.FC<StashEditorProps> = ({ guild, onChange }) => {
  const { t } = useTranslation();
  const stash = guild.stash || [];

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'weapon' | 'armour' | 'trinket' | 'relic' | 'counter'
  >('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'value' | 'quality' | 'tier' | 'name'>('value');

  const [isForgeOpen, setIsForgeOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);

  const updateStash = (newStash: EquipmentItem[]) => {
    onChange({ ...guild, stash: newStash });
  };

  const handleRemove = (id: string) => {
    updateStash(stash.filter((it) => it.id !== id));
  };

  const handleDuplicate = (item: EquipmentItem) => {
    const copy: EquipmentItem = {
      ...item,
      id: `it_copy_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
      name: `${item.name} (Copy)`,
      mods: { ...(item.mods || {}) },
    };
    updateStash([...stash, copy]);
  };

  const handleAddForgedItem = (item: EquipmentItem) => {
    updateStash([...stash, item]);
  };

  const handleSaveEditedItem = (updated: EquipmentItem) => {
    updateStash(stash.map((it) => (it.id === updated.id ? updated : it)));
    setEditingItem(null);
  };

  const handleForgeCounterPack = () => {
    const pack = forgeConditionCounterPack();
    updateStash([...stash, ...pack]);
  };

  const handleForgeSovereignRelic = () => {
    const relics = EQUIPMENT_TEMPLATES.filter((t) => t.category === 'relic');
    const randomRelic = relics[Math.floor(Math.random() * relics.length)];
    const forged = forgeItem(randomRelic, {
      rarity: 'legendary',
      tier: 5,
      quality: 1.8,
    });
    updateStash([...stash, forged]);
  };

  const handleMaxQualityAll = () => {
    const upgraded = stash.map((it) => {
      const currentQuality = it.quality || 1.0;
      const targetQuality = Math.max(currentQuality, 1.8);
      const targetTier = 5;
      const scaledMods: Record<string, number> = {};

      if (it.mods) {
        for (const [k, v] of Object.entries(it.mods)) {
          if (typeof v === 'number') {
            const ratio = targetQuality / Math.max(0.1, currentQuality);
            scaledMods[k] = Math.round(v * ratio * 1000) / 1000;
          } else {
            scaledMods[k] = v;
          }
        }
      }

      return {
        ...it,
        rarity: 'legendary',
        tier: targetTier,
        quality: targetQuality,
        value: Math.max(it.value || 100, 1500),
        mods: scaledMods,
      };
    });
    updateStash(upgraded);
  };

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return stash
      .filter((item) => {
        // Category filter
        if (selectedFilter === 'weapon' && item.slot !== 'weapon') return false;
        if (selectedFilter === 'armour' && item.slot !== 'armour') return false;
        if (selectedFilter === 'trinket' && item.slot !== 'trinket') return false;
        if (selectedFilter === 'counter' && !item.counters) return false;
        if (selectedFilter === 'relic' && !item.grantsTrait) return false;

        // Rarity filter
        if (selectedRarity !== 'all' && item.rarity !== selectedRarity) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchSlot = item.slot.toLowerCase().includes(q);
          const matchKind = item.weaponKind?.toLowerCase().includes(q);
          const matchCounter = item.counters?.toLowerCase().includes(q);
          const matchTrait = item.grantsTrait?.toLowerCase().includes(q);
          const matchMods =
            item.mods &&
            Object.keys(item.mods).some((k) => k.toLowerCase().includes(q));

          if (!matchName && !matchSlot && !matchKind && !matchCounter && !matchTrait && !matchMods) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'value') return (b.value || 0) - (a.value || 0);
        if (sortBy === 'quality') return (b.quality || 1) - (a.quality || 1);
        if (sortBy === 'tier') return (b.tier || 1) - (a.tier || 1);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [stash, selectedFilter, selectedRarity, searchQuery, sortBy]);

  const weaponsCount = stash.filter((i) => i.slot === 'weapon').length;
  const armoursCount = stash.filter((i) => i.slot === 'armour').length;
  const trinketsCount = stash.filter((i) => i.slot === 'trinket').length;
  const countersCount = stash.filter((i) => i.counters).length;
  const relicsCount = stash.filter((i) => i.grantsTrait).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#c9bea9]">
      {/* Header Bar */}
      <div className="p-4 bg-[#18151f] border border-[#2e2536] rounded-xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#2a1d12] border border-[#5e4726] text-[#dfb15b]">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-rpg text-base font-bold text-[#f0e8db] flex items-center gap-2">
              {t.armouryVaultTitle}
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#131018] text-[#dfb15b] border border-[#3b2d47]">
                {stash.length} Items
              </span>
            </h2>
            <p className="text-xs text-[#8e8273]">
              {t.armouryVaultSubtitle}
            </p>
          </div>
        </div>

        {/* Forge Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="gold"
            size="sm"
            icon={<Hammer className="w-3.5 h-3.5 text-[#151218]" />}
            onClick={() => setIsForgeOpen(true)}
          >
            {t.forgeCustomGear}
          </Button>

          <Button
            variant="purple"
            size="sm"
            icon={<Crown className="w-3.5 h-3.5" />}
            onClick={handleForgeSovereignRelic}
          >
            {t.forgeRelicGear}
          </Button>

          <Button
            variant="cyan"
            size="sm"
            icon={<Shield className="w-3.5 h-3.5" />}
            onClick={handleForgeCounterPack}
          >
            {t.forgeCounterPack}
          </Button>

          <Button
            variant="amber"
            size="sm"
            icon={<Sparkles className="w-3.5 h-3.5" />}
            onClick={handleMaxQualityAll}
            disabled={stash.length === 0}
          >
            {t.upgradeAllSovereign}
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-[#15111c] border border-[#2b2234] rounded-xl flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
              selectedFilter === 'all'
                ? 'border-[#dfb15b] bg-[#271d18] text-[#f0e8db]'
                : 'border-[#281f32] bg-[#1a1522] text-[#8e8273] hover:text-[#c9bea9]'
            }`}
          >
            {t.filterAllEquipment} ({stash.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('weapon')}
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
              selectedFilter === 'weapon'
                ? 'border-[#e67e8c] bg-[#29171d] text-[#f0e8db]'
                : 'border-[#281f32] bg-[#1a1522] text-[#8e8273] hover:text-[#c9bea9]'
            }`}
          >
            <Swords className="w-3 h-3 text-[#e67e8c]" />
            {t.filterWeapons} ({weaponsCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('armour')}
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
              selectedFilter === 'armour'
                ? 'border-[#86afdf] bg-[#17202d] text-[#f0e8db]'
                : 'border-[#281f32] bg-[#1a1522] text-[#8e8273] hover:text-[#c9bea9]'
            }`}
          >
            <Shield className="w-3 h-3 text-[#86afdf]" />
            {t.filterArmours} ({armoursCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('trinket')}
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
              selectedFilter === 'trinket'
                ? 'border-[#dfb15b] bg-[#292215] text-[#f0e8db]'
                : 'border-[#281f32] bg-[#1a1522] text-[#8e8273] hover:text-[#c9bea9]'
            }`}
          >
            <Gem className="w-3 h-3 text-[#dfb15b]" />
            {t.filterTrinkets} ({trinketsCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('counter')}
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
              selectedFilter === 'counter'
                ? 'border-[#38bdf8] bg-[#13222e] text-[#f0e8db]'
                : 'border-[#281f32] bg-[#1a1522] text-[#8e8273] hover:text-[#c9bea9]'
            }`}
          >
            <Droplets className="w-3 h-3 text-[#38bdf8]" />
            {t.filterCounters} ({countersCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('relic')}
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
              selectedFilter === 'relic'
                ? 'border-[#c084fc] bg-[#22172e] text-[#f0e8db]'
                : 'border-[#281f32] bg-[#1a1522] text-[#8e8273] hover:text-[#c9bea9]'
            }`}
          >
            <Crown className="w-3 h-3 text-[#c084fc]" />
            {t.filterRelics} ({relicsCount})
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 lg:w-56">
            <Search className="w-3.5 h-3.5 text-[#695d4e] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchEquipmentPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#110e16] border border-[#312739] rounded-lg pl-8 pr-3 py-1 text-xs text-[#f0e8db] focus:outline-none focus:border-[#dfb15b]"
            />
          </div>

          {/* Rarity Select */}
          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="bg-[#110e16] border border-[#312739] rounded-lg px-2.5 py-1 text-xs text-[#c9bea9] focus:outline-none capitalize"
          >
            <option value="all">All Rarities</option>
            <option value="common">Common</option>
            <option value="rare">Rare</option>
            <option value="mythic">Mythic</option>
            <option value="legendary">Legendary</option>
          </select>

          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#110e16] border border-[#312739] rounded-lg px-2.5 py-1 text-xs text-[#c9bea9] focus:outline-none"
          >
            <option value="value">{t.sortItemValue}</option>
            <option value="quality">{t.sortItemQuality}</option>
            <option value="tier">{t.sortItemTier}</option>
            <option value="name">{t.sortItemName}</option>
          </select>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-[#18151f]/60 border border-[#2e2536] rounded-2xl">
          <Package className="w-10 h-10 text-[#695d4e] mx-auto mb-3" />
          <p className="text-[#8e8273] font-medium text-sm">
            {t.emptyVaultTitle}
          </p>
          <p className="text-xs text-[#5a4e40] mt-1 max-w-md mx-auto">
            {t.emptyVaultDesc}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button
              variant="gold"
              size="sm"
              icon={<Hammer className="w-3.5 h-3.5 text-[#151218]" />}
              onClick={() => setIsForgeOpen(true)}
            >
              {t.forgeCustomGear}
            </Button>
            <Button
              variant="cyan"
              size="sm"
              icon={<Shield className="w-3.5 h-3.5" />}
              onClick={handleForgeCounterPack}
            >
              {t.forgeCounterPack}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, idx) => {
            const qualityBand = getQualityBandFromMultiplier(item.quality || 1.0);
            const rConf = RARITY_CONFIGS[item.rarity as ItemRarity] || RARITY_CONFIGS.common;

            return (
              <div
                key={item.id || idx}
                className="p-4 bg-[#18151f] border border-[#2e2536] hover:border-[#dfb15b]/40 rounded-xl flex flex-col justify-between group transition-all shadow-sm"
              >
                <div>
                  {/* Card Header: Slot Icon + Name + Rarity */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      {item.slot === 'weapon' ? (
                        <Swords className="w-4 h-4 text-[#e67e8c] shrink-0" />
                      ) : item.slot === 'armour' ? (
                        <Shield className="w-4 h-4 text-[#86afdf] shrink-0" />
                      ) : (
                        <Gem className="w-4 h-4 text-[#dfb15b] shrink-0" />
                      )}
                      <h3
                        className="font-rpg text-sm font-bold truncate"
                        style={{ color: rConf.color }}
                      >
                        {item.name}
                      </h3>
                    </div>
                    <Badge variant="rarity">{item.rarity || 'common'}</Badge>
                  </div>

                  {/* Quality Band & Special Tags */}
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    {/* Quality Band Tag */}
                    <Tooltip content={`${qualityBand.description} (${qualityBand.odds} roll odds, ${qualityBand.overallDrop})`}>
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-help border"
                        style={{
                          backgroundColor: `${qualityBand.color}15`,
                          borderColor: `${qualityBand.color}40`,
                          color: qualityBand.color,
                        }}
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        {qualityBand.label} ({item.quality ? `${(item.quality * 100).toFixed(0)}%` : '100%'})
                      </span>
                    </Tooltip>

                    {/* Condition Counter Tag */}
                    {item.counters && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0e2938] text-[#38bdf8] border border-[#1e4963] flex items-center gap-1">
                        <Droplets className="w-2.5 h-2.5" />
                        Counters {item.counters}
                      </span>
                    )}

                    {/* Relic Trait Tag */}
                    {item.grantsTrait && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#29172e] text-[#c084fc] border border-[#4d255c] flex items-center gap-1">
                        <Crown className="w-2.5 h-2.5" />
                        Grants {item.grantsTrait}
                      </span>
                    )}
                  </div>

                  {/* Metadata Row: Slot, WeaponKind, Tier, Value */}
                  <div className="mt-2.5 text-xs text-[#8e8273] space-y-1">
                    <div className="flex justify-between">
                      <span>{t.selectSlot}:</span>
                      <span className="capitalize text-[#c9bea9] font-medium">
                        {item.slot} {item.weaponKind ? `(${item.weaponKind})` : ''}
                      </span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span>{t.tier}:</span>
                      <span className="text-[#dfb15b] font-bold">Tier {item.tier || 1}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span>{t.goldValue}:</span>
                      <span className="text-[#f5cb71]">{formatGold(item.value || 0)}g</span>
                    </div>
                  </div>

                  {/* Combat Modifiers */}
                  {item.mods && Object.keys(item.mods).length > 0 && (
                    <div className="mt-3 p-2.5 rounded bg-[#131018] border border-[#261f2e] text-[11px] font-mono space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#695d4e] block font-sans">
                        {t.affixMods}
                      </span>
                      {Object.entries(item.mods).map(([k, v]) => (
                        <div key={k} className="flex justify-between text-[#b8ab96]">
                          <span>{k}:</span>
                          <span
                            className={`font-bold ${
                              typeof v === 'number' && v < 0
                                ? 'text-[#e67e8c]'
                                : 'text-[#71caa2]'
                            }`}
                          >
                            {typeof v === 'number' && Math.abs(v) <= 1 && k !== 'accuracy'
                              ? `${v >= 0 ? '+' : ''}${(v * 100).toFixed(1)}%`
                              : `${v >= 0 ? '+' : ''}${v}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="mt-4 pt-3 border-t border-[#261f2e] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="px-2.5 py-1 text-xs"
                      icon={<Edit3 className="w-3 h-3" />}
                      onClick={() => setEditingItem(item)}
                    >
                      {t.editItem}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-2 py-1 text-xs"
                      icon={<Copy className="w-3 h-3 text-[#8e8273]" />}
                      onClick={() => handleDuplicate(item)}
                      title={t.duplicateItem}
                    />
                  </div>

                  <Button
                    variant="danger"
                    size="sm"
                    className="px-2 py-1 text-xs"
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    onClick={() => handleRemove(item.id)}
                    title={t.deleteItem}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Equipment Forge Modal */}
      <EquipmentForgeModal
        isOpen={isForgeOpen}
        onClose={() => setIsForgeOpen(false)}
        onForge={handleAddForgedItem}
      />

      {/* Equipment Edit Modal */}
      <EquipmentEditModal
        item={editingItem}
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveEditedItem}
      />
    </div>
  );
};
