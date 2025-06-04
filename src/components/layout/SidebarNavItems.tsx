"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShieldAlert, BookOpenText, FileText, Settings2, BarChartBig, Workflow, ClipboardCheck, AlertTriangle, Activity, CheckSquare, Bell, FileSpreadsheet, Globe, GitCompareArrows } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const navItems = [
  { href: "/", label: "Overview", icon: BarChartBig },
  { href: "/ingestion", label: "Ingestion & Processing", icon: Workflow },
  { href: "/regulations", label: "Regulations Hub", icon: BookOpenText },
  { href: "/risk-issues", label: "Risk & Issues Hub", icon: AlertTriangle },
  { href: "/aml", label: "AML Hub", icon: ShieldAlert },
  { href: "/compliance", label: "Compliance Hub", icon: FileText },
  { href: "/operations-center", label: "Operations Center", icon: Activity },
  { href: "/reporting", label: "Reporting Hub", icon: FileSpreadsheet },
  { href: "/review-approvals", label: "Review & Approvals", icon: CheckSquare },
  { href: "/alerts-notifications", label: "Alerts & Notifications", icon: Bell },
  { href: "/audit-support", label: "Audit Support", icon: ClipboardCheck },
  { href: "/admin", label: "Admin Hub", icon: Settings2 },
  { href: "/live-tracker", label: "Live World Tracker", icon: Globe },
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
              variant={(pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))) ? 'active' : 'ghost'}
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
