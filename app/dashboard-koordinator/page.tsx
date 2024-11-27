'use client';

import { useEffect, useState } from 'react';
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
  const [program, setProgram] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const responses = await Promise.allSettled([
          fetch('https://backend-si-mbkm.vercel.app/api/mahasiswa'),
          fetch('https://backend-si-mbkm.vercel.app/api/program-mbkm'),
          fetch('https://backend-si-mbkm.vercel.app/api/pengumuman'),
          fetch('https://backend-si-mbkm.vercel.app/api/dosbing')
        ]);

        // Handle each response
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
          setProgram(
            programsData.map(
              (program: {
                id_program_mbkm: number;
                company: string;
                deskripsi: string;
                role: string;
                status: string;
                category_id: number;
              }) => ({
                id_program_mbkm: program.id_program_mbkm,
                label: program.company,
                value: program.deskripsi,
                role: program.role,
                status: program.status,
                category_id: program.category_id
              })
            )
          );
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

        // Check for errors in any failed fetch
        if (
          responses.some(
            (res) =>
              res.status === 'rejected' ||
              (res.status === 'fulfilled' && !res.value.ok)
          )
        ) {
          setError('Some data could not be fetched. Please try again later.');
        }
      } catch (err) {
        setError('An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(students);

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-4">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            Selamat datang, Admin MBKM 👋
          </h2>
          <div className="ml-auto flex items-center gap-x-2">
            {/* <CalendarDateRangePicker /> */}
            <Button>Download Laporan</Button>
          </div>
        </div>

        {/* Statistik Utama */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Total Mahasiswa', count: stats.studentCount },
            { title: 'Total Program MBKM', count: stats.programCount },
            { title: 'Total Dosen Pembimbing', count: stats.mentorsCount }
          ].map((stat, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <p className="text-lg">{stat.count}</p>
                )}
              </CardContent>
            </Card>
          ))}
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
              ) : pengumuman && pengumuman.length > 0 ? (
                <ul className="space-y-2">
                  {pengumuman.map((activity, index) => (
                    <li key={index}>
                      <div className="flex w-full items-center justify-between">
                        <p>{activity.judul}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Intl.DateTimeFormat('id-ID', {
                            dateStyle: 'long'
                          }).format(new Date(activity.tanggal))}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.isi}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Tidak ada aktivitas terbaru.</p>
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
              ) : students && students.length > 0 ? (
                <ul className="flex w-full flex-col gap-y-1 rounded-lg border bg-background p-4 text-foreground">
                  {students.map((student, index) => (
                    <li key={index} className="flex items-center">
                      <p className="text-sm">{student.nama_mahasiswa}</p>
                      <p className="ml-auto text-xs text-muted-foreground">
                        {student.NIM}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: 'red' }}>{error}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
