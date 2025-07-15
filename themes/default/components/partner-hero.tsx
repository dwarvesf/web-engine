import React from 'react';
import { cn } from '../utils';
import Section from './section';
import { Paragraph } from './ui';

interface PartnerHeroProps {
  className?: string;
  title?: string;
  description?: string;
  backgroundImage?: string;
}

const PartnerHero: React.FC<PartnerHeroProps> = ({
  className,
  title,
  description,
  backgroundImage,
}) => {
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
          <h1 className="mb-6 text-4xl leading-tight font-bold md:text-5xl">
            {title}
          </h1>
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
