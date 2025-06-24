// Script to populate the available_tools table with initial data
// Run this with: node scripts/populate-tools.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const initialTools = [
  {
    domain: "chatgpt.com",
    name: "ChatGPT",
    logo_url: "/logos/chatgpt_com.png"
  },
  {
    domain: "claude.ai",
    name: "Claude",
    logo_url: "/logos/claude_ai.png"
  },
  {
    domain: "cursor.com",
    name: "Cursor",
    logo_url: "/logos/cursor_com.png"
  },
  {
    domain: "grok.com",
    name: "Grok",
    logo_url: "/logos/grok_com.png"
  },
  {
    domain: "replit.com",
    name: "Replit",
    logo_url: "/logos/replit_com.png"
  },
  {
    domain: "superhuman.com",
    name: "Superhuman",
    logo_url: "/logos/superhuman_com.png"
  },
  {
    domain: "lovable.dev",
    name: "Lovable",
    logo_url: "/logos/lovable_dev.png"
  },
  {
    domain: "perplexity.ai",
    name: "Perplexity",
    logo_url: "/logos/perplexity_ai.png"
  },
  {
    domain: "linear.app",
    name: "Linear",
    logo_url: "/logos/linear_app.png"
  },
  {
    domain: "bolt.net",
    name: "Bolt",
    logo_url: "/logos/bolt_net.png"
  },
  {
    domain: "notion.com",
    name: "Notion",
    logo_url: "/logos/notion_com.png"
  },
  {
    domain: "notion.so",
    name: "Notion (so)",
    logo_url: "/logos/notion_so.png"
  }
];

async function populateTools() {
  console.log('Starting to populate tools...');
  
  for (const tool of initialTools) {
    try {
      // Check if tool already exists
      const { data: existing } = await supabase
        .from('available_tools')
        .select('id')
        .eq('domain', tool.domain)
        .single();

      if (existing) {
        console.log(`✅ Tool ${tool.name} already exists`);
        continue;
      }

      // Insert new tool
      const { data, error } = await supabase
        .from('available_tools')
        .insert([tool])
        .select();

      if (error) {
        console.error(`❌ Error inserting ${tool.name}:`, error);
      } else {
        console.log(`✅ Added ${tool.name} (${tool.domain})`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${tool.name}:`, error);
    }
  }

  console.log('Finished populating tools!');
}

populateTools().catch(console.error); 