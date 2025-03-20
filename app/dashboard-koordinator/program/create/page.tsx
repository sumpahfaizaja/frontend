'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Save } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import Cookies from 'js-cookie';

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

interface Category {
  id: string;
  name: string;
}

const CreateProgramPage = () => {
  const router = useRouter();
  const [program, setProgram] = useState({
    company: '',
    deskripsi: '',
    syarat: '', // Added syarat here
    role: '',
    status: 'Active',
    date: '',
    waktu_pelaksanaan: '',
    category_id: ''
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => {
    return Cookies.get('token');
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProgram((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = getAuthToken();
      const payload = {
        ...program,
        date: new Date(program.date).toISOString(),
        waktu_pelaksanaan: new Date(program.waktu_pelaksanaan).toISOString()
      };

      await axios.post(`${API_BASE_URL}/program-mbkm`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      router.push('/dashboard-koordinator/program');
    } catch (err: any) {
      console.error('Error creating program:', err);
      setError(err.response?.data?.message || 'Failed to create program');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer scrollable>
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Link
              href="/dashboard-koordinator/program"
              className="rounded-full p-2 hover:bg-muted"
            >
              <Save size={24} />
            </Link>
            <h1 className="text-2xl font-bold">Create Program MBKM</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-muted-foreground"
              >
                Company
              </label>
              <Input
                type="text"
                id="company"
                name="company"
                value={program.company}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md bg-accent shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="deskripsi"
                className="block text-sm font-medium text-muted-foreground"
              >
                Deskripsi
              </label>
              <Input
                type="text"
                id="deskripsi"
                name="deskripsi"
                value={program.deskripsi}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md bg-accent shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="syarat"
                className="block text-sm font-medium text-muted-foreground"
              >
                Syarat
              </label>
              <Input
                type="text"
                id="syarat"
                name="syarat"
                value={program.syarat}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md bg-accent shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-muted-foreground"
              >
                Role
              </label>
              <Input
                type="text"
                id="role"
                name="role"
                value={program.role}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md bg-accent shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-muted-foreground"
              >
                Start Date
              </label>
              <Input
                type="datetime-local"
                id="date"
                name="date"
                value={program.date}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md bg-accent shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="waktu_pelaksanaan"
                className="block text-sm font-medium text-muted-foreground"
              >
                End Date
              </label>
              <Input
                type="datetime-local"
                id="waktu_pelaksanaan"
                name="waktu_pelaksanaan"
                value={program.waktu_pelaksanaan}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md bg-accent shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-muted-foreground"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={program.status}
                onChange={handleInputChange}
                required
                className="mt-1 block h-9 w-full rounded-md border bg-accent shadow-sm"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="category_id"
                className="block text-sm font-medium text-muted-foreground"
              >
                Category
              </label>
              <select
                id="category_id"
                name="category_id"
                value={program.category_id}
                onChange={handleInputChange}
                required
                className="mt-1 block h-9 w-full rounded-md border bg-accent shadow-sm"
              >
                <option value="">Pilih kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
              disabled={loading}
            >
              <Save size={16} className="mr-2" />
              {loading ? 'Loading...' : 'Create Program'}
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};

export default CreateProgramPage;
