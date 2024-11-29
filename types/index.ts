import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export type NavItemWithChildren = NavItem & {
  items: NavItemOrSeparator[];
};

export type NavItemOrSeparator =
  | NavItem
  | NavItemWithChildren
  | { separator: true };

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}
