import React, { useState, useMemo } from 'react';
import {
  Heart,
  Swords,
  Brain,
  SlidersHorizontal,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Shield,
  Search,
  X,
  FileText,
  Key,
  Wand2,
  Edit3,
} from 'lucide-react';
import { Adventurer, EquipmentItem } from '../../types/savegame';
import {
  getConvictionInfo,
  getFlawInfo,
  isClassPillar,
  ROLES,
} from '../../lib/constants';
import { getStatTierColor } from '../../lib/utils';
import { rollWonderkidGacha } from '../../lib/wonderkid';
import { TraitBadge } from './TraitBadge';
import { RaceInfoTooltip } from './RaceInfoTooltip';
import { useTranslation } from '../../lib/i18n';
import { Tooltip } from '../ui/Tooltip';

interface RosterTableViewProps {
  roster: Adventurer[];
  selectedHeroId: string | null;
  onSelectHero: (heroId: string) => void;
  onUpdateHero: (updated: Adventurer) => void;
  onOpenFullModal: (hero: Adventurer) => void;
  onOpenEquipmentModal: (hero: Adventurer) => void;
  onOpenTraitsModal: (hero: Adventurer) => void;
  onReleaseHero: (heroId: string) => void;
}

export const RosterTableView: React.FC<RosterTableViewProps> = ({
  roster,
  selectedHeroId,
  onSelectHero,
  onUpdateHero,
  onOpenFullModal,
  onOpenEquipmentModal,
  onOpenTraitsModal,
  onReleaseHero,
}) => {
  const { t, getAttrName, getAttrDesc, getTraitName } = useTranslation();
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [postFilter, setPostFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'ca' | 'pa' | 'level' | 'name'>('rating');
  const [search, setSearch] = useState('');
  const [showWhoTheyAre, setShowWhoTheyAre] = useState(true);

  // Group delvers by post (Vanguard, Second Watch, Reserve)
  const filteredDelvers = useMemo(() => {
    return roster.filter((h) => {
      const matchSearch =
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.classId.toLowerCase().includes(search.toLowerCase());
      const matchRole =
        roleFilter === 'all' || h.role.toLowerCase() === roleFilter.toLowerCase();
      const matchPost =
        postFilter === 'all' ||
        (postFilter === 'vanguard' && (h.post === 'vanguard' || !h.post)) ||
        (postFilter === 'secondWatch' && h.post === 'secondWatch');
      return matchSearch && matchRole && matchPost;
    });
  }, [roster, search, roleFilter, postFilter]);

  // Sort delvers
  const sortedDelvers = useMemo(() => {
    return [...filteredDelvers].sort((a, b) => {
      if (sortBy === 'rating') {
        const ratingA = a.firstJoin?.rating || Math.round(a.currentAbility / 2);
        const ratingB = b.firstJoin?.rating || Math.round(b.currentAbility / 2);
        return ratingB - ratingA;
      }
      if (sortBy === 'ca') return b.currentAbility - a.currentAbility;
      if (sortBy === 'pa') return b.potentialAbility - a.potentialAbility;
      if (sortBy === 'level') return b.level - a.level;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [filteredDelvers, sortBy]);

  // Groups
  const vanguardDelvers = sortedDelvers.filter(
    (h) => h.post === 'vanguard' || (!h.post && roster.indexOf(h) < 4)
  );
  const secondWatchDelvers = sortedDelvers.filter(
    (h) => h.post === 'secondWatch' || (!h.post && roster.indexOf(h) >= 4)
  );
  const otherDelvers = sortedDelvers.filter(
    (h) => h.post && h.post !== 'vanguard' && h.post !== 'secondWatch'
  );

  // Selected delver (default to first or active selection)
  const selectedHero = useMemo(() => {
    if (!selectedHeroId && sortedDelvers.length > 0) {
      return sortedDelvers[0];
    }
    return sortedDelvers.find((h) => h.id === selectedHeroId) || sortedDelvers[0] || null;
  }, [selectedHeroId, sortedDelvers]);

  // Make Wonderkid on currently selected delver
  const handleMakeWonderkid = () => {
    if (!selectedHero) return;
    const rolled = rollWonderkidGacha(selectedHero);
    const updated: Adventurer = {
      ...selectedHero,
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
    };
    onUpdateHero(updated);
  };

  // Quick stat adjust
  const handleAdjustStat = (key: keyof typeof selectedHero.attributes, delta: number) => {
    if (!selectedHero) return;
    const currentVal = selectedHero.attributes[key] || 10;
    const newVal = Math.max(1, Math.min(20, currentVal + delta));
    const updated: Adventurer = {
      ...selectedHero,
      attributes: {
        ...selectedHero.attributes,
        [key]: newVal,
      },
    };
    onUpdateHero(updated);
  };

  return (
    <div className="flex h-full gap-4 text-[#c9bea9] overflow-hidden select-none">
      {/* LEFT PANE: In-Game Roster Table (58% width) */}
      <div className="flex-1 flex flex-col bg-[#141018] border border-[#241c29] rounded-xl overflow-hidden shadow-xl min-w-0">
        {/* Table Subheader Bar */}
        <div className="p-3 border-b border-[#241c29] bg-[#17131d] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-rpg font-bold text-[#dfb15b] tracking-wider uppercase text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dfb15b]" />
              {t.rosterTitle} {roster.length}/9
            </span>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#100d14] border border-[#31253a] rounded px-2.5 py-1 text-[11px] text-[#c9bea9] focus:outline-none focus:border-[#dfb15b]"
            >
              <option value="all">{t.allRoles}</option>
              <option value="dps">DPS</option>
              <option value="tank">Tank</option>
              <option value="healer">Healer</option>
              <option value="support">Support</option>
            </select>

            {/* Post Filter */}
            <select
              value={postFilter}
              onChange={(e) => setPostFilter(e.target.value)}
              className="bg-[#100d14] border border-[#31253a] rounded px-2.5 py-1 text-[11px] text-[#c9bea9] focus:outline-none focus:border-[#dfb15b]"
            >
              <option value="all">{t.allPosts}</option>
              <option value="vanguard">{t.vanguard}</option>
              <option value="secondWatch">{t.secondWatch}</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#100d14] border border-[#31253a] rounded px-2.5 py-1 text-[11px] text-[#c9bea9] focus:outline-none focus:border-[#dfb15b]"
            >
              <option value="rating">{t.sortRating}</option>
              <option value="ca">{t.sortCA}</option>
              <option value="pa">{t.sortPA}</option>
              <option value="level">{t.sortLevel}</option>
              <option value="name">{t.sortName}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3 h-3 text-[#6e6051] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.searchDelvers}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-36 bg-[#100d14] border border-[#31253a] rounded pl-7 pr-2 py-0.5 text-[11px] text-[#c9bea9] placeholder:text-[#635545] focus:outline-none focus:border-[#dfb15b]"
              />
            </div>
            <span className="text-[11px] font-mono text-[#786c5f]">
              {sortedDelvers.length} {t.delvers}
            </span>
          </div>
        </div>

        {/* Table Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Table Header Row */}
          <div className="grid grid-cols-12 gap-1 px-4 py-2 border-b border-[#211926] bg-[#120f16] text-[10px] font-bold uppercase tracking-wider text-[#6e6051]">
            <div className="col-span-3">{t.colName}</div>
            <div className="col-span-2 text-center">{t.colRole}</div>
            <div className="col-span-1 text-center">{t.colVeterancy}</div>
            <div className="col-span-1 text-center">{t.colAge}</div>
            <div className="col-span-2 text-center">{t.colFit}</div>
            <div className="col-span-1 text-center">{t.colMood}</div>
            <div className="col-span-1 text-center">{t.colRating}</div>
            <div className="col-span-1 text-center">{t.colAbility}</div>
          </div>

          {/* Group: VANGUARD */}
          {vanguardDelvers.length > 0 && (
            <div className="border-b border-[#241c29]">
              <div className="px-4 py-1.5 bg-[#17131d]/80 text-[11px] font-bold uppercase tracking-wider text-[#d4b26f] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#dfb15b]" />
                {t.vanguard} {vanguardDelvers.length}
              </div>
              <div>
                {vanguardDelvers.map((hero) => (
                  <DelverTableRow
                    key={hero.id}
                    hero={hero}
                    isSelected={selectedHero?.id === hero.id}
                    onSelect={() => onSelectHero(hero.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Group: SECOND WATCH */}
          {secondWatchDelvers.length > 0 && (
            <div className="border-b border-[#241c29]">
              <div className="px-4 py-1.5 bg-[#17131d]/80 text-[11px] font-bold uppercase tracking-wider text-[#d4b26f] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#dfb15b]" />
                {t.secondWatch} {secondWatchDelvers.length}
              </div>
              <div>
                {secondWatchDelvers.map((hero) => (
                  <DelverTableRow
                    key={hero.id}
                    hero={hero}
                    isSelected={selectedHero?.id === hero.id}
                    onSelect={() => onSelectHero(hero.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Group: RESERVES */}
          {otherDelvers.length > 0 && (
            <div>
              <div className="px-4 py-1.5 bg-[#17131d]/80 text-[11px] font-bold uppercase tracking-wider text-[#d4b26f] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#dfb15b]" />
                {t.reserves} {otherDelvers.length}
              </div>
              <div>
                {otherDelvers.map((hero) => (
                  <DelverTableRow
                    key={hero.id}
                    hero={hero}
                    isSelected={selectedHero?.id === hero.id}
                    onSelect={() => onSelectHero(hero.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE: In-Game Delver Inspector Panel (42% width) */}
      {selectedHero && (
        <div className="w-[450px] shrink-0 bg-[#141018] border border-[#241c29] rounded-xl flex flex-col justify-between overflow-hidden shadow-2xl text-xs">
          <div className="overflow-y-auto p-4 space-y-4">
            {/* Who They Are Section */}
            <div className="border border-[#261f2e] bg-[#18141f] rounded-lg p-3 space-y-2 relative">
              <div className="flex items-center justify-between border-b border-[#261f2e] pb-1.5">
                <button
                  onClick={() => setShowWhoTheyAre(!showWhoTheyAre)}
                  className="flex items-center gap-1.5 text-xs font-rpg font-bold text-[#dfb15b] uppercase tracking-wider cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dfb15b]" />
                  {t.whoTheyAre}
                </button>

                {/* Race Info Tooltip trigger */}
                <RaceInfoTooltip raceId={selectedHero.raceId}>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#1f1726] border border-[#3d2e4a] text-[#dfb15b] capitalize flex items-center gap-1 hover:border-[#dfb15b] transition-colors cursor-help">
                    <span>{selectedHero.raceId}</span>
                    <span className="text-[#a4864c] text-[9px]">ⓘ</span>
                  </span>
                </RaceInfoTooltip>
              </div>

              {showWhoTheyAre && (
                <div className="space-y-2 text-[11px]">
                  {/* Conviction */}
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#7e7161] block">
                      {t.conviction}
                    </span>
                    <p className="text-[#c9bea9] mt-0.5 leading-snug">
                      <strong className="text-[#f0e8db] font-semibold">
                        {getConvictionInfo(selectedHero.stakes?.conviction).name}.
                      </strong>{' '}
                      {getConvictionInfo(selectedHero.stakes?.conviction).text}
                    </p>
                  </div>

                  {/* Leans */}
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#7e7161] block">
                      {t.leans}
                    </span>
                    <p className="text-[#86afdf] mt-0.5 font-medium">
                      {getConvictionInfo(selectedHero.stakes?.conviction).leans}
                    </p>
                  </div>

                  {/* Vow */}
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#7e7161] block">
                      {t.vow}
                    </span>
                    <p className="text-[#c9bea9] mt-0.5 leading-snug">
                      <strong className="text-[#f0e8db] font-semibold">
                        {selectedHero.stakes?.vow?.name || 'Something They Did'}.
                      </strong>{' '}
                      {selectedHero.stakes?.vow?.text ||
                        'Means to go back to the Ironhold Deeps and answer for something they did there.'}
                    </p>
                  </div>

                  {/* Flaw */}
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#7e7161] block">
                      {t.flaw}
                    </span>
                    <p className="text-[#e67e8c] mt-0.5 leading-snug">
                      <strong className="text-[#e67e8c] font-semibold">
                        {getFlawInfo(selectedHero.stakes?.flaw).name}.
                      </strong>{' '}
                      {getFlawInfo(selectedHero.stakes?.flaw).text}
                    </p>
                  </div>

                  {/* Notes Editable Textarea */}
                  <div className="pt-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#7e7161] block mb-1">
                      {t.yourNotes}
                    </span>
                    <textarea
                      rows={2}
                      value={(selectedHero as any).notes || ''}
                      onChange={(e) => {
                        onUpdateHero({
                          ...selectedHero,
                          notes: e.target.value,
                        } as any);
                      }}
                      placeholder={t.notesPlaceholder}
                      className="w-full bg-[#110d14] border border-[#2b2233] rounded p-2 text-[11px] text-[#f0e8db] placeholder:text-[#524436] focus:outline-none focus:border-[#dfb15b] resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* How They Play (Traits) Section with positive/negative/neutral colors and hover tooltips */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-rpg font-bold text-[#dfb15b] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dfb15b]" />
                  {t.howTheyPlay}
                </span>
                <button
                  onClick={() => onOpenTraitsModal(selectedHero)}
                  className="text-[10px] font-semibold text-[#a4864c] hover:text-[#f5cb71] transition-colors cursor-pointer"
                >
                  {t.editTraits} ({selectedHero.traitIds?.length || 0}) →
                </button>
              </div>

              {/* Trait badges with color classification & rich hover tooltip */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedHero.traitIds?.map((tId) => (
                  <TraitBadge key={tId} traitId={tId} />
                ))}
                {(!selectedHero.traitIds || selectedHero.traitIds.length === 0) && (
                  <span className="text-[#635545] text-xs italic">
                    {t.noTraits}
                  </span>
                )}
              </div>
            </div>

            {/* LOADOUT: Equipment slots with "Edit Gear Stats" */}
            <div className="border border-[#261f2e] bg-[#18141f] rounded-lg p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#a4864c]">
                  {t.loadout}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px]">
                {/* Weapon Slot */}
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#6e6051] block mb-0.5">
                    {t.weapon}
                  </span>
                  <div className="p-1.5 bg-[#100d14] border border-[#2b2233] rounded text-[#f0e8db] font-medium truncate">
                    {selectedHero.equipment?.weapon?.name || 'Standard Weapon'}
                  </div>
                </div>

                {/* Armour Slot */}
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#6e6051] block mb-0.5">
                    {t.armour}
                  </span>
                  <div className="p-1.5 bg-[#100d14] border border-[#2b2233] rounded text-[#f0e8db] font-medium truncate">
                    {selectedHero.equipment?.armour?.name || 'Standard Armour'}
                  </div>
                </div>

                {/* Trinket Slot */}
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#6e6051] block mb-0.5">
                    {t.trinket}
                  </span>
                  <div className="p-1.5 bg-[#100d14] border border-[#2b2233] rounded text-[#8e8273] font-medium truncate">
                    {selectedHero.equipment?.trinket?.name || 'None'}
                  </div>
                </div>
              </div>

              {/* Direct "Edit Gear Stats" Button */}
              <button
                onClick={() => onOpenEquipmentModal(selectedHero)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-[#201810] hover:bg-[#2c2014] border border-[#594426] text-[#dfb15b] hover:text-[#f5cb71] rounded text-xs font-rpg font-bold tracking-wider uppercase transition-colors cursor-pointer"
              >
                <Shield className="w-3 h-3 text-[#dfb15b]" />
                {t.editGearStats}
              </button>
            </div>

            {/* ATTRIBUTES: Side by side Combat & Mental */}
            <div className="space-y-2 pt-1 border-t border-[#261f2e]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-rpg font-bold text-[#dfb15b] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dfb15b]" />
                  {t.attributes}
                </span>

                {/* Prominent Edit All Attributes button directly on the attributes header */}
                <button
                  onClick={() => onOpenFullModal(selectedHero)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#241a12] hover:bg-[#332415] border border-[#594426] text-[#f5cb71] hover:text-[#ffdf88] text-[11px] font-semibold transition-all cursor-pointer shadow-sm"
                >
                  <Edit3 className="w-3 h-3 text-[#dfb15b]" />
                  <span>{t.editAllAttributes}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                {/* Left Column: COMBAT */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#9e8f7c] flex items-center gap-1 pb-1 border-b border-[#211926]">
                    <Swords className="w-3 h-3 text-[#a04a3e]" />
                    {t.combat}
                  </div>

                  <StatBarRow
                    label={getAttrName('weaponSkill', t.attrWeaponSkill)}
                    desc={getAttrDesc('weaponSkill')}
                    value={selectedHero.attributes.weaponSkill}
                    isPillar={isClassPillar(selectedHero.classId, 'weaponSkill')}
                    onDec={() => handleAdjustStat('weaponSkill', -1)}
                    onInc={() => handleAdjustStat('weaponSkill', 1)}
                  />
                  <StatBarRow
                    label={getAttrName('marksmanship', t.attrMarksmanship)}
                    desc={getAttrDesc('marksmanship')}
                    value={selectedHero.attributes.marksmanship}
                    isPillar={isClassPillar(selectedHero.classId, 'marksmanship')}
                    onDec={() => handleAdjustStat('marksmanship', -1)}
                    onInc={() => handleAdjustStat('marksmanship', 1)}
                  />
                  <StatBarRow
                    label={getAttrName('power', t.attrMight)}
                    desc={getAttrDesc('power')}
                    value={selectedHero.attributes.power}
                    isPillar={isClassPillar(selectedHero.classId, 'power')}
                    onDec={() => handleAdjustStat('power', -1)}
                    onInc={() => handleAdjustStat('power', 1)}
                  />
                  <StatBarRow
                    label={getAttrName('spellcraft', t.attrSpellcraft)}
                    desc={getAttrDesc('spellcraft')}
                    value={selectedHero.attributes.spellcraft}
                    isPillar={isClassPillar(selectedHero.classId, 'spellcraft')}
                    onDec={() => handleAdjustStat('spellcraft', -1)}
                    onInc={() => handleAdjustStat('spellcraft', 1)}
                  />
                  <StatBarRow
                    label={getAttrName('armorUse', t.attrArmorUse)}
                    desc={getAttrDesc('armorUse')}
                    value={selectedHero.attributes.armorUse}
                    isPillar={isClassPillar(selectedHero.classId, 'armorUse')}
                    onDec={() => handleAdjustStat('armorUse', -1)}
                    onInc={() => handleAdjustStat('armorUse', 1)}
                  />
                  <StatBarRow
                    label={getAttrName('parry', t.attrParry)}
                    desc={getAttrDesc('parry')}
                    value={selectedHero.attributes.parry}
                    isPillar={isClassPillar(selectedHero.classId, 'parry')}
                    onDec={() => handleAdjustStat('parry', -1)}
                    onInc={() => handleAdjustStat('parry', 1)}
                  />
                  <StatBarRow
                    label={getAttrName('evasion', t.attrEvasion)}
                    desc={getAttrDesc('evasion')}
                    value={selectedHero.attributes.evasion}
                    isPillar={isClassPillar(selectedHero.classId, 'evasion')}
                    onDec={() => handleAdjustStat('evasion', -1)}
                    onInc={() => handleAdjustStat('evasion', 1)}
                  />
                  <StatBarRow
                    label={getAttrName('criticalStrike', t.attrCriticalStrike)}
                    desc={getAttrDesc('criticalStrike')}
                    value={selectedHero.attributes.criticalStrike}
                    isPillar={isClassPillar(selectedHero.classId, 'criticalStrike')}
                    onDec={() => handleAdjustStat('criticalStrike', -1)}
                    onInc={() => handleAdjustStat('criticalStrike', 1)}
                  />
                </div>

                {/* Right Column: MENTAL */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#9e8f7c] flex items-center gap-1 pb-1 border-b border-[#211926]">
                    <Brain className="w-3 h-3 text-[#dfb15b]" />
                    {t.mental}
                  </div>

                  <StatBarRow
                    label={getAttrName('composure', t.attrComposure)}
                    desc={getAttrDesc('composure')}
                    value={selectedHero.attributes.composure}
                    isPillar={isClassPillar(selectedHero.classId, 'composure')}
                    onDec={() => handleAdjustStat('composure', -1)}
                    onInc={() => handleAdjustStat('composure', 1)}
                  />
                  <StatBarRow
                    label={getAttrName('bravery', t.attrBravery)}
                    desc={getAttrDesc('bravery')}
                    value={selectedHero.attributes.bravery}
                    isPillar={isClassPillar(selectedHero.classId, 'bravery')}
                    onDec={() => handleAdjustStat('bravery', -1)}
                    onInc={() => handleAdjustStat('bravery', 1)}
                  />
                  <StatBarRow
                    label={getAttrName('decisions', t.attrDecisions)}
                    desc={getAttrDesc('decisions')}
                    value={selectedHero.attributes.decisions}
                    isPillar={isClassPillar(selectedHero.classId, 'decisions')}
                    onDec={() => handleAdjustStat('decisions', -1)}
                    onInc={() => handleAdjustStat('decisions', 1)}
                  />
                  <StatBarRow
                    label={getAttrName('anticipation', t.attrAnticipation)}
                    desc={getAttrDesc('anticipation')}
                    value={selectedHero.attributes.anticipation}
                    isPillar={isClassPillar(selectedHero.classId, 'anticipation')}
                    onDec={() => handleAdjustStat('anticipation', -1)}
                    onInc={() => handleAdjustStat('anticipation', 1)}
                  />
                  <StatBarRow
                    label={getAttrName('teamwork', t.attrTeamwork)}
                    desc={getAttrDesc('teamwork')}
                    value={selectedHero.attributes.teamwork}
                    isPillar={isClassPillar(selectedHero.classId, 'teamwork')}
                    onDec={() => handleAdjustStat('teamwork', -1)}
                    onInc={() => handleAdjustStat('teamwork', 1)}
                  />
                  <StatBarRow
                    label={getAttrName('leadership', t.attrLeadership)}
                    desc={getAttrDesc('leadership')}
                    value={selectedHero.attributes.leadership}
                    isPillar={isClassPillar(selectedHero.classId, 'leadership')}
                    onDec={() => handleAdjustStat('leadership', -1)}
                    onInc={() => handleAdjustStat('leadership', 1)}
                  />
                  <StatBarRow
                    label={getAttrName('concentration', t.attrConcentration)}
                    desc={getAttrDesc('concentration')}
                    value={selectedHero.attributes.concentration}
                    isPillar={isClassPillar(selectedHero.classId, 'concentration')}
                    onDec={() => handleAdjustStat('concentration', -1)}
                    onInc={() => handleAdjustStat('concentration', 1)}
                  />
                  <StatBarRow
                    label={getAttrName('aggression', t.attrAggression)}
                    desc={getAttrDesc('aggression')}
                    value={selectedHero.attributes.aggression}
                    isPillar={isClassPillar(selectedHero.classId, 'aggression')}
                    onDec={() => handleAdjustStat('aggression', -1)}
                    onInc={() => handleAdjustStat('aggression', 1)}
                  />
                  <StatBarRow
                    label={getAttrName('discipline', t.attrDiscipline)}
                    desc={getAttrDesc('discipline')}
                    value={selectedHero.attributes.discipline}
                    isPillar={isClassPillar(selectedHero.classId, 'discipline')}
                    onDec={() => handleAdjustStat('discipline', -1)}
                    onInc={() => handleAdjustStat('discipline', 1)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer: Clear Main Action and Separated Make Wonderkid */}
          <div className="p-3 border-t border-[#241c29] bg-[#0f0c13] flex items-center justify-between gap-2">
            {/* Primary Action: Open Full Character Sheet */}
            <button
              onClick={() => onOpenFullModal(selectedHero)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gradient-to-b from-[#e5ab37] to-[#b88226] hover:from-[#f3be51] hover:to-[#c69131] active:translate-y-px text-[#150f06] font-bold text-xs rounded shadow-md border border-[#f5cb71]/40 transition-all cursor-pointer font-rpg tracking-wider uppercase"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#150f06]" />
              <span>{t.editAllAttributes}</span>
            </button>

            {/* Make Wonderkid (Separated, secondary action with distinct styling) */}
            <button
              onClick={handleMakeWonderkid}
              title={t.makeWonderkidDesc}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#1f1726] hover:bg-[#2e213a] border border-[#483359] text-[#c78ade] hover:text-[#e0a8f7] rounded text-xs font-semibold transition-colors cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#c78ade]" />
              <span>{t.makeWonderkid}</span>
            </button>

            {/* Release Delver Button */}
            <button
              onClick={() => {
                if (window.confirm(`${t.releaseConfirm} (${selectedHero.name})`)) {
                  onReleaseHero(selectedHero.id);
                }
              }}
              className="px-2.5 py-2 bg-transparent hover:bg-[#2b1619] text-[#a04a3e] hover:text-[#e67e8c] text-xs font-medium rounded transition-colors cursor-pointer"
            >
              {t.releaseDelver}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Table Row Component for each Delver
interface DelverTableRowProps {
  hero: Adventurer;
  isSelected: boolean;
  onSelect: () => void;
}

const DelverTableRow: React.FC<DelverTableRowProps> = ({
  hero,
  isSelected,
  onSelect,
}) => {
  const isWonderkid = hero.age <= 19 && hero.potentialAbility >= 180;
  const rating = hero.firstJoin?.rating || Math.round(hero.currentAbility / 2);
  const starsCount = Math.round(hero.abilityStars || (hero.currentAbility > 85 ? 3 : 2));

  // In-Game Class pill badge color
  const getClassPillStyle = (classId: string) => {
    const c = classId.toLowerCase();
    switch (c) {
      case 'arcanist':
        return 'bg-[#3d1822] text-[#e67e8c] border-[#6e2533]';
      case 'blademaster':
        return 'bg-[#3b1c16] text-[#e38776] border-[#6b2c20]';
      case 'guardian':
        return 'bg-[#182638] text-[#81aade] border-[#284166]';
      case 'warden':
        return 'bg-[#142833] text-[#67bad6] border-[#20495e]';
      case 'cleric':
        return 'bg-[#143023] text-[#6bc79d] border-[#21573d]';
      case 'bard':
        return 'bg-[#1d301c] text-[#88c484] border-[#31522f]';
      case 'ranger':
        return 'bg-[#382012] text-[#d68a5c] border-[#61341a]';
      default:
        return 'bg-[#1e1926] text-[#c8beaf] border-[#34283b]';
    }
  };

  // In-Game Mood text
  const getMoodLabel = (morale: number) => {
    if (morale >= 95) return 'Devoted';
    if (morale >= 75) return 'Content';
    if (morale >= 50) return 'Restless';
    return 'Discontent';
  };

  return (
    <div
      onClick={onSelect}
      className={`grid grid-cols-12 gap-1 items-center px-4 py-2 text-xs border-b border-[#1c1622] transition-colors cursor-pointer relative ${
        isSelected
          ? 'bg-[#281e14] text-[#f5cb71] border-l-2 border-l-[#dfb15b] shadow-inner'
          : 'hover:bg-[#1a1520] text-[#c9bea9]'
      }`}
    >
      {/* Col: Name with icon, star, and wonderkid badge */}
      <div className="col-span-3 flex items-center gap-2 truncate">
        <span className="text-[#8e8070] shrink-0">★</span>
        <span className="font-medium text-[#f0e8db] truncate">
          {hero.name}
        </span>
        {isWonderkid && (
          <span className="text-[9px] font-bold px-1 rounded bg-[#332410] text-[#f5cb71] border border-[#6e532b] shrink-0">
            WK
          </span>
        )}
      </div>

      {/* Col: Role pill */}
      <div className="col-span-2 flex justify-center">
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-semibold border capitalize truncate ${getClassPillStyle(
            hero.classId
          )}`}
        >
          {hero.classId}
        </span>
      </div>

      {/* Col: Veterancy (Level) */}
      <div className="col-span-1 text-center font-mono font-medium text-[#b8ab96]">
        {hero.level}
      </div>

      {/* Col: Age */}
      <div className="col-span-1 text-center font-mono font-medium text-[#b8ab96]">
        {hero.age}
      </div>

      {/* Col: Fit (Condition + Fatigue) */}
      <div className="col-span-2 text-center font-mono text-[11px] text-[#b8ab96] flex items-center justify-center gap-1">
        <Heart className="w-3 h-3 text-[#a04a3e] shrink-0 inline fill-[#a04a3e]/30" />
        <span>{hero.condition}</span>
        <span className="text-[#635545] text-[10px]">+{hero.fatigue || 0}</span>
      </div>

      {/* Col: Mood */}
      <div className="col-span-1 text-center text-[11px] text-[#a89a87] capitalize truncate">
        {getMoodLabel(hero.morale)}
      </div>

      {/* Col: Rating Badge */}
      <div className="col-span-1 flex justify-center">
        <span className="px-2 py-0.5 rounded bg-[#18131e] border border-[#3b2d47] font-mono font-bold text-[#dfb15b] text-[11px]">
          {rating}
        </span>
      </div>

      {/* Col: Abil Stars */}
      <div className="col-span-1 text-center text-[#dfb15b] tracking-tighter text-xs">
        {Array.from({ length: Math.min(5, starsCount) })
          .map(() => '★')
          .join('')}
      </div>
    </div>
  );
};

// Stat Row with colored horizontal progress bar
interface StatBarRowProps {
  label: string;
  value: number;
  desc?: string;
  isPillar?: boolean;
  onDec: () => void;
  onInc: () => void;
}

const StatBarRow: React.FC<StatBarRowProps> = ({
  label,
  value,
  desc,
  isPillar = false,
  onDec,
  onInc,
}) => {
  const tier = getStatTierColor(value);
  const barPercent = Math.min(100, (value / 20) * 100);

  return (
    <div
      className={`flex items-center justify-between py-1 px-1.5 rounded transition-colors ${
        isPillar
          ? 'bg-[#201824] border border-[#543d1a]/50'
          : 'hover:bg-[#1b1523]'
      }`}
    >
      <Tooltip
        title={label}
        content={desc}
        extra={
          isPillar ? (
            <div className="flex items-center gap-1 text-[11px] text-[#f5cb71] font-semibold">
              <span>★ Class Key Pillar</span>
            </div>
          ) : undefined
        }
        className="flex-1 min-w-0"
      >
        <span className="text-[#9e8f7c] text-[11px] truncate flex items-center gap-1 cursor-help">
          {isPillar && (
            <span className="text-[#f5cb71] font-bold text-[11px]">
              ★
            </span>
          )}
          <span className={isPillar ? 'text-[#f0e8db] font-semibold' : ''}>
            {label}
          </span>
        </span>
      </Tooltip>

      <div className="flex items-center gap-2 shrink-0">
        {/* Horizontal Tier Bar matching In-Game UI */}
        <div className="w-16 h-1.5 bg-[#1f1926] rounded-sm overflow-hidden flex items-center">
          <div
            className={`h-full ${tier.bar} rounded-sm transition-all duration-150`}
            style={{ width: `${barPercent}%` }}
          />
        </div>

        {/* Numeric Value with inline +/- adjusters */}
        <div className="flex items-center gap-1 w-12 justify-end">
          <button
            onClick={onDec}
            title="Kurang 1"
            className="w-4 h-4 text-[#8e8070] hover:text-[#f0e8db] hover:bg-[#2b2138] rounded flex items-center justify-center text-[10px] cursor-pointer"
          >
            -
          </button>
          <span className={`font-mono text-xs font-bold w-4 text-center ${tier.text}`}>
            {value}
          </span>
          <button
            onClick={onInc}
            title="Tambah 1"
            className="w-4 h-4 text-[#8e8070] hover:text-[#f0e8db] hover:bg-[#2b2138] rounded flex items-center justify-center text-[10px] cursor-pointer"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};