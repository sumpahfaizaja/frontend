'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

interface PendaftaranMBKM {
  id_pendaftaran_mbkm: number;
  NIM: number;
  NIP_dosen: string;
  tanggal: string;
  nama_berkas: string;
  id_program_mbkm: number;
  status: 'pending' | 'verif';
}

interface ProgramMBKM {
  id_program_mbkm: number;
  company: string;
  deskripsi: string | null;
  role: string | null;
  status: string;
  date: string;
  waktu_pelaksanaan: string | null;
  category: {
    id: string;
    name: string;
  };
}

export default function ProgramMBKMPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingRegistrations, setPendingRegistrations] = useState<
    PendaftaranMBKM[]
  >([]);
  const [verifiedRegistrations, setVerifiedRegistrations] = useState<
    PendaftaranMBKM[]
  >([]);
  const [programDetails, setProgramDetails] = useState<
    Record<number, ProgramMBKM>
  >({});

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      try {
        const decodedToken = jwtDecode<{ NIM: string }>(token);
        const nim = Number(decodedToken.NIM);

        fetch(`${API_BASE_URL}/pendaftaran-mbkm/nim/${nim}`)
          .then((response) => response.json())
          .then(async (data: PendaftaranMBKM[]) => {
            setPendingRegistrations(
              data.filter((item) => item.status === 'pending')
            );
            setVerifiedRegistrations(
              data.filter((item) => item.status === 'verif')
            );

            // Fetch program details for each registration
            const programPromises = data.map((item) =>
              fetch(`${API_BASE_URL}/program-mbkm/${item.id_program_mbkm}`)
                .then((res) => res.json())
                .catch((err) => {
                  console.error(
                    `Gagal mengambil detail program untuk ID: ${item.id_program_mbkm}`,
                    err
                  );
                  return null;
                })
            );

            const programs = await Promise.all(programPromises);
            const programMap = programs.reduce(
              (acc, program) => {
                if (program) acc[program.id_program_mbkm] = program;
                return acc;
              },
              {} as Record<number, ProgramMBKM>
            );

            setProgramDetails(programMap);
            setLoading(false);
          })
          .catch((err) => {
            console.error(err);
            setError('Gagal mengambil data');
            setLoading(false);
          });
      } catch (err) {
        console.error(err);
        setError('Token tidak valid');
        setLoading(false);
      }
    } else {
      setError('Token tidak ditemukan');
      setLoading(false);
    }
  }, []);

  const renderProgramDetails = (id: number) => {
    const program = programDetails[id];
    if (!program) return <p>Detail program tidak tersedia</p>;

    return (
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Jenis Program:</span>
          <span className="font-semibold">
            {program.category?.name || 'Tidak ada keterangan'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">
            Tanggal Pelaksanaan:
          </span>
          <span className="font-semibold">
            {program.waktu_pelaksanaan
              ? new Date(program.waktu_pelaksanaan).toLocaleDateString(
                  'id-ID',
                  {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }
                )
              : 'Tidak ada keterangan'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <PageContainer scrollable>
      <Heading
        title="Program MBKM"
        description="Daftar program MBKM berdasarkan status pendaftaran"
      />
      <Separator className="my-4" />
      {loading ? (
        <p>Memuat...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="verified">Terverifikasi</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            {verifiedRegistrations.length > 0 ? (
              <p>
                Data pada tab pending disembunyikan karena ada data yang
                terverifikasi.
              </p>
            ) : pendingRegistrations.length > 0 ? (
              pendingRegistrations.map((item) => {
                const program = programDetails[item.id_program_mbkm];
                return (
                  <Card
                    key={item.id_pendaftaran_mbkm}
                    className="mb-4 shadow-md"
                  >
                    <CardHeader>
                      <CardTitle>
                        {program?.company || 'Program tidak ditemukan'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Tanggal Pendaftaran:
                          </span>
                          <span className="font-semibold">
                            {new Date(item.tanggal).toLocaleDateString(
                              'id-ID',
                              {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              }
                            )}
                          </span>
                        </div>
                        {renderProgramDetails(item.id_program_mbkm)}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <p>Tidak ada program yang pending</p>
            )}
          </TabsContent>

          <TabsContent value="verified">
            {verifiedRegistrations.length > 0 ? (
              verifiedRegistrations.map((item) => {
                const program = programDetails[item.id_program_mbkm];
                return (
                  <Card
                    key={item.id_pendaftaran_mbkm}
                    className="mb-4 shadow-md"
                  >
                    <CardHeader>
                      <CardTitle>
                        {program?.company || 'Program tidak ditemukan'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Tanggal Pendaftaran:
                          </span>
                          <span className="font-semibold">
                            {new Date(item.tanggal).toLocaleDateString(
                              'id-ID',
                              {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              }
                            )}
                          </span>
                        </div>
                        {renderProgramDetails(item.id_program_mbkm)}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <p>Tidak ada program yang terverifikasi</p>
            )}
          </TabsContent>
        </Tabs>
      )}
    </PageContainer>
  );
}
