// Centralized logo management for AI tools
// This serves as the single source of truth for all tool logos

export interface ToolLogo {
  name: string;
  domain: string;
  logoUrl?: string; // External URL if available
  localPath?: string; // Local path in public/logos/
}

// Centralized tool logo configuration
export const TOOL_LOGOS: Record<string, ToolLogo> = {
  // Popular AI tools
  'chatgpt': {
    name: 'ChatGPT',
    domain: 'chatgpt.com',
    localPath: 'chatgpt_com.png'
  },
  'claude': {
    name: 'Claude',
    domain: 'claude.ai',
    localPath: 'claude_ai.png'
  },
  'perplexity': {
    name: 'Perplexity',
    domain: 'perplexity.ai',
    localPath: 'perplexity_ai.png'
  },
  'grok': {
    name: 'Grok',
    domain: 'grok.com',
    localPath: 'grok_com.png'
  },
  'cursor': {
    name: 'Cursor',
    domain: 'cursor.com',
    localPath: 'cursor_com.png'
  },
  'replit': {
    name: 'Replit',
    domain: 'replit.com',
    localPath: 'replit_com.png'
  },
  'notion': {
    name: 'Notion',
    domain: 'notion.so',
    localPath: 'notion_so.png'
  },
  'linear': {
    name: 'Linear',
    domain: 'linear.app',
    localPath: 'linear_app.png'
  },
  'superhuman': {
    name: 'Superhuman',
    domain: 'superhuman.com',
    localPath: 'superhuman_com.png'
  },
  'lovable': {
    name: 'Lovable',
    domain: 'lovable.dev',
    localPath: 'lovable_dev.png'
  },
  'bolt': {
    name: 'Bolt',
    domain: 'bolt.net',
    localPath: 'bolt_net.png'
  },
  // Add more tools here as needed
  'granola': {
    name: 'Granola',
    domain: 'granola.ai',
    localPath: 'granola_ai.png'
  },
  'synthesia': {
    name: 'Synthesia',
    domain: 'synthesia.io',
    localPath: 'synthesia_io.png'
  },
  'midjourney': {
    name: 'Midjourney',
    domain: 'midjourney.com',
    localPath: 'midjourney_com.png'
  }
};

/**
 * Get the logo URL for a tool by domain
 * @param domain - The tool's domain (e.g., 'chatgpt.com')
 * @returns The logo URL or path
 */
export function getToolLogo(domain: string): string {
  // Normalize domain for lookup
  const normalizedDomain = domain.toLowerCase().replace(/^www\./, '');
  
  // Try to find exact match
  const toolLogo = TOOL_LOGOS[normalizedDomain];
  if (toolLogo) {
    if (toolLogo.logoUrl) {
      return toolLogo.logoUrl;
    }
    if (toolLogo.localPath) {
      return `/logos/${toolLogo.localPath}`;
    }
  }
  
  // Try to find by partial domain match
  const domainParts = normalizedDomain.split('.');
  const baseDomain = domainParts[0];
  const toolLogoByBase = TOOL_LOGOS[baseDomain];
  if (toolLogoByBase) {
    if (toolLogoByBase.logoUrl) {
      return toolLogoByBase.logoUrl;
    }
    if (toolLogoByBase.localPath) {
      return `/logos/${toolLogoByBase.localPath}`;
    }
  }
  
  // Generate fallback path based on domain
  const fallbackPath = `/logos/${normalizedDomain.replace(/\./g, '_')}.png`;
  return fallbackPath;
}

/**
 * Get the display name for a tool by domain
 * @param domain - The tool's domain
 * @returns The display name
 */
export function getToolDisplayName(domain: string): string {
  const normalizedDomain = domain.toLowerCase().replace(/^www\./, '');
  
  // Try exact match
  const toolLogo = TOOL_LOGOS[normalizedDomain];
  if (toolLogo) {
    return toolLogo.name;
  }
  
  // Try partial match
  const domainParts = normalizedDomain.split('.');
  const baseDomain = domainParts[0];
  const toolLogoByBase = TOOL_LOGOS[baseDomain];
  if (toolLogoByBase) {
    return toolLogoByBase.name;
  }
  
  // Fallback: capitalize domain parts
  return domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
}

/**
 * Get all available tool logos
 * @returns Array of all tool logos
 */
export function getAllToolLogos(): ToolLogo[] {
  return Object.values(TOOL_LOGOS);
}

/**
 * Add a new tool logo to the configuration
 * @param toolLogo - The tool logo configuration
 */
export function addToolLogo(toolLogo: ToolLogo): void {
  const key = toolLogo.domain.toLowerCase().replace(/^www\./, '');
  TOOL_LOGOS[key] = toolLogo;
} 