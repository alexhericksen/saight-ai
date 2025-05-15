'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Pencil, Home, User, Globe, Settings } from "lucide-react";

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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white text-black border-r p-6 flex flex-col justify-between">
        <div className="space-y-4 flex items-center flex-col">
          <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-5 flex justify-center">
              <Home className="h-5 w-5" />
            </div>
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-5 flex justify-center">
              <User className="h-5 w-5" />
            </div>
            <span>My Profile</span>
          </a>
          <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-5 flex justify-center">
              <Globe className="h-5 w-5" />
            </div>
            <span>Explore</span>
          </a>
        </div>
        <div className="space-y-6 flex items-center flex-col">
          <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-5 flex justify-center">
              <Settings className="h-5 w-5" />
            </div>
            <span>Settings</span>
          </a>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">ai usage provided by</p>
            <img src="/logo.png" alt="Saight logo" className="h-7 w-auto mx-auto" />
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 bg-gray-100 text-black">
        {/* Profile Header Section */}
        <div className="flex justify-between items-center border-b pb-6 mb-6">
          <div className="flex items-center space-x-6">
            <img src="/profile.png" className="h-20 w-20 rounded-full border" alt="Profile" />
            <div>
              <h1 className="text-2xl font-semibold">Alex Ericksen</h1>
              <p>Total Time Tracked: {timeToday}</p>
              <p>User since: Jan 2024</p>
              <p>Profile Views: 198</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm">Industry: Marketing <button><Pencil className="inline h-4 w-4 ml-1" /></button> <span className="text-xs text-gray-500">(Top 8%)</span></p>
            <p className="text-sm">Profession: Growth Strategist <button><Pencil className="inline h-4 w-4 ml-1" /></button> <span className="text-xs text-gray-500">(Top 12%)</span></p>
            <p className="text-sm">Company: Saight.ai <button><Pencil className="inline h-4 w-4 ml-1" /></button> <span className="text-xs text-gray-500">(Top 3%)</span></p>
          </div>
          <div className="text-right">
            <Button variant="default" className="px-4 py-2">Share</Button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard label="Time Tracked Today" value={timeToday} />
          <StatCard label="Top Tools Today" tools={topToolsToday} />
          <StatCard label="Top Tags Today" tags={topTagsToday} />
        </div>

        {/* Chart and Activity Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Last 7 Days</h2>
            <div className="flex justify-end mb-4">
              <div className="space-x-2">
                <button onClick={() => setChartView('daily')} className={chartView === 'daily' ? 'text-black font-medium' : 'text-gray-500'}>Daily</button>
                <button onClick={() => setChartView('tools')} className={chartView === 'tools' ? 'text-black font-medium' : 'text-gray-500'}>Tools</button>
                <button onClick={() => setChartView('tags')} className={chartView === 'tags' ? 'text-black font-medium' : 'text-gray-500'}>Tags</button>
              </div>
            </div>
            <div className="h-48 bg-gray-100 border rounded flex items-center justify-center text-gray-400">
              {chartView === 'daily' ? 'Bar Chart: Time Per Day' : chartView === 'tools' ? 'Bar Chart: Top Tools' : 'Bar Chart: Top Tags'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-semibold mb-4">My Activity</h2>
            <div>🔥 Streak: 7 days</div>
            <div>
              <p>📈 Current Milestone: 10 tools used</p>
              <p>🎯 Next: 15 tools (5 to go)</p>
            </div>
            <div className="h-16 bg-gray-100 border rounded flex items-center justify-center text-gray-400">
              GitHub-style heatmap (placeholder)
            </div>
          </div>
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
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="mb-2">{label}</p>
      {value && <p className="text-xl font-semibold text-black">{value}</p>}
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
