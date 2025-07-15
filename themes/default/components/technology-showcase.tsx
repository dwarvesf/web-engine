import { cn } from '../utils/index';
import Section from './section';

interface Props {
  className?: string;
  title: string;
  description: string;
  logoUrls: string[];
}

export default function TechnologyShowcase(props: Props) {
  const { description, logoUrls, title, className } = props;

  return (
    <Section className={cn('technology-showcase', className)}>
      <div className="mx-auto w-full md:w-3/4">
        <h2 className="text-center text-2xl font-medium text-black/50">
          {title}
        </h2>
        <div className="mb-14 text-center text-base font-medium text-black/50">
          {description}
        </div>
        <div className="-mx-4 flex flex-wrap items-center justify-center">
          {logoUrls.map(url => (
            <span key={url} className="mb-6 w-24 px-6">
              <img src={url} />
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}
