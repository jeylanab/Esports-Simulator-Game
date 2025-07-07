import { useGame } from '../Game/GameContext';

const InboxView = () => {
  const { inbox } = useGame();

  return (
    <div className="bg-gray-800 text-white p-4 mt-6 rounded-lg max-w-xl mx-auto">
      <h2 className="text-lg font-bold mb-3">📩 Inbox</h2>

      {inbox.length === 0 && (
        <p className="text-sm text-gray-400">No messages yet.</p>
      )}

      {inbox.map((msg, i) => (
        <div key={i} className="mb-4 border-b border-gray-700 pb-2">
          <p className="font-semibold">{msg.title}</p>
          <p className="text-sm text-gray-300">{msg.body}</p>
          <p className="text-xs text-gray-500">{msg.date}</p>
        </div>
      ))}
    </div>
  );
};

export default InboxView;
