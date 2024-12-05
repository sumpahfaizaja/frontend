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
import { Calendar, Info, AlertTriangle, ClipboardList } from 'lucide-react';
import Link from 'next/link';

// API URL
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
  category: {
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
          <Info className="h-5 w-5" />
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
          <AlertTriangle className="h-5 w-5" />
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
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-x-4">
            <h1 className="text-2xl font-semibold">{program.company}</h1>
            <Badge
              variant={program.status === 'Active' ? 'default' : 'secondary'}
              className="h-6 w-fit text-center"
            >
              {program.status}
            </Badge>
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            {program.deskripsi ?? 'Deskripsi tidak tersedia'}
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center gap-4">
              <ClipboardList className="h-6 w-6 text-blue-500" />
              <div>
                <h4 className="text-sm font-medium text-gray-700">Jenis</h4>
                <Badge variant="secondary">{program.category.name}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Calendar className="h-6 w-6 text-green-500" />
              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  Tanggal Mulai
                </h4>
                <p className="text-gray-900">
                  {new Date(program.date).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
            {program.waktu_pelaksanaan && (
              <div className="flex items-center gap-4">
                <Calendar className="h-6 w-6 text-orange-500" />
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Waktu Pelaksanaan
                  </h4>
                  <p className="text-gray-900">
                    {new Date(program.waktu_pelaksanaan).toLocaleDateString(
                      'id-ID'
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-2 md:gap-x-3">
            <Button variant="secondary" className="w-full md:w-auto" asChild>
              <Link href={'/dashboard/program'}>Kembali</Link>
            </Button>
            <Button variant="default" className="w-full md:w-auto">
              Ajukan Pendaftaran
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
