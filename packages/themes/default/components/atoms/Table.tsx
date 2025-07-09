interface TableProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function Table({ children, className = '', ...props }: TableProps) {
  return (
    <div className="mb-4 overflow-x-auto">
      <table
        className={`border-border w-full border-collapse border ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className = '', ...props }: TableProps) {
  return (
    <thead className={`bg-secondary ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '', ...props }: TableProps) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '', ...props }: TableProps) {
  return (
    <tr className={`border-border border-b ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableHeader({
  children,
  className = '',
  ...props
}: TableProps) {
  return (
    <th
      className={`border-border border px-4 py-2 text-left font-semibold ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = '', ...props }: TableProps) {
  return (
    <td className={`border-border border px-4 py-2 ${className}`} {...props}>
      {children}
    </td>
  );
}

export default Table;
