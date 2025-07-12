"use client";

export default function MovieItem({ movie, onToggleSeen, onDelete }) {
  return (
    <li className={`flex items-center justify-between p-3 rounded-md ${movie.seen ? 'bg-[#1a2532]' : 'bg-[#253545]'}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={movie.seen}
          onChange={() => onToggleSeen(movie.id, movie.seen)}
          className="h-5 w-5 rounded border-gray-500 text-[#529ecc] focus:ring-[#529ecc] mr-3"
        />
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
          className="text-gray-400 hover:text-red-400 transition-colors"
          aria-label="Delete movie"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </li>
  );
}
