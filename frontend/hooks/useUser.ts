import { useSession } from '@/components/providers/session-provider';
import { supabase } from '@/lib/supabase';
import { handleUserMetadata } from '@/lib/handleUserMetadata';

type UserSettings = {
  city?: string;
  state?: string;
  timezone?: string;
  industry?: string;
  profession?: string;
  company?: string;
};

export function useUser() {
  const { user, isLoading } = useSession();

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (data: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
  }) => {
    if (!user) return null;
    
    const { data: updatedUser, error } = await supabase.auth.updateUser({
      data: {
        ...data,
      },
    });

    if (error) throw error;
    return updatedUser;
  };

  const updateUserSettings = async (settings: UserSettings) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .update(settings)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  // This function should be called after successful sign-in
  const handleSignIn = async () => {
    if (!user || !user.email) return;

    try {
      await handleUserMetadata({
        id: user.id,
        email: user.email,
        first_name: user.user_metadata?.first_name,
        last_name: user.user_metadata?.last_name,
      });
    } catch (error) {
      console.error('Error handling user metadata after sign in:', error);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    updateProfile,
    updateUserSettings,
    handleSignIn,
  };
} 