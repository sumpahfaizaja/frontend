'use client';

import { useEffect, useState } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Edit, Eye, Trash } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard-koordinator' },
  { title: 'Data Mahasiswa', link: '/dashboard-koordinator/mahasiswa' }
];

interface Student {
  NIM: string;
  nama_mahasiswa: string;
  semester: number;
  id_program_mbkm: string;
  NIP_dosbing: string;
}

const StudentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(
    null
  );

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      setError('Token tidak ditemukan, silakan login terlebih dahulu.');
      return;
    }

    const fetchStudents = async () => {
      try {
        const decodedToken = jwtDecode<{ NIP_dosbing: string; role: string }>(
          token
        );
        const { NIP_dosbing, role } = decodedToken;

        if (role !== 'dosbing') {
          setError('Anda tidak memiliki akses.');
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/mahasiswa/dosbing/${NIP_dosbing}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setStudents(data as Student[]);
        setFilteredStudents(data as Student[]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Gagal memuat data mahasiswa');
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = students.filter((student) =>
      student.nama_mahasiswa.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
  };

  const handleDeleteConfirmation = (NIM: string) => {
    setDeleteConfirmation(NIM);
  };

  const handleDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      const token = Cookies.get('token');
      const response = await fetch(
        `${API_BASE_URL}/mahasiswa/${deleteConfirmation}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setStudents((prev) =>
        prev.filter((student) => student.NIM !== deleteConfirmation)
      );
      setFilteredStudents((prev) =>
        prev.filter((student) => student.NIM !== deleteConfirmation)
      );
      setDeleteConfirmation(null);
    } catch (err) {
      console.error('Gagal menghapus mahasiswa:', err);
      setError('Gagal menghapus mahasiswa');
      setDeleteConfirmation(null);
    }
  };

  return (
    <PageContainer scrollable>
      <div className="flex flex-col gap-y-2">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Search Input */}
        <div className="my-2">
          <input
            type="text"
            placeholder="Cari mahasiswa berdasarkan nama..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-muted-foreground">Memuat data mahasiswa...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <div className="max-h-[400px] overflow-y-auto">
              <Table className="w-full text-left">
                <TableHeader className="sticky top-0 z-10 bg-secondary shadow-sm">
                  <TableRow className="text-secondary-foreground">
                    <TableHead className="px-4 py-3">No.</TableHead>
                    <TableHead className="px-4 py-3">Nama Mahasiswa</TableHead>
                    <TableHead className="px-4 py-3">NIM</TableHead>
                    <TableHead className="px-4 py-3 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student, index) => (
                    <TableRow
                      key={student.NIM}
                      className={`${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-gray-100`}
                    >
                      <TableCell className="px-4 py-3">{index + 1}</TableCell>
                      <TableCell className="px-4 py-3">
                        {student.nama_mahasiswa}
                      </TableCell>
                      <TableCell className="px-4 py-3">{student.NIM}</TableCell>
                      <TableCell className="flex justify-end gap-2 px-4 py-3 text-right">
                        <Link
                          href={`/dashboard-dosbing/mahasiswa/${student.NIM}`}
                          className="grid size-8 place-items-center rounded bg-blue-600 p-1 text-white"
                        >
                          <Eye size={14} />
                        </Link>
                        <Link
                          href={`/dashboard-dosbing/mahasiswa/${student.NIM}/edit`}
                          className="grid size-8 place-items-center rounded bg-amber-500 p-1 text-white"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDeleteConfirmation(student.NIM)}
                          className="grid size-8 place-items-center rounded bg-red-600 p-1 text-white"
                        >
                          <Trash size={14} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="w-full max-w-md scale-100 transform rounded-lg bg-white p-6 shadow-lg transition-transform">
              <div className="text-center">
                <h2 className="mt-4 text-lg font-bold text-foreground">
                  Konfirmasi Hapus
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Anda yakin ingin menghapus mahasiswa ini? Tindakan ini tidak
                  dapat dibatalkan.
                </p>
              </div>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="w-full max-w-xs rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-foreground hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full max-w-xs rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default StudentsPage;
