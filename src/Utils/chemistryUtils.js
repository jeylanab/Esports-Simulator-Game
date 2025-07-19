// src/Utils/chemistryUtils.js

const teamChemistry = {};

export function setTeamChemistryStore(store) {
  Object.assign(teamChemistry, store);
}

export function getTeamChemistry(teamName) {
  if (!teamChemistry[teamName]) {
    teamChemistry[teamName] = 0.5; // Start at 50%
  }
  return teamChemistry[teamName];
}

export function increaseTeamChemistry(teamNames = []) {
  teamNames.forEach((team) => {
    const current = teamChemistry[team] || 0.5;
    teamChemistry[team] = Math.min(1.0, current + 0.03); // +3% per match
  });
}

export function getFullChemistryMap() {
  return teamChemistry;
}
