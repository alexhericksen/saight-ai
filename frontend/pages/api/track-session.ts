import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('X-Route-Version', 'pages-api-final');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

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
        console.log('✅ Verified user:', userId);
      }
    } catch (error) {
      console.error('Error verifying token:', error);
    }
  }

  const { tool, duration, tag_category, tag_detail } = req.body;

  // Create session data with user_id if available
  const sessionData: any = {
    tool,
    duration,
    tag_category,
    tag_detail,
    timestamp: new Date().toISOString()
  };

  // Only add user_id if we have a valid authenticated user
  if (userId) {
    sessionData.user_id = userId;
    console.log('✅ Adding session for user:', userId);
  } else {
    console.log('⚠️ No user ID available, session will be anonymous');
  }

  console.log('Session data to insert:', sessionData);

  // Use service role client to bypass RLS for inserts
  const { createClient } = await import('@supabase/supabase-js');
  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  const { error } = await serviceClient.from('sessions').insert([sessionData]);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Route-Version', 'pages-api-final');

  if (error) {
    console.error('Error saving session:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Session saved' });
}
