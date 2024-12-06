'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

interface ProgramRegistration {
  id_pendaftaran_mbkm: number;
  NIM: string;
  NIP_dosbing: string;
  tanggal: string;
  status: string;
  id_program_mbkm: number;
}

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

export default function AdminRegistrationsPage() {
  const [pendaftaranMBKM, setPendaftaranMBKM] = useState<ProgramRegistration[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPendaftaranMBKM();
  }, []);

  const getAuthToken = () => Cookies.get('token');

  const fetchPendaftaranMBKM = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/pendaftaran-mbkm`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendaftaranMBKM(response.data);
    } catch (error) {
      console.error('Kesalahan saat mengambil data pendaftaran MBKM:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const token = getAuthToken();
      await axios.put(
        `${API_BASE_URL}/pendaftaran-mbkm/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update status locally
      setPendaftaranMBKM((prevState) =>
        prevState.map((item) =>
          item.id_pendaftaran_mbkm === id
            ? { ...item, status: newStatus }
            : item
        )
      );

      alert(`Status berhasil diubah menjadi ${newStatus}!`);
    } catch (error) {
      console.error('Kesalahan saat mengubah status:', error);
      alert('Terjadi kesalahan saat mengubah status.');
    }
  };

  return (
    <PageContainer>
      <Heading
        title="Pendaftaran Program MBKM"
        description="Daftar pendaftaran program MBKM."
      />
      <Separator className="my-4" />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <Table className="w-full text-left">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="px-4 py-3">ID</TableHead>
                <TableHead className="px-4 py-3">NIM</TableHead>
                <TableHead className="px-4 py-3">Tanggal</TableHead>
                <TableHead className="px-4 py-3">Status</TableHead>
                <TableHead className="px-4 py-3 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendaftaranMBKM.map((pendaftaran, index) => (
                <TableRow
                  key={pendaftaran.id_pendaftaran_mbkm}
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-100`}
                >
                  <TableCell className="px-4 py-3">
                    {pendaftaran.id_pendaftaran_mbkm}
                  </TableCell>
                  <TableCell className="px-4 py-3">{pendaftaran.NIM}</TableCell>
                  <TableCell className="px-4 py-3">
                    {new Date(pendaftaran.tanggal).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 capitalize">
                    {pendaftaran.status}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() =>
                          updateStatus(
                            pendaftaran.id_pendaftaran_mbkm,
                            pendaftaran.status === 'pending'
                              ? 'verif'
                              : 'pending'
                          )
                        }
                      >
                        {pendaftaran.status === 'pending'
                          ? 'Verify'
                          : 'Unverify'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </PageContainer>
  );
}
