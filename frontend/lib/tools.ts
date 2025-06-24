import { supabase } from './supabase';

export type Tool = {
  id: string;
  domain: string;
  name: string;
  logo_url?: string;
  category?: string;
  detail?: string;
};

export type AvailableTool = {
  id: string;
  domain: string;
  name: string;
  logo_url?: string;
};

export async function getAvailableTools(): Promise<AvailableTool[]> {
  const { data, error } = await supabase
    .from('available_tools')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching available tools:', error);
    return [];
  }

  return data || [];
}

export async function getUserTools(): Promise<Tool[]> {
  const { data, error } = await supabase
    .from('user_tools')
    .select(`
      id,
      category,
      detail,
      available_tools (
        id,
        domain,
        name,
        logo_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user tools:', error);
    return [];
  }

  return (data || []).map((tool: any) => ({
    id: tool.available_tools.id,
    domain: tool.available_tools.domain,
    name: tool.available_tools.name,
    logo_url: tool.available_tools.logo_url,
    category: tool.category,
    detail: tool.detail
  }));
}

export async function addTool(tool: { domain: string; name: string; logo_url?: string; category?: string; detail?: string }): Promise<Tool | null> {
  // First, check if the tool already exists
  const { data: existingTool } = await supabase
    .from('available_tools')
    .select('*')
    .eq('domain', tool.domain)
    .eq('name', tool.name)
    .single();

  let toolId: string;

  if (existingTool) {
    toolId = existingTool.id;
  } else {
    // If it doesn't exist, create it
    const { data: newTool, error: insertError } = await supabase
      .from('available_tools')
      .insert([{ domain: tool.domain, name: tool.name, logo_url: tool.logo_url }])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating new tool:', insertError);
      return null;
    }

    toolId = newTool.id;
  }

  // Add the tool to user's tracked tools
  const { error: userToolError } = await supabase
    .from('user_tools')
    .insert([{
      tool_id: toolId,
      category: tool.category,
      detail: tool.detail
    }]);

  if (userToolError) {
    console.error('Error adding tool to user:', userToolError);
    return null;
  }

  return {
    id: toolId,
    domain: tool.domain,
    name: tool.name,
    logo_url: tool.logo_url,
    category: tool.category,
    detail: tool.detail
  };
}

export async function removeTool(toolId: string): Promise<boolean> {
  const { error } = await supabase
    .from('user_tools')
    .delete()
    .eq('tool_id', toolId);

  if (error) {
    console.error('Error removing tool:', error);
    return false;
  }

  return true;
} 