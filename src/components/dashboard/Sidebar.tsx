
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
  Target,
  UserCheck,
  History,
  ArrowUpRight,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, orderBy, limit, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: BookOpen, label: 'The Curriculum', href: '/dashboard/modules' },
  { icon: Sparkles, label: 'The Lab', href: '/dashboard/strategist' },
  { icon: FileText, label: 'My Drafts', href: '/dashboard/drafts' },
  { icon: UserCheck, label: 'Talk to Nicole', href: '/dashboard/digital-twin' },
  { icon: Target, label: 'Strategic Progress', href: '/dashboard/progress' },
];

export function Sidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [db, user]);

  const { data: profile } = useDoc(userProfileRef);
  const isAdmin = profile?.role === 'admin';

  const recentDraftsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'userProfiles', user.uid, 'outputs'),
      orderBy('updatedAt', 'desc'),
      limit(2)
    );
  }, [db, user]);

  const { data: recentDrafts } = useCollection(recentDraftsQuery);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  return (
    <div className="w-72 h-full bg-white border-r border-muted flex flex-col shadow-sm shrink-0 z-40">
      <div className="p-8 pb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#004B40] flex items-center justify-center shadow-lg transform -rotate-3">
            <Sparkles className="w-6 h-6 text-[#FF671F]" />
          </div>
          <div>
            <span className="text-xl font-headline font-bold text-[#004B40] tracking-tighter block leading-none">AI Lab</span>
            <span className="text-[9px] font-bold text-[#FF671F] uppercase tracking-[0.2em]">Florida A&M</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Main Menu</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
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

        {isAdmin && (
          <div className="pt-4 px-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Strike Team</p>
            <Link 
              href="/dashboard/admin/maintenance"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                pathname === '/dashboard/admin/maintenance' ? "bg-[#FF671F]/10 text-[#FF671F]" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="font-bold text-xs uppercase">Maintenance</span>
            </Link>
          </div>
        )}

        {recentDrafts && recentDrafts.length > 0 && (
          <div className="pt-8 px-4 space-y-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <History className="w-3 h-3" /> Recent Activity
            </p>
            <div className="space-y-2">
              {recentDrafts.map(draft => (
                <Link 
                  key={draft.id} 
                  href={`/dashboard/strategist?draftId=${draft.id}`}
                  className="block p-3 rounded-xl bg-muted/30 hover:bg-[#FF671F]/5 transition-colors group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-bold text-[#004B40] truncate">{draft.title}</p>
                    <ArrowUpRight className="w-3 h-3 text-[#FF671F] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="p-6">
        <div className="p-4 rounded-3xl bg-muted/50 border border-muted space-y-3">
          <Link 
            href="/dashboard/profile"
            className="w-full flex items-center gap-3 px-1 py-1 text-muted-foreground hover:text-[#004B40] transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-[#004B40]/5">
              <Settings className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs uppercase tracking-widest">Settings</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-1 py-1 text-muted-foreground hover:text-destructive cursor-pointer transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-destructive/10">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
