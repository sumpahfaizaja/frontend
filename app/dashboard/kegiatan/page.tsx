'use client'; // Ensure this component is client-side

import { useEffect, useState } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import EmptyState from '@/components/empty-state';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronsRight } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation in App Router

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Kegiatan', link: '/dashboard/kegiatan' }
];

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

const ProgramModal = ({
  program,
  onClose
}: {
  program: any;
  onClose: () => void;
}) => {
  if (!program) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6">
        <h3 className="mb-4 text-xl font-semibold">
          {program.deskripsi || 'No description available'}
        </h3>
        <p>
          <strong>Instansi:</strong>{' '}
          {program.company || 'No instansi information available'}
        </p>
        <Button className="mt-4" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default function Page() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const router = useRouter(); // Correctly use router from next/navigation

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/program-mbkm`);
      setPrograms(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setLoading(false);
    }
  };

  const handleCardClick = (programId: number) => {
    router.push(`/dashboard/logbook?id_program_mbkm=${programId}`);
  };

  const handleCloseModal = () => {
    setSelectedProgram(null);
  };

  return (
    <PageContainer scrollable={true}>
      <div className="flex h-full flex-col gap-y-2">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="mb-2 flex flex-col items-start justify-between gap-y-4 lg:flex-row">
          <Heading
            title={`Kegiatan`}
            description="Kegiatan yang sedang berlangsung dan status pendaftaran program. Cek kembali informasi kegiatan yang sedang berlangsung dengan dosen/pihak yang bersangkutan."
          />
          <Button className="text-xs md:text-sm">Sejarah Kegiatan</Button>
        </div>
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="mb-2">
            <TabsTrigger value="active">Kegiatan Aktif</TabsTrigger>
            <TabsTrigger value="status">Status Pendaftaran</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading ? (
                <div>Loading...</div>
              ) : (
                programs.map((program) => (
                  <div
                    key={program.id_program_mbkm}
                    className="flex w-full cursor-pointer flex-col rounded-lg border bg-card p-4 text-card-foreground shadow-sm hover:border-primary/40"
                    onClick={() => handleCardClick(program.id_program_mbkm)}
                  >
                    <h3 className="mb-4 line-clamp-2 text-ellipsis text-lg font-semibold">
                      {program.deskripsi || 'No description available'}
                    </h3>
                    <div className="mt-auto flex items-center justify-between gap-x-3">
                      <p className="text-xs text-muted-foreground">
                        {program.company || 'No instansi available'}
                      </p>
                      <ChevronsRight size={16} />
                    </div>
                  </div>
                ))
              )}
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

      {selectedProgram && (
        <ProgramModal program={selectedProgram} onClose={handleCloseModal} />
      )}
    </PageContainer>
  );
}
