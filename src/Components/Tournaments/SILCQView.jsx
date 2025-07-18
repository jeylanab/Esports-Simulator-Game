// src/Components/Tournaments/SILCQView.jsx
import React, { useState } from 'react';
import { useTournaments } from './TournamentContext';
import teams from '../../../data/teams';
import MatchCard from './MatchCard';
import { shuffleArray, simulateMatch } from '../../Utils/tournamentLogic';

const regions = ['NA', 'MENA', 'APAC', 'SA'];
const slotsPerRegion = 1;

const SILCQView = ({ goBack }) => {
  const { updateStage1Qualifiers } = useTournaments();

  const [regionData, setRegionData] = useState(() => {
    const data = {};

    for (let region of regions) {
      const pool = Object.values(teams).filter(t => t.region === region);
      const chosen = shuffleArray(pool).slice(0, 4);

      if (chosen.length < 4) {
        data[region] = {
          teams: chosen,
          matches: [],
          finalMatch: null,
          winner: null,
        };
        continue;
      }

      const semiFinals = [
        { teamA: chosen[0], teamB: chosen[1], result: null },
        { teamA: chosen[2], teamB: chosen[3], result: null },
      ];

      data[region] = {
        teams: chosen,
        matches: semiFinals,
        finalMatch: null,
        winner: null,
      };
    }

    return data;
  });

  const simulateSemi = (region, idx) => {
    setRegionData(prev => {
      const copy = { ...prev };
      const match = copy[region].matches[idx];
      if (!match || match.result) return prev;

      match.result = simulateMatch(match.teamA, match.teamB);
      copy[region].matches[idx] = { ...match };

      // If both semifinals are done, create final match
      if (copy[region].matches.every(m => m.result) && !copy[region].finalMatch) {
        const [semi1, semi2] = copy[region].matches;
        copy[region].finalMatch = {
          teamA: semi1.result.winner,
          teamB: semi2.result.winner,
          result: null,
        };
      }

      return copy;
    });
  };

  const simulateFinal = (region) => {
    setRegionData(prev => {
      const copy = { ...prev };
      const match = copy[region].finalMatch;
      if (!match || match.result) return prev;

      match.result = simulateMatch(match.teamA, match.teamB);
      copy[region].finalMatch = { ...match };
      copy[region].winner = match.result.winner;

      return copy;
    });
  };

  const confirmAll = () => {
    for (let region of regions) {
      const winner = regionData[region]?.winner;
      if (!winner) {
        alert(`Region ${region} has not completed the qualifier.`);
        return;
      }
      updateStage1Qualifiers(region, [winner]);
    }

    alert('✅ All regions qualified one team for SI!');
    goBack();
  };

  return (
    <div className="p-6 text-white bg-[#111827] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">🌍 Regional SI Last-Chance Qualifiers</h2>
        <button onClick={goBack} className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded">Back</button>
      </div>

      {regions.map(region => {
        const data = regionData[region];
        return (
          <div key={region} className="mb-8 p-4 bg-gray-800 rounded">
            <h3 className="text-lg font-semibold text-cyan-300">{region}</h3>

            {/* Semifinal Matches */}
            {data.matches.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 mt-4">
                {data.matches.map((m, i) => (
                  <MatchCard
                    key={i}
                    match={m}
                    index={i}
                    simulate={() => simulateSemi(region, i)}
                    isActiveRound={!m.result && !data.finalMatch}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 mt-2">Not enough teams in this region to run LCQ.</p>
            )}

            {/* Final Match */}
            {data.finalMatch && (
              <div className="mt-6">
                <h4 className="text-md text-yellow-400 font-semibold mb-2">Regional Final</h4>
                <MatchCard
                  match={data.finalMatch}
                  index={0}
                  simulate={() => simulateFinal(region)}
                  isActiveRound={!data.finalMatch.result}
                />
              </div>
            )}

            {/* Winner */}
            {data.winner && (
              <p className="mt-4 text-green-400 font-bold">
                🎉 Qualified: {data.winner.name}
              </p>
            )}
          </div>
        );
      })}

      <div className="text-center mt-6">
        <button
          onClick={confirmAll}
          className="bg-blue-500 hover:bg-blue-600 px-6 py-3 font-semibold rounded"
        >
          ✅ Confirm All Qualifiers
        </button>
      </div>
    </div>
  );
};

export default SILCQView;
