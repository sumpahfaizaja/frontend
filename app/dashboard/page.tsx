'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('token'); // Ambil token dari cookies

    if (token) {
      try {
        const decodedToken = jwtDecode<{ NIM: string }>(token); // Decode token
        const nim = decodedToken.NIM; // Ambil NIM dari token
        fetchStudentData(nim); // Ambil data mahasiswa berdasarkan NIM
      } catch (err) {
        setError('Token tidak valid');
        setLoading(false);
      }
    } else {
      setError('Token tidak ditemukan');
      setLoading(false);
    }
  }, []);

  // Fungsi untuk mengambil data mahasiswa berdasarkan NIM
  const fetchStudentData = async (nim: string) => {
    try {
      const response = await axios.get<Mahasiswa>(`${API_BASE_URL}/${nim}`);
      setStudent(response.data); // Set data mahasiswa
    } catch (error) {
      console.error('Error saat mengambil data mahasiswa:', error);
      setError('Gagal mengambil data mahasiswa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Dashboard MBKM</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : student ? (
        <div className="rounded-lg border border-gray-300 p-4 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Halo, Mahasiswa</h2>
          <p className="text-lg">
            <strong>{student.nama_mahasiswa.toUpperCase()}</strong>
          </p>
          <p className="text-sm text-gray-600">{student.NIM}</p>
          <p className="mt-4">
            Selamat datang di portal Merdeka Belajar Kampus Merdeka (MBKM).
          </p>
          <p>
            Kampus Merdeka adalah bagian dari inisiatif Merdeka Belajar oleh
            Kemendikbud Ristek untuk mempersiapkan mahasiswa menghadapi karier
            masa depan.
          </p>
          <a
            href="https://mbkm.undip.ac.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          >
            Kunjungi Website MBKM UNDIP
          </a>
        </div>
      ) : (
        <p>Data mahasiswa tidak tersedia.</p>
      )}
    </div>
  );
}
