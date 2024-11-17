'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'logbook', link: '/dashboard/logbook' }
];

export default function LogbookPage() {
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchLogbooks = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(
          'https://backend-si-mbkm.vercel.app/api/logbook'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch logbook data');
        }
        const data = await response.json();
        setLogbooks(data);
      } catch (error) {
        setError(error.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLogbooks();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUploadLogbook = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('logbook', file);

    try {
      const response = await fetch(
        'https://backend-si-mbkm.vercel.app/api/upload-logbook',
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload logbook');
      }

      alert('Logbook uploaded successfully!');
      // Reload the logbooks after successful upload
      fetchLogbooks();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-4">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            Logbook Kegiatan MBKM
          </h2>
        </div>

        {/* Form Upload Logbook */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Upload Logbook Kegiatan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="w-full border p-2"
                />
                <Button onClick={handleUploadLogbook} className="mt-4 w-full">
                  Upload Logbook
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Riwayat Logbook */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Logbook</CardTitle>
              <CardDescription>
                Daftar logbook yang telah diunggah oleh Anda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
              ) : (
                <table className="min-w-full table-auto">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Nama File</th>
                      <th className="border px-4 py-2">Tanggal Upload</th>
                      <th className="border px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logbooks.map((logbook) => (
                      <tr key={logbook.id}>
                        <td className="border px-4 py-2">{logbook.fileName}</td>
                        <td className="border px-4 py-2">
                          {logbook.uploadDate}
                        </td>
                        <td className="border px-4 py-2">
                          {logbook.status === 'accepted' ? (
                            <span className="text-green-500">
                              Terverifikasi
                            </span>
                          ) : logbook.status === 'pending' ? (
                            <span className="text-yellow-500">
                              Menunggu Verifikasi
                            </span>
                          ) : (
                            <span className="text-red-500">Ditolak</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
