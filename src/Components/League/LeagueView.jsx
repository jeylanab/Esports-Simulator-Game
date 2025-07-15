import React, { useState } from 'react';
import { useGame } from '../Game/GameContext';
import { useCalendar } from '../Calendar/CalendarContext';
import { generateSchedule, simulateMatchday } from '../../Utils/leagueLogic';
import teams from '../../../data/teams';

const regions = ['NA', 'MENA', 'APAC', 'SA'];

const LeagueView = () => {
  const { currentPhase } = useCalendar();
  const { currentDate } = useGame();

  const [results, setResults] = useState({});
  const [standings, setStandings] = useState({});
  const [matchdayIndices, setMatchdayIndices] = useState({});
  const [hostCitiesMap, setHostCitiesMap] = useState({});
  const [visibleStandingRegion, setVisibleStandingRegion] = useState(null);

  const phaseKey = currentPhase.key;
  const isStage1 = phaseKey === 'stage1_leagues';
  const isStage2 = phaseKey === 'stage2_leagues';

  if (!isStage1 && !isStage2) {
    return (
      <div className="text-white p-6">
        <h2 className="text-2xl mb-4">League not active yet</h2>
        <p>Please advance your calendar to Stage 1 or Stage 2 league phase.</p>
      </div>
    );
  }

  const stageLabel = isStage1 ? 'stage1' : 'stage2';

  const renderRegion = (region) => {
    const regionTeamNames = Object.keys(teams).filter(
      (name) => teams[name].region === region
    );

    const schedule = generateSchedule(regionTeamNames);
    const key = `${stageLabel}_${region}`;
    const regionResults = results[key] || [];
    const currentMatchday = matchdayIndices[key] || 0;

    const simulateDay = () => {
      const { updatedResults, updatedStandings, matchdayDone, hostCity } =
        simulateMatchday(region, currentMatchday, results[key] || [], standings[key] || {});

      if (!matchdayDone) {
        setResults((prev) => ({
          ...prev,
          [key]: updatedResults[region],
        }));

        setStandings((prev) => ({
          ...prev,
          [key]: updatedStandings[region],
        }));

        setMatchdayIndices((prev) => ({
          ...prev,
          [key]: (prev[key] || 0) + 1,
        }));

        setHostCitiesMap((prev) => ({
          ...prev,
          [`${key}_matchday${currentMatchday + 1}`]: hostCity,
        }));
      }
    };

    return (
      <div key={region} className="bg-[#1c1c1c] p-4 rounded-2xl text-white mb-10 shadow-lg border border-[#2c2c2c]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-extrabold tracking-wide uppercase">
              {region} League — {isStage1 ? 'Stage 1' : 'Stage 2'}
            </h3>
            <p className="text-sm text-gray-400">
              Match {Math.min(currentMatchday + 1, schedule.length)} of {schedule.length}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-4 py-2 rounded-xl text-sm font-bold uppercase disabled:opacity-50"
              onClick={simulateDay}
              disabled={currentMatchday >= schedule.length}
            >
              Simulate Match
            </button>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-xl text-sm font-bold uppercase"
              onClick={() => setVisibleStandingRegion(region)}
            >
              View Standings
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {regionResults.map((res, idx) => (
            <div
              key={`${res.teamA}-${res.teamB}-day${res.matchday}-${idx}`}
              className="bg-[#2a2a2a] rounded-xl p-4 flex flex-col shadow-lg border border-[#333] hover:shadow-cyan-500/30 transition-all duration-200"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 max-w-[45%] overflow-hidden">
                  <img
                    src={`/logos/${teams[res.teamA]?.logo || 'default.png'}`}
                    alt={res.teamA}
                    className="w-6 h-6 object-contain "
                  />
                  <span className="font-bold text-sm truncate">{res.teamA}</span>
                </div>
                <div className="text-white font-extrabold text-lg px-3 py-1 rounded bg-gradient-to-r from-gray-700 to-gray-800 shadow-inner">
                  {res.score}
                </div>
                <div className="flex items-center gap-2 max-w-[45%] overflow-hidden justify-end">
                  <span className="font-bold text-sm truncate text-right">{res.teamB}</span>
                  <img
                    src={`/logos/${teams[res.teamB]?.logo || 'default.png'}`}
                    alt={res.teamB}
                    className="w-6 h-6 object-contain"
                  />
                </div>
              </div>
              <div className="text-xs mt-2 space-y-1 leading-tight">
                <div>
                  <span className="text-gray-400">Winner:</span>{' '}
                  <span className="text-green-400 font-semibold">{res.winner}</span>
                </div>
                <div>
                  <span className="text-gray-400">MVP:</span>{' '}
                  <span className="text-cyan-400">{res.mvp.name}</span>{' '}
                  <span className="text-gray-500">({res.mvp.K}/{res.mvp.D}/{res.mvp.A})</span>
                </div>
                <div>
                  <span className="text-gray-400">Host City:</span>{' '}
                  <span className="text-yellow-300 font-medium">
                    {hostCitiesMap[`${key}_matchday${res.matchday}`] || '—'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Standings */}
        {visibleStandingRegion === region && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center p-6">
            <div className="bg-[#1c1c1c] w-full max-w-3xl p-6 rounded-lg text-white relative">
              <button
                className="absolute top-4 right-4 text-gray-300 hover:text-white text-lg"
                onClick={() => setVisibleStandingRegion(null)}
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-4">{region} League Standings</h2>
              <table className="w-full text-sm border border-gray-600">
                <thead className="bg-[#2a2a2a] text-gray-300">
                  <tr>
                    <th className="py-2 px-3 text-left">Team</th>
                    <th className="py-2 px-3 text-center">W</th>
                    <th className="py-2 px-3 text-center">L</th>
                    <th className="py-2 px-3 text-center">MP</th>
                    <th className="py-2 px-3 text-center">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(standings[key] || {})
                    .sort((a, b) => b[1].Points - a[1].Points)
                    .map(([teamName, stats]) => (
                      <tr key={teamName} className="border-t border-gray-700 hover:bg-[#333]">
                        <td className="py-2 px-3">{teamName}</td>
                        <td className="py-2 px-3 text-center">{stats.W}</td>
                        <td className="py-2 px-3 text-center">{stats.L}</td>
                        <td className="py-2 px-3 text-center">{stats.MP}</td>
                        <td className="py-2 px-3 text-center">{stats.Points}</td>
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
      <div className="space-y-10">
        {regions.map((region) => renderRegion(region))}
      </div>
    </div>
  );
};

export default LeagueView;
