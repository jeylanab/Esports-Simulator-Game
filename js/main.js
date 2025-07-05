// assets/js/main.js

// Initial date of the simulation
let currentDate = new Date("2026-01-01");

// Get DOM elements
const dateDisplay = document.getElementById("date-display");
const phaseDisplay = document.getElementById("phase-display");
const phaseDetails = document.getElementById("phase-details");
const advanceBtn = document.getElementById("advance-day");

// Format the date into DD/MM/YYYY
function formatDate(date) {
  return date.toLocaleDateString("en-GB"); // "dd/mm/yyyy"
}

// Find the active phase from calendarPhases array
function getCurrentPhase(date) {
  const today = formatDate(date);

  for (const phase of calendarPhases) {
    const start = new Date(phase.start.split("/").reverse().join("-"));
    const end = new Date(phase.end.split("/").reverse().join("-"));

    if (date >= start && date <= end) {
      return phase;
    }
  }

  return { phase: "Off-season", details: "No active events" };
}

// Render the current date and phase
function renderState() {
  dateDisplay.textContent = formatDate(currentDate);

  const phase = getCurrentPhase(currentDate);
  phaseDisplay.textContent = phase.phase;
  phaseDetails.textContent = phase.details;
}

// Advance the in-game date by 1 day
advanceBtn.addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() + 1);
  renderState();
});

// On first load
renderState();
