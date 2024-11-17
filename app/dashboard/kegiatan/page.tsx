import { Breadcrumbs } from '@/components/breadcrumbs';
import EmptyState from '@/components/empty-state';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { kegiatan } from '@/constants/data';
import { ChevronsRight } from 'lucide-react';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Kegiatan', link: '/dashboard/kegiatan' }
];

export default function page() {
  return (
    <PageContainer scrollable={true}>
      <div className="flex h-full flex-col gap-y-2">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex flex-col items-start justify-between gap-y-4 lg:flex-row mb-2">
          <Heading
            title={`Kegiatan`}
            description="Kegiatan yang sedang berlangsung dan status pendaftaran program. Cek kembali informasi kegiatan yang sedang berlangsung dengan dosen/pihak yang bersangkutan."
          />
          <Button className="text-xs md:text-sm">Sejarah Kegiatan</Button>
        </div>
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className='mb-2'>
            <TabsTrigger value="active">Kegiatan Aktif</TabsTrigger>
            <TabsTrigger value="status">Status Pendaftaran</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {kegiatan.map((item, index) => (
                <div
                  key={index}
                  className="flex w-full cursor-pointer flex-col rounded-lg border bg-card p-4 text-card-foreground shadow-sm hover:border-primary/40"
                >
                  <p className="mb-1 text-xs font-medium text-foreground">
                    {item.category}
                  </p>
                  <h3 className="mb-4 line-clamp-2 text-ellipsis text-lg font-semibold">
                    {item.company}
                  </h3>
                  <div className="mt-auto flex items-center justify-between gap-x-3">
                    <p className="text-xs text-muted-foreground">
                      {item.semester}
                    </p>
                    <ChevronsRight size={16} />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="status" className="space-y-4">
            <EmptyState
              title="Tidak ada kegiatan"
              description="Tidak ada kegiatan yang sedang berlangsung. Coba cek kembali pada tab Kegiatan Aktif atau Status Pendaftaran"
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
