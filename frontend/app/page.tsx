"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Session = {
  id: number;
  tool: string;
  duration: number;
  tag: string | null;
  timestamp: string;
};

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(10);
  
      console.log("Supabase data:", data);
      console.log("Supabase error:", error);
  
      if (error) {
        console.error("Error fetching sessions:", error.message);
      } else {
        setSessions(data || []);
      }
    };
  
    fetchSessions();
  }, []);  

  return (
    <main className="p-6 max-w-2xl mx-auto bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Recent AI Sessions</h1>
      <ul className="space-y-2">
        {sessions.map((session) => (
          <li
          key={session.id}
          className="bg-gray-900 rounded-lg shadow p-4 border border-gray-700"
        >        
            <p><strong>Tool:</strong> {session.tool}</p>
            <p><strong>Duration:</strong> {session.duration} sec</p>
            <p><strong>Tag:</strong> {session.tag || "—"}</p>
            <p className="text-sm text-gray-500">
              {new Date(session.timestamp).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
