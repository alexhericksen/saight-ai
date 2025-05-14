'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white text-black border-r p-6 flex flex-col justify-between">
        <div>
          <img src="/logo.png" alt="Saight logo" className="h-8 w-auto mb-6" />
          <nav className="space-y-4">
            <a href="#" className="block hover:text-[#021BF9]">Dashboard</a>
            <a href="#" className="block font-medium text-[#021BF9]">My Profile</a>
            <a href="#" className="block hover:text-[#021BF9]">Explore</a>
          </nav>
        </div>
        <div>
          <a href="#" className="text-sm text-gray-500 hover:text-black">Settings</a>
        </div>
      </aside>

      <main className="flex-1 p-6 bg-gray-100 text-black">
        {/* Header Section */}
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
          </div>
          <div className="text-right">
            <Button variant="default" className="px-4 py-2">Share</Button>
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
                <div className="bg-white p-4 rounded-xl shadow">Top Tools (chart placeholder)</div>
                <div className="bg-white p-4 rounded-xl shadow">Top Uses (chart placeholder)</div>
              </div>

              {/* AI Portfolio Section */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-2">AI Portfolio</h2>
                <p className="text-sm text-gray-500 mb-4">Upload links, files, and media showcasing your AI work.</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline">Upload</Button>
                  <Button variant="outline">Sell Services</Button>
                  <Button variant="outline">Requests</Button>
                </div>
              </div>

              {/* Scorecard Section */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-2">Scorecard (Private/Public Toggle)</h2>
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
                <h2 className="text-lg font-semibold mb-4">Your Session History</h2>
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
