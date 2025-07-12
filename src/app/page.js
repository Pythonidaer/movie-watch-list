"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import MovieListPage from "./components/MovieListPage";

export default function Home() {
  const { data: session, status } = useSession();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Incorrect password");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#36465d]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // If authenticated, show movie list page
  if (session) {
    return <MovieListPage />;
  }
  
  // If not authenticated, show Tumblr-inspired login page
  return (
    <div className="min-h-screen bg-[#36465d] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1d2c3c] rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Movie Watch List</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#0e1620] border border-[#2f3d4d] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#529ecc]"
                placeholder="Enter password"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff458c] hover:bg-[#e03a7c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff458c] transition-colors cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
        
        {/* GIF placeholder */}
        <div className="bg-[#141e2a] flex justify-center p-0 overflow-hidden">
          <div className="relative w-full h-56">
            <Image
              src="/dandadan.gif"
              alt="Tumblr-inspired GIF"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              style={{ objectFit: "cover" }}
              className="w-full h-full"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
