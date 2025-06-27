'use client';
import { supabase } from '@/lib/supabase';

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 font-semibold text-lg flex items-center justify-center gap-2 shadow"
    >
      Log out
    </button>
  );
} 