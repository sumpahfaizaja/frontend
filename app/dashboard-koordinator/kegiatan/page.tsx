'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { SelectContent } from '@/components/ui/select'; // Adjust path if necessary
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'; // Import Select components
import { number } from 'zod';

type ProgramRegistration = {
  id_pendaftaran_mbkm: number;
  NIM: string;
  NIP_dosbing: string | null;
  tanggal: string;
  status: string;
  id_program_mbkm: number;
  pendaftaranMbkmMatkulKnvrs: pendaftaranMbkmMatkulKonversi[];
};

type pendaftaranMbkmMatkulKonversi = {
  id_matkul_knvrs: number;
  kode_matkul: string;
  nama_matkul: string;
  sks: number;
};

type MatkulKonversi = {
  id_pendaftaran_mbkm: number;
  id_matkul_knvrs: number;
};

type Matkul = {
  nama_matkul: string;
  id_matkul_knvrs: number;
  kode_matkul: string;
  sks: number;
};

type DosenPembimbing = {
  NIP_dosbing: string;
  nama_dosbing: string;
};

type ProgramMBKMDetails = {
  id_program_mbkm: string;
  company: string;
};

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

export default function AdminRegistrationsPage() {
  const [pendaftaranMBKM, setPendaftaranMBKM] = useState<ProgramRegistration[]>(
    []
  );
  const [students, setStudents] = useState<{ [key: string]: string }>({});
  const [dosenPembimbing, setDosenPembimbing] = useState<DosenPembimbing[]>([]); // Store dosen pembimbing data
  const [programs, setPrograms] = useState<{ [key: number]: string }>({}); // Store company names
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [verifiedNIMs, setVerifiedNIMs] = useState<Set<string>>(new Set());

  const [selectedDosbing, setSelectedDosbing] = useState<{
    [key: number]: string;
  }>({}); // Track selected dosen pembimbing

  useEffect(() => {
    fetchPendaftaranMBKM();
    fetchDosenPembimbing();
    fetchPrograms();
  }, []);

  const getAuthToken = () => Cookies.get('token');

  const fetchPendaftaranMBKM = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/pendaftaran-mbkm`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendaftaranMBKM(response.data);
      fetchStudentNames(response.data);
    } catch (error) {
      console.error('Kesalahan saat mengambil data pendaftaran MBKM:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDosenPembimbing = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/dosbing`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDosenPembimbing(response.data);
    } catch (error) {
      console.error('Kesalahan saat mengambil data dosen pembimbing:', error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/program-mbkm`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const programData: { [key: number]: string } = {};
      response.data.forEach((program: ProgramMBKMDetails) => {
        programData[parseInt(program.id_program_mbkm)] = program.company;
      });
      setPrograms(programData);
    } catch (error) {
      console.error('Kesalahan saat mengambil data program MBKM:', error);
    }
  };

  const fetchStudentNames = async (registrations: ProgramRegistration[]) => {
    try {
      const token = getAuthToken();
      const uniqueNIMs = Array.from(new Set(registrations.map((p) => p.NIM)));
      const studentData: { [key: string]: string } = {};
      await Promise.all(
        uniqueNIMs.map(async (NIM) => {
          const response = await axios.get(`${API_BASE_URL}/mahasiswa/${NIM}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          studentData[NIM] = response.data.nama_mahasiswa;
        })
      );
      setStudents(studentData);
      setVerifiedNIMs(
        new Set(
          registrations
            .filter((pendaftaran) => pendaftaran.status === 'verif')
            .map((pendaftaran) => pendaftaran.NIM)
        )
      );
    } catch (error) {
      console.error('Kesalahan saat memuat nama mahasiswa:', error);
    }
  };

  const updateStudentData = async (
    NIM: string,
    NIP_dosbing: string | null,
    id_program_mbkm: number | null
  ) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API_BASE_URL}/mahasiswa/${NIM}`,
        {
          NIP_dosbing: NIP_dosbing,
          id_program_mbkm: id_program_mbkm
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log(`Data mahasiswa ${NIM} berhasil diupdate:`, response.data);
    } catch (error) {
      console.error('Kesalahan saat mengupdate data mahasiswa:', error);
      alert('Terjadi kesalahan saat mengupdate data mahasiswa.');
    }
  };

  const updateStatus = async (id: number, newStatus: string, NIM: string) => {
    try {
      const token = getAuthToken();

      // Tentukan nilai NIP_dosbing dan id_program_mbkm berdasarkan status
      let NIP_dosbing = selectedDosbing[id] || null;
      let id_program_mbkm = null;

      // Tentukan nilai NIP_dosbing menjadi null jika status berubah ke 'pending'
      if (newStatus === 'pending') {
        NIP_dosbing = null; // Force NIP_dosbing menjadi null
      } else if (newStatus === 'verif') {
        const program = pendaftaranMBKM.find(
          (pendaftaran) => pendaftaran.id_pendaftaran_mbkm === id
        );
        if (program) {
          id_program_mbkm = program.id_program_mbkm;
        }
      }

      // Update status pada API
      await axios.put(
        `${API_BASE_URL}/pendaftaran-mbkm/${id}`,
        { status: newStatus, NIP_dosbing: NIP_dosbing }, // Kirim NIP_dosbing yang sudah diperbarui (null jika dibatalkan)
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update data pada state
      setPendaftaranMBKM((prevState) =>
        prevState.map((item) =>
          item.id_pendaftaran_mbkm === id
            ? {
                ...item,
                status: newStatus,
                NIP_dosbing: NIP_dosbing // Set NIP_dosbing sesuai status
              }
            : item
        )
      );

      // Update data mahasiswa berdasarkan status
      if (newStatus === 'verif') {
        setVerifiedNIMs((prev) => new Set(prev.add(NIM)));
        // Update data mahasiswa dengan NIP_dosbing dan id_program_mbkm
        const program = pendaftaranMBKM.find(
          (pendaftaran) => pendaftaran.id_pendaftaran_mbkm === id
        );
        if (program) {
          updateStudentData(NIM, NIP_dosbing, program.id_program_mbkm);
        }
      } else if (newStatus === 'pending') {
        setVerifiedNIMs((prev) => {
          const newVerifiedNIMs = new Set(prev);
          newVerifiedNIMs.delete(NIM);
          return newVerifiedNIMs;
        });
        // Jika status kembali ke 'pending', update data mahasiswa dengan null
        updateStudentData(NIM, null, null);
      }

      alert(`Status berhasil diubah menjadi ${newStatus}!`);
    } catch (error) {
      console.error('Kesalahan saat mengubah status:', error);
      alert('Terjadi kesalahan saat mengubah status.');
    }
  };

  const filterRegistrations = (registrations: ProgramRegistration[]) => {
    return registrations.filter((pendaftaran) => {
      const searchTerm = searchQuery.toLowerCase();
      const isVerified = verifiedNIMs.has(pendaftaran.NIM); // Cek apakah NIM sudah diverifikasi

      // Sembunyikan pendaftaran dengan status "pending" jika NIM sudah terverifikasi
      if (isVerified && pendaftaran.status.toLowerCase() === 'pending') {
        return false;
      }

      return (
        pendaftaran.id_pendaftaran_mbkm.toString().includes(searchTerm) ||
        students[pendaftaran.NIM]?.toLowerCase().includes(searchTerm) ||
        new Date(pendaftaran.tanggal)
          .toLocaleDateString()
          .includes(searchTerm) ||
        pendaftaran.status.toLowerCase().includes(searchTerm)
      );
    });
  };

  const filterPendingRegistrations = (registrations: ProgramRegistration[]) => {
    return registrations.filter((pendaftaran) => {
      // Pastikan pendaftaran pending hanya ditampilkan jika NIM belum diverifikasi
      if (
        pendaftaran.status === 'pending' &&
        verifiedNIMs.has(pendaftaran.NIM)
      ) {
        return false;
      }
      return true;
    });
  };

  const renderTable = (
    registrations: ProgramRegistration[],
    title: string,
    description: string,
    isPending: boolean
  ) => (
    <div>
      <Heading title={title} description={description} />
      <Separator className="my-4" />
      <div className="overflow-x-auto rounded-lg shadow">
        <div className="max-h-[400px] overflow-y-auto">
          <Table className="w-full text-left">
            <TableHeader className="sticky top-0 z-10 bg-secondary shadow-sm">
              <TableRow className="text-secondary-foreground">
                <TableHead className="px-4 py-3">Company</TableHead>
                <TableHead className="px-4 py-3">Nama Mahasiswa</TableHead>
                <TableHead className="px-4 py-3">Tanggal</TableHead>
                <TableHead className="px-4 py-3">
                  Mata Kuliah Konversi
                </TableHead>
                <TableHead className="px-4 py-3">Dosen Pembimbing</TableHead>
                <TableHead className="px-4 py-3 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filterRegistrations(registrations).map((pendaftaran, index) => (
                <TableRow
                  key={pendaftaran.id_pendaftaran_mbkm}
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-muted`}
                >
                  <TableCell className="px-4 py-3">
                    {programs[pendaftaran.id_program_mbkm] || 'Memuat...'}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {students[pendaftaran.NIM] ? (
                      <Link
                        href={`/dashboard-koordinator/mahasiswa/${pendaftaran.NIM}`}
                        className="text-blue-600 hover:underline"
                      >
                        {students[pendaftaran.NIM]}
                      </Link>
                    ) : (
                      'Memuat...'
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {new Date(pendaftaran.tanggal).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {pendaftaran.pendaftaranMbkmMatkulKnvrs.map((Item) => (
                      <p className="text-xs">
                        {Item.nama_matkul} -{' '}
                        <span className="text-muted-foreground">
                          {Item.sks} SKS
                        </span>
                      </p>
                    ))}
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    {isPending ? (
                      <Select
                        value={
                          selectedDosbing[pendaftaran.id_pendaftaran_mbkm] || ''
                        } // Default to empty string for "Pilih Dosen Pembimbing"
                        onValueChange={(value) =>
                          setSelectedDosbing((prev) => ({
                            ...prev,
                            [pendaftaran.id_pendaftaran_mbkm]: value
                          }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Dosen Pembimbing" />
                        </SelectTrigger>
                        <SelectContent className="z-20 max-h-48 overflow-y-auto">
                          {dosenPembimbing.map((dosen) => (
                            <SelectItem
                              key={dosen.NIP_dosbing}
                              value={dosen.NIP_dosbing}
                            >
                              {dosen.nama_dosbing}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      students[pendaftaran.NIP_dosbing || ''] || // Pastikan NIP_dosbing tidak null
                      dosenPembimbing.find(
                        (dosen) => dosen.NIP_dosbing === pendaftaran.NIP_dosbing
                      )?.nama_dosbing ||
                      'Tidak ada dosen'
                    )}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        className={`${
                          pendaftaran.status === 'pending' &&
                          !selectedDosbing[pendaftaran.id_pendaftaran_mbkm]
                            ? 'bg-red-500 text-white' // Merah jika dosen belum dipilih pada pendaftaran pending
                            : pendaftaran.status === 'pending'
                            ? 'bg-blue-500 text-white' // Biru jika dosen sudah dipilih pada pendaftaran pending
                            : 'bg-red-500 text-white' // Merah untuk tombol Batalkan di pendaftaran terverifikasi
                        }`}
                        size="sm"
                        disabled={
                          pendaftaran.status === 'pending' &&
                          !selectedDosbing[pendaftaran.id_pendaftaran_mbkm]
                        }
                        onClick={() =>
                          updateStatus(
                            pendaftaran.id_pendaftaran_mbkm,
                            pendaftaran.status === 'pending'
                              ? 'verif'
                              : 'pending',
                            pendaftaran.NIM
                          )
                        }
                      >
                        {pendaftaran.status === 'pending'
                          ? 'Konfirmasi'
                          : 'Batalkan'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );

  const verifiedRegistrations = pendaftaranMBKM.filter(
    (pendaftaran) => pendaftaran.status === 'verif'
  );
  const pendingRegistrations = pendaftaranMBKM.filter(
    (pendaftaran) => pendaftaran.status === 'pending'
  );

  return (
    <PageContainer scrollable={true}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Cari Pendaftaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="verified">Terverifikasi</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {renderTable(
                pendingRegistrations,
                'Daftar Pendaftaran Pending',
                'Daftar pendaftaran yang masih menunggu konfirmasi.',
                true
              )}
            </TabsContent>

            <TabsContent value="verified">
              {renderTable(
                verifiedRegistrations,
                'Daftar Pendaftaran Terverifikasi',
                'Daftar pendaftaran yang sudah terverifikasi.',
                false
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </PageContainer>
  );
}
