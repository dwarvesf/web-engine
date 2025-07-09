import { cn } from '../lib/utils';

interface BlockquoteProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export default function Blockquote({
  children,
  className = '',
  ...props
}: BlockquoteProps) {
  return (
    <blockquote
      className={cn(
        'border-primary text-muted-foreground mb-4 border-l-4 pl-4 italic',
        className,
      )}
      {...props}
    >
      {children}
    </blockquote>
  );
}
