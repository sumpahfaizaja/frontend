'use client';
import React, { useEffect, useState } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [roles, setRoles] = useState<string[]>([]);
  const [filteredNavItems, setFilteredNavItems] = useState<typeof navItems>({});

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log(decoded);

        setRoles(decoded.roles || []);

        // Filter navItems based on the user's role
        const filteredItems: typeof navItems = {};

        // Check the user's role and include the relevant items
        Object.entries(navItems).forEach(([key, value]) => {
          if (value.role === decoded.role) {
            filteredItems[key] = value;
          }
        });

        setFilteredNavItems(filteredItems);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, []);

  const handleToggle = () => {
    toggle();
  };

  return (
    <aside
      className={cn(
        `relative hidden h-screen flex-none border-r bg-black text-white transition-[width] duration-500 md:block`,
        !isMinimized ? 'w-72' : 'w-[72px]',
        className
      )}
    >
      <div className="p-5 pt-8">
        <Link href={'/'} aria-label="Go to homepage">
          <Image
            src="/logo/logo-undip.png"
            alt="Logo Undip"
            width={32}
            height={32}
            priority
          />
        </Link>
      </div>
      <div
        onClick={handleToggle}
        className="absolute -right-[52px] flex items-center justify-center top-4 z-50 size-9 cursor-pointer rounded-md border border-input bg-transparent shadow-sm hover:bg-accent"
      >
        <ChevronLeft
          className={cn(
            'text-foreground hover:text-accent-foreground',
            isMinimized && 'rotate-180'
          )}
          size={18}
        />
      </div>
      <div className="flex h-[calc(100svh-89px)] flex-col gap-y-4 overflow-y-auto px-3 py-6">
        {/* Render the filtered navItems for the sidebar */}
        <DashboardNav items={filteredNavItems} />
      </div>
    </aside>
  );
}
