'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Eye, Loader } from 'lucide-react';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// API Endpoints
const API_UPLOAD_URL = 'https://backend-si-mbkm.vercel.app/api/logbook';
const API_FETCH_LOGBOOKS = 'https://backend-si-mbkm.vercel.app/api/logbook';
const API_PENDING_VERIFIED =
  'https://backend-si-mbkm.vercel.app/api/pendaftaran-mbkm';
const API_DELETE_LOGBOOK = 'https://backend-si-mbkm.vercel.app/api/logbook';

interface Logbook {
  id_logbook: string;
  nama_file: string;
  judul: string;
  subjek: string;
  uploadDate: string;
  jenis: string; // Tambahkan jenis
  status: 'Menunggu' | 'ACC'; // Status logbook
}

interface PendaftaranMBKM {
  id_pendaftaran_mbkm: number;
  status: 'pending' | 'verif';
}

const fetchLogbooks = async (nim: string, token: string) => {
  const response = await fetch(`${API_FETCH_LOGBOOKS}/nim/${nim}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch logbooks');
  }

  return response.json() as Promise<Logbook[]>;
};

const fetchProgramVerification = async (nim: string, token: string) => {
  const response = await fetch(`${API_PENDING_VERIFIED}/nim/${nim}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch program verification data');
  }

  const programs = (await response.json()) as PendaftaranMBKM[];
  const verifiedPrograms = programs.filter(
    (program) => program.status === 'verif'
  );
  return verifiedPrograms.length === 1;
};

const LogbookForm = ({
  onSubmit,
  loading
}: {
  onSubmit: (data: {
    file: File;
    judul: string;
    subjek: string;
    jenis: string;
  }) => void;
  loading: boolean;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [judul, setJudul] = useState('');
  const [subjek, setSubjek] = useState('');
  const [jenis, setJenis] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jenis) {
      alert('Harap pilih jenis laporan.');
      return;
    }
    if (file && judul && subjek) {
      onSubmit({ file, judul, subjek, jenis });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select onValueChange={(value) => setJenis(value)} disabled={loading}>
        <SelectTrigger>
          <SelectValue placeholder="Pilih jenis laporan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Harian">Laporan harian</SelectItem>
          <SelectItem value="Mingguan">Laporan mingguan</SelectItem>
          <SelectItem value="Bulanan">Laporan bulanan</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="text"
        placeholder="Judul Logbook"
        value={judul}
        onChange={(e) => setJudul(e.target.value)}
        disabled={loading}
      />
      <Input
        type="text"
        placeholder="Subjek Logbook"
        value={subjek}
        onChange={(e) => setSubjek(e.target.value)}
        disabled={loading}
      />
      <Input
        type="file"
        onChange={(e) => e.target.files && setFile(e.target.files[0])}
        disabled={loading}
      />
      <Button type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader className="mr-2 animate-spin" size={16} />
            Mengunggah...
          </>
        ) : (
          'Unggah Logbook'
        )}
      </Button>
    </form>
  );
};

