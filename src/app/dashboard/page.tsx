
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Sparkles, PlayCircle, Clock, BookCheck, FileText, ArrowRight, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { format } from 'date-fns';

const modules = [
  {
    id: '1',
    title: 'AI Foundations',
    description: 'Generative AI within the HBCU context.',
    image: 'https://images.unsplash.com/photo-1646583288948-24548aedffd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    progress: 100,
    time: '45 mins',
  },
  {
    id: '2',
    title: 'Strategic Drafting',
    description: 'Master the tools for high-leverage documents.',
    image: 'https://images.unsplash.com/photo-1542948330-efbf302472dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    progress: 45,
    time: '1.5 hours',
  },
  {
    id: '3',
    title: 'Refinement Lab',
    description: 'Learn advanced "Tone Slider" techniques.',
    image: 'https://images.unsplash.com/photo-1746716809115-814c45fa1e92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    progress: 0,
    time: '1 hour',
  }
];

export default function Dashboard() {
  const { user } = useUser();
  const db = useFirestore();

  const recentDraftsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'userProfiles', user.uid, 'outputs'),
      orderBy('updatedAt', 'desc'),
      limit(3)
    );
  }, [db, user]);

  const { data: recentDrafts, isLoading: draftsLoading } = useCollection(recentDraftsQuery);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#FF671F] uppercase tracking-[0.3em]">Administrator Dashboard</p>
          <h1 className="text-5xl font-headline font-bold text-[#004B40] tracking-tighter">
            Welcome, {user?.displayName?.split(' ')[0] || 'Rattler'}
          </h1>
          <p className="text-muted-foreground text-lg font-medium">Your strategic laboratory is initialized and ready for deployment.</p>
        </div>
        <div className="flex gap-4">
          <Card className="shadow-2xl shadow-green-900/5 border-none px-6 py-4 flex items-center gap-4 bg-white rounded-3xl">
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Efficiency Rating</p>
              <p className="text-xl font-headline font-bold text-[#004B40]">A+</p>
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
            src="https://images.unsplash.com/photo-1689686610856-3bcf921eb1f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Hero"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            data-ai-hint="university campus"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004B40] via-[#004B40]/40 to-transparent" />
          <div className="absolute inset-0 p-12 flex flex-col justify-end text-white">
            <span className="bg-[#FF671F] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 w-fit shadow-xl">Deploy Next Initiative</span>
            <h2 className="text-4xl font-headline font-bold mb-4 tracking-tight max-w-md">Drafting Strategic Memos for the Fall Term</h2>
            <p className="text-white/80 max-w-sm font-medium mb-8">
              Bypass the blank page. Use the lab to draft a comprehensive institutional plan for your department.
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
              <div className="text-sm text-muted-foreground italic">Syncing with lab storage...</div>
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
                <p className="text-xs text-muted-foreground px-6 leading-relaxed">Your strategic filing cabinet is empty. Start your first draft in the lab.</p>
              </div>
            )}
          </div>
          <Link href="/dashboard/strategist" className="mt-6">
            <Button variant="outline" className="w-full h-12 rounded-2xl border-[#004B40]/10 text-[#004B40] font-bold">
              <Sparkles className="w-4 h-4 mr-2 text-[#FF671F]" /> Open AI Lab
            </Button>
          </Link>
        </Card>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-muted pb-4">
          <h3 className="text-3xl font-headline font-bold text-[#004B40]">Active Curriculum</h3>
          <Link href="/dashboard/modules" className="text-[#FF671F] font-bold uppercase tracking-widest text-xs hover:underline">Complete Catalog</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {modules.map((module) => (
            <Card key={module.id} className="bg-white hover:translate-y-[-8px] transition-all duration-500 border-none rounded-[2rem] overflow-hidden group shadow-lg">
              <div className="relative h-48 w-full overflow-hidden">
                <Image src={module.image} alt={module.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#004B40] shadow-xl flex items-center gap-2">
                  <Clock className="w-3 h-3 text-[#FF671F]" /> {module.time}
                </div>
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-headline text-[#004B40] group-hover:text-[#FF671F] transition-colors">{module.title}</CardTitle>
                <CardDescription className="font-medium">{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                      <span>Mastery Progress</span>
                      <span>{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2 bg-muted rounded-full" />
                  </div>
                  <Link href={`/dashboard/modules`} className="block">
                    <Button className="w-full h-12 bg-[#004B40] hover:bg-[#004B40]/90 text-white font-bold rounded-2xl shadow-lg transition-all group-hover:shadow-green-900/20">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      {module.progress === 100 ? 'Review Module' : 'Resume Lab'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
