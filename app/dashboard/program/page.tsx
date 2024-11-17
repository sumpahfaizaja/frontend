import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { ProgramTable } from '@/components/tables/program-tables/program-table';
import { programs } from '@/constants/data';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Program', link: '/dashboard/program' }
];
export default function page() {
  return (
    <PageContainer scrollable>
      <div className="flex flex-col gap-y-2">
        <Breadcrumbs items={breadcrumbItems} />
        <ProgramTable data={programs} />
      </div>
      d
    </PageContainer>
  );
}
