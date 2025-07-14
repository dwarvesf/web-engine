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
    <Section container className={cn('technology-showcase', className)}>
      <div className="container">
        <div className="mx-auto w-full md:w-3/4">
          <h2 className="text-black-50 text-center text-2xl font-medium">
            {title}
          </h2>
          <div className="text-black-50 mb-14 text-center text-base font-medium">
            {description}
          </div>
          <div className="-mx-4 flex flex-wrap items-center justify-center lg:justify-between">
            {logoUrls.map(url => (
              <span key={url} className="mb-5 w-25 px-4">
                <img src={url} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
