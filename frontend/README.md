# Saight AI - Dynamic Tools System

## Overview

This system allows users to dynamically add and track AI tools through a database-driven approach, replacing the previous hardcoded domain list.

## Features

- **Dynamic Tool Management**: Tools are stored in Supabase database instead of hardcoded lists
- **Logo Support**: Each tool can have a high-quality logo image
- **User Customization**: Users can add new tools through the UI
- **Extension Integration**: Chrome extension fetches tracked domains from the API
- **Real-time Updates**: Tools list updates automatically when new tools are added

## Database Schema

### `available_tools` table
- `id`: UUID primary key
- `domain`: Tool domain (e.g., "chatgpt.com")
- `name`: Tool display name (e.g., "ChatGPT")
- `logo_url`: URL to tool logo image
- `created_at`: Timestamp
- `updated_at`: Timestamp

### `user_tools` table
- `id`: UUID primary key
- `user_id`: References auth.users
- `tool_id`: References available_tools
- `category`: Tool category (e.g., "creation", "research")
- `detail`: Tool detail (e.g., "writing", "coding")
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Setup Instructions

1. **Run Database Migrations**:
   ```bash
   # Apply the new migration that adds logo_url column
   supabase db push
   ```

2. **Populate Initial Tools**:
   ```bash
   # Set your Supabase environment variables
   export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   
   # Run the population script
   npm run populate-tools
   ```

3. **Update Extension**:
   The Chrome extension will now fetch tracked domains from the API instead of using hardcoded lists.

## API Endpoints

### `GET /api/tracked-domains`
Returns a list of all tracked domains for the Chrome extension.

Response:
```json
{
  "domains": ["chatgpt.com", "claude.ai", "cursor.com"]
}
```

## Usage

### Adding a New Tool
1. Go to "My Profile" → "AI Usage" → "View Tracked Tools"
2. Click "Track New" button
3. Either select an existing tool or add a new one
4. Fill in domain, name, and optional logo URL
5. Save the tool

### Extension Behavior
- Extension fetches tracked domains on install and every hour
- Automatically tracks usage on any domain in the database
- No need to update extension code when adding new tools

## File Structure

- `supabase/migrations/`: Database schema changes
- `frontend/lib/tools.ts`: Tool management functions
- `frontend/pages/api/tracked-domains.ts`: API endpoint for extension
- `frontend/components/ui/track-tool-dialog.tsx`: UI for adding tools
- `extension/background.js`: Updated to fetch from API
- `frontend/scripts/populate-tools.js`: Database population script

## Benefits

1. **Scalability**: No need to update code when new AI tools emerge
2. **User Control**: Users can track any tool they want
3. **Visual Appeal**: High-quality logos for each tool
4. **Maintainability**: Centralized tool management
5. **Real-time**: Changes reflect immediately across the system
