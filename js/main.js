function renderTeams(teams) {
  const container = document.querySelector('.team-grid');
  container.innerHTML = '';

  Object.entries(teams).forEach(([teamName, data]) => {
    const teamCard = document.createElement('div');
    teamCard.classList.add('team-card');

    // Create logo element
    const logo = document.createElement('img');
    logo.src = data.logo || 'assets/logos/default_logo.png';
    logo.alt = `${teamName} logo`;
    logo.className = 'team-logo';

    const teamTitle = document.createElement('h2');
    teamTitle.textContent = teamName;

    const playerList = document.createElement('ul');
    playerList.classList.add('player-list');
    data.players.forEach(player => {
      const li = document.createElement('li');
      li.textContent = `${player.name} (Rating: ${player.rating})`;
      playerList.appendChild(li);
    });

    // Append all elements
    teamCard.appendChild(logo);
    teamCard.appendChild(teamTitle);
    teamCard.appendChild(playerList);
    container.appendChild(teamCard);
  });
}
