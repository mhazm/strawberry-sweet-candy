import React from 'react';
import { Skull, Sparkles, HeartPulse, Undo2 } from 'lucide-react';
import { Adventurer, GuildData } from '../../types/savegame';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useTranslation } from '../../lib/i18n';

interface GraveyardViewProps {
  guild: GuildData;
  onChange: (updated: GuildData) => void;
}

export const GraveyardView: React.FC<GraveyardViewProps> = ({
  guild,
  onChange,
}) => {
  const { t } = useTranslation();
  const fallen = guild.fallen || [];

  const handleReviveOne = (hero: Adventurer) => {
    const revivedHero = {
      ...hero,
      condition: 100,
      morale: 100,
      stress: 0,
      fatigue: 0,
      injury: null,
    };
    const newFallen = fallen.filter((f) => f.id !== hero.id);
    const newRoster = [...(guild.roster || []), revivedHero];
    onChange({
      ...guild,
      roster: newRoster,
      fallen: newFallen,
    });
  };

  const handleReviveAll = () => {
    if (fallen.length === 0) return;
    const revivedAll = fallen.map((hero) => ({
      ...hero,
      condition: 100,
      morale: 100,
      stress: 0,
      fatigue: 0,
      injury: null,
    }));
    onChange({
      ...guild,
      roster: [...(guild.roster || []), ...revivedAll],
      fallen: [],
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-[#c9bea9]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#18151f] border border-[#2e2536] rounded-xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#33181c] border border-[#5e2730] text-[#e67e8c]">
            <Skull className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-rpg text-base font-bold text-[#f0e8db] flex items-center gap-2">
              {t.navFallen}
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#131018] text-[#e67e8c] border border-[#3b2529]">
                {fallen.length} Fallen
              </span>
            </h2>
            <p className="text-xs text-[#8e8273]">
              Delvers who perished in dungeon depths. You can resurrect them back to the active roster.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="emerald"
            size="sm"
            icon={<Sparkles className="w-3.5 h-3.5" />}
            onClick={handleReviveAll}
            disabled={fallen.length === 0}
          >
            {t.reviveAll}
          </Button>
        </div>
      </div>

      {/* Fallen List */}
      {fallen.length === 0 ? (
        <div className="p-12 text-center bg-[#18151f]/60 border border-[#2e2536] rounded-2xl">
          <HeartPulse className="w-10 h-10 text-[#6bc79d] mx-auto mb-3" />
          <h3 className="font-rpg text-base font-bold text-[#f0e8db]">
            No Fallen Heroes
          </h3>
          <p className="text-xs text-[#8e8273] mt-1">
            None of your adventurers have met their end in the deeps. All delvers are alive and well!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fallen.map((hero) => (
            <div
              key={hero.id}
              className="p-4 bg-[#18151f] border border-[#331c22] hover:border-[#592731] rounded-xl flex flex-col justify-between group shadow-sm transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-rpg font-bold text-[#f0e8db] text-base group-hover:text-[#e67e8c] transition-colors truncate">
                      {hero.name}
                    </h3>
                    <div className="text-xs text-[#8e8273] capitalize mt-0.5">
                      {hero.raceId} • {hero.classId} ({hero.role})
                    </div>
                  </div>
                  <Badge variant="rose">Deceased</Badge>
                </div>

                <div className="mt-3 p-2.5 rounded-lg bg-[#131018] border border-[#2b181d] text-xs space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#8e8273]">Level at Death:</span>
                    <span className="text-[#f0e8db] font-bold">Lv.{hero.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8e8273]">Ability (CA / PA):</span>
                    <span>
                      <span className="text-[#dfb15b] font-bold">{hero.currentAbility}</span>
                      <span className="text-[#594d42]"> / </span>
                      <span className="text-[#c78ade] font-bold">{hero.potentialAbility}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#26161a] flex items-center justify-end">
                <Button
                  variant="emerald"
                  size="sm"
                  className="w-full text-xs"
                  icon={<Undo2 className="w-3.5 h-3.5" />}
                  onClick={() => handleReviveOne(hero)}
                >
                  Resurrect to Active Roster
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};