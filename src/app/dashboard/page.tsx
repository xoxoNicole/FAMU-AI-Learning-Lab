"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, PlayCircle, Clock, FileText, Zap, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { format } from 'date-fns';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Dashboard() {
  const { user } = useUser();
  const db = useFirestore();

  const modulesQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'modules'), orderBy('title', 'asc'), limit(3));
  }, [db, user]);

  const { data: modules, isLoading: modulesLoading } = useCollection(modulesQuery);

  const recentDraftsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'userProfiles', user.uid, 'outputs'),
      orderBy('updatedAt', 'desc'),
      limit(3)
    );
  }, [db, user]);

  const { data: recentDrafts, isLoading: draftsLoading } = useCollection(recentDraftsQuery);

  const heroImage = PlaceHolderImages.find(img => img.id === 'login-bg')?.imageUrl || "https://picsum.photos/seed/famu1/1200/800";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#FF671F] uppercase tracking-[0.3em]">Faculty Dashboard</p>
          <h1 className="text-5xl font-headline font-bold text-[#004B40] tracking-tighter leading-none">
            Welcome, {user?.displayName?.split(' ')[0] || 'Rattler'}
          </h1>
          <p className="text-muted-foreground text-lg font-medium mt-2">Access your curriculum and drafting tools below.</p>
        </div>
        <div className="flex gap-4">
          <Card className="shadow-2xl shadow-green-900/5 border-none px-6 py-4 flex items-center gap-4 bg-white rounded-3xl">
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Platform Status</p>
              <p className="text-xl font-headline font-bold text-[#004B40]">Active</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#FF671F]/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#FF671F]" />
            </div>
          </Card>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 overflow-hidden border-none rounded-[2.5rem] shadow-2xl relative group h-[400px]">
          <Image 
            src={heroImage}
            alt="Hero"
            fill
            className="object-cover"
            data-ai-hint="university campus"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004B40] via-[#004B40]/40 to-transparent" />
          <div className="absolute inset-0 p-12 flex flex-col justify-end text-white">
            <span className="bg-[#FF671F] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 w-fit shadow-xl">New Lesson Available</span>
            <h2 className="text-4xl font-headline font-bold mb-4 tracking-tight max-w-md">Mastering Institutional Communication</h2>
            <p className="text-white/80 max-w-sm font-medium mb-8">
              Improve efficiency by utilizing AI for complex drafting tasks and grant proposals.
            </p>
            <Link href="/dashboard/modules">
              <Button className="h-14 px-10 bg-white text-[#004B40] hover:bg-white/90 rounded-2xl font-headline font-bold shadow-2xl">
                Start Learning
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="bg-white border-none rounded-[2.5rem] p-8 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-headline font-bold text-[#004B40] flex items-center gap-3">
              <FileText className="w-6 h-6 text-[#FF671F]" /> Recent Drafts
            </h3>
            <Link href="/dashboard/drafts" className="text-xs font-bold text-[#FF671F] hover:underline uppercase tracking-widest">
              View All
            </Link>
          </div>
          <div className="flex-1 space-y-4">
            {draftsLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
                <Loader2 className="w-4 h-4 animate-spin" /> Syncing...
              </div>
            ) : recentDrafts && recentDrafts.length > 0 ? (
              recentDrafts.map(draft => (
                <Link key={draft.id} href={`/dashboard/strategist?draftId=${draft.id}`}>
                  <div className="p-5 rounded-[1.5rem] bg-muted/40 hover:bg-[#004B40]/5 transition-all cursor-pointer border border-transparent hover:border-[#004B40]/10 group">
                    <p className="font-bold text-[#004B40] truncate text-sm group-hover:text-[#FF671F] transition-colors">{draft.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {draft.updatedAt ? format(new Date(draft.updatedAt), 'MMM d • h:mm a') : 'Recent'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">No active drafts</p>
                <p className="text-xs text-muted-foreground px-6 leading-relaxed">Start your first draft in the Strategy Lab.</p>
              </div>
            )}
          </div>
          <Link href="/dashboard/strategist" className="mt-6">
            <Button variant="outline" className="w-full h-12 rounded-2xl border-[#004B40]/10 text-[#004B40] font-bold">
              <Sparkles className="w-4 h-4 mr-2 text-[#FF671F]" /> Open Strategy Lab
            </Button>
          </Link>
        </Card>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-muted pb-4">
          <h3 className="text-3xl font-headline font-bold text-[#004B40]">Active Curriculum</h3>
          <Link href="/dashboard/modules" className="text-[#FF671F] font-bold uppercase tracking-widest text-xs hover:underline">View All</Link>
        </div>
        
        {modulesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <Card key={i} className="h-64 animate-pulse bg-muted rounded-[2rem]" />)}
          </div>
        ) : modules && modules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {modules.map((module) => (
              <Card key={module.id} className="bg-white hover:translate-y-[-8px] transition-all duration-500 border-none rounded-[2rem] overflow-hidden group shadow-lg">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image 
                    src={module.thumbnail || PlaceHolderImages.find(img => img.id === 'module-1')?.imageUrl || "https://picsum.photos/seed/m1/600/400"} 
                    alt={module.title} 
                    fill 
                    className="object-cover" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#004B40] shadow-xl flex items-center gap-2">
                    <Clock className="w-3 h-3 text-[#FF671F]" /> {module.duration || '45 mins'}
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-headline text-[#004B40] group-hover:text-[#FF671F] transition-colors">{module.title}</CardTitle>
                  <CardDescription className="font-medium line-clamp-2">{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <Link href={`/dashboard/modules/${module.id}`} className="block">
                      <Button className="w-full h-12 bg-[#004B40] hover:bg-[#004B40]/90 text-white font-bold rounded-2xl shadow-lg transition-all">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Enter Session
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-20 text-center bg-muted/20 border-none rounded-[2rem]">
            <p className="text-muted-foreground font-medium italic">Curriculum content is being updated.</p>
          </Card>
        )}
      </section>
    </div>
  );
}
