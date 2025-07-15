// src/Components/Calendar/CalendarContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { seasonCalendar2026 } from './seasonCalendar2026';

const CalendarContext = createContext();
export const useCalendar = () => useContext(CalendarContext);

export const CalendarProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date('2026-04-27'));
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(seasonCalendar2026[0]);

  // Go to next day
  const nextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  // Go to next phase
  const nextPhase = () => {
    setPhaseIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex < seasonCalendar2026.length) {
        setCurrentDate(new Date(seasonCalendar2026[nextIndex].start));
        return nextIndex;
      }
      return prevIndex; // stay at last phase
    });
  };

  // Sync currentPhase whenever phaseIndex changes
  useEffect(() => {
    setCurrentPhase(seasonCalendar2026[phaseIndex]);
  }, [phaseIndex]);

  // Optionally update current phase based on date if needed
  useEffect(() => {
    const foundIndex = seasonCalendar2026.findIndex(p =>
      new Date(p.start) <= currentDate && currentDate <= new Date(p.end)
    );
    if (foundIndex !== -1 && foundIndex !== phaseIndex) {
      setPhaseIndex(foundIndex);
    }
  }, [currentDate]);

  return (
    <CalendarContext.Provider value={{
      currentDate,
      currentPhase,
      nextDay,
      nextPhase
    }}>
      {children}
    </CalendarContext.Provider>
  );
};
