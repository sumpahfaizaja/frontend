'use client';

import React, { useState, useEffect } from 'react';
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

let DOCUMENT_TYPES = [
  { label: 'CV', value: 'CV' },
  { label: 'KTP', value: 'KTP' },
  { label: 'Transkrip Nilai', value: 'transkrip' },
  { label: 'Sertifikat Organisasi', value: 'sertifikat' },
  { label: 'Dokumen Tambahan 1', value: 'dokumen_tambahan_1' },
  { label: 'Dokumen Tambahan 2', value: 'dokumen_tambahan_2' },
  { label: 'Dokumen Tambahan 3', value: 'dokumen_tambahan_3' },
  { label: 'Dokumen Tambahan 4', value: 'dokumen_tambahan_4' },
  { label: 'Dokumen Tambahan 5', value: 'dokumen_tambahan_5' }
];

export default function UploadDocumentPage(props: {
  nim: string | null;
  allowDelete?: boolean;
}) {
  const { nim: initialNim, allowDelete = true } = props;
  const [files, setFiles] = useState<Record<string, any>>({});
  const [newFile, setNewFile] = useState<Record<string, File | null>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [additionalDocs, setAdditionalDocs] = useState<
    { label: string; value: string }[]
  >([]);
  const token = Cookies.get('token');

  let nim = initialNim;
  if (!initialNim) nim = token ? jwtDecode<{ NIM: string }>(token).NIM : null;

  useEffect(() => {
    if (nim) fetchUploadedFiles(nim);
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
        const filesMap = [...DOCUMENT_TYPES, ...additionalDocs].reduce(
          (acc, type) => {
            if (type.value.includes('dokumen_tambahan')) {
              const files = data.data.filter((f: any) =>
                f.jenis_berkas.includes('dokumen_tambahan')
              );

              for (let i = 0; i < files.length; i++) {
                acc[`${files[i].jenis_berkas}_${i + 1}`] = files[i] || null;
                // DOCUMENT_TYPES.push({
                //   label: `Dokumen Tambahan ${i + 1}`,
                //   value: `${files[i].jenis_berkas}_${i + 1}`
                // });
              }

              // files.forEach((file: any, index: number) => {
              //   console.error(index);
              //   acc[type.value] = file || null;
              // });
            } else {
              const file = data.data.find(
                (f: any) => f.jenis_berkas === type.value
              );

              acc[type.value] = file || null;
            }
            return acc;
          },
          {} as Record<string, any>
        );
        setFiles(filesMap);
        console.log(filesMap);
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

  const handleUpload = async (oldType: string) => {
    let type = oldType;

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

    if (type.includes('dokumen_tambahan')) type = 'dokumen_tambahan';
    formData.append('file', file);
    formData.append('jenis_berkas', type);
    formData.append('NIM', nim);

    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    try {
      console.log('handleUpload function called', file);
      const response = await fetch(API_UPLOAD_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      console.log('fetch url:', API_UPLOAD_URL);
      console.log('Form data:', formData);
      console.log('fetch response:', response);

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.message || `Gagal mengunggah dokumen ${type}.`);
        return;
      }

      const data = await response.json();
      setMessage(`Upload dokumen ${type} berhasil!`);
      fetchUploadedFiles(nim);
    } catch (error) {
      console.error('Error in handleUpload:', error);
      setMessage('Terjadi kesalahan saat mengunggah file.');
    } finally {
      setLoadingState(type, false);
    }
  };

  const handleDelete = async (type: string) => {
    const file = files[type];
    if (!file) return;

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
        setFiles((prev) => ({ ...prev, [type]: file }));
        setMessage(data.message || `Gagal menghapus dokumen ${type}.`);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      setFiles((prev) => ({ ...prev, [type]: file }));
      setMessage('Terjadi kesalahan saat menghapus file.');
    } finally {
      setLoadingState(type, false);
    }
  };

  const handleAddAdditionalDoc = () => {
    const newIndex = additionalDocs.length + 1;
    const newDoc = {
      label: `Dokumen Tambahan ${newIndex}`,
      value: `dokumen_tambahan_${newIndex}`
    };

    setAdditionalDocs((prev) => [...prev, newDoc]);
  };

  return (
    <>
      <Heading
        title="Upload Dokumen"
        description="Unggah dokumen yang diperlukan untuk MBKM"
      />
      <Separator className="my-4" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...DOCUMENT_TYPES, ...additionalDocs].map((type) => (
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
                  {allowDelete && (
                    <Button
                      onClick={() => handleDelete(type.value)}
                      disabled={loading[type.value]}
                      className="w-full bg-red-500 text-white hover:bg-red-600"
                    >
                      {loading[type.value] ? 'Menghapus...' : 'Hapus'}
                    </Button>
                  )}
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
                    className="w-full bg-green-600 text-white hover:bg-green-500"
                  >
                    {loading[type.value] ? 'Mengunggah...' : 'Unggah'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {/* <Button
          onClick={handleAddAdditionalDoc}
          className="w-full bg-blue-600 text-white hover:bg-blue-500"
        >
          Tambah Dokumen
        </Button> */}
      </div>
    </>
  );
}
