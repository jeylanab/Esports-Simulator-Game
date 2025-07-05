// src/Calendar/CalendarView.jsx
import React from 'react';
import { useCalendar } from './CalendarContext';

const formatDate = (date) =>
  date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

const CalendarView = () => {
  const { currentDate, currentPhase, nextDay, nextPhase } = useCalendar();

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">📅 Current Simulation Date</h2>
      <p className="text-lg mb-4">{formatDate(currentDate)}</p>

      {currentPhase ? (
        <>
          <h3 className="text-md font-semibold mb-1">{currentPhase.phase}</h3>
          <p className="text-sm text-gray-400 mb-4">{currentPhase.description}</p>
        </>
      ) : (
        <p className="text-sm text-gray-500 mb-4">No active phase.</p>
      )}

      <div className="flex gap-4 justify-center mt-4">
        <button
          onClick={nextDay}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          ⏭️ Next Day
        </button>
        <button
          onClick={nextPhase}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white"
        >
          📆 Next Phase
        </button>
      </div>
    </div>
  );
};

export default CalendarView;
