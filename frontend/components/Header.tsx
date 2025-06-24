import ProfileSummary from './ProfileSummary';
import BaseballCard from './BaseballCard';
import { Bell } from 'lucide-react';

export default function Header({
  name,
  location,
  joinDate,
  avatarUrl,
  onEditProfile,
  onEditField,
}: {
  name?: string;
  location?: string;
  joinDate?: string;
  avatarUrl?: string;
  onEditProfile?: () => void;
  onEditField?: (field: 'industry' | 'profession' | 'company') => void;
}) {
  return (
    <div className="relative flex items-start border-b pb-6 mb-6 w-full h-[220px]">
      {/* Left: Profile Summary (1/3), vertically centered */}
      <div className="w-1/3 min-w-[320px] flex items-center h-full">
        <ProfileSummary
          name={name}
          location={location}
          joinDate={joinDate}
          avatarUrl={avatarUrl}
          onEdit={onEditProfile}
        />
      </div>
      {/* Center/Right: Baseball Card (2/3) */}
      <div className="w-2/3 flex justify-start">
        <BaseballCard onEditField={onEditField} />
      </div>
      {/* Right: Notifications Icon - absolutely positioned */}
      <div className="absolute right-0 top-0 flex items-start justify-end w-24" style={{ top: 0 }}>
        <div className="bg-white rounded-full shadow p-2 flex items-center justify-center">
          <Bell className="h-5 w-5 text-gray-700" />
        </div>
      </div>
    </div>
  );
} 