'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

interface GradeConversion {
  id_konversi_nilai: number;
  grade: string;
  nama_berkas: string;
  nilai_akhir: number;
}

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

export default function AdminGradesPage() {
  const [nilaiMahasiswa, setNilaiMahasiswa] = useState<GradeConversion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchKonversiNilai();
  }, []);

  const getAuthToken = () => Cookies.get('token');

  const fetchKonversiNilai = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/konversi-nilai`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNilaiMahasiswa(response.data);
    } catch (error) {
      console.error('Kesalahan saat mengambil data nilai:', error);
    } finally {
      setLoading(false);
    }
  };

  const hapusNilai = async (id: number) => {
    const konfirmasi = window.confirm(
      'Apakah Anda yakin ingin menghapus nilai ini?'
    );

    if (konfirmasi) {
      try {
        const token = getAuthToken();
        await axios.delete(`${API_BASE_URL}/konversi-nilai/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Hapus item dari daftar lokal
        setNilaiMahasiswa((prevState) =>
          prevState.filter((nilai) => nilai.id_konversi_nilai !== id)
        );

        alert('Nilai berhasil dihapus!');
      } catch (error) {
        console.error('Kesalahan saat menghapus nilai:', error);
        alert('Terjadi kesalahan saat menghapus nilai.');
      }
    }
  };

  return (
    <PageContainer>
      <Heading
        title="Konversi Nilai Mahasiswa"
        description="Daftar file keperluan konversi nilai."
      />
      <Separator className="my-4" />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <Table className="w-full text-left">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="px-4 py-3">ID</TableHead>
                <TableHead className="px-4 py-3">Nilai awal</TableHead>
                <TableHead className="px-4 py-3">Nilai akhir</TableHead>
                <TableHead className="px-4 py-3 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nilaiMahasiswa.map((nilai, index) => (
                <TableRow
                  key={nilai.id_konversi_nilai}
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-100`}
                >
                  <TableCell className="px-4 py-3">
                    {nilai.id_konversi_nilai}
                  </TableCell>
                  <TableCell className="px-4 py-3">{nilai.grade}</TableCell>
                  <TableCell className="px-4 py-3">
                    {nilai.nilai_akhir}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => window.open(nilai.nama_berkas, '_blank')}
                      >
                        Detail
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => hapusNilai(nilai.id_konversi_nilai)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </PageContainer>
  );
}
