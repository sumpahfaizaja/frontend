import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { MahasiswaTable } from '@/components/tables/mahasiswa-tables/mahasiswa-table';
import { mahasiswa } from '@/constants/data';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Data Mahasiswa', link: '/dashboard/mahasiswa' }
];
export default function page() {
  return (
    <PageContainer scrollable>
      <div className="flex flex-col gap-y-2">
        <Breadcrumbs items={breadcrumbItems} />
        <MahasiswaTable data={mahasiswa} />
      </div>
    </PageContainer>
  );
}
