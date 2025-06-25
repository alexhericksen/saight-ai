import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow CORS for Chrome extension and local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all available tools from the database
    const { data: tools, error } = await supabase
      .from('available_tools')
      .select('domain, name')
      .order('name');

    if (error) {
      console.error('Error fetching tracked domains:', error);
      return res.status(500).json({ error: 'Failed to fetch tracked domains' });
    }

    // Return just the domains for the extension
    const domains = tools?.map(tool => tool.domain) || [];
    
    res.status(200).json({ domains });
  } catch (error) {
    console.error('Error in tracked-domains API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 