interface ListProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function UnorderedList({
  children,
  className = '',
  ...props
}: ListProps) {
  return (
    <ul
      className={`mb-4 list-inside list-disc space-y-1 ${className}`}
      {...props}
    >
      {children}
    </ul>
  );
}

export function OrderedList({ children, className = '', ...props }: ListProps) {
  return (
    <ol
      className={`mb-4 list-inside list-decimal space-y-1 ${className}`}
      {...props}
    >
      {children}
    </ol>
  );
}

export function ListItem({ children, className = '', ...props }: ListProps) {
  return (
    <li className={`text-foreground ${className}`} {...props}>
      {children}
    </li>
  );
}

export default UnorderedList;
