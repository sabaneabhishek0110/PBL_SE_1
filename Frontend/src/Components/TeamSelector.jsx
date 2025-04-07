import React from 'react';

const TeamSelector = ({ className, teams, team, setTeam, onDone }) => {
  return (
    <div className={className}>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm text-white">
        <h2 className="text-xl font-semibold mb-4">Select a Team</h2>

        <select
          value={team?._id || ''}
          onChange={(e) => {
            const selectedTeam = teams.find(t => t._id === e.target.value);
            setTeam(selectedTeam);
            console.log(selectedTeam)
          }}
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Select a team</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id} className="text-black">
              {t.name}
            </option>
          ))}
        </select>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onDone}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamSelector;
