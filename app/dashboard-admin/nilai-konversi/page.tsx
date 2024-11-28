'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface GradeConversion {
  id_konversi_nilai: number;
  NIP_admin_siap: string | null;
  id_berkas_penilaian: string | null;
  nilai_akhir: number;
  grade: string;
}

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

export default function AdminGradesPage() {
  const [studentGrades, setStudentGrades] = useState<GradeConversion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchConvertedGrades();
  }, []);

  // Get the token from cookies
  const getAuthToken = () => {
    return Cookies.get('token');
  };

  // Fetch all converted grades from the API
  const fetchConvertedGrades = async () => {
    try {
      const token = getAuthToken(); // Get the token from cookies
      const response = await axios.get(`${API_BASE_URL}/konversi-nilai`, {
        headers: {
          Authorization: `Bearer ${token}` // Add token to the request headers
        }
      });
      setStudentGrades(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching grades:', error);
      setLoading(false);
    }
  };

  // Handle grade conversion update (PUT request)
  const handleKonversi = async (id: number) => {
    try {
      const token = getAuthToken();
      setStudentGrades((prevState) =>
        prevState.map((grade) =>
          grade.id_konversi_nilai === id ? { ...grade, grade: 'A' } : grade
        )
      );

      await axios.put(
        `${API_BASE_URL}/konversi-nilai/${id}`,
        { grade: 'A' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert('Nilai berhasil dikonversi!');
    } catch (error) {
      console.error('Error konversi nilai:', error);
      alert('Terjadi kesalahan saat mengkonversi nilai.');
    }
  };

  // Handle cancelling grade conversion (PUT request)
  const handleCancelKonversi = async (id: number) => {
    const confirmCancel = window.confirm(
      'Apakah Anda yakin ingin membatalkan konversi nilai?'
    );

    if (confirmCancel) {
      try {
        const token = getAuthToken(); // Get the token from cookies
        // Update the status locally
        setStudentGrades((prevState) =>
          prevState.map(
            (grade) =>
              grade.id_konversi_nilai === id ? { ...grade, grade: 'B' } : grade // Example: change grade to 'B'
          )
        );

        // Update the status on the backend
        await axios.put(
          `${API_BASE_URL}/konversi-nilai/${id}`,
          { grade: 'B' }, // Example: revert grade to 'B'
          {
            headers: {
              Authorization: `Bearer ${token}` // Add token to the request headers
            }
          }
        );

        alert('Konversi dibatalkan!');
      } catch (error) {
        console.error('Error membatalkan konversi:', error);
        alert('Terjadi kesalahan saat membatalkan konversi.');
      }
    } else {
      alert('Konversi tidak dibatalkan.');
    }
  };

  // Handle view details (GET by ID request)
  const handleDetail = async (id: number) => {
    try {
      const token = getAuthToken(); // Get the token from cookies
      const response = await axios.get(`${API_BASE_URL}/konversi-nilai/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Add token to the request headers
        }
      });
      const detail = response.data;
      alert(`Detail: ${JSON.stringify(detail)}`);
    } catch (error) {
      console.error('Error fetching detail:', error);
      alert('Terjadi kesalahan saat mengambil detail.');
    }
  };

  // Handle deleting a conversion (DELETE request)
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      'Apakah Anda yakin ingin menghapus konversi ini?'
    );

    if (confirmDelete) {
      try {
        const token = getAuthToken(); // Get the token from cookies
        await axios.delete(`${API_BASE_URL}/konversi-nilai/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` // Add token to the request headers
          }
        });

        // Remove the deleted item from the list
        setStudentGrades((prevState) =>
          prevState.filter((grade) => grade.id_konversi_nilai !== id)
        );

        alert('Konversi berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting konversi:', error);
        alert('Terjadi kesalahan saat menghapus konversi.');
      }
    } else {
      alert('Konversi tidak dihapus.');
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
              <tr key={grade.id_konversi_nilai}>
                <td className="border border-gray-300 px-4 py-2">
                  {grade.id_konversi_nilai}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {grade.grade}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Program MBKM Example
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  Course Example
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {grade.grade}
                </td>
                <td className="flex flex-wrap gap-2 border border-gray-300 px-4 py-2 text-center">
                  <button
                    className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-700"
                    onClick={() => handleDetail(grade.id_konversi_nilai)}
                  >
                    Detail
                  </button>
                  <button
                    className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-700"
                    onClick={() => handleKonversi(grade.id_konversi_nilai)}
                    disabled={grade.grade === 'A'}
                  >
                    {grade.grade === 'A' ? 'Konversi Selesai' : 'Konversi'}
                  </button>
                  <button
                    className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-700"
                    onClick={() =>
                      handleCancelKonversi(grade.id_konversi_nilai)
                    }
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-700"
                    onClick={() => handleDelete(grade.id_konversi_nilai)}
                  >
                    Delete
                  </button>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {grade.grade === 'A' ? (
                    <span className="text-green-500">✔</span>
                  ) : (
                    <span className="text-red-500">❌</span>
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
