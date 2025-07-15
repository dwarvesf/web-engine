import React from 'react';
import { cn } from '../../utils';
import Heading from './heading';
import Paragraph from './paragraph';
import Typography from './typography';
import { Stack } from './flex';

interface SolutionHighlightProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  title: string;
  description: string;
  bgGraphic?: string; // Optional background graphic
}

export default function SolutionHighlight({
  label,
  title,
  description,
  className,
  bgGraphic,
  ...props
}: SolutionHighlightProps) {
  return (
    <div
      className={cn(
        'border-alto h-full rounded-lg border bg-[100%_100%] bg-no-repeat px-8 py-6 md:py-12 md:pr-12 md:pl-12 xl:pr-40',
        'dwarves-shadow-sm', // Consistent shadow with other cards
        className,
      )}
      {...props}
      style={{ backgroundImage: `url(${bgGraphic})` }}
    >
      <Stack>
        <Typography
          weight="normal"
          variant="small"
          className="text-primary uppercase"
        >
          {label}
        </Typography>
        <Heading level={5} size="xl" className="font-medium">
          {title}
        </Heading>
        <Paragraph className="text-foreground">{description}</Paragraph>
      </Stack>
    </div>
  );
}
