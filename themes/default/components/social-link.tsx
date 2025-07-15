import { cn } from '../utils';
import { Icon } from './ui';

interface SocialLinkProps {
  name: string;
  href: string;
  icon: string;
  className?: string;
  showLabel?: boolean;
}

export default function SocialLink({
  name,
  href,
  icon,
  className = '',
  showLabel = false,
}: SocialLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'text-muted-foreground hover:text-primary block space-x-1 text-sm transition-colors duration-200',
        className,
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
    >
      <Icon name={icon} size="sm" className="inline-block" />
      {showLabel && <span className="inline-block">{name}</span>}
    </a>
  );
}
