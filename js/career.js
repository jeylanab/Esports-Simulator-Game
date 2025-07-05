// Called when entering New Career Setup
function showCareerSetup() {
  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("career-setup").classList.remove("hidden");
  populateTeamDropdown();
}

function populateTeamDropdown() {
  const teamSelect = document.getElementById("real-team-select");
  teamSelect.innerHTML = ""; // clear old
  for (const teamName in teams) {
    const option = document.createElement("option");
    option.value = teamName;
    option.textContent = teamName;
    teamSelect.appendChild(option);
  }
}

// ... and so on, all the functions
