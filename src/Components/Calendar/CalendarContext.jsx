// src/Calendar/CalendarContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { seasonCalendar2026 } from './seasonCalendar2026';

const CalendarContext = createContext();
export const useCalendar = () => useContext(CalendarContext);

export const CalendarProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date('2026-01-01'));
  const [currentPhase, setCurrentPhase] = useState(null);

  const nextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const nextPhase = () => {
    const next = seasonCalendar2026.find(
      p => new Date(p.start) > currentDate
    );
    if (next) setCurrentDate(new Date(next.start));
  };

  useEffect(() => {
    const phase = seasonCalendar2026.find(p =>
      new Date(p.start) <= currentDate && currentDate <= new Date(p.end)
    );
    setCurrentPhase(phase || null);
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
