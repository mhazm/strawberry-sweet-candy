import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Heart,
  Users,
  UserPlus,
  Calendar,
  CheckCircle,
  Trash2,
  Dices,
  LayoutGrid,
  Table as TableIcon,
  Plus,
} from 'lucide-react';
import { Adventurer, RecruitCandidate, EquipmentItem } from '../../types/savegame';
import { HeroCard } from './HeroCard';
import { HeroModal } from './HeroModal';
import { RosterTableView } from './RosterTableView';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { ROLES } from '../../lib/constants';
import { rollWonderkidGacha } from '../../lib/wonderkid';
import { useTranslation } from '../../lib/i18n';

interface RosterViewProps {
  roster: Adventurer[];
  recruits?: RecruitCandidate[];
  stash?: EquipmentItem[];
  onChange: (updatedRoster: Adventurer[]) => void;
  onChangeRecruits?: (updatedRecruits: RecruitCandidate[]) => void;
  currentDay?: number;
  initialViewMode?: 'roster' | 'recruits';
}

export const RosterView: React.FC<RosterViewProps> = ({
  roster,
  recruits = [],
  stash = [],
  onChange,
  onChangeRecruits,
  currentDay = 1,
  initialViewMode = 'roster',
}) => {
  const { t, getTraitName, getTraitDesc } = useTranslation();
  const [viewMode, setViewMode] = useState<'roster' | 'recruits'>(initialViewMode);
  const [displayFormat, setDisplayFormat] = useState<'table' | 'cards'>('table');
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(
    roster.length > 0 ? roster[roster.length - 1].id : null
  );

  // Modal State
  const [modalHero, setModalHero] = useState<Adventurer | null>(null);
  const [modalTab, setModalTab] = useState<
    'attributes' | 'hidden' | 'health' | 'traits' | 'equipment'
  >('attributes');
  const [editingRecruitIndex, setEditingRecruitIndex] = useState<number | null>(null);

  // Search & Filters for Cards view
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'level' | 'ca' | 'pa' | 'name'>('level');

  // Filtered Roster for Cards view
  const filteredRoster = useMemo(() => {
    return roster
      .filter((hero) => {
        const matchesSearch =
          hero.name.toLowerCase().includes(search.toLowerCase()) ||
          hero.classId.toLowerCase().includes(search.toLowerCase()) ||
          hero.raceId.toLowerCase().includes(search.toLowerCase());
        const matchesRole =
          selectedRole === 'all' || hero.role.toLowerCase() === selectedRole.toLowerCase();
        return matchesSearch && matchesRole;
      })
      .sort((a, b) => {
        if (sortBy === 'level') return b.level - a.level;
        if (sortBy === 'ca') return b.currentAbility - a.currentAbility;
        if (sortBy === 'pa') return b.potentialAbility - a.potentialAbility;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [roster, search, selectedRole, sortBy]);

  // Recruits filter
  const filteredRecruits = useMemo(() => {
    return recruits.filter((r) => {
      const adv = r.adventurer;
      if (!adv) return false;
      const matchesSearch =
        adv.name.toLowerCase().includes(search.toLowerCase()) ||
        adv.classId.toLowerCase().includes(search.toLowerCase()) ||
        adv.raceId.toLowerCase().includes(search.toLowerCase());
      const matchesRole =
        selectedRole === 'all' || adv.role.toLowerCase() === selectedRole.toLowerCase();
      return matchesSearch && matchesRole;
    });
  }, [recruits, search, selectedRole]);

  // Update Hero handler
  const handleUpdateHero = (updatedHero: Adventurer) => {
    if (editingRecruitIndex !== null && onChangeRecruits) {
      const newRecruits = [...recruits];
      newRecruits[editingRecruitIndex] = {
        ...newRecruits[editingRecruitIndex],
        adventurer: updatedHero,
      };
      onChangeRecruits(newRecruits);
      setEditingRecruitIndex(null);
    } else {
      const newRoster = roster.map((h) =>
        h.id === updatedHero.id ? updatedHero : h
      );
      onChange(newRoster);
    }
  };

  // Quick Heal single delver
  const handleQuickHeal = (hero: Adventurer) => {
    const updated = {
      ...hero,
      condition: 100,
      morale: 100,
      stress: 0,
      fatigue: 0,
      injury: null,
    };
    handleUpdateHero(updated);
  };

  // Quick Heal All
  const handleHealAllRoster = () => {
    const healed = roster.map((h) => ({
      ...h,
      condition: 100,
      morale: 100,
      stress: 0,
      fatigue: 0,
      injury: null,
    }));
    onChange(healed);
  };

  // Sign Recruit to active roster
  const handleSignRecruit = (candidate: RecruitCandidate) => {
    if (!onChangeRecruits) return;
    const newRecruits = recruits.filter((r) => r.adventurer.id !== candidate.adventurer.id);
    const newRoster = [...roster, candidate.adventurer];
    onChange(newRoster);
    onChangeRecruits(newRecruits);
  };

  // Dismiss recruit
  const handleDismissRecruit = (candidate: RecruitCandidate) => {
    if (!onChangeRecruits) return;
    const newRecruits = recruits.filter((r) => r.adventurer.id !== candidate.adventurer.id);
    onChangeRecruits(newRecruits);
  };

  // Release Delver from Active Roster
  const handleReleaseHero = (heroId: string) => {
    const heroToRelease = roster.find((h) => h.id === heroId);
    if (!heroToRelease) return;
    if (
      window.confirm(
        `Are you sure you want to release ${heroToRelease.name} from the guild?`
      )
    ) {
      const newRoster = roster.filter((h) => h.id !== heroId);
      onChange(newRoster);
      if (selectedHeroId === heroId && newRoster.length > 0) {
        setSelectedHeroId(newRoster[0].id);
      }
    }
  };

  // Gacha All Candidates into Wonderkids
  const handleMakeAllRecruitsWonderkids = () => {
    if (!onChangeRecruits) return;
    const buffedRecruits = recruits.map((r) => {
      const rolled = rollWonderkidGacha(r.adventurer);
      return {
        ...r,
        adventurer: {
          ...r.adventurer,
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
        },
      };
    });
    onChangeRecruits(buffedRecruits);
  };

  return (
    <div className="h-full flex flex-col space-y-3 max-w-full">
      {/* Top Controls: Mode Switcher & Format Toggle */}
      <div className="flex items-center justify-between gap-3 shrink-0">
        {/* View Mode Pills (Active Roster vs Delver Market) */}
        <div className="flex items-center gap-1.5 p-1 bg-[#131018] border border-[#261f2e] rounded-lg">
          <button
            onClick={() => setViewMode('roster')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              viewMode === 'roster'
                ? 'bg-[#291e14] text-[#f5cb71] border border-[#544122] shadow-sm'
                : 'text-[#8e8273] hover:text-[#c9bea9]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            {t.navRoster} ({roster.length}/9)
          </button>
          <button
            onClick={() => setViewMode('recruits')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              viewMode === 'recruits'
                ? 'bg-[#182638] text-[#86afdf] border border-[#294269] shadow-sm'
                : 'text-[#8e8273] hover:text-[#c9bea9]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            {t.navRecruits} ({recruits.length})
          </button>
        </div>

        {/* Right Action & Format Toggle */}
        <div className="flex items-center gap-2">
          {viewMode === 'roster' && (
            <>
              {/* Table / Cards toggle */}
              <div className="flex items-center p-1 bg-[#131018] border border-[#261f2e] rounded-lg">
                <button
                  onClick={() => setDisplayFormat('table')}
                  title="In-Game Table & Inspector View (Matching In-Game UI)"
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                    displayFormat === 'table'
                      ? 'bg-[#241a12] text-[#f5cb71] border border-[#4a3922]'
                      : 'text-[#7e7161] hover:text-[#c9bea9]'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.tableView}</span>
                </button>
                <button
                  onClick={() => setDisplayFormat('cards')}
                  title="Card Grid View"
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                    displayFormat === 'cards'
                      ? 'bg-[#241a12] text-[#f5cb71] border border-[#4a3922]'
                      : 'text-[#7e7161] hover:text-[#c9bea9]'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.cardView}</span>
                </button>
              </div>

              {/* Quick Actions */}
              <Button
                variant="emerald"
                size="sm"
                icon={<Heart className="w-3.5 h-3.5" />}
                onClick={handleHealAllRoster}
              >
                {t.healAll}
              </Button>
            </>
          )}

          {viewMode === 'recruits' && (
            <Button
              variant="gold"
              size="sm"
              icon={<Dices className="w-3.5 h-3.5 text-[#151218]" />}
              onClick={handleMakeAllRecruitsWonderkids}
              disabled={recruits.length === 0}
            >
              {t.gachaAllRecruits}
            </Button>
          )}
        </div>
      </div>

      {/* Mode 1: Active Roster */}
      {viewMode === 'roster' && (
        <div className="flex-1 min-h-0">
          {displayFormat === 'table' ? (
            /* Authentic In-Game Table & Split Inspector */
            <RosterTableView
              roster={roster}
              selectedHeroId={selectedHeroId}
              onSelectHero={setSelectedHeroId}
              onUpdateHero={handleUpdateHero}
              onOpenFullModal={(hero) => {
                setModalHero(hero);
                setModalTab('attributes');
              }}
              onOpenEquipmentModal={(hero) => {
                setModalHero(hero);
                setModalTab('equipment');
              }}
              onOpenTraitsModal={(hero) => {
                setModalHero(hero);
                setModalTab('traits');
              }}
              onReleaseHero={handleReleaseHero}
            />
          ) : (
            /* Cards Grid View */
            <div className="space-y-4 overflow-y-auto h-full pr-1">
              {/* Filter bar for cards */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#18151f] border border-[#241c29] rounded-xl text-xs">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Search className="w-3.5 h-3.5 text-[#7e7161]" />
                  <input
                    type="text"
                    placeholder={t.searchDelvers}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-[#100d14] border border-[#31253a] rounded px-3 py-1.5 text-xs text-[#c9bea9] focus:outline-none focus:border-[#dfb15b] w-64"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#7e7161]">{t.colRole}:</span>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="bg-[#100d14] border border-[#31253a] rounded px-2 py-1 text-xs text-[#c9bea9] focus:outline-none focus:border-[#dfb15b]"
                  >
                    <option value="all">{t.filterAll}</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r.toUpperCase()}
                      </option>
                    ))}
                  </select>

                  <span className="text-[#7e7161] ml-2">{t.sortBy}:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#100d14] border border-[#31253a] rounded px-2 py-1 text-xs text-[#c9bea9] focus:outline-none focus:border-[#dfb15b]"
                  >
                    <option value="level">{t.sortLevel}</option>
                    <option value="ca">{t.sortCA}</option>
                    <option value="pa">{t.sortPA}</option>
                    <option value="name">{t.sortName}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRoster.map((hero) => (
                  <HeroCard
                    key={hero.id}
                    hero={hero}
                    onEdit={(h) => {
                      setEditingRecruitIndex(null);
                      setModalHero(h);
                      setModalTab('attributes');
                    }}
                    onQuickHeal={handleQuickHeal}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Scouting & Recruitment Board Grid */}
      {viewMode === 'recruits' && (
        <div className="flex-1 overflow-y-auto min-h-0 pr-1">
          {filteredRecruits.length === 0 ? (
            <div className="p-12 text-center bg-[#18151f]/60 border border-[#2e2536] rounded-2xl">
              <UserPlus className="w-10 h-10 text-[#695d4e] mx-auto mb-3" />
              <p className="text-[#8e8273] font-medium">
                No recruitment candidates currently on the board.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecruits.map((candidate, idx) => {
                const adv = candidate.adventurer;
                return (
                  <div
                    key={adv.id || idx}
                    className="p-4 bg-[#18151f] border border-[#284166] hover:border-[#426a9e] rounded-xl flex flex-col justify-between shadow-sm hover:shadow-xl transition-all"
                  >
                    <div>
                      {/* Candidate Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-rpg font-bold text-[#f0e8db] text-base">
                            {adv.name}
                          </h3>
                          <div className="text-xs text-[#8e8273] capitalize mt-0.5">
                            {adv.raceId} • {adv.classId} ({adv.role}) • {t.ageLabel} {adv.age}
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#182638] text-[#86afdf] border border-[#294269]">
                          Lv.{adv.level}
                        </span>
                      </div>

                      {/* CA / PA & Departure */}
                      <div className="mt-3 p-2.5 rounded-lg bg-[#131018] border border-[#261f2e] text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-[#8e8273]">CA / PA:</span>
                          <span className="font-mono font-bold">
                            <span className="text-[#dfb15b]">{adv.currentAbility}</span>
                            <span className="text-[#594d42]"> / </span>
                            <span className="text-[#c78ade]">{adv.potentialAbility}</span>
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] text-[#8e8273]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#86afdf]" /> {t.seasonCalendar}:
                          </span>
                          <span className="font-mono text-[#c9bea9]">
                            {t.day} {candidate.departsDay} (in {Math.max(0, candidate.departsDay - currentDay)} {t.day.toLowerCase()})
                          </span>
                        </div>
                      </div>

                      {/* Traits preview */}
                      <div className="mt-2.5 flex items-center gap-1 flex-wrap min-h-[22px]">
                        {adv.traitIds?.slice(0, 3).map((trId) => (
                          <Tooltip
                            key={trId}
                            title={getTraitName(trId)}
                            content={getTraitDesc(trId)}
                          >
                            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-[#1b1723] text-[#8e8273] hover:text-[#c9bea9] border border-[#2d2333] cursor-help">
                              {getTraitName(trId)}
                            </span>
                          </Tooltip>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-3 border-t border-[#261f2e] flex items-center justify-between gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setEditingRecruitIndex(idx);
                          setModalHero(adv);
                          setModalTab('attributes');
                        }}
                      >
                        Inspect & Edit
                      </Button>

                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="danger"
                          size="sm"
                          className="px-2 py-1 text-xs"
                          icon={<Trash2 className="w-3 h-3" />}
                          onClick={() => handleDismissRecruit(candidate)}
                          title="Dismiss candidate from recruitment board"
                        />
                        <Button
                          variant="emerald"
                          size="sm"
                          className="text-xs"
                          icon={<CheckCircle className="w-3.5 h-3.5" />}
                          onClick={() => handleSignRecruit(candidate)}
                        >
                          Sign to Roster
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Deep Character Sheet Modal */}
      {modalHero && (
        <HeroModal
          hero={modalHero}
          isOpen={!!modalHero}
          initialTab={modalTab}
          stash={stash}
          onClose={() => {
            setModalHero(null);
            setEditingRecruitIndex(null);
          }}
          onSave={handleUpdateHero}
        />
      )}
    </div>
  );
};
