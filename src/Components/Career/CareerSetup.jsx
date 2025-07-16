import React from 'react';
import CareerForm from './CareerForm';

const CareerSetup = ({ teams, onPreview, onBack, teamPreview, savedData, onCareerCreated }) => {
  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <CareerForm
        teams={teams}
        onPreview={onPreview}
        teamPreview={teamPreview}
        onBack={onBack}
        savedData={savedData}
        onCareerCreated={onCareerCreated} // 
      />
    </div>
  );
};

export default CareerSetup;
