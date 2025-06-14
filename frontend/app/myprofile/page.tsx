'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Pencil, Home, User, Globe, Settings, Gift, Bell, Plus, BarChart2, Building } from "lucide-react";
import { TrackToolDialog } from "@/components/ui/track-tool-dialog";
import { SettingsDialog } from "@/components/settings-dialog";
import { ShareDropdown } from "@/components/ui/share-dropdown";
import { type Tool, getUserTools, removeTool } from '@/lib/tools';

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
  const [isTrackToolOpen, setIsTrackToolOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"account" | "billing" | "industry">("account");
  const [historyView, setHistoryView] = useState<"usage" | "tools" | "import">("usage");
  const [trackedTools, setTrackedTools] = useState<Tool[]>([]);
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchTools = async () => {
      const tools = await getUserTools();
      setTrackedTools(tools);
    };
    fetchTools();
  }, []);

  const handleRemoveTool = async () => {
    const toolIds = Array.from(selectedTools);
    if (toolIds.length === 0) return;

    const success = await Promise.all(toolIds.map(id => removeTool(id)));
    if (success.every(Boolean)) {
      setTrackedTools(trackedTools.filter(tool => !selectedTools.has(tool.id)));
      setSelectedTools(new Set());
    }
  };

  const toggleToolSelection = (toolId: string) => {
    const newSelection = new Set(selectedTools);
    if (newSelection.has(toolId)) {
      newSelection.delete(toolId);
    } else {
      newSelection.add(toolId);
    }
    setSelectedTools(newSelection);
  };

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
          {/* Centered section for Track New only */}
          <div className="flex flex-col items-center mt-16 mb-8">
            <button 
              onClick={() => setIsTrackToolOpen(true)}
              className="flex items-center justify-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors w-full"
            >
              <div className="w-5 flex justify-center">
                <Plus className="h-5 w-5" />
              </div>
              <span>Track New</span>
            </button>
          </div>
        </div>
        <div className="space-y-4 flex items-center flex-col">
          <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => { setIsSettingsOpen(true); setSettingsTab("account"); }}>
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
              <span className="absolute -bottom-2 right-0 bg-white border border-gray-200 rounded-full px-2 py-0.5 text-xs text-gray-400 font-semibold shadow-md">Pro</span>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-semibold">Alex Ericksen</h1>
              <div className="flex items-center space-x-1">
                <p className="text-xs text-gray-700">📍 Lehi, Utah</p>
                <button 
                  onClick={() => { setIsSettingsOpen(true); setSettingsTab("account"); }}
                  className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <Pencil className="h-2.5 w-2.5 text-gray-500" />
                </button>
              </div>
              <p className="text-xs text-gray-700">🎂 joined May 2025</p>
              <div className="flex items-center space-x-3 mt-2">
                <div className="flex flex-col items-center">
                  <ToggleSwitch checked={true} onChange={() => {}} label="public" />
                </div>
                <ShareDropdown 
                  onCopyUrl={() => {
                    navigator.clipboard.writeText(window.location.href);
                    // You might want to add a toast notification here
                  }}
                  onGeneratePdf={() => {
                    // Implement PDF generation
                    console.log("Generate PDF");
                  }}
                  onShareLinkedIn={() => {
                    // Implement LinkedIn sharing
                    console.log("Share to LinkedIn");
                  }}
                />
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
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold">AI tech</span>
                      <button 
                        onClick={() => { setIsSettingsOpen(true); setSettingsTab("industry"); }}
                        className="p-0.5 hover:bg-gray-200 rounded-full transition-colors ml-1"
                      >
                        <Pencil className="h-2.5 w-2.5 text-gray-500" />
                      </button>
                    </div>
                    <span className="text-[10px] text-gray-500">#1 overall</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 flex justify-between items-center text-xs">
                    <span>💻 Profession</span>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold">Product Management</span>
                      <button 
                        onClick={() => { setIsSettingsOpen(true); setSettingsTab("industry"); }}
                        className="p-0.5 hover:bg-gray-200 rounded-full transition-colors ml-1"
                      >
                        <Pencil className="h-2.5 w-2.5 text-gray-500" />
                      </button>
                    </div>
                    <span className="text-[10px] text-gray-500">#1 overall</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 flex justify-between items-center text-xs">
                    <span>💰 Company</span>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold">Saight.ai</span>
                      <button 
                        onClick={() => { setIsSettingsOpen(true); setSettingsTab("industry"); }}
                        className="p-0.5 hover:bg-gray-200 rounded-full transition-colors ml-1"
                      >
                        <Pencil className="h-2.5 w-2.5 text-gray-500" />
                      </button>
                    </div>
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

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <Button variant={activeTab === "history" ? "default" : "outline"} onClick={() => setActiveTab("history")}>AI Usage</Button>
          <Button variant={activeTab === "profile" ? "default" : "outline"} onClick={() => setActiveTab("profile")}>AI Scorecard</Button>
          <Button variant={activeTab === "portfolio" ? "default" : "outline"} onClick={() => setActiveTab("portfolio")}>AI Portfolio</Button>
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
                <div className="grid grid-cols-2 grid-rows-3 gap-4">
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
                  <div className="bg-gray-50 rounded-lg p-4 flex flex-col relative">
                    <ProSticker>Pro</ProSticker>
                    <h3 className="text-sm font-semibold mb-2">Industry Benchmarks</h3>
                    <p className="text-xs text-gray-400 mb-1">Become a top AI user in your field</p>
                    <ul className="list-disc ml-4 text-sm text-gray-600 space-y-1">
                      <li>Use at least 2 AI tools per week</li>
                      <li>Log 5+ hours in creation tools</li>
                      <li>Share 1 project per month</li>
                    </ul>
                  </div>
                  {/* Suggestions */}
                  <div className="bg-gray-50 rounded-lg p-4 flex flex-col relative">
                    <ProSticker>Pro</ProSticker>
                    <h3 className="text-sm font-semibold mb-2">Usage Suggestions</h3>
                    <p className="text-xs text-gray-400 mb-1">AI-powered tool & use suggestions based on your activity</p>
                    <ul className="list-disc ml-4 text-sm text-gray-600 space-y-1">
                      <li>Try Synthesia for video generation</li>
                      <li>Experiment with Midjourney for images</li>
                      <li>Explore new research use cases</li>
                    </ul>
                  </div>
                  {/* Job Matches */}
                  <div className="bg-gray-50 rounded-lg p-4 flex flex-col relative">
                    <ProSticker>Pro</ProSticker>
                    <h3 className="text-sm font-semibold mb-2">Job Matches</h3>
                    <p className="text-xs text-gray-400 mb-1">AI-powered internal and external job matches based on your activity</p>
                    <ul className="list-disc ml-4 text-sm text-gray-600 space-y-1">
                      <li>AI Product Manager at OpenAI</li>
                      <li>Machine Learning Lead at Google</li>
                      <li>AI Solutions Architect at Microsoft</li>
                    </ul>
                  </div>
                  {/* Recruiter Requests */}
                  <div className="bg-gray-50 rounded-lg p-4 flex flex-col relative">
                    <ProSticker>Pro</ProSticker>
                    <h3 className="text-sm font-semibold mb-2">Recruiter Requests</h3>
                    <p className="text-xs text-gray-400 mb-1">Recruiters interested in connecting</p>
                    <ul className="list-disc ml-4 text-sm text-gray-600 space-y-1">
                      <li>Jane Doe (OpenAI) - Interested in your profile</li>
                      <li>John Smith (Google) - Wants to connect</li>
                      <li>Emily Lee (Microsoft) - Sent a message</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "portfolio" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">💼 AI Portfolio</h2>
              <div className="grid grid-cols-2 grid-rows-2 gap-4">
                {/* Projects */}
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col relative">
                  <ProSticker>unlimited with Pro</ProSticker>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold">Projects</h3>
                    <Button variant='outline' size='sm' className='px-2 py-0.5 text-xs'>+ upload</Button>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Showcase things you've built with AI</p>
                  <ul className="list-disc ml-4 text-sm text-gray-600 space-y-1">
                    <li>AI-powered Resume Builder</li>
                    <li>Chatbot for Customer Support</li>
                    <li>Automated Market Research Tool</li>
                  </ul>
                </div>
                {/* Tutorials */}
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col relative">
                  <ProSticker>unlimited with Pro</ProSticker>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold">Tutorials</h3>
                    <Button variant='outline' size='sm' className='px-2 py-0.5 text-xs'>+ upload</Button>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Show the world how you use AI</p>
                  <ul className="list-disc ml-4 text-sm text-blue-600 space-y-1">
                    <li><a href="#" className="hover:underline">How to automate emails with GPT-4</a></li>
                    <li><a href="#" className="hover:underline">Prompt engineering for beginners</a></li>
                    <li><a href="#" className="hover:underline">Building a custom AI assistant</a></li>
                  </ul>
                </div>
                {/* Offer Services */}
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col relative">
                  <ProSticker>Pro</ProSticker>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold">Offer Services</h3>
                    <Button variant='outline' size='sm' className='px-2 py-0.5 text-xs'>+ add</Button>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Offer Coaching or Consulting services</p>
                  <ul className="list-disc ml-4 text-sm text-gray-600 space-y-1">
                    <li>1:1 AI career coaching</li>
                    <li>Custom AI tool consulting</li>
                    <li>Team AI training sessions</li>
                  </ul>
                </div>
                {/* Service Requests */}
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col relative">
                  <ProSticker>Pro</ProSticker>
                  <h3 className="text-sm font-semibold mb-2">Service Requests</h3>
                  <p className="text-xs text-gray-400 mb-1">Coaching or Consulting service requests</p>
                  <ul className="list-disc ml-4 text-sm text-gray-600 space-y-1">
                    <li>Sarah (Acme Corp) - Interested in coaching</li>
                    <li>Mike (Beta Inc) - Needs AI consulting</li>
                    <li>Lisa (Gamma LLC) - Wants a training session</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6">
              {/* Actions Card */}
              <div className="bg-white p-3 rounded-xl shadow flex items-center space-x-4 mb-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Actions:</span>
                <Button variant={historyView === "usage" ? "default" : "outline"} size="sm" onClick={() => setHistoryView("usage")}>View Usage History</Button>
                <Button variant={historyView === "tools" ? "default" : "outline"} size="sm" onClick={() => setHistoryView("tools")}>View Tracked Tools</Button>
                <div className="relative flex items-center justify-center">
                  <ProSticker>Pro</ProSticker>
                  <Button variant={historyView === "import" ? "default" : "outline"} size="sm" className="w-full flex justify-center items-center space-x-2" onClick={() => setHistoryView("import")}> <Plus className="h-4 w-4 mr-1" /> Import Usage </Button>
                </div>
              </div>
              {/* Conditional Views */}
              {historyView === "usage" && (
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-4 text-left">⏰ My Usage History</h2>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="pb-2 text-left">
                          <button type="button" className="hover:underline">🗓️ Date</button>
                        </th>
                        <th className="pb-2 text-center">
                          <button type="button" className="hover:underline w-full">🛠️ Tool Name</button>
                        </th>
                        <th className="pb-2 text-center">
                          <button type="button" className="hover:underline w-full">⏰ Duration</button>
                        </th>
                        <th className="pb-2 text-center">
                          <button type="button" className="hover:underline w-full">🏷️ Use Category</button>
                        </th>
                        <th className="pb-2 text-center">
                          <button type="button" className="hover:underline w-full">🏷️🏷️ Use Detail</button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="py-2 text-left">May 14</td>
                        <td className="py-2 text-center">ChatGPT</td>
                        <td className="py-2 text-center">47m</td>
                        <td className="py-2 flex justify-center items-center">
                          <span>Work</span>
                          <EditIcon />
                        </td>
                        <td className="py-2 flex justify-center items-center">
                          {/* Only one pencil in Use Category, none here for now */}
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-2 text-left">May 13</td>
                        <td className="py-2 text-center">Perplexity</td>
                        <td className="py-2 text-center">1h 20m</td>
                        <td className="py-2 flex justify-center items-center">
                          <span>Work</span>
                          <EditIcon />
                        </td>
                        <td className="py-2 flex justify-center items-center">
                          {/* Only one pencil in Use Category, none here for now */}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {historyView === "tools" && (
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-xl font-semibold">🛠️ My Tracked Tools</h2>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsTrackToolOpen(true)}>+ Track New</Button>
                      <Button 
                        size="sm" 
                        onClick={handleRemoveTool}
                        disabled={selectedTools.size === 0}
                        className="bg-red-700 hover:bg-red-800 text-white border border-red-800 shadow"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="pb-2 text-left">🌐 Tool Domain</th>
                        <th className="pb-2 text-center">🛠️ Tool Name</th>
                        <th className="pb-2 text-center">🏷️ Use Category</th>
                        <th className="pb-2 text-center">🏷️🏷️ Use Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trackedTools.map((tool) => (
                        <tr 
                          key={tool.id} 
                          className={`border-t cursor-pointer hover:bg-gray-50 ${selectedTools.has(tool.id) ? 'bg-gray-50' : ''}`}
                          onClick={() => toggleToolSelection(tool.id)}
                        >
                          <td className="py-2 text-left">{tool.domain}</td>
                          <td className="py-2 text-center">{tool.name}</td>
                          <td className="py-2 text-center">{tool.category || '-'}</td>
                          <td className="py-2 text-center">{tool.detail || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {historyView === "import" && (
                <div className="bg-white p-6 rounded-xl shadow">
                  <h2 className="text-xl font-semibold mb-4 text-left">📥 Import Usage (Pro)</h2>
                  <p className="text-gray-500">Import your usage data from other platforms. (Coming soon)</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <TrackToolDialog 
        open={isTrackToolOpen} 
        onOpenChange={setIsTrackToolOpen}
        onToolAdded={() => {
          // Refresh the tracked tools list
          const fetchTools = async () => {
            const tools = await getUserTools();
            setTrackedTools(tools);
          };
          fetchTools();
        }}
      />
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        initialTab={settingsTab}
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
// Helper sticker badge component
const ProSticker = ({ children }: { children: React.ReactNode }) => (
  <span className="absolute -top-3 -left-3 bg-white border border-gray-200 rounded-full px-2 py-0.5 text-xs text-gray-400 font-semibold shadow-md z-10 select-none" style={{letterSpacing: '0.01em'}}>{children}</span>
);

// Edit icon component for table cells
const EditIcon = () => (
  <Pencil className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-pointer ml-1" />
);

