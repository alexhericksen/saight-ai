'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Home, User, Globe, Settings, Gift } from "lucide-react";

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [timeToday] = useState("2h 15m");
  const [topToolsToday] = useState([
    { tool: "ChatGPT", duration: "1h 30m" },
    { tool: "Claude", duration: "45m" }
  ]);
  const [topTagsToday] = useState([
    { tag: "Writing", duration: "1h 15m" },
    { tag: "Research", duration: "1h" }
  ]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-52 bg-white text-black border-r p-6 flex flex-col justify-between">
        <div>
          {/* Main Menu Items */}
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
        <div className="relative flex items-start border-b pb-6 mb-6">
          {/* Left: Profile Info */}
          <div className="flex items-center space-x-6 w-1/3 min-w-[320px]">
            <div className="relative">
              <img src="/profile.png" className="h-32 w-32 rounded-full border-2 border-white shadow-lg transform rotate-1" alt="Profile" />
              <div className="absolute inset-0 rounded-full border-2 border-gray-200/50 transform -rotate-1"></div>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-semibold">Alex Ericksen</h1>
              <p className="text-xs text-gray-700">📍 Lehi, Utah</p>
              <p className="text-xs text-gray-700">🎂 joined May 2025</p>
              <Button variant="default" size="sm" className="mt-2 w-fit px-7 py-0.5">Share</Button>
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
                    <span>🎓 Discipline</span>
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
              {/* Scorecard Section - moved above AI Portfolio */}
              <div className="bg-white p-6 rounded-xl shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">💯 Scorecard</h2>
                  <span className="text-sm text-gray-500 ml-4">Global ranking: #1 overall</span>
                </div>
                <div className="grid grid-cols-2 grid-rows-2 gap-4">
                  {/* Top Tools */}
                  <div className="bg-gray-50 rounded-lg p-4 flex flex-col">
                    <h3 className="text-sm font-semibold mb-2">🛠️ Top Tools</h3>
                    <div className="flex-1 flex items-center justify-center text-gray-400">chart placeholder</div>
                  </div>
                  {/* Top Uses */}
                  <div className="bg-gray-50 rounded-lg p-4 flex flex-col">
                    <h3 className="text-sm font-semibold mb-2">🏷️ Top Uses</h3>
                    <div className="flex-1 flex items-center justify-center text-gray-400">chart placeholder</div>
                  </div>
                  {/* Industry Benchmarks */}
                  <div className="bg-gray-50 rounded-lg p-4 flex flex-col">
                    <h3 className="text-sm font-semibold mb-2">Industry Benchmarks:</h3>
                    <ul className="list-disc ml-4 text-sm text-gray-600 space-y-1">
                      <li>Use at least 2 AI tools per week</li>
                      <li>Log 5+ hours in creation tools</li>
                      <li>Share 1 project per month</li>
                    </ul>
                  </div>
                  {/* Suggestions */}
                  <div className="bg-gray-50 rounded-lg p-4 flex flex-col">
                    <h3 className="text-sm font-semibold mb-2">Suggestions:</h3>
                    <ul className="list-disc ml-4 text-sm text-gray-600 space-y-1">
                      <li>Try Synthesia for video generation</li>
                      <li>Experiment with Midjourney for images</li>
                      <li>Explore new research use cases</li>
                    </ul>
                  </div>
                </div>
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
