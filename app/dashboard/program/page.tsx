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
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// URL API
const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

// Interfaces
type Category = {
  id: string;
  name: string;
};

type ProgramMBKM = {
  id_program_mbkm: number;
  company: string;
  deskripsi: string | null;
  syarat: string | null;
  role: string;
  status: string;
  date: string;
  category_id: string;
  Category: Category;
};

type PendaftaranMBKM = {
  status: string;
  id_program_mbkm: number;
};

export default function ProgramMBKMPage() {
  const [programs, setPrograms] = useState<ProgramMBKM[]>([]);
  const [pendaftaran, setPendaftaran] = useState<PendaftaranMBKM[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token'); // Ambil token dari cookies

    if (token) {
      try {
        const decodedToken = jwtDecode<{ NIM: string }>(token); // Decode token
        const nim = decodedToken.NIM; // Ambil NIM dari token
        fetchPendaftaran(nim);
        fetchPrograms();
      } catch (err) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    setLoading(false);
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get<ProgramMBKM[]>(
        `${API_BASE_URL}/program-mbkm`
      );
      setPrograms(response.data);
    } catch (err) {
      setPrograms([]);
    }
  };

  const fetchPendaftaran = async (nim: string) => {
    try {
      const response = await axios.get<PendaftaranMBKM[]>(
        `${API_BASE_URL}/pendaftaran-mbkm/nim/${nim}`
      );
      setPendaftaran(response.data);
    } catch (err) {
      setLoading(false);
    }
  };

  const registeredProgramIds = new Set(
    pendaftaran.map((p) => p.id_program_mbkm)
  );

  console.log('programs: ', programs);
  console.log('registered: ', registeredProgramIds);

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
                .filter(
                  (program) =>
                    program.status === 'Active' &&
                    !registeredProgramIds.has(program.id_program_mbkm)
                )
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
                      <p className="line-clamp-3 text-base text-muted-foreground">
                        {program.deskripsi ?? 'Deskripsi tidak tersedia'}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        <strong>Syarat:</strong>{' '}
                        {program.syarat ?? 'Syarat tidak tersedia'}
                      </p>
                    </CardContent>
                    <div className="mt-auto flex w-full items-end justify-between gap-x-4 p-4">
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        <strong>Role:</strong>{' '}
                        {program.role || 'Tidak dicantumkan'}
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
                .filter((program) => program.status !== 'Active')
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
                      <p className="line-clamp-3 text-base text-muted-foreground">
                        {program.deskripsi ?? 'Deskripsi tidak tersedia'}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        <strong>Syarat:</strong>{' '}
                        {program.syarat ?? 'Syarat tidak tersedia'}
                      </p>
                    </CardContent>
                    <div className="mt-auto flex w-full items-end justify-between gap-x-4 p-4">
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        <strong>Role:</strong>{' '}
                        {program.role || 'Tidak dicantumkan'}
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
