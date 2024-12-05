import DocumentForm from '@/components/forms/dokumen-form';
import PageContainer from '@/components/layout/page-container';

export default function page() {
  return (
    <PageContainer scrollable={true}>
      <DocumentForm />
    </PageContainer>
  );
}
