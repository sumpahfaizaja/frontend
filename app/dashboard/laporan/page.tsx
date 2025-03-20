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
const API_UPLOAD_PENILAIAN = 'https://backend-si-mbkm.vercel.app/api/penilaian';

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

const PenilaianForm = ({
  onSubmit,
  onCancel,
  loading
}: {
  onSubmit: (file: File) => void;
  onCancel: () => void;
  loading: boolean;
}) => {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onSubmit(file);
    } else {
      alert('Harap pilih file terlebih dahulu.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="file"
        onChange={(e) => e.target.files && setFile(e.target.files[0])}
        disabled={loading}
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader className="mr-2 animate-spin" size={16} />
              Mengunggah...
            </>
          ) : (
            'Unggah Penilaian'
          )}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Batalkan
        </Button>
      </div>
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
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border bg-muted px-4 py-2 text-left">Status</th>
            <th className="border bg-muted px-4 py-2 text-left">Nama File</th>
            <th className="border bg-muted px-4 py-2 text-left">Jenis</th>
            <th className="border bg-muted px-4 py-2 text-left">Judul</th>
            <th className="border bg-muted px-4 py-2 text-left">Subjek</th>
            <th className="border bg-muted px-4 py-2 text-left">Aksi</th>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [hasVerifiedProgram, setHasVerifiedProgram] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      setError('Token tidak ditemukan');
      setLoading(false);
      return;
    }

    const { NIM } = jwtDecode<{ NIM: string }>(token);

    // Fetch program verification
    fetchProgramVerification(NIM, token)
      .then(setHasVerifiedProgram)
      .catch((err) => setError(err.message));

    // Fetch logbooks
    fetchLogbooks(NIM, token)
      .then((logbooks) => {
        if (logbooks.length === 0) {
          setMessage('Belum ada logbook yang diunggah.');
        } else {
          setLogbooks(logbooks);
        }
      })
      .catch(() => setError('Gagal memuat logbook.'))
      .finally(() => setLoading(false)); // ✅ Ensure loading is set after fetch
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

  const handlePenilaianUpload = async (file: File) => {
    const token = Cookies.get('token');
    if (!token) {
      setMessage('Token tidak ditemukan, silakan login ulang.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await fetch(API_UPLOAD_PENILAIAN, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload penilaian gagal');
      }

      setMessage('Penilaian berhasil diunggah!');
    } catch (err: any) {
      setMessage(err.message || 'Terjadi kesalahan saat unggah penilaian.');
    } finally {
      setLoading(false);
    }
  };

  const handlePenilaianCancel = () => {
    // Clear file if user cancels
    setMessage(null);
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
      {loading ? (
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
      ) : !loading && hasVerifiedProgram ? (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Form Upload Logbook</CardTitle>
            </CardHeader>
            <CardContent>
              <LogbookForm onSubmit={handleUpload} loading={loading} />
            </CardContent>
          </Card>

          {/* Form Upload Penilaian */}

          {/* Tampilkan Card Riwayat Logbook hanya jika ada logbook */}
          {logbooks.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Riwayat Logbook</CardTitle>
              </CardHeader>
              <CardContent>
                {error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <LogbookTable logbooks={logbooks} onDelete={handleDelete} />
                )}
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Upload Penilaian Program</CardTitle>
            </CardHeader>
            <CardContent>
              <PenilaianForm
                onSubmit={handlePenilaianUpload}
                onCancel={handlePenilaianCancel}
                loading={loading}
              />
            </CardContent>
          </Card>
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
