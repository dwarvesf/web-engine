import { cn } from '../utils';
import Heading from './ui/heading';
import Image from './ui/image';
import Paragraph from './ui/paragraph';

interface WhatWeStandForProps {
  className?: string;
  title: string;
  quote: string;
  author: string;
  authorTitle: string;
  authorImageSrc: string;
  authorImageAlt: string;
  teamImageSrc: string;
  teamImageAlt: string;
}

const WhatWeStandFor = ({
  className = '',
  title,
  quote,
  author,
  authorTitle,
  authorImageSrc,
  authorImageAlt,
  teamImageSrc,
  teamImageAlt,
  ...rest
}: WhatWeStandForProps) => (
  <section
    className={cn(
      'dwarves-container flex items-center justify-center py-20',
      className,
    )}
    {...rest}
  >
    <div className="container">
      <Heading level={2} align="center" className="mb-10 lg:mb-20">
        {title}
      </Heading>
      <div className="border-alto flex flex-wrap justify-between border p-5 shadow-sm md:p-24">
        <div className="mb-16 flex w-full flex-row justify-center lg:mb-0 lg:w-1/3 lg:flex-col">
          <div
            className="mx-5 w-full max-w-[300px] -rotate-5 transform overflow-hidden rounded-lg bg-[#ebebeb] px-5 pt-5 pb-10"
            style={{
              boxShadow: '0 10px 20px 0 rgba(0,0,0,.4)',
            }}
          >
            <Image
              src={authorImageSrc}
              alt={authorImageAlt}
              className="aspect-[260/295] rounded object-cover"
              objectFit="cover"
            />
          </div>
          <div
            className="mt-20 hidden w-full max-w-[300px] rotate-[3.72deg] transform overflow-hidden rounded-lg bg-[#ebebeb] px-5 pt-5 pb-10 lg:block"
            style={{
              boxShadow: '0 10px 20px 0 rgba(0,0,0,.4)',
            }}
          >
            <Image
              src={teamImageSrc}
              alt={teamImageAlt}
              className="aspect-[360/286] w-full rounded object-cover"
              objectFit="cover"
            />
          </div>
        </div>
        <div className="w-full lg:w-3/5">
          <blockquote className="space-y-4">
            <span className="mb-3 block text-2xl font-semibold">Dear</span>
            <span className="mb-6 block font-medium">
              from Dwarves Foundation
            </span>
            <Paragraph className="whitespace-pre-line italic">
              {quote}
            </Paragraph>
            <footer className="font-medium">
              - {author}, {authorTitle}
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  </section>
);

export default WhatWeStandFor;
