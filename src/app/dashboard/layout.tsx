
"use client";

import React, { useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Home, User, Bell, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  // Protect dashboard routes: Redirect to login if not authenticated
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  // Simple breadcrumb logic
  const pathParts = pathname.split('/').filter(Boolean);
  const isHome = pathname === '/dashboard';

  if (isUserLoading) {
    return (
      <div className="h-svh w-screen flex items-center justify-center bg-background animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-[#004B40] mx-auto opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#FF671F] rounded-full animate-pulse" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-[#004B40] uppercase tracking-[0.3em] animate-pulse">Initializing Lab Session...</p>
        </div>
      </div>
    );
  }

  // If not loading and no user, the useEffect will handle redirect. 
  // We return null here to prevent flashing protected content.
  if (!user) return null;

  return (
    <div className="flex h-svh bg-background overflow-hidden animate-in fade-in duration-700">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        {/* Global Command Bar (Smart Navigation) */}
        <header className="h-16 border-b border-muted bg-white/60 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 z-30">
          <div className="flex items-center gap-4">
            {!isHome && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.back()}
                className="rounded-full h-8 w-8 p-0 hover:bg-[#004B40]/5 text-[#004B40]"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Link href="/dashboard" className="hover:text-[#004B40] transition-colors flex items-center gap-1">
                <Home className="w-3 h-3" /> Command
              </Link>
              {pathParts.slice(1).map((part, i) => (
                <React.Fragment key={part}>
                  <span className="opacity-30">/</span>
                  <span className={cn(
                    "transition-colors",
                    i === pathParts.length - 2 ? "text-[#004B40]" : "hover:text-[#004B40] cursor-pointer"
                  )}>
                    {part.replace(/-/g, ' ')}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-muted-foreground hover:bg-[#004B40]/5">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="h-8 w-px bg-muted mx-1" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-[#004B40] leading-none">{user?.displayName || 'Rattler'}</p>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Institutional Leader</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#FF671F]/10 flex items-center justify-center border border-[#FF671F]/20">
                <User className="w-5 h-5 text-[#FF671F]" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
