import { cn } from '../lib/utils';

interface ClientLogoProps {
  name: string;
  logo: string;
  href?: string;
  className?: string;
}

export default function ClientLogo({
  name,
  logo,
  href,
  className = '',
}: ClientLogoProps) {
  const LogoComponent = href ? 'a' : 'div';

  return (
    <LogoComponent
      href={href}
      className={cn('flex justify-center', className)}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
    >
      <img
        src={logo}
        alt={name}
        className="h-12 w-auto object-contain opacity-60 grayscale filter transition-all duration-200 hover:opacity-100 hover:grayscale-0"
      />
    </LogoComponent>
  );
}
