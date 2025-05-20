"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShieldAlert, BookOpenText, FileText, Settings2, BarChartBig } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const navItems = [
  { href: "/", label: "Overview", icon: BarChartBig },
  { href: "/aml", label: "AML Dashboard", icon: ShieldAlert },
  { href: "/regulations", label: "Regulations", icon: BookOpenText },
  { href: "/compliance", label: "Compliance Hub", icon: FileText },
  // { href: "/settings", label: "Settings", icon: Settings2 }, // Example for future use
];

export function SidebarNavItems() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild={false} // Ensure it's a button for proper styling and tooltip behavior from sidebar component
              // @ts-ignore - data-active is a valid data attribute for styling
              data-active={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
              className="w-full justify-start"
              tooltip={{ children: item.label, side: "right", align: "center" }}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
