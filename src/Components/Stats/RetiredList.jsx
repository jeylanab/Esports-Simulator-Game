import React from 'react';

export default function RetiredList({ retiredPlayers }) {
  if (!retiredPlayers?.length) return null;

  return (
    <section>
      <h3 className="text-xl font-semibold mb-2">👴 Retired Players</h3>
      <ul className="list-disc pl-5 space-y-1 text-gray-300">
        {retiredPlayers.map((p, i) => (
          <li key={i}>
            {p.name} (Age {p.age})
          </li>
        ))}
      </ul>
    </section>
  );
}
