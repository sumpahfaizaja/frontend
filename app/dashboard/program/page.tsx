'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// URL API
const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

// Interfaces
interface Category {
  id: string;
  name: string;
}

interface ProgramMBKM {
  id_program_mbkm: number;
  company: string;
  deskripsi: string | null;
  role: string;
  status: string;
  date: string;
  category_id: string;
  Category: Category;
}

export default function ProgramMBKMPage() {
  const [programs, setPrograms] = useState<ProgramMBKM[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch MBKM programs
  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get<ProgramMBKM[]>(
        `${API_BASE_URL}/program-mbkm`
      );
      setPrograms(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setLoading(false);
    }
  };

  return (
    <PageContainer scrollable={true}>
      <div className="flex items-center justify-between">
        <Heading
          title="Program MBKM"
          description="Semua program MBKM, mencakup program aktif dan tidak aktif."
        />
      </div>
      <Separator className="mb-4 mt-4" />

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="mb-2">
          <TabsTrigger value="active">Program Aktif</TabsTrigger>
          <TabsTrigger value="status">Program Tidak Aktif</TabsTrigger>
        </TabsList>

        {/* Tab Kegiatan Aktif */}
        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p>Loading...</p>
            ) : (
              programs
                .filter((program) => program.status === 'Active') // Filter kegiatan aktif
                .map((program) => (
                  <Card
                    key={program.id_program_mbkm}
                    className="flex flex-col shadow-lg"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {program.company}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3 text-base text-gray-600">
                        {program.deskripsi ?? 'Deskripsi tidak tersedia'}
                      </p>
                    </CardContent>
                    <div className="mt-auto flex w-full items-end justify-between gap-x-4 p-4">
                      <p className="line-clamp-1 text-sm text-gray-600">
                        <strong>Role:</strong> {program.role}
                      </p>
                      <Link
                        href={`/dashboard/program/${program.id_program_mbkm}`}
                      >
                        <Button
                          variant="default"
                          size={'sm'}
                          className="w-full"
                        >
                          Daftar
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>

        {/* Tab Status Pendaftaran */}
        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p>Loading...</p>
            ) : (
              programs
                .filter((program) => program.status !== 'Active') // Filter kegiatan tidak aktif
                .map((program) => (
                  <Card
                    key={program.id_program_mbkm}
                    className="flex flex-col shadow-lg"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {program.company}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3 text-base text-gray-600">
                        {program.deskripsi ?? 'Deskripsi tidak tersedia'}
                      </p>
                    </CardContent>
                    <div className="mt-auto flex w-full items-end justify-between gap-x-4 p-4">
                      <p className="line-clamp-1 text-sm text-gray-600">
                        <strong>role:</strong> {program.role}
                      </p>
                    </div>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
