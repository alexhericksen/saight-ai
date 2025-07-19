-- Create sessions table for tracking user activity
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool TEXT NOT NULL,
  duration INTEGER NOT NULL,
  tag_category TEXT,
  tag_detail TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own sessions
CREATE POLICY "Allow users to read their own sessions" ON sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own sessions
CREATE POLICY "Allow users to insert their own sessions" ON sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own sessions
CREATE POLICY "Allow users to update their own sessions" ON sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own sessions
CREATE POLICY "Allow users to delete their own sessions" ON sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_timestamp ON sessions(timestamp);
CREATE INDEX idx_sessions_tool ON sessions(tool);

-- Create trigger for updated_at
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 