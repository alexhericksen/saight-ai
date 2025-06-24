import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Pencil } from "lucide-react";
import { ShareDropdown } from "@/components/ui/share-dropdown";

// Consistent Pro badge styling
const ProSticker = ({ children }: { children: React.ReactNode }) => (
  <span
    className="flex items-center justify-center absolute bg-white border border-gray-200 rounded-full px-2 py-0.5 text-xs text-gray-400 font-semibold shadow-md z-10 select-none"
    style={{ bottom: '0', right: '0.5rem', letterSpacing: '0.01em' }}
  >
    {children}
  </span>
);

export default function ProfileSummary({
  name = "Alex Ericksen",
  location = "Lehi, Utah",
  joinDate = "May 2025",
  avatarUrl = "/profile.png",
  onEdit,
}: {
  name?: string;
  location?: string;
  joinDate?: string;
  avatarUrl?: string;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-center gap-6 w-1/3 min-w-[320px]">
      {/* Profile Image with Pro badge */}
      <div className="relative">
        <img
          src={avatarUrl}
          className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover"
          alt="Profile"
        />
        {/* ProSticker floating over lower right */}
        <ProSticker>Pro</ProSticker>
      </div>
      {/* Profile Info */}
      <div className="flex flex-col justify-center flex-1">
        <h1 className="text-2xl font-bold text-black leading-tight mb-1" style={{fontSize: '1.5rem'}}>{name}</h1>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-gray-500" style={{fontSize: '0.8rem'}}>📍 {location}</span>
          <button
            onClick={onEdit}
            className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Edit location"
          >
            <Pencil className="h-3 w-3 text-gray-500" />
          </button>
        </div>
        <div className="text-xs text-gray-500 mb-3" style={{fontSize: '0.8rem'}}>🎂 joined {joinDate}</div>
        <div className="flex items-center gap-3">
          {/* Public toggle and label */}
          <div className="flex flex-col items-center">
            <ToggleSwitch checked={true} onChange={() => {}} label="" />
            <span className="text-xs text-gray-400 mt-1">public</span>
          </div>
          {/* Share button styled as in screenshot */}
          <button
            className="bg-black text-white text-base font-semibold rounded-xl px-6 py-1.5 ml-2 shadow hover:bg-gray-900 transition-colors"
            style={{minWidth: '90px', fontSize: '1rem'}}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
} 