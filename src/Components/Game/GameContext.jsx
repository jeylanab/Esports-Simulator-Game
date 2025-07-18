import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getNextDate } from '../../Utils/dateUtils';
import allTeams from '../../../data/teams';

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [inbox, setInbox] = useState([]);
  const [userTeam, setUserTeam] = useState([]);
  const [userTeamName, setUserTeamName] = useState(null);
  const [budget, setBudget] = useState(1_000_000);
  const [currentDate, setCurrentDate] = useState('2026-01-01');

  const audioRef = useRef(null);
  const didMount = useRef(false);

  const playAlert = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const normalizePlayer = (player) => ({
    name: player.name || player.Player || 'Unknown',
    rating: player.rating ?? player.Overall ?? 70,
    iq: player.iq ?? player.GameSense ?? 70,
    aim: player.aim ?? player.Aim ?? 70,
    mechanics: player.mechanics ?? player.Mechanics ?? 70,
    clutch: player.clutch ?? player.Clutch ?? 70,
    Role: player.Role || '',
    Country: player.Country || '',
    Age: player.Age || '',
  });

  useEffect(() => {
    const savedTeam = localStorage.getItem('user_team');
    const savedBudget = localStorage.getItem('user_budget');
    const savedTeamName = localStorage.getItem('user_team_name');
    const savedSlot = localStorage.getItem('career_slot_1');

    if (savedTeam) {
      const parsedTeam = JSON.parse(savedTeam).map(normalizePlayer);
      setUserTeam(parsedTeam);
    } else if (savedSlot) {
      const slot = JSON.parse(savedSlot);
      const basePlayers = allTeams[slot.team]?.players || [];
      const normalized = basePlayers.map(normalizePlayer);
      setUserTeam(normalized);
      setUserTeamName(slot.team);
      localStorage.setItem('user_team', JSON.stringify(normalized));
      localStorage.setItem('user_team_name', slot.team);
    }

    if (savedTeamName) setUserTeamName(savedTeamName);
    if (savedBudget) setBudget(Number(savedBudget));
    else {
      setBudget(1_000_000);
      localStorage.setItem('user_budget', '1000000');
    }

    // Initial welcome message (don't trigger sound)
    setInbox((prev) => [
      {
        key: 'intro_welcome',
        title: 'Welcome to Siege Manager',
        body: 'Your journey as a coach begins now. Watch for transfer news and event updates.',
        date: '2026-01-01',
      },
      ...prev,
    ]);

    didMount.current = true;
  }, []);

  const setInboxWithSound = (callback) => {
    setInbox((prev) => {
      const next = callback(prev);
      if (didMount.current && next.length > prev.length) {
        playAlert();
      }
      return next;
    });
  };

  const [teamData, setTeamData] = useState(() => {
    const regions = {};
    for (const teamName in allTeams) {
      const team = allTeams[teamName];
      const entry = {
        name: teamName,
        region: team.region,
        logo: team.logo,
        players: team.players.map(normalizePlayer),
        wins: 0,
        losses: 0,
        points: 0,
      };
      if (!regions[team.region]) regions[team.region] = [];
      regions[team.region].push(entry);
    }
    return regions;
  });

  const advanceDay = () => {
    const next = getNextDate(currentDate);
    setCurrentDate(next);
  };

  useEffect(() => {
    const eventTriggers = {
      '2026-01-03': {
        title: '🏁 Transfer Window Opens',
        body: 'You can now sign free agents. Keep an eye on your inbox.',
      },
      '2026-03-03': {
        title: '⚔️ Stage 1 Begins',
        body: 'Your regional league starts today! Time to compete.',
      },
      '2026-05-05': {
        title: '🌍 Stage 1 Major Begins',
        body: 'Top teams face off in the first international Major!',
      },
      '2026-08-05': {
        title: '🏆 Siege X Starts!',
        body: 'The Esports World Cup begins. $2M is on the line.',
      },
      '2026-09-29': {
        title: '📦 Season Ending Soon',
        body: 'Prepare for awards, retirements, and rookie draft.',
      },
    };

    const event = eventTriggers[currentDate];
    if (event) {
      setInboxWithSound((prev) => [
        {
          key: `event_${currentDate}`,
          title: event.title,
          body: event.body,
          date: currentDate,
        },
        ...prev,
      ]);
    }
  }, [currentDate]);

  const signPlayer = (player) => {
    const normalized = normalizePlayer(player);
    const alreadySigned = userTeam.some((p) => p.name === normalized.name);
    const cost = 250_000;

    if (alreadySigned || budget < cost) {
      setInboxWithSound((prev) => [
        {
          key: `fail_${normalized.name}`,
          title: alreadySigned ? '⚠️ Already Signed' : '💸 Not Enough Budget',
          body: alreadySigned
            ? `${normalized.name} is already on your team.`
            : `You don’t have enough budget to sign ${normalized.name}.`,
          date: currentDate,
        },
        ...prev,
      ]);
      return;
    }

    const updatedTeam = [...userTeam, normalized];
    const updatedBudget = budget - cost;
    setUserTeam(updatedTeam);
    setBudget(updatedBudget);
    localStorage.setItem('user_team', JSON.stringify(updatedTeam));
    localStorage.setItem('user_budget', updatedBudget.toString());

    setInboxWithSound((prev) => [
      {
        key: `signed_${normalized.name}`,
        title: `📝 Player Signed: ${normalized.name}`,
        body: `${normalized.name} has joined your roster for $${cost.toLocaleString()}.`,
        date: currentDate,
      },
      ...prev,
    ]);
  };

  return (
    <GameContext.Provider
      value={{
        inbox,
        setInbox: setInboxWithSound,
        userTeam,
        setUserTeam,
        budget,
        setBudget,
        signPlayer,
        currentDate,
        setCurrentDate,
        advanceDay,
        teamData,
        setTeamData,
        userTeamName,
      }}
    >
      {children}
      <audio ref={audioRef} src="/sound/alert.wav" preload="auto" />
    </GameContext.Provider>
  );
};
