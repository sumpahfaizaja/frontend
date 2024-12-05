'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import Link from 'next/link';

export default function DashboardMBKM() {
  const [stats, setStats] = useState({
    studentCount: 0,
    programCount: 0,
    mentorsCount: 0
  });
  const [students, setStudents] = useState<
    { nama_mahasiswa: string; NIM: number }[]
  >([]);
  const [pengumuman, setPengumuman] = useState<
    {
      id_pengumuman: number;
      judul: string;
      isi: string;
      tanggal: string;
      NIP_koor_mbkm: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.allSettled([
          fetch('https://backend-si-mbkm.vercel.app/api/mahasiswa'),
          fetch('https://backend-si-mbkm.vercel.app/api/program-mbkm'),
          fetch('https://backend-si-mbkm.vercel.app/api/pengumuman'),
          fetch('https://backend-si-mbkm.vercel.app/api/dosbing')
        ]);

        const [studentsRes, programsRes, activitiesRes, mentorsRes] = responses;

        if (studentsRes.status === 'fulfilled' && studentsRes.value.ok) {
          const studentsData = await studentsRes.value.json();
          setStudents(studentsData);
          setStats((prev) => ({
            ...prev,
            studentCount: studentsData.length
          }));
        }

        if (programsRes.status === 'fulfilled' && programsRes.value.ok) {
          const programsData = await programsRes.value.json();
          setStats((prev) => ({
            ...prev,
            programCount: programsData.length
          }));
        }

        if (activitiesRes.status === 'fulfilled' && activitiesRes.value.ok) {
          const activitiesData = await activitiesRes.value.json();
          setPengumuman(activitiesData);
        }

        if (mentorsRes.status === 'fulfilled' && mentorsRes.value.ok) {
          const mentorsData = await mentorsRes.value.json();
          setStats((prev) => ({
            ...prev,
            mentorsCount: mentorsData.length
          }));
        }
      } catch (err) {
        setError('An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PageContainer scrollable>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard MBKM</h2>
        </div>

        {/* Statistik Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { title: 'Mahasiswa Terdaftar', count: stats.studentCount },
            { title: 'Program MBKM', count: stats.programCount }
          ].map((stat, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  <p className="text-2xl font-semibold">{stat.count}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activities & Students List */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>
                Pengumuman terbaru dari sistem MBKM.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-20 w-full" />
              ) : pengumuman.length > 0 ? (
                <ul className="space-y-3">
                  {pengumuman.map((activity) => (
                    <li key={activity.id_pengumuman}>
                      <Badge>{activity.judul}</Badge>
                      <p className="text-sm text-muted-foreground">
                        {activity.isi}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat('id-ID', {
                          dateStyle: 'medium'
                        }).format(new Date(activity.tanggal))}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Tidak ada pengumuman terbaru.</p>
              )}
            </CardContent>
          </Card>

          {/* Students List */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Mahasiswa</CardTitle>
              <CardDescription>
                Nama-nama mahasiswa yang terdaftar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-20 w-full" />
              ) : students.length > 0 ? (
                <ul className="divide-y">
                  {students.map((student) => (
                    <li
                      key={student.NIM}
                      className="flex items-center justify-between py-2"
                    >
                      <p>{student.nama_mahasiswa}</p>
                      <p className="text-xs text-muted-foreground">
                        {student.NIM}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Tidak ada data mahasiswa.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
