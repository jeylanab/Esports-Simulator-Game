import React, { useState } from 'react';
import { useCalendar } from '../Calendar/CalendarContext';
import { useStats } from '../Game/StatContext';
import { generateSchedule, simulateSingleMatch } from '../../Utils/leagueLogic';
import LeagueStatsPanel from './LeagueStatsPanel';
import teams from '../../../data/teams';

import {
  FaCalendarDay,
  FaMedal,
  FaPlayCircle,
  FaTimes,
} from 'react-icons/fa';

const regions = ['NA', 'MENA', 'APAC', 'SA'];

const LeagueView = () => {
  const { currentPhase } = useCalendar();
  const {
    getTeamChemistry,
    increaseTeamChemistry,
    updatePlayerMatchStats,
    determineMVP,
  } = useStats();

  const [results, setResults] = useState({});
  const [standings, setStandings] = useState({});
  const [matchdayIndices, setMatchdayIndices] = useState({});
  const [visibleStandingRegion, setVisibleStandingRegion] = useState(null);
  const [showStatsPanel, setShowStatsPanel] = useState(false);

  const phaseKey = currentPhase.key;
  const isStage1 = phaseKey === 'stage1_leagues';
  const isStage2 = phaseKey === 'stage2_leagues';

  if (!isStage1 && !isStage2) {
    return (
      <div className="text-white p-6">
        <h2 className="text-2xl mb-4 text-yellow-400">League Not Active Yet</h2>
        <p className="text-gray-300">Advance to Stage 1 or Stage 2 league phase.</p>
      </div>
    );
  }

  const stageLabel = isStage1 ? 'stage1' : 'stage2';

  const handleSingleMatch = (region, key, teamA, teamB, currentMatchday) => {
    const schedule = generateSchedule(
      Object.keys(teams).filter((t) => teams[t].region === region)
    );
    if (currentMatchday >= schedule.length) return;

    const alreadySimmed = results[key]?.find(
      (r) => r.teamA === teamA && r.teamB === teamB && r.matchday === currentMatchday + 1
    );
    if (alreadySimmed) return;

    const { newMatchResult, updatedStandings } = simulateSingleMatch(
      region,
      currentMatchday,
      teamA,
      teamB,
      results[key] || [],
      standings[key] || {},
      {
        getTeamChemistry,
        increaseTeamChemistry,
        updatePlayerMatchStats,
        determineMVP,
      }
    );

    const updatedResults = [...(results[key] || []), newMatchResult];

    setResults((prev) => ({ ...prev, [key]: updatedResults }));
    setStandings((prev) => ({ ...prev, [key]: updatedStandings }));

    const totalSimulated = updatedResults.filter(
      (r) => r.matchday === currentMatchday + 1
    ).length;
    const totalMatches = schedule[currentMatchday]?.length || 0;

    if (totalSimulated === totalMatches) {
      setMatchdayIndices((prev) => ({ ...prev, [key]: currentMatchday + 1 }));
    }
  };

  const handleSimAllMatches = (region, key) => {
    const regionTeams = Object.keys(teams).filter((t) => teams[t].region === region);
    const schedule = generateSchedule(regionTeams);
    const currentMatchday = matchdayIndices[key] || 0;

    if (currentMatchday >= schedule.length) return;

    let updatedResults = results[key] || [];
    let updatedStanding = standings[key] || {};

    for (const [teamA, teamB] of schedule[currentMatchday]) {
      const alreadySimmed = updatedResults.find(
        (r) => r.teamA === teamA && r.teamB === teamB && r.matchday === currentMatchday + 1
      );
      if (alreadySimmed) continue;

      const { newMatchResult, updatedStandings } = simulateSingleMatch(
        region,
        currentMatchday,
        teamA,
        teamB,
        updatedResults,
        updatedStanding,
        {
          getTeamChemistry,
          increaseTeamChemistry,
          updatePlayerMatchStats,
          determineMVP,
        }
      );

      updatedResults = [...updatedResults, newMatchResult];
      updatedStanding = updatedStandings;
    }

    setResults((prev) => ({ ...prev, [key]: updatedResults }));
    setStandings((prev) => ({ ...prev, [key]: updatedStanding }));
    setMatchdayIndices((prev) => ({ ...prev, [key]: currentMatchday + 1 }));
  };

  const renderRegion = (region) => {
    const teamNames = Object.keys(teams).filter((t) => teams[t].region === region);
    const schedule = generateSchedule(teamNames);
    const key = `${stageLabel}_${region}`;
    const currentMatchday = matchdayIndices[key] || 0;

    return (
      <div key={region} className="bg-[#1c1c1c] p-4 rounded-2xl text-white mb-10 shadow-lg border border-[#2c2c2c]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold uppercase text-yellow-400">
              {region} League — {isStage1 ? 'Stage 1' : 'Stage 2'}
            </h3>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <FaCalendarDay className="text-cyan-400" /> Matchday {Math.min(currentMatchday + 1, schedule.length)} of {schedule.length}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-400 text-black px-3 py-1.5 rounded-md text-xs font-semibold uppercase transition"
              onClick={() => handleSimAllMatches(region, key)}
            >
              <FaPlayCircle /> Sim All
            </button>
            <button
              className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-1.5 rounded-md text-xs font-semibold uppercase transition"
              onClick={() => setVisibleStandingRegion(region)}
            >
              <FaMedal /> Standings
            </button>
          </div>
        </div>

        {currentMatchday < schedule.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {schedule[currentMatchday]?.map(([teamA, teamB], idx) => {
              const match = results[key]?.find(
                (r) => r.teamA === teamA && r.teamB === teamB && r.matchday === currentMatchday + 1
              );
              const sim = !!match;

              return (
                <div key={`${teamA}-${teamB}-${idx}`} className="bg-[#121212] rounded-lg p-2 border border-[#2a2a2a] text-white text-sm flex flex-col items-center justify-between gap-2 shadow-md">
                  <h4 className="font-bold text-gray-300">Round #{currentMatchday + 1}</h4>

                  <div className="flex items-center justify-between w-full gap-3">
                    <div className="flex items-center gap-2">
                      <img src={`/logos/${teams[teamA]?.logo || 'default.png'}`} className="w-6 h-6 object-contain" alt={teamA} />
                      <span className="font-semibold">{teamA}</span>
                    </div>

                    <span className="text-cyan-400 font-bold text-md">
                      {sim ? match.score : '0 - 0'}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{teamB}</span>
                      <img src={`/logos/${teams[teamB]?.logo || 'default.png'}`} className="w-6 h-6 object-contain" alt={teamB} />
                    </div>
                  </div>

                  {!sim ? (
                    <button
                      className="bg-yellow-300 text-black text-xs px-3 py-1 rounded-md font-semibold hover:bg-yellow-200 transition"
                      onClick={() =>
                        handleSingleMatch(region, key, teamA, teamB, currentMatchday)
                      }
                    >
                      Sim
                    </button>
                  ) : (
                    <div className="text-xs text-gray-400 font-mono text-center w-full">
                      MVP: <span className="text-yellow-400 font-semibold">{match.mvp}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-400 text-center text-sm py-4">
            All matchdays completed for {region}.
          </div>
        )}

        {visibleStandingRegion === region && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center p-4">
            <div className="bg-[#1c1c1c] w-full max-w-3xl p-6 rounded-lg text-white relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg"
                onClick={() => setVisibleStandingRegion(null)}
              >
                <FaTimes />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">
                {region} League Standings
              </h2>
              <table className="w-full text-sm border border-gray-700">
                <thead className="bg-[#2a2a2a] text-yellow-400 uppercase text-sm">
                  <tr>
                    <th className="py-2 px-3 text-left">Team</th>
                    <th className="py-2 px-3 text-center">W</th>
                    <th className="py-2 px-3 text-center">L</th>
                    <th className="py-2 px-3 text-center">MP</th>
                    <th className="py-2 px-3 text-center">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(standings[key] || {})
                    .sort((a, b) => b[1].Points - a[1].Points || b[1].W - a[1].W)
                    .map(([team, data]) => (
                      <tr key={team} className="border-t border-gray-800 hover:bg-[#292929] transition">
                        <td className="py-2 px-3">{team}</td>
                        <td className="py-2 px-3 text-center">{data.W}</td>
                        <td className="py-2 px-3 text-center">{data.L}</td>
                        <td className="py-2 px-3 text-center">{data.MP}</td>
                        <td className="py-2 px-3 text-center">{data.Points}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-white font-extrabold tracking-wide">
          Regional League Simulation ({isStage1 ? 'Stage 1' : 'Stage 2'})
        </h1>
        <button
          onClick={() => setShowStatsPanel(!showStatsPanel)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md text-sm font-bold"
        >
          {showStatsPanel ? 'Hide Stats' : 'View Stats'}
        </button>
      </div>

      {showStatsPanel ? (
        <div className="bg-[#121212] p-4 text-white rounded-lg border border-[#333] shadow-lg text-center">
          <LeagueStatsPanel
            results={results}
            standings={standings}
            matchdayIndices={matchdayIndices}
          />
        </div>
      ) : (
        <div className="space-y-10">
          {regions.map((region) => renderRegion(region))}
        </div>
      )}
    </div>
  );
};

export default LeagueView;
