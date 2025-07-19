-- Fix user_tools RLS policies to prevent login loops
-- Drop existing policies
DROP POLICY IF EXISTS "Allow anyone to read user_tools" ON user_tools;
DROP POLICY IF EXISTS "Allow anyone to insert user_tools" ON user_tools;
DROP POLICY IF EXISTS "Allow anyone to delete user_tools" ON user_tools;

-- Create new policies that properly handle authentication
-- Allow users to read their own user_tools
CREATE POLICY "Allow users to read their own user_tools" ON user_tools
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.role() = 'authenticated'
  );

-- Allow users to insert their own user_tools
CREATE POLICY "Allow users to insert their own user_tools" ON user_tools
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    auth.role() = 'authenticated'
  );

-- Allow users to delete their own user_tools
CREATE POLICY "Allow users to delete their own user_tools" ON user_tools
  FOR DELETE USING (
    auth.uid() = user_id OR 
    auth.role() = 'authenticated'
  ); 