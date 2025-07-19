-- Fix sessions RLS policy to work with API calls
-- The issue is that API calls don't have the same auth context as direct database access

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read sessions" ON sessions;
DROP POLICY IF EXISTS "Allow authenticated users to insert sessions" ON sessions;
DROP POLICY IF EXISTS "Allow users to update their own sessions" ON sessions;
DROP POLICY IF EXISTS "Allow users to delete their own sessions" ON sessions;

-- Enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create policies that work with both direct access and API calls
-- For reading: users can read their own sessions
CREATE POLICY "Users can read their own sessions" ON sessions
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (auth.role() = 'authenticated' AND user_id IS NULL)
  );

-- For inserting: allow authenticated users to insert sessions
-- This is more permissive but necessary for the API to work
CREATE POLICY "Allow session inserts" ON sessions
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' OR 
    user_id IS NOT NULL
  );

-- For updating: users can update their own sessions
CREATE POLICY "Users can update their own sessions" ON sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- For deleting: users can delete their own sessions
CREATE POLICY "Users can delete their own sessions" ON sessions
  FOR DELETE USING (auth.uid() = user_id); 