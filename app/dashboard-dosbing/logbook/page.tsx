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
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

interface Logbook {
  id_logbook: string;
  judul: string;
  subjek: string;
  nama_file: string | null;
  NIM: string;
  nama_mahasiswa: string;
  status: 'Menunggu' | 'ACC';
}

interface Student {
  NIM: string;
  nama_mahasiswa: string;
  semester: number;
  id_program_mbkm: string;
  NIP_dosbing: string;
}

export default function LogbookPage() {
  const [logbooks, setLogbooks] = useState<Logbook[]>([]);
  const [filteredLogbooks, setFilteredLogbooks] = useState<Logbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchStudent, setSearchStudent] = useState<string>('');

  useEffect(() => {
    fetchLogbooks();
  }, []);

  useEffect(() => {
    if (searchStudent.trim() !== '') {
      setFilteredLogbooks(
        logbooks.filter((logbook) =>
          logbook.nama_mahasiswa
            .toLowerCase()
            .includes(searchStudent.toLowerCase())
        )
      );
    } else {
      setFilteredLogbooks(logbooks);
    }
  }, [searchStudent, logbooks]);

  const fetchLogbooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('Token tidak ditemukan. Silakan login terlebih dahulu.');
        setLoading(false);
        return;
      }

      const decoded = jwtDecode<{ NIP_dosbing: string }>(token);
      const { NIP_dosbing } = decoded;

      // Ambil data mahasiswa berdasarkan dosbing
      const mahasiswaResponse = await axios.get(
        `${API_BASE_URL}/mahasiswa/dosbing/${NIP_dosbing}`
      );
      const mahasiswaList: Student[] = mahasiswaResponse.data;
      setStudents(mahasiswaList);

      // Ambil data logbook
      const logbookPromises = mahasiswaList.map((student) =>
        axios.get(`${API_BASE_URL}/logbook/nim/${student.NIM}`).then((res) =>
          res.data.map((log: any) => ({
            id_logbook: log.id_logbook,
            judul: log.judul || 'N/A',
            subjek: log.subjek || 'N/A',
            nama_file: log.nama_file || null,
            NIM: student.NIM,
            nama_mahasiswa: student.nama_mahasiswa,
            status: log.status || 'Menunggu'
          }))
        )
      );

      const allLogbooks = (await Promise.all(logbookPromises)).flat();
      setLogbooks(allLogbooks);
      setFilteredLogbooks(allLogbooks);
    } catch (err) {
      console.error('Kesalahan saat memuat logbook:', err);
      setError('Gagal memuat data logbook.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (
    id_logbook: string,
    newStatus: 'Menunggu' | 'ACC'
  ) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('Token tidak ditemukan. Silakan login terlebih dahulu.');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const response = await axios.put(
        `${API_BASE_URL}/logbook/${id_logbook}`,
        { status: newStatus },
        { headers }
      );

      if (response.status === 200) {
        setLogbooks((prev) =>
          prev.map((logbook) =>
            logbook.id_logbook === id_logbook
              ? { ...logbook, status: newStatus }
              : logbook
          )
        );
      }
    } catch (err) {
      console.error('Gagal memperbarui status:', err);
      setError('Gagal memperbarui status logbook.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-col gap-y-4">
        <Heading
          title="Logbook"
          description="Daftar logbook yang telah dikirim oleh mahasiswa."
        />
        <Separator />

        {/* Input untuk filter mahasiswa */}
        <div>
          <label htmlFor="student-search">Cari Mahasiswa:</label>
          <input
            id="student-search"
            type="text"
            placeholder="Ketik nama mahasiswa..."
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
            className="w-full rounded-md border p-2"
          />
        </div>

        {/* Tabel logbook */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Mahasiswa</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Subjek</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogbooks.map((logbook, index) => (
              <TableRow key={logbook.id_logbook}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{logbook.nama_mahasiswa}</TableCell>
                <TableCell>{logbook.judul}</TableCell>
                <TableCell>{logbook.subjek}</TableCell>
                <TableCell>{logbook.status}</TableCell>
                <TableCell>
                  <Button
                    onClick={() =>
                      toggleStatus(
                        logbook.id_logbook,
                        logbook.status === 'ACC' ? 'Menunggu' : 'ACC'
                      )
                    }
                  >
                    {logbook.status === 'ACC' ? 'Batal ACC' : 'ACC'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  );
}
