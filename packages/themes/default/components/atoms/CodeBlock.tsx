import { cn } from '../lib/utils';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function CodeBlock({
  children,
  className = '',
  ...props
}: CodeBlockProps) {
  return (
    <pre
      className={cn('bg-muted mb-4 overflow-x-auto rounded-lg p-4', className)}
      {...props}
    >
      {children}
    </pre>
  );
}

export function InlineCode({
  children,
  className = '',
  ...props
}: CodeBlockProps) {
  return (
    <code
      className={cn('bg-muted rounded px-2 py-1 text-sm', className)}
      {...props}
    >
      {children}
    </code>
  );
}

export default CodeBlock;
