'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import Link from 'next/link';
import { Edit, Eye, Trash } from 'lucide-react';
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard-koordinator' },
  { title: 'Manajemen Program', link: '/dashboard-koordinator/program' }
];

interface Program {
  id_program_mbkm: number;
  company: string;
  deskripsi: string | null;
  role: string;
  status: string;
  date: string;
  category_id: string;
  categories: {
    id: string;
    name: string;
  };
}

const ProgramsPage = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/program-mbkm`);
      setPrograms(response.data as Program[]);
      setFilteredPrograms(response.data as Program[]); // Initialize filtered list
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = programs.filter((program) => {
      // Check if company, role, or category_id is not null or undefined before calling toLowerCase
      const companyMatch =
        program.company && program.company.toLowerCase().includes(query);
      const roleMatch =
        program.role && program.role.toLowerCase().includes(query);
      const categoryMatch =
        program.category_id &&
        program.category_id.toLowerCase().includes(query);

      return companyMatch || roleMatch || categoryMatch;
    });

    setFilteredPrograms(filtered);
  };

  const getAuthToken = () => {
    return Cookies.get('token'); // Getting the token from the cookies
  };

  const handleDelete = async (id_program_mbkm: number) => {
    console.log('Delete program with ID:', id_program_mbkm);
    try {
      // Get the authentication token (you need to implement getAuthToken() function)
      const token = getAuthToken();

      // Make a DELETE request to remove the program
      const response = await axios.delete(
        `${API_BASE_URL}/program-mbkm/${id_program_mbkm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Call fetchPrograms after deletion
      fetchPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return (
    <PageContainer scrollable>
      <div className="flex flex-col gap-y-2">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Daftar Program</h2>
        </div>

        {/* Input Pencarian */}
        <div className="my-2 flex items-center gap-x-3">
          <input
            type="text"
            placeholder="Cari program berdasarkan nama perusahaan, role, atau kategori..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full rounded-md border p-2"
          />
          <Button variant="outline" asChild>
            <Link href={'/dashboard-koordinator/program/create'}>
              Tambah Program
            </Link>
          </Button>
        </div>

        {/* Tabs untuk Active & Inactive */}
        <Tabs defaultValue="Active">
          <TabsList>
            <TabsTrigger value="Active">Active</TabsTrigger>
            <TabsTrigger value="Inactive">Inactive</TabsTrigger>
          </TabsList>

          <TabsContent value="Active">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent text-accent-foreground">
                  <TableRow>
                    <TableHead className="text-center">No.</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrograms
                    .filter((program) => program.status === 'Active')
                    .map((program, index) => (
                      <TableRow key={program.id_program_mbkm}>
                        <TableCell className="text-center">
                          {index + 1}.
                        </TableCell>
                        <TableCell>{program.company}</TableCell>
                        <TableCell>{program.deskripsi || '-'}</TableCell>
                        <TableCell>{program.role}</TableCell>
                        <TableCell className="flex justify-center space-x-2">
                          <Link
                            href={`/dashboard-koordinator/program/${program.id_program_mbkm}`}
                            className="grid size-8 place-items-center rounded bg-blue-600 p-1 text-white"
                          >
                            <Eye size={14} />
                          </Link>
                          <Link
                            href={`/dashboard-koordinator/program/${program.id_program_mbkm}/edit`}
                            className="grid size-8 place-items-center rounded bg-amber-500 p-1 text-white"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={() =>
                              handleDelete(program.id_program_mbkm)
                            }
                            className="grid size-8 place-items-center rounded bg-red-600 p-1 text-white"
                          >
                            <Trash size={14} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="Inactive">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent text-accent-foreground">
                  <TableRow>
                    <TableHead className="w-12 text-center">No.</TableHead>
                    <TableHead className="w-1/5">Company</TableHead>
                    <TableHead className="w-2/5">Deskripsi</TableHead>
                    <TableHead className="w-1/5">Role</TableHead>
                    <TableHead className="w-1/5 text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrograms
                    .filter((program) => program.status === 'Inactive')
                    .map((program, index) => (
                      <TableRow key={program.id_program_mbkm}>
                        <TableCell className="text-center">
                          {index + 1}.
                        </TableCell>
                        <TableCell>{program.company}</TableCell>
                        <TableCell>{program.deskripsi || '-'}</TableCell>
                        <TableCell>{program.role}</TableCell>
                        <TableCell className="flex justify-center space-x-2">
                          <Link
                            href={`/dashboard-koordinator/program/${program.id_program_mbkm}`}
                            className="grid size-8 place-items-center rounded bg-blue-600 p-1 text-white"
                          >
                            <Eye size={14} />
                          </Link>
                          <Link
                            href={`/dashboard-koordinator/program/${program.id_program_mbkm}/edit`}
                            className="grid size-8 place-items-center rounded bg-amber-500 p-1 text-white"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={() =>
                              handleDelete(program.id_program_mbkm)
                            }
                            className="grid size-8 place-items-center rounded bg-red-600 p-1 text-white"
                          >
                            <Trash size={14} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default ProgramsPage;
