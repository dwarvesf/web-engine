import React from 'react';
import Flex, { Column } from './ui/flex';
import { H1, type HeadingLevel } from './ui/heading';
import { Paragraph } from './ui';

interface ContentBoxesProps {
  title?: React.ReactNode;
  /** Tag for the title. Styling stays at level 1 whatever this says. */
  headingLevel?: HeadingLevel;
  leftColumnContent?: React.ReactNode;
  rightColumnContent?: React.ReactNode;
  className?: string;
}

const ContentBoxes: React.FC<ContentBoxesProps> = ({
  title,
  headingLevel,
  leftColumnContent,
  rightColumnContent,
  className = '',
}) => {
  return (
    <Column className={className}>
      {typeof title === 'string' ? (
        <H1
          headingLevel={headingLevel}
          className="text-foreground mb-6 leading-tight whitespace-pre-line"
        >
          {title?.replace(/\\n/g, '\n')}
        </H1>
      ) : (
        title
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
    </Column>
  );
};

export default ContentBoxes;
