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
    <div className={`flex items-center space-x-2 ${className}`}>
      {src && <img src={src} alt={alt} className={sizeClasses[size]} />}
      {text && (
        <span className="text-foreground text-xl font-bold">{text}</span>
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
