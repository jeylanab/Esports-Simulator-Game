// src/Components/Calendar/CalendarView.jsx
import React from 'react';
import { useGame } from '../Game/GameContext';
import { formatDate } from '../../Utils/dateUtils';

const CalendarView = () => {
  const { currentDate, advanceDay } = useGame();

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">📅 Current Simulation Date</h2>
      <p className="text-lg mb-4">{formatDate(currentDate)}</p>

      <div className="flex gap-4 justify-center mt-4">
        <button
          onClick={advanceDay}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          ⏭️ Next Day
        </button>
      </div>
    </div>
  );
};

export default CalendarView;
