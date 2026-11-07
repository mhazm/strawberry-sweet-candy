import React from 'react';
import {
  Coins,
  Award,
  Calendar,
  HeartHandshake,
  ShieldAlert,
  Flame,
  Users2,
  Settings,
  Sparkles,
} from 'lucide-react';
import { GuildData } from '../../types/savegame';
import { Button } from '../ui/Button';
import { formatGold } from '../../lib/utils';
import { useTranslation } from '../../lib/i18n';

interface GuildEditorProps {
  guild: GuildData;
  onChange: (updated: GuildData) => void;
}

export const GuildEditor: React.FC<GuildEditorProps> = ({ guild, onChange }) => {
  const { t } = useTranslation();
  const updateField = <K extends keyof GuildData>(key: K, value: GuildData[K]) => {
    onChange({ ...guild, [key]: value });
  };

  const addGold = (amount: number) => {
    const cur = Number(guild.gold) || 0;
    updateField('gold', Math.max(0, cur + amount));
  };

  const addRenown = (amount: number) => {
    const cur = Number(guild.renown) || 0;
    updateField('renown', Math.max(0, cur + amount));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-[#c9bea9]">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gold Card */}
        <div className="bg-[#18151f] border border-[#2e2536] rounded-xl p-4 shadow-md relative overflow-hidden group hover:border-[#5e4726] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-[#8e8273]">
              {t.treasuryGold}
            </span>
            <Coins className="w-5 h-5 text-[#dfb15b]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#f5cb71]">
            {formatGold(guild.gold)}
          </div>
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              className="text-[11px] px-2 py-1"
              onClick={() => addGold(10000)}
            >
              +10k
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="text-[11px] px-2 py-1"
              onClick={() => addGold(100000)}
            >
              +100k
            </Button>
            <Button
              variant="amber"
              size="sm"
              className="text-[11px] px-2 py-1 font-semibold"
              onClick={() => addGold(1000000)}
            >
              +1M
            </Button>
          </div>
        </div>

        {/* Renown Card */}
        <div className="bg-[#18151f] border border-[#2e2536] rounded-xl p-4 shadow-md relative overflow-hidden group hover:border-[#294269] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-[#8e8273]">
              {t.realmRenown}
            </span>
            <Award className="w-5 h-5 text-[#86afdf]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#86afdf]">
            {guild.renown || 0}
          </div>
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              className="text-[11px] px-2 py-1"
              onClick={() => addRenown(10)}
            >
              +10
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="text-[11px] px-2 py-1"
              onClick={() => addRenown(50)}
            >
              +50
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="text-[11px] px-2 py-1"
              onClick={() => addRenown(100)}
            >
              +100
            </Button>
          </div>
        </div>

        {/* Calendar Day Card */}
        <div className="bg-[#18151f] border border-[#2e2536] rounded-xl p-4 shadow-md relative overflow-hidden group hover:border-[#255e42] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-[#8e8273]">
              {t.seasonCalendar}
            </span>
            <Calendar className="w-5 h-5 text-[#71caa2]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#71caa2]">
            {t.day} {guild.day}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="number"
              value={guild.day}
              onChange={(e) => updateField('day', parseInt(e.target.value) || 0)}
              className="w-24 bg-[#131018] border border-[#3b2e44] rounded px-2 py-1 text-xs text-[#f0e8db] font-mono focus:outline-none focus:border-[#71caa2]"
            />
            <span className="text-xs text-[#8e8273]">{t.currentDay}</span>
          </div>
        </div>

        {/* Patron Confidence */}
        <div className="bg-[#18151f] border border-[#2e2536] rounded-xl p-4 shadow-md relative overflow-hidden group hover:border-[#552e69] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-[#8e8273]">
              {t.patronFavor}
            </span>
            <HeartHandshake className="w-5 h-5 text-[#c78ade]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#c78ade]">
            {guild.patronConfidence ?? 60}%
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="text-[11px] px-2 py-1"
              onClick={() => updateField('patronConfidence', 100)}
            >
              Max 100%
            </Button>
            <span className="text-xs text-[#8e8273] truncate">
              {guild.patron?.name || 'Independent'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guild Identity & Economy Form */}
        <div className="bg-[#18151f] border border-[#2e2536] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#2d2333]">
            <Settings className="w-4 h-4 text-[#dfb15b]" />
            <h2 className="text-base font-semibold text-[#f0e8db]">
              {t.guildIdentityTreasury}
            </h2>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-medium text-[#8e8273] mb-1">
                {t.guildName}
              </label>
              <input
                type="text"
                value={guild.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full bg-[#131018] border border-[#3b2e44] rounded-lg px-3 py-2 text-[#f0e8db] focus:outline-none focus:border-[#dfb15b] font-rpg tracking-wide text-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#8e8273] mb-1">
                  {t.exactGold}
                </label>
                <input
                  type="number"
                  value={guild.gold ?? 0}
                  onChange={(e) =>
                    updateField('gold', parseInt(e.target.value) || 0)
                  }
                  className="w-full bg-[#131018] border border-[#3b2e44] rounded-lg px-3 py-2 text-[#f5cb71] font-mono font-semibold focus:outline-none focus:border-[#dfb15b]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#8e8273] mb-1">
                  {t.renownScore}
                </label>
                <input
                  type="number"
                  value={guild.renown ?? 0}
                  onChange={(e) =>
                    updateField('renown', parseInt(e.target.value) || 0)
                  }
                  className="w-full bg-[#131018] border border-[#3b2e44] rounded-lg px-3 py-2 text-[#86afdf] font-mono font-semibold focus:outline-none focus:border-[#86afdf]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8e8273] mb-1">
                {t.patronConfidence}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={guild.patronConfidence ?? 60}
                  onChange={(e) =>
                    updateField('patronConfidence', parseInt(e.target.value) || 0)
                  }
                  className="w-full accent-[#c78ade] h-2 bg-[#131018] rounded-lg cursor-pointer"
                />
                <span className="font-mono text-sm w-12 text-[#c78ade] font-bold">
                  {guild.patronConfidence ?? 60}%
                </span>
              </div>
            </div>

            {guild.patron && (
              <div className="p-3 rounded-lg bg-[#141117] border border-[#2b2230] text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#8e8273]">Patron:</span>
                  <span className="text-[#f0e8db] font-semibold">{guild.patron.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8e8273]">Stipend:</span>
                  <span className="text-[#dfb15b] font-mono">
                    {guild.patron.stipend ?? 0} gold/season
                  </span>
                </div>
                {guild.patron.blurb && (
                  <p className="text-[#8e8273] italic pt-1 text-[11px]">
                    "{guild.patron.blurb}"
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Game Mode Rules & Modifiers */}
        <div className="bg-[#18151f] border border-[#2e2536] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#2d2333]">
            <ShieldAlert className="w-4 h-4 text-[#e67e8c]" />
            <h2 className="text-base font-semibold text-[#f0e8db]">
              {t.gameModeRules}
            </h2>
          </div>

          <div className="space-y-3">
            {/* Ironman Toggle */}
            <label className="flex items-start gap-3 p-3 rounded-lg bg-[#141117] border border-[#2d2333] hover:bg-[#1d1723] cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={!!guild.ironman}
                onChange={(e) => updateField('ironman', e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#3b2e44] text-[#dfb15b] focus:ring-0 accent-[#dfb15b]"
              />
              <div>
                <div className="text-sm font-medium text-[#f0e8db]">
                  {t.ironmanMode}
                </div>
                <div className="text-xs text-[#8e8273]">
                  {t.ironmanDesc}
                </div>
              </div>
            </label>

            {/* Power Fantasy Toggle */}
            <label className="flex items-start gap-3 p-3 rounded-lg bg-[#141117] border border-[#2d2333] hover:bg-[#1d1723] cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={!!guild.powerFantasy}
                onChange={(e) => updateField('powerFantasy', e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#3b2e44] text-[#dfb15b] focus:ring-0 accent-[#dfb15b]"
              />
              <div>
                <div className="text-sm font-medium text-[#f0e8db] flex items-center gap-1.5">
                  <span>{t.powerFantasyMode}</span>
                  <Flame className="w-3.5 h-3.5 text-[#dfb15b]" />
                </div>
                <div className="text-xs text-[#8e8273]">
                  {t.powerFantasyDesc}
                </div>
              </div>
            </label>

            {/* Dungeonborn Toggle */}
            <label className="flex items-start gap-3 p-3 rounded-lg bg-[#141117] border border-[#2d2333] hover:bg-[#1d1723] cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={!!guild.dungeonborn}
                onChange={(e) => updateField('dungeonborn', e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#3b2e44] text-[#dfb15b] focus:ring-0 accent-[#dfb15b]"
              />
              <div>
                <div className="text-sm font-medium text-[#f0e8db]">
                  {t.dungeonbornOrigin}
                </div>
                <div className="text-xs text-[#8e8273]">
                  {t.dungeonbornDesc}
                </div>
              </div>
            </label>

            {/* Town Rule */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-[#8e8273] mb-1">
                {t.townRuleModel}
              </label>
              <select
                value={guild.townRule || 'self'}
                onChange={(e) => updateField('townRule', e.target.value)}
                className="w-full bg-[#131018] border border-[#3b2e44] rounded-lg px-3 py-2 text-xs text-[#f0e8db] focus:outline-none focus:border-[#dfb15b]"
              >
                <option value="self">Self Ruled (Independent Hall)</option>
                <option value="charter">Chartered by Council</option>
                <option value="crown">Crown Jurisdiction</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Guild Staff & Coaches */}
      {guild.staff && guild.staff.length > 0 && (
        <div className="bg-[#18151f] border border-[#2e2536] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2d2333]">
            <div className="flex items-center gap-2">
              <Users2 className="w-4 h-4 text-[#71caa2]" />
              <h2 className="text-base font-semibold text-[#f0e8db]">
                {t.guildStaffTitle} ({guild.staff.length})
              </h2>
            </div>
            <Button
              variant="amber"
              size="sm"
              icon={<Sparkles className="w-3.5 h-3.5 text-[#dfb15b]" />}
              onClick={() => {
                const updatedStaff = guild.staff!.map((s) => ({
                  ...s,
                  skill: 100,
                  wage: 0,
                }));
                updateField('staff', updatedStaff);
              }}
            >
              {t.maxStaffSkills}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {guild.staff.map((s, idx) => (
              <div
                key={s.id || idx}
                className="p-3 bg-[#141117] border border-[#2d2333] rounded-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#f0e8db] text-sm">
                      {s.name}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#143023] text-[#71caa2] border border-[#21573d]">
                      {s.role}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-[#8e8273] flex items-center justify-between">
                    <span>{t.expertiseSkill}:</span>
                    <span className="font-mono font-bold text-[#dfb15b]">
                      {s.skill}
                    </span>
                  </div>
                  <div className="text-xs text-[#8e8273] flex items-center justify-between">
                    <span>{t.wage}:</span>
                    <span className="font-mono text-[#c9bea9]">
                      {s.wage} gold/day
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
