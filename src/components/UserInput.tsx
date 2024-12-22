'use client';

import { useState } from 'react';

interface UserInputProps {
  onSubmit: (username: string) => void;
  isLoading?: boolean;
}

export default function UserInput({ onSubmit, isLoading = false }: UserInputProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username);
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your Tableau Public username"
          className="w-full bg-[#333333] text-[#EEEEEE] px-4 py-3 rounded-lg mb-4 placeholder-gray-500"
          disabled={isLoading}
        />
        <div className="text-center mt-2 mb-4">
          <p className="text-sm text-gray-400 mb-1">You can find your username from your profile URL</p>
          <p className="text-sm">
            <span className="text-white">https://public.tableau.com/app/profile/</span>
            <span className="bg-[#28d979] text-black px-1">hari.jeyan</span>
            <span className="text-white">/vizzes</span>
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={!username || isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Wrapped'}
        </button>
      </form>
    </div>
  );
}
