'use client';
import { supabase } from '@/lib/supabase';

export default function LoginButton() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold text-lg flex items-center justify-center gap-2 shadow"
    >
      <svg width="20" height="20" viewBox="0 0 48 48" className="mr-2"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.71 5.82 2.69 14.09l7.98 6.2C12.13 13.09 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.93 37.36 46.1 31.45 46.1 24.55z"/><path fill="#FBBC05" d="M9.67 28.29c-1.13-3.36-1.13-6.93 0-10.29l-7.98-6.2C-1.13 17.09-1.13 30.91 1.69 39.91l7.98-6.2z"/><path fill="#EA4335" d="M24 46c6.18 0 11.64-2.36 15.85-6.45l-7.19-5.6c-2.01 1.35-4.57 2.15-8.66 2.15-6.38 0-11.87-3.59-14.33-8.79l-7.98 6.2C6.71 42.18 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
      Sign in with Google
    </button>
  );
} 