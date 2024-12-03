'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const API_UPLOAD_URL = 'https://backend-si-mbkm.vercel.app/api/upload';

const DOCUMENT_TYPES = [
  { label: 'CV', value: 'CV' },
  { label: 'KTP', value: 'KTP' },
  { label: 'Transkrip Nilai', value: 'transkrip' },
  { label: 'Sertifikat Organisasi', value: 'sertifikat' },
  { label: 'Dokumen Tambahan', value: 'dokumen_tambahan' },
];

export default function UploadDocumentPage() {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!file || !documentType) {
      setMessage('Pilih jenis dokumen dan file terlebih dahulu!');
      return;
    }
  
    console.log('Jenis Berkas:', documentType); // Debug log
    console.log('File:', file); // Debug log
    
    const token = Cookies.get('token');
    if (!token) {
      setMessage('Token tidak ditemukan, silakan login ulang.');
      return;
    }
  
    setLoading(true);
  
    // Mendekode token JWT untuk mengambil NIM
    const decodedToken = jwtDecode<{ NIM: string }>(token);
    const nim = decodedToken.NIM;
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jenis_berkas', documentType);
    formData.append('NIM', nim); // Menambahkan NIM ke dalam FormData
  
    try {
      const response = await fetch(API_UPLOAD_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage('Upload berhasil!');
      } else {
        setMessage(data.message || 'Upload gagal');
      }
    } catch (error) {
      console.error('Error during file upload:', error);
      setMessage('Terjadi kesalahan saat upload file.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <PageContainer>
      <Heading
        title="Upload Dokumen"
        description="Unggah dokumen yang diperlukan untuk MBKM"
      />
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Form Upload Dokumen</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis dokumen" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input type="file" onChange={handleFileChange} />
            <Button type="submit" disabled={loading}>
              {loading ? 'Mengunggah...' : 'Unggah'}
            </Button>
          </form>
          {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
