import React, { useState } from 'react';
import HomeScreen from './Components/HomeScreen';
import CareerSetup from './Components/Career/CareerSetup';
import TeamPreview from './Components/TeamPreview';
import InboxView from './Components/Inbox/InboxView';
import CalendarView from './Components/Calendar/CalendarView';
import NavBar from './Components/NavBar';
import TransferWindow from './Components/Transfers/TransferWindow';
import MyTeam from './Components/MyTeam/MyTeam';
import MatchSimulator from './Components/Simulation/MatchSimulator';
import LeagueMenu from './Components/League/LeagueMenu';
import LeagueView from './Components/League/LeagueView';
import TournamentsHome from './Components/Tournaments/TournamentsHome';

import { CalendarProvider } from './Components/Calendar/CalendarContext';
import { GameProvider, useGame } from './Components/Game/GameContext';
import { TournamentProvider } from './Components/Tournaments/TournamentContext';
import { useCalendarEffects } from './Components/Calendar/useCalendarEffects';

import teams from '../data/teams';

const AppContent = () => {
  const [screen, setScreen] = useState('home');
  const [careerStarted, setCareerStarted] = useState(false);
  const [savedData, setSavedData] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [activeView, setActiveView] = useState('calendar');
  const [currentLeaguePhase, setCurrentLeaguePhase] = useState(null);

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
            setCareerStarted(false); // ⛳ reset for new creation
          }}
          onLoadSlot1={() => handleLoadSlot(1)}
          onLoadSlot2={() => handleLoadSlot(2)}
        />
      )}

      {screen === 'career' && (
        <>
          {/* NavBar only shown if a career has started */}
          {careerStarted && (
            <NavBar setScreen={setScreen} setActiveView={setActiveView} />
          )}

          {/* Career not started = show creation form */}
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
              {activeView === 'simulator' && <MatchSimulator opponentTeam={selectedTeam} />}
              {activeView === 'league' && (
                <LeagueMenu
                  setActiveView={setActiveView}
                  setCurrentLeaguePhase={setCurrentLeaguePhase}
                />
              )}
              {activeView === 'leagueView' && (
                <LeagueView leaguePhaseKey={currentLeaguePhase} />
              )}
              {activeView === 'tournaments' && <TournamentsHome />}
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
      <TournamentProvider>
        <AppContent />
      </TournamentProvider>
    </GameProvider>
  </CalendarProvider>
);

export default App;
