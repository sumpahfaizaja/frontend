'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

interface StudentDetails {
  NIM: string;
  nama_mahasiswa: string;
  semester: number;
  id_program_mbkm: string;
  NIP_dosbing: string;
  email?: string;
  jurusan?: string;
  prodi?: string;
}

const EditMahasiswaPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const NIM = params.id as string;

  const [student, setStudent] = useState<StudentDetails>({
    NIM: '',
    nama_mahasiswa: '',
    semester: 1,
    id_program_mbkm: '',
    NIP_dosbing: '',
    email: '',
    jurusan: '',
    prodi: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard-koordinator' },
    { title: 'Data Mahasiswa', link: '/dashboard-koordinator/mahasiswa' },
    {
      title: 'Edit Mahasiswa',
      link: `/dashboard-koordinator/mahasiswa/${NIM}/edit`
    }
  ];

  // Fetch student details
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/mahasiswa/${NIM}`);
        setStudent(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student details:', err);
        setError('Gagal memuat data mahasiswa');
        setLoading(false);
      }
    };

    if (NIM) {
      fetchStudentDetails();
    }
  }, [NIM]);

  // Handle Input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`${API_BASE_URL}/mahasiswa/${NIM}`, student);
      router.push('/dashboard-koordinator/mahasiswa');
    } catch (err) {
      console.error('Error updating student:', err);
      setError('Gagal memperbarui data mahasiswa');
    }
  };

  if (loading) {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="h-8 w-8 m-6 md:m-12 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
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

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-col gap-y-4">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Link
              href="/dashboard-koordinator/mahasiswa"
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold">Edit Data Mahasiswa</h1>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* NIM (Disabled) */}
            <div>
              <label
                htmlFor="NIM"
                className="block text-sm font-medium text-gray-700"
              >
                NIM
              </label>
              <Input
                type="text"
                id="NIM"
                name="NIM"
                value={student.NIM}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
              />
            </div>

            {/* Nama Mahasiswa */}
            <div>
              <label
                htmlFor="nama_mahasiswa"
                className="block text-sm font-medium text-gray-700"
              >
                Nama Mahasiswa
              </label>
              <Input
                type="text"
                id="nama_mahasiswa"
                name="nama_mahasiswa"
                value={student.nama_mahasiswa}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={student.email || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            {/* Semester */}
            <div>
              <label
                htmlFor="semester"
                className="block text-sm font-medium text-gray-700"
              >
                Semester
              </label>
              <select
                id="semester"
                name="semester"
                value={student.semester}
                onChange={handleInputChange}
                className="mt-1 block h-9 w-full rounded-md border border-gray-300 px-2 shadow-sm"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Program MBKM */}
            <div>
              <label
                htmlFor="id_program_mbkm"
                className="block text-sm font-medium text-gray-700"
              >
                Program MBKM
              </label>
              <Input
                type="text"
                id="id_program_mbkm"
                name="id_program_mbkm"
                value={student.id_program_mbkm}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            {/* Dosen Pembimbing */}
            <div>
              <label
                htmlFor="NIP_dosbing"
                className="block text-sm font-medium text-gray-700"
              >
                NIP Dosen Pembimbing
              </label>
              <Input
                type="text"
                id="NIP_dosbing"
                name="NIP_dosbing"
                value={student.NIP_dosbing}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <Link
              href="/dashboard-koordinator/mahasiswa"
              className="rounded-md border px-4 py-2 hover:bg-gray-100"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="flex items-center gap-x-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Save size={16} />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};

export default EditMahasiswaPage;
