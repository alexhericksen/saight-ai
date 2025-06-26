-- Fix user_tools table to work without authentication for now
-- Make user_id nullable and update RLS policies

-- Drop existing policies
DROP POLICY IF EXISTS "Allow users to read their own user_tools" ON user_tools;
DROP POLICY IF EXISTS "Allow users to insert their own user_tools" ON user_tools;
DROP POLICY IF EXISTS "Allow users to delete their own user_tools" ON user_tools;

-- Make user_id nullable
ALTER TABLE user_tools ALTER COLUMN user_id DROP NOT NULL;

-- Create new policies that allow operations without authentication for now
CREATE POLICY "Allow anyone to read user_tools" ON user_tools
  FOR SELECT USING (true);

CREATE POLICY "Allow anyone to insert user_tools" ON user_tools
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anyone to delete user_tools" ON user_tools
  FOR DELETE USING (true);

-- Add logo_url to available_tools if it doesn't exist (should already exist from previous migration)
-- This is just to ensure it's there
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'available_tools' AND column_name = 'logo_url') THEN
        ALTER TABLE available_tools ADD COLUMN logo_url TEXT;
    END IF;
END $$; 