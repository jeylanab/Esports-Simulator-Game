// === src/Utils/storage.js ===
export const saveCareer = (slot, data) => {
  localStorage.setItem(`career_slot_${slot}`, JSON.stringify(data));
};

export const loadCareer = (slot) => {
  const saved = localStorage.getItem(`career_slot_${slot}`);
  return saved ? JSON.parse(saved) : null;
};

export const exportCareers = () => {
  const data = {
    slot1: localStorage.getItem("career_slot_1"),
    slot2: localStorage.getItem("career_slot_2"),
  };
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "r6s_career_saves.json";
  a.click();
};

export const importCareers = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function (ev) {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.slot1) localStorage.setItem("career_slot_1", data.slot1);
      if (data.slot2) localStorage.setItem("career_slot_2", data.slot2);
      alert("Import successful!");
    } catch (err) {
      alert("Invalid file format");
    }
  };
  reader.readAsText(file);
};
