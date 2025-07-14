'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  lazy?: boolean;
  placeholder?: string;
  fallback?: string;
  aspectRatio?: 'square' | 'video' | 'photo' | string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  showSkeleton?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  containerClassName?: string;
}

const aspectRatios = {
  square: 'aspect-square',
  video: 'aspect-video',
  photo: 'aspect-photo',
};

const objectFits = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
};

export default function Image({
  src,
  alt,
  lazy = true,
  placeholder,
  fallback,
  aspectRatio,
  objectFit = 'cover',
  showSkeleton = true,
  containerClassName = '',
  onLoad,
  onError,
  ...props
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const containerClasses = cn(
    'relative overflow-hidden',
    aspectRatio &&
      typeof aspectRatio === 'string' &&
      aspectRatios[aspectRatio as keyof typeof aspectRatios],
    aspectRatio &&
      !aspectRatios[aspectRatio as keyof typeof aspectRatios] &&
      aspectRatio,
    containerClassName,
  );

  const imgClasses = cn(
    'h-auto max-w-full transition-all duration-500',
    objectFits[objectFit],
    aspectRatio && 'h-full w-full',
    isLoading && 'opacity-0 blur-sm scale-105',
    !isLoading && 'opacity-100 blur-0 scale-100',
  );

  const skeletonClasses = cn(
    'absolute inset-0 dwarves-skeleton rounded-lg',
    !isLoading && 'opacity-0',
  );

  return (
    <div ref={containerRef} className={containerClasses}>
      {showSkeleton && isLoading && <div className={skeletonClasses} />}

      {placeholder && (
        <img
          src={placeholder}
          alt=""
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-all duration-500',
            isLoading && 'scale-100 opacity-60 blur-md',
            !isLoading && 'scale-110 opacity-0 blur-lg',
          )}
        />
      )}

      {isInView && !hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={imgClasses}
          loading={lazy ? 'lazy' : 'eager'}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}

      {hasError && fallback && (
        <img
          src={fallback}
          alt={alt}
          className={imgClasses}
          onLoad={() => setIsLoading(false)}
        />
      )}

      {hasError && !fallback && (
        <div
          className={cn(
            'bg-muted text-muted-foreground absolute inset-0 flex items-center justify-center',
            aspectRatio && 'h-full w-full',
          )}
        >
          <svg
            className="h-full w-full"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
