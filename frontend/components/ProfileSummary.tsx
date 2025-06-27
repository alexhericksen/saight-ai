import { useState } from "react";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Pencil } from "lucide-react";
import { ShareDropdown } from "@/components/ui/share-dropdown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  onAvatarChange,
}: {
  name?: string;
  location?: string;
  joinDate?: string;
  avatarUrl?: string;
  onEdit?: () => void;
  onAvatarChange?: (url: string) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await (await import("@/lib/supabase")).supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      // Get public URL
      const { data: publicUrlData } = await (await import("@/lib/supabase")).supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      onAvatarChange && onAvatarChange(publicUrlData.publicUrl);
      setDialogOpen(false);
      setFile(null);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-6 w-1/3 min-w-[320px]">
      {/* Profile Image with Pro badge */}
      <div className="relative cursor-pointer" onClick={() => setDialogOpen(true)}>
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
      {/* Avatar Upload Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Profile Image</DialogTitle>
          </DialogHeader>
          <label
            htmlFor="avatar-upload-input"
            className="mb-4 block text-center cursor-pointer px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
            style={{ width: '100%' }}
          >
            Choose file
            <input
              id="avatar-upload-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {file && <div className="text-xs text-gray-600 mb-2 text-center">{file.name}</div>}
          {error && <div className="text-red-500 text-xs mb-2 text-center">{error}</div>}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={uploading} onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
            </DialogClose>
            <Button variant="outline" onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 