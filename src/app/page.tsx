'use client';

import { useState, useEffect } from 'react';
import UserInput from '@/components/UserInput';
import { fetchTableauStats } from '@/utils/api';
import type { TableauStats } from '@/types';
import BentoGrid from '@/components/BentoGrid';
import { FaXTwitter, FaLinkedin } from 'react-icons/fa6';  // Import icons

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<TableauStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (username: string) => {
    setLoading(true);
    setError(null);
    setUsername(username);
    try {
      const data = await fetchTableauStats(username);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-white text-4xl font-semibold text-center pt-24 mb-8">
        Tableau Public Wrapped
      </h1>
      <UserInput onSubmit={handleSubmit} isLoading={loading} />
      {error && (
        <div className="max-w-md mx-auto mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {stats && (
        <div className="flex flex-col items-center">
          <div className="flex justify-center mt-8">
            <BentoGrid stats={stats} username={username} />
          </div>
          

          {/* Social Media Links */}
          <div className="mt-8 flex gap-4 justify-center">
            <a
              href="https://x.com/harijeyan_"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#333333] text-white px-4 py-2 rounded-lg hover:bg-[#444444] transition-colors"
            >
              <FaXTwitter size={20} />
            </a>
            <a
              href="https://linkedin.com/in/harijeyan"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#333333] text-white px-4 py-2 rounded-lg hover:bg-[#444444] transition-colors"
            >
              <FaLinkedin size={20} />
            </a>
          </div>

          {/* Credits & Resources */}
          <div className="mt-6 mb-8 text-center text-gray-400">
            <p className="mb-2 text-sm">Created by Hari Jeyan</p>
            <div className="text-xs space-y-1">
              <p>Built with Cursor, and Tableau Public API</p>
              <p>Tableau Public API Documentation - Will Sutton</p>
              <p>Bento Grid UI Design Inspiration - Karthik S R</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}