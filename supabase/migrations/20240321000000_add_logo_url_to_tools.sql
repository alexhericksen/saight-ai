-- Add logo_url column to available_tools table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'available_tools' AND column_name = 'logo_url') THEN
        ALTER TABLE available_tools ADD COLUMN logo_url TEXT;
    END IF;
END $$;

-- Update existing tools with their logo URLs
UPDATE available_tools SET logo_url = '/logos/' || REPLACE(domain, '.', '_') || '.png' WHERE logo_url IS NULL; 