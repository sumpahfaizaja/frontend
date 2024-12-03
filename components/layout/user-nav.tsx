'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'https://backend-si-mbkm.vercel.app/api';

interface DecodedToken {
  role: string;
  email: string;
  NIM?: string;
  NIP_dosbing?: string;
  NIP_koor_mbkm?: string;
  NIP_admin_siap?: string;
  iat: number;
  exp: number;
}

export function UserNav() {
  const [session, setSession] = useState({
    user: {
      name: '',
      email: '',
      image: ''
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        console.log(decoded);
        const userId =
          decoded.NIM ||
          decoded.NIP_dosbing ||
          decoded.NIP_koor_mbkm ||
          decoded.NIP_admin_siap;

        fetchUserData(userId, decoded.role, decoded.email);
      } catch (error) {
        console.error('Error decoding token:', error);
        handleSignOut();
      }
    } else {
      handleSignOut();
    }
  }, []);

  const fetchUserData = async (
    id: string | undefined,
    role: string,
    email: string
  ) => {
    try {
      if (!id) throw new Error('No valid ID found in the token');

      let endpoint = '';
      switch (role) {
        case 'mahasiswa':
          endpoint = `/mahasiswa/${id}`;
          break;
        case 'dosbing':
          endpoint = `/dosbing/${id}`;
          break;
        case 'koor_mbkm':
          endpoint = `/koor-mbkm/${id}`;
          break;
        case 'admin_siap':
          endpoint = `/admin-siap/${id}`;
          break;
        default:
          throw new Error('Invalid role');
      }

      const response = await axios.get(`${API_BASE_URL}${endpoint}`);
      const data = response.data;

      let userName = '';
      switch (role) {
        case 'mahasiswa':
          userName = data.nama_mahasiswa;
          break;
        case 'dosbing':
          userName = data.nama_dosbing;
          break;
        case 'koor_mbkm':
          userName = data.nama_koor_mbkm;
          break;
        case 'admin_siap':
          userName = data.nama_admin_siap;
          break;
      }

      setSession({
        user: {
          name: userName,
          email: email || 'user@example.com',
          image: ''
        }
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      handleSignOut();
    }
  };

  const handleSignOut = () => {
    Cookies.remove('token');
    router.push('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative size-8 rounded-full md:size-9"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Avatar className="size-8 overflow-hidden md:size-9">
            <AvatarImage
              src={session.user?.image ?? ''}
              alt={session.user?.name ?? ''}
            />
            <AvatarFallback>{session.user?.name?.[0] ?? '?'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      {isOpen && (
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
