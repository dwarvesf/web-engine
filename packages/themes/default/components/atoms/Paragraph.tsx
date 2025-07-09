import { cn } from '../lib/utils';

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export default function Paragraph({
  children,
  className = '',
  ...props
}: ParagraphProps) {
  return (
    <p
      className={cn('text-foreground mb-4 leading-relaxed', className)}
      {...props}
    >
      {children}
    </p>
  );
}
