import React from 'react';

export default function AwardSection({ awards }) {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-2">🏆 Season Awards</h3>
      {awards?.length > 0 ? (
        <ul className="space-y-1">
          {awards.map((a, i) => (
            <li key={i}>
              <span className="font-semibold">{a.type}:</span> {a.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No awards yet.</p>
      )}
    </section>
  );
}
