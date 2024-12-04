'use client';

import { useEffect, useState } from 'react';

// Data Dummy
const penilaianData: {
  id: number;
  NIM: string;
  id_program_mbkm: number;
  nilai: string;
  file_nilai_url: string | null;
}[] = [
  {
    id: 1,
    NIM: '12345678',
    id_program_mbkm: 1,
    nilai: '',
    file_nilai_url: null
  },
  {
    id: 2,
    NIM: '87654321',
    id_program_mbkm: 2,
    nilai: '',
    file_nilai_url: null
  }
];

const mahasiswaData = [
  {
    NIM: '12345678',
    nama_mahasiswa: 'John Doe',
    semester: 5,
    id_program_mbkm: 1,
    NIP_dosbing: '987654321'
  },
  {
    NIM: '87654321',
    nama_mahasiswa: 'Jane Smith',
    semester: 7,
    id_program_mbkm: 2,
    NIP_dosbing: '123456789'
  }
];

const programMBKMData = [
  {
    id: 1,
    nama_program: 'Magang di Perusahaan ABC',
    deskripsi: 'Program magang selama 6 bulan di perusahaan ABC.'
  },
  {
    id: 2,
    nama_program: 'Studi Independen Data Science',
    deskripsi: 'Program studi independen selama 6 bulan tentang Data Science.'
  }
];

// Komponen Utama
export default function PenilaianProgramMBKM() {
  const [penilaians, setPenilaians] = useState<typeof penilaianData>([]);
  const [mahasiswa, setMahasiswa] = useState<typeof mahasiswaData>([]);
  const [programMBKM, setProgramMBKM] = useState<typeof programMBKMData>([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<
    (typeof mahasiswaData)[0] | null
  >(null);
  const [selectedPenilaian, setSelectedPenilaian] = useState<
    (typeof penilaianData)[0] | null
  >(null);
  const [nilai, setNilai] = useState<string>('');
  const [fileNilai, setFileNilai] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setPenilaians(penilaianData);
    setMahasiswa(mahasiswaData);
    setProgramMBKM(programMBKMData);
  }, []);

  const handleEditPenilaian = (penilaian: (typeof penilaianData)[0]) => {
    setSelectedPenilaian(penilaian);
    setNilai(penilaian.nilai);
    setFileNilai(null);
    setIsModalOpen(true);
  };

  const handleSavePenilaian = () => {
    setPenilaians((prevState) =>
      prevState.map((penilaian) =>
        penilaian.id === selectedPenilaian?.id
          ? {
              ...penilaian,
              nilai: nilai,
              file_nilai_url: fileNilai
                ? URL.createObjectURL(fileNilai)
                : penilaian.file_nilai_url
            }
          : penilaian
      )
    );
    setIsModalOpen(false);
    alert('Penilaian berhasil disimpan!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFileNilai(e.target.files[0]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredMahasiswa = mahasiswa.filter((mhs) =>
    mhs.nama_mahasiswa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Penilaian Program MBKM</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari mahasiswa..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full rounded border border-gray-300 p-2"
        />
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Tabel Penilaian</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">No</th>
              <th className="border border-gray-300 px-4 py-2">Mahasiswa</th>
              <th className="border border-gray-300 px-4 py-2">Program</th>
              <th className="border border-gray-300 px-4 py-2">Nilai</th>
              <th className="border border-gray-300 px-4 py-2">File Nilai</th>
              <th className="border border-gray-300 px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {penilaians.map((penilaian, index) => {
              const mahasiswaInfo = mahasiswa.find(
                (mhs) => mhs.NIM === penilaian.NIM
              );
              const programInfo = programMBKM.find(
                (program) => program.id === penilaian.id_program_mbkm
              );
              return (
                filteredMahasiswa.some((mhs) => mhs.NIM === penilaian.NIM) && (
                  <tr key={penilaian.id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() =>
                          setSelectedMahasiswa(mahasiswaInfo || null)
                        }
                        className="text-blue-500 underline"
                      >
                        {mahasiswaInfo?.nama_mahasiswa || 'Tidak Ditemukan'}
                      </button>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {programInfo?.nama_program || 'Tidak Ditemukan'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {penilaian.nilai || 'Belum dinilai'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {penilaian.file_nilai_url ? (
                        <a
                          href={penilaian.file_nilai_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          Lihat File
                        </a>
                      ) : (
                        'Belum ada file'
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="rounded bg-blue-500 px-4 py-2 text-white"
                        onClick={() => handleEditPenilaian(penilaian)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                )
              );
            })}
          </tbody>
        </table>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold">Edit Penilaian</h3>
            <div className="mb-4">
              <label className="mb-2 block">Nilai:</label>
              <input
                type="text"
                value={nilai}
                onChange={(e) => setNilai(e.target.value)}
                className="w-full rounded border border-gray-300 p-2"
                placeholder="Masukkan nilai"
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block">Upload File Nilai:</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full rounded border border-gray-300 p-2"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSavePenilaian}
                className="mr-2 rounded bg-green-500 px-4 py-2 text-white"
              >
                Simpan
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded bg-gray-300 px-4 py-2 text-black"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMahasiswa && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold">Informasi Mahasiswa</h3>
            <p>
              <strong>NIM:</strong> {selectedMahasiswa.NIM}
            </p>
            <p>
              <strong>Nama:</strong> {selectedMahasiswa.nama_mahasiswa}
            </p>
            <p>
              <strong>Semester:</strong> {selectedMahasiswa.semester}
            </p>
            <p>
              <strong>NIP Dosen Pembimbing:</strong>{' '}
              {selectedMahasiswa.NIP_dosbing}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedMahasiswa(null)}
                className="rounded bg-gray-300 px-4 py-2 text-black"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
