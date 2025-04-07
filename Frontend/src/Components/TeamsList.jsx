import React from "react";
import { motion } from "framer-motion";

export default function TeamsList({ teams }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.length > 0 ? (
        teams.map((team) => (
          <motion.div
            key={team.id}
            className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h2 className="text-xl font-semibold">{team.name}</h2>
            <p className="text-gray-500">Members: {team.members}</p>
            <p className="text-sm text-gray-400">Created: {team.createdAt}</p>
          </motion.div>
        ))
      ) : (
        <p className="text-gray-500 text-center col-span-full">
          No teams found
        </p>
      )}
    </div>
  );
}
