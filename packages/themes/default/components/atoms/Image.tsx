import { cn } from '../lib/utils';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  [key: string]: any;
}

export default function Image({
  src,
  alt,
  className = '',
  ...props
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn('h-auto max-w-full rounded-lg', className)}
      {...props}
    />
  );
}
