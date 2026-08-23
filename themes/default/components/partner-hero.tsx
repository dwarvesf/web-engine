import React from 'react';
import { cn } from '../utils';
import Section from './section';
import { Paragraph } from './ui';
import type { HeadingLevel } from './ui/heading';

interface PartnerHeroProps {
  className?: string;
  title?: string;
  /** Tag for the title. The classes below stay the same whatever this says. */
  headingLevel?: HeadingLevel;
  description?: string;
  backgroundImage?: string;
}

const PartnerHero: React.FC<PartnerHeroProps> = ({
  className,
  title,
  headingLevel = 1,
  description,
  backgroundImage,
}) => {
  const Title = `h${headingLevel}` as const;
  return (
    <Section
      className={cn(
        'relative mt-16 bg-cover bg-center bg-no-repeat py-0 text-white',
        className,
      )}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="relative container py-20">
        <div className="max-w-2xl">
          <Title className="mb-6 text-4xl leading-tight font-bold md:text-5xl">
            {title}
          </Title>
          <div className="mb-8 space-y-4 text-xl">
            <Paragraph className="text-xl whitespace-pre-line">
              {description}
            </Paragraph>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default PartnerHero;
