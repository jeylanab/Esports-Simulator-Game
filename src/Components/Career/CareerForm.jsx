import React, { useState, useEffect } from 'react';
import { saveCareer, exportCareers, importCareers } from '../../Utils/storage';
import {
  FaChalkboardTeacher, FaDownload, FaUpload, FaArrowLeft, FaUserAlt, FaTools,
} from 'react-icons/fa';
import { HiOutlineTrash, HiOutlineSave } from 'react-icons/hi';
import freeAgents from '../../../data/freeAgents.json';

const CareerForm = ({ teams, onPreview, teamPreview, onBack, savedData, onCareerCreated }) => {
  const [coach, setCoach] = useState('');
  const [realTeam, setRealTeam] = useState('');
  const [customTeam, setCustomTeam] = useState('');
  const [customLogo, setCustomLogo] = useState(null);
  const [customPlayers, setCustomPlayers] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);

  const [slots, setSlots] = useState({
    slot1: !!localStorage.getItem('career_slot_1'),
    slot2: !!localStorage.getItem('career_slot_2'),
  });

  useEffect(() => {
    if (savedData) {
      setCoach(savedData.coach || '');
      const teamName = savedData.team || '';
      const isReal = teams[teamName];
      setRealTeam(isReal ? teamName : '');
      setCustomTeam(!isReal ? teamName : '');
      setCustomLogo(savedData.customLogo || null);
      setCustomPlayers(savedData.customPlayers || []);
    }
  }, [savedData]);

  const getSelectedTeamName = () => (customTeam || realTeam);

  const handleSave = (slot) => {
    const selectedTeam = getSelectedTeamName();
    if (!coach || !selectedTeam) {
      alert('Coach name and a team are required.');
      return;
    }

    if (customTeam && customPlayers.length !== 5) {
      alert('Please select exactly 5 players for your custom team.');
      return;
    }

    const key = `career_slot_${slot}`;
    if (localStorage.getItem(key) && !confirm(`Overwrite Slot ${slot}?`)) return;

    const dataToSave = {
      coach,
      team: selectedTeam,
      customLogo,
      timestamp: Date.now(),
      ...(customTeam && { customPlayers }),
    };

    saveCareer(slot, dataToSave);
    alert(`Career saved to Slot ${slot}`);
    setSlots((prev) => ({ ...prev, [`slot${slot}`]: true }));
    onCareerCreated?.(selectedTeam);
  };

  const handleImport = (e) => {
    try {
      importCareers(e);
      alert('Import complete.');
      setSlots({
        slot1: !!localStorage.getItem('career_slot_1'),
        slot2: !!localStorage.getItem('career_slot_2'),
      });
    } catch {
      alert('Import failed.');
    }
  };

  const handleDelete = (slot) => {
    if (!confirm(`Delete Slot ${slot}?`)) return;
    localStorage.removeItem(`career_slot_${slot}`);
    setCoach('');
    setRealTeam('');
    setCustomTeam('');
    setCustomLogo(null);
    setCustomPlayers([]);
    onPreview('');
    setSlots((prev) => ({ ...prev, [`slot${slot}`]: false }));
  };

  return (
    <div className="text-white border border-gray-700 p-6 sm:p-8 rounded-xl max-w-4xl mx-auto space-y-8 bg-gray-900">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
        <FaArrowLeft /> Back
      </button>

      {/* Title */}
      <div className="flex items-center gap-3 justify-center mb-6">
        <FaChalkboardTeacher className="text-3xl text-cyan-400" />
        <h2 className="text-2xl font-bold">Career Setup</h2>
      </div>

      {/* Coach */}
      <div>
        <label className="block font-semibold mb-1">Coach Name</label>
        <input
          type="text"
          value={coach}
          onChange={(e) => setCoach(e.target.value)}
          className="w-full p-3 rounded border border-gray-600 bg-transparent"
        />
      </div>

      {/* Team Preview */}
      <div className="border border-gray-700 p-4 rounded">
        <h4 className="text-sm text-gray-300 mb-2">Team Preview</h4>
        {teamPreview || <p className="text-gray-500">No team selected</p>}
      </div>

      {/* Team Picker or Custom */}
      {!showCustomBuilder ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">Pick a Real Team</label>
            <select
              value={realTeam}
              onChange={(e) => {
                const val = e.target.value;
                setRealTeam(val);
                setCustomTeam('');
                setCustomPlayers([]);
                setCustomLogo(null);
                onPreview(val);
              }}
              className="w-full p-3 rounded border border-gray-600 bg-transparent"
            >
              <option value="">Select team</option>
              {Object.keys(teams).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Or Build a Custom Team</label>
            <button
              onClick={() => {
                setShowCustomBuilder(true);
                setRealTeam('');
                onPreview('');
              }}
              className="w-full p-3 rounded border border-gray-600 bg-gray-800 hover:bg-gray-700"
            >
              Create Custom Team
            </button>
            {customTeam && (
              <p className="mt-2 text-sm text-gray-300">
                <strong>Selected:</strong> {customTeam} ({customPlayers.length}/5)
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="border border-gray-700 p-4 rounded bg-gray-800 space-y-4">
          <h3 className="font-bold text-xl">Custom Team Builder</h3>

          <input
            type="text"
            placeholder="Team Name"
            value={customTeam}
            onChange={(e) => setCustomTeam(e.target.value)}
            className="w-full p-3 rounded border border-gray-600 bg-transparent"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const reader = new FileReader();
              reader.onload = (ev) => setCustomLogo(ev.target.result);
              reader.readAsDataURL(e.target.files[0]);
            }}
          />
          {customLogo && (
            <img src={customLogo} alt="Logo" className="mt-2 h-10 w-10 rounded object-cover" />
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[300px] overflow-y-scroll">
            {freeAgents.map((p, i) => {
              const selected = customPlayers.some(cp => cp.Player === p.Player);
              return (
                <div
                  key={i}
                  className={`p-3 border rounded cursor-pointer text-sm hover:bg-gray-700 ${selected ? 'border-cyan-500 bg-gray-700' : 'border-gray-600'}`}
                  onClick={() => {
                    setCustomPlayers(prev =>
                      selected
                        ? prev.filter(cp => cp.Player !== p.Player)
                        : prev.length < 5 ? [...prev, p] : (alert('Max 5 players'), prev)
                    );
                  }}
                >
                  <strong>{p.Player}</strong>
                  <div className="text-xs text-gray-400">Role: {p.Role}, Aim: {p.Aim}, IQ: {p.GameSense}</div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => {
                setShowCustomBuilder(false);
                setCustomTeam('');
                setCustomPlayers([]);
              }}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!customTeam || customPlayers.length !== 5) {
                  alert('Team name and 5 players required.');
                  return;
                }
                setShowCustomBuilder(false);
                onPreview('custom');
              }}
              className="px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700"
            >
              Confirm Team
            </button>
          </div>
        </div>
      )}

      {/* Save Buttons */}
      <div className="flex justify-center gap-4 flex-wrap">
        {[1, 2].map((slot) => (
          <button
            key={slot}
            onClick={() => handleSave(slot)}
            className="flex items-center gap-2 bg-cyan-600 px-6 py-2 rounded hover:bg-cyan-700"
          >
            <HiOutlineSave /> Save to Slot {slot}
          </button>
        ))}
      </div>

      {/* Advanced Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-cyan-400 hover:underline text-sm flex items-center gap-2 mx-auto"
        >
          <FaTools /> {showAdvanced ? 'Hide' : 'Manage Saves & Slots'}
        </button>
      </div>

      {/* Advanced Section */}
      {showAdvanced && (
        <div className="space-y-6 border-t border-gray-700 pt-6">
          <div className="text-center">
            <h4 className="font-semibold text-gray-300 mb-2">Import / Export</h4>
            <div className="flex justify-center gap-4">
              <button onClick={exportCareers} className="flex items-center gap-2 bg-cyan-500 px-5 py-2 rounded hover:bg-cyan-600">
                <FaDownload /> Export
              </button>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                <FaUpload />
                <input type="file" onChange={handleImport} className="hidden" />
                Import
              </label>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            {Object.entries(slots).map(([key, exists]) => (
              exists && (
                <button
                  key={key}
                  onClick={() => handleDelete(key.slice(-1))}
                  className="flex items-center gap-2 bg-red-600 px-5 py-2 rounded hover:bg-red-700"
                >
                  <HiOutlineTrash /> Clear {key}
                </button>
              )
            ))}
          </div>
        </div>
      )}

      {/* Player List */}
      <div className="mt-10 border-t pt-6 border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Player Details</h3>
        {(customPlayers.length || realTeam) ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(customPlayers.length ? customPlayers : teams[realTeam]?.players || []).map((player, idx) => (
              <div key={idx} className="p-3 border border-gray-700 rounded text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <FaUserAlt />
                  <strong>{player.name || player.Player}</strong>
                </div>
                <p className="text-gray-400">Aim: {player.aim || player.Aim}, IQ: {player.iq || player.GameSense}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No players yet.</p>
        )}
      </div>
    </div>
  );
};

export default CareerForm;
