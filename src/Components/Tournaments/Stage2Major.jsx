// src/Components/Tournaments/Stage2Major.jsx
import React, { useEffect, useState } from 'react';
import { useTournaments } from './TournamentContext';
import teams from '../../../data/teams';
import MatchCard from './MatchCard';
import { shuffleArray, simulateMatch } from '../../Utils/tournamentLogic';

const Stage2Major = ({ goBack }) => {
  const { stage1QualifiedTeams } = useTournaments();
  const [swissRounds, setSwissRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [playoffs, setPlayoffs] = useState([]);
  const [finalChampion, setFinalChampion] = useState(null);

  // 🔁 Setup Swiss stage on mount
  useEffect(() => {
    const qualifiedTeams = Object.values(stage1QualifiedTeams)
      .flat()
      .filter(t => t && t.name && Array.isArray(t.players));

    const selected = shuffleArray(qualifiedTeams).slice(0, 16);

    const round1 = [];
    for (let i = 0; i < selected.length; i += 2) {
      round1.push({ teamA: selected[i], teamB: selected[i + 1], result: null });
    }

    setSwissRounds([round1]);
    setCurrentRound(0);
    setFinalChampion(null);
    setPlayoffs([]);
  }, []);

  // 🔁 Simulate a single Swiss match
  const simulateSwissMatchAt = (index) => {
    setSwissRounds(prev => {
      const copy = [...prev];
      const round = copy[currentRound];
      if (!round || !round[index] || round[index].result) return prev;

      const match = round[index];
      match.result = simulateMatch(match.teamA, match.teamB);
      copy[currentRound][index] = { ...match };

      const allDone = round.every(m => m.result);
      if (allDone) {
        const winners = round.map(m => m.result.winner);

        if (currentRound === 2) {
          const top8 = shuffleArray(winners).slice(0, 8);
          const qf = [];
          for (let i = 0; i < top8.length; i += 2) {
            qf.push({ teamA: top8[i], teamB: top8[i + 1], result: null });
          }
          setPlayoffs([qf]);
        } else {
          const next = [];
          const shuffled = shuffleArray(winners);
          for (let i = 0; i < shuffled.length; i += 2) {
            next.push({ teamA: shuffled[i], teamB: shuffled[i + 1], result: null });
          }
          setSwissRounds([...copy, next]);
          setCurrentRound(prev => prev + 1);
        }
      }

      return copy;
    });
  };

  const simulateAllSwiss = () => {
    if (Array.isArray(swissRounds[currentRound])) {
      swissRounds[currentRound].forEach((_, i) => simulateSwissMatchAt(i));
    }
  };

  // 🔁 Playoffs logic
  const simulatePlayoffMatchAt = (index) => {
    setPlayoffs(prev => {
      const copy = [...prev];
      const current = copy[copy.length - 1];
      if (!current || !current[index] || current[index].result) return prev;

      const match = current[index];
      match.result = simulateMatch(match.teamA, match.teamB);
      copy[copy.length - 1][index] = { ...match };

      const done = current.every(m => m.result);
      if (done) {
        const winners = current.map(m => m.result.winner);
        if (winners.length === 1) {
          setFinalChampion(winners[0]);
        } else {
          const next = [];
          for (let i = 0; i < winners.length; i += 2) {
            next.push({ teamA: winners[i], teamB: winners[i + 1], result: null });
          }
          setPlayoffs([...copy, next]);
        }
      }

      return copy;
    });
  };

  const simulateAllPlayoffs = () => {
    const last = playoffs.length - 1;
    if (Array.isArray(playoffs[last])) {
      playoffs[last].forEach((_, i) => simulatePlayoffMatchAt(i));
    }
  };

  const playoffStageName = ["Quarterfinals", "Semifinals", "Final"];

  return (
    <div className="p-6 bg-[#111827] text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-yellow-400">🏆 Stage 2 Major – Swiss + Playoffs</h2>
        <button onClick={goBack} className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded">
          Back
        </button>
      </div>

      {/* Swiss Rounds */}
      {swissRounds.length > 0 && playoffs.length === 0 && (
        <>
          <h3 className="text-xl text-cyan-300 font-semibold mb-4 text-center">
            Swiss Round {currentRound + 1}
          </h3>
          <div className="text-center mb-6">
            <button
              onClick={simulateAllSwiss}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 text-white font-semibold rounded"
            >
              Simulate Swiss Round
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(swissRounds[currentRound]) &&
              swissRounds[currentRound].map((match, idx) => (
                <MatchCard
                  key={idx}
                  match={match}
                  index={idx}
                  simulate={simulateSwissMatchAt}
                  isActiveRound
                />
              ))}
          </div>
        </>
      )}

      {/* Playoffs */}
      {playoffs.length > 0 && !finalChampion && (
        <>
          <h3 className="text-xl text-pink-400 font-semibold mb-4 text-center">
            Playoffs – {playoffStageName[playoffs.length - 1] || "Unknown Stage"}
          </h3>
          <div className="text-center mb-6">
            <button
              onClick={simulateAllPlayoffs}
              className="bg-purple-500 hover:bg-purple-600 px-6 py-2 text-white font-semibold rounded"
            >
              Simulate Playoff Round
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(playoffs[playoffs.length - 1]) &&
              playoffs[playoffs.length - 1].map((match, idx) => (
                <MatchCard
                  key={idx}
                  match={match}
                  index={idx}
                  simulate={simulatePlayoffMatchAt}
                  isActiveRound
                />
              ))}
          </div>
        </>
      )}

      {/* Final Champion */}
      {finalChampion && (
        <div className="mt-10 text-center text-green-400 text-3xl font-bold border-t pt-6">
          🎉 Stage 2 Major Champion: {finalChampion.name}
        </div>
      )}
    </div>
  );
};

export default Stage2Major;
