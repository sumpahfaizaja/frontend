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
  { title: 'Data Mahasiswa', link: '/dashboard-koordinator/mahasiswa' },
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
      const response = await axios.delete(`${API_BASE_URL}/mahasiswa/${deleteNIM}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        setStudents((prev) => prev.filter((student) => student.NIM !== deleteNIM));
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
          <div className="p-4 rounded-lg bg-green-100 text-green-800 flex items-center gap-x-2">
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
                  <p className="font-semibold leading-none">{student.nama_mahasiswa}</p>
                  <p className="font-light leading-none text-muted-foreground">{student.NIM}</p>
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
      {deleteNIM && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Konfirmasi Penghapusan</h2>
              <button
                onClick={() => setDeleteNIM(null)}
                className="text-gray-500 hover:text-black"
              >
                <XCircle size={20} />
              </button>
            </div>
            <p className="mt-2">Apakah Anda yakin ingin menghapus mahasiswa ini?</p>
            <div className="mt-4 flex justify-end gap-x-2">
              <button
                onClick={() => setDeleteNIM(null)}
                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-white"
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
