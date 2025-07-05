// CareerSetup.jsx
import React, { useState } from 'react';
import CareerForm from './CareerForm';
import CalendarView from '../Calendar/CalendarView'; // 👈 Import your calendar component

const CareerSetup = ({ teams, onPreview, onBack, teamPreview, savedData }) => {
  const [careerCreated, setCareerCreated] = useState(!!savedData); // true if data loaded

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {!careerCreated ? (
        <CareerForm
          teams={teams}
          onPreview={onPreview}
          teamPreview={teamPreview}
          onBack={onBack}
          savedData={savedData}
          onCareerCreated={() => setCareerCreated(true)} // ✅ Pass callback to CareerForm
        />
      ) : (
        <CalendarView /> // ✅ Show Calendar after career is created
      )}
    </div>
  );
};

export default CareerSetup;
