"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Pencil, Home, User, Globe, Settings, Gift, Bell, Plus, BarChart2, Building, Search } from "lucide-react";
import { TrackToolDialog } from "@/components/ui/track-tool-dialog";
import { SettingsDialog } from "@/components/settings-dialog";
import { ShareDropdown } from "@/components/ui/share-dropdown";
import BaseballCard from '@/components/BaseballCard';
import Header from '@/components/Header';
import { useUser } from '@/lib/useUser';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function ExplorePage() {
  const user = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("feed");
  const [trendingTab, setTrendingTab] = useState("users");
  const [isTrackToolOpen, setIsTrackToolOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"account" | "billing" | "industry">("account");

  useEffect(() => {
    if (user === undefined) return; // Still loading
    if (user === null) {
      router.replace('/login');
    }
  }, [user, router]);

  if (user === undefined) return null; // Or a loading spinner
  if (!user) return null;

  // Use Google profile info if available, otherwise fallback
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email || "User";
  const googleAvatar = user.user_metadata?.avatar_url || "/profile.png";

  return (
    <div className="flex min-h-screen">
      <Sidebar onTrackNew={() => setIsTrackToolOpen(true)} onSettings={() => setIsSettingsOpen(true)} />
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

        {/* Explore Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <Button variant={activeTab === "trending" ? "default" : "outline"} onClick={() => setActiveTab("trending")}>Explore Trending</Button>
          <Button variant={activeTab === "feed" ? "default" : "outline"} onClick={() => setActiveTab("feed")}>Feed</Button>
        </div>

        {/* Feed Tab */}
        {activeTab === "feed" && (
          <div className="space-y-6">
            {/* Actions Bar */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 flex items-center space-x-2 bg-white rounded-lg border p-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search feed..."
                  className="flex-1 outline-none text-sm"
                />
              </div>
              <Button variant="outline">Search</Button>
            </div>

            {/* Feed Content */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center space-x-4 mb-4">
                <h2 className="text-xl font-semibold">🍗 Feed</h2>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Post</span>
                </Button>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p><strong>Sarah Lopez</strong> reached 100 hours of tracked AI usage! 🎉</p>
                  <p className="text-sm text-gray-500">"Excited to cross this milestone! Thanks to Saight for the insights. 💡"</p>
                  <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                    <span>🎉 18 Cheers</span>
                    <span>💬 3 Comments</span>
                    <button className="hover:text-gray-800">✈️ Send</button>
                    <button className="hover:text-gray-800">🔖 Save</button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p><strong>Jared Kim</strong> just launched a new AI tool for fitness tracking 📈</p>
                  <p className="text-sm text-gray-500">"Built with Replit, Perplexity and Claude. Tracks reps and suggests new workouts."</p>
                  <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                    <span>🎉 26 Cheers</span>
                    <span>💬 5 Comments</span>
                    <button className="hover:text-gray-800">✈️ Send</button>
                    <button className="hover:text-gray-800">🔖 Save</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trending This Week */}
        {activeTab === "trending" && (
          <div className="space-y-6">
            {/* Categories Card */}
            <div className="bg-white rounded-xl shadow py-2 px-4">
              <div className="flex items-center space-x-4">
                <p className="text-sm text-black">Categories:</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant={trendingTab === "users" ? "default" : "outline"} onClick={() => setTrendingTab("users")}>Users</Button>
                  <Button variant={trendingTab === "tools" ? "default" : "outline"} onClick={() => setTrendingTab("tools")}>Tools</Button>
                  <Button variant={trendingTab === "uses" ? "default" : "outline"} onClick={() => setTrendingTab("uses")}>Uses</Button>
                  <Button variant={trendingTab === "industries" ? "default" : "outline"} onClick={() => setTrendingTab("industries")}>Industries</Button>
                  <Button variant={trendingTab === "professions" ? "default" : "outline"} onClick={() => setTrendingTab("professions")}>Professions</Button>
                  <Button variant={trendingTab === "companies" ? "default" : "outline"} onClick={() => setTrendingTab("companies")}>Companies</Button>
                  <Button variant={trendingTab === "projects" ? "default" : "outline"} onClick={() => setTrendingTab("projects")}>Projects</Button>
                  <Button variant={trendingTab === "tutorials" ? "default" : "outline"} onClick={() => setTrendingTab("tutorials")}>Tutorials</Button>
                </div>
              </div>
            </div>

            {/* Content Cards */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">📈 Trending</h2>
              <div className="space-y-4">
                {trendingTab === "users" && (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p>👤 <strong>Amy Zhang</strong> (Product Manager, AI Tools) – 168h tracked</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p>👤 <strong>Malik Reyes</strong> (Developer, Generative AI) – 152h tracked</p>
                    </div>
                  </>
                )}

                {trendingTab === "tools" && (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p>🔥 <strong>Perplexity.ai</strong> – 34% user growth this week</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p>🔥 <strong>Lovable.dev</strong> – 3x increase in time spent</p>
                    </div>
                  </>
                )}

                {trendingTab === "uses" && (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p>✍️ <strong>Scriptwriting with Claude</strong> – +65% activity</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p>📚 <strong>Research for podcasts</strong> – New top use case</p>
                    </div>
                  </>
                )}

                {trendingTab === "projects" && (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p>🎨 <strong>Emma Rivera's AI Moodboard Generator</strong> – 54 Cheers</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p>🎧 <strong>Andre Silva's Synthesia-powered interview series</strong> – Highly shared</p>
                    </div>
                  </>
                )}

                {trendingTab === "industries" && (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p>🎯 <strong>Go-to-Market (GTM)</strong> – 2.8x AI adoption rate</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p>📊 <strong>Product Management</strong> – 2.5x increase in AI tool usage</p>
                    </div>
                  </>
                )}

                {trendingTab === "professions" && (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p>📱 <strong>Digital Marketers</strong> – 3.2x AI tool engagement</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p>💼 <strong>Account Executives</strong> – 2.9x growth in AI usage</p>
                    </div>
                  </>
                )}

                {trendingTab === "companies" && (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p>🏢 <strong>Notion</strong> – 2,450 AI users tracking their usage</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p>🏢 <strong>HubSpot</strong> – 1,892 AI users tracking their usage</p>
                    </div>
                  </>
                )}

                {trendingTab === "tutorials" && (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p>📚 <strong>Getting Started with Claude</strong> – 1.2k views this week</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p>🎥 <strong>Advanced Perplexity Techniques</strong> – 850 saves</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <TrackToolDialog 
        open={isTrackToolOpen} 
        onOpenChange={setIsTrackToolOpen} 
      />
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        initialTab={settingsTab}
      />
    </div>
  );
}
