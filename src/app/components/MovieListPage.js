"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import MovieItem from "./MovieItem";
import { FaSort, FaSortAlphaDown, FaSortAlphaUp, FaLayerGroup, FaRandom } from "react-icons/fa";

export default function MovieListPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMovie, setNewMovie] = useState({ name: "", genre: "" });
  const [sortOrder, setSortOrder] = useState("asc");
  const [groupByGenre, setGroupByGenre] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingMovie, setAddingMovie] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isShuffled, setIsShuffled] = useState(false);

  // Fetch movies on component mount
  useEffect(() => {
    fetchMovies();
  }, []);

  // Fetch movies from API
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/movies");
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      setMovies(data);
      setError("");
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add a new movie
  const handleAddMovie = async (e) => {
    e.preventDefault();
    
    if (!newMovie.name || !newMovie.genre) {
      setError("Movie title and genre are required");
      return;
    }

    try {
      setAddingMovie(true);
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMovie),
      });

      if (!response.ok) {
        throw new Error("Failed to add movie");
      }

      const addedMovie = await response.json();
      setMovies([...movies, addedMovie]);
      setNewMovie({ name: "", genre: "" });
      setShowAddModal(false);
      setSuccessMessage("Movie added successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error adding movie:", error);
      setError("Failed to add movie. Please try again.");
    } finally {
      setAddingMovie(false);
    }
  };

  // Toggle movie seen status
  const toggleMovieSeen = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ seen: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update movie");
      }

      const updatedMovie = await response.json();
      setMovies(movies.map(movie => movie.id === id ? updatedMovie : movie));
    } catch (error) {
      console.error("Error updating movie:", error);
      setError("Failed to update movie. Please try again.");
    }
  };

  // Soft delete a movie
  const deleteMovie = async (id) => {
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDeleted: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete movie");
      }

      // Remove the movie from the UI
      setMovies(movies.filter(movie => movie.id !== id));
    } catch (error) {
      console.error("Error deleting movie:", error);
      setError("Failed to delete movie. Please try again.");
    }
  };

  // Sort movies
  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    // Exit shuffle mode when sorting
    if (isShuffled) setIsShuffled(false);
  };

  // Random shuffle
  const shuffleMovies = () => {
    const shuffled = [...movies];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setMovies(shuffled);
    // Need to set isShuffled to true so processedMovies() doesn't re-sort
    setIsShuffled(true);
  };

  // Process movies based on sort and group settings
  const processedMovies = () => {
    // If in shuffle mode, don't re-sort
    let sorted = isShuffled ? [...movies] : [...movies].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    // If grouping by genre, return an object with genres as keys
    if (groupByGenre) {
      return sorted.reduce((acc, movie) => {
        if (!acc[movie.genre]) {
          acc[movie.genre] = [];
        }
        acc[movie.genre].push(movie);
        return acc;
      }, {});
    }

    // Otherwise return the sorted array
    return sorted;
  };

  return (
    <div className="min-h-screen bg-[#36465d] text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Movie Watch List</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#ff458c] hover:bg-[#e03a7c] text-white rounded-md transition-colors cursor-pointer"
            >
              Add Movie
            </button>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-[#529ecc] hover:bg-[#3d7ea6] text-white rounded-md transition-colors text-sm cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Success message */}
        {successMessage && (
          <div className="bg-green-500/20 border border-green-500 text-green-100 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="bg-[#1d2c3c] rounded-lg p-4 mb-6 flex flex-wrap gap-3 items-center">
          <button
            onClick={handleSort}
            className="px-4 py-3 bg-[#529ecc] hover:bg-[#3d7ea6] rounded-md transition-colors text-sm flex items-center justify-center min-w-[48px] cursor-pointer"
            title={`Sort ${sortOrder === "asc" ? "A-Z" : "Z-A"}`}
          >
            {sortOrder === "asc" ? <FaSortAlphaDown size={24} /> : <FaSortAlphaUp size={24} />}
          </button>
          
          <button
            onClick={() => {
              setGroupByGenre(!groupByGenre);
              // Exit shuffle mode when grouping/ungrouping
              if (isShuffled) setIsShuffled(false);
            }}
            className={`px-4 py-3 rounded-md transition-colors text-sm flex items-center justify-center min-w-[48px] cursor-pointer ${groupByGenre ? 'bg-[#ff458c] hover:bg-[#e03a7c]' : 'bg-[#529ecc] hover:bg-[#3d7ea6]'}`}
            title={groupByGenre ? "Ungroup" : "Group by Genre"}
          >
            <FaLayerGroup size={24} />
          </button>
          
          <button
            onClick={shuffleMovies}
            className="px-4 py-3 bg-[#529ecc] hover:bg-[#3d7ea6] rounded-md transition-colors text-sm flex items-center justify-center min-w-[48px] cursor-pointer"
            title="Random Shuffle"
          >
            <FaRandom size={24} />
          </button>
        </div>

        {/* Movie List */}
        <div className="bg-[#1d2c3c] rounded-lg p-6 shadow-lg">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              <p className="mt-2">Loading movies...</p>
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl mb-4">No movies in your watch list yet</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-[#ff458c] hover:bg-[#e03a7c] rounded-md transition-colors"
              >
                Add Your First Movie
              </button>
            </div>
          ) : groupByGenre ? (
            // Grouped by genre view
            Object.entries(processedMovies()).map(([genre, genreMovies]) => (
              <div key={genre} className="mb-6 last:mb-0">
                <h3 className="text-lg font-semibold mb-2 pb-1 border-b border-[#529ecc]/30">{genre}</h3>
                <ul className="space-y-2">
                  {genreMovies.map(movie => (
                    <MovieItem 
                      key={movie.id} 
                      movie={movie} 
                      onToggleSeen={toggleMovieSeen} 
                      onDelete={deleteMovie} 
                    />
                  ))}
                </ul>
              </div>
            ))
          ) : (
            // Regular list view
            <ul className="space-y-2">
              {processedMovies().map(movie => (
                <MovieItem 
                  key={movie.id} 
                  movie={movie} 
                  onToggleSeen={toggleMovieSeen} 
                  onDelete={deleteMovie} 
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Add Movie Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1d2c3c] rounded-lg max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold mb-6">New Movie</h2>
            
            <form onSubmit={handleAddMovie} className="space-y-4">
              <div>
                <label htmlFor="movieTitle" className="block text-sm font-medium text-gray-300 mb-1">
                  Movie Title
                </label>
                <input
                  id="movieTitle"
                  type="text"
                  value={newMovie.name}
                  onChange={(e) => setNewMovie({...newMovie, name: e.target.value})}
                  className="w-full px-4 py-2 bg-[#0e1620] border border-[#2f3d4d] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#529ecc]"
                  placeholder="Enter movie title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="movieGenre" className="block text-sm font-medium text-gray-300 mb-1">
                  Genre
                </label>
                <input
                  id="movieGenre"
                  type="text"
                  value={newMovie.genre}
                  onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})}
                  className="w-full px-4 py-2 bg-[#0e1620] border border-[#2f3d4d] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#529ecc]"
                  placeholder="Enter genre"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={addingMovie}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff458c] hover:bg-[#e03a7c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff458c] transition-colors"
              >
                {addingMovie ? "Adding..." : "Add Movie"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
