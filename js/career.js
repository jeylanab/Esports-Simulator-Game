// Load teams from global "teams" object
function populateTeamDropdown() {
  const teamSelect = document.getElementById("real-team-select");
  for (const teamName in teams) {
    const option = document.createElement("option");
    option.value = teamName;
    option.textContent = teamName;
    teamSelect.appendChild(option);
  }
}

// Toggle career setup screen
function showCareerSetup() {
  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("career-setup").classList.remove("hidden");
  populateTeamDropdown();
}

// Save career to localStorage
function saveCareer(slot) {
  const coach = document.getElementById("coach-name").value;
  const realTeam = document.getElementById("real-team-select").value;
  const customTeam = document.getElementById("custom-team-name").value;

  const data = {
    coach,
    team: customTeam || realTeam,
    customLogo: null,
    timestamp: Date.now(),
  };

  const fileInput = document.getElementById("custom-logo");
  if (fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      data.customLogo = e.target.result;
      localStorage.setItem(`career_slot_${slot}`, JSON.stringify(data));
      alert(`Career saved to slot ${slot}`);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    localStorage.setItem(`career_slot_${slot}`, JSON.stringify(data));
    alert(`Career saved to slot ${slot}`);
  }
}

// Load saved career
function loadCareer(slot) {
  const saved = localStorage.getItem(`career_slot_${slot}`);
  if (!saved) return alert("No save data in this slot.");
  const career = JSON.parse(saved);
  console.log("Loaded Career:", career);
  alert(`Loaded ${career.coach}'s career with team ${career.team}`);
  // TODO: pass data to simulation engine
}

// Export career
function exportCareer() {
  const data = {
    slot1: localStorage.getItem("career_slot_1"),
    slot2: localStorage.getItem("career_slot_2"),
  };

  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "r6s_career_saves.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import career
function importCareer(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = JSON.parse(e.target.result);
    if (data.slot1) localStorage.setItem("career_slot_1", data.slot1);
    if (data.slot2) localStorage.setItem("career_slot_2", data.slot2);
    alert("Career data imported successfully.");
  };
  reader.readAsText(file);
}
