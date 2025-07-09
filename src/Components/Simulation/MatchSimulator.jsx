// src/Components/Simulation/MatchSimulator.jsx

import React, { useEffect, useState } from 'react';
import { simulateMatch } from '../../Utils/matchLogic';
import { useGame } from '../Game/GameContext';
import teams from '../../../data/teams';

const MatchSimulator = () => {
  const { userTeam } = useGame();
  const [myTeamName, setMyTeamName] = useState(null);
  const [myTeamPlayers, setMyTeamPlayers] = useState([]);
  const [opponentTeam, setOpponentTeam] = useState([]);
  const [opponentName, setOpponentName] = useState('');
  const [result, setResult] = useState(null);

  // 🔍 Detect current career team (real or custom)
  useEffect(() => {
    const slot1 = localStorage.getItem('career_slot_1');
    const slot2 = localStorage.getItem('career_slot_2');

    let career = null;
    if (slot1 && JSON.parse(slot1)?.team) {
      career = JSON.parse(slot1);
    } else if (slot2 && JSON.parse(slot2)?.team) {
      career = JSON.parse(slot2);
    }

    if (career) {
      setMyTeamName(career.team);

      // 🎯 Custom team = use userTeam (signed players)
      const isCustom = !teams[career.team];
      if (isCustom) {
        setMyTeamPlayers(userTeam);
      } else {
        // 🏢 Real team = load players from teams.js
        setMyTeamPlayers(teams[career.team]?.players || []);
      }
    }
  }, [userTeam]);

  // 🎲 Select a random opponent from teams.js (excluding user's team)
  const getRandomOpponent = () => {
    const allNames = Object.keys(teams).filter(name => name !== myTeamName);
    const randomName = allNames[Math.floor(Math.random() * allNames.length)];
    return {
      name: randomName,
      players: teams[randomName]?.players || [],
    };
  };

  const handleSimulate = () => {
    if (!myTeamPlayers || myTeamPlayers.length < 5) {
      alert('You must sign or load a valid team with at least 5 players.');
      return;
    }

    const opponent = getRandomOpponent();
    setOpponentTeam(opponent.players);
    setOpponentName(opponent.name);

    const matchResult = simulateMatch(myTeamPlayers, opponent.players);

    setResult({
      ...matchResult,
      opponentName: opponent.name,
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-gray-900 text-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">🎮 Match Simulator</h2>

      <div className="mb-4 space-y-1">
        <p>🧑‍💼 Your Team: <strong>{myTeamName || 'Not selected'}</strong></p>
        <p>🎯 Opponent: <strong>{opponentName || 'Random Team'}</strong></p>
      </div>

      <button
        onClick={handleSimulate}
        className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded text-white font-semibold transition"
      >
        ▶️ Simulate Match
      </button>

      {result && (
        <div className="mt-6 bg-gray-800 p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">🏆 Match Result</h3>
          <p><strong>{result.winnerName}</strong> beat <strong>{result.loserName}</strong></p>
          <p>📊 Score: {result.score}</p>
                  <p>🌟 MVP: {result.mvp.name} ({result.mvp.K}K / {result.mvp.D}D / {result.mvp.A}A)</p>

        </div>
      )}
    </div>
  );
};

export default MatchSimulator;
