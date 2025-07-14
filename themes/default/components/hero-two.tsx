import { PropsWithChildren } from 'react';
import { Paragraph } from './ui';
import Section from './section';

interface HeroTwoProps {
  title: string;
  description?: string;
  className?: string;
}

export default function HeroTwo({
  title,
  description,
  className = '',
  children,
}: PropsWithChildren<HeroTwoProps>) {
  return (
    <Section className={className}>
      <div className="container">
        <div className="row py-16 lg:flex lg:items-center lg:justify-between lg:py-10">
          <div className="col lg:w-5/12">
            <h1 className="mb-8 text-3xl leading-tight font-medium lg:-mr-8">
              {title.replace(/\\n/g, '\n')}
            </h1>
            {description && (
              <Paragraph className="leading-relax">
                {description.replace(/\\n/g, '\n')}
              </Paragraph>
            )}
          </div>
          <div className="col lg:w-1/2">{children}</div>
        </div>
      </div>
    </Section>
  );
}
