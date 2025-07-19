-- Final fix for sessions RLS policies - make them more permissive
-- Drop all existing policies
DROP POLICY IF EXISTS "Allow users to read sessions" ON sessions;
DROP POLICY IF EXISTS "Allow users to insert sessions" ON sessions;
DROP POLICY IF EXISTS "Allow users to update their own sessions" ON sessions;
DROP POLICY IF EXISTS "Allow users to delete their own sessions" ON sessions;

-- Create very permissive policies for now (we can tighten later)
-- Allow any authenticated user to read sessions
CREATE POLICY "Allow authenticated users to read sessions" ON sessions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow any authenticated user to insert sessions
CREATE POLICY "Allow authenticated users to insert sessions" ON sessions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own sessions
CREATE POLICY "Allow users to update their own sessions" ON sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own sessions
CREATE POLICY "Allow users to delete their own sessions" ON sessions
  FOR DELETE USING (auth.uid() = user_id); 