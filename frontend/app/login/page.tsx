'use client';
import { useUser } from '../../lib/useUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoginButton from '../../components/LoginButton';

export default function LoginPage() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return; // Still loading
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  if (user === undefined) return null; // Or a loading spinner

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center w-full max-w-md">
        <img src="/logo.png" alt="Saight logo" className="h-12 w-auto mb-6" />
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Welcome to Saight</h1>
        <p className="text-gray-500 mb-6 text-center">Sign in with Google to access your AI dashboard, profile, and more.</p>
        <LoginButton />
      </div>
    </div>
  );
} 