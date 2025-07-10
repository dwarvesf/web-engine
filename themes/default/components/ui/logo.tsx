import { cn } from '../../utils';

interface LogoProps {
  src?: string;
  alt?: string;
  text?: string;
  href?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-6 w-auto',
  md: 'h-8 w-auto',
  lg: 'h-12 w-auto',
};

export default function Logo({
  src,
  alt = 'Logo',
  text = 'Dwarves Foundation',
  href = '/',
  className = '',
  size = 'md',
}: LogoProps) {
  const LogoContent = () => (
    <div className={cn('flex items-center gap-2', className)}>
      {src && <img src={src} alt={alt} className={sizeClasses[size]} />}
      {text && (
        <div className="text-foreground flex flex-col text-xl font-bold">
          {text.split(' ').map((word, index) => (
            <h5 key={index}>{word}</h5>
          ))}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="inline-flex">
        <LogoContent />
      </a>
    );
  }

  return <LogoContent />;
}
