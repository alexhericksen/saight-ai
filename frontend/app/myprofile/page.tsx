'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Pencil, Home, User, Globe, Settings, Gift, Bell, Plus, BarChart2, Building } from "lucide-react";
import { TrackToolDialog } from "@/components/ui/track-tool-dialog";
import { SettingsDialog } from "@/components/settings-dialog";
import { ShareDropdown } from "@/components/ui/share-dropdown";
import { type Tool, getUserTools, removeTool, getAvailableTools } from '@/lib/tools';
import { fetchRecentSessions, groupSessionsByToolAndWindow, fetchTotalUsageDuration } from '@/lib/utils';
import BaseballCard from '@/components/BaseballCard';
import Header from '@/components/Header';

export default function MyProfile() {
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
        <Header
          name="Alex Ericksen"
          location="Lehi, Utah"
          joinDate="May 2025"
          avatarUrl="/profile.png"
          onEditProfile={() => { setIsSettingsOpen(true); setSettingsTab("account"); }}
          onEditField={(field) => {
            setIsSettingsOpen(true);
            setSettingsTab("industry"); // Or use field to set the correct tab
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
                          <td className="py-2 text-center">{group.tool}</td>
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
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-xl font-semibold">🛠️ My Tracked Tools</h2>
                    <span className="text-sm text-gray-500">({availableTools.length} tools available)</span>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="pb-2 text-left">🖼️ Logo</th>
                        <th className="pb-2 text-left">🛠️ Tool Name</th>
                        <th className="pb-2 text-center">🌐 Domain</th>
                        <th className="pb-2 text-center">📊 Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableTools.length === 0 && (
                        <tr><td colSpan={4} className="text-center py-4 text-gray-400">No tools available. Add some tools to get started!</td></tr>
                      )}
                      {availableTools.map((tool, idx) => {
                        const isTracked = userTools.some(userTool => userTool.id === tool.id);
                        return (
                          <tr key={tool.id} className="border-t">
                            <td className="py-3 text-left">
                              <img
                                src={tool.logo_url || `/logos/${tool.domain.replace(/\./g, '_')}.png`}
                                alt={tool.name}
                                className="h-8 w-8 rounded-sm object-contain"
                                onError={(e) => {
                                  // Fallback to default logo if image fails to load
                                  e.currentTarget.src = "/logos/default-ai.png";
                                }}
                              />
                            </td>
                            <td className="py-3 text-left font-medium">{tool.name}</td>
                            <td className="py-3 text-center text-gray-600">{tool.domain}</td>
                            <td className="py-3 text-center">
                              {isTracked ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  ✅ Tracked
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  ⏸️ Not Tracked
                                </span>
                              )}
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

