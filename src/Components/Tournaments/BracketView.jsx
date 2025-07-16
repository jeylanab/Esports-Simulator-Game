import React, { useState } from 'react';
import teams from '../../../data/teams';
import MatchCard from './MatchCard';
import { useGame } from '../Game/GameContext';

const si2025TeamList = [
  "M80", "Spacestation Gaming", "G2 Esports", "FaZe Clan",
  "DarkZero", "Ninjas in Pyjamas", "Team BDS", "Team Liquid",
  "Astralis", "TSM", "Wolves Esports", "Elevate",
  "MNM Gaming", "FURY", "Black Dragons", "Heroic",
  "Sandbox Gaming", "CAG", "W7M Esports", "Virtus.pro"
];

const hostCities = ["Paris", "Boston", "Berlin", "Tokyo", "São Paulo", "Copenhagen", "Montréal"];
const regions = ['NA', 'EU', 'APAC', 'SA'];

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getTopTeamsByRegion(region, count = 4) {
  return Object.entries(teams)
    .filter(([_, data]) => data.region === region)
    .slice(0, count)
    .map(([name, data]) => ({
      name,
      players: data.players || [],
      region: data.region || 'Unknown',
      logo: data.logo || 'default_logo.png'
    }));
}

const BracketView = ({ title, phaseKey, goBack }) => {
  const [matchups, setMatchups] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [winner, setWinner] = useState(null);

  const { userTeamName, budget, setBudget, inbox, setInbox } = useGame();

  const siTeams = shuffleArray(si2025TeamList).map(name => ({
    name,
    players: teams[name]?.players || [],
    region: teams[name]?.region || "Unknown",
    logo: teams[name]?.logo || "default_logo.png"
  }));

  const simulateMatch = (teamA, teamB) => {
    const avgA = teamA.players.reduce((acc, p) => acc + p.rating, 0) / teamA.players.length || 1;
    const avgB = teamB.players.reduce((acc, p) => acc + p.rating, 0) / teamB.players.length || 1;
    const winner = Math.random() < avgA / (avgA + avgB) ? teamA : teamB;
    const mvp = winner.players[Math.floor(Math.random() * winner.players.length)] || {};
    const score = `7-${Math.floor(Math.random() * 6)}`;
    const hostCity = hostCities[Math.floor(Math.random() * hostCities.length)];
    const matchDate = `${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}/02/Year 1`;

    return { teamA, teamB, winner, mvp, score, hostCity, date: matchDate };
  };

  const initializeBracket = () => {
    let initialRound = [];

    if (phaseKey === 'stage1_lcq') {
      regions.forEach(region => {
        const top4 = getTopTeamsByRegion(region);
        for (let i = 0; i < top4.length; i += 2) {
          initialRound.push({
            teamA: top4[i],
            teamB: top4[i + 1] || null,
            region,
            result: null
          });
        }
      });
    } else {
      for (let i = 0; i < siTeams.length; i += 2) {
        initialRound.push({
          teamA: siTeams[i],
          teamB: siTeams[i + 1] || null,
          result: null
        });
      }
    }

    setMatchups([initialRound]);
    setCurrentRound(0);
    setWinner(null);
  };

  const simulateSingleMatch = (index) => {
    const roundCopy = [...matchups];
    const match = roundCopy[currentRound][index];
    if (match.result || !match.teamB) return;

    const result = simulateMatch(match.teamA, match.teamB);
    roundCopy[currentRound][index] = { ...match, result };
    setMatchups(roundCopy);

    const isRoundComplete = roundCopy[currentRound].every(m => m.result || !m.teamB);
    if (isRoundComplete) {
      const winners = roundCopy[currentRound].map(m => m.result?.winner || m.teamA);
      generateNextRound(winners);
    }
  };

  const simulateAllInRound = () => {
    matchups[currentRound].forEach((_, index) => simulateSingleMatch(index));
  };

  const prizeDistribution = {
    1: 0.3333,
    2: 0.15,
    3: 0.08,
    4: 0.0567,
    5: 0.045,
    6: 0.045,
    7: 0.0342,
    8: 0.0342,
    9: 0.025,
    10: 0.025,
    11: 0.025,
    12: 0.025,
    13: 0.0183,
    14: 0.0183,
    15: 0.0183,
    16: 0.0183,
    17: 0.0116,
    18: 0.0116,
    19: 0.0116,
    20: 0.0116
  };

  const prizePool = phaseKey === 'world_cup'
    ? 2_000_000
    : phaseKey === 'si'
    ? 3_000_000
    : 750_000;

  const generateNextRound = (winners) => {
    if (winners.length === 1) {
      setWinner(winners[0]);

      const userWon = winners[0].name === userTeamName;
      if (userWon) {
        const payout = Math.round(prizeDistribution[1] * prizePool);
        setBudget(prev => prev + payout);
        setInbox(prev => [
          {
            key: `prize_${phaseKey}_${winners[0].name}`,
            title: `🏆 You Won ${title}!`,
            body: `Congrats! You earned $${payout.toLocaleString()} for finishing 1st.`,
            date: new Date().toISOString().slice(0, 10),
          },
          ...prev,
        ]);
      }

      return;
    }

    const shuffled = shuffleArray(winners);
    const newRound = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      newRound.push({
        teamA: shuffled[i],
        teamB: shuffled[i + 1] || null,
        result: null
      });
    }

    setMatchups(prev => [...prev, newRound]);
    setCurrentRound(prev => prev + 1);
  };

  return (
    <div className="p-4 md:p-8 text-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <div>
          <button onClick={goBack} className="mr-3 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">← Back</button>
          <button onClick={initializeBracket} className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded font-semibold">
            Start Bracket
          </button>
        </div>
      </div>

      {matchups.length > 0 && (
        <div>
          <h3 className="text-cyan-400 text-lg font-bold mb-3 text-center">Round {currentRound + 1}</h3>
          <div className="flex justify-center mb-4">
            <button
              onClick={simulateAllInRound}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black rounded font-semibold"
            >
              Sim All
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {matchups[currentRound].map((match, i) => (
              <MatchCard
                key={i}
                match={match}
                index={i}
                simulate={simulateSingleMatch}
                isActiveRound={currentRound === matchups.length - 1}
              />
            ))}
          </div>
        </div>
      )}

      {winner && (
        <div className="mt-10 text-center text-2xl italic font-extrabold text-green-300 border-t pt-4">
          Champion: {winner.name}
        </div>
      )}
    </div>
  );
};

export default BracketView;
