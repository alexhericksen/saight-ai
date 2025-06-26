import { getToolLogo, getToolDisplayName } from '@/lib/tool-logos';

interface ToolLogoProps {
  domain: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ToolLogo({ domain, name, size = 'md', className = '' }: ToolLogoProps) {
  const logoUrl = getToolLogo(domain);
  const displayName = name || getToolDisplayName(domain);
  
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <img
      src={logoUrl}
      alt={`${displayName} logo`}
      className={`${sizeClasses[size]} rounded-sm object-contain ${className}`}
      onError={(e) => {
        // Fallback to default AI logo if the specific logo fails to load
        e.currentTarget.src = "/logos/default-ai.png";
      }}
    />
  );
} 