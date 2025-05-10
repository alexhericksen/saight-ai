'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase"; // adjust if your path differs

type Session = {
  id: string;
  domain: string;
  timestamp: string;
  duration_seconds: number;
};

const aiToolLogos: Record<string, string> = {
  "chat.openai.com": "/logos/chatgpt.png",
  "claude.ai": "/logos/claude.png",
  "grok.x.ai": "/logos/grok.png",
  "cursor.com": "/logos/cursor.png",
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
    acc[session.domain] = (acc[session.domain] || 0) + session.duration_seconds;
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
        {Object.entries(sessionsByTool).map(([domain, totalSeconds]) => (
          <div
            key={domain}
            className="bg-white shadow-md rounded-2xl p-5 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <img
                src={aiToolLogos[domain] || "/logos/default-ai.png"}
                alt={domain}
                className="w-10 h-10"
              />
              <div>
                <p className="text-lg font-medium">{domain}</p>
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
