import { supabase } from "@/lib/supabase";

// Define the type for the user parameter
type UserInput = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
};

// Define the type for the database user record
type UserRecord = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_month: string;
  created_year: string;
  city: string | null;
  state: string | null;
  industry: string | null;
  profession: string | null;
  company: string | null;
  timezone: string | null;
};

export async function handleUserMetadata(user: UserInput): Promise<void> {
  try {
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("Users") // Using exact table name as it's capitalized in Supabase
      .select("id")
      .eq("id", user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      throw fetchError;
    }

    if (!existingUser) {
      const now = new Date();
      const created_month = now.toLocaleString("default", { month: "short" });
      const created_year = now.getFullYear().toString();

      const newUser: UserRecord = {
        id: user.id,
        email: user.email,
        first_name: user.first_name || null,
        last_name: user.last_name || null,
        created_month,
        created_year,
        city: null,
        state: null,
        industry: null,
        profession: null,
        company: null,
        timezone: null,
      };

      const { error: insertError } = await supabase
        .from("Users")
        .insert([newUser]);

      if (insertError) {
        throw insertError;
      }
    }
  } catch (error) {
    console.error('Error handling user metadata:', error);
    throw error; // Re-throw to let the caller handle the error
  }
} 