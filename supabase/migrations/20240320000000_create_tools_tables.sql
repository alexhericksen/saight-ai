-- Create available_tools table
CREATE TABLE available_tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user_tools table
CREATE TABLE user_tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES available_tools(id) ON DELETE CASCADE,
  category TEXT,
  detail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, tool_id)
);

-- Create RLS policies
ALTER TABLE available_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tools ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read available_tools
CREATE POLICY "Allow anyone to read available_tools" ON available_tools
  FOR SELECT USING (true);

-- Allow authenticated users to insert into available_tools
CREATE POLICY "Allow authenticated users to insert into available_tools" ON available_tools
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to read their own user_tools
CREATE POLICY "Allow users to read their own user_tools" ON user_tools
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own user_tools
CREATE POLICY "Allow users to insert their own user_tools" ON user_tools
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own user_tools
CREATE POLICY "Allow users to delete their own user_tools" ON user_tools
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_available_tools_updated_at
  BEFORE UPDATE ON available_tools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_tools_updated_at
  BEFORE UPDATE ON user_tools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 