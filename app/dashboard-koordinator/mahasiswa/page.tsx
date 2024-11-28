'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import Link from 'next/link';
import { Edit, Eye, Trash } from 'lucide-react';

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

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/mahasiswa`);
      setStudents(response.data as Student[]);
      setFilteredStudents(response.data as Student[]); // Initialize filtered list
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

  const handleDelete = (NIM: string) => {
    console.log('Delete student with NIM:', NIM);
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
        <div className="my-4">
          <input
            type="text"
            placeholder="Cari mahasiswa berdasarkan nama..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full rounded-md border p-2"
          />
        </div>

        {/* Daftar Mahasiswa */}
        <div className="my-4 flex flex-col gap-y-4">
          <h3 className="text-xl font-semibold">Mahasiswa Terdaftar:</h3>
          <div
            className=""
          >
            <ul>
              {filteredStudents.map((student) => (
                <li
                  key={student.NIM}
                  className="flex cursor-pointer justify-between border-b px-4 py-2.5 hover:bg-gray-100"
                >
                  <div className='flex flex-col gap-y-1'>
                    <p className='font-semibold leading-none'>{student.nama_mahasiswa}</p>
                    <p className='font-light text-muted-foreground leading-none'>{student.NIM}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/dashboard-koordinator/mahasiswa/${student.NIM}`}
                      className="bg-blue-600 text-white p-1 size-8 grid place-items-center rounded"
                    >
                      <Eye size={14} />
                    </Link>
                    <Link
                      href={`/dashboard-koordinator/mahasiswa/${student.NIM}/edit`}
                      className="bg-amber-500 text-white p-1 size-8 grid place-items-center rounded"
                    >
                      <Edit size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(student.NIM)}
                      className="bg-red-600 text-white p-1 size-8 grid place-items-center rounded"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default StudentsPage;
