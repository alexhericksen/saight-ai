import { useState, useEffect } from "react";
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
  // Check for localStorage fallback avatar
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  
  useEffect(() => {
    const storedAvatar = localStorage.getItem('saight-custom-avatar');
    if (storedAvatar) {
      setLocalAvatar(storedAvatar);
    }
  }, []);
  
  // Use local avatar as fallback if available
  const displayAvatarUrl = localAvatar || avatarUrl;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (selectedFile.size > maxSize) {
        setError(`File too large. Please select an image smaller than 5MB. Current size: ${(selectedFile.size / 1024 / 1024).toFixed(1)}MB`);
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      // Create a canvas to resize image while maintaining quality
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      const resizePromise = new Promise<string>((resolve, reject) => {
        img.onload = () => {
          // Set canvas size to a good resolution for profile pictures
          const maxSize = 400; // Good balance between quality and size
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Use high-quality rendering
          ctx!.imageSmoothingEnabled = true;
          ctx!.imageSmoothingQuality = 'high';
          
          // Draw the image
          ctx!.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with high quality
          const base64Data = canvas.toDataURL('image/jpeg', 0.95); // 95% quality
          resolve(base64Data);
        };
        img.onerror = reject;
      });
      
      // Load the file into the image
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      const base64Data = await resizePromise;
      
      // Store the image in user metadata instead of storage bucket
      try {
        console.log('🔄 Attempting to save avatar to Supabase...');
        const { data, error: updateError } = await (await import("@/lib/supabase")).supabase.auth.updateUser({
          data: { 
            avatar_url: base64Data,
            avatar_updated_at: new Date().toISOString()
          }
        });
        
        if (updateError) {
          console.error('❌ Supabase update error:', updateError);
          throw updateError;
        }
        
        console.log('✅ Avatar saved to Supabase user metadata:', data);
        
        // Also store in localStorage as backup
        try {
          localStorage.setItem('saight-custom-avatar', base64Data);
          console.log('✅ Also stored avatar in localStorage as backup');
        } catch (localErr) {
          console.error('LocalStorage backup failed:', localErr);
        }
        
      } catch (updateErr: any) {
        console.error('❌ Auth update failed:', updateErr);
        
        // Fallback: store in localStorage as backup
        try {
          localStorage.setItem('saight-custom-avatar', base64Data);
          console.log('✅ Stored avatar in localStorage as fallback');
        } catch (localErr) {
          console.error('LocalStorage fallback failed:', localErr);
        }
        
        // Don't throw the error - let the user continue with local storage
        console.log('⚠️ Using localStorage fallback due to Supabase error');
      }
      
      onAvatarChange && onAvatarChange(base64Data);
      setDialogOpen(false);
      setFile(null);
      console.log('✅ Avatar updated successfully');
      
      // Refresh user data to ensure avatar is immediately available
      try {
        const { data: { user } } = await (await import("@/lib/supabase")).supabase.auth.getUser();
        console.log('🔄 Refreshed user data:', user?.user_metadata);
      } catch (refreshErr) {
        console.log('⚠️ Could not refresh user data:', refreshErr);
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-6 w-1/3 min-w-[320px]">
      {/* Profile Image with Pro badge */}
      <div className="relative cursor-pointer" onClick={() => setDialogOpen(true)}>
        <img
          src={displayAvatarUrl}
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