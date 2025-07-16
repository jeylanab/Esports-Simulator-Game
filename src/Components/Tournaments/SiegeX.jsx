// src/Components/Tournaments/SiegeX.jsx
import React, { useEffect, useState } from 'react';
import teams from '../../../data/teams';
import { useTournaments } from './TournamentContext';
import MatchCard from './MatchCard';

const prizePool = 2000000;
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
  if (!teamA || !teamB || !Array.isArray(teamA.players) || !Array.isArray(teamB.players)) {
    console.warn("❌ Invalid team data in match", { teamA, teamB });
    return {
      teamA,
      teamB,
      winner: { name: "Invalid Match", players: [] },
      mvp: { name: "N/A" },
      score: "0-0",
      hostCity: hostCities[Math.floor(Math.random() * hostCities.length)],
    };
  }

  const avgA = teamA.players.reduce((sum, p) => sum + p.rating, 0) / teamA.players.length;
  const avgB = teamB.players.reduce((sum, p) => sum + p.rating, 0) / teamB.players.length;

  const winner = Math.random() < avgA / (avgA + avgB) ? teamA : teamB;
  const mvp = winner.players[Math.floor(Math.random() * winner.players.length)];
  const score = `2-${Math.floor(Math.random() * 2)}`;
  const hostCity = hostCities[Math.floor(Math.random() * hostCities.length)];

  return { teamA, teamB, winner, mvp, score, hostCity };
};

const SiegeX = ({ goBack }) => {
  const { stage1QualifiedTeams } = useTournaments();
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [champion, setChampion] = useState(null);

  useEffect(() => {
    const lcqTeams = Object.values(stage1QualifiedTeams)
      .flat()
      .filter(t => t && t.name && Array.isArray(t.players))
      .slice(0, 8);

    const extraInvites = Object.entries(teams)
      .filter(([name]) => !lcqTeams.find(t => t.name === name))
      .slice(0, 12)
      .map(([name, data]) => ({ name, ...data }))
      .filter(t => Array.isArray(t.players));

    const allTeams = shuffleArray([...lcqTeams, ...extraInvites]).slice(0, 20);

    // Round 1: 16 teams (8 matches), 4 byes
    const byes = allTeams.slice(0, 4);
    const round1Teams = allTeams.slice(4);
    const round1 = [];
    for (let i = 0; i < round1Teams.length; i += 2) {
      round1.push({ teamA: round1Teams[i], teamB: round1Teams[i + 1], result: null });
    }

    setRounds([[...round1]]);
    setChampion(null);
    setCurrentRound(0);

    // Store byes separately
    setRounds(prev => {
      prev.byedTeams = byes;
      return prev;
    });
  }, []);

  const simulateMatchAt = (index) => {
    setRounds(prev => {
      const roundsCopy = [...prev];
      const match = roundsCopy[currentRound][index];
      if (!match || match.result) return prev;

      const result = simulateMatch(match.teamA, match.teamB);
      roundsCopy[currentRound][index] = { ...match, result };

      const isRoundComplete = roundsCopy[currentRound].every(m => m.result);

      if (isRoundComplete) {
        let winners = roundsCopy[currentRound].map(m => m.result.winner);

        if (currentRound === 0 && prev.byedTeams) {
          winners = [...winners, ...prev.byedTeams];
        }

        if (winners.length === 1) {
          setChampion(winners[0]);
        } else {
          const shuffled = shuffleArray(winners);
          const nextRound = [];
          for (let i = 0; i < shuffled.length; i += 2) {
            nextRound.push({
              teamA: shuffled[i],
              teamB: shuffled[i + 1],
              result: null
            });
          }
          setTimeout(() => setCurrentRound(prev => prev + 1), 0);
          roundsCopy.push(nextRound);
        }
      }

      return roundsCopy;
    });
  };

  const simulateAll = () => {
    rounds[currentRound]?.forEach((_, i) => simulateMatchAt(i));
  };

  return (
    <div className="p-6 bg-[#111827] text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-yellow-400">🏆 Siege X – Esports World Cup</h2>
        <button onClick={goBack} className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded">
          Back
        </button>
      </div>

      {rounds.length > 0 && (
        <>
          <h3 className="text-xl text-cyan-300 font-semibold mb-4 text-center">
            Round {currentRound + 1}
          </h3>

          <div className="text-center mb-6">
            <button
              onClick={simulateAll}
              className="bg-orange-500 hover:bg-orange-600 px-6 py-2 text-black font-semibold rounded"
            >
              Simulate All Matches
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rounds[currentRound]?.map((match, idx) => (
              <MatchCard
                key={idx}
                match={match}
                index={idx}
                simulate={simulateMatchAt}
                isActiveRound
              />
            ))}
          </div>
        </>
      )}

      {champion && (
        <div className="mt-10 text-center text-green-400 text-3xl font-bold border-t pt-6">
          🎉 Champion: {champion.name}
        </div>
      )}
    </div>
  );
};

export default SiegeX;
