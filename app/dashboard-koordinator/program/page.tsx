'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import Link from 'next/link';
import { Edit, Eye, Trash } from 'lucide-react';

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

    const filtered = programs.filter(
      (program) =>
        program.company.toLowerCase().includes(query) ||
        program.role.toLowerCase().includes(query) ||
        program.categories.name.toLowerCase().includes(query)
    );
    setFilteredPrograms(filtered);
  };

  const handleDelete = (id_program_mbkm: number) => {
    console.log('Delete program with ID:', id_program_mbkm);
    // Make a DELETE request to remove the program
    axios
      .delete(`${API_BASE_URL}/program-mbkm/${id_program_mbkm}`)
      .then(() => fetchPrograms())
      .catch((error) => console.error('Error deleting program:', error));
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return (
    <PageContainer scrollable>
      <div className="flex flex-col gap-y-2">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Input Pencarian */}
        <div className="my-2">
          <input
            type="text"
            placeholder="Cari program berdasarkan nama perusahaan, role, atau kategori..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full rounded-md border p-2"
          />
        </div>

        {/* Daftar Program */}
        <div className="my-4">
          <div className="">
            <ul>
              {filteredPrograms.map((program) => (
                <li
                  key={program.id_program_mbkm}
                  className="flex cursor-pointer justify-between border-b px-4 py-2.5 hover:bg-gray-100"
                >
                  <div className="flex flex-col gap-y-1">
                    <p className="font-semibold leading-none">
                      {program.company}
                    </p>
                    <p className="font-light leading-none text-muted-foreground">
                      {program.role}
                    </p>
                    <p className="text-sm">{program.category_id}</p>
                    <p className="text-sm text-gray-500">{program.status}</p>
                  </div>
                  <div className="flex space-x-2">
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
                      onClick={() => handleDelete(program.id_program_mbkm)}
                      className="grid size-8 place-items-center rounded bg-red-600 p-1 text-white"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProgramsPage;
