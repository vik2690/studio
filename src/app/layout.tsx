import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google'; // Changed imports
import './globals.css';
import { AppLayout } from '@/components/layout/AppLayout';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ // Changed to Inter
  variable: '--font-inter', // Changed variable name
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({ // Changed to Roboto_Mono
  variable: '--font-roboto-mono', // Changed variable name
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cognitive Risk Intelligence & Control System - Compliance & Risk Management',
  description: 'AI-Powered Compliance & Risk Intelligence & Control System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}> {/* Updated font variables */}
        <AppLayout>{children}</AppLayout>
        <Toaster />
      </body>
    </html>
  );
}
