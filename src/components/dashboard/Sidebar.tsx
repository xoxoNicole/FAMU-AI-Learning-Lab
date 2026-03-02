
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Sparkles, 
  FileText, 
  LogOut,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: BookOpen, label: 'The Curriculum', href: '/modules' },
  { icon: Sparkles, label: 'The Lab', href: '/strategist' },
  { icon: FileText, label: 'My Drafts', href: '/drafts' },
  { icon: Target, label: 'Strategic Progress', href: '/progress' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-72 h-full bg-white border-r border-muted flex flex-col shadow-sm">
      <div className="p-8 pb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#004B40] flex items-center justify-center shadow-lg transform -rotate-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-headline font-bold text-[#004B40] tracking-tighter block leading-none">AI Lab</span>
            <span className="text-[9px] font-bold text-[#FF671F] uppercase tracking-[0.2em]">Florida A&M</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Main Menu</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-[#004B40] text-white shadow-xl shadow-green-900/10" 
                  : "text-muted-foreground hover:bg-muted hover:text-[#004B40]"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-[#FF671F]" : "text-muted-foreground group-hover:text-[#004B40]")} />
              <span className="font-bold text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <div className="p-4 rounded-3xl bg-muted/50 border border-muted space-y-3">
          <p className="text-[10px] font-bold uppercase text-[#004B40]/60 tracking-wider">Session Security</p>
          <div className="flex items-center gap-3 px-1 py-1 text-muted-foreground hover:text-destructive cursor-pointer transition-colors group">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-destructive/10">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs uppercase tracking-widest">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
