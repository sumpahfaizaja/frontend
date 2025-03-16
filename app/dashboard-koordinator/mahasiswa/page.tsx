'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import Link from 'next/link';
import { Edit, Eye, Trash, XCircle, CheckCircle } from 'lucide-react';
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
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteNIM, setDeleteNIM] = useState<string | null>(null); // Untuk modal konfirmasi
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Notifikasi

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/mahasiswa`);
      setStudents(response.data as Student[]);
      setFilteredStudents(response.data as Student[]);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = students.filter((student) =>
      student.nama_mahasiswa.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
  };

  const getAuthToken = () => {
    return Cookies.get('token');
  };

  const confirmDelete = (NIM: string) => {
    setDeleteNIM(NIM); // Tampilkan modal konfirmasi
  };

  const handleDelete = async () => {
    if (!deleteNIM) return;

    try {
      const token = getAuthToken();
      const response = await axios.delete(
        `${API_BASE_URL}/mahasiswa/${deleteNIM}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 204) {
        setStudents((prev) =>
          prev.filter((student) => student.NIM !== deleteNIM)
        );
        setFilteredStudents((prev) =>
          prev.filter((student) => student.NIM !== deleteNIM)
        );
        setSuccessMessage('Mahasiswa berhasil dihapus!');
        setTimeout(() => setSuccessMessage(null), 3000); // Hilangkan notifikasi setelah 3 detik
        setDeleteNIM(null); // Tutup modal
      } else {
        console.error('Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <PageContainer scrollable>
      <div className="flex flex-col gap-y-2">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Input Pencarian */}
        <div className="my-2">
          <input
            type="text"
            placeholder="Cari mahasiswa berdasarkan nama..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full rounded-md border p-2"
          />
        </div>

        {/* Notifikasi Sukses */}
        {successMessage && (
          <div className="flex items-center gap-x-2 rounded-lg bg-green-100 p-4 text-green-800">
            <CheckCircle size={20} />
            {successMessage}
          </div>
        )}

        {/* Daftar Mahasiswa */}
        <div className="my-4">
          <ul>
            {filteredStudents.map((student) => (
              <li
                key={student.NIM}
                className="flex cursor-pointer justify-between border-b px-4 py-2.5 hover:bg-gray-100"
              >
                <div className="flex flex-col gap-y-1">
                  <p className="font-semibold leading-none">
                    {student.nama_mahasiswa}
                  </p>
                  <p className="font-light leading-none text-muted-foreground">
                    {student.NIM}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard-koordinator/mahasiswa/${student.NIM}`}
                    className="grid size-8 place-items-center rounded bg-blue-600 p-1 text-white"
                  >
                    <Eye size={14} />
                  </Link>
                  <Link
                    href={`/dashboard-koordinator/mahasiswa/${student.NIM}/edit`}
                    className="grid size-8 place-items-center rounded bg-amber-500 p-1 text-white"
                  >
                    <Edit size={14} />
                  </Link>
                  <button
                    onClick={() => confirmDelete(student.NIM)}
                    className="grid size-8 place-items-center rounded bg-red-600 p-1 text-white"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal Konfirmasi */}
      {/* Delete Confirmation */}
      {deleteNIM && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-full max-w-md scale-100 transform rounded-lg bg-white p-6 shadow-lg transition-transform">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
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
                onClick={() => setDeleteNIM(null)}
                className="w-full max-w-xs rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-foreground hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="w-full max-w-xs rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default StudentsPage;
