import React, { useState } from 'react';

// Screens & Views
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
import EconomyView from './Components/Economy/EconomyView';
import StatView from './Components/Stats/StatView'; // ✅ NEW: Full stat dashboard view

// Providers & Hooks
import { CalendarProvider } from './Components/Calendar/CalendarContext';
import { GameProvider, useGame } from './Components/Game/GameContext';
import { TournamentProvider } from './Components/Tournaments/TournamentContext';
import { useCalendarEffects } from './Components/Calendar/useCalendarEffects';
import { StatProvider, useStats } from './Components/Game/StatContext';

// Data
import teams from '../data/teams';

const AppContent = () => {
  const [screen, setScreen] = useState('home');
  const [careerStarted, setCareerStarted] = useState(false);
  const [savedData, setSavedData] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [activeView, setActiveView] = useState('calendar');
  const [currentLeaguePhase, setCurrentLeaguePhase] = useState(null);

  const { setUserTeam } = useGame();
  const { initializePlayers } = useStats();

  useCalendarEffects();

  // Load saved game
  const loadCareer = (slot) => {
    const saved = localStorage.getItem(`career_slot_${slot}`);
    if (!saved) {
      alert(`No data found in slot ${slot}`);
      return null;
    }

    const data = JSON.parse(saved);
    const teamName = data.team;
    const loadedPlayers = teams[teamName]?.players || [];

    setSavedData(data);
    setSelectedTeam(teamName);
    setUserTeam(loadedPlayers);
    initializePlayers(loadedPlayers);

    setCareerStarted(true);
    setActiveView('calendar');
    setScreen('career');

    return data;
  };

  // Handle new career creation
  const handleCareerCreated = (teamName) => {
    const initialPlayers = teams[teamName]?.players || [];
    setUserTeam(initialPlayers);
    initializePlayers(initialPlayers);

    setCareerStarted(true);
    setSelectedTeam(teamName);
    setActiveView('calendar');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {screen === 'home' ? (
        <HomeScreen
          onStart={() => {
            setScreen('career');
            setCareerStarted(false);
          }}
          onLoadSlot1={() => loadCareer(1)}
          onLoadSlot2={() => loadCareer(2)}
        />
      ) : (
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
              onCareerCreated={handleCareerCreated}
            />
          ) : (
            <>
              {activeView === 'calendar' && <CalendarView />}
              {activeView === 'inbox' && <InboxView />}
              {activeView === 'transfers' && <TransferWindow />}
              {activeView === 'team' && <MyTeam teamName={selectedTeam} />}
              {activeView === 'simulator' && (
                <MatchSimulator opponentTeam={selectedTeam} />
              )}
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
              {activeView === 'economy' && <EconomyView />}
              {activeView === 'stats' && <StatView />} {/* ✅ NEW: StatView */}
            </>
          )}
        </>
      )}
    </div>
  );
};

const App = () => (
  <StatProvider>
    <CalendarProvider>
      <GameProvider>
        <TournamentProvider>
          <AppContent />
        </TournamentProvider>
      </GameProvider>
    </CalendarProvider>
  </StatProvider>
);

export default App;
