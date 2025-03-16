'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

interface ProgramMBKMDetails {
  id_program_mbkm: string;
  company: string;
  deskripsi: string;
  role: string;
  status: string;
  date: string;
  category_id: string;
  syarat: string; // Added syarat field
}

const DetailProgramMBKMPage = () => {
  const params = useParams<{ id: string }>();
  const idProgramMBKM = params.id as string;

  const [program, setProgram] = useState<ProgramMBKMDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard-koordinator' },
    { title: 'Data Program MBKM', link: '/dashboard-koordinator/program-mbkm' },
    {
      title: 'Detail Program MBKM',
      link: `/dashboard-koordinator/program-mbkm/${idProgramMBKM}`
    }
  ];

  // Fetch program details
  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/program-mbkm/${idProgramMBKM}`
        );
        setProgram(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching program details:', err);
        setError('Gagal memuat data program');
        setLoading(false);
      }
    };

    if (idProgramMBKM) {
      fetchProgramDetails();
    }
  }, [idProgramMBKM]);

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
              href="/dashboard-koordinator/program"
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold">Detail Program MBKM</h1>
          </div>
        </div>

        {/* Program Details */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Program Name (Company) */}
          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-sm text-muted-foreground">Perusahaan</p>
            <p className="font-semibold">{program?.company || '-'}</p>
          </div>

          {/* Deskripsi */}
          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-sm text-muted-foreground">Deskripsi</p>
            <p className="font-semibold">{program?.deskripsi || '-'}</p>
          </div>

          {/* Syarat */}
          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-sm text-muted-foreground">Syarat</p>
            <p className="font-semibold">{program?.syarat || '-'}</p>
          </div>

          {/* Role */}
          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-semibold">{program?.role || '-'}</p>
          </div>

          {/* Status */}
          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-semibold">{program?.status || '-'}</p>
          </div>

          {/* Date */}
          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-sm text-muted-foreground">Tanggal</p>
            <p className="font-semibold">{program?.date || '-'}</p>
          </div>

          {/* Category ID */}
          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-sm text-muted-foreground">Category ID</p>
            <p className="font-semibold">{program?.category_id || '-'}</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default DetailProgramMBKMPage;
