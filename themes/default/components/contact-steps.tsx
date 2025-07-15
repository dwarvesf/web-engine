import React from 'react';
import { cn } from '../utils';
import { H4, Paragraph } from './ui';

interface Step {
  title: string;
  subtitle: string;
  description: string;
}

interface ContactStepsProps {
  className?: string;
  steps?: Step[];
}

const ContactSteps: React.FC<ContactStepsProps> = ({
  className,
  steps = [],
}) => {
  return (
    <div className={cn('mt-24 flex flex-wrap', className)}>
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-3 lg:gap-12">
        {steps.map((step, index) => (
          <div
            key={index}
            className="space-y-4 not-first:pl-8 not-last:pr-8 first:pr-8 last:pl-8"
          >
            <Paragraph className="text-primary text-md block font-semibold tracking-wider uppercase">
              {step.title}
            </Paragraph>
            <H4>{step.subtitle}</H4>
            <p className="text-lg whitespace-pre-line">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactSteps;
