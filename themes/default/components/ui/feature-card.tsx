import React from 'react';
import { cn } from '../../utils';
import { H4 } from './heading';

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  bgImage: string;
  iconImg: string;
}

export default function FeatureCard({
  title,
  className,
  bgImage,
  iconImg,
  ...props
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        '-border flex flex-col items-start gap-4 rounded-lg border border-[#e7e7e7] bg-[#e7e7e7] p-6',
        'dwarves-shadow-sm', // Assuming a subtle shadow based on the image
        className,
      )}
      {...props}
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <img src={iconImg} alt="icon-img" className="mb-6" />
      <H4 className="whitespace-pre-line text-[#4b4b5b]">{title}</H4>
    </div>
  );
}
