'use client';

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase"; // adjust if your path differs

type Session = {
  id: string;
  tool: string;
  timestamp: string;
  duration: number;
};

const aiToolLogos: Record<string, string> = {
  "chatgpt.com": "/logos/chatgpt.png",
  "claude.ai": "/logos/claude.png",
  "grok.com": "/logos/grok.png",
  "cursor.com": "/logos/cursor.png",
  "replit.com": "/logos/replit.png",
  "superhuman.com": "/logos/superhuman.png",
  "lovable.dev": "/logos/lovable.png",
  "perplexity.ai": "/logos/perplexity.png",
  "linear.app": "/logos/linear.png",
  "bolt.new": "/logos/bolt.png",
  "notion.com": "/logos/notion.png"
};

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [
    h > 0 ? `${h}h` : null,
    m > 0 ? `${m}m` : null,
    s > 0 || (h === 0 && m === 0) ? `${s}s` : null,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function DashboardSummary() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .order("timestamp", { ascending: false });

      if (data) setSessions(data);
      if (error) console.error("Error loading sessions:", error.message);
    };

    fetchSessions();
  }, []);

  const sessionsByTool = sessions.reduce((acc: Record<string, number>, session) => {
    acc[session.tool] = (acc[session.tool] || 0) + session.duration;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Mocked user profile */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">AI Usage Summary</h1>
        <div className="flex items-center space-x-3">
          <img
            src="/avatar-placeholder.png"
            alt="User avatar"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-semibold">Alex</span>
        </div>
      </div>

      {/* Tool summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(sessionsByTool).map(([tool, totalSeconds]) => (
          <div
            key={tool}
            className="bg-white shadow-md rounded-2xl p-5 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <img
                src={aiToolLogos[tool] || "/logos/default-ai.png"}
                alt={tool}
                className="w-10 h-10"
              />
              <div>
                <p className="text-lg font-medium">{tool}</p>
                <p className="text-gray-500">{formatDuration(totalSeconds)}</p>
              </div>
            </div>
            <button className="text-blue-500 hover:underline text-sm">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
