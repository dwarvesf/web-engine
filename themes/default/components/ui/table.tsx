import React from 'react';
import { cn } from '../../utils';

export function Table({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="mb-4 overflow-x-auto">
      <table
        className={cn('border-border w-full border-collapse border', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHead({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn('bg-secondary', className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn('border-border border-b', className)} {...props}>
      {children}
    </tr>
  );
}

export function TableHeader({
  children,
  className = '',
  ...props
}: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) {
  return (
    <th
      className={cn(
        'border-border border px-4 py-2 text-left font-semibold',
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className = '',
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('border-border border px-4 py-2', className)} {...props}>
      {children}
    </td>
  );
}

export default Table;
