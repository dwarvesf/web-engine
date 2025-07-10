import React from 'react';
import { cn } from '../../utils';

export default function Image({
  src,
  alt,
  className = '',
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn('h-auto max-w-full rounded-lg', className)}
      {...props}
    />
  );
}
