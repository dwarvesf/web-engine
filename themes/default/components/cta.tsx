import { cn } from '../utils';
import Section from './section';
import { Paragraph, Link } from './ui';

interface Props {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  ctaLink?: string;
  ctaText?: string;
}

export default function CallToAction({
  title,
  description,
  className,
  ctaLink,
  ctaText,
}: Props) {
  return (
    <Section className={cn('py-16', className)} variant="muted">
      <div className="container">
        <div className="row md:flex">
          <h2 className="col mb-8 text-3xl font-medium md:mb-0 md:w-1/2">
            {title.replace(/\\n/g, '\n')}
          </h2>
          <div className="col md:w-1/2">
            {description && (
              <Paragraph className="mb-4">
                {description.replace(/\\n/g, '\n')}
              </Paragraph>
            )}
            {ctaLink && ctaText && (
              <Link
                href={ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex items-center"
              >
                {ctaText}
                <i className="anticon icon-right ml-2"></i>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
