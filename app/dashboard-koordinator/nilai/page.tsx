'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import * as XLSX from 'xlsx';

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

interface Mahasiswa {
  NIM: string;
  nama_mahasiswa: string;
  id_program_mbkm: string;
  id_matkul_knvrs: string;
  NIP_dosbing: string;
}

interface KonversiNilai {
  nilai_akhir: number | null;
  nama_berkas: string | null;
  NIM: string;
  NIP_dosbing: string;
  status: 'Pending' | 'ACC';
  grade: string | null;
}

const dummyData = [
  {
    nama_mahasiswa: 'John Doe',
    nim_mahasiswa: '123456789',
    nama_dosbing: 'Dr. Smith',
    nim_dosbing: '987654321',
    nilai_akhir: 85,
    mata_kuliah: ['Math', 'Physics', 'Computer Science'],
    total_sks: 20
  },
  {
    nama_mahasiswa: 'Jane Doe',
    nim_mahasiswa: '987654321',
    nama_dosbing: 'Dr. Brown',
    nim_dosbing: '123456789',
    nilai_akhir: 90,
    mata_kuliah: ['Biology', 'Chemistry', 'English'],
    total_sks: 18
  }
];

export default function NilaiPage() {
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [konversiData, setKonversiData] = useState<KonversiNilai[]>([]);
  const [searchStudent, setSearchStudent] = useState<string>('');

  useEffect(() => {
    const fetchMahasiswa = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          console.error('Token not found. Please log in first.');
          return;
        }

        const decoded = jwtDecode<{ NIP_dosbing: string }>(token);
        const { NIP_dosbing } = decoded;

        const response = await axios.get(
          `${API_BASE_URL}/mahasiswa/dosbing/${NIP_dosbing}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setMahasiswaList(response.data);
        console.log('list mahasiswa: ', response.data);

        const konversiList = response.data.map((student: Mahasiswa) => ({
          NIM: student.NIM,
          NIP_dosbing: student.NIP_dosbing,
          nilai_akhir: null,
          nama_berkas: null,
          status: 'Pending' as 'Pending' | 'ACC',
          grade: null
        }));

        setKonversiData(konversiList);
        console.log('list konversi: ', konversiList);
      } catch (error) {
        console.error('Error fetching mahasiswa data:', error);
      }
    };

    fetchMahasiswa();
  }, []);

  useEffect(() => {
    if (searchStudent.trim() !== '') {
      setKonversiData(
        konversiData.filter(
          (student) =>
            mahasiswaList
              .find((mahasiswa) => mahasiswa.NIM === student.NIM)
              ?.nama_mahasiswa.toLowerCase()
              .includes(searchStudent.toLowerCase())
        )
      );
    } else {
      setKonversiData(konversiData);
    }
  }, [searchStudent, mahasiswaList]);

  const toggleStatus = async (student: KonversiNilai) => {
    if (!student.nilai_akhir || !student.nama_berkas) {
      console.log('Nilai atau berkas belum diisi.');
      return;
    }

    try {
      const token = Cookies.get('token');
      if (!token) {
        console.error('Token not found. Please log in first.');
        return;
      }

      const decoded = jwtDecode<{ NIP_dosbing: string }>(token);
      const { NIP_dosbing } = decoded;

      const grade =
        student.nilai_akhir >= 85 ? 'A' : student.nilai_akhir >= 70 ? 'B' : 'C';

      const formData = new FormData();

      formData.append('NIM', student.NIM);
      formData.append('nama_berkas', student.nama_berkas);
      formData.append('NIP_dosbing', student.NIP_dosbing);
      formData.append('nilai_akhir', student.nilai_akhir.toString());
      formData.append('grade', grade);
      formData.append('status', 'Pending');

      const fileInput = document.getElementById(
        `file-input-${student.NIM}`
      ) as HTMLInputElement;
      if (fileInput?.files?.length) {
        formData.append('file', fileInput.files[0]);
      }

      const response = await axios.post(
        `${API_BASE_URL}/konversi-nilai`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        setKonversiData((prev) =>
          prev.map((data) =>
            data.NIM === student.NIM ? { ...data, status: 'ACC' } : data
          )
        );
        console.log('Data berhasil ditambahkan ke database');
      } else {
        console.log('Terjadi kesalahan saat mengirim data');
      }
    } catch (error) {
      console.error('Error posting konversi nilai:', error);
    }
  };

  const exportToExcel = (title = 'MahasiswaData', worksheetName = 'Sheet1') => {
    try {
      const dataToExport = dummyData.map(
        ({
          nama_mahasiswa,
          nim_mahasiswa,
          nama_dosbing,
          nim_dosbing,
          nilai_akhir,
          mata_kuliah,
          total_sks
        }) => ({
          Nama_Mahasiswa: nama_mahasiswa,
          NIM_Mahasiswa: nim_mahasiswa,
          Nama_Dosbing: nama_dosbing,
          NIM_Dosbing: nim_dosbing,
          Nilai_Akhir: nilai_akhir,
          Mata_Kuliah: mata_kuliah.join(', '),
          Total_SKS: total_sks
        })
      );

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);
      XLSX.writeFile(workbook, `${title}.xlsx`);
    } catch (error) {
      console.error('Export Error:', error);
    }
  };

  return (
    <PageContainer scrollable>
      <div className="flex flex-col gap-y-4">
        <Heading
          title="Konversi Nilai"
          description="Daftar konversi nilai mahasiswa yang dibimbing."
        />
        <Separator />

        <input
          id="student-search"
          type="text"
          placeholder="Ketik nama mahasiswa..."
          value={searchStudent}
          onChange={(e) => setSearchStudent(e.target.value)}
          className="w-full rounded-md border p-2"
        />
        <Button onClick={() => exportToExcel()}>Export to Excel</Button>

        <Table>
          <TableHeader className="bg-accent text-accent-foreground">
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama Mahasiswa</TableHead>
              <TableHead>NIM</TableHead>
              <TableHead>Nilai Akhir</TableHead>
              <TableHead>Berkas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {konversiData.map((student, index) => (
              <TableRow key={student.NIM}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {mahasiswaList.find((s) => s.NIM === student.NIM)
                    ?.nama_mahasiswa || 'N/A'}
                </TableCell>
                <TableCell>{student.NIM}</TableCell>
                <TableCell>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={student.nilai_akhir || ''}
                    onChange={(e) =>
                      setKonversiData((prev) =>
                        prev.map((data) =>
                          data.NIM === student.NIM
                            ? {
                                ...data,
                                nilai_akhir: parseInt(e.target.value)
                              }
                            : data
                        )
                      )
                    }
                    className="rounded-md border p-2"
                  />
                </TableCell>
                <TableCell>
                  <input
                    id={`file-input-${student.NIM}`}
                    type="file"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        setKonversiData((prev) =>
                          prev.map((data) =>
                            data.NIM === student.NIM
                              ? { ...data, nama_berkas: files[0].name }
                              : data
                          )
                        );
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{student.status}</TableCell>
                <TableCell>
                  <Button onClick={() => toggleStatus(student)}>
                    Konfirmasi
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  );
}
