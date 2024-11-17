'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Mahasiswa } from '@/constants/data';

export const columns: ColumnDef<Mahasiswa>[] = [
  {
    accessorKey: 'fullname',
    header: 'Nama Lengkap'
  },
  {
    accessorKey: 'nim',
    header: 'NIM'
  },
  {
    id: 'kegiatanCompany',
    accessorKey: 'kegiatan.company',
    header: 'Perusahaan'
  },
  {
    id: 'kegiatanCategoryName',
    accessorKey: 'kegiatan.category.name',
    header: 'Kategori'
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
