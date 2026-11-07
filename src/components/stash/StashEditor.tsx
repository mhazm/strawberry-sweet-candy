import React, { useState } from 'react';
import { Package, Shield, Swords, Sparkles, Trash2, Plus, Gem } from 'lucide-react';
import { EquipmentItem, GuildData } from '../../types/savegame';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatGold } from '../../lib/utils';
import { useTranslation } from '../../lib/i18n';

interface StashEditorProps {
  guild: GuildData;
  onChange: (updated: GuildData) => void;
}

export const StashEditor: React.FC<StashEditorProps> = ({ guild, onChange }) => {
  const { t } = useTranslation();
  const stash = guild.stash || [];

  const updateStash = (newStash: EquipmentItem[]) => {
    onChange({ ...guild, stash: newStash });
  };

  const handleRemove = (id: string) => {
    updateStash(stash.filter((it) => it.id !== id));
  };

  const handleMaxQualityAll = () => {
    const upgraded = stash.map((it) => ({
      ...it,
      quality: 1.5,
      tier: Math.max(it.tier || 1, 5),
      value: (it.value || 100) * 2,
    }));
    updateStash(upgraded);
  };

  const handleAddLegendaryGear = (slot: 'weapon' | 'armour' | 'trinket') => {
    const newItem: EquipmentItem = {
      id: `it_custom_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
      name:
        slot === 'weapon'
          ? 'Sun-Forged Blade'
          : slot === 'armour'
          ? 'Dragonplate Aegis'
          : 'Crown of Kings',
      slot,
      rarity: 'legendary',
      tier: 5,
      quality: 1.5,
      value: 1250,
      mods:
        slot === 'weapon'
          ? { attackPct: 0.35, critChance: 0.15, speed: 5 }
          : slot === 'armour'
          ? { hpPct: 0.3, mitigation: 0.2, healTakenPct: 0.25 }
          : { critChance: 0.1, speed: 4, mitigation: 0.1 },
    };
    updateStash([...stash, newItem]);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-[#c9bea9]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#18151f] border border-[#2e2536] rounded-xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#2a1d12] border border-[#5e4726] text-[#dfb15b]">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-rpg text-base font-bold text-[#f0e8db] flex items-center gap-2">
              {t.navArmoury}
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#131018] text-[#dfb15b] border border-[#3b2d47]">
                {stash.length} Items
              </span>
            </h2>
            <p className="text-xs text-[#8e8273]">
              Weapons, armours, and rare accessories stored in your guild hall vault.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="purple"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => handleAddLegendaryGear('weapon')}
          >
            + Forge Legendary Weapon
          </Button>
          <Button
            variant="gold"
            size="sm"
            icon={<Sparkles className="w-3.5 h-3.5 text-[#151218]" />}
            onClick={handleMaxQualityAll}
            disabled={stash.length === 0}
          >
            Upgrade All (Tier 5 & Max Quality)
          </Button>
        </div>
      </div>

      {/* Items List */}
      {stash.length === 0 ? (
        <div className="p-12 text-center bg-[#18151f]/60 border border-[#2e2536] rounded-2xl">
          <Package className="w-10 h-10 text-[#695d4e] mx-auto mb-3" />
          <p className="text-[#8e8273] font-medium">
            Your guild stash vault is currently empty.
          </p>
          <p className="text-xs text-[#5a4e40] mt-1">
            You can forge new legendary gear using the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stash.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-4 bg-[#18151f] border border-[#2e2536] hover:border-[#dfb15b]/40 rounded-xl flex flex-col justify-between group transition-all shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    {item.slot === 'weapon' ? (
                      <Swords className="w-4 h-4 text-[#e67e8c] shrink-0" />
                    ) : item.slot === 'armour' ? (
                      <Shield className="w-4 h-4 text-[#86afdf] shrink-0" />
                    ) : (
                      <Gem className="w-4 h-4 text-[#c78ade] shrink-0" />
                    )}
                    <h3 className="font-rpg text-sm font-bold text-[#f0e8db] truncate">
                      {item.name}
                    </h3>
                  </div>
                  <Badge variant="rarity">{item.rarity || 'common'}</Badge>
                </div>

                <div className="mt-2.5 text-xs text-[#8e8273] space-y-1">
                  <div className="flex justify-between">
                    <span>Slot / Type:</span>
                    <span className="capitalize text-[#c9bea9] font-medium">
                      {item.slot} {item.weaponKind ? `(${item.weaponKind})` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>Tier:</span>
                    <span className="text-[#dfb15b] font-bold">Tier {item.tier || 1}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>Quality:</span>
                    <span className="text-[#71caa2] font-semibold">
                      {item.quality != null ? (item.quality * 100).toFixed(0) : 100}%
                    </span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>Value:</span>
                    <span className="text-[#f5cb71]">{formatGold(item.value || 0)}g</span>
                  </div>
                </div>

                {/* Combat Modifiers */}
                {item.mods && Object.keys(item.mods).length > 0 && (
                  <div className="mt-3 p-2 rounded bg-[#131018] border border-[#261f2e] text-[11px] font-mono space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#695d4e] block font-sans">
                      Combat Modifiers
                    </span>
                    {Object.entries(item.mods).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[#b8ab96]">
                        <span>{k}:</span>
                        <span className="text-[#dfb15b] font-bold">
                          {typeof v === 'number' && v < 1 && v > -1
                            ? `+${(v * 100).toFixed(1)}%`
                            : `+${v}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#261f2e] flex items-center justify-end">
                <Button
                  variant="danger"
                  size="sm"
                  className="px-2 py-1 text-xs"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={() => handleRemove(item.id)}
                  title="Remove from stash"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};