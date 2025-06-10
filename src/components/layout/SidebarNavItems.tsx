
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShieldAlert, BookOpenText, FileText, Settings2, BarChartBig, Workflow, ClipboardCheck, AlertTriangle, Activity, CheckSquare, Bell, FileSpreadsheet, Globe, Bot } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const navItems = [
  { href: "/", label: "Overview", icon: BarChartBig },
  { href: "/ingestion", label: "Application Health", icon: Workflow },
  { href: "/regulations", label: "Regulations Hub", icon: BookOpenText },
  { href: "/risk-issues", label: "Risk & Issues Hub", icon: AlertTriangle },
  { href: "/compliance", label: "Control Hub", icon: FileText },
  { href: "/aml", label: "AML Hub", icon: ShieldAlert },
  { href: "/cost-center", label: "Cost Center", icon: Activity },
  { href: "/reporting", label: "Analytics and Reporting Hub", icon: FileSpreadsheet },
  { href: "/review-approvals", label: "Review & Approvals", icon: CheckSquare },
  { href: "/audit-hub", label: "Audit Hub", icon: ClipboardCheck },
  { href: "/live-tracker", label: "Live Tracker", icon: Globe },
  { href: "/admin", label: "Admin Hub", icon: Settings2 },
  { href: "/crics-chatbot", label: "CRICS Chatbot", icon: Bot },
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

