import React from 'react';
import { H5, Paragraph } from '.';
import { cn } from '../utils';

interface SubSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function SubSection({
  title,
  children,
  className,
}: SubSectionProps) {
  return (
    <div className={cn('mb-8', className)}>
      <H5 className="text-primary mb-4 text-lg font-semibold">{title}</H5>
      <Paragraph className="text-muted-foreground">{children}</Paragraph>
    </div>
  );
}
