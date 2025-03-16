'use client';

import { useEffect, useState } from 'react';

// Define types for the data
interface ProgramMBKM {
  id: number;
  nama_program: string;
  deskripsi: string;
  dosen_pembimbing: string;
}

interface Mahasiswa {
  NIM: string;
  nama_mahasiswa: string;
  semester: number;
  id_program_mbkm: number;
  NIP_dosbing: string;
}

interface Dosen {
  NIP: string;
  nama_dosen: string;
}

// Dummy Data
const programMBKMData: ProgramMBKM[] = [
  {
    id: 1,
    nama_program: 'Magang di Perusahaan ABC',
    deskripsi: 'Program magang selama 6 bulan di perusahaan ABC.',
    dosen_pembimbing: '987654321'
  },
  {
    id: 2,
    nama_program: 'Studi Independen Data Science',
    deskripsi: 'Program studi independen selama 6 bulan tentang Data Science.',
    dosen_pembimbing: '123456789'
  }
];

const mahasiswaData: Mahasiswa[] = [
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
  },
  {
    NIM: '11223344',
    nama_mahasiswa: 'Alice Johnson',
    semester: 6,
    id_program_mbkm: 1,
    NIP_dosbing: '987654321'
  }
];

const dosenData: Dosen[] = [
  {
    NIP: '987654321',
    nama_dosen: 'Dr. John Smith'
  },
  {
    NIP: '123456789',
    nama_dosen: 'Prof. Jane Doe'
  }
];

// Main Component
export default function ProgramDosen() {
  const [programMBKM, setProgramMBKM] = useState<ProgramMBKM[]>([]);
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [dosen, setDosen] = useState<Dosen[]>([]);
  const [selectedDosen, setSelectedDosen] = useState<Dosen | null>(null);

  useEffect(() => {
    // Simulated data fetching
    setProgramMBKM(programMBKMData);
    setMahasiswa(mahasiswaData);
    setDosen(dosenData);
  }, []);

  const getMahasiswaByProgram = (programId: number) => {
    return mahasiswa.filter((mhs) => mhs.id_program_mbkm === programId);
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">
        Program yang Dipegang oleh Dosen
      </h1>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Daftar Dosen</h2>
        <ul>
          {dosen.map((dosenItem) => (
            <li key={dosenItem.NIP} className="mb-2">
              <button
                onClick={() => setSelectedDosen(dosenItem)}
                className="text-blue-500 underline"
              >
                {dosenItem.nama_dosen}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {selectedDosen && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold">{`Program yang Dipegang oleh ${selectedDosen.nama_dosen}`}</h2>
          <div className="mt-4">
            {programMBKM
              .filter(
                (program) => program.dosen_pembimbing === selectedDosen.NIP
              )
              .map((program) => {
                const mahasiswaInProgram = getMahasiswaByProgram(program.id);
                return (
                  <div
                    key={program.id}
                    className="mb-6 rounded border p-4 shadow-md"
                  >
                    <h3 className="text-lg font-semibold">
                      {program.nama_program}
                    </h3>
                    <p>{program.deskripsi}</p>
                    <h4 className="mt-4 font-semibold">
                      Mahasiswa yang Mengikuti Program:
                    </h4>
                    <ul>
                      {mahasiswaInProgram.length > 0 ? (
                        mahasiswaInProgram.map((mhs) => (
                          <li key={mhs.NIM} className="mb-2">
                            <p>
                              {mhs.nama_mahasiswa} (Semester {mhs.semester})
                            </p>
                          </li>
                        ))
                      ) : (
                        <p className="text-muted-foreground">
                          Tidak ada mahasiswa yang mengikuti program ini.
                        </p>
                      )}
                    </ul>
                  </div>
                );
              })}
          </div>
        </section>
      )}
    </div>
  );
}
