import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Button } from './button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export function EnhancedTable({ columns, data, onRowClick, sortable = true }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4" />;
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>
              {sortable && column.sortable !== false ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort(column.key)}
                  className="h-8 px-2"
                >
                  {column.label}
                  {getSortIcon(column.key)}
                </Button>
              ) : (
                column.label
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((row, idx) => (
          <TableRow
            key={idx}
            onClick={() => onRowClick?.(row)}
            className={onRowClick ? 'cursor-pointer' : ''}
          >
            {columns.map((column) => (
              <TableCell key={column.key}>
                {column.render ? column.render(row) : row[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
