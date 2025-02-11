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
  NIM: string;
  nama_mahasiswa?: string; // Nama mahasiswa akan diambil berdasarkan NIM
  NIP_dosbing: string;
  nama_dosbing?: string; // Nama dosbing akan diambil berdasarkan NIP_dosbing
  status: string; // Status field
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

      const data = response.data;

      // Ambil nama mahasiswa dan dosbing untuk setiap NIM dan NIP_dosbing
      const nilaiWithDetails = await Promise.all(
        data.map(async (nilai: GradeConversion) => {
          const nama_mahasiswa = await fetchNamaMahasiswa(nilai.NIM);
          const nama_dosbing = await fetchDosbing(nilai.NIP_dosbing);
          return { ...nilai, nama_mahasiswa, nama_dosbing };
        })
      );

      setNilaiMahasiswa(nilaiWithDetails);
    } catch (error) {
      console.error('Kesalahan saat mengambil data nilai:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNamaMahasiswa = async (
    nim: string
  ): Promise<string | undefined> => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/mahasiswa/${nim}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.nama_mahasiswa; // Mengembalikan nama mahasiswa
    } catch (error) {
      console.error(
        `Kesalahan saat mengambil data mahasiswa untuk NIM ${nim}:`,
        error
      );
      return 'Tidak ditemukan'; // Jika gagal, kembalikan default
    }
  };

  const fetchDosbing = async (nip: string): Promise<string | undefined> => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/dosbing/${nip}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.nama_dosbing; // Mengembalikan nama dosbing
    } catch (error) {
      console.error(
        `Kesalahan saat mengambil data dosbing untuk NIP ${nip}:`,
        error
      );
      return 'Tidak ditemukan'; // Jika gagal, kembalikan default
    }
  };

  const konfirmasiStatus = async (id: number) => {
    const konfirmasi = window.confirm(
      'Apakah Anda yakin ingin mengkonfirmasi nilai ini?'
    );

    if (konfirmasi) {
      try {
        const token = getAuthToken();
        const response = await axios.put(
          `${API_BASE_URL}/konversi-nilai/${id}`,
          { status: 'ACC' }, // Update status to "ACC"
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update local state to reflect the new status
        setNilaiMahasiswa((prevState) =>
          prevState.map((nilai) =>
            nilai.id_konversi_nilai === id ? { ...nilai, status: 'ACC' } : nilai
          )
        );

        alert('Nilai berhasil dikonfirmasi!');
      } catch (error) {
        console.error('Kesalahan saat mengkonfirmasi nilai:', error);
        alert('Terjadi kesalahan saat mengkonfirmasi nilai.');
      }
    }
  };

  const batalkanStatus = async (id: number) => {
    const konfirmasi = window.confirm(
      'Apakah Anda yakin ingin membatalkan konfirmasi nilai ini?'
    );

    if (konfirmasi) {
      try {
        const token = getAuthToken();
        const response = await axios.put(
          `${API_BASE_URL}/konversi-nilai/${id}`,
          { status: 'Pending' }, // Update status to "Pending"
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update local state to reflect the new status
        setNilaiMahasiswa((prevState) =>
          prevState.map((nilai) =>
            nilai.id_konversi_nilai === id
              ? { ...nilai, status: 'Pending' }
              : nilai
          )
        );

        alert('Nilai berhasil dibatalkan!');
      } catch (error) {
        console.error('Kesalahan saat membatalkan nilai:', error);
        alert('Terjadi kesalahan saat membatalkan nilai.');
      }
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
          <Table className="w-full overflow-hidden border text-left">
            <TableHeader>
              <TableRow className="bg-accent text-accent-foreground">
                <TableHead className="px-4 py-3">Nama Mahasiswa</TableHead>
                <TableHead className="px-4 py-3">Dosen Pembimbing</TableHead>
                <TableHead className="px-4 py-3">Nilai Akhir</TableHead>
                <TableHead className="px-4 py-3">Status</TableHead>
                <TableHead className="px-4 py-3 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nilaiMahasiswa.map((nilai, index) => (
                <TableRow
                  key={nilai.id_konversi_nilai}
                  className={`${
                    index % 2 === 0
                      ? 'bg-background text-foreground'
                      : 'bg-accent text-accent-foreground'
                  } hover:bg-secondary`}
                >
                  <TableCell className="px-4 py-3">
                    {nilai.nama_mahasiswa || 'Tidak ditemukan'}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {nilai.nama_dosbing || 'Tidak ditemukan'}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {nilai.nilai_akhir}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {nilai.status || 'Pending'}
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
                      {nilai.status === 'ACC' ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            batalkanStatus(nilai.id_konversi_nilai)
                          }
                        >
                          Batalkan
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            konfirmasiStatus(nilai.id_konversi_nilai)
                          }
                        >
                          Konfirmasi
                        </Button>
                      )}
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
