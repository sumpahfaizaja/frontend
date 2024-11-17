'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Program } from '@/constants/data';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';

interface ProgramProps {
  data: Program[];
}

const filterKey: { id: string; name: string }[] = [
  { id: 'iisma', name: 'IISMA' },
  { id: 'student-exchange', name: 'Pertukaran Mahasiswa Merdeka' },
  { id: 'bootcamp', name: 'Bootcamp' },
  { id: 'bangkit-academy', name: 'Bangkit Academy' },
  { id: 'magang-msib', name: 'Magang MSIB' },
  { id: 'studi-independen', name: 'Studi Independen' },
  { id: 'kampus-mengajar', name: 'Kampus Mengajar' }
];

export const ProgramTable: React.FC<ProgramProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col items-start justify-between gap-y-4 lg:flex-row mb-2">
        <Heading
          title={`Program (${data.length})`}
          description="Kumpulan program SI-MBKM yang tersedia. Cek kembali informasi program yang tersedia di situs resmi Kampus Merdeka."
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/program/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <DataTable searchKey="company" columns={columns} data={data} filterKey={filterKey}/>
    </>
  );
};
