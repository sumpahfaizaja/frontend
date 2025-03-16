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

    try {
      const token = Cookies.get('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const decoded = jwtDecode<{ NIP_dosbing: string }>(token);
      const { NIP_dosbing } = decoded;

      const mahasiswaResponse = await axios.get(
        `${API_BASE_URL}/mahasiswa/dosbing/${NIP_dosbing}`
      );
      const mahasiswaList: Student[] = mahasiswaResponse.data;

      if (!mahasiswaList.length) {
        setLogbooks([]);
        setFilteredLogbooks([]);
        setLoading(false);
        return;
      }

      const logbookPromises = mahasiswaList.map((student) =>
        axios
          .get(`${API_BASE_URL}/logbook/nim/${student.NIM}`)
          .then((res) =>
            res.data.map((log: any) => ({
              id_logbook: log.id_logbook,
              judul: log.judul || 'N/A',
              subjek: log.subjek || 'N/A',
              nama_file: log.nama_file || null,
              NIM: student.NIM,
              nama_mahasiswa: log.Mahasiswa?.nama_mahasiswa || 'Unknown',
              status: log.status || 'Menunggu'
            }))
          )
          .catch((error) => {
            console.error(
              `Gagal mengambil logbook untuk NIM: ${student.NIM}`,
              error
            );
            return [];
          })
      );

      const allLogbooks = (await Promise.all(logbookPromises)).flat();

      console.log('Fetched logbooks:', allLogbooks);

      setLogbooks(allLogbooks);
      setFilteredLogbooks(allLogbooks);
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
    }
  };

  if (loading) {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="m-6 h-8 w-8 animate-spin fill-blue-600 text-muted md:m-12 dark:text-muted-foreground"
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

        <input
          id="student-search"
          type="text"
          placeholder="Ketik nama mahasiswa..."
          value={searchStudent}
          onChange={(e) => setSearchStudent(e.target.value)}
          className="w-full rounded-md border p-2"
        />

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
                        logbook.status === 'Menunggu' || null
                          ? 'ACC'
                          : 'Menunggu'
                      )
                    }
                    size={'sm'}
                    variant={
                      logbook.status === 'ACC' ? 'destructive' : 'default'
                    }
                    className="w-full"
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
