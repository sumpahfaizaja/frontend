'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

export default function AdminGradesPage() {
  const [studentGrades, setStudentGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConvertedGrades();
  }, []);

  const fetchConvertedGrades = async () => {
    // Data Dummy dengan status konversi dan URL file
    const dataDummy = [
      {
        id: '1',
        nim: '123456789',
        nama_mahasiswa: 'John Doe',
        program_mbkm: 'Magang Industri',
        mata_kuliah: 'Pemrograman Lanjut',
        nilai: 'A',
        konversi_selesai: true,
        file_url: 'https://example.com/file-john-doe.pdf' // Link file dari dosen pembimbing
      },
      {
        id: '2',
        nim: '987654321',
        nama_mahasiswa: 'Jane Smith',
        program_mbkm: 'Studi Independen',
        mata_kuliah: 'Kecerdasan Buatan',
        nilai: 'B+',
        konversi_selesai: false,
        file_url: '' // Tidak ada file jika konversi belum selesai
      },
      {
        id: '3',
        nim: '456123789',
        nama_mahasiswa: 'Alice Johnson',
        program_mbkm: 'Proyek Desa',
        mata_kuliah: 'Pengembangan Masyarakat',
        nilai: 'A-',
        konversi_selesai: true,
        file_url: 'https://example.com/file-alice-johnson.pdf' // Link file dari dosen pembimbing
      }
    ];

    // Menggunakan data dummy untuk sementara
    setStudentGrades(dataDummy);
    setLoading(false);
  };

  const handleKonversi = async (id) => {
    try {
      // Update status konversi di UI secara langsung
      setStudentGrades((prevState) =>
        prevState.map((grade) =>
          grade.id === id ? { ...grade, konversi_selesai: true } : grade
        )
      );

      // Kirim update ke API untuk melakukan konversi
      await axios.put(`${API_BASE_URL}/konversi-nilai/${id}`, {
        konversi_selesai: true
      });

      alert('Nilai berhasil dikonversi!');
    } catch (error) {
      console.error('Error konversi nilai:', error);
      alert('Terjadi kesalahan saat mengkonversi nilai.');
    }
  };

  const handleCancelKonversi = async (id) => {
    const confirmCancel = window.confirm(
      'Apakah Anda yakin ingin membatalkan konversi nilai?'
    );

    if (confirmCancel) {
      try {
        // Update status konversi di UI menjadi belum selesai
        setStudentGrades((prevState) =>
          prevState.map((grade) =>
            grade.id === id ? { ...grade, konversi_selesai: false } : grade
          )
        );

        // Kirim update ke API untuk membatalkan konversi
        await axios.put(`${API_BASE_URL}/konversi-nilai/${id}`, {
          konversi_selesai: false
        });

        alert('Konversi dibatalkan!');
      } catch (error) {
        console.error('Error membatalkan konversi:', error);
        alert('Terjadi kesalahan saat membatalkan konversi.');
      }
    } else {
      alert('Konversi tidak dibatalkan.');
    }
  };

  const handleDetail = (fileUrl) => {
    if (fileUrl) {
      // Arahkan ke URL file jika tersedia
      window.open(fileUrl, '_blank');
    } else {
      alert('File tidak tersedia untuk mahasiswa ini.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">
        Daftar Nilai Mahasiswa (Konversi)
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">No</th>
              <th className="border border-gray-300 px-4 py-2">NIM</th>
              <th className="border border-gray-300 px-4 py-2">
                Nama Mahasiswa
              </th>
              <th className="border border-gray-300 px-4 py-2">Program</th>
              <th className="border border-gray-300 px-4 py-2">Mata Kuliah</th>
              <th className="border border-gray-300 px-4 py-2">Nilai</th>
              <th className="border border-gray-300 px-4 py-2">Aksi</th>
              <th className="border border-gray-300 px-4 py-2">
                Konversi Selesai
              </th>
            </tr>
          </thead>
          <tbody>
            {studentGrades.map((grade, index) => (
              <tr key={grade.id}>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {grade.nim}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {grade.nama_mahasiswa}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {grade.program_mbkm}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {grade.mata_kuliah}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {grade.nilai}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => handleDetail(grade.file_url)}
                  >
                    Detail
                  </button>
                  <button
                    className="ml-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700"
                    onClick={() => handleKonversi(grade.id)}
                    disabled={grade.konversi_selesai}
                  >
                    {grade.konversi_selesai ? 'Konversi Selesai' : 'Konversi'}
                  </button>
                  {grade.konversi_selesai && (
                    <button
                      className="ml-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700"
                      onClick={() => handleCancelKonversi(grade.id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {grade.konversi_selesai ? (
                    <span className="text-green-500">✔</span> // Centang jika konversi selesai
                  ) : (
                    <span className="text-red-500">✘</span> // Cross jika konversi belum selesai
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
