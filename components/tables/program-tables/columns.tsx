'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Program } from '@/constants/data';

export const columns: ColumnDef<Program>[] = [
  {
    accessorKey: 'company',
    header: 'Perusahaan'
  },
  {
    id: 'categoryName',
    accessorKey: 'category.name',
    header: 'Kategori'
  },
  {
    accessorKey: 'role',
    header: 'Role'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
