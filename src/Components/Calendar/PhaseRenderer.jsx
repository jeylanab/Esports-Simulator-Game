import React from 'react';

// Placeholder components for each phase
import TransferWindow from '../Transfers/TransferWindow';
import SixInvitationalBracket from '../Tournaments/SixInvitationalBracket';
import LeagueSchedule from '../League/LeagueSchedule';
import LcqElimination from '../Tournaments/LcqElimination';
import TravelWeek from '../Media/TravelWeek';
import MajorStage from '../Tournaments/MajorStage';
import MidseasonBreak from '../Transfers/MidseasonBreak';
import Bootcamp from '../Training/Bootcamp';
import SiegeXWorldCup from '../Tournaments/SiegeXWorldCup';
import MediaTravelPrep from '../Media/MediaTravelPrep';
import PostMajorCooldown from '../Misc/PostMajorCooldown';
import SiLastChance from '../Tournaments/SiLastChance';
import EndSeasonAwards from '../Awards/EndSeasonAwards';

const PhaseRenderer = ({ phase }) => {
  if (!phase) return <p className="text-center text-gray-400">No active phase.</p>;

  switch (phase.key) {
    case 'offseason_contracts':
      return <TransferWindow />;

    case 'si_2025':
      return <SixInvitationalBracket />;

    case 'mini_offseason':
      return <TransferWindow phase="mini" />;

    case 'stage1_leagues':
    case 'stage2_leagues':
      return <LeagueSchedule />;

    case 'stage1_lcq':
      return <LcqElimination />;

    case 'travel_week_1':
      return <TravelWeek />;

    case 'stage1_major':
    case 'stage2_major':
      return <MajorStage />;

    case 'midseason_off':
      return <MidseasonBreak />;

    case 'short_offseason':
      return <Bootcamp />;

    case 'siege_x':
      return <SiegeXWorldCup />;

    case 'media_travel':
      return <MediaTravelPrep />;

    case 'post_major':
      return <PostMajorCooldown />;

    case 'si_lcq':
      return <SiLastChance />;

    case 'end_season':
      return <EndSeasonAwards />;

    default:
      return (
        <div className="bg-gray-800 text-gray-300 p-4 rounded mt-4">
          <p>🧩 No UI built for: <strong>{phase.phase}</strong> ({phase.key})</p>
          <p>Implement a component for this phase soon.</p>
        </div>
      );
  }
};

export default PhaseRenderer;
