
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Sparkles, 
  FileText, 
  Settings, 
  LogOut,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: BookOpen, label: 'Learning Modules', href: '/modules' },
  { icon: Sparkles, label: 'Nicole Strategist', href: '/strategist' },
  { icon: FileText, label: 'My Drafts', href: '/drafts' },
  { icon: Target, label: 'Progress Tracking', href: '/progress' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-full bg-white/40 backdrop-blur-xl border-r border-white/20 flex flex-col">
      <div className="p-8">
        <h1 className="text-xl font-headline font-bold text-primary flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          Nicole Interface
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-white shadow-lg" 
                  : "text-muted-foreground hover:bg-white/60 hover:text-primary"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/20">
        <div className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive cursor-pointer transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </div>
      </div>
    </div>
  );
}
