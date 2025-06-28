"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Pencil, Home, User, Globe, Settings, Gift, Bell, Plus, BarChart2, Building } from "lucide-react";
import { TrackToolDialog } from "@/components/ui/track-tool-dialog";
import { SettingsDialog } from "@/components/settings-dialog";
import { ShareDropdown } from "@/components/ui/share-dropdown";
import BaseballCard from '@/components/BaseballCard';
import Header from '@/components/Header';
import { useUser } from '@/lib/useUser';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function Dashboard() {
  const [chartView, setChartView] = useState('daily');
  const [topToolsToday, setTopToolsToday] = useState<{ tool: string; duration: string }[]>([]);
  const [topTagsToday, setTopTagsToday] = useState<{ tag: string; duration: string }[]>([]);
  const [timeToday, setTimeToday] = useState("0m");
  const [isTrackToolOpen, setIsTrackToolOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'account' | 'billing' | 'industry'>('account');
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return; // Still loading
    if (user === null) {
      router.replace('/login');
    }
  }, [user, router]);

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

  if (user === undefined) return null;
  if (!user) return null;

  // Use Google profile info if available, otherwise fallback
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email || "User";
  const googleAvatar = user.user_metadata?.avatar_url || "/profile.png";

  return (
    <div className="flex min-h-screen">
      <Sidebar
        onTrackNew={() => setIsTrackToolOpen(true)}
        onSettings={() => { setIsSettingsOpen(true); setSettingsTab('account'); }}
      />
      <main className="flex-1 p-6 bg-gray-100 text-black">
        {/* Header Section */}
        <Header
          name={displayName}
          location="Lehi, Utah"
          joinDate="May 2025"
          avatarUrl={googleAvatar}
          onEditProfile={() => { setIsSettingsOpen(true); setSettingsTab("account"); }}
          onEditField={(field) => {
            setIsSettingsOpen(true);
            setSettingsTab("industry");
          }}
        />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard label="⏰ Time Today" value={timeToday} />
          <StatCard label="🛠️ Top Tools Today" tools={topToolsToday} />
          <StatCard label="🏷️ Top Uses Today" tags={topTagsToday} />
        </div>

        {/* Chart and Activity Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">🗓️ Last 7 Days</h2>
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
            <h2 className="text-xl font-semibold mb-4">⌛️ My Activity</h2>
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

      <TrackToolDialog 
        open={isTrackToolOpen} 
        onOpenChange={setIsTrackToolOpen} 
      />
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        initialTab={settingsTab}
        user={user}
      />
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
        <div className="space-y-2 mt-2">
          {tools.map((t) => (
            <div key={t.tool} className="bg-gray-50 rounded-lg p-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src={`/logos/${t.tool}.png`}
                  alt={t.tool}
                  className="h-5 w-5 rounded-sm"
                />
                <span className="text-sm">{t.tool.replace(".com", "")}</span>
              </div>
              <span className="text-xs text-gray-500">{t.duration}</span>
            </div>
          ))}
        </div>
      )}
      {tags && tags.length > 0 && (
        <div className="space-y-2 mt-2">
          {tags.map((t) => (
            <div key={t.tag} className="bg-gray-50 rounded-lg p-2 flex items-center justify-between">
              <span className="text-sm font-medium">{t.tag}</span>
              <span className="text-xs text-gray-500">{t.duration}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
