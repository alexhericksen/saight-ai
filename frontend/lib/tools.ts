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
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No authenticated user found');
      return [];
    }

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
      .eq('user_id', user.id)
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
  } catch (error) {
    console.error('Error in getUserTools:', error);
    return [];
  }
}

export async function addTool(tool: { domain: string; name: string; logo_url?: string; category?: string; detail?: string }): Promise<Tool | null> {
  try {
    // First, check if the tool already exists in available_tools
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
      // If it doesn't exist, create it in available_tools
      const { data: newTool, error: insertError } = await supabase
        .from('available_tools')
        .insert([{ 
          domain: tool.domain, 
          name: tool.name, 
          logo_url: tool.logo_url 
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating new tool in available_tools:', insertError);
        return null;
      }

      toolId = newTool.id;
    }

    // Check if this tool is already tracked by the user
    const { data: existingUserTool } = await supabase
      .from('user_tools')
      .select('*')
      .eq('tool_id', toolId)
      .single();

    if (existingUserTool) {
      console.log('Tool already tracked by user');
      return {
        id: toolId,
        domain: tool.domain,
        name: tool.name,
        logo_url: tool.logo_url,
        category: tool.category,
        detail: tool.detail
      };
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return null;
    }

    // Add the tool to user's tracked tools
    const { error: userToolError } = await supabase
      .from('user_tools')
      .insert([{
        user_id: user.id,
        tool_id: toolId,
        category: tool.category,
        detail: tool.detail
      }]);

    if (userToolError) {
      console.error('Error adding tool to user_tools:', userToolError);
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
  } catch (error) {
    console.error('Error in addTool:', error);
    return null;
  }
}

export async function removeTool(toolId: string): Promise<boolean> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }

    const { error } = await supabase
      .from('user_tools')
      .delete()
      .eq('tool_id', toolId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error removing tool:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in removeTool:', error);
    return false;
  }
} 