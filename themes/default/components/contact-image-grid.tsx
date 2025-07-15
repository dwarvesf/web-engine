import React from 'react';
import { cn } from '../utils';
import Image from './ui/image';

interface ContactImageGridProps {
  className?: string;
  images?: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
}

const ContactImageGrid: React.FC<ContactImageGridProps> = ({
  className,
  images = [],
}) => {
  if (images.length === 1) {
    const image = images[0]!;
    return (
      <div className={cn('aspect-[560/648]', className)}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width || 560}
          height={image.height || 648}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={cn('grid gap-2', className)}>
      {images.map((image, index) => (
        <div key={index} className="overflow-hidden rounded-lg">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width || 560}
            height={image.height || 648}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default ContactImageGrid;
