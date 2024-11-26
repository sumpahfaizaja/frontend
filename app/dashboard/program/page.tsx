'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

export default function ProgramMBKMPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/program-mbkm`);
      setPrograms(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Daftar Program MBKM</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">No</th>
              <th className="border border-gray-300 px-4 py-2">Program</th>
              <th className="border border-gray-300 px-4 py-2">
                Program Studi
              </th>
              <th className="border border-gray-300 px-4 py-2">Instansi</th>
              <th className="border border-gray-300 px-4 py-2">
                Jadwal Kegiatan
              </th>
              <th className="border border-gray-300 px-4 py-2">Kuota</th>
              <th className="border border-gray-300 px-4 py-2">Syarat</th>
              <th className="border border-gray-300 px-4 py-2">Option</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program, index) => (
              <tr key={program.id}>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {program.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {program.studyProgram}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {program.institution}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(program.schedule).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {program.quota}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {program.requirements}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() =>
                      alert(`Daftar untuk program: ${program.name}`)
                    }
                  >
                    Daftar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
