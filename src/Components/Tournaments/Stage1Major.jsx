// src/Components/Tournaments/Stage1Major.jsx

import React, { useEffect, useState } from 'react';
import { useTournaments } from './TournamentContext';
import teams from '../../../data/teams';
import MatchCard from './MatchCard';

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
  const date = `${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}/05/Year 1`;

  return { teamA, teamB, winner, mvp, score, hostCity, date };
};

const Stage1Major = ({ goBack }) => {
  const { stage1QualifiedTeams } = useTournaments();

  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [champion, setChampion] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const qualifiedTeams = Object.values(stage1QualifiedTeams).flat();

    // ✅ Validate structure & team data
    if (!qualifiedTeams || qualifiedTeams.length < 8) {
      setError("❌ Not enough qualified teams from LCQ. Please complete the LCQ stage.");
      return;
    }

    const invitedTeams = Object.entries(teams)
      .filter(([name]) => !qualifiedTeams.find(q => q.name === name))
      .slice(0, 8)
      .map(([name, data]) => ({
        name,
        players: data.players,
        region: data.region,
        logo: data.logo || 'default_logo.png'
      }));

    const allTeams = shuffleArray([...qualifiedTeams.slice(0, 8), ...invitedTeams]);

    // ✅ Generate first round
    const firstRound = [];
    for (let i = 0; i < 16; i += 2) {
      firstRound.push({
        teamA: allTeams[i],
        teamB: allTeams[i + 1],
        result: null,
      });
    }

    setRounds([firstRound]);
    setCurrentRound(0);
    setChampion(null);
    setError(""); // Clear error
  }, [stage1QualifiedTeams]);

  const simulateMatchAt = (index) => {
    setRounds(prev => {
      const roundCopy = [...prev];
      const match = roundCopy[currentRound][index];
      if (!match || match.result) return prev;

      const result = simulateMatch(match.teamA, match.teamB);
      roundCopy[currentRound][index] = { ...match, result };

      const isRoundComplete = roundCopy[currentRound].every(m => m.result);

      if (isRoundComplete) {
        const winners = roundCopy[currentRound].map(m => m.result.winner);

        if (winners.length === 1) {
          setChampion(winners[0]);
        } else {
          const shuffled = shuffleArray(winners);
          const nextRound = [];

          for (let i = 0; i < shuffled.length; i += 2) {
            nextRound.push({
              teamA: shuffled[i],
              teamB: shuffled[i + 1],
              result: null,
            });
          }

          const updatedRounds = [...roundCopy, nextRound];
          setRounds(updatedRounds);

          // Slight delay to let state settle
          setTimeout(() => setCurrentRound(updatedRounds.length - 1), 0);
        }
      }

      return roundCopy;
    });
  };

  const simulateAllMatches = () => {
    rounds[currentRound]?.forEach((_, idx) => simulateMatchAt(idx));
  };

  if (error) {
    return (
      <div className="p-6 bg-[#111827] text-white min-h-screen text-center">
        <h2 className="text-2xl font-bold mb-4">Stage 1 Major</h2>
        <p className="text-red-400 text-lg font-semibold">{error}</p>
        <button onClick={goBack} className="mt-6 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded">
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#111827] text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Stage 1 Major - Playoffs</h2>
        <button onClick={goBack} className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
          Back
        </button>
      </div>

      {rounds.length > 0 && (
        <>
          <h3 className="text-xl font-semibold text-center text-cyan-400 mb-4">
            Round {currentRound + 1}
          </h3>

          <div className="text-center mb-6">
            <button
              onClick={simulateAllMatches}
              className="bg-orange-500 px-6 py-2 rounded text-black font-semibold"
            >
              Simulate All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rounds[currentRound].map((match, idx) => (
              <MatchCard
                key={idx}
                match={match}
                index={idx}
                simulate={simulateMatchAt}
                isActiveRound={currentRound === rounds.length - 1}
              />
            ))}
          </div>
        </>
      )}

      {champion && (
        <div className="mt-12 text-center border-t pt-6 text-2xl font-bold text-green-400">
          Champion: {champion.name}
        </div>
      )}
    </div>
  );
};

export default Stage1Major;
