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
import { Eye } from 'lucide-react';

// API Endpoints
const API_UPLOAD_URL = 'https://backend-si-mbkm.vercel.app/api/logbook';
const API_FETCH_LOGBOOKS = 'https://backend-si-mbkm.vercel.app/api/logbook';

interface Logbook {
  id: string;
  nama_file: string;
  judul: string;
  subjek: string;
  uploadDate: string;
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

const LogbookForm = ({
  onSubmit,
  loading
}: {
  onSubmit: (data: { file: File; judul: string; subjek: string }) => void;
  loading: boolean;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [judul, setJudul] = useState('');
  const [subjek, setSubjek] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file && judul && subjek) {
      onSubmit({ file, judul, subjek });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Judul Logbook"
        value={judul}
        onChange={(e) => setJudul(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Subjek Logbook"
        value={subjek}
        onChange={(e) => setSubjek(e.target.value)}
      />
      <Input
        type="file"
        onChange={(e) => e.target.files && setFile(e.target.files[0])}
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Mengunggah...' : 'Unggah Logbook'}
      </Button>
    </form>
  );
};

const LogbookTable = ({ logbooks }: { logbooks: Logbook[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">Nama File</th>
            <th className="border px-4 py-2 text-left">Judul</th>
            <th className="border px-4 py-2 text-left">Subjek</th>
          </tr>
        </thead>
        <tbody>
          {logbooks.map((logbook) => (
            <tr key={logbook.id}>
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
              <td className="border px-4 py-2">{logbook.judul}</td>
              <td className="border px-4 py-2">{logbook.subjek}</td>
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

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      setError('Token tidak ditemukan');
      return;
    }

    const { NIM } = jwtDecode<{ NIM: string }>(token);

    fetchLogbooks(NIM, token)
      .then(setLogbooks)
      .catch((err) => setError(err.message));
  }, []);

  const handleUpload = async (data: {
    file: File;
    judul: string;
    subjek: string;
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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Form Upload Logbook</CardTitle>
        </CardHeader>
        <CardContent>
          <LogbookForm onSubmit={handleUpload} loading={loading} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Logbook</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <LogbookTable logbooks={logbooks} />
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
