import React from 'react';

export default function GoatLeaderboard({ goatPoints }) {
  const goatBoard = Object.entries(goatPoints || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <section>
      <h3 className="text-xl font-semibold mb-2">🐐 GOAT Leaderboard</h3>
      {goatBoard.length > 0 ? (
        <ol className="list-decimal pl-5 space-y-1">
          {goatBoard.map(([name, pts], i) => (
            <li key={i}>
              <span className="font-medium">{name}</span> – {pts} pts
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-gray-400">No GOAT points recorded yet.</p>
      )}
    </section>
  );
}
