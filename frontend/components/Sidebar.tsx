"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, User, Globe, Building, Settings, Gift, Plus, LogOut } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default function Sidebar({ onTrackNew, onSettings }: { onTrackNew: () => void; onSettings: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-52 bg-white text-black border-r p-6 flex flex-col justify-between">
      <div>
        {/* Main Menu Items */}
        <div className="space-y-4 flex items-center flex-col pt-6">
          <Link href="/dashboard" className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors ${isActive("/dashboard") ? "font-bold" : "font-normal"}`}>
            <div className="w-5 flex justify-center">
              <Home className="h-5 w-5" />
            </div>
            <span>Dashboard</span>
          </Link>
          <Link href="/myprofile" className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors ${isActive("/myprofile") ? "font-bold" : "font-normal"}`}>
            <div className="w-5 flex justify-center">
              <User className="h-5 w-5" />
            </div>
            <span>My Profile</span>
          </Link>
          <Link href="/explore" className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors ${isActive("/explore") ? "font-bold" : "font-normal"}`}>
            <div className="w-5 flex justify-center">
              <Globe className="h-5 w-5" />
            </div>
            <span>Explore</span>
          </Link>
          <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
            <div className="w-5 flex justify-center">
              <Building className="h-5 w-5" />
            </div>
            <span>My Org</span>
            <span className="absolute -bottom-2 -right-3 bg-white border border-gray-200 rounded-full px-2 py-0.5 text-xs text-gray-400 font-semibold shadow-md">Pro</span>
          </a>
        </div>
        {/* Centered section for Track New only */}
        <div className="flex flex-col items-center mt-24 mb-8">
          <button 
            onClick={onTrackNew}
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
        <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={onSettings}>
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
        <button
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.replace('/login');
          }}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors w-full justify-center"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">ai usage provided by</p>
          <img src="/logo.png" alt="Saight logo" className="h-7 w-auto mx-auto" />
        </div>
      </div>
    </aside>
  );
} 