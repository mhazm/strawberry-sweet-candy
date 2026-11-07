import React, { useState, useMemo } from 'react';
import {
  Waves,
  EyeOff,
  Skull,
  Snowflake,
  Flame,
  Wind,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Search,
  Sparkles,
  Package,
  Shirt,
  Users,
  Compass,
  ArrowRight,
  Info,
} from 'lucide-react';
import { GuildData, Adventurer } from '../../types/savegame';
import {
  CONDITIONS,
  ConditionDefinition,
  ConditionId,
  evaluateRosterForCondition,
  findRecommendedSquadForCondition,
  findConditionByIdOrAlias,
  getConditionsForBiome,
  matchesConditionItem,
  DelverEvaluation,
} from '../../lib/conditions';
import { CLASSES_META } from '../../lib/synergy';
import { useTranslation } from '../../lib/i18n';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tooltip } from '../ui/Tooltip';

interface DungeonConditionViewProps {
  guild: GuildData;
  onDeploySynergy?: (partyIds: string[]) => void;
}

export const DungeonConditionView: React.FC<DungeonConditionViewProps> = ({
  guild,
  onDeploySynergy,
}) => {
  const { t } = useTranslation();
  const roster = useMemo(() => guild.roster || [], [guild.roster]);
  const stash = useMemo(() => guild.stash || [], [guild.stash]);
  const board = useMemo(() => guild.board || [], [guild.board]);

  // Main mode: 'presets' | 'contracts'
  const [activeTab, setActiveTab] = useState<'presets' | 'contracts'>('presets');

  // Currently selected condition ID
  const [selectedConditionId, setSelectedConditionId] = useState<ConditionId>('flooded');

  // Selected board contract ID (if in contracts mode)
  const [selectedContractId, setSelectedContractId] = useState<string | null>(() => {
    return board.length > 0 ? board[0].id : null;
  });

  // Filter & Search states for roster
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'optimal' | 'viable' | 'vulnerable'>('all');
  const [expandedDelverId, setExpandedDelverId] = useState<string | null>(null);

  // Active condition definition
  const currentCondition: ConditionDefinition = useMemo(() => {
    return CONDITIONS[selectedConditionId] || CONDITIONS.flooded;
  }, [selectedConditionId]);

  // Evaluate all delvers against current condition
  const evaluations: DelverEvaluation[] = useMemo(() => {
    return evaluateRosterForCondition(roster, currentCondition, stash);
  }, [roster, currentCondition, stash]);

  // Optimal recommended 4-hero squad
  const recommendedSquad = useMemo(() => {
    return findRecommendedSquadForCondition(roster, currentCondition, stash);
  }, [roster, currentCondition, stash]);

  // Filtered evaluations for the list
  const filteredEvaluations = useMemo(() => {
    return evaluations.filter((ev) => {
      // Tier filter
      if (tierFilter !== 'all' && ev.tier !== tierFilter) return false;
      // Search filter
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const nameMatch = ev.delver.name.toLowerCase().includes(query);
        const classMatch = ev.delver.classId.toLowerCase().includes(query);
        if (!nameMatch && !classMatch) return false;
      }
      return true;
    });
  }, [evaluations, tierFilter, searchTerm]);

  // Condition icon helper
  const getConditionIcon = (id: ConditionId, className: string = 'w-4 h-4') => {
    switch (id) {
      case 'flooded':
        return <Waves className={className} />;
      case 'darkness':
        return <EyeOff className={className} />;
      case 'cursed':
        return <Skull className={className} />;
      case 'deepcold':
        return <Snowflake className={className} />;
      case 'infernal':
        return <Flame className={className} />;
      case 'frozen':
        return <Wind className={className} />;
      default:
        return <Compass className={className} />;
    }
  };

  // Helper to get translated condition name
  const getConditionName = (id: ConditionId): string => {
    switch (id) {
      case 'flooded':
        return t.condFlooded;
      case 'darkness':
        return t.condPitchDark;
      case 'cursed':
        return t.condCursedGround;
      case 'deepcold':
        return t.condDeepCold;
      case 'infernal':
        return t.condInfernal;
      case 'frozen':
        return t.condNumbingFrost;
      default:
        return id;
    }
  };

  // Helper to get translated condition description
  const getConditionDesc = (id: ConditionId): string => {
    switch (id) {
      case 'flooded':
        return t.condFloodedDesc;
      case 'darkness':
        return t.condPitchDarkDesc;
      case 'cursed':
        return t.condCursedGroundDesc;
      case 'deepcold':
        return t.condDeepColdDesc;
      case 'infernal':
        return t.condInfernalDesc;
      case 'frozen':
        return t.condNumbingFrostDesc;
      default:
        return '';
    }
  };

  // Helper to get translated condition penalty summary
  const getConditionPenalty = (id: ConditionId): string => {
    switch (id) {
      case 'flooded':
        return t.condFloodedPenalty;
      case 'darkness':
        return t.condPitchDarkPenalty;
      case 'cursed':
        return t.condCursedGroundPenalty;
      case 'deepcold':
        return t.condDeepColdPenalty;
      case 'infernal':
        return t.condInfernalPenalty;
      case 'frozen':
        return t.condNumbingFrostPenalty;
      default:
        return '';
    }
  };

  // Check if an item exists in stash or is equipped on someone
  const getItemAvailability = (itemName: string) => {
    const inStash = stash.find((it) => it.name.toLowerCase().includes(itemName.toLowerCase()));
    let equippedBy: string | null = null;
    for (const d of roster) {
      if (d.equipment) {
        for (const slotKey of ['weapon', 'armour', 'trinket'] as const) {
          const eq = d.equipment[slotKey];
          if (eq && eq.name.toLowerCase().includes(itemName.toLowerCase())) {
            equippedBy = d.name;
            break;
          }
        }
      }
      if (equippedBy) break;
    }
    return { inStash, equippedBy };
  };

  // Check if any hero in roster has a trait
  const getTraitHolders = (traitId: string) => {
    return roster.filter((d) => (d.traitIds || []).includes(traitId));
  };

  // Handle selecting a board contract
  const handleSelectContract = (contractId: string) => {
    setSelectedContractId(contractId);
    const contract = board.find((b) => b.id === contractId);
    if (!contract) return;

    if (contract.dungeon.condition) {
      const cond = findConditionByIdOrAlias(
        contract.dungeon.condition.key || contract.dungeon.condition.name || ''
      );
      if (cond) {
        setSelectedConditionId(cond.id);
        return;
      }
    }

    // Otherwise pick the first possible condition for this biome
    const biomeConds = getConditionsForBiome(contract.dungeon.theme);
    if (biomeConds.length > 0) {
      setSelectedConditionId(biomeConds[0].id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-[#141018] border border-[#2b2438] rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#dfb15b]/10 border border-[#dfb15b]/30 rounded-lg text-[#dfb15b]">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-wide">{t.conditionTitle}</h1>
                <p className="text-xs text-[#9d8da6] mt-0.5">{t.conditionSubtitle}</p>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-[#0d0a12] p-1 rounded-lg border border-[#2b2438]">
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'presets'
                  ? 'bg-[#dfb15b] text-[#0a080d] shadow font-semibold'
                  : 'text-[#9d8da6] hover:text-white'
              }`}
            >
              {t.conditionTabPresets}
            </button>
            <button
              onClick={() => setActiveTab('contracts')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'contracts'
                  ? 'bg-[#dfb15b] text-[#0a080d] shadow font-semibold'
                  : 'text-[#9d8da6] hover:text-white'
              }`}
            >
              <span>{t.conditionTabContracts}</span>
              {board.length > 0 && (
                <span className="px-1.5 py-0.2 bg-[#dfb15b]/20 text-[#dfb15b] text-[10px] rounded-full font-mono">
                  {board.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Condition Selector Tabs */}
        {activeTab === 'presets' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-5 pt-4 border-t border-[#2b2438]/80">
            {(Object.keys(CONDITIONS) as ConditionId[]).map((condId) => {
              const cond = CONDITIONS[condId];
              const isSelected = selectedConditionId === condId;
              return (
                <button
                  key={condId}
                  onClick={() => setSelectedConditionId(condId)}
                  className={`flex flex-col items-center p-3 rounded-lg border transition-all text-left relative overflow-hidden group ${
                    isSelected
                      ? 'border-[#dfb15b] bg-[#1d1724] shadow-md'
                      : 'border-[#2b2438] bg-[#0d0a12]/60 hover:bg-[#1a1422] hover:border-[#3d324f]'
                  }`}
                >
                  <div
                    className="p-2 rounded-full mb-2 transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: cond.badgeBg,
                      color: cond.accentColor,
                    }}
                  >
                    {getConditionIcon(condId, 'w-4 h-4')}
                  </div>
                  <span
                    className={`text-xs font-semibold truncate text-center ${
                      isSelected ? 'text-white' : 'text-[#c2b6cb]'
                    }`}
                  >
                    {getConditionName(condId)}
                  </span>
                  {isSelected && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: cond.accentColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          /* Active Notice Board Contracts */
          <div className="mt-5 pt-4 border-t border-[#2b2438]/80">
            {board.length === 0 ? (
              <p className="text-xs text-[#7d6f85] italic py-2">{t.conditionNoContracts}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {board.map((item) => {
                  const isSelected = selectedContractId === item.id;
                  const hasCondition = Boolean(item.dungeon.condition);
                  const condKey = item.dungeon.condition?.key || item.dungeon.condition?.name;
                  const matchedCond = condKey ? findConditionByIdOrAlias(condKey) : undefined;
                  const biomeConds = getConditionsForBiome(item.dungeon.theme);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectContract(item.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#dfb15b] bg-[#1a1422] shadow-md'
                          : 'border-[#2b2438] bg-[#0d0a12]/80 hover:bg-[#14101c] hover:border-[#3d324f]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-bold text-white tracking-wide">
                            {item.dungeon.name}
                          </div>
                          <div className="text-[11px] text-[#9d8da6] mt-0.5 capitalize">
                            {t.conditionBiomeLabel}: {item.dungeon.theme} · {item.dungeon.region}
                          </div>
                        </div>
                        <span className="px-1.5 py-0.5 bg-[#dfb15b]/10 text-[#dfb15b] border border-[#dfb15b]/30 rounded text-[10px] font-mono">
                          T{item.dungeon.danger || 1}
                        </span>
                      </div>

                      {/* Active or Biome Conditions */}
                      <div className="mt-3 pt-2.5 border-t border-[#2b2438]/60 flex items-center gap-1.5 flex-wrap">
                        {hasCondition && matchedCond ? (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium"
                            style={{
                              backgroundColor: matchedCond.badgeBg,
                              color: matchedCond.accentColor,
                            }}
                          >
                            {getConditionIcon(matchedCond.id, 'w-3 h-3')}
                            <span>{getConditionName(matchedCond.id)}</span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-[10px] text-[#7d6f85]">
                              {t.conditionPossibleHazards}:
                            </span>
                            {biomeConds.map((bc) => (
                              <button
                                key={bc.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedContractId(item.id);
                                  setSelectedConditionId(bc.id);
                                }}
                                className={`text-[10px] px-1.5 py-0.5 rounded border transition-all ${
                                  selectedConditionId === bc.id
                                    ? 'border-[#dfb15b] text-white bg-[#dfb15b]/20 font-bold'
                                    : 'border-[#2b2438] text-[#9d8da6] hover:text-white'
                                }`}
                              >
                                {getConditionName(bc.id)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content Grid: Left Dossier & Recommended Squad, Right Roster Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Condition Dossier & Optimal Squad */}
        <div className="lg:col-span-5 space-y-6">
          {/* Condition Dossier Card */}
          <div className="bg-[#141018] border border-[#2b2438] rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: currentCondition.accentColor }}
            />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: currentCondition.badgeBg,
                    color: currentCondition.accentColor,
                  }}
                >
                  {getConditionIcon(currentCondition.id, 'w-5 h-5')}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {getConditionName(currentCondition.id)}
                  </h2>
                  <div className="text-[11px] text-[#9d8da6]">
                    {t.conditionBiomeLabel}: {currentCondition.biomes.join(', ')}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#c2b6cb] mt-3 leading-relaxed">
              {getConditionDesc(currentCondition.id)}
            </p>

            {/* Combat Penalty Box */}
            <div className="mt-4 p-3 rounded-lg bg-[#1f151e] border border-[#dc2626]/30 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-[#f87171] uppercase tracking-wider">
                  {t.conditionPenaltyLabel}
                </div>
                <div className="text-xs text-[#e2d9ec] mt-0.5 leading-relaxed">
                  {getConditionPenalty(currentCondition.id)}
                </div>
              </div>
            </div>

            {/* Counter Equipment Section */}
            <div className="mt-4 pt-4 border-t border-[#2b2438]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#dfb15b] flex items-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5" />
                  {t.conditionCounterGearLabel}
                </span>
              </div>
              <div className="space-y-1.5">
                {currentCondition.counterItems.map((item) => {
                  const { inStash, equippedBy } = getItemAvailability(item);
                  return (
                    <div
                      key={item}
                      className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded bg-[#0d0a12] border border-[#2b2438]"
                    >
                      <span className="text-[#e2d9ec] font-medium">{item}</span>
                      {equippedBy ? (
                        <span className="text-[10px] text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/30 px-1.5 py-0.5 rounded font-mono">
                          {t.conditionEquippedBadge}: {equippedBy}
                        </span>
                      ) : inStash ? (
                        <span className="text-[10px] text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/30 px-1.5 py-0.5 rounded font-mono">
                          {t.conditionInStashBadge}
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#7d6f85] italic">--</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Counter Traits Section */}
            <div className="mt-4 pt-4 border-t border-[#2b2438]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#dfb15b] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t.conditionCounterTraitsLabel}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentCondition.counterTraits.map((traitId) => {
                  const holders = getTraitHolders(traitId);
                  const hasHolder = holders.length > 0;
                  return (
                    <Tooltip
                      key={traitId}
                      content={
                        hasHolder
                          ? `Held by: ${holders.map((h) => h.name).join(', ')}`
                          : 'No one in active roster currently has this trait'
                      }
                    >
                      <span
                        className={`text-xs px-2 py-1 rounded border font-mono transition-colors ${
                          hasHolder
                            ? 'bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/30 font-semibold'
                            : 'bg-[#0d0a12] text-[#7d6f85] border-[#2b2438]'
                        }`}
                      >
                        {traitId} {hasHolder && `(${holders.length})`}
                      </span>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recommended Strike Team Card */}
          {recommendedSquad && (
            <div className="bg-[#141018] border border-[#2b2438] rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-[#2b2438]">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#dfb15b]/10 rounded border border-[#dfb15b]/30 text-[#dfb15b]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      {t.conditionRecommendedSquad}
                    </h3>
                    <p className="text-[11px] text-[#9d8da6]">{t.conditionSquadSubtitle}</p>
                  </div>
                </div>

                {onDeploySynergy && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      onDeploySynergy(recommendedSquad.members.map((m) => m.id))
                    }
                    className="flex items-center gap-1.5 text-xs shadow-md"
                  >
                    <span>{t.conditionDeploySynergy}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>

              {/* Squad Members List */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {recommendedSquad.members.map((delver) => {
                  const meta = CLASSES_META[delver.classId.toLowerCase()];
                  const evaluation = evaluations.find((e) => e.delver.id === delver.id);
                  const isOptimal = evaluation?.tier === 'optimal';

                  return (
                    <div
                      key={delver.id}
                      className="p-2.5 rounded-lg bg-[#0d0a12] border border-[#2b2438] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate max-w-[120px]">
                            {delver.name}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-1 rounded ${
                              isOptimal
                                ? 'bg-[#4ade80]/15 text-[#4ade80]'
                                : 'bg-[#dfb15b]/15 text-[#dfb15b]'
                            }`}
                          >
                            {evaluation ? evaluation.score : 70}pts
                          </span>
                        </div>
                        <div className="text-[10px] text-[#9d8da6] capitalize mt-0.5">
                          {meta?.name || delver.classId} · {meta?.role}
                        </div>
                      </div>

                      {/* Matching traits or gear */}
                      <div className="flex items-center gap-1 mt-2 text-[10px] flex-wrap">
                        {evaluation?.matchedCounterTraits.map((tr) => (
                          <span
                            key={tr}
                            className="text-[#4ade80] bg-[#4ade80]/10 px-1 rounded text-[9px] font-mono"
                          >
                            {tr}
                          </span>
                        ))}
                        {evaluation?.equippedCounterItem && (
                          <span className="text-[#38bdf8] bg-[#38bdf8]/10 px-1 rounded text-[9px]">
                            {evaluation.equippedCounterItem.name}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Synergies Triggered by Squad */}
              {recommendedSquad.synergies.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#2b2438]/70">
                  <div className="text-[11px] font-semibold text-[#dfb15b] mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Active Party Synergies ({recommendedSquad.synergies.length}):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recommendedSquad.synergies.map((syn) => (
                      <span
                        key={syn.id}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#dfb15b]/15 text-[#dfb15b] border border-[#dfb15b]/30"
                      >
                        {syn.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column (7 cols): Full Roster Readiness Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#141018] border border-[#2b2438] rounded-xl p-5 shadow-lg">
            {/* Top Toolbar: Search & Tier Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2b2438]">
              <div>
                <h2 className="text-base font-bold text-white tracking-wide">
                  {t.conditionRosterReadiness}
                </h2>
                <div className="text-xs text-[#9d8da6] mt-0.5">
                  {filteredEvaluations.length} / {roster.length} {t.conditionFilterAll}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#7d6f85]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter heroes..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0d0a12] border border-[#2b2438] text-xs text-white placeholder-[#7d6f85] focus:outline-none focus:border-[#dfb15b]"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <button
                onClick={() => setTierFilter('all')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  tierFilter === 'all'
                    ? 'bg-[#dfb15b] text-[#0a080d] font-bold shadow'
                    : 'bg-[#0d0a12] text-[#9d8da6] border border-[#2b2438] hover:text-white'
                }`}
              >
                {t.conditionFilterAll}
              </button>
              <button
                onClick={() => setTierFilter('optimal')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  tierFilter === 'optimal'
                    ? 'bg-[#22c55e] text-[#0a080d] font-bold shadow'
                    : 'bg-[#0d0a12] text-[#4ade80] border border-[#22c55e]/30 hover:bg-[#22c55e]/10'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>{t.conditionFilterOptimal}</span>
              </button>
              <button
                onClick={() => setTierFilter('viable')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  tierFilter === 'viable'
                    ? 'bg-[#dfb15b] text-[#0a080d] font-bold shadow'
                    : 'bg-[#0d0a12] text-[#dfb15b] border border-[#dfb15b]/30 hover:bg-[#dfb15b]/10'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>{t.conditionFilterViable}</span>
              </button>
              <button
                onClick={() => setTierFilter('vulnerable')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  tierFilter === 'vulnerable'
                    ? 'bg-[#ef4444] text-white font-bold shadow'
                    : 'bg-[#0d0a12] text-[#f87171] border border-[#ef4444]/30 hover:bg-[#ef4444]/10'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>{t.conditionFilterVulnerable}</span>
              </button>
            </div>

            {/* Delvers List */}
            <div className="mt-4 space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredEvaluations.length === 0 ? (
                <div className="text-center py-10 text-[#7d6f85] text-xs">
                  No delvers match the selected criteria.
                </div>
              ) : (
                filteredEvaluations.map((ev) => {
                  const { delver, score, tier, factors } = ev;
                  const meta = CLASSES_META[delver.classId.toLowerCase()];
                  const isExpanded = expandedDelverId === delver.id;

                  // Tier badge styling
                  const tierColors = {
                    optimal: 'bg-[#22c55e]/15 text-[#4ade80] border-[#22c55e]/30',
                    viable: 'bg-[#dfb15b]/15 text-[#dfb15b] border-[#dfb15b]/30',
                    vulnerable: 'bg-[#ef4444]/15 text-[#f87171] border-[#ef4444]/30',
                  }[tier];

                  return (
                    <div
                      key={delver.id}
                      className="p-3.5 rounded-lg bg-[#0d0a12] border border-[#2b2438] hover:border-[#3d324f] transition-all"
                    >
                      <div className="flex items-center justify-between gap-3">
                        {/* Delver Info */}
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#141018] border border-[#2b2438] flex items-center justify-center font-bold text-xs text-[#dfb15b]">
                            {delver.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-2">
                              <span>{delver.name}</span>
                              <span className="text-[10px] font-normal text-[#9d8da6]">
                                Lvl {delver.level || 1}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#9d8da6] capitalize flex items-center gap-2 mt-0.5">
                              <span>{meta?.name || delver.classId}</span>
                              <span>·</span>
                              <span>{meta?.role || delver.role}</span>
                              <span>·</span>
                              <span className="font-mono text-[#c2b6cb]">
                                CA {delver.currentAbility}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Readiness Score & Tier Badge */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-xs font-mono font-bold text-white">
                              {score} / 100
                            </div>
                            {/* Small progress bar */}
                            <div className="w-16 h-1.5 rounded-full bg-[#1f1a26] overflow-hidden mt-1">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${score}%`,
                                  backgroundColor:
                                    tier === 'optimal'
                                      ? '#22c55e'
                                      : tier === 'viable'
                                      ? '#dfb15b'
                                      : '#ef4444',
                                }}
                              />
                            </div>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border uppercase tracking-wider ${tierColors}`}
                          >
                            {tier}
                          </span>

                          <button
                            onClick={() =>
                              setExpandedDelverId(isExpanded ? null : delver.id)
                            }
                            className="p-1 rounded text-[#7d6f85] hover:text-white transition-colors"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Badges Bar: Trait / Gear Counters */}
                      <div className="mt-2.5 pt-2 border-t border-[#2b2438]/50 flex items-center gap-1.5 flex-wrap">
                        {ev.matchedCounterTraits.map((tr) => (
                          <span
                            key={tr}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/30 flex items-center gap-1"
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>{tr}</span>
                          </span>
                        ))}
                        {ev.equippedCounterItem && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 flex items-center gap-1">
                            <Shirt className="w-2.5 h-2.5" />
                            <span>{ev.equippedCounterItem.name}</span>
                          </span>
                        )}
                        {ev.stashCounterItem && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#eab308]/15 text-[#facc15] border border-[#eab308]/30 flex items-center gap-1">
                            <Package className="w-2.5 h-2.5" />
                            <span>{t.conditionGearAvailableStash}: {ev.stashCounterItem.name}</span>
                          </span>
                        )}
                        {ev.matchedVulnerableTraits.map((tr) => (
                          <span
                            key={tr}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#ef4444]/15 text-[#f87171] border border-[#ef4444]/30 flex items-center gap-1"
                          >
                            <AlertTriangle className="w-2.5 h-2.5" />
                            <span>{tr}</span>
                          </span>
                        ))}
                      </div>

                      {/* Expandable Breakdown Drawer */}
                      {isExpanded && (
                        <div className="mt-3 p-3 rounded bg-[#07050a] border border-[#2b2438] text-xs space-y-1.5 animate-fadeIn">
                          <div className="font-semibold text-[#dfb15b] mb-1">
                            {t.conditionFactorsLabel}:
                          </div>
                          {factors.map((f, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-[11px]"
                            >
                              <span
                                className={
                                  f.type === 'positive'
                                    ? 'text-[#4ade80]'
                                    : f.type === 'negative'
                                    ? 'text-[#f87171]'
                                    : 'text-[#9d8da6]'
                                }
                              >
                                {f.text}
                              </span>
                              <span
                                className={`font-mono font-bold ${
                                  f.delta > 0
                                    ? 'text-[#4ade80]'
                                    : f.delta < 0
                                    ? 'text-[#f87171]'
                                    : 'text-[#9d8da6]'
                                }`}
                              >
                                {f.delta > 0 ? `+${f.delta}` : f.delta}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
