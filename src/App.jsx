// src/App.jsx
import React, { useState } from 'react';
import HomeScreen from './Components/HomeScreen';
import CareerSetup from './Components/Career/CareerSetup';
import TeamPreview from './Components/TeamPreview';
import NavBar from './Components/NavBar';
import InboxView from './Components/Inbox/InboxView';
import CalendarView from './Components/Calendar/CalendarView';

import { CalendarProvider } from './Components/Calendar/CalendarContext';
import { GameProvider } from './Components/Game/GameContext';
import { useCalendarEffects } from './Components/Calendar/useCalendarEffects';

import teams from '../data/teams';

const AppContent = () => {
  const [screen, setScreen] = useState('home');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [savedData, setSavedData] = useState(null);
  const [activeView, setActiveView] = useState('calendar'); // for nav control

  useCalendarEffects(); // ✅ Runs phase-based side effects

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
    return data;
  };

  const handleLoadSlot = (slot) => {
    const data = loadCareer(slot);
    if (!data) {
      alert("No data in that slot.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {screen !== 'home' && <NavBar setScreen={setScreen} setActiveView={setActiveView} />}

      {screen === 'home' && (
        <HomeScreen
          onStart={() => setScreen('career')}
          onLoadSlot1={() => handleLoadSlot(1)}
          onLoadSlot2={() => handleLoadSlot(2)}
        />
      )}

      {screen === 'career' && (
        <>
          {/* Conditionally render views based on nav */}
          {activeView === 'calendar' && <CalendarView />}
          {activeView === 'inbox' && <InboxView />}
          {activeView === 'career' && (
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
            />
          )}
          {/* Add more views like roster, transfers, stats, etc. here */}
        </>
      )}
    </div>
  );
};

// ✅ App wrapper with providers
const App = () => (
  <CalendarProvider>
    <GameProvider>
      <AppContent />
    </GameProvider>
  </CalendarProvider>
);

export default App;
