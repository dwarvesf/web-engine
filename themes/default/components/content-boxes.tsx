import React from 'react';
import Section from './section';
import Flex from './ui/flex';
import { H1 } from './ui/heading';
import { Paragraph } from './ui';

interface ContentBoxesProps {
  title?: string;
  leftColumnContent?: React.ReactNode;
  rightColumnContent?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const ContentBoxes: React.FC<ContentBoxesProps> = ({
  title,
  leftColumnContent,
  rightColumnContent,
  className = '',
  fullWidth = false,
}) => {
  return (
    <Section className={className} fullWidth={fullWidth}>
      {title && (
        <H1 className="text-foreground mb-6 leading-tight whitespace-pre-line">
          {title?.replace(/\\n/g, '\n')}
        </H1>
      )}
      <Flex className="flex-col gap-8 md:flex-row">
        {leftColumnContent && (
          <div className="md:max-w-paragraph whitespace-pre-line xl:max-w-[45em]">
            <Paragraph className="text-xl">{leftColumnContent}</Paragraph>
          </div>
        )}
        {rightColumnContent && (
          <div className="flex-1 whitespace-pre-line">
            <Paragraph className="text-xl">{rightColumnContent}</Paragraph>
          </div>
        )}
      </Flex>
    </Section>
  );
};

export default ContentBoxes;
