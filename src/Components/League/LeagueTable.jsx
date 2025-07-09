import React from 'react';

const LeagueTable = ({ teams }) => {
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

  return (
    <table className="w-full text-left border-collapse border border-gray-700 mt-4">
      <thead className="bg-gray-800">
        <tr>
          <th className="p-2 border border-gray-600">Team</th>
          <th className="p-2 border border-gray-600">Wins</th>
          <th className="p-2 border border-gray-600">Losses</th>
          <th className="p-2 border border-gray-600">Points</th>
        </tr>
      </thead>
      <tbody>
        {sortedTeams.map((team, idx) => (
          <tr key={idx} className="hover:bg-gray-800">
            <td className="p-2 border border-gray-700 flex items-center gap-2">
              <img
                src={`/logos/${team.logo}`}
                alt={team.name}
                className="h-6 w-6 object-contain"
              />
              {team.name}
            </td>
            <td className="p-2 border border-gray-700">{team.wins}</td>
            <td className="p-2 border border-gray-700">{team.losses}</td>
            <td className="p-2 border border-gray-700">{team.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeagueTable;
