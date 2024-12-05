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

interface GradeConversion {
  id_konversi_nilai: number;
  grade: string;
  nama_berkas: string; // URL file Cloudinary
}

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

export default function AdminGradesPage() {
  const [nilaiMahasiswa, setNilaiMahasiswa] = useState<GradeConversion[]>([]);
  const [memuat, setMemuat] = useState<boolean>(true);

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
      setMemuat(false);
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
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Daftar Nilai Mahasiswa</h1>
      {memuat ? (
        <p>Memuat...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nilai</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nilaiMahasiswa.map((nilai) => (
              <TableRow key={nilai.id_konversi_nilai}>
                <TableCell>{nilai.id_konversi_nilai}</TableCell>
                <TableCell>{nilai.grade}</TableCell>
                <TableCell className="flex gap-2">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
