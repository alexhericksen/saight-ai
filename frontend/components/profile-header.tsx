"use client";

import { useUser } from "@/hooks/useUser";
import { SettingsDialog } from "./settings-dialog";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "./ui/button";

export function ProfileHeader() {
  const { user } = useUser();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const location = user?.user_metadata?.city && user?.user_metadata?.state
    ? `${user.user_metadata.city}, ${user.user_metadata.state}`
    : "add location";

  const joinDate = user?.user_metadata?.created_month && user?.user_metadata?.created_year
    ? `${user.user_metadata.created_month} ${user.user_metadata.created_year}`
    : "";

  return (
    <div className="flex flex-col items-start space-y-1">
      <div className="flex items-center space-x-1">
        <span className="text-xs text-gray-700">📍 {location}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-2 w-2 p-0"
          onClick={() => setIsSettingsOpen(true)}
        >
          <Pencil className="h-1.5 w-1.5 text-gray-500" />
        </Button>
      </div>
      {joinDate && (
        <span className="text-xs text-gray-700">joined: {joinDate}</span>
      )}
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        initialTab="account"
      />
    </div>
  );
} 