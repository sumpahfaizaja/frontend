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

        {/* Tabel Mahasiswa */}
        <div className="my-4 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">No.</th>
                <th className="border border-gray-300 px-4 py-2">
                  Nama Mahasiswa
                </th>
                <th className="border border-gray-300 px-4 py-2">NIM</th>
                <th className="border border-gray-300 px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.NIM} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {student.nama_mahasiswa}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {student.NIM}
                  </td>
                  <td className="flex justify-center space-x-2 border border-gray-300 px-4 py-2">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Konfirmasi */}
      {deleteNIM && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="text-center">
              <XCircle className="mx-auto h-12 w-12 text-red-600" />
              <h2 className="mt-4 text-lg font-bold text-gray-800">
                Konfirmasi Hapus
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Anda yakin ingin menghapus mahasiswa ini? Tindakan ini tidak
                dapat dibatalkan.
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setDeleteNIM(null)}
                className="w-full max-w-xs rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-400"
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
    </PageContainer>
  );
};

export default StudentsPage;
