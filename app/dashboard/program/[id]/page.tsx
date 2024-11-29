'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
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

// URL API
const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

// Interfaces
interface ProgramMBKM {
  id_program_mbkm: number;
  company: string;
  deskripsi: string | null;
  syarat: string;
  status: string;
  date: string;
  waktu_pelaksanaan: string | null;
  category_id: string;
  Category: {
    id: string;
    name: string;
  };
}

export default function ProgramDetailPage({
  params
}: {
  params: { id: string };
}) {
  const id = params.id;

  const [program, setProgram] = useState<ProgramMBKM | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProgramDetails();
    }
  }, [id]);

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

  if (loading) {
    return (
      <PageContainer scrollable={true}>
        <Alert>
          <AlertTitle>Loading...</AlertTitle>
          <AlertDescription>Mengambil detail program.</AlertDescription>
        </Alert>
      </PageContainer>
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

  return (
    <PageContainer scrollable={true}>
      <Heading
        title={program.company}
        description={program.deskripsi ?? 'Deskripsi tidak tersedia'}
      />
      <Separator className="mb-4 mt-4" />

      <div className="space-y-4">
        <p>
          <strong>Deskripsi:</strong>{' '}
          {program.deskripsi ?? 'Deskripsi tidak tersedia'}
        </p>
        <p>
          <strong>Syarat:</strong>{' '}
          <Badge variant="secondary">{program.syarat}</Badge>
        </p>
        <p>
          <strong>Status:</strong>{' '}
          <Badge
            variant={program.status === 'Active' ? 'default' : 'secondary'}
          >
            {program.status}
          </Badge>
        </p>
        <p>
          <strong>Tanggal Mulai:</strong>{' '}
          {new Date(program.date).toLocaleDateString('id-ID')}
        </p>
        {program.waktu_pelaksanaan && (
          <p>
            <strong>Waktu Pelaksanaan:</strong> {program.waktu_pelaksanaan}
          </p>
        )}
      </div>

      <Button variant="default">Ajukan Pendaftaran</Button>
    </PageContainer>
  );
}
