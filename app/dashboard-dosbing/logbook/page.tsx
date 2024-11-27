'use client';

import { useEffect, useState } from 'react';

// Data Dummy
const logbookData = [
  {
    id: 1,
    tanggal_upload: '2024-11-25',
    tanggal_laporan: '2024-11-24',
    catatan: 'Laporan harian kegiatan magang di perusahaan ABC.',
    jenis_laporan: 'Laporan Harian',
    status: 'Belum Diverifikasi',
    keterangan: 'Menunggu konfirmasi',
    file_url: 'https://example.com/laporan1.pdf',
    diverifikasi: false,
    NIM: '12345678'
  },
  {
    id: 2,
    tanggal_upload: '2024-11-26',
    tanggal_laporan: '2024-11-25',
    catatan: 'Laporan mingguan kegiatan studi independen.',
    jenis_laporan: 'Laporan Mingguan',
    status: 'Sudah Diverifikasi',
    keterangan: 'Laporan valid',
    file_url: 'https://example.com/laporan2.pdf',
    diverifikasi: true,
    NIM: '87654321'
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

const dosbingData = [
  {
    NIP_dosbing: '987654321',
    nama_dosbing: 'Dr. Alice Johnson'
  },
  {
    NIP_dosbing: '123456789',
    nama_dosbing: 'Prof. Bob Anderson'
  }
];

// Komponen Utama
export default function App() {
  const [logbooks, setLogbooks] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [programMBKM, setProgramMBKM] = useState([]);
  const [dosbing, setDosbing] = useState([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulasi pengambilan data (dari data dummy langsung)
    setLogbooks(logbookData);
    setMahasiswa(mahasiswaData);
    setProgramMBKM(programMBKMData);
    setDosbing(dosbingData);
  }, []);

  // Filter logbooks based on search query matching mahasiswa name
  const filteredLogbooks = logbooks.filter((logbook) => {
    const mahasiswaInfo = mahasiswa.find((mhs) => mhs.NIM === logbook.NIM);
    return mahasiswaInfo?.nama_mahasiswa
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari Nama Mahasiswa..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-sm rounded border p-2"
        />
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Logbook</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">
                Nama Mahasiswa
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Tanggal Upload
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Tanggal Laporan
              </th>
              <th className="border border-gray-300 px-4 py-2">Catatan</th>
              <th className="border border-gray-300 px-4 py-2">
                Jenis Laporan
              </th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Keterangan</th>
              <th className="border border-gray-300 px-4 py-2">File Laporan</th>
              <th className="border border-gray-300 px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogbooks.map((logbook) => {
              const mahasiswaInfo = mahasiswa.find(
                (mhs) => mhs.NIM === logbook.NIM
              );
              return (
                <tr key={logbook.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => setSelectedMahasiswa(mahasiswaInfo)}
                      className="text-blue-500 underline"
                    >
                      {mahasiswaInfo?.nama_mahasiswa || 'Tidak Ditemukan'}
                    </button>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {logbook.tanggal_upload}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {logbook.tanggal_laporan}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {logbook.catatan}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {logbook.jenis_laporan}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {logbook.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {logbook.keterangan}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <a
                      href={logbook.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Lihat File
                    </a>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className={`px-4 py-2 ${
                        logbook.diverifikasi ? 'bg-green-500' : 'bg-gray-500'
                      } rounded text-white`}
                      onClick={() => handleVerifikasi(logbook.id)}
                    >
                      {logbook.diverifikasi ? 'Terverifikasi' : 'Verifikasi'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Modal untuk Informasi Mahasiswa */}
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
              <strong>Program MBKM:</strong>{' '}
              {programMBKM.find(
                (program) => program.id === selectedMahasiswa.id_program_mbkm
              )?.nama_program || 'Tidak Ditemukan'}
            </p>
            <p>
              <strong>Dosen Pembimbing:</strong>{' '}
              {dosbing.find(
                (dosen) => dosen.NIP_dosbing === selectedMahasiswa.NIP_dosbing
              )?.nama_dosbing || 'Tidak Ditemukan'}
            </p>
            <button
              onClick={() => setSelectedMahasiswa(null)}
              className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );

  function handleVerifikasi(id) {
    setLogbooks((prevLogbooks) =>
      prevLogbooks.map((logbook) =>
        logbook.id === id
          ? { ...logbook, diverifikasi: !logbook.diverifikasi }
          : logbook
      )
    );
  }
}
