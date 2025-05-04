"use client";

import { useEffect, useState } from "react";

type Session = {
  tool: string;
  timestamp: string;
  duration: number;
  tag?: string;
};

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    // Placeholder for real backend fetch in the future
    const sampleSessions: Session[] = [
      {
        tool: "chat.openai.com",
        timestamp: "2025-05-02T15:30:00Z",
        duration: 132,
        tag: "resume writing"
      },
      {
        tool: "claude.ai",
        timestamp: "2025-05-02T16:10:00Z",
        duration: 88,
        tag: "sales email"
      }
    ];
    setSessions(sampleSessions);
  }, []);

  const downloadCSV = () => {
    const header = "Tool,Timestamp,Duration (sec),Tag\n";
    const rows = sessions
      .map(s =>
        [s.tool, s.timestamp, s.duration, s.tag || ""].join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "saight-ai-usage.csv";
    link.click();
  };

  return (
    <main className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Saight-AI Dashboard</h1>
      <button
        onClick={downloadCSV}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download CSV
      </button>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Tool</th>
            <th className="p-2 border">Timestamp</th>
            <th className="p-2 border">Duration (sec)</th>
            <th className="p-2 border">Tag</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, i) => (
            <tr key={i} className="border-t">
              <td className="p-2 border">{s.tool}</td>
              <td className="p-2 border">{new Date(s.timestamp).toLocaleString()}</td>
              <td className="p-2 border">{s.duration}</td>
              <td className="p-2 border">{s.tag || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
