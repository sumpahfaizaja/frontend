import { NavItemOrSeparator } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};

export type Mahasiswa = {
  nim: number;
  fullname: string;
  email: string;
  kegiatan: {
    company: string;
    semester: string;
    role: string;
    category: {
      id: string;
      name: string;
    };
  };
  status: string;
};

export type Program = {
  id: number;
  company: string;
  role: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  status: string;
  date: string;
};

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Kegiatan = {
  id: number;
  company: string;
  semester: string;
  description: string;
  category: string;
  detail: {
    code: string;
    description: string;
    location: string;
    environment: 'onsite' | 'remote' | 'hybrid';
    duration: string;
    certificate: boolean;
    conversion: boolean;
    salary?: string;
    point?: number;
  };
};

export const mahasiswa: Mahasiswa[] = [
  {
    nim: 21120239818347,
    fullname: 'Candice Schiner',
    email: 'mail@example.com',
    kegiatan: {
      company: 'Dell',
      semester: 'Genap 2023/2024',
      role: 'Frontend Developer',
      category: {
        id: 'magang-msib',
        name: 'Magang MSIB'
      }
    },
    status: 'Berjalan'
  },
  {
    nim: 21029184726381,
    fullname: 'John Doe',
    email: 'johndoe@mail.com',
    kegiatan: {
      company: 'TechCorp',
      semester: 'Genap 2023/2024',
      role: 'Backend Developer',
      category: {
        id: 'magang-msib',
        name: 'Magang MSIB'
      }
    },
    status: 'Selesai'
  }
];

export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export const programs: Program[] = [
  {
    id: 1,
    company: 'Dell',
    role: 'Frontend Developer',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: {
      id: 'magang-msib',
      name: 'Magang MSIB'
    },
    status: 'Active',
    date: '2021-07-01'
  },
  {
    id: 2,
    company: 'TechCorp',
    role: 'Backend Developer',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: {
      id: 'magang-msib',
      name: 'Magang MSIB'
    },
    status: 'Active',
    date: '2021-07-01'
  },
  {
    id: 3,
    company: 'WebTech',
    role: 'Mentor UI Designer',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: {
      id: 'kampus-mengajar',
      name: 'Kampus Mengajar'
    },
    status: 'Active',
    date: '2021-07-01'
  },
  {
    id: 4,
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: {
      id: 'magang-msib',
      name: 'Magang MSIB'
    },
    status: 'Inactive',
    date: '2021-07-01'
  },
  {
    id: 5,
    company: 'TechGuru',
    role: 'Product Manager',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: {
      id: 'magang-msib',
      name: 'Magang MSIB'
    },
    status: 'Active',
    date: '2021-07-01'
  },
  {
    id: 6,
    company: 'Dicoding Indonesia',
    role: 'Mentor Android Developer',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: {
      id: 'kampus-mengajar',
      name: 'Kampus Mengajar'
    },
    status: 'Active',
    date: '2021-07-01'
  },
  {
    id: 7,
    company: 'SoftWorks',
    role: 'UX Designer',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: {
      id: 'magang-msib',
      name: 'Magang MSIB'
    },
    status: 'Active',
    date: '2021-07-01'
  },
  {
    id: 8,
    company: 'Cambridge University',
    role: 'Visiting Lecturer',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: {
      id: 'iisma',
      name: 'IISMA'
    },
    status: 'Active',
    date: '2021-07-01'
  },
  {
    id: 9,
    company: 'Harvard University',
    role: 'Visiting Student',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: {
      id: 'iisma',
      name: 'IISMA'
    },
    status: 'Active',
    date: '2021-07-01'
  },
  {
    id: 10,
    company: 'Denpasar University',
    role: 'Visiting Student',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: {
      id: 'student-exchange',
      name: 'Pertukaran Mahasiswa Merdeka'
    },
    status: 'Active',
    date: '2021-07-01'
  },
  {
    id: 11,
    company: 'Google, GoTo, and Traveloka',
    role: 'Cloud Computing Cohort',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: {
      id: 'bangkit-academy',
      name: 'Bangkit Academy'
    },
    status: 'Active',
    date: '2021-07-01'
  },
  {
    id: 12,
    company: 'Google, GoTo, and Traveloka',
    role: 'Mobile Programming Cohort',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: {
      id: 'bangkit-academy',
      name: 'Bangkit Academy'
    },
    status: 'Active',
    date: '2021-07-01'
  },
  {
    id: 13,
    company: 'Google, GoTo, and Traveloka',
    role: 'Machine Learning Cohort',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: {
      id: 'bangkit-academy',
      name: 'Bangkit Academy'
    },
    status: 'Active',
    date: '2021-07-01'
  }
];

