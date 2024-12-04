'use client';

import { useEffect, useState } from 'react';

interface Student {
  nim: string;
  nama_mahasiswa: string;
  program_mbkm: string;
  id_program_mbkm: number;
}

interface Grade {
  id: number;
  nim: string;
  konversi_selesai: boolean;
  file_url: string | null;
}

const AdminDashboardPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const dummyStudents: Student[] = [
    {
      nim: '12345678',
      nama_mahasiswa: 'John Doe',
      program_mbkm: 'Program Magang',
      id_program_mbkm: 1
    },
    {
      nim: '23456789',
      nama_mahasiswa: 'Jane Smith',
      program_mbkm: 'Program Kampus Merdeka',
      id_program_mbkm: 2
    },
    {
      nim: '34567890',
      nama_mahasiswa: 'Michael Johnson',
      program_mbkm: 'Program Studi Independen',
      id_program_mbkm: 3
    }
  ];

  const dummyGrades: Grade[] = [
    {
      id: 1,
      nim: '12345678',
      konversi_selesai: true,
      file_url: '/dummy/file1.pdf'
    },
    { id: 2, nim: '23456789', konversi_selesai: false, file_url: null },
    { id: 3, nim: '34567890', konversi_selesai: false, file_url: null }
  ];

  useEffect(() => {
    setStudents(dummyStudents);
    setGrades(dummyGrades);
    setLoading(false);
  }, []);

  const handleKonversi = async (id: number): Promise<void> => {
    try {
      setGrades((prevGrades) =>
        prevGrades.map((grade) =>
          grade.id === id
            ? {
                ...grade,
                konversi_selesai: true,
                file_url: `/dummy/file${id}.pdf`
              }
            : grade
        )
      );
      alert('Program Telah Selesai!');
    } catch (error) {
      console.error('Error konversi nilai:', error);
      alert('Terjadi kesalahan saat mengkonversi nilai.');
    }
  };

  const handleDownload = (fileUrl: string | null): void => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      alert('File tidak tersedia.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Dashboard Admin</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Daftar Mahasiswa</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>NIM</th>
                <th>Program</th>
                <th>Status Konversi</th>
                <th>Aksi</th>
                <th>Download File</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                const grade = grades.find((grade) => grade.nim === student.nim);
                return (
                  <tr key={student.nim}>
                    <td>{index + 1}</td>
                    <td>{student.nama_mahasiswa}</td>
                    <td>{student.nim}</td>
                    <td>{student.program_mbkm}</td>
                    <td>
                      {grade?.konversi_selesai
                        ? '✔ Program Telah Selesai'
                        : '✘ Belum Konversi'}
                    </td>
                    <td>
                      <button
                        onClick={() => handleKonversi(grade!.id)}
                        disabled={!!grade?.konversi_selesai}
                      >
                        {grade?.konversi_selesai
                          ? 'Program Telah Selesai'
                          : 'Konversi Nilai'}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDownload(grade?.file_url ?? null)}
                        disabled={!grade?.file_url}
                      >
                        {grade?.file_url
                          ? 'Download File'
                          : 'File Tidak Tersedia'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
