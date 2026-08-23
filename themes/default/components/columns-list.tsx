import { cn } from '../utils';
import { Container, H1 } from './ui';
import type { HeadingLevel } from './ui/heading';

function ColumnsList({
  children,
  className = '',
  as = 'ul',
  title,
  headingLevel,
  columns,
  circle = true,
  ...props
}: React.HTMLAttributes<HTMLUListElement> & {
  title?: string;
  /** Tag for the title. Styling stays at level 1 whatever this says. */
  headingLevel?: HeadingLevel;
  as?: React.ElementType;
  columns?: number;
  circle?: boolean;
}) {
  const Element = as;
  const getColumnsClass = () => {
    switch (columns) {
      case 1:
        return 'md:columns-1';
      case 2:
        return 'md:columns-2';
      case 3:
        return 'md:columns-3';
      case 4:
        return 'md:columns-4';
      case 5:
        return 'md:columns-5';
      default:
        return 'md:columns-2'; // Default to 2 columns if not specified or invalid
    }
  };

  return (
    <Container className="max-w-none py-4">
      {title && (
        <H1
          headingLevel={headingLevel}
          className="text-foreground mb-6 leading-tight whitespace-pre-line"
        >
          {title?.replace(/\\n/g, '\n')}
        </H1>
      )}
      <Element
        className={cn(
          'mb-4 ml-5 list-outside space-y-1',
          circle
            ? '!list-[circle]'
            : as === 'ul'
              ? '!list-disc'
              : '!list-decimal',
          getColumnsClass(),
          className,
        )}
        {...props}
      >
        {children}
      </Element>
    </Container>
  );
}

export default ColumnsList;
