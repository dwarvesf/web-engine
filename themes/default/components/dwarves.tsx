import Heading, { H1 } from './ui/heading';
import Image from './ui/image';
import Paragraph from './ui/paragraph';
import { cn } from '../utils';

interface DwarvesProps {
  className?: string;
  title: string;
  subtitle: string;
  description: string;
  companyName: string;
  pronunciation: string;
  companyDescription: string;
  imageSrc: string;
  imageAlt: string;
}

const Dwarves = ({
  className = '',
  title,
  subtitle,
  description,
  companyName,
  pronunciation,
  companyDescription,
  imageSrc,
  imageAlt,
  ...rest
}: DwarvesProps) => (
  <section
    className={cn(
      'dwarves-container mt-16 pt-12 pb-10 md:py-16 lg:mt-0 lg:py-30',
      className,
    )}
    {...rest}
  >
    <div className="flex flex-wrap items-center justify-between">
      <div className="mb-10 w-full md:mb-0 md:w-1/2">
        {subtitle && (
          <Paragraph className="text-muted-foreground text-md mb-4 font-bold uppercase">
            {subtitle}
          </Paragraph>
        )}
        <H1 className="text-foreground mb-6 leading-tight whitespace-pre-line">
          {/* Break title */}
          {title?.replace(/\\n/g, '\n')}
        </H1>
        {description && (
          <Paragraph className="text-foreground mb-8 text-xl whitespace-pre-line">
            {description.replace(/\\n/g, '\n')}
          </Paragraph>
        )}

        <Heading level={3} variant="accent" className="mb-2">
          {companyName}
        </Heading>
        <span className="mb-2 block text-xl font-medium">{pronunciation}</span>
        <Paragraph>{companyDescription}</Paragraph>
      </div>
      <div className="w-full md:w-1/2 lg:w-5/12">
        <Image
          src={imageSrc}
          alt={imageAlt}
          className="w-full"
          objectFit="cover"
        />
      </div>
    </div>
  </section>
);

export default Dwarves;
