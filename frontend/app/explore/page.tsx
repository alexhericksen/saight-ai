'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Pencil, Home, User, Globe, Settings, Gift, Bell, Plus, BarChart2, Building, Search } from "lucide-react";

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("feed");
  const [trendingTab, setTrendingTab] = useState("users");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-52 bg-white text-black border-r p-6 flex flex-col justify-between">
        <div>
          {/* Main Menu Items */}
          <div className="space-y-4 flex items-center flex-col pt-6">
            <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-5 flex justify-center">
                <Home className="h-5 w-5" />
              </div>
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-5 flex justify-center">
                <User className="h-5 w-5" />
              </div>
              <span className="font-medium">My Profile</span>
            </a>
            <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-5 flex justify-center">
                <Globe className="h-5 w-5" />
              </div>
              <span>Explore</span>
            </a>
            <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <div className="w-5 flex justify-center">
                <Building className="h-5 w-5" />
              </div>
              <span>My Company</span>
              <span className="absolute -bottom-2 -right-3 bg-white border border-gray-200 rounded-full px-2 py-0.5 text-xs text-gray-400 font-semibold shadow-md">Pro</span>
            </a>
          </div>
          {/* Centered section for Usage Settings and Track New */}
          <div className="flex flex-col items-center space-y-2 mt-16 mb-8">
            <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-5 flex justify-center">
                <BarChart2 className="h-5 w-5" />
              </div>
              <span>Usage Settings</span>
            </a>
            <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-5 flex justify-center">
                <Plus className="h-5 w-5" />
              </div>
              <span>Track New</span>
            </a>
          </div>
        </div>
        <div className="space-y-4 flex items-center flex-col">
          <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-5 flex justify-center">
              <Settings className="h-5 w-5" />
            </div>
            <span>Settings</span>
          </a>
          <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-5 flex justify-center">
              <Gift className="h-5 w-5" />
            </div>
            <span>Refer</span>
          </a>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">ai usage provided by</p>
            <img src="/logo.png" alt="Saight logo" className="h-7 w-auto mx-auto" />
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 bg-gray-100 text-black">
        {/* Profile Header */}
        <div className="relative flex items-start border-b pb-6 mb-6">
          {/* Left: Profile Info */}
          <div className="flex items-center space-x-6 w-1/3 min-w-[320px]">
            <div className="relative">
              <img src="/profile.png" className="h-32 w-32 rounded-full border-2 border-white shadow-lg transform rotate-1" alt="Profile" />
              <div className="absolute inset-0 rounded-full border-2 border-gray-200/50 transform -rotate-1"></div>
              <span className="absolute -bottom-2 right-0 bg-white border border-gray-200 rounded-full px-2 py-0.5 text-xs text-gray-400 font-semibold shadow-md">Pro</span>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-semibold">Alex Ericksen</h1>
              <p className="text-xs text-gray-700">📍 Lehi, Utah</p>
              <p className="text-xs text-gray-700">🎂 joined May 2025</p>
              <div className="flex items-center space-x-3 mt-2">
                <div className="flex flex-col items-center">
                  <ToggleSwitch checked={true} onChange={() => {}} label="public" />
                </div>
                <Button variant="default" size="sm" className="w-fit px-7 py-0.5">Share</Button>
              </div>
            </div>
          </div>
          {/* Center: Baseball Card */}
          <div className="w-2/3 flex justify-start">
            <div className="bg-white rounded-xl shadow p-4 w-full max-w-2xl text-sm">
              <div className="text-center text-xs font-medium m-0 p-0 leading-tight">⚾️ Baseball Card ⚾️</div>
              <div className="grid grid-cols-2 gap-2">
                {/* Left Section: Remove heading, add gray cards */}
                <div className="space-y-1">
                  <div className="bg-gray-50 rounded-lg p-2 flex justify-between items-center text-xs">
                    <span>⏰ Total AI Usage</span>
                    <span className="font-semibold">41h 36m</span>
                    <span className="text-[10px] text-gray-500">#1 overall</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 flex justify-between items-center text-xs">
                    <span>🛠️ Avg Tools/Day</span>
                    <span className="font-semibold">6 tools</span>
                    <span className="text-[10px] text-gray-500">#1 overall</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 flex justify-between items-center text-xs">
                    <span>📈 Expertise</span>
                    <span className="font-semibold">6 contributions</span>
                    <span className="text-[10px] text-gray-500">#1 overall</span>
                  </div>
                </div>
                {/* Right Section: Remove heading, add gray cards */}
                <div className="space-y-1">
                  <div className="bg-gray-50 rounded-lg p-2 flex justify-between items-center text-xs">
                    <span>🏢 Industry</span>
                    <span className="font-semibold">AI tech</span>
                    <span className="text-[10px] text-gray-500">#1 overall</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 flex justify-between items-center text-xs">
                    <span>💻 Profession</span>
                    <span className="font-semibold">Product Management</span>
                    <span className="text-[10px] text-gray-500">#1 overall</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 flex justify-between items-center text-xs">
                    <span>💰 Company</span>
                    <span className="font-semibold">Saight.ai</span>
                    <span className="text-[10px] text-gray-500">#1 overall</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right: Notifications Icon - absolutely positioned */}
          <div className="absolute right-0 top-0 flex items-start justify-end w-24" style={{ top: 0 }}>
            <div className="bg-white rounded-full shadow p-2 flex items-center justify-center">
              <Bell className="h-5 w-5 text-gray-700" />
            </div>
          </div>
        </div>

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
    </div>
  );
}
