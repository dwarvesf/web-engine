import { cn } from '../lib/utils';
import { Icon } from '../atoms';

interface SocialLinkProps {
  name: string;
  href: string;
  icon: string;
  className?: string;
}

export default function SocialLink({
  name,
  href,
  icon,
  className = '',
}: SocialLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'text-muted-foreground hover:text-primary transition-colors duration-200',
        className,
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
    >
      <Icon name={icon} size="md" />
    </a>
  );
}
