"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

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
    return (
      <div className="min-h-screen bg-[#36465d] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Movie Watch List</h1>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-[#529ecc] hover:bg-[#3d7ea6] rounded-md transition-colors"
            >
              Sign Out
            </button>
          </header>
          
          <div className="bg-[#1d2c3c] rounded-lg p-6 shadow-lg">
            <p className="text-xl mb-4">Welcome to your movie watch list!</p>
            <p>Your movies will appear here.</p>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show Tumblr-inspired login page
  return (
    <div className="min-h-screen bg-[#36465d] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1d2c3c] rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-center text-white mb-6">Movie Watch List</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#0e1620] border border-[#2f3d4d] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#529ecc]"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#529ecc] hover:bg-[#3d7ea6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#529ecc] transition-colors"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </div>
          </form>
        </div>

        {/* GIF area - placeholder for dandadan.gif */}
        <div className="relative w-full h-64 bg-black/30">
          <Image
            src="/dandadan.gif"
            alt="Tumblr-style GIF"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d2c3c] to-transparent opacity-60"></div>
        </div>
      </div>
    </div>
  );
}
