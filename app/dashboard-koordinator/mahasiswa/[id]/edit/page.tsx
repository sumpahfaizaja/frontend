'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import Cookies from 'js-cookie';

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

interface StudentDetails {
  NIM: string;
  nama_mahasiswa: string;
  semester: number;
  id_program_mbkm: string;
  NIP_dosbing: string;
}

interface Program {
  id: string;
  company: string;
  role: string;
}

interface Dosen {
  NIP: string;
  nama_dosbing: string;
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
    NIP_dosbing: ''
  });
  const [programs, setPrograms] = useState<Program[]>([]);
  const [dosens, setDosens] = useState<Dosen[]>([]);
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

  const getAuthToken = () => {
    return Cookies.get('token');
  };

  // Fetch student details
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/mahasiswa/${NIM}`);
        const studentData = response.data;

        // Menangani nilai NaN dan mengatur default jika null atau NaN
        setStudent({
          NIM: studentData.NIM,
          nama_mahasiswa: studentData.nama_mahasiswa,
          semester: studentData.semester,
          id_program_mbkm: isNaN(studentData.id_program_mbkm)
            ? ''
            : studentData.id_program_mbkm,
          NIP_dosbing: isNaN(studentData.NIP_dosbing)
            ? ''
            : studentData.NIP_dosbing
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student details:', err);
        setError('Gagal memuat data mahasiswa');
        setLoading(false);
      }
    };

    const fetchPrograms = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/program-mbkm`);
        setPrograms(response.data);
      } catch (err) {
        console.error('Error fetching programs:', err);
      }
    };

    const fetchDosens = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/dosbing`);
        setDosens(response.data);
      } catch (err) {
        console.error('Error fetching dosens:', err);
      }
    };

    if (NIM) {
      fetchStudentDetails();
      fetchPrograms();
      fetchDosens();
    }
  }, [NIM]);

  // Handle Input changes
  // Handle Input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Jika field yang diubah adalah id_program_mbkm atau NIP_dosbing, lakukan konversi
    if (name === 'id_program_mbkm') {
      setStudent((prevState) => ({
        ...prevState,
        [name]: value ? value : '' // Pastikan default value kosong jika tidak dipilih
      }));
    } else if (name === 'NIP_dosbing') {
      setStudent((prevState) => ({
        ...prevState,
        [name]: value ? value : '' // Pastikan default value kosong jika tidak dipilih
      }));
    } else {
      setStudent((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Log the values before sending them
    console.log('Before sending data:', {
      id_program_mbkm: student.id_program_mbkm,
      NIP_dosbing: student.NIP_dosbing
    });

    // Ensure id_program_mbkm is a valid integer, and NIP_dosbing is a valid BigInt or number
    const updatedStudent = {
      ...student,
      id_program_mbkm:
        student.id_program_mbkm && !isNaN(Number(student.id_program_mbkm))
          ? Number(student.id_program_mbkm)
          : null,
      NIP_dosbing:
        student.NIP_dosbing && !isNaN(Number(student.NIP_dosbing))
          ? BigInt(student.NIP_dosbing)
          : null
    };

    // Log the updated data
    console.log('Updated student data:', updatedStudent);

    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API_BASE_URL}/mahasiswa/${student.NIM}`,
        updatedStudent,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // Now 'err' is typed as AxiosError
        console.error(
          'Error updating student:',
          err.response?.data.message || err.message
        );
      } else {
        console.error('An unexpected error occurred:', err);
      }
      setError('Gagal memperbarui data mahasiswa');
    }
  };

  if (loading) {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="m-6 h-8 w-8 animate-spin fill-blue-600 text-gray-200 md:m-12 dark:text-gray-600"
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
                disabled
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
              <Input
                type="number"
                id="semester"
                name="semester"
                value={student.semester}
                onChange={handleInputChange}
              />
            </div>

            {/* Program MBKM */}
            <div>
              <label
                htmlFor="id_program_mbkm"
                className="block text-sm font-medium text-gray-700"
              >
                Program MBKM
              </label>
              <select
                id="id_program_mbkm"
                name="id_program_mbkm"
                value={student.id_program_mbkm || ''}
                onChange={handleInputChange}
                className="h-9 w-full rounded-md border border-gray-300"
              >
                <option value="">Pilih Program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.company} - {program.role}
                  </option>
                ))}
              </select>
              {/* Menampilkan pesan kesalahan jika nilai id_program_mbkm kosong */}
              {student.id_program_mbkm === '' && (
                <span className="text-sm text-red-500">
                  Program MBKM harus dipilih
                </span>
              )}
            </div>

            {/* Dosen Pembimbing */}
            <div>
              <label
                htmlFor="NIP_dosbing"
                className="block text-sm font-medium text-gray-700"
              >
                Dosen Pembimbing
              </label>
              <select
                id="NIP_dosbing"
                name="NIP_dosbing"
                value={student.NIP_dosbing || ''}
                onChange={handleInputChange}
                className="h-9 w-full rounded-md border border-gray-300"
              >
                <option value="">Pilih Dosen Pembimbing</option>
                {dosens.map((dosen) => (
                  <option key={dosen.NIP} value={dosen.NIP}>
                    {dosen.nama_dosbing}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-x-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 focus:outline-none"
            >
              <Save size={16} /> Simpan
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};

export default EditMahasiswaPage;
