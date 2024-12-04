'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const API_UPLOAD_URL = 'https://backend-si-mbkm.vercel.app/api/logbook';
const API_FETCH_LOGBOOKS = 'https://backend-si-mbkm.vercel.app/api/logbook';

interface Logbook {
  id: string;
  nama_file: string;
  judul: string;
  subjek: string;
  uploadDate: string;
}

export default function LogbookPage() {
  const [file, setFile] = useState<File | null>(null);
  const [judul, setJudul] = useState('');
  const [subjek, setSubjek] = useState('');
  const [logbooks, setLogbooks] = useState<Logbook[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch logbooks
  useEffect(() => {
    const fetchLogbooks = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('Token tidak ditemukan');
        }

        const decodedToken = jwtDecode<{ NIM: string }>(token);
        const nim = decodedToken.NIM;

        const response = await fetch(
          `https://backend-si-mbkm.vercel.app/api/logbook/nim/${nim}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Gagal memuat data logbook');
        }

        const data = await response.json();
        setLogbooks(data); // Menyimpan data logbook ke state
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Terjadi kesalahan saat memuat logbook');
      }
    };

    fetchLogbooks();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !judul || !subjek) {
      setMessage('Lengkapi semua data dan unggah file!');
      return;
    }

    const token = Cookies.get('token');
    if (!token) {
      setMessage('Token tidak ditemukan, silakan login ulang.');
      return;
    }

    setLoading(true);

    try {
      const decodedToken = jwtDecode<{ NIM: string }>(token);
      const nim = decodedToken.NIM;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('judul', judul);
      formData.append('subjek', subjek);
      formData.append('NIM', nim);

      const response = await fetch(API_UPLOAD_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Logbook berhasil diunggah!');
        setFile(null);
        setJudul('');
        setSubjek('');
        setLogbooks((prev) => [...prev, data]); // Update daftar logbook
      } else {
        setMessage(data.message || 'Logbook gagal diunggah.');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setMessage('Terjadi kesalahan saat unggah logbook.');
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
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Form Upload Logbook</CardTitle>
        </CardHeader>
        <CardContent>
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
            <Input type="file" onChange={handleFileChange} />
            <Button type="submit" disabled={loading}>
              {loading ? 'Mengunggah...' : 'Unggah Logbook'}
            </Button>
          </form>
          {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Logbook</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : logbooks.length === 0 ? (
            <p>Tidak ada logbook yang diunggah.</p>
          ) : (
            <div className="scrollable-table-container">
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Nama File</th>
                    <th className="border px-4 py-2">Judul</th>
                    <th className="border px-4 py-2">Subjek</th>
                    <th className="border px-4 py-2">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {logbooks.map((logbook) => {
                    const fileUrl = logbook.nama_file;

                    return (
                      <tr key={logbook.id}>
                        <td className="border px-4 py-2">
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                          >
                            Lihat
                          </a>
                        </td>
                        <td className="border px-4 py-2">{logbook.judul}</td>
                        <td className="border px-4 py-2">{logbook.subjek}</td>
                        <td className="border px-4 py-2">
                          {logbook.uploadDate}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
