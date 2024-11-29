import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { NavItemOrSeparator, NavItemWithChildren } from '@/types'; // Ensure correct import
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip';

interface DashboardNavProps {
  items: Record<string, { label: string; items: NavItemOrSeparator[] }>;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false
}: DashboardNavProps) {
  const path = usePathname();
  const { isMinimized } = useSidebar();

  if (!Object.keys(items).length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      <TooltipProvider>
        {Object.entries(items).map(
          ([category, { label, items: categoryItems }]) => (
            <div key={category} className="mb-4">
              {(!isMinimized || isMobileNav) && (
                <h3 className="mb-2 ml-3 text-sm font-semibold text-muted-foreground">
                  {label}
                </h3>
              )}
              {categoryItems.map((item, index) => {
                if ('separator' in item) {
                  return (
                    <hr
                      key={`${category}-separator-${index}`}
                      className="my-2 border-t border-accent"
                    />
                  );
                }

                const Icon = Icons[item.icon || 'arrowRight'];

                // Check if the item has children
                if ('items' in item) {
                  return (
                    <div key={`${category}-${index}`}>
                      {/* Render item with children */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                              path === item.href ? 'bg-accent' : 'transparent'
                            )}
                            onClick={() => {
                              if (setOpen) setOpen(false);
                            }}
                          >
                            <Icon className="ml-3 size-5 flex-none" />
                            <span className="mr-2 truncate">{item.title}</span>
                          </Link>
                        </TooltipTrigger>
                      </Tooltip>
                      <div className="ml-6">
                        {item.items.map((childItem, childIndex) => {
                          if ('separator' in childItem) {
                            return (
                              <hr
                                key={`separator-${childIndex}`}
                                className="my-2 border-t border-accent"
                              />
                            );
                          }

                          const ChildIcon =
                            Icons[childItem.icon || 'arrowRight'];
                          return (
                            <Tooltip key={`child-${childIndex}`}>
                              <TooltipTrigger asChild>
                                <Link
                                  href={childItem.href}
                                  className={cn(
                                    'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                                    path === childItem.href
                                      ? 'bg-accent'
                                      : 'transparent'
                                  )}
                                  onClick={() => {
                                    if (setOpen) setOpen(false);
                                  }}
                                >
                                  <ChildIcon className="ml-3 size-5 flex-none" />
                                  <span className="mr-2 truncate">
                                    {childItem.title}
                                  </span>
                                </Link>
                              </TooltipTrigger>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                return (
                  <Tooltip key={`${category}-${index}`}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                          path === item.href ? 'bg-accent' : 'transparent',
                          item.disabled && 'cursor-not-allowed opacity-80'
                        )}
                        onClick={() => {
                          if (setOpen) setOpen(false);
                        }}
                      >
                        <Icon className="ml-3 size-5 flex-none" />
                        {isMobileNav || (!isMinimized && !isMobileNav) ? (
                          <span className="mr-2 truncate">{item.title}</span>
                        ) : (
                          ''
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      align="center"
                      side="right"
                      sideOffset={8}
                      className={!isMinimized ? 'hidden' : 'inline-block'}
                    >
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          )
        )}
      </TooltipProvider>
    </nav>
  );
}
