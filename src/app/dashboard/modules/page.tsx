
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Clock, BookOpen, Star, Plus, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { useFirestore, useCollection, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';

export default function ModulesListing() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [db, user]);

  const { data: userProfile } = useDoc(userProfileRef);
  const isAdmin = userProfile?.role === 'admin';

  const modulesQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'modules'), orderBy('title', 'asc'));
  }, [db, user]);

  const { data: modules, isLoading: modulesLoading } = useCollection(modulesQuery);

  const progressQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'userProfiles', user.uid, 'moduleProgress'));
  }, [db, user]);

  const { data: progressList, isLoading: progressLoading } = useCollection(progressQuery);

  const getProgress = (moduleId: string) => {
    const prog = progressList?.find(p => p.id === moduleId);
    return prog ? (prog.progressPercentage || 0) : 0;
  };

  const completedCount = progressList?.filter(p => p.isCompleted).length || 0;

  if (isUserLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-[#004B40]" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-[#FF671F] font-bold uppercase tracking-widest text-sm">
          <BookOpen className="w-4 h-4" /> 
          Strategic Curriculum
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-headline font-bold text-[#004B40] tracking-tight">Learning Modules</h1>
            <p className="text-xl text-muted-foreground mt-2 font-medium">Equipping academic leaders for the next era of administration.</p>
          </div>
          <div className="flex gap-4">
            {isAdmin && (
              <Link href="/dashboard/curriculum-manager">
                <Button variant="outline" className="rounded-xl border-[#004B40]/10 text-[#004B40] font-bold h-12">
                  <Plus className="w-4 h-4 mr-2" /> Manage Content
                </Button>
              </Link>
            )}
            <Card className="glass-card py-3 px-6 border-none flex items-center gap-4 shadow-xl">
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Earned Badges</p>
                <p className="text-xl font-headline font-bold text-[#004B40]">{completedCount} / {modules?.length || 0}</p>
              </div>
              <Star className="w-8 h-8 text-[#FF671F] fill-[#FF671F]" />
            </Card>
          </div>
        </div>
      </header>

      {modulesLoading || progressLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <Card key={i} className="h-96 animate-pulse bg-muted rounded-[2rem]" />
          ))}
        </div>
      ) : modules && modules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => {
            const progress = getProgress(module.id);
            const isCompleted = progress === 100;

            return (
              <Card key={module.id} className="glass-card hover:translate-y-[-6px] transition-all duration-300 border-none overflow-hidden group flex flex-col h-full shadow-lg">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image 
                    src={module.thumbnail || "https://picsum.photos/seed/" + module.id + "/1080/800"} 
                    alt={module.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    data-ai-hint="university campus"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-[#004B40] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {module.category || 'Core'}
                    </span>
                  </div>
                  {isCompleted && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white">
                    <div className="flex items-center gap-1 text-xs font-bold">
                      <Clock className="w-3 h-3 text-[#FF671F]" /> {module.duration || '45 mins'}
                    </div>
                  </div>
                </div>

                <CardHeader className="flex-1">
                  <CardTitle className="text-2xl font-headline text-[#004B40] group-hover:text-[#FF671F] transition-colors">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed line-clamp-3 font-medium">
                    {module.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-muted" />
                  </div>
                  
                  <Link href={`/dashboard/modules/${module.id}`} className="block">
                    <Button className={`w-full h-12 rounded-2xl font-headline font-bold transition-all shadow-lg ${isCompleted ? 'bg-[#004B40]/10 text-[#004B40] hover:bg-[#004B40]/20' : 'bg-[#004B40] hover:bg-[#004B40]/90 text-white group-hover:shadow-[#004B40]/20'}`}>
                      <PlayCircle className="w-5 h-5 mr-2" />
                      {isCompleted ? 'Review Mastery' : progress > 0 ? 'Resume Lab' : 'Start Module'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-20 text-center glass-card border-none rounded-[3rem] bg-white">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-[#004B40]/5 rounded-3xl flex items-center justify-center mx-auto">
              <Sparkles className="w-10 h-10 text-[#FF671F]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-headline font-bold text-[#004B40]">Initializing Curriculum</h3>
              <p className="text-muted-foreground font-medium">Nicole is currently indexing the proprietary FAMU strategic modules. Take a deep breath—your learning journey will begin shortly.</p>
            </div>
            {isAdmin && (
              <Link href="/dashboard/curriculum-manager">
                <Button className="bg-[#FF671F] hover:bg-[#FF671F]/90 text-white font-bold rounded-xl h-12 px-8">
                  Deploy First Module
                </Button>
              </Link>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
