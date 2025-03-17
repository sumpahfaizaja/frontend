'use client';

import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import PageContainer from '@/components/layout/page-container';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import MatkulSelector from '@/components/ui/multi-select';

// API URLs
const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

// types
type Mahasiswa = {
  nim: string;
  nama_mahasiswa: string;
  semester: number;
  id_program_mbkm: number;
  NIP_dosbing: string;
};

type ProgramMBKM = {
  id_program_mbkm: number;
  company: string;
  deskripsi: string | null;
  syarat: string;
  status: string;
  date: string;
  waktu_pelaksanaan: string | null;
  category_id: string;
  category: {
    id: string;
    name: string;
  };
  mahasiswa: Mahasiswa[];
};

export type MataKuliahKonversi = {
  id_matkul_knvrs: number;
  nama_matkul: string;
  sks: number;
  jenis_matkul: string;
  kode_matkul: string;
};

export default function ProgramDetailPage({
  params
}: {
  params: { id: string };
}) {
  const id = params.id;
  const router = useRouter();

  const [program, setProgram] = useState<ProgramMBKM | null>(null);
  const [mataKuliahList, setMataKuliahList] = useState<MataKuliahKonversi[]>(
    []
  );
  const [selectedMataKuliah, setSelectedMataKuliah] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (id) {
      fetchProgramDetails();
    }
  }, [id]);

  useEffect(() => {
    fetchMataKuliahKonversi();
  }, []);

  const fetchProgramDetails = async () => {
    try {
      const response = await axios.get<ProgramMBKM>(
        `${API_BASE_URL}/program-mbkm/${id}`
      );
      setProgram(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching program details:', err);
      setLoading(false);
    }
  };

  const fetchMataKuliahKonversi = async () => {
    try {
      const response = await axios.get<MataKuliahKonversi[]>(
        `${API_BASE_URL}/matkul-knvrs`
      );
      setMataKuliahList(response.data);
    } catch (err) {
      console.error('Error fetching Mata Kuliah Konversi:', err);
    }
  };

  const handleSubmit = async () => {
    if (selectedMataKuliah.length === 0) {
      setRegistrationStatus('Pilih mata kuliah konversi terlebih dahulu');
      return;
    }

    const token = Cookies.get('token');

    let NIM: number | null = null;
    let NIP_dosbing: string | null = null;

    if (token) {
      const decodedToken = jwtDecode<{ NIM: string; NIP_dosbing?: string }>(
        token
      );
      if (decodedToken.NIM) {
        NIM = parseInt(decodedToken.NIM, 10);
        if (isNaN(NIM)) {
          console.error('Invalid NIM value in token');
          setRegistrationStatus('Invalid NIM value in token');
          return;
        }
      }
      NIP_dosbing = decodedToken.NIP_dosbing || null;
    }

    const tanggal = new Date().toISOString();

    const formData = {
      NIM,
      NIP_dosbing,
      id_program_mbkm: program?.id_program_mbkm || null,
      matkul_knvrs: selectedMataKuliah,
      status: 'pending',
      tanggal
    };

    console.log(formData)

    try {
      const token = Cookies.get('token');
      await axios.post(`${API_BASE_URL}/pendaftaran-mbkm`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setRegistrationStatus('Pendaftaran berhasil');

      // Redirect to /dashboard/kegiatan
      router.push('/dashboard/kegiatan');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error during registration:', error.message);
        if (error instanceof AxiosError && error.response) {
          console.error('Backend Error:', error.response.data);
        }
        setRegistrationStatus('Pendaftaran gagal');
      } else {
        console.error('Unexpected error:', error);
        setRegistrationStatus('Pendaftaran gagal');
      }
    }
  };

  if (loading) {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="m-6 h-8 w-8 animate-spin fill-blue-600 text-muted md:m-12 dark:text-muted-foreground"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!program) {
    return (
      <PageContainer scrollable={true}>
        <Alert variant="destructive">
          <AlertTitle>Program tidak ditemukan</AlertTitle>
          <AlertDescription>
            Silakan periksa kembali ID program.
          </AlertDescription>
        </Alert>
      </PageContainer>
    );
  }

  const filteredMatkulList =
    program.category.name === 'IISMA'
      ? mataKuliahList.filter((matkul) => matkul.jenis_matkul === 'wajib')
      : mataKuliahList.filter((matkul) => matkul.jenis_matkul !== 'wajib');

  return (
    <PageContainer scrollable={true}>
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-x-4">
            <h1 className="text-2xl font-semibold">{program.company}</h1>
            <Badge
              variant={program.status === 'Active' ? 'default' : 'secondary'}
              className="h-6 w-fit text-center"
            >
              {program.status}
            </Badge>
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            {program.deskripsi ?? 'Deskripsi tidak tersedia'}
          </CardDescription>
        </CardHeader>
        <Separator className="mb-6" />
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Jenis Program */}
            <div className="flex items-center gap-4">
              <ClipboardList className="h-6 w-6 text-blue-500" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Jenis
                </h4>
                <Badge variant="secondary">{program.category.name}</Badge>
              </div>
            </div>

            {/* Deskripsi Program */}
            <div className="flex items-center gap-4">
              <ClipboardList className="h-6 w-6 text-blue-500" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Deskripsi
                </h4>
                <p className="text-foreground">
                  {program.deskripsi ?? 'Deskripsi tidak tersedia'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Tanggal Mulai */}
            <div className="flex items-center gap-4">
              <Calendar className="h-6 w-6 text-green-500" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Tanggal Mulai
                </h4>
                <p className="text-foreground">
                  {new Date(program.date).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>

            {/* Waktu Pelaksanaan */}
            {program.waktu_pelaksanaan && (
              <div className="flex items-center gap-4">
                <Calendar className="h-6 w-6 text-blue-500" />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Waktu Pelaksanaan
                  </h4>
                  <p className="text-foreground">
                    {new Date(program.waktu_pelaksanaan).toLocaleDateString(
                      'id-ID'
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Mata Kuliah Konversi */}
          <MatkulSelector
            mataKuliahList={mataKuliahList}
            selectedMataKuliah={selectedMataKuliah}
            setSelectedMataKuliah={setSelectedMataKuliah}
            programCategory={program.category.name}
          />

          <div className="mt-6 flex items-center gap-4">
            <ClipboardList className="h-6 w-6 text-blue-500" />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Jumlah Pendaftar
              </h4>
              <p className="text-foreground">{program.mahasiswa.length}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-2 md:gap-x-3">
            <Button variant="secondary" className="w-full md:w-auto" asChild>
              <Link href={'/dashboard/program'}>Kembali</Link>
            </Button>
            <Button
              variant="default"
              className="w-full md:w-auto"
              onClick={handleSubmit}
            >
              Ajukan Pendaftaran
            </Button>
          </div>
          {registrationStatus && (
            <Alert
              variant={
                registrationStatus === 'Pendaftaran berhasil'
                  ? 'default'
                  : 'destructive'
              }
            >
              <AlertTitle>{registrationStatus}</AlertTitle>
            </Alert>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
