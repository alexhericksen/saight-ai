'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Pencil, Home, User, Globe, Settings, Gift, Bell, Plus, BarChart2, Building, Trash2 } from "lucide-react";
import { TrackToolDialog } from "@/components/ui/track-tool-dialog";
import { SettingsDialog } from "@/components/settings-dialog";
import { ShareDropdown } from "@/components/ui/share-dropdown";
import { type Tool, getUserTools, removeTool, getAvailableTools } from '@/lib/tools';
import { fetchRecentSessions, groupSessionsByToolAndWindow, fetchTotalUsageDuration } from '@/lib/utils';
import BaseballCard from '@/components/BaseballCard';
import Header from '@/components/Header';
import ToolLogo from '@/components/ToolLogo';
import { useUser } from '@/lib/useUser';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';
import { getToolDisplayName } from '@/lib/tool-logos';

export default function MyProfile() {
  const user = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("history");
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
  const [groupedSessions, setGroupedSessions] = useState<any[]>([]);
  const [totalUsageSeconds, setTotalUsageSeconds] = useState(0);
  const [userTools, setUserTools] = useState<Tool[]>([]);
  const [availableTools, setAvailableTools] = useState<Tool[]>([]);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (user === undefined) return; // Still loading
    if (user === null) {
      router.replace('/login');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchSessions = async () => {
      const sessions = await fetchRecentSessions();
      const grouped = groupSessionsByToolAndWindow(sessions, 60);
      setGroupedSessions(grouped);
    };
    fetchSessions();

    const fetchTotal = async () => {
      const total = await fetchTotalUsageDuration();
      setTotalUsageSeconds(total);
    };
    fetchTotal();

    const fetchTools = async () => {
      const tools = await getUserTools();
      setUserTools(tools);
    };
    fetchTools();

    const fetchAvailableTools = async () => {
      const tools = await getAvailableTools();
      setAvailableTools(tools);
    };
    fetchAvailableTools();
  }, []);

  const handleToggleTracking = async (tool: Tool) => {
    const isTracked = userTools.some(userTool => userTool.id === tool.id);
    if (isTracked) {
      const success = await removeTool(tool.id);
      if (success) {
        setUserTools(userTools.filter(userTool => userTool.id !== tool.id));
      }
    } else {
      // You may want to use addTool here if you want to support toggling on
      // For now, just refresh tools
      const tools = await getUserTools();
      setUserTools(tools);
    }
  };

  const handleRemoveTool = async (tool: Tool) => {
    const success = await removeTool(tool.id);
    if (success) {
      setUserTools(userTools.filter(userTool => userTool.id !== tool.id));
    }
  };

  if (user === undefined) return null; // Or a loading spinner
  if (!user) return null;

  // Use Google profile info if available, otherwise fallback
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email || "User";
  const googleAvatar = user.user_metadata?.avatar_url || "/profile.png";
  const avatarUrl = customAvatar || googleAvatar;

  // Handler for custom avatar upload with persistence
  const handleAvatarChange = async (newAvatarUrl: string) => {
    setCustomAvatar(newAvatarUrl);
    // Persist to Supabase user_metadata
    const { error } = await supabase.auth.updateUser({
      data: { avatar_url: newAvatarUrl }
    });
    if (error) {
      // Optionally show an error message
      console.error('Failed to update avatar in user_metadata:', error.message);
    }
    // Optionally, refresh user state if needed
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onTrackNew={() => setIsTrackToolOpen(true)} onSettings={() => { setIsSettingsOpen(true); setSettingsTab("account"); }} />
      <main className="flex-1 p-6 bg-gray-100 text-black">
        {/* Header Section */}
        <Header
          name={displayName}
          location="Lehi, Utah"
          joinDate="May 2025"
          avatarUrl={avatarUrl}
          onEditProfile={() => { setIsSettingsOpen(true); setSettingsTab("account"); }}
          onEditField={(field) => {
            setIsSettingsOpen(true);
            setSettingsTab("industry");
          }}
        />
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
                        <th className="pb-2 text-left">🗓️ Date</th>
                        <th className="pb-2 text-center">🛠️ Tool Name</th>
                        <th className="pb-2 text-center">⏰ Duration</th>
                        <th className="pb-2 text-center">🏷️ Use Category</th>
                        <th className="pb-2 text-center">🏷️🏷️ Use Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedSessions.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-4 text-gray-400">No usage history found.</td></tr>
                      )}
                      {groupedSessions.map((group, idx) => (
                        <tr className="border-t" key={idx}>
                          <td className="py-2 text-left">{new Date(group.start).toLocaleDateString()}</td>
                          <td className="py-2 text-center">{getToolDisplayName(group.tool)}</td>
                          <td className="py-2 text-center">{formatDuration(group.totalDuration)}</td>
                          <td className="py-2 text-center">{group.sessions[0]?.tag_category || '-'}</td>
                          <td className="py-2 text-center">{group.sessions[0]?.tag_detail || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {historyView === "tools" && (
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-semibold">🛠️ My Tracked Tools</h2>
                    <Button 
                      onClick={() => setIsTrackToolOpen(true)}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Track New</span>
                    </Button>
                    <span className="text-sm text-gray-500 ml-2">({availableTools.length} tools available)</span>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="pb-2 text-left w-10"></th>
                        <th className="pb-2 text-left w-28 min-w-[90px]">🛠️ Tool Name</th>
                        <th className="pb-2 text-center w-24 min-w-[80px]">🌐 Domain</th>
                        <th className="pb-2 text-center w-24 min-w-[72px]">📊 Tracking Status</th>
                        <th className="pb-2 text-center w-16">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableTools.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-2 text-gray-400">No tools available. Add some tools to get started!</td></tr>
                      )}
                      {availableTools.map((tool, idx) => {
                        const isTracked = userTools.some(userTool => userTool.id === tool.id);
                        return (
                          <tr key={tool.id} className="border-t">
                            <td className="py-2 text-left">
                              <ToolLogo domain={tool.domain} name={tool.name} size="md" />
                            </td>
                            <td className="py-2 text-left font-medium">{tool.name}</td>
                            <td className="py-2 text-center text-gray-600">{tool.domain}</td>
                            <td className="py-2 text-center">
                              <ToggleSwitch
                                checked={isTracked}
                                onChange={() => handleToggleTracking(tool)}
                              />
                            </td>
                            <td className="py-2 text-center">
                              <button
                                onClick={() => handleRemoveTool(tool)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                title="Remove tool"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
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
          // Refresh both user tools and available tools
          const fetchTools = async () => {
            const [userToolsData, availableToolsData] = await Promise.all([
              getUserTools(),
              getAvailableTools()
            ]);
            setUserTools(userToolsData);
            setAvailableTools(availableToolsData);
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

// Helper to format seconds as h m s
function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [
    h > 0 ? `${h}h` : null,
    m > 0 ? `${m}m` : null,
    s > 0 || (h === 0 && m === 0) ? `${s}s` : null,
  ]
    .filter(Boolean)
    .join(' ');
}

