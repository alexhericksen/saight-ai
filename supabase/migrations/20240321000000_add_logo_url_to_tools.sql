-- Add logo_url column to available_tools table
ALTER TABLE available_tools ADD COLUMN logo_url TEXT;

-- Update existing tools with their logo URLs
UPDATE available_tools SET logo_url = '/logos/' || REPLACE(domain, '.', '_') || '.png' WHERE logo_url IS NULL; 