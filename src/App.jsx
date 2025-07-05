import React, { useState } from 'react';
import HomeScreen from './Components/HomeScreen';
import CareerSetup from './Components/Career/CareerSetup';
import TeamPreview from './Components/TeamPreview';
import { CalendarProvider } from './Components/Calendar/CalendarContext';
import teams from '../data/teams';

const App = () => {
  const [screen, setScreen] = useState('home');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [savedData, setSavedData] = useState(null);

  const loadCareer = (slot) => {
    const saved = localStorage.getItem(`career_slot_${slot}`);
    if (!saved) return alert(`No data found in slot ${slot}`);
    const data = JSON.parse(saved);
    setSavedData(data);
    setSelectedTeam(data.team);
    setScreen('career');
    return data; // <- to return for handleLoadSlot if needed
  };

  const handleLoadSlot = (slot) => {
    const data = loadCareer(slot);
    if (data) {
      setSavedData(data);
      setScreen('career');
    } else {
      alert("No data in that slot.");
    }
  };

  return (
    <CalendarProvider>
      <div className="container mx-auto px-4 py-6">
        {screen === 'home' && (
          <HomeScreen
            onStart={() => setScreen('career')}
            onLoadSlot1={() => handleLoadSlot(1)}
            onLoadSlot2={() => handleLoadSlot(2)}
          />
        )}
        {screen === 'career' && (
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
      </div>
    </CalendarProvider>
  );
};

export default App;
