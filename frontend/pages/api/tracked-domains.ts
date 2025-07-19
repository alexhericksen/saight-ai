import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow CORS for Chrome extension and local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the authorization header (Bearer token from extension)
    const authHeader = req.headers.authorization;
    let userId: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        // Verify the JWT token and get user info
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error) {
          console.error('Token verification error:', error);
        } else {
          userId = user?.id || null;
        }
      } catch (error) {
        console.error('Error verifying token:', error);
      }
    }

    let domains: string[] = [];

    if (userId) {
      // User is authenticated - get their specific tracked tools
      const { data: userTools, error: userError } = await supabase
        .from('user_tools')
        .select(`
          available_tools (
            domain
          )
        `)
        .eq('user_id', userId);

      if (userError) {
        console.error('Error fetching user tools:', userError);
        return res.status(500).json({ error: 'Failed to fetch tracked domains' });
      }

      domains = userTools?.map(ut => (ut.available_tools as any).domain) || [];
    } else {
      // No user authenticated - return all available tools (fallback)
      const { data: tools, error } = await supabase
        .from('available_tools')
        .select('domain, name')
        .order('name');

      if (error) {
        console.error('Error fetching tracked domains:', error);
        return res.status(500).json({ error: 'Failed to fetch tracked domains' });
      }

      domains = tools?.map(tool => tool.domain) || [];
    }
    
    res.status(200).json({ domains });
  } catch (error) {
    console.error('Error in tracked-domains API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 