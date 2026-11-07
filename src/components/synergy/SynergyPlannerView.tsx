import React, { useState, useMemo } from 'react';
import {
  Flame,
  Shield,
  Heart,
  Swords,
  Plus,
  X,
  Sparkles,
  Info,
  CheckCircle,
  Users,
  Search,
  Filter,
} from 'lucide-react';
import { GuildData, Adventurer } from '../../types/savegame';
import {
  evaluatePartySynergies,
  findRecommendedParties,
  SYNERGIES,
  CLASSES_META,
  SynergyDefinition,
} from '../../lib/synergy';
import { useTranslation } from '../../lib/i18n';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tooltip } from '../ui/Tooltip';

interface SynergyPlannerViewProps {
  guild: GuildData;
  initialPartyIds?: string[];
}

export const SynergyPlannerView: React.FC<SynergyPlannerViewProps> = ({ guild, initialPartyIds }) => {
  const { t } = useTranslation();
  const roster = useMemo(() => guild.roster || [], [guild.roster]);

  // Selected party in planner (max 6 members)
  const [selectedParty, setSelectedParty] = useState<Adventurer[]>(() => {
    if (initialPartyIds && initialPartyIds.length > 0) {
      const initial = (guild.roster || []).filter((d) => initialPartyIds.includes(d.id));
      if (initial.length > 0) return initial;
    }
    // Default to the first 4 members of the active roster if available
    return roster.slice(0, 4);
  });

  React.useEffect(() => {
    if (initialPartyIds && initialPartyIds.length > 0) {
      const matching = roster.filter((d) => initialPartyIds.includes(d.id));
      if (matching.length > 0) {
        setSelectedParty(matching);
      }
    }
  }, [initialPartyIds, roster]);

  // Filter state for roster list
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'tank' | 'dps' | 'healer'>('all');
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'recommendations'>('roster');

  // Compute synergy results
  const synergyResult = useMemo(() => {
    return evaluatePartySynergies(selectedParty);
  }, [selectedParty]);

  // Compute recommended parties from the player's roster
  const recommendedParties = useMemo(() => {
    return findRecommendedParties(roster, 4, 4);
  }, [roster]);

  const handleAddHero = (hero: Adventurer) => {
    if (selectedParty.length >= 6) return;
    if (selectedParty.some((p) => p.id === hero.id)) return;
    setSelectedParty((prev) => [...prev, hero]);
  };

  const handleRemoveHero = (heroId: string) => {
    setSelectedParty((prev) => prev.filter((p) => p.id !== heroId));
  };

  const handleApplyRecommended = (party: Adventurer[]) => {
    setSelectedParty([...party]);
  };

  // Filtered available roster
  const filteredRoster = useMemo(() => {
    return roster.filter((hero) => {
      const matchesSearch =
        hero.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hero.classId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hero.raceId || '').toLowerCase().includes(searchTerm.toLowerCase());
      const meta = CLASSES_META[(hero.classId || '').toLowerCase()];
      const heroRole = meta ? meta.role : (hero.role || '').toLowerCase();
      const matchesRole = roleFilter === 'all' || heroRole === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [roster, searchTerm, roleFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#1b120f] via-[#151019] to-[#120d16] border border-[#3e2d1d] shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#dfb15b]/20 to-[#dfb15b]/5 border border-[#dfb15b]/40 flex items-center justify-center text-[#dfb15b] shadow-[0_0_20px_rgba(223,177,91,0.2)]">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="font-rpg font-bold text-lg text-[#f5cb71] tracking-wide">
              {t.synergyTitle}
            </h2>
            <p className="text-xs text-[#a99c8d] mt-0.5 max-w-xl">
              {t.synergySubtitle}
            </p>
          </div>
        </div>

        {/* Action Button */}
        {selectedParty.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedParty([])}
            icon={<X className="w-3.5 h-3.5" />}
          >
            {t.synergyClearParty}
          </Button>
        )}
      </div>

      {/* Active Party & Stat Buffs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Active Party Slots */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#110d14] border border-[#2b2133] space-y-4">
          <div className="flex items-center justify-between border-b border-[#241b2c] pb-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#dfb15b]">
              <Users className="w-4 h-4" />
              <span>{t.synergyActiveParty}</span>
            </div>
            <span className="font-mono text-xs text-[#9d8e7e]">
              {selectedParty.length} / 6 {t.synergySlotsUsed}
            </span>
          </div>

          {/* Party Slots Container */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[0, 1, 2, 3, 4, 5].map((slotIdx) => {
              const hero = selectedParty[slotIdx];
              if (!hero) {
                return (
                  <div
                    key={`empty-slot-${slotIdx}`}
                    className="h-28 rounded-xl border border-dashed border-[#2d2138] bg-[#0c0910]/50 flex flex-col items-center justify-center text-[#5c5061] text-[11px] gap-1 select-none"
                  >
                    <Plus className="w-4 h-4 opacity-40" />
                    <span>Slot {slotIdx + 1}</span>
                  </div>
                );
              }

              const meta = CLASSES_META[(hero.classId || '').toLowerCase()];
              const roleColor =
                meta?.role === 'tank'
                  ? 'border-blue-500/40 text-blue-400 bg-blue-950/30'
                  : meta?.role === 'healer'
                  ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30'
                  : 'border-amber-500/40 text-amber-400 bg-amber-950/30';

              return (
                <div
                  key={hero.id}
                  className="relative group h-28 p-3 rounded-xl bg-gradient-to-b from-[#1c1424] to-[#120d18] border border-[#3e2e4f] hover:border-[#dfb15b]/60 transition-all flex flex-col justify-between shadow-md"
                >
                  <button
                    onClick={() => handleRemoveHero(hero.id)}
                    className="absolute top-2 right-2 p-1 rounded-md text-[#786b5d] hover:text-red-400 hover:bg-red-950/40 transition-colors"
                    title={t.close}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div>
                    <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] uppercase font-bold border ${roleColor}`}>
                      {meta?.role || hero.role}
                    </span>
                    <h4 className="font-semibold text-xs text-[#f0e8db] truncate mt-1">
                      {hero.name}
                    </h4>
                    <p className="text-[10px] text-[#9c8e7e] capitalize">
                      {meta?.name || hero.classId} • Lv.{hero.level}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#786c5c] font-mono pt-1 border-t border-[#251b2d]">
                    <span>CA: {hero.currentAbility}</span>
                    <span>PA: {hero.potentialAbility}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedParty.length === 0 && (
            <p className="text-center py-2 text-xs text-[#786b5c] italic">
              {t.synergyEmptyParty}
            </p>
          )}
        </div>

        {/* Right Column: Combined Party Stat Buffs */}
        <div className="p-5 rounded-2xl bg-[#110d14] border border-[#2b2133] flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#dfb15b] border-b border-[#241b2c] pb-3">
            <Sparkles className="w-4 h-4 text-[#dfb15b]" />
            <span>{t.synergyTotalBonuses}</span>
          </div>

          {/* Buff Metrics */}
          <div className="space-y-3">
            {/* Damage Bonus */}
            <div className="p-3 rounded-xl bg-[#170e13] border border-[#3d1e28] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-700/40 flex items-center justify-center text-red-400">
                  <Swords className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#f0e8db]">{t.synergyDamage}</span>
                  <p className="text-[9px] text-[#8e7a76]">Party damage boost</p>
                </div>
              </div>
              <span className={`font-mono text-base font-bold ${synergyResult.totalDamagePct > 0 ? 'text-[#f87171]' : 'text-[#5c4a4f]'}`}>
                +{synergyResult.totalDamagePct}%
              </span>
            </div>

            {/* Healing Bonus */}
            <div className="p-3 rounded-xl bg-[#0f1712] border border-[#1e3d28] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-700/40 flex items-center justify-center text-emerald-400">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#f0e8db]">{t.synergyHealing}</span>
                  <p className="text-[9px] text-[#7a8e7e]">Restoration multiplier</p>
                </div>
              </div>
              <span className={`font-mono text-base font-bold ${synergyResult.totalHealingPct > 0 ? 'text-[#4ade80]' : 'text-[#4a5c4f]'}`}>
                +{synergyResult.totalHealingPct}%
              </span>
            </div>

            {/* Mitigation Bonus */}
            <div className="p-3 rounded-xl bg-[#0e131b] border border-[#1e2a3d] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-950/40 border border-blue-700/40 flex items-center justify-center text-blue-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#f0e8db]">{t.synergyMitigation}</span>
                  <p className="text-[9px] text-[#7a858e]">Damage reduction</p>
                </div>
              </div>
              <span className={`font-mono text-base font-bold ${synergyResult.totalMitigationPct > 0 ? 'text-[#60a5fa]' : 'text-[#4a535c]'}`}>
                +{synergyResult.totalMitigationPct}%
              </span>
            </div>
          </div>

          <div className="text-[10px] text-[#786b5c] italic text-center pt-2 border-t border-[#231a29]">
            {synergyResult.activeSynergies.length} sinergi aktif terdeteksi
          </div>
        </div>
      </div>

      {/* Synergies Display Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-[#dfb15b]">
              {t.synergyActiveList} ({synergyResult.activeSynergies.length})
            </h3>
          </div>
        </div>

        {synergyResult.activeSynergies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {synergyResult.activeSynergies.map((syn) => (
              <div
                key={syn.id}
                className="p-4 rounded-xl bg-gradient-to-r from-[#1e1526] to-[#140e1b] border border-[#dfb15b]/60 shadow-[0_0_15px_rgba(223,177,91,0.12)] space-y-2 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#4ade80]" />
                    <h4 className="font-serif font-bold text-sm text-[#f5cb71]">
                      {syn.name}
                    </h4>
                  </div>
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#2b1f35] border border-[#dfb15b]/40 text-[#4ade80]">
                    {syn.effectDesc}
                  </span>
                </div>
                <p className="text-[11px] text-[#b3a492] leading-relaxed italic">
                  "{syn.blurb}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#110d14] border border-[#2b2133] text-center text-xs text-[#786b5c]">
            {t.synergyNoSynergyFound}
          </div>
        )}
      </div>

      {/* Bottom Tabs: Roster Selection & Auto-Recommendations */}
      <div className="space-y-4 pt-4 border-t border-[#231a27]">
        {/* Sub-Tabs Navigation */}
        <div className="flex items-center justify-between border-b border-[#251b2c] pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('roster')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeSubTab === 'roster'
                  ? 'bg-[#2b1e15] text-[#f5cb71] border border-[#6b4a24]'
                  : 'text-[#8c7d6c] hover:text-[#d4c3af]'
              }`}
            >
              {t.synergyAvailableRoster} ({roster.length})
            </button>
            <button
              onClick={() => setActiveSubTab('recommendations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'recommendations'
                  ? 'bg-[#2b1e15] text-[#f5cb71] border border-[#6b4a24]'
                  : 'text-[#8c7d6c] hover:text-[#d4c3af]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#dfb15b]" />
              <span>{t.synergyRecommendedTitle}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Guild Roster Selection */}
        {activeSubTab === 'roster' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#786b5c]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.searchDelvers}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#110d14] border border-[#2b2133] text-xs text-[#cfc2b2] placeholder:text-[#5a4e61] outline-none focus:border-[#dfb15b]/50"
                />
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                {(['all', 'tank', 'dps', 'healer'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium capitalize transition-colors cursor-pointer ${
                      roleFilter === r
                        ? 'bg-[#241a2e] text-[#f5cb71] border border-[#523b66]'
                        : 'bg-[#110d14] text-[#786b5c] border border-[#231a29] hover:text-[#bdae9c]'
                    }`}
                  >
                    {r === 'all' ? t.allRoles : r}
                  </button>
                ))}
              </div>
            </div>

            {/* Roster Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-1">
              {filteredRoster.map((hero) => {
                const isSelected = selectedParty.some((p) => p.id === hero.id);
                const meta = CLASSES_META[(hero.classId || '').toLowerCase()];

                return (
                  <div
                    key={hero.id}
                    className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#18121f]/50 border-[#382b45] opacity-60'
                        : 'bg-[#120e16] border-[#291f30] hover:border-[#dfb15b]/40 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] text-[#7e6f60] uppercase">
                          {meta?.role || hero.role}
                        </span>
                        <span className="text-[10px] text-[#dfb15b] font-mono">
                          Lv.{hero.level}
                        </span>
                      </div>
                      <h4 className="font-semibold text-xs text-[#ebdcc9] truncate mt-0.5">
                        {hero.name}
                      </h4>
                      <p className="text-[10px] text-[#8e8070] capitalize">
                        {meta?.name || hero.classId} • {hero.raceId}
                      </p>
                    </div>

                    <div className="pt-2.5 mt-2 border-t border-[#211826] flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#8c9eb5]">
                        CA {hero.currentAbility}
                      </span>
                      {isSelected ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveHero(hero.id)}
                          className="text-[10px] h-6 px-2 text-rose-400 hover:text-rose-300"
                        >
                          Hapus
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={selectedParty.length >= 6}
                          onClick={() => handleAddHero(hero)}
                          className="text-[10px] h-6 px-2"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Tambah
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Auto-Recommended Compositions */}
        {activeSubTab === 'recommendations' && (
          <div className="space-y-4">
            <p className="text-xs text-[#8e8070]">
              {t.synergyRecommendedSubtitle}
            </p>

            {recommendedParties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedParties.map((rec, idx) => (
                  <div
                    key={`rec-party-${idx}`}
                    className="p-4 rounded-xl bg-[#120d17] border border-[#3b2b47] hover:border-[#dfb15b]/50 transition-all space-y-3 shadow-md"
                  >
                    <div className="flex items-center justify-between border-b border-[#251b2c] pb-2">
                      <span className="font-serif font-bold text-xs text-[#f5cb71]">
                        Komposisi Rekomendasi #{idx + 1}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleApplyRecommended(rec.members)}
                        className="text-[10px] h-6 px-2.5"
                      >
                        {t.synergyApplyParty}
                      </Button>
                    </div>

                    {/* Member Avatars */}
                    <div className="flex items-center gap-2">
                      {rec.members.map((m) => (
                        <div
                          key={m.id}
                          className="p-2 rounded-lg bg-[#181121] border border-[#2e213a] flex-1 text-center"
                        >
                          <div className="text-[11px] font-semibold text-[#f0e8db] truncate">
                            {m.name}
                          </div>
                          <div className="text-[9px] text-[#8e7e6e] capitalize truncate">
                            {m.classId}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Synergies Triggered */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-[#dfb15b] uppercase tracking-wider">
                        Sinergi Aktif:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.activeSynergies.map((s) => (
                          <span
                            key={s.id}
                            className="text-[10px] px-2 py-0.5 rounded bg-[#1f152b] border border-[#4d3363] text-[#4ade80]"
                          >
                            ✓ {s.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats summary */}
                    <div className="flex items-center gap-3 text-[10px] font-mono pt-1 text-[#8e8070] border-t border-[#231a29]">
                      <span className="text-[#f87171]">+{rec.totalDamagePct}% Dmg</span>
                      <span className="text-[#4ade80]">+{rec.totalHealingPct}% Heal</span>
                      <span className="text-[#60a5fa]">+{rec.totalMitigationPct}% Mit</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#110d14] border border-[#2b2133] text-center text-xs text-[#786b5c]">
                Roster Anda membutuhkan minimal 4 delver untuk menghitung rekomendasi tim.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