const LogbookTable = ({
  logbooks,
  onDelete,
  onEdit
}: {
  logbooks: Logbook[];
  onDelete: (id_logbook: string) => void;
  onEdit?: (logbook: Logbook) => void;
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border bg-gray-100 px-4 py-2 text-left">Status</th>
            <th className="border bg-gray-100 px-4 py-2 text-left">
              Nama File
            </th>
            <th className="border bg-gray-100 px-4 py-2 text-left">Jenis</th>
            <th className="border bg-gray-100 px-4 py-2 text-left">Judul</th>
            <th className="border bg-gray-100 px-4 py-2 text-left">Subjek</th>
            <th className="border bg-gray-100 px-4 py-2 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {logbooks.map((logbook) => (
            <tr key={logbook.id_logbook}>
              <td className="border px-4 py-2">
                {logbook.status === 'ACC' ? (
                  <span className="font-semibold text-green-500">
                    Disetujui
                  </span>
                ) : (
                  <span className="font-semibold text-red-500">Menunggu</span>
                )}
              </td>
              <td className="border px-4 py-2">
                <a
                  href={logbook.nama_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-x-1.5 text-blue-600 hover:underline"
                >
                  <Eye size={12} /> Lihat
                </a>
              </td>
              <td className="border px-4 py-2">{logbook.jenis}</td>
              <td className="border px-4 py-2">{logbook.judul}</td>
              <td className="border px-4 py-2">{logbook.subjek}</td>
              <td className="border px-4 py-2">
                <Button
                  onClick={() => onDelete(logbook.id_logbook)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function LogbookPage() {
  const [logbooks, setLogbooks] = useState<Logbook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [hasVerifiedProgram, setHasVerifiedProgram] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      setError('Token tidak ditemukan');
      return;
    }

    const { NIM } = jwtDecode<{ NIM: string }>(token);

    fetchProgramVerification(NIM, token)
      .then(setHasVerifiedProgram)
      .catch((err) => setError(err.message));

    fetchLogbooks(NIM, token)
      .then((logbooks) => {
        if (logbooks.length === 0) {
          setMessage('Belum ada logbook yang diunggah.');
        } else {
          setLogbooks(logbooks);
        }
      })
      .catch((err) => setError('Gagal memuat logbook.'));
  }, []);

  const handleUpload = async (data: {
    file: File;
    judul: string;
    subjek: string;
    jenis: string;
  }) => {
    const token = Cookies.get('token');
    if (!token) {
      setMessage('Token tidak ditemukan, silakan login ulang.');
      return;
    }

    const { NIM } = jwtDecode<{ NIM: string }>(token);

    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('judul', data.judul);
    formData.append('subjek', data.subjek);
    formData.append('jenis', data.jenis); // Tambahkan jenis
    formData.append('status', 'Menunggu'); // Set status default menjadi 'Menunggu'
    formData.append('NIM', NIM);

    setLoading(true);
    try {
      const response = await fetch(API_UPLOAD_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload gagal');
      }

      const newLogbook = await response.json();
      setLogbooks((prev) => [...prev, newLogbook]);
      setMessage('Logbook berhasil diunggah!');
    } catch (err: any) {
      setMessage(err.message || 'Terjadi kesalahan saat unggah logbook.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (logbookId: string) => {
    const token = Cookies.get('token');
    if (!token) {
      setMessage('Token tidak ditemukan, silakan login ulang.');
      return;
    }

    try {
      // Request DELETE ke API
      const response = await fetch(`${API_DELETE_LOGBOOK}/${logbookId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Cek apakah response berhasil
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hapus logbook gagal');
      }

      // Jika berhasil, filter dan hapus logbook dari state
      setLogbooks((prev) =>
        prev.filter((logbook) => logbook.id_logbook !== logbookId)
      );
      setMessage('Logbook berhasil dihapus');
    } catch (err: any) {
      setMessage(err.message || 'Terjadi kesalahan saat menghapus logbook.');
    }
  };

  const handleEdit = (logbook: Logbook) => {
    alert('Edit functionality to be implemented');
  };

  return (
    <PageContainer scrollable>
      <Heading
        title="Logbook Kegiatan MBKM"
        description="Unggah logbook kegiatan Anda untuk program MBKM"
      />
      {message && (
        <Alert className="mt-4">
          <AlertTitle className="font-semibold">
            {message.includes('berhasil') ? 'Sukses' : 'Error'}
          </AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      <Separator className="my-4" />
      {hasVerifiedProgram ? (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Form Upload Logbook</CardTitle>
            </CardHeader>
            <CardContent>
              <LogbookForm onSubmit={handleUpload} loading={loading} />
            </CardContent>
          </Card>

          {/* Tampilkan Card Riwayat Logbook hanya jika ada logbook */}
          {logbooks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Logbook</CardTitle>
              </CardHeader>
              <CardContent>
                {error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <LogbookTable
                    logbooks={logbooks}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Alert className="mt-4">
          <AlertTitle className="font-semibold">
            Akses Tidak Diperbolehkan
          </AlertTitle>
          <AlertDescription>
            Anda hanya dapat mengakses halaman ini jika memiliki tepat satu
            program MBKM dengan status terverifikasi.
          </AlertDescription>
        </Alert>
      )}
    </PageContainer>
  );
}
