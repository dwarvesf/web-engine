import { cn } from '../utils';
import { Flex } from './ui';
import Heading from './ui/heading';
import Image from './ui/image';
import Paragraph from './ui/paragraph';

interface ValueItem {
  title: string;
  content: string;
  icon: string;
}

interface StatItem {
  value: string;
  title: string;
}

interface WhatWeValueProps {
  className?: string;
  title: string;
  values: ValueItem[];
  stats: StatItem[];
  description: string;
  imageSrc: string;
  imageAlt: string;
}

const WhatWeValue = ({
  className = '',
  title,
  values,
  stats,
  description,
  imageSrc,
  imageAlt,
  ...rest
}: WhatWeValueProps) => (
  <section
    className={cn(
      'dwarves-container py-10 text-center md:py-16 lg:py-30',
      className,
    )}
    {...rest}
  >
    <div className="mx-auto mb-10 w-full md:mb-20 md:w-1/2">
      <Heading level={2} align="center">
        {title}
      </Heading>
    </div>

    <Flex className="mb-10 flex flex-wrap justify-center gap-10 md:mb-20 md:flex-nowrap">
      {values.map(item => (
        <div className="mb-10 w-full md:w-1/2 lg:w-1/3" key={item.title}>
          <div className="bg-alabaster h-full px-12 py-10">
            <div className="mx-auto mb-8 flex h-16 items-center justify-center text-center">
              <Image
                src={item.icon}
                alt={item.icon}
                className="relative h-16 w-16"
                containerClassName="w-fit h-fit mx-auto"
              />
            </div>
            <h6 className="mb-4 text-lg font-semibold uppercase">
              {item.title}
            </h6>
            <Paragraph className="text-foreground text-center">
              {item.content}
            </Paragraph>
          </div>
        </div>
      ))}
    </Flex>

    <div className="mx-auto mb-20 w-full md:w-2/5">
      <Paragraph className="text-center text-lg">{description}</Paragraph>
    </div>

    <div className="mb-20 flex flex-wrap justify-around">
      {stats.map(item => (
        <div
          key={item.title}
          className="mb-10 w-1/2 space-y-4 text-center sm:w-auto"
        >
          <strong className="block text-6xl font-semibold">{item.value}</strong>
          <span className="text-xl font-medium">{item.title}</span>
        </div>
      ))}
    </div>

    <Image
      src={imageSrc}
      alt={imageAlt}
      className="w-full"
      objectFit="contain"
    />
  </section>
);

export default WhatWeValue;
