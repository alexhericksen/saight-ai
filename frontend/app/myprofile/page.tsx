'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Home, User, Globe, Settings, Gift } from "lucide-react";

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-52 bg-white text-black border-r p-6 flex flex-col justify-between">
        <div className="space-y-4 flex items-center flex-col pt-8">
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
        {/* Header Section */}
        <div className="flex justify-center items-center border-b pb-6 mb-6">
          <div className="flex items-center space-x-6 w-1/3 min-w-[320px]">
            <div className="relative">
              <img src="/profile.png" className="h-32 w-32 rounded-full border-2 border-white shadow-lg transform rotate-1" alt="Profile" />
              <div className="absolute inset-0 rounded-full border-2 border-gray-200/50 transform -rotate-1"></div>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-semibold">Alex Ericksen</h1>
              <p className="text-xs text-gray-700">📍 Lehi, Utah</p>
              <p className="text-xs text-gray-700">🎂 joined May 2025</p>
              <Button variant="default" size="sm" className="mt-2 w-fit px-3 py-1.5">Share</Button>
            </div>
          </div>
          <div className="w-2/3 flex justify-start">
            <div className="bg-white rounded-xl shadow p-4 w-full max-w-2xl text-sm">
              <div className="text-center text-xs font-medium m-0 p-0 leading-tight">⚾️ Baseball Card ⚾️</div>
              <div className="grid grid-cols-2 gap-2">
                {/* Triple Crown */}
                <div>
                  <div className="text-center text-sm font-bold mb-0.5">👑 Triple Crown 👑</div>
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-center text-xs">
                      <span>⏰ All-time usage</span>
                      <span className="font-semibold">41h 36m</span>
                      <span className="text-[10px] text-gray-500">#1 overall</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>🛠️ Avg Daily Tools Used</span>
                      <span className="font-semibold">6 tools</span>
                      <span className="text-[10px] text-gray-500">#1 overall</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>📈 Expertise</span>
                      <span className="font-semibold">6 contributions</span>
                      <span className="text-[10px] text-gray-500">#1 overall</span>
                    </div>
                  </div>
                </div>
                {/* Industry */}
                <div>
                  <div className="text-center text-sm font-bold mb-0.5">🏢 Industry 🏢</div>
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-center text-xs">
                      <span>🎓 Discipline</span>
                      <span className="font-semibold">AI tech</span>
                      <span className="text-[10px] text-gray-500">#1 overall</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>💻 Profession</span>
                      <span className="font-semibold">Product Management</span>
                      <span className="text-[10px] text-gray-500">#1 overall</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>💰 Company</span>
                      <span className="font-semibold">Saight.ai</span>
                      <span className="text-[10px] text-gray-500">#1 overall</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <Button variant={activeTab === "profile" ? "default" : "outline"} onClick={() => setActiveTab("profile")}>My Profile</Button>
          <Button variant={activeTab === "history" ? "default" : "outline"} onClick={() => setActiveTab("history")}>Usage History</Button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "profile" && (
            <div className="space-y-8">
              {/* Snapshot Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-xl shadow">🛠️ Top Tools (chart placeholder)</div>
                <div className="bg-white p-4 rounded-xl shadow">🏷️ Top Uses (chart placeholder)</div>
              </div>

              {/* AI Portfolio Section */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-2">💼 AI Portfolio</h2>
                <p className="text-sm text-gray-500 mb-4">Upload links, files, and media showcasing your AI work.</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline">Upload</Button>
                  <Button variant="outline">Sell Services</Button>
                  <Button variant="outline">Requests</Button>
                </div>
              </div>

              {/* Scorecard Section */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-2">💯 Scorecard (Private/Public Toggle)</h2>
                <ul className="list-disc ml-6 text-sm space-y-1">
                  <li>Global Rank: Top 12%</li>
                  <li>Top Uses: Writing, Research</li>
                  <li>Top Tools: ChatGPT, Claude, Perplexity</li>
                  <li>Industry Benchmarks to work on: Increase time in creation tools like Midjourney or Synthesia</li>
                  <li>Suggestions: Try Synthesia for video generation</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6">
              {/* Buttons */}
              <div className="flex space-x-4">
                <Button variant="outline">Tag Settings</Button>
                <Button variant="outline">Add AI Tools</Button>
                <Button variant="outline">Import Usage</Button>
              </div>

              {/* History Table Placeholder */}
              <div className="bg-white p-6 rounded-xl shadow">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-semibold">⏰ My Usage History</h2>
                  <Button variant="outline" size="sm">Filter</Button>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Tool</th>
                      <th className="pb-2">Duration</th>
                      <th className="pb-2">Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="py-2">May 14</td>
                      <td className="py-2">ChatGPT</td>
                      <td className="py-2">47m</td>
                      <td className="py-2"><Button variant="link">Add Tag</Button></td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-2">May 13</td>
                      <td className="py-2">Perplexity</td>
                      <td className="py-2">1h 20m</td>
                      <td className="py-2"><Button variant="link">Add Tag</Button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
