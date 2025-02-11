'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import DocumentForm from '@/components/forms/dokumen-form';
import React from 'react';

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

  const [student, setStudent] = useState({
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

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/mahasiswa/${NIM}`);
        setStudent(response.data);

        if (response.data.id_program_mbkm) {
          const programResponse = await axios.get(
            `${API_BASE_URL}/program-mbkm/${response.data.id_program_mbkm}`
          );
          setProgram(programResponse.data);
        }

        if (response.data.NIP_dosbing) {
          const dosbingResponse = await axios.get(
            `${API_BASE_URL}/dosbing/${response.data.NIP_dosbing}`
          );
          setDosbing(dosbingResponse.data);
        }

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

  const handleDelete = (nim: string) => {
    console.log(`Mahasiswa dengan NIM ${nim} akan dihapus`);
    // Tambahkan logika penghapusan di sini
  };

  if (loading) {
    return <div>Loading...</div>;
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
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm text-muted-foreground">NIM</p>
            <p className="font-semibold">{student.NIM}</p>
          </div>

          {/* Nama Mahasiswa */}
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm text-muted-foreground">Nama Mahasiswa</p>
            <p className="font-semibold">{student.nama_mahasiswa}</p>
          </div>

          {/* Semester */}
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm text-muted-foreground">Semester</p>
            <p className="font-semibold">{student.semester}</p>
          </div>

          {/* Program MBKM */}
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm text-muted-foreground">Program MBKM</p>
            <p className="font-semibold">
              {program ? program.company : 'Data Tidak Tersedia'}
            </p>
            <p className="text-sm text-muted-foreground">
              {program ? program.role : ''}
            </p>
          </div>

          {/* Dosen Pembimbing */}
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Nama Dosen Pembimbing
            </p>
            <p className="font-semibold">
              {dosbing ? dosbing.nama_dosbing : 'Data Tidak Tersedia'}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-12 flex flex-col">
        {/* Document Form */}
        <DocumentForm nim={NIM} allowDelete={false} />
      </div>
    </PageContainer>
  );
};

export default DetailMahasiswaPage;
