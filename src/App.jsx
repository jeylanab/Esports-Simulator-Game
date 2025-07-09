// src/App.jsx
import React, { useState } from 'react';
import HomeScreen from './Components/HomeScreen';
import CareerSetup from './Components/Career/CareerSetup';
import TeamPreview from './Components/TeamPreview';
import InboxView from './Components/Inbox/InboxView';
import CalendarView from './Components/Calendar/CalendarView';
import NavBar from './Components/NavBar';
import TransferWindow from './Components/Transfers/TransferWindow';
import MyTeam from './Components/MyTeam/MyTeam';

import { CalendarProvider } from './Components/Calendar/CalendarContext';
import { GameProvider, useGame } from './Components/Game/GameContext';
import { useCalendarEffects } from './Components/Calendar/useCalendarEffects';

import teams from '../data/teams';

const AppContent = () => {
  const [screen, setScreen] = useState('home');
  const [careerStarted, setCareerStarted] = useState(false);
  const [savedData, setSavedData] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [activeView, setActiveView] = useState('calendar');

  const { setUserTeam } = useGame();
  useCalendarEffects();

  const loadCareer = (slot) => {
    const saved = localStorage.getItem(`career_slot_${slot}`);
    if (!saved) {
      alert(`No data found in slot ${slot}`);
      return null;
    }

    const data = JSON.parse(saved);
    setSavedData(data);
    setSelectedTeam(data.team);
    setScreen('career');
    setCareerStarted(true);
    setActiveView('calendar');

    const loadedPlayers = Array.isArray(teams[data.team]) ? teams[data.team] : [];
    setUserTeam(loadedPlayers);

    return data;
  };

  const handleLoadSlot = (slot) => {
    const data = loadCareer(slot);
    if (!data) alert("No data in that slot.");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {screen === 'home' && (
        <HomeScreen
          onStart={() => {
            setScreen('career');
            setCareerStarted(false);
          }}
          onLoadSlot1={() => handleLoadSlot(1)}
          onLoadSlot2={() => handleLoadSlot(2)}
        />
      )}

      {screen === 'career' && (
        <>
          {careerStarted && (
            <NavBar setScreen={setScreen} setActiveView={setActiveView} />
          )}

          {!careerStarted ? (
            <CareerSetup
              teams={teams}
              onPreview={setSelectedTeam}
              onBack={() => setScreen('home')}
              teamPreview={
                selectedTeam && (
                  <TeamPreview
                    teamName={selectedTeam}
                    team={teams[selectedTeam]}
                  />
                )
              }
              savedData={savedData}
              onCareerCreated={(teamName) => {
                setCareerStarted(true);
                setActiveView('calendar');
                setSelectedTeam(teamName);
                const initialPlayers = Array.isArray(teams[teamName]) ? teams[teamName] : [];
                setUserTeam(initialPlayers);
              }}
            />
          ) : (
            <>
              {activeView === 'calendar' && <CalendarView />}
              {activeView === 'inbox' && <InboxView />}
              {activeView === 'transfers' && <TransferWindow />}
              {activeView === 'team' && <MyTeam teamName={selectedTeam} />}
            </>
          )}
        </>
      )}
    </div>
  );
};

const App = () => (
  <CalendarProvider>
    <GameProvider>
      <AppContent />
    </GameProvider>
  </CalendarProvider>
);

export default App;
