import {
  ChartNoAxesCombined,
  ChevronDown,
  ChevronLeft,
  ChevronsRight,
  ClipboardList,
  Home,
  Languages,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Network,
  Orbit,
  RefreshCw,
  Route,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Sun,
  UserPlus,
  UserRoundCog,
  Users
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const iconMap: Record<string, IconComponent> = {
  ChartNoAxesCombined,
  ChevronDown,
  ChevronLeft,
  ChevronsRight,
  ClipboardList,
  Home,
  LayoutDashboard,
  Languages,
  LogOut,
  Menu,
  Moon,
  Network,
  Orbit,
  RefreshCw,
  Route,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Sun,
  UserPlus,
  UserRoundCog,
  Users,
  'mdi:monitor-dashboard': LayoutDashboard,
  'carbon:cloud-service-management': ShieldCheck,
  'material-symbols:route': Route,
  'carbon:user-role': UserRoundCog,
  'ic:round-manage-accounts': Users
};

export function MenuIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = name ? (iconMap[name] ?? Menu) : Menu;
  return <Icon aria-hidden className={className} />;
}
