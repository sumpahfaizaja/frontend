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

  useEffect(() => {
    const token = Cookies.get('token');
    console.log('Retrieved token:', token);

    if (token) {
      const fetchStudents = async () => {
        try {
          // Decode token
          const decodedToken = jwtDecode<{ NIP_dosbing: string }>(token);
          console.log('Decoded token:', decodedToken);

          const NIP_dosbing = decodedToken.NIP_dosbing;
          console.log('Fetching students for NIP_dosbing:', NIP_dosbing);

          // Fetch data
          const response = await fetch(
            `${API_BASE_URL}/mahasiswa/dosbing/${NIP_dosbing}`
          );
          console.log('API response status:', response.status);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log('Fetched students data:', data);

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
    } else {
      setError('Token tidak ditemukan');
      setLoading(false);
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = students.filter((student) =>
      student.nama_mahasiswa.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
  };

  const handleDelete = async (NIM: string) => {
    console.log('Attempting to delete student with NIM:', NIM);

    try {
      const response = await fetch(`${API_BASE_URL}/mahasiswa/${NIM}`, {
        method: 'DELETE'
      });
      console.log('Delete response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setStudents((prev) => prev.filter((student) => student.NIM !== NIM));
      setFilteredStudents((prev) =>
        prev.filter((student) => student.NIM !== NIM)
      );
      console.log('Student successfully deleted:', NIM);
    } catch (err) {
      console.error('Gagal menghapus mahasiswa:', err);
      setError('Gagal menghapus mahasiswa');
    }
  };

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

        {/* Pesan Error/Loading */}
        {loading ? (
          <p className="text-gray-500">Memuat data mahasiswa...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="my-4">
            <ul>
              {filteredStudents.map((student) => (
                <li
                  key={student.NIM}
                  className="flex items-center justify-between border-b px-4 py-2.5 hover:bg-gray-100"
                >
                  {/* Informasi Mahasiswa */}
                  <div>
                    <p className="font-semibold">{student.nama_mahasiswa}</p>
                    <p className="text-sm text-gray-500">{student.NIM}</p>
                  </div>

                  {/* Aksi */}
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
                      onClick={() => handleDelete(student.NIM)}
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
      </div>
    </PageContainer>
  );
};

export default StudentsPage;
