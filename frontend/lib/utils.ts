import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from './supabase'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Groups sessions by tool and by time window (e.g., 60 minutes).
 * Each group contains sessions for the same tool that are within the window of each other.
 * Returns an array of { tool, start, end, totalDuration, sessions } sorted by most recent.
 */
export function groupSessionsByToolAndWindow(sessions: { tool: string; timestamp: string; duration: number }[], windowMinutes = 60) {
  if (!Array.isArray(sessions)) return [];
  const windowMs = windowMinutes * 60 * 1000;
  // Sort sessions by tool, then by timestamp ascending
  const sorted = [...sessions].sort((a, b) => {
    if (a.tool !== b.tool) return a.tool.localeCompare(b.tool);
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  const grouped: Array<{
    tool: string;
    start: string;
    end: string;
    totalDuration: number;
    sessions: typeof sessions;
  }> = [];

  let currentGroup: typeof grouped[0] | null = null;

  for (const session of sorted) {
    const sessionTime = new Date(session.timestamp).getTime();
    if (
      !currentGroup ||
      currentGroup.tool !== session.tool ||
      sessionTime - new Date(currentGroup.end).getTime() > windowMs
    ) {
      // Start a new group
      currentGroup = {
        tool: session.tool,
        start: session.timestamp,
        end: session.timestamp,
        totalDuration: session.duration,
        sessions: [session],
      };
      grouped.push(currentGroup);
    } else {
      // Add to current group
      currentGroup.end = session.timestamp;
      currentGroup.totalDuration += session.duration;
      currentGroup.sessions.push(session);
    }
  }

  // Sort groups by end time descending (most recent first)
  return grouped.sort((a, b) => new Date(b.end).getTime() - new Date(a.end).getTime());
}

/**
 * Fetches the last 25 sessions from Supabase, ordered by timestamp descending.
 */
export async function fetchRecentSessions() {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(25);
  if (error) {
    console.error('Error fetching sessions:', error.message);
    return [];
  }
  return data || [];
}

/**
 * Fetches and sums the total duration of all sessions from Supabase.
 * Returns the total duration in seconds.
 */
export async function fetchTotalUsageDuration() {
  const { data, error } = await supabase
    .from('sessions')
    .select('duration');
  console.log('Supabase sessions data:', data, 'error:', error);
  if (error) {
    console.error('Error fetching total usage duration:', error.message);
    return 0;
  }
  return (data || []).reduce((sum, s) => sum + (s.duration || 0), 0);
}
