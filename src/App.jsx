// src/App.jsx
import React, { useState } from 'react';
import HomeScreen from './Components/HomeScreen';
import CareerSetup from './Components/Career/CareerSetup';
import TeamPreview from './Components/TeamPreview';
import InboxView from './Components/Inbox/InboxView';
import CalendarView from './Components/Calendar/CalendarView';
import NavBar from './Components/NavBar';

import { CalendarProvider } from './Components/Calendar/CalendarContext';
import { GameProvider } from './Components/Game/GameContext';
import { useCalendarEffects } from './Components/Calendar/useCalendarEffects';

import teams from '../data/teams';

const AppContent = () => {
  const [screen, setScreen] = useState('home'); // home or career
  const [careerStarted, setCareerStarted] = useState(false); // setup finished?
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [savedData, setSavedData] = useState(null);
  const [activeView, setActiveView] = useState('calendar'); // inbox | calendar | etc.

  useCalendarEffects(); // hook for reacting to calendar phases

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
    setCareerStarted(true); // fully setup
    setActiveView('calendar');
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
            setCareerStarted(false); // user must create new team
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
              onCareerCreated={() => {
                setCareerStarted(true);
                setActiveView('calendar'); // default to calendar after setup
              }}
            />
          ) : (
            <>
              {activeView === 'calendar' && <CalendarView />}
              {activeView === 'inbox' && <InboxView />}
              {/* add more views here if needed */}
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
