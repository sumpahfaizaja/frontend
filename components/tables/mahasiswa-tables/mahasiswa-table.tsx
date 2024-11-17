'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Mahasiswa } from '@/constants/data';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';

interface MahasiswaProps {
  data: Mahasiswa[];
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

export const MahasiswaTable: React.FC<MahasiswaProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="mb-2 flex flex-col items-start justify-between gap-y-4 lg:flex-row">
        <Heading
          title={`Mahasiswa (${data.length})`}
          description="Kumpulan Mahasiswa SI-MBKM yang tersedia. Cek kembali informasi Mahasiswa yang tersedia di situs resmi Kampus Merdeka."
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/mahasiswa/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <DataTable searchKey="fullname" columns={columns} data={data} filterKey={filterKey}/>
    </>
  );
};
