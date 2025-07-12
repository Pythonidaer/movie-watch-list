"use client";

import { FaCheckCircle, FaRegCircle, FaTrashAlt } from "react-icons/fa";

export default function MovieItem({ movie, onToggleSeen, onDelete }) {
  return (
    <li className={`flex items-center justify-between p-3 rounded-md ${movie.seen ? 'bg-[#1a2532]' : 'bg-[#253545]'}`}>
      <div className="flex items-center">
        <button
          onClick={() => onToggleSeen(movie.id, movie.seen)}
          className="text-[#529ecc] hover:text-[#3d7ea6] mr-3 transition-colors focus:outline-none cursor-pointer"
          aria-label={movie.seen ? "Mark as unwatched" : "Mark as watched"}
        >
          {movie.seen ? <FaCheckCircle size={24} /> : <FaRegCircle size={24} />}
        </button>
        <div>
          <h3 className={`font-medium ${movie.seen ? 'line-through text-gray-400' : 'text-white'}`}>
            {movie.name}
          </h3>
          <p className={`text-sm ${movie.seen ? 'text-gray-500' : 'text-gray-300'}`}>
            {movie.genre}
          </p>
        </div>
      </div>
      
      {movie.seen && (
        <button
          onClick={() => onDelete(movie.id)}
          className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
          aria-label="Delete movie"
        >
          <FaTrashAlt size={20} />
        </button>
      )}
    </li>
  );
}
