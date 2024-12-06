'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const API_UPLOAD_URL = 'https://backend-si-mbkm.vercel.app/api/upload';
const API_GET_FILES_URL = 'https://backend-si-mbkm.vercel.app/api/upload/nim';

const DOCUMENT_TYPES = [
  { label: 'CV', value: 'CV' },
  { label: 'KTP', value: 'KTP' },
  { label: 'Transkrip Nilai', value: 'transkrip' },
  { label: 'Sertifikat Organisasi', value: 'sertifikat' },
  { label: 'Dokumen Tambahan', value: 'dokumen_tambahan' }
];

export default function UploadDocumentPage() {
  const [files, setFiles] = useState<Record<string, any>>({});
  const [newFile, setNewFile] = useState<Record<string, File | null>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<string | null>(null);
  const token = Cookies.get('token');
  const nim = token ? jwtDecode<{ NIM: string }>(token).NIM : null;

  useEffect(() => {
    if (nim) {
      fetchUploadedFiles(nim);
    }
  }, [nim]);

  const fetchUploadedFiles = async (nim: string) => {
    try {
      const response = await fetch(`${API_GET_FILES_URL}/${nim}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        const filesMap = DOCUMENT_TYPES.reduce(
          (acc, type) => {
            const file = data.data.find(
              (f: any) => f.jenis_berkas === type.value
            );
            acc[type.value] = file || null;
            return acc;
          },
          {} as Record<string, any>
        );
        setFiles(filesMap);
      } else {
        setMessage(data.message || 'Gagal memuat data dokumen.');
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      setMessage('Terjadi kesalahan saat memuat data dokumen.');
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewFile({ ...newFile, [type]: e.target.files[0] });
    }
  };

  const setLoadingState = (type: string, isLoading: boolean) => {
    setLoading((prev) => ({ ...prev, [type]: isLoading }));
  };

  const handleUpload = async (type: string) => {
    const file = newFile[type];
    if (!file) {
      setMessage(`Pilih file untuk jenis dokumen ${type}!`);
      return;
    }

    if (!nim) {
      setMessage('NIM tidak ditemukan, silakan login ulang.');
      return;
    }

    setLoadingState(type, true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('jenis_berkas', type);
    formData.append('NIM', nim);

    try {
      const response = await fetch(API_UPLOAD_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Upload dokumen ${type} berhasil!`);
        fetchUploadedFiles(nim);
      } else {
        setMessage(data.message || `Gagal mengunggah dokumen ${type}.`);
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setMessage('Terjadi kesalahan saat mengunggah file.');
    } finally {
      setLoadingState(type, false);
    }
  };

  const handleDelete = async (type: string) => {
    const file = files[type];
    if (!file) return;

    // Optimistically remove the file from state
    setFiles((prev) => ({ ...prev, [type]: null }));

    setLoadingState(type, true);

    try {
      const response = await fetch(
        `${API_UPLOAD_URL}/${file.id_berkas_penilaian}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(`Dokumen ${type} berhasil dihapus!`);
      } else {
        // Revert state if delete fails
        setFiles((prev) => ({ ...prev, [type]: file }));
        setMessage(data.message || `Gagal menghapus dokumen ${type}.`);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      // Revert state if an error occurs
      setFiles((prev) => ({ ...prev, [type]: file }));
      setMessage('Terjadi kesalahan saat menghapus file.');
    } finally {
      setLoadingState(type, false);
    }
  };

  return (
    <>
      <Heading
        title="Upload Dokumen"
        description="Unggah dokumen yang diperlukan untuk MBKM"
      />
      <Separator className="my-4" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DOCUMENT_TYPES.map((type) => (
          <Card key={type.value} className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-800">
                {type.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              {files[type.value] ? (
                <div className="space-y-2">
                  <Button asChild variant={'default'} className="w-full">
                    <Link
                      href={files[type.value].nama_berkas}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Lihat file
                    </Link>
                  </Button>
                  <Button
                    onClick={() => handleDelete(type.value)}
                    disabled={loading[type.value]}
                    className="w-full bg-red-500 text-white hover:bg-red-600"
                  >
                    {loading[type.value] ? 'Menghapus...' : 'Hapus'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, type.value)}
                  />
                  <Button
                    onClick={() => handleUpload(type.value)}
                    disabled={loading[type.value]}
                    className="w-full bg-blue-500 text-white hover:bg-blue-600"
                  >
                    {loading[type.value] ? 'Mengunggah...' : 'Unggah'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
