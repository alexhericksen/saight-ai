'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("feed");
  const [trendingTab, setTrendingTab] = useState("users");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white text-black border-r p-6 flex flex-col justify-between">
        <div>
          <img src="/logo.png" alt="Saight logo" className="h-8 w-auto mb-6" />
          <nav className="space-y-4">
            <a href="#" className="block hover:text-[#021BF9]">Dashboard</a>
            <a href="#" className="block hover:text-[#021BF9]">My Profile</a>
            <a href="#" className="block font-medium text-[#021BF9]">Explore</a>
          </nav>
        </div>
        <div>
          <a href="#" className="text-sm text-gray-500 hover:text-black">Settings</a>
        </div>
      </aside>

      <main className="flex-1 p-6 bg-gray-100 text-black">
        {/* Profile Header */}
        <div className="flex justify-between items-center border-b pb-6 mb-6">
          <div className="flex items-center space-x-6">
            <img src="/profile.png" className="h-20 w-20 rounded-full border" alt="Profile" />
            <div>
              <h1 className="text-2xl font-semibold">Alex Ericksen</h1>
              <p>Total Time Tracked: 87h 42m</p>
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

        {/* Explore Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <Button variant={activeTab === "feed" ? "default" : "outline"} onClick={() => setActiveTab("feed")}>Feed</Button>
          <Button variant={activeTab === "trending" ? "default" : "outline"} onClick={() => setActiveTab("trending")}>Trending This Week</Button>
        </div>

        {/* Feed Tab */}
        {activeTab === "feed" && (
          <div className="space-y-6">
            <Button variant="outline">+ Post</Button>
            <div className="bg-white p-4 rounded-xl shadow">
              <p><strong>Sarah Lopez</strong> reached 100 hours of tracked AI usage! 🎉</p>
              <p className="text-sm text-gray-500">"Excited to cross this milestone! Thanks to Saight for the insights. 💡"</p>
              <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                <span>🎉 18 Cheers</span>
                <span>💬 3 Comments</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <p><strong>Jared Kim</strong> just launched a new AI tool for fitness tracking 📈</p>
              <p className="text-sm text-gray-500">"Built with Replit, Perplexity and Claude. Tracks reps and suggests new workouts."</p>
              <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                <span>🎉 26 Cheers</span>
                <span>💬 5 Comments</span>
              </div>
            </div>
          </div>
        )}

        {/* Trending This Week */}
        {activeTab === "trending" && (
          <div className="space-y-6">
            <div className="flex space-x-2 mb-4">
              <Button variant={trendingTab === "users" ? "default" : "outline"} onClick={() => setTrendingTab("users")}>Users</Button>
              <Button variant={trendingTab === "tools" ? "default" : "outline"} onClick={() => setTrendingTab("tools")}>Tools</Button>
              <Button variant={trendingTab === "uses" ? "default" : "outline"} onClick={() => setTrendingTab("uses")}>Uses</Button>
              <Button variant={trendingTab === "portfolios" ? "default" : "outline"} onClick={() => setTrendingTab("portfolios")}>Portfolios</Button>
              <Button variant={trendingTab === "industries" ? "default" : "outline"} onClick={() => setTrendingTab("industries")}>Industries</Button>
              <Button variant={trendingTab === "professions" ? "default" : "outline"} onClick={() => setTrendingTab("professions")}>Professions</Button>
              <Button variant={trendingTab === "companies" ? "default" : "outline"} onClick={() => setTrendingTab("companies")}>Companies</Button>
            </div>

            {trendingTab === "users" && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow">👤 <strong>Amy Zhang</strong> (Product Manager, AI Tools) – 168h tracked</div>
                <div className="bg-white p-4 rounded-xl shadow">👤 <strong>Malik Reyes</strong> (Developer, Generative AI) – 152h tracked</div>
              </div>
            )}

            {trendingTab === "tools" && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow">🔥 <strong>Perplexity.ai</strong> – 34% user growth this week</div>
                <div className="bg-white p-4 rounded-xl shadow">🔥 <strong>Lovable.dev</strong> – 3x increase in time spent</div>
              </div>
            )}

            {trendingTab === "uses" && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow">✍️ <strong>Scriptwriting with Claude</strong> – +65% activity</div>
                <div className="bg-white p-4 rounded-xl shadow">📚 <strong>Research for podcasts</strong> – New top use case</div>
              </div>
            )}

            {trendingTab === "portfolios" && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow">🎨 <strong>Emma Rivera's AI Moodboard Generator</strong> – 54 Cheers</div>
                <div className="bg-white p-4 rounded-xl shadow">🎧 <strong>Andre Silva's Synthesia-powered interview series</strong> – Highly shared</div>
              </div>
            )}

            {trendingTab === "industries" && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow">🎯 <strong>Go-to-Market (GTM)</strong> – 2.8x AI adoption rate</div>
                <div className="bg-white p-4 rounded-xl shadow">📊 <strong>Product Management</strong> – 2.5x increase in AI tool usage</div>
              </div>
            )}

            {trendingTab === "professions" && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow">📱 <strong>Digital Marketers</strong> – 3.2x AI tool engagement</div>
                <div className="bg-white p-4 rounded-xl shadow">💼 <strong>Account Executives</strong> – 2.9x growth in AI usage</div>
              </div>
            )}

            {trendingTab === "companies" && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow">🏢 <strong>Notion</strong> – 2,450 AI users tracking their usage</div>
                <div className="bg-white p-4 rounded-xl shadow">🏢 <strong>HubSpot</strong> – 1,892 AI users tracking their usage</div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
