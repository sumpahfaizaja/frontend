'use client';

import { useEffect, useState } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import Link from 'next/link';
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
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(
    null
  ); // Deletion confirmation state

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      setIsAuthorized(false);
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
          setIsAuthorized(false);
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
        setIsAuthorized(true);
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
    setDeleteConfirmation(NIM); // Store NIM of the student to delete
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
            Authorization: `Bearer ${token}` // Pass the token for authentication
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
      setSuccessMessage('Mahasiswa berhasil dihapus!');
      setDeleteConfirmation(null); // Reset the delete confirmation
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

        {/* Success/Error Messages */}
        <div className="my-4">
          {successMessage && (
            <div className="flex items-center gap-x-2 rounded-lg bg-green-100 p-4 text-green-800">
              <p>{successMessage}</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-x-2 rounded-lg bg-red-100 p-4 text-red-800">
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="my-2">
          <input
            type="text"
            placeholder="Cari mahasiswa berdasarkan nama..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full rounded-md border p-2"
          />
        </div>

        {/* Loading / Error Messages */}
        {loading ? (
          <p className="text-muted-foreground">Memuat data mahasiswa...</p>
        ) : (
          <div className="my-4">
            <ul>
              {filteredStudents.map((student) => (
                <li
                  key={student.NIM}
                  className="flex items-center justify-between border-b px-4 py-2.5 hover:bg-gray-100"
                >
                  {/* Student Info */}
                  <div>
                    <p className="font-semibold">{student.nama_mahasiswa}</p>
                    <p className="text-sm text-muted-foreground">
                      {student.NIM}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
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
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteConfirmation && (
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
                  onClick={() => setDeleteConfirmation(null)}
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
      </div>
    </PageContainer>
  );
};

export default StudentsPage;
