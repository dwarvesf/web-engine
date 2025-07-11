import { cn } from '../../utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animation?: 'pulse' | 'wave' | 'none';
}

const variants = {
  text: 'h-4 rounded',
  rectangular: 'rounded-none',
  circular: 'rounded-full',
  rounded: 'rounded-lg',
};

const animations = {
  pulse: 'animate-pulse',
  wave: 'dwarves-skeleton',
  none: '',
};

export default function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  lines = 1,
  animation = 'wave',
}: SkeletonProps) {
  const baseClasses = cn(
    'bg-muted',
    variants[variant],
    animations[animation],
    className,
  );

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              index === lines - 1 && 'w-3/4', // Make last line shorter
            )}
            style={style}
          />
        ))}
      </div>
    );
  }

  return <div className={baseClasses} style={style} />;
}

// Pre-built skeleton components
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={cn('bg-card space-y-4 rounded-lg border p-6', className)}>
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" />
          <Skeleton width="40%" />
        </div>
      </div>
      <Skeleton lines={3} />
    </div>
  );
}

export function SkeletonButton({ className = '' }: { className?: string }) {
  return (
    <Skeleton
      className={cn('h-10 w-24', className)}
      variant="rounded"
      animation="pulse"
    />
  );
}

export function SkeletonAvatar({
  size = 40,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function SkeletonImage({
  className = '',
  aspectRatio = 'video',
}: {
  className?: string;
  aspectRatio?: 'square' | 'video' | 'photo';
}) {
  const ratios = {
    square: 'aspect-square',
    video: 'aspect-video',
    photo: 'aspect-photo',
  };

  return (
    <Skeleton
      className={cn('w-full', ratios[aspectRatio], className)}
      variant="rectangular"
    />
  );
}

export function SkeletonList({
  items = 5,
  className = '',
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton width="80%" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className = '',
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} width="100%" height="20px" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} width="100%" height="16px" />
          ))}
        </div>
      ))}
    </div>
  );
}
