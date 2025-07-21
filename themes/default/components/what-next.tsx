import { cn } from '../utils';
import { Button, Container } from './ui';
import Section from './section';

interface WhatNextProps {
  link: string;
  label: string;
  className?: string;
}

export default function WhatNext({ className, label, link }: WhatNextProps) {
  return (
    <Section fullWidth className={cn('bg-foreground py-12', className)}>
      <Container className="dwarves-container">
        <h2 className="flex-column text-heading text-muted items-center justify-center text-3xl sm:flex">
          <span>What’s next:</span>
          <Button
            variant="link"
            className="text-primary inline items-center text-3xl"
            href={link}
          >
            {label}
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 16 16"
              className="ml-1"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 13.887l5-5V8.18l-5-5-.707.707 4.146 4.147H2v1h10.44L8.292 13.18l.707.707z"
              />
            </svg>
          </Button>
        </h2>
      </Container>
    </Section>
  );
}
