import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';

export function AppTable({ headers, rows, onRowClick, className = '' }) {
  return (
    <div className={`rounded-md border border-slate-700 ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, idx) => (
              <TableHead key={idx}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow
              key={idx}
              onClick={() => onRowClick?.(row, idx)}
              className={onRowClick ? 'cursor-pointer' : ''}
            >
              {row.map((cell, cellIdx) => (
                <TableCell key={cellIdx}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={headers.length} className="text-center text-slate-400">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
