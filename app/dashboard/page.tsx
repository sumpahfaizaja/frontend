'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

// URL API
const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api/mahasiswa';

interface Mahasiswa {
  NIM: string;
  nama_mahasiswa: string;
}

export default function DashboardPage() {
  const [student, setStudent] = useState<Mahasiswa | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  // Fungsi untuk mem-fetch data mahasiswa
  const fetchStudentData = async () => {
    try {
      const response = await axios.get<Mahasiswa[]>(API_BASE_URL); // Ambil semua data mahasiswa
      if (response.data.length > 0) {
        setStudent(response.data[0]); // Ambil mahasiswa pertama sebagai contoh
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Dashboard MBKM</h1>
      {loading ? (
        <p>Loading...</p>
      ) : student ? (
        <div className="rounded-lg border border-gray-300 p-4 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Selamat Datang</h2>
          <p className="text-lg">
            <strong>{student.nama_mahasiswa.toUpperCase()}</strong>
          </p>
          <p className="text-sm text-gray-600">{student.NIM}</p>
          <p className="mt-4">
            Selamat datang di portal Merdeka Belajar Kampus Merdeka (MBKM).
          </p>
          <p>
            Kampus Merdeka adalah bagian dari kebijakan Merdeka Belajar oleh
            Kemendikbud Ristek untuk mempersiapkan mahasiswa menghadapi karier
            di masa depan.
          </p>
          {/* Tombol dengan link ke mbkm.undip.ac.id */}
          <a
            href="https://mbkm.undip.ac.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          >
            Lihat Website MBKM UNDIP
          </a>
        </div>
      ) : (
        <p>Tidak ada data mahasiswa tersedia.</p>
      )}
    </div>
  );
}
