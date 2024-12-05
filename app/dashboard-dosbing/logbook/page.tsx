'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import Link from 'next/link';

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

interface Laporan {
  id: string;
  judul: string;
  subjek: string;
  NIM: string;
  file?: string;
  nama_mahasiswa: string;
}

interface Mahasiswa {
  nama_mahasiswa: string;
}

export default function HalamanLogbook() {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogbook();
  }, []);

  const fetchLogbook = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/logbook`);
      const dataLaporan = response.data.map((item: any) => ({
        id: item.id_logbook,
        judul: item.judul || 'N/A',
        subjek: item.subjek || 'N/A',
        NIM: item.NIM || 'N/A',
        file: item.nama_file || null,
        nama_mahasiswa: item.Mahasiswa?.nama_mahasiswa || 'N/A'
      }));
      setLaporan(dataLaporan);
    } catch (error) {
      console.error('Kesalahan saat mengambil laporan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="m-6 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-col gap-y-4">
        <Heading
          title="Logbook"
          description="Daftar logbook yang telah dikirim oleh mahasiswa."
        />
        <Separator />

        <div className="rounded-md border bg-white shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Subjek</TableHead>
                <TableHead>NIM</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Nama Mahasiswa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {laporan.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Tidak ada laporan.
                  </TableCell>
                </TableRow>
              ) : (
                laporan.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.judul}</TableCell>
                    <TableCell>{item.subjek}</TableCell>
                    <TableCell>{item.NIM}</TableCell>
                    <TableCell>
                      {item.file ? (
                        <Button variant="default" size="sm" asChild>
                          <Link
                            href={item.file}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Lihat File
                          </Link>
                        </Button>
                      ) : (
                        'Tidak Ada File'
                      )}
                    </TableCell>
                    <TableCell>{item.nama_mahasiswa}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageContainer>
  );
}
