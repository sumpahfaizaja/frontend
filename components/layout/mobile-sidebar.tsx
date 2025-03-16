'use client';
import React, { useEffect, useState } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { navItems } from '@/constants/data';
import { MenuIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export function MobileSidebar({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
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

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                SI-MBKM
              </h2>
              <div className="h-[calc(100svh-92px)] overflow-y-auto">
                <DashboardNav
                  items={filteredNavItems}
                  isMobileNav={true}
                  setOpen={setOpen}
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