export const kegiatan: Kegiatan[] = [
  {
    id: 1,
    company: 'Bangkit Academy 2024 By Google, GoTo, Traveloka',
    semester: 'Genap 2023/2024',
    description: 'Cloud Computing Learning Path',
    category: 'Bangkit Academy',
    detail: {
      code: 'BA-9754',
      description: 'Lorem ipsum dolor sit ammet.',
      location: 'Bandung, Jawa Barat',
      environment: 'remote',
      duration: '4 months',
      certificate: true,
      conversion: true,
      salary: '-',
      point: 21
    }
  },
  {
    id: 2,
    company: 'TokoPedia',
    semester: 'Genap 2023/2024',
    description: 'Frontend Developer Internship',
    category: 'Magang MSIB',
    detail: {
      code: 'MS-1293',
      description: 'Lorem ipsum dolor sit ammet.',
      location: 'Jakarta Selatan, DKI Jakarta',
      environment: 'onsite',
      duration: '4 months',
      certificate: true,
      conversion: true,
      salary: 'IDR 3.600.000',
      point: 20
    }
  },
  {
    id: 3,
    company: 'Bangkit Academy 2024 By Google, GoTo, Traveloka',
    semester: 'Genap 2023/2024',
    description: 'Machine Learning Path',
    category: 'Bangkit Academy',
    detail: {
      code: 'BA-CCLP',
      description: 'Lorem ipsum dolor sit ammet.',
      location: 'Jakarta Pusat, DKI Jakarta',
      environment: 'remote',
      duration: '3 months',
      certificate: true,
      conversion: true,
      salary: '-',
      point: 21
    }
  },
  {
    id: 4,
    company: 'Innovate Inc.',
    semester: 'Genap 2023/2024',
    description: 'Mobile Developer Internship',
    category: 'Magang MSIB',
    detail: {
      code: 'MS-4513',
      description: 'Lorem ipsum dolor sit ammet.',
      location: 'Bandung, Jawa Barat',
      environment: 'hybrid',
      duration: '3 months',
      certificate: true,
      conversion: false,
      salary: 'IDR 3.000.000',
      point: 0
    }
  }
];

export const navItems: Record<
  string,
  { label: string; items: NavItemOrSeparator[] }
> = {
  general: {
    label: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: 'dashboard',
        label: 'Dashboard'
      },
      {
        title: 'Program Mahasiswa',
        href: '/dashboard/program',
        icon: 'briefcase',
        label: 'program'
      },
      {
        title: 'Kegiatan Mahasiswa',
        href: '/dashboard/kegiatan',
        icon: 'profile',
        label: 'kegiatan'
      },
      { separator: true },
      {
        title: 'Laporan',
        href: '/dashboard/laporan',
        icon: 'file-check',
        label: 'laporan'
      },
      {
        title: 'Logbook',
        href: '/dashboard/logbook',
        icon: 'book-open-text',
        label: 'logbook'
      },
      {
        title: 'Kanban',
        href: '/dashboard/kanban',
        icon: 'kanban',
        label: 'kanban'
      },
      { separator: true },
      {
        title: 'Dokumen',
        href: '/dashboard/dokumen',
        icon: 'help',
        label: 'dokumen'
      }
    ]
  },
  koordinator: {
    label: 'Koordinator',
    items: [
      {
        title: 'Dashboard Koordinator',
        href: '/dashboard-koordinator',
        icon: 'dashboard',
        label: 'Dashboard Koordinator'
      },
      {
        title: 'Data Mahasiswa',
        href: '/dashboard-koordinator/mahasiswa',
        icon: 'graduation-cap',
        label: 'Mahasiswa'
      },
      {
        title: 'Manajemen Program',
        href: '/dashboard-koordinator/manajemen',
        icon: 'graduation-cap',
        label: 'Manajemen Program'
      },
      {
        title: 'Verifikasi Program',
        href: '/dashboard-koordinator/verifikasi',
        icon: 'graduation-cap',
        label: 'verifikasi'
      }
    ]
  },
  dosen: {
    label: 'Dosen',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard-dosbing',
        icon: 'dashboard',
        label: 'Dashboard Koordinator'
      },
      {
        title: 'Data Mahasiswa',
        href: '/dashboard-dosbing/mahasiswa',
        icon: 'graduation-cap',
        label: 'Mahasiswa'
      },
      {
        title: 'Program Saya',
        href: '/dashboard-dosbing/program',
        icon: 'graduation-cap',
        label: 'Program Saya'
      },
      {
        title: 'Logbook',
        href: '/dashboard-dosbing/logbook',
        icon: 'graduation-cap',
        label: 'Logbook'
      },
      {
        title: 'Penilaian',
        href: '/dashboard-dosbing/nilai',
        icon: 'graduation-cap',
        label: 'Penilaian'
      }
    ]
  },
  admin: {
    label: 'Admin',
    items: [
      {
        title: 'Dashboard Admin',
        href: '/dashboard-admin',
        icon: 'dashboard',
        label: 'Dashboard Admin'
      },
      {
        title: 'Nilai & Konversi',
        href: '/dashboard-admin/nilaikonversi',
        icon: 'graduation-cap',
        label: 'Nilai & Konversi'
      }
    ]
  },
  auth: {
    label: 'Akun',
    items: [
      {
        title: 'Sertifikat',
        href: '/dashboard/sertifikat',
        icon: 'book-check',
        label: 'sertifikat'
      },
      {
        title: 'Profil',
        href: '/dashboard/profil',
        icon: 'profile',
        label: 'profil'
      }
    ]
  }
};
