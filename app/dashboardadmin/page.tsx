'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

export default function AdminDashboardPage() {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Data Dummy Mahasiswa
  const dummyStudents = [
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

  // Data Dummy Konversi Nilai
  const dummyGrades = [
    {
      id: 1,
      nim: '12345678',
      konversi_selesai: true,
      file_url: '/dummy/file1.pdf'
    },
    { id: 2, nim: '23456789', konversi_selesai: false, file_url: null },
    { id: 3, nim: '34567890', konversi_selesai: false, file_url: null }
  ];

  // Mengambil data mahasiswa dan konversi nilai
  useEffect(() => {
    setStudents(dummyStudents);
    setGrades(dummyGrades);
    setLoading(false);
  }, []);

  // Menangani konversi nilai
  const handleKonversi = async (id) => {
    try {
      // Update status konversi nilai
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

  // Fungsi untuk mendownload file
  const handleDownload = (fileUrl) => {
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
                <th className="border border-gray-300 px-4 py-2">No</th>
                <th className="border border-gray-300 px-4 py-2">Nama</th>
                <th className="border border-gray-300 px-4 py-2">NIM</th>
                <th className="border border-gray-300 px-4 py-2">Program</th>
                <th className="border border-gray-300 px-4 py-2">
                  Status Konversi
                </th>
                <th className="border border-gray-300 px-4 py-2">Aksi</th>
                <th className="border border-gray-300 px-4 py-2">
                  Download File
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                // Mencari nilai konversi untuk mahasiswa
                const grade = grades.find((grade) => grade.nim === student.nim);
                return (
                  <tr key={student.nim}>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {student.nama_mahasiswa}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {student.nim}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {student.program_mbkm}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {grade ? (
                        grade.konversi_selesai ? (
                          <span className="text-green-500">
                            ✔ Program Telah Selesai
                          </span>
                        ) : (
                          <span className="text-red-500">✘ Belum Konversi</span>
                        )
                      ) : (
                        <span className="text-red-500">✘ Belum Konversi</span>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700"
                        onClick={() => handleKonversi(grade.id)}
                        disabled={grade?.konversi_selesai}
                      >
                        {grade?.konversi_selesai
                          ? 'Program Telah Selesai'
                          : 'Konversi Nilai'}
                      </button>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                        onClick={() => handleDownload(grade?.file_url)}
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
}
