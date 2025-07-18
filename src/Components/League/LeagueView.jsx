// src/Components/League/LeagueView.jsx

import React, { useState } from 'react';
import { useGame } from '../Game/GameContext';
import { useCalendar } from '../Calendar/CalendarContext';
import { useStats } from '../Game/StatContext';
import {
  generateSchedule,
  simulateMatchday,
  simulateSingleMatch,
} from '../../Utils/leagueLogic';
import teams from '../../../data/teams';
import {
  FaCalendarDay,
  FaMedal,
  FaPlayCircle,
  FaTimes,
  FaUserAlt,
} from 'react-icons/fa';

const regions = ['NA', 'MENA', 'APAC', 'SA'];

const LeagueView = () => {
  const { currentPhase } = useCalendar();
  const { currentDate } = useGame();
  const { updatePlayerMatchStats, increaseChemistry } = useStats();
  const [results, setResults] = useState({});
  const [standings, setStandings] = useState({});
  const [matchdayIndices, setMatchdayIndices] = useState({});
  const [hostCitiesMap, setHostCitiesMap] = useState({});
  const [visibleStandingRegion, setVisibleStandingRegion] = useState(null);

  const phaseKey = currentPhase.key;
  const isStage1 = phaseKey === 'stage1_leagues';
  const isStage2 = phaseKey === 'stage2_leagues';
  if (!isStage1 && !isStage2)
    return (
      <div className="text-white p-6">
        <h2 className="text-2xl mb-4 text-yellow-400">League Not Active Yet</h2>
        <p className="text-gray-300">Advance to Stage 1 or Stage 2 league phase.</p>
      </div>
    );

  const stageLabel = isStage1 ? 'stage1' : 'stage2';

  const handleSim = (region, key, schedule, currentMatchday, fullSim) => {
    if (fullSim) {
      const { updatedResults, updatedStandings, hostCity } = simulateMatchday(
        region,
        currentMatchday,
        { [region]: results[key] || [] },
        standings[key] || {}
      );
      updatedResults[region].forEach((m) => {
        updatePlayerMatchStats(m.mvp.name, {
          kills: m.mvp.K,
          assists: m.mvp.A,
          deaths: m.mvp.D,
          mvp: true,
          eventName: `${region} League - ${stageLabel.toUpperCase()}`,
        });
      });
      increaseChemistry(
        updatedResults[region].flatMap((m) => [...teams[m.teamA].players, ...teams[m.teamB].players])
      );
      setResults((prev) => ({ ...prev, [key]: [...(prev[key] || []), ...updatedResults[region]] }));
      setStandings((prev) => ({ ...prev, [key]: updatedStandings[region] }));
      setHostCitiesMap((prev) => ({ ...prev, [`${key}_matchday${currentMatchday + 1}`]: hostCity }));
      setMatchdayIndices((prev) => ({ ...prev, [key]: currentMatchday + 1 }));
    }
  };

  const handleSingleMatch = (region, key, teamA, teamB, currentMatchday) => {
    const existing = results[key]?.find(
      (r) => r.teamA === teamA && r.teamB === teamB && r.matchday === currentMatchday + 1
    );
    if (existing) return;
    const { newMatchResult, updatedStandings } = simulateSingleMatch(
      region,
      currentMatchday,
      teamA,
      teamB,
      results[key] || [],
      standings[key] || {}
    );
    updatePlayerMatchStats(newMatchResult.mvp.name, {
      kills: newMatchResult.mvp.K,
      assists: newMatchResult.mvp.A,
      deaths: newMatchResult.mvp.D,
      mvp: true,
      eventName: `${region} League - ${stageLabel.toUpperCase()}`,
    });
    increaseChemistry([...teams[teamA].players, ...teams[teamB].players]);
    const updatedResults = [...(results[key] || []), newMatchResult];
    setResults((prev) => ({ ...prev, [key]: updatedResults }));
    setStandings((prev) => ({ ...prev, [key]: updatedStandings }));
    setHostCitiesMap((prev) => ({ ...prev, [`${key}_matchday${currentMatchday + 1}`]: newMatchResult.hostCity }));
    const totalSimulated = updatedResults.filter((r) => r.matchday === currentMatchday + 1).length;
    if (totalSimulated === generateSchedule(Object.keys(teams).filter((t) => teams[t].region === region))[currentMatchday]?.length)
      setMatchdayIndices((prev) => ({ ...prev, [key]: currentMatchday + 1 }));
  };

  const renderRegion = (region) => {
    const regionTeamNames = Object.keys(teams).filter((t) => teams[t].region === region);
    const schedule = generateSchedule(regionTeamNames);
    const key = `${stageLabel}_${region}`;
    const currentMatchday = matchdayIndices[key] || 0;

    return (
      <div key={region} className="bg-[#1c1c1c] p-4 rounded-2xl text-white mb-10 shadow-lg border border-[#2c2c2c]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold uppercase text-yellow-400">{region} League — {isStage1 ? 'Stage 1' : 'Stage 2'}</h3>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <FaCalendarDay className="text-cyan-400" /> Matchday {Math.min(currentMatchday + 1, schedule.length)} of {schedule.length}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-400 text-black px-3 py-1.5 rounded-md text-xs font-semibold transition uppercase" onClick={() => handleSim(region, key, schedule, currentMatchday, true)}>
              <FaPlayCircle /> Sim Day
            </button>
            <button className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-1.5 rounded-md text-xs font-semibold transition uppercase" onClick={() => setVisibleStandingRegion(region)}>
              <FaMedal /> Standings
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {schedule[currentMatchday]?.map(([teamA, teamB], idx) => {
            const match = results[key]?.find(
              (r) => r.teamA === teamA && r.teamB === teamB && r.matchday === currentMatchday + 1
            );
            const sim = !!match;
            return (
              <div key={`${teamA}-${teamB}-${idx}`} className="bg-[#1c1c1c] rounded-lg p-3 border border-[#333] shadow-sm hover:shadow-cyan-500/10 transition duration-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 max-w-[45%] truncate">
                    <img src={`/logos/${teams[teamA]?.logo || 'default.png'}`} className="w-6 h-6 object-contain" alt={teamA} />
                    <span className="text-sm text-white font-semibold">{teamA}</span>
                  </div>
                  <span className="text-cyan-400 font-bold text-md">{sim ? match.score : 'VS'}</span>
                  <div className="flex items-center gap-2 max-w-[45%] truncate justify-end">
                    <span className="text-sm text-white font-semibold text-right">{teamB}</span>
                    <img src={`/logos/${teams[teamB]?.logo || 'default.png'}`} className="w-6 h-6 object-contain" alt={teamB} />
                  </div>
                </div>

                {sim ? (
                  <div className="text-xs mt-2 text-gray-300 space-y-1">

                    <div className="flex items-center gap-2">
                      <FaUserAlt className="text-cyan-300" />
                      <span><strong className="text-gray-400">MVP:</strong> <span className="text-cyan-200">{match.mvp.name}</span> <span className="text-gray-400">({match.mvp.K}/{match.mvp.D}/{match.mvp.A})</span></span>
                    </div>

                  </div>
                ) : (
                  <button className="mt-2 w-full py-1 text-xs font-bold uppercase text-black bg-cyan-400 hover:bg-cyan-300 rounded-md flex items-center justify-center gap-2 transition" onClick={() => handleSingleMatch(region, key, teamA, teamB, currentMatchday)}>
                    <FaPlayCircle /> Sim Match
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {visibleStandingRegion === region && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center p-4">
            <div className="bg-[#1c1c1c] w-full max-w-3xl p-6 rounded-lg text-white relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg" onClick={() => setVisibleStandingRegion(null)}>
                <FaTimes />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">{region} League Standings</h2>
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
                  {Object.entries(standings[key] || {}).sort((a, b) => b[1].Points - a[1].Points || b[1].W - a[1].W).map(([team, data]) => (
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
      <h1 className="text-3xl text-white font-extrabold tracking-wide mb-6">
        Regional League Simulation ({isStage1 ? 'Stage 1' : 'Stage 2'})
      </h1>
      <div className="space-y-10">{regions.map((region) => renderRegion(region))}</div>
    </div>
  );
};

export default LeagueView;
