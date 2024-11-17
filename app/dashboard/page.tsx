// Beri tanda bahwa ini adalah Client Component
'use client';

import { useEffect, useState } from 'react';
import { AreaGraph } from '@/components/charts/area-graph';
import { BarGraph } from '@/components/charts/bar-graph';
import { PieGraph } from '@/components/charts/pie-graph';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function DashboardMBKM() {
  const [studentCount, setStudentCount] = useState(0);
  const [programCount, setProgramCount] = useState(0);
  const [mentorsCount, setMentorsCount] = useState(0);
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [programStats, setProgramStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Memanggil API secara paralel
        const [studentsRes, programsRes, activitiesRes, mentorsRes] =
          await Promise.all([
            fetch('https://backend-si-mbkm.vercel.app/api/mahasiswa'),
            fetch('https://backend-si-mbkm.vercel.app/api/program'),
            fetch('https://backend-si-mbkm.vercel.app/api/aktivitas'),
            fetch('https://backend-si-mbkm.vercel.app/api/dosen')
          ]);

        if (
          !studentsRes.ok ||
          !programsRes.ok ||
          !activitiesRes.ok ||
          !mentorsRes.ok
        ) {
          throw new Error('Failed to fetch data');
        }

        const studentsData = await studentsRes.json();
        const programsData = await programsRes.json();
        const activitiesData = await activitiesRes.json();
        const mentorsData = await mentorsRes.json();

        setStudentCount(studentsData.length);
        setProgramCount(programsData.length);
        setMentorsCount(mentorsData.length);
        setStudents(studentsData);
        setActivities(activitiesData);

        // Menyiapkan data untuk grafik lingkaran
        const programDistribution = programsData.map((program) => ({
          label: program.nama_program,
          value: program.jumlah_mahasiswa
        }));
        setProgramStats(programDistribution);
      } catch (error) {
        setError(error.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-4">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            Selamat datang, Admin MBKM 👋
          </h2>
          <div className="ml-auto flex items-center gap-x-2">
            <CalendarDateRangePicker />
            <Button>Download Laporan</Button>
          </div>
        </div>

        {/* Statistik Utama */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Mahasiswa</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <p className="text-lg">{studentCount}</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Program MBKM</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <p className="text-lg">{programCount}</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Dosen Pembimbing</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <p className="text-lg">{mentorsCount}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Daftar Mahasiswa */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Daftar Mahasiswa</CardTitle>
              <CardDescription>
                Nama-nama mahasiswa yang terdaftar dalam sistem MBKM.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
              ) : (
                <ul className="space-y-2">
                  {students.map((student, index) => (
                    <li key={index} className="text-lg">
                      {student.nama_mahasiswa}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Aktivitas Terbaru */}
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : activities.length ? (
                <ul className="space-y-2">
                  {activities.map((activity, index) => (
                    <li key={index}>
                      <p>{activity.deskripsi}</p>
                      <small className="text-muted">{activity.timestamp}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Tidak ada aktivitas terbaru.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Grafik */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <BarGraph />
          </div>
          <div className="col-span-4 md:col-span-3">
            <PieGraph data={programStats} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
