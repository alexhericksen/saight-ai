'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [chartView, setChartView] = useState('daily');
  const [topToolsToday, setTopToolsToday] = useState<{ tool: string; duration: string }[]>([]);
  const [topTagsToday, setTopTagsToday] = useState<{ tag: string; duration: string }[]>([]);
  const [timeToday, setTimeToday] = useState("0m");

  useEffect(() => {
    const fetchTodayStats = async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .gte("timestamp", new Date().toISOString().split("T")[0]);

      if (error || !data) {
        console.error("Error fetching today's data:", error);
        return;
      }

      const total = data.reduce((sum, s) => sum + s.duration, 0);
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      setTimeToday(`${h > 0 ? `${h}h ` : ""}${m}m`);

      const toolMap: { [key: string]: number } = {};
      for (const s of data) {
        const tool = s.tool as string;
        toolMap[tool] = (toolMap[tool] || 0) + s.duration;
      }

      const topTools = Object.entries(toolMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([tool, duration]) => {
          const hrs = Math.floor(duration / 3600);
          const mins = Math.floor((duration % 3600) / 60);
          return {
            tool,
            duration: `${hrs > 0 ? `${hrs}h ` : ""}${mins}m`,
          };
        });

      setTopToolsToday(topTools);

      const tagMap: { [key: string]: number } = {};
      for (const s of data) {
        const tag = s.tag_detail || s.tag_category;
        if (tag) {
          tagMap[tag] = (tagMap[tag] || 0) + s.duration;
        }
      }

      const topTags = Object.entries(tagMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([tag, duration]) => {
          const hrs = Math.floor(duration / 3600);
          const mins = Math.floor((duration % 3600) / 60);
          return {
            tag,
            duration: `${hrs > 0 ? `${hrs}h ` : ""}${mins}m`,
          };
        });

      setTopTagsToday(topTags);
    };

    fetchTodayStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-white text-black">
      <aside className="w-64 bg-black text-white p-4 flex flex-col justify-between">
        <div>
          <img src="/logo.png" alt="Saight logo" className="h-8 w-auto mb-6" />
          <nav className="space-y-4">
            <a href="#" className="block text-white hover:text-blue-500">Dashboard</a>
            <a href="#" className="block text-white hover:text-blue-500">Explore</a>
            <a href="#" className="block text-white hover:text-blue-500">My Profile</a>
          </nav>
        </div>
        <a href="#" className="text-sm text-gray-400 hover:text-white">Settings</a>
      </aside>

      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Time Tracked Today" value={timeToday} />
          <StatCard label="Top Tools Today" tools={topToolsToday} />
          <StatCard label="Top Tags Today" tags={topTagsToday} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
  value?: string;
  tools?: { tool: string; duration: string }[];
  tags?: { tag: string; duration: string }[];
};

function StatCard({ label, value, tools, tags }: StatCardProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow text-center">
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      {value && <p className="text-xl font-semibold text-[#021BF9]">{value}</p>}
      {tools && tools.length > 0 && (
        <div className="space-y-1 mt-2">
          {tools.map((t) => (
            <div key={t.tool} className="flex items-center justify-center space-x-2">
              <img
                src={`/logos/${t.tool}.png`}
                alt={t.tool}
                className="h-5 w-5 rounded-sm"
              />
              <span className="text-sm">{t.tool.replace(".com", "")}</span>
              <span className="text-xs text-gray-500">{t.duration}</span>
            </div>
          ))}
        </div>
      )}
      {tags && tags.length > 0 && (
        <div className="space-y-1 mt-2">
          {tags.map((t) => (
            <div key={t.tag} className="flex items-center justify-center space-x-2">
              <span className="text-sm font-medium">{t.tag}</span>
              <span className="text-xs text-gray-500">{t.duration}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
