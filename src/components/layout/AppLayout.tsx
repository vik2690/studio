
import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { SidebarNavItems } from './SidebarNavItems'; // Separated for client-side logic
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { PanelLeft, Search, Settings, User } from 'lucide-react'; // Added Search, Settings, User
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { PersonaSwitcher } from './PersonaSwitcher'; // Added PersonaSwitcher import

const AppHeader = () => (
  <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 shadow-sm">
    <div className="sm:hidden"> {/* Mobile sidebar trigger, if Sidebar component doesn't handle it internally via SidebarTrigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs bg-sidebar text-sidebar-foreground p-0">
          <nav className="grid gap-6 text-lg font-medium p-6">
            <Link
              href="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Image src="https://placehold.co/32x32.png" alt="Cognitive Risk Intelligence & Control System Logo" width={32} height={32} data-ai-hint="abstract geometric shape" />
              <span className="sr-only">Cognitive Risk Intelligence & Control System</span>
            </Link>
            <SidebarNavItems />
          </nav>
        </SheetContent>
      </Sheet>
    </div>

    <div className="relative flex-1 md:grow-0">
      {/* Search can be added here if needed */}
    </div>
    <div className="flex flex-1 items-center justify-end gap-4">
      <PersonaSwitcher /> {/* Added PersonaSwitcher component */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Avatar>
              <AvatarImage src="https://placehold.co/36x36.png" alt="User Avatar" data-ai-hint="professional user" />
              <AvatarFallback>CR</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
);

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar className="hidden border-r bg-sidebar text-sidebar-foreground md:block peer" collapsible="icon"> {/* Added peer class here */}
          <SidebarHeader className="p-3 flex justify-center">
            <Link href="/" className="flex flex-col items-center gap-1 text-sidebar-foreground" title="Cognitive Risk Intelligence & Control System">
               <Image src="https://placehold.co/36x36.png" alt="Cognitive Risk Intelligence & Control System Logo" width={30} height={30} data-ai-hint="abstract geometric shape" className="transition-all group-data-[collapsible=icon]:size-7"/>
              <div className="font-extrabold tracking-tight group-data-[collapsible=icon]:hidden text-center text-base leading-snug mt-1 px-1">
                Cognitive Risk<br />
                Intelligence &<br />
                Control System
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarNavItems />
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-col print:pl-0 md:pl-[var(--sidebar-width)] peer-data-[state=collapsed]:md:pl-[var(--sidebar-width-icon)] transition-[padding] duration-200 ease-linear">
          <AppHeader />
          <main className="flex-1 bg-background md:m-0 print:shadow-none px-4 sm:px-6 py-4 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
