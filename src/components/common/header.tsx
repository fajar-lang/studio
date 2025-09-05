"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MessageSquarePlus, Menu, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Kirim' },
    { href: '/track', label: 'Lacak Keluhan' },
    { href: '/admin', label: 'Admin' },
  ];
  
  const handleLinkClick = () => {
    setIsSheetOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/30 bg-gradient-sky shadow-sm overflow-hidden">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
        <GraduationCap className="h-16 w-16 text-white/30 absolute -top-4 -left-8" />
        <Link href="/" className="flex items-center gap-2 font-bold text-lg z-10">
          <MessageSquarePlus className="h-6 w-6 text-primary" />
          <span>Aspirasi Siswa</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium z-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-slate-600'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden z-10">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button className="p-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Buka menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="p-4">
                    <nav className="flex flex-col space-y-4 text-lg">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={handleLinkClick}
                          className={cn(
                            'transition-colors hover:text-primary p-2 rounded-md',
                            pathname === link.href ? 'text-primary bg-secondary' : 'text-foreground'
                          )}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                </div>
            </SheetContent>
          </Sheet>
        </div>
        <GraduationCap className="h-20 w-20 text-white/30 absolute -bottom-8 -right-8" />
      </div>
    </header>
  );
}
