'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import Cookies from 'js-cookie';

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

interface Category {
  id: string;
  name: string;
}

interface ProgramDetails {
  id_program_mbkm: number;
  company: string;
  deskripsi: string | null;
  role: string;
  status: string;
  date: string;
  category_id: string;
  syarat: string | null;
  Category: Category;
}

const EditProgramPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id_program_mbkm = params.id as string;

  const [program, setProgram] = useState<ProgramDetails>({
    id_program_mbkm: 0,
    company: '',
    deskripsi: '',
    role: '',
    status: 'Active',
    date: '',
    category_id: '',
    syarat: '',
    Category: { id: '', name: '' }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard-koordinator' },
    { title: 'Program MBKM', link: '/dashboard-koordinator/program' },
    {
      title: 'Edit Program MBKM',
      link: `/dashboard-koordinator/program/${id_program_mbkm}/edit`
    }
  ];

  const getAuthToken = () => {
    return Cookies.get('token');
  };

  // Fetch program details and categories
  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/program-mbkm/${id_program_mbkm}`
        );
        setProgram(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching program details:', err);
        setError('Gagal memuat data program');
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    if (id_program_mbkm) {
      fetchProgramDetails();
    }
    fetchCategories();
  }, [id_program_mbkm]);

  // Handle Input changes for input and select
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProgram((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Textarea change
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProgram((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProgram((prev) => ({
      ...prev,
      category_id: e.target.value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = getAuthToken();
      await axios.put(
        `${API_BASE_URL}/program-mbkm/${id_program_mbkm}`,
        program,
        {
          headers: {
            Authorization: `Bearer ${token}` // Add token to the request headers
          }
        }
      );
      router.push('/dashboard-koordinator/program');
    } catch (err) {
      console.error('Error updating program:', err);
      setError('Gagal memperbarui data program');
    }
  };

  if (loading) {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="m-6 h-8 w-8 animate-spin fill-blue-600 text-muted md:m-12 dark:text-muted-foreground"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-col gap-y-4">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Link
              href="/dashboard-koordinator/program"
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold">Edit Program MBKM</h1>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* ID Program MBKM (Disabled) */}
            <div>
              <label
                htmlFor="id_program_mbkm"
                className="block text-sm font-medium text-muted-foreground"
              >
                ID Program MBKM
              </label>
              <Input
                type="text"
                id="id_program_mbkm"
                name="id_program_mbkm"
                value={program.id_program_mbkm}
                disabled
                className="mt-1 block w-full"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category_id"
                className="block text-sm font-medium text-muted-foreground"
              >
                Kategori Program
              </label>
              <select
                id="category_id"
                name="category_id"
                value={program.category_id}
                onChange={handleCategoryChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Company */}
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-muted-foreground"
            >
              Perusahaan
            </label>
            <Input
              type="text"
              id="company"
              name="company"
              value={program.company}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="deskripsi"
              className="block text-sm font-medium text-muted-foreground"
            >
              Deskripsi Program
            </label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={program.deskripsi || ''}
              onChange={handleTextAreaChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          {/* Requirements */}
          <div>
            <label
              htmlFor="syarat"
              className="block text-sm font-medium text-muted-foreground"
            >
              Syarat Program
            </label>
            <textarea
              id="syarat"
              name="syarat"
              value={program.syarat || ''}
              onChange={handleTextAreaChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Save size={18} className="mr-2" />
              Simpan
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};

export default EditProgramPage;
