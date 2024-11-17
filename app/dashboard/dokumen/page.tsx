import { Breadcrumbs } from '@/components/breadcrumbs';
import DocumentForm from '@/components/forms/dokumen-form';
import PageContainer from '@/components/layout/page-container';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Dokumen', link: '/dashboard/dokumen' }
];
export default function page() {
  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-y-2">
        <Breadcrumbs items={breadcrumbItems} />
        <DocumentForm />
      </div>
    </PageContainer>
  );
}
