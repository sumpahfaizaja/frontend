'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

export default function ProgramMBKMPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null); // State untuk modal
  const [files, setFiles] = useState({ file1: null, file2: null });

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Fetch all MBKM programs
  const fetchPrograms = async () => {
    try {
      const dataDummy = [
        {
          id_program_mbkm: 1,
          program: 'Penelitian dan Riset',
          studyProgram: 'TEKNIK ELEKTRO',
          institution: 'CV. Mediatama Web Indonesia',
          schedule: '2024-11-09T00:00:00Z',
          endSchedule: '2024-11-20T00:00:00Z',
          quota: '12 Orang',
          notes: 'Asdad',
          requirements: 'Unggah KTP, Surat Pernyataan'
        },
        {
          id_program_mbkm: 2,
          program: 'Program Wirausaha',
          studyProgram: 'TEKNIK ELEKTRO',
          institution: 'SMA Nagari Kamang Mudiak',
          schedule: '2024-11-09T00:00:00Z',
          endSchedule: '2024-11-24T00:00:00Z',
          quota: '8 Orang',
          notes: 'Ok',
          requirements: 'Unggah Proposal, CV'
        }
      ];

      setPrograms(dataDummy);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleSubmit = () => {
    // Logikan submit (misalnya upload file ke server)
    alert(
      `Mendaftar untuk program: ${selectedProgram.program}\nFile 1: ${
        files.file1 ? files.file1.name : 'Belum diunggah'
      }\nFile 2: ${files.file2 ? files.file2.name : 'Belum diunggah'}`
    );

    // Reset state modal
    setSelectedProgram(null);
    setFiles({ file1: null, file2: null });
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
              <th className="border border-gray-300 px-4 py-2">Instansi</th>
              <th className="border border-gray-300 px-4 py-2">Syarat</th>
              <th className="border border-gray-300 px-4 py-2">Option</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program, index) => (
              <tr key={program.id_program_mbkm}>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {program.program}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {program.institution}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {program.requirements}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => setSelectedProgram(program)}
                  >
                    Daftar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Daftar Program</h2>
            <p>
              <strong>Nama Program:</strong> {selectedProgram.program}
            </p>
            <p>
              <strong>Instansi:</strong> {selectedProgram.institution}
            </p>
            <p>
              <strong>Syarat:</strong> {selectedProgram.requirements}
            </p>

            <form className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Unggah File 1:
                </label>
                <input
                  type="file"
                  name="file1"
                  onChange={handleFileChange}
                  className="mt-1 w-full rounded border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Unggah File 2:
                </label>
                <input
                  type="file"
                  name="file2"
                  onChange={handleFileChange}
                  className="mt-1 w-full rounded border p-2"
                />
              </div>
            </form>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
                onClick={() => setSelectedProgram(null)}
              >
                Batal
              </button>
              <button
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
