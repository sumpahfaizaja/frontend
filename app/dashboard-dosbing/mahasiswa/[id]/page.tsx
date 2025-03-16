'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

interface StudentDetails {
  NIM: string;
  nama_mahasiswa: string;
  semester: number;
  id_program_mbkm: string;
  NIP_dosbing: string;
  jurusan?: string;
  prodi?: string;
}

interface ProgramDetails {
  id_program_mbkm: number;
  company: string;
  deskripsi: string | null;
  role: string;
  status: string;
  date: string;
  category_id: string;
}

interface DosbingDetails {
  NIP_dosbing: string;
  nama_dosbing: string;
}

const DetailMahasiswaPage = () => {
  const params = useParams<{ id: string }>();
  const NIM = params.id as string;

  const [student, setStudent] = useState<StudentDetails>({
    NIM: '',
    nama_mahasiswa: '',
    semester: 1,
    id_program_mbkm: '',
    NIP_dosbing: ''
  });

  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [dosbing, setDosbing] = useState<DosbingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard-koordinator' },
    { title: 'Data Mahasiswa', link: '/dashboard-koordinator/mahasiswa' },
    {
      title: 'Detail Mahasiswa',
      link: `/dashboard-koordinator/mahasiswa/${NIM}`
    }
  ];

  // Fetch student details
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/mahasiswa/${NIM}`);
        setStudent(response.data);
        // Fetch program and dosbing details after student details
        const programResponse = await axios.get(
          `${API_BASE_URL}/program-mbkm/${response.data.id_program_mbkm}`
        );
        const dosbingResponse = await axios.get(
          `${API_BASE_URL}/dosbing/${response.data.NIP_dosbing}`
        );

        setProgram(programResponse.data);
        setDosbing(dosbingResponse.data);
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
            <h1 className="text-2xl font-bold">Detail Mahasiswa</h1>
          </div>
        </div>

        {/* Student Details */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* NIM */}
          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-sm text-muted-foreground">NIM</p>
            <p className="font-semibold">{student.NIM}</p>
          </div>

          {/* Nama Mahasiswa */}
          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-sm text-muted-foreground">Nama Mahasiswa</p>
            <p className="font-semibold">{student.nama_mahasiswa}</p>
          </div>

          {/* Semester */}
          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-sm text-muted-foreground">Semester</p>
            <p className="font-semibold">{student.semester}</p>
          </div>

          {/* Program MBKM */}
          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-sm text-muted-foreground">Program MBKM</p>
            <p className="font-semibold">
              {program ? program.company : 'Loading...'}
            </p>
            <p className="text-sm text-muted-foreground">
              {program ? program.role : ''}
            </p>
          </div>

          {/* Dosen Pembimbing */}
          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-sm text-muted-foreground">
              Nama Dosen Pembimbing
            </p>
            <p className="font-semibold">
              {dosbing ? dosbing.nama_dosbing : 'Loading...'}
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default DetailMahasiswaPage;
