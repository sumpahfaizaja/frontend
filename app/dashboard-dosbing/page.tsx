'use client';

import { useEffect, useState } from 'react';

// Dummy data remains the same...

export default function ProgramDosen() {
  const [programMBKM, setProgramMBKM] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [selectedDosen, setSelectedDosen] = useState(null);

  useEffect(() => {
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
        <h2 className="mb-4 text-xl font-semibold">Daftar Dosen Pembimbing</h2>
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
          <h2 className="text-xl font-semibold">
            {`Program yang Dipegang oleh ${selectedDosen.nama_dosen}`}
          </h2>
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
                        <p className="text-gray-500">
                          Tidak ada mahasiswa yang mengikuti program ini.
                        </p>
                      )}
                    </ul>
                    <p className="mt-2 text-sm text-gray-500">
                      Total Mahasiswa: {mahasiswaInProgram.length}
                    </p>
                  </div>
                );
              })}
          </div>
        </section>
      )}
    </div>
  );
}
