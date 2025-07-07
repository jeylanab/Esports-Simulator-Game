import React, { useEffect, useState } from 'react';
import { saveCareer, exportCareers, importCareers } from '../../Utils/storage';

const CareerForm = ({ teams, onPreview, teamPreview, onBack, savedData, onCareerCreated }) => {
  const [coach, setCoach] = useState('');
  const [realTeam, setRealTeam] = useState('');
  const [customTeam, setCustomTeam] = useState('');
  const [customLogo, setCustomLogo] = useState(null);
  const [slots, setSlots] = useState({
    slot1: !!localStorage.getItem('career_slot_1'),
    slot2: !!localStorage.getItem('career_slot_2'),
  });

  useEffect(() => {
    if (savedData) {
      setCoach(savedData.coach || '');
      setCustomTeam(savedData.team || '');
      setRealTeam(teams[savedData.team] ? savedData.team : '');
      setCustomLogo(savedData.customLogo || null);
    }
  }, [savedData]);

  const handleSave = (slot) => {
    if (!coach || (!realTeam && !customTeam)) {
      alert('Coach name and a team (real/custom) are required.');
      return;
    }
    const existing = localStorage.getItem(`career_slot_${slot}`);
    if (existing && !confirm(`Slot ${slot} exists. Overwrite?`)) return;

    saveCareer(slot, {
      coach,
      team: customTeam || realTeam,
      customLogo,
      timestamp: Date.now(),
    });

    alert(`Career saved to Slot ${slot}`);
    setSlots({ ...slots, [`slot${slot}`]: true });

    //Trigger calendar view
    onCareerCreated?.();
  };

  const handleDelete = (slot) => {
    if (confirm(`Delete Slot ${slot}?`)) {
      localStorage.removeItem(`career_slot_${slot}`);
      setCoach('');
      setRealTeam('');
      setCustomTeam('');
      setCustomLogo(null);
      onPreview('');
      setSlots({ ...slots, [`slot${slot}`]: false });
      alert(`Slot ${slot} cleared.`);
    }
  };

  const handleImport = (e) => {
    importCareers(e);
    alert('Import complete. Go Home and Load a slot.');
    setSlots({
      slot1: !!localStorage.getItem('career_slot_1'),
      slot2: !!localStorage.getItem('career_slot_2'),
    });
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl max-w-4xl mx-auto shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Career Setup</h2>

      <input
        type="text"
        placeholder=" Coach Name"
        value={coach}
        onChange={(e) => setCoach(e.target.value)}
        className="w-full p-2 mb-6 rounded bg-gray-800 border border-gray-700"
      />

      <div className="grid md:grid-cols-2  gap-6">
        {/* Real Team Section */}
        <div>
          <h3 className="text-lg font-semibold text-start mb-1">Choose Real Team</h3>
          <p className="text-sm text-gray-400 mb-2">Pick an existing professional team from the list.</p>
          <select
            value={realTeam}
            onChange={(e) => {
              setRealTeam(e.target.value);
              onPreview(e.target.value);
            }}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 mb-4"
          >
            <option disabled value="">Select a team</option>
            {Object.keys(teams).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        {/* Player Preview */}
        <div className="bg-gray-800 border border-gray-700 rounded p-4 min-h-[150px]">
          <h4 className="text-sm text-gray-300 mb-2">Team Preview</h4>
          {teamPreview}
        </div>
      </div>

      {/* Custom Team Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-start mb-1"> Create Custom Team</h3>
        <p className="text-sm text-gray-400 mb-2">Add your own team name and logo instead.</p>
        <input
          type="text"
          placeholder="Custom Team Name"
          value={customTeam}
          onChange={(e) => setCustomTeam(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-800 border border-gray-700"
        />
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => setCustomLogo(ev.target.result);
            reader.readAsDataURL(file);
          }}
          className="w-full mb-6 text-sm text-gray-300 file:bg-cyan-600 file:border-none file:px-4 file:py-2 file:rounded file:text-white"
        />
      </div>

      {/* Save Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button className="bg-cyan-600 px-5 py-2 rounded" onClick={() => handleSave(1)}>
           Save Slot 1
        </button>
        <button className="bg-cyan-600 px-5 py-2 rounded" onClick={() => handleSave(2)}>
          Save Slot 2
        </button>
      </div>

      {/* Export & Import */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
        <button className="bg-cyan-500 px-5 py-2 rounded" onClick={exportCareers}>
          Export
        </button>
        <input
          type="file"
          onChange={handleImport}
          className="text-sm text-gray-300"
        />
      </div>

      {/* Clear Buttons */}
      <div className="flex justify-center gap-4 mt-2">
        {slots.slot1 && (
          <button className="bg-red-600 px-5 py-2 rounded" onClick={() => handleDelete(1)}>
             Clear Slot 1
          </button>
        )}
        {slots.slot2 && (
          <button className="bg-red-600 px-5 py-2 rounded" onClick={() => handleDelete(2)}>
             Clear Slot 2
          </button>
        )}
      </div>

      <button
        onClick={onBack}
        className="mt-8 bg-gray-700 px-6 py-2 rounded text-white block mx-auto"
      >
        🔙 Back
      </button>
    </div>
  );
};

export default CareerForm;
