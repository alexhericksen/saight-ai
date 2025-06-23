import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Pencil } from "lucide-react";
import { ShareDropdown } from "@/components/ui/share-dropdown";

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
    <div className="flex items-center space-x-6 w-1/3 min-w-[320px]">
      <div className="relative">
        <img src={avatarUrl} className="h-32 w-32 rounded-full border-2 border-white shadow-lg transform rotate-1" alt="Profile" />
        <div className="absolute inset-0 rounded-full border-2 border-gray-200/50 transform -rotate-1"></div>
        <span className="absolute -bottom-2 right-0 bg-white border border-gray-200 rounded-full px-2 py-0.5 text-xs text-gray-400 font-semibold shadow-md">Pro</span>
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-2xl font-semibold">{name}</h1>
        <div className="flex items-center space-x-1">
          <p className="text-xs text-gray-700">📍 {location}</p>
          <button 
            onClick={onEdit}
            className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Pencil className="h-2.5 w-2.5 text-gray-500" />
          </button>
        </div>
        <p className="text-xs text-gray-700">🎂 joined {joinDate}</p>
        <div className="flex items-center space-x-3 mt-2">
          <div className="flex flex-col items-center">
            <ToggleSwitch checked={true} onChange={() => {}} label="public" />
          </div>
          <ShareDropdown 
            onCopyUrl={() => {
              navigator.clipboard.writeText(window.location.href);
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
  );
} 