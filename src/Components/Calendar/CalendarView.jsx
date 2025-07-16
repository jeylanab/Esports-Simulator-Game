import React from 'react';
import { useCalendar } from './CalendarContext';
import { format } from 'date-fns';
import {
  FaCalendarAlt,
  FaMapMarkedAlt,
  FaChevronRight,
  FaArrowAltCircleUp,
} from 'react-icons/fa';

const CalendarView = () => {
  const { currentDate, currentPhase, nextDay, nextPhase } = useCalendar();

  const formatCalendarDate = (date) => {
    const d = new Date(date);
    const formatted = format(d, 'dd/MM/yyyy');
    const year = d.getFullYear();
    const season = year - 2025;
    return `${formatted} (Season ${season})`;
  };

  return (
    <div className="bg-[#101015] text-white px-4 py-6 sm:p-6 rounded-2xl shadow-md w-full max-w-3xl mx-auto mt-6 border border-[#2c2c39]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaCalendarAlt className="text-cyan-400 text-2xl sm:text-3xl" />
        <h2 className="text-xl sm:text-2xl font-semibold tracking-wide">
          Simulation Calendar
        </h2>
      </div>

      {/* Date + Phase */}
      <div className="space-y-4 sm:space-y-3 mb-8">
        <div className="flex items-start sm:items-center gap-3 flex-wrap sm:flex-nowrap">
          <FaCalendarAlt className="text-gray-400 mt-1 sm:mt-0" />
          <p className="text-base sm:text-lg leading-snug">
            <span className="text-gray-300">Current Date: </span>
            <span className="text-cyan-400 font-medium">{formatCalendarDate(currentDate)}</span>
          </p>
        </div>

        <div className="flex items-start sm:items-center gap-3 flex-wrap sm:flex-nowrap">
          <FaMapMarkedAlt className="text-yellow-400 mt-1 sm:mt-0" />
          <p className="text-base sm:text-md leading-snug">
            <span className="text-gray-300">Phase: </span>
            <span className="font-semibold text-yellow-400">{currentPhase?.name}</span>
          </p>
        </div>

        <p className="text-sm text-gray-400 pl-7">{currentPhase?.description}</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4 sm:mt-6">
        <button
          onClick={nextDay}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-5 py-2.5 rounded-lg text-white font-semibold transition"
        >
          <FaChevronRight />
          Next Day
        </button>
        <button
          onClick={nextPhase}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 px-5 py-2.5 rounded-lg text-black font-semibold transition"
        >
          <FaArrowAltCircleUp />
          Skip Phase
        </button>
      </div>
    </div>
  );
};

export default CalendarView;
