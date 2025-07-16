// src/Components/Tournaments/LCQView.jsx
import React, { useState } from 'react';
import teams from '../../../data/teams';
import { useTournaments } from './TournamentContext';

const regions = ['NA', 'MENA', 'APAC', 'SA'];
const hostCities = ["Paris", "Boston", "Berlin", "Tokyo", "São Paulo", "Copenhagen", "Montréal"];

const shuffleArray = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const simulateMatch = (teamA, teamB) => {
  const avgA = teamA.players.reduce((sum, p) => sum + p.rating, 0) / teamA.players.length;
  const avgB = teamB.players.reduce((sum, p) => sum + p.rating, 0) / teamB.players.length;
  const winner = Math.random() < avgA / (avgA + avgB) ? teamA : teamB;
  const mvp = winner.players[Math.floor(Math.random() * winner.players.length)];
  const score = `7-${Math.floor(Math.random() * 6)}`;
  const hostCity = hostCities[Math.floor(Math.random() * hostCities.length)];
  const date = `${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}/02/Year 1`;

  return { teamA, teamB, winner, mvp, score, hostCity, date };
};

const LCQView = ({ goBack }) => {
  const { updateStage1Qualifiers, resetStage1Qualifiers } = useTournaments();
  const [lcqFinished, setLCQFinished] = useState(false);

  const [regionData, setRegionData] = useState(() => {
    const result = {};
    regions.forEach(region => {
      const filtered = Object.entries(teams).filter(([_, val]) => val.region === region);
      const selected = shuffleArray(filtered).slice(0, 4).map(([name, data]) => ({ name, ...data }));

      result[region] = {
        teams: selected,
        matches: selected.length === 4 ? [
          { teamA: selected[0], teamB: selected[1], result: null },
          { teamA: selected[2], teamB: selected[3], result: null },
        ] : [],
        finalMatch: null,
        qualifiers: []
      };
    });
    return result;
  });

  const simulateRound = (region, index) => {
    setRegionData(prev => {
      const updated = { ...prev };
      const match = updated[region].matches[index];
      if (!match || match.result) return updated;
      const result = simulateMatch(match.teamA, match.teamB);
      updated[region].matches[index].result = result;
      return updated;
    });
  };

  const simulateFinal = (region) => {
    setRegionData(prev => {
      const updated = { ...prev };
      const [m1, m2] = updated[region].matches;
      if (!m1?.result || !m2?.result) return updated;
      const final = simulateMatch(m1.result.winner, m2.result.winner);
      const loser = final.winner.name === m1.result.winner.name ? m2.result.winner : m1.result.winner;
      updated[region].finalMatch = final;
      updated[region].qualifiers = [final.winner, loser];
      return updated;
    });
  };

  const confirmAllQualified = () => {
    const allComplete = Object.values(regionData).every(region => region.qualifiers.length === 2);

    if (!allComplete) {
      alert("⚠️ Please simulate all matches and finals for all 4 regions.");
      return;
    }

    Object.entries(regionData).forEach(([region, data]) => {
      updateStage1Qualifiers(region, data.qualifiers);
    });

    alert("✅ LCQ completed and saved! You can now begin Stage 1 Major.");
    setLCQFinished(true);
  };

  const MatchCard = ({ match, region, idx }) => {
    const { teamA, teamB, result } = match;

    return (
      <div className="bg-[#0f172a] border border-gray-700 p-4 rounded-lg">
        <div className="flex justify-between items-center font-medium">
          <span>{teamA.name}</span>
          <span className="text-yellow-400">{result?.score || "VS"}</span>
          <span>{teamB.name}</span>
        </div>
        {result ? (
          <div className="text-sm text-gray-400 mt-3 space-y-1">
            <p>Winner: <span className="text-green-400 font-semibold">{result.winner.name}</span></p>
            <p>MVP: {result.mvp.name}</p>
            <p>Host: {result.hostCity}</p>
          </div>
        ) : (
          <button
            onClick={() => simulateRound(region, idx)}
            className="mt-3 w-full py-2 bg-orange-500 hover:bg-orange-600 text-black rounded font-semibold"
          >
            Simulate Match
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 text-white min-h-screen bg-[#111827]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Stage 1 LCQ - Double Elimination</h2>
        <button onClick={goBack} className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Back</button>
      </div>

      {regions.map(region => {
        const data = regionData[region];
        return (
          <div key={region} className="mb-10 p-5 border border-gray-600 rounded-lg bg-gray-800">
            <h3 className="text-xl font-semibold mb-4 text-cyan-300">{region} Region</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.matches.map((match, idx) => (
                <MatchCard key={idx} match={match} region={region} idx={idx} />
              ))}
            </div>

            {data.matches.every(m => m.result) && !data.finalMatch && (
              <div className="mt-5 text-center">
                <button
                  onClick={() => simulateFinal(region)}
                  className="bg-green-500 hover:bg-green-600 text-black font-semibold px-5 py-2 rounded"
                >
                  Simulate Final
                </button>
              </div>
            )}

            {data.qualifiers.length > 0 && (
              <div className="mt-5">
                <h4 className="text-green-400 font-bold mb-2">🏅 Qualified Teams:</h4>
                <ul className="space-y-1">
                  {data.qualifiers.map(team => (
                    <li key={team.name} className="flex items-center gap-2">
                      <img src={`/logos/${team.logo}`} className="w-5 h-5 object-contain" alt={team.name} />
                      <span className="text-white">{team.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}

      <div className="text-center mt-10 space-y-3">
        <button
          onClick={confirmAllQualified}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-black rounded font-semibold"
        >
          ✅ Finish LCQ & Ready for Stage 1 Major
        </button>

        {/* Optional: Developer reset button */}
        <div>
          <button
            onClick={resetStage1Qualifiers}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded mt-4"
          >
            🔄 Reset LCQ Save (Dev Mode)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LCQView;
