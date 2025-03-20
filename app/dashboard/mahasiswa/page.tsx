'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Data Mahasiswa', link: '/dashboard/mahasiswa' }
];

interface Student {
  NIM: string;
  nama_mahasiswa: string;
  semester: string;
  id_program_mbkm: string;
  NIP_dosbing: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get<Student[]>(`${API_BASE_URL}/mahasiswa`);
      setStudents(response.data);
      setFilteredStudents(response.data); // Initialize filtered list
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchStudentDetail = async (NIM: string) => {
    try {
      const response = await axios.get<Student>(
        `${API_BASE_URL}/mahasiswa/${NIM}`
      );
      setSelectedStudent(response.data);
    } catch (error) {
      console.error('Error fetching student detail:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter students based on the search query
    const filtered = students.filter((student) =>
      student.nama_mahasiswa.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
  };

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
        <div className="my-4">
          <h3 className="text-xl font-semibold">Mahasiswa Terdaftar:</h3>
          <div
            className="overflow-y-scroll rounded-md border bg-accent"
            style={{ maxHeight: '200px' }} // Maksimal 5 baris dengan scroll
          >
            <ul>
              {filteredStudents.map((student) => (
                <li
                  key={student.NIM}
                  className="cursor-pointer border-b px-4 py-2 hover:bg-muted"
                  onClick={() => fetchStudentDetail(student.NIM)}
                >
                  {student.nama_mahasiswa} ({student.NIM})
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Detail Mahasiswa */}
        {selectedStudent && (
          <div className="my-4 rounded-md border bg-muted p-4 shadow-md">
            <h3 className="text-xl font-semibold">Detail Mahasiswa</h3>
            <p>Nama: {selectedStudent.nama_mahasiswa}</p>
            <p>NIM: {selectedStudent.NIM}</p>
            <p>Semester: {selectedStudent.semester}</p>
            <p>Program MBKM ID: {selectedStudent.id_program_mbkm}</p>
            <p>Dosen Pembimbing (NIP): {selectedStudent.NIP_dosbing}</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
