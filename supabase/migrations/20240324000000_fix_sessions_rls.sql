-- Fix RLS policies for sessions table to allow proper user authentication
-- Drop existing policies
DROP POLICY IF EXISTS "Allow users to read their own sessions" ON sessions;
DROP POLICY IF EXISTS "Allow users to insert their own sessions" ON sessions;
DROP POLICY IF EXISTS "Allow users to update their own sessions" ON sessions;
DROP POLICY IF EXISTS "Allow users to delete their own sessions" ON sessions;

-- Create new policies that handle both authenticated and anonymous sessions
-- Allow users to read their own sessions OR anonymous sessions (for backward compatibility)
CREATE POLICY "Allow users to read sessions" ON sessions
  FOR SELECT USING (
    auth.uid() = user_id OR 
    user_id IS NULL OR
    auth.role() = 'authenticated'
  );

-- Allow users to insert their own sessions OR anonymous sessions
CREATE POLICY "Allow users to insert sessions" ON sessions
  FOR INSERT WITH CHECK (
    (auth.uid() = user_id) OR 
    (user_id IS NULL) OR
    auth.role() = 'authenticated'
  );

-- Allow users to update their own sessions
CREATE POLICY "Allow users to update their own sessions" ON sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own sessions
CREATE POLICY "Allow users to delete their own sessions" ON sessions
  FOR DELETE USING (auth.uid() = user_id); 