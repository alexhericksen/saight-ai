'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // adjust path if needed

export default function Dashboard() {
  const [chartView, setChartView] = useState('daily');
  const [timeToday, setTimeToday] = useState<string>("—");
  const [topTool, setTopTool] = useState<string>("—");
  const [topTag, setTopTag] = useState<string>("—");

useEffect(() => {
  const fetchTodayDuration = async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("sessions")
      .select("duration")
      .gte("timestamp", startOfDay.toISOString());

    if (error) {
      console.error("Supabase error:", error);
      return;
    }

    const totalSeconds = data.reduce((sum: number, row: any) => sum + row.duration, 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    setTimeToday(`${hours}h ${minutes}m`);
    // Calculate top tool
const toolCounts = new Map<string, number>();
data.forEach((row: any) => {
  const tool = row.tool;
  toolCounts.set(tool, (toolCounts.get(tool) || 0) + row.duration);
});

const sortedTools = [...toolCounts.entries()].sort((a, b) => b[1] - a[1]);
if (sortedTools.length > 0) {
  setTopTool(sortedTools[0][0]);
  // Calculate top tag
const tagCounts = new Map<string, number>();
data.forEach((row: any) => {
  const tag = row.tag;
  if (tag) {
    tagCounts.set(tag, (tagCounts.get(tag) || 0) + row.duration);
  }
});

const sortedTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]);
if (sortedTags.length > 0) {
  setTopTag(sortedTags[0][0]);
}
}
  };

  fetchTodayDuration();
}, []);

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-4 flex flex-col justify-between">
        <div>
        <img src="/logo.png" alt="Saight logo" className="h-8 w-auto mb-6" />
          <nav className="space-y-4">
            <a href="#" className="block text-white hover:text-blue-500">Dashboard</a>
            <a href="#" className="block text-white hover:text-blue-500">Leaderboard</a>
            <a href="#" className="block text-white hover:text-blue-500">Profile</a>
          </nav>
        </div>
        <a href="#" className="text-sm text-gray-400 hover:text-white">Settings</a>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Top stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Time Tracked Today" value={timeToday} />
        <StatCard label="Top Tool Today" value={topTool} />
        <StatCard label="Top Tag Today" value={topTag} />
        </div>

        {/* Chart + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart View */}
          <div className="lg:col-span-2 bg-gray-50 p-4 rounded-xl shadow">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Last 7 Days</h2>
              <div className="space-x-2">
                <button onClick={() => setChartView('daily')} className={chartView === 'daily' ? 'text-[#021BF9]' : 'text-gray-500'}>Daily</button>
                <button onClick={() => setChartView('tools')} className={chartView === 'tools' ? 'text-[#021BF9]' : 'text-gray-500'}>Tools</button>
                <button onClick={() => setChartView('tags')} className={chartView === 'tags' ? 'text-[#021BF9]' : 'text-gray-500'}>Tags</button>
              </div>
            </div>
            <div className="h-64 bg-white border rounded flex items-center justify-center text-gray-400">
              {chartView === 'daily' ? 'Bar Chart: Time Per Day' : chartView === 'tools' ? 'Bar Chart: Top Tools' : 'Bar Chart: Top Tags'}
            </div>
          </div>

          {/* My Activity Panel */}
          <div className="bg-gray-50 p-4 rounded-xl shadow space-y-4">
            <h2 className="text-lg font-semibold">My Activity</h2>
            <div>🔥 Streak: 7 days</div>
            <div>
              <p>📈 Current Milestone: 10 tools used</p>
              <p>🎯 Next: 15 tools (5 to go)</p>
            </div>
            <div className="h-24 bg-white border rounded flex items-center justify-center text-gray-400">
              GitHub-style heatmap (placeholder)
            </div>
          </div>
        </div>

        {/* More Actions Banner */}
        <div className="bg-[#021BF9] text-white p-6 rounded-xl shadow flex items-center justify-between">
          <button>{'<'}</button>
          <p className="text-lg font-medium">Search My History</p>
          <button>{'>'}</button>
        </div>
      </main>
    </div>
  );
}

type StatCardProps = {
    label: string;
    value: string;
  };
  
  function StatCard({ label, value }: StatCardProps) {
    return (
      <div className="bg-gray-50 p-4 rounded-xl shadow text-center">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-semibold text-[#021BF9]">{value}</p>
      </div>
    );
  }
