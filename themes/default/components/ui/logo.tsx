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
  lg: 'h-[41px] w-[39px]',
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
    <div className={cn('flex items-center gap-4', className)}>
      {src && <img src={src} alt={alt} className={sizeClasses[size]} />}
      {text && (
        <div className="text-foreground flex flex-col text-sm leading-[1.35] font-bold uppercase">
          {text.split(' ').map((word, index) => (
            <span key={index}>{word}</span>
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
