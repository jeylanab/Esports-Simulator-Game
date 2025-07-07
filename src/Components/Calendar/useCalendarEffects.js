// src/Components/Calendar/useCalendarEffects.js
import { useEffect } from 'react';
import { useCalendar } from './CalendarContext';
import { useGame } from '../Game/GameContext'; // ✅ Get inbox context

export const useCalendarEffects = () => {
  const { currentPhase, currentDate } = useCalendar();
  const { setInbox, inbox } = useGame(); // ✅ From GameContext

  useEffect(() => {
    if (!currentPhase) return;

    console.log(`[🌍 CALENDAR] Entered Phase: ${currentPhase.phase} (${currentPhase.key})`);
    console.log(`[🗓️ DATE] ${currentDate.toISOString().slice(0, 10)}`);

    switch (currentPhase.key) {
      case 'offseason_contracts':
        console.log('📢 Off-season: Handle contract expirations and transfer rumors.');

        const alreadySent = inbox.some(msg => msg.key === 'transfer_window_notice');
        if (!alreadySent) {
          setInbox(prev => [
            ...prev,
            {
              key: 'transfer_window_notice',
              title: 'Transfer Window Opens',
              body:
                'Teams may now sign free agents and negotiate new contracts. Rumours are already flying!',
              date: currentDate.toLocaleDateString('en-GB'),
            }
          ]);
        }
        break;

      case 'si_2025':
        console.log('🏆 SI 2025 Tournament: Load 20 pre-seeded teams, simulate matches.');
        // future: load pre-seeded bracket and show simulate option
        break;

      case 'mini_offseason':
        console.log('📝 Final transfer window before Stage 1.');
        break;

      case 'stage1_leagues':
        console.log('⚔️ Stage 1 Leagues: Start round-robin regional matches.');
        break;

      case 'stage1_lcq':
        console.log('🎯 Stage 1 LCQ: Double elimination to qualify for Major.');
        break;

      case 'travel_week_1':
        console.log('🧳 Travel + Media Week: Scrims, content production.');
        break;

      case 'stage1_major':
        console.log('🥇 Stage 1 Major: Swiss rounds → playoffs.');
        break;

      case 'midseason_off':
        console.log('🌴 Mid-season break: Minor transfers + sponsor tasks.');
        break;

      case 'stage2_leagues':
        console.log('🔥 Stage 2 begins: New league matches.');
        break;

      case 'short_offseason':
        console.log('🧠 Bootcamp phase: Team training before Siege X.');
        break;

      case 'siege_x':
        console.log('🌍 Siege X World Cup: $2M prize, single-elim tournament.');
        break;

      case 'media_travel':
        console.log('📸 Media + travel before Stage 2 Major.');
        break;

      case 'stage2_major':
        console.log('🏆 Stage 2 Major starts.');
        break;

      case 'post_major':
        console.log('🧮 Finalize SI-points table.');
        break;

      case 'si_lcq':
        console.log('🎟️ Last-Chance Qualifiers for Six Invitational.');
        break;

      case 'end_season':
        console.log('🎉 End-of-season: Awards, retirements, rookie generation.');
        break;

      default:
        console.log('✅ No special logic defined for this phase yet.');
        break;
    }
  }, [currentPhase, currentDate]);
};
