
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { NicoleChat } from '@/components/strategist/NicoleChat';
import { ChevronLeft, Play, CheckCircle, Loader2, Sparkles, BookOpen, LayoutGrid } from 'lucide-react';
import { useFirestore, useDoc, useUser } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [videoStarted, setVideoStarted] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  const moduleId = params.id as string;
  const moduleRef = React.useMemo(() => {
    if (!db || !moduleId) return null;
    return doc(db, 'modules', moduleId);
  }, [db, moduleId]);

  const { data: module, isLoading } = useDoc(moduleRef);

  // Auto-record progress when opening module
  useEffect(() => {
    if (db && user && moduleId) {
      const progressRef = doc(db, 'userProfiles', user.uid, 'moduleProgress', moduleId);
      
      getDoc(progressRef).then(snap => {
        if (!snap.exists()) {
          setDoc(progressRef, {
            id: moduleId,
            userId: user.uid,
            moduleId: moduleId,
            isCompleted: false,
            lastAccessedAt: new Date().toISOString(),
            progressPercentage: 10,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        } else {
          setDoc(progressRef, {
            lastAccessedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      });
    }
  }, [db, user, moduleId]);

  const handleComplete = async () => {
    if (!db || !user || !moduleId) return;
    setIsMarkingComplete(true);
    try {
      const progressRef = doc(db, 'userProfiles', user.uid, 'moduleProgress', moduleId);
      await setDoc(progressRef, {
        isCompleted: true,
        completionDate: new Date().toISOString(),
        progressPercentage: 100,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      toast({ 
        title: "Module Mastery Achieved", 
        description: `You have successfully completed ${module?.title}.` 
      });
      router.push('/dashboard/modules');
    } catch (err) {
      console.error(err);
    } finally {
      setIsMarkingComplete(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-[#004B40]" />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-headline font-bold text-[#004B40]">Module Not Found</h1>
        <Button onClick={() => router.push('/dashboard/modules')}>Return to Curriculum</Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top Bar - Contextual Smart Nav */}
      <header className="h-20 border-b border-[#004B40]/10 px-8 flex items-center justify-between bg-white/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/modules">
            <Button variant="ghost" className="rounded-xl h-12 px-4 hover:bg-[#004B40]/5 text-[#004B40] font-bold gap-2">
              <LayoutGrid className="w-4 h-4 text-[#FF671F]" />
              <span className="hidden sm:inline">All Modules</span>
            </Button>
          </Link>
          <div className="h-8 w-px bg-muted hidden sm:block" />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold text-[#FF671F] uppercase tracking-[0.2em]">Institutional Unit Session</span>
              <span className="bg-[#004B40]/10 text-[#004B40] text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">{module.difficulty || 'Core'}</span>
            </div>
            <h1 className="font-headline font-bold text-2xl text-[#004B40] leading-none tracking-tight">{module.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleComplete}
            disabled={isMarkingComplete}
            className="bg-[#004B40] hover:bg-[#004B40]/90 text-white rounded-xl font-bold h-12 px-6 shadow-lg shadow-green-900/10"
          >
            {isMarkingComplete ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2 text-[#FF671F]" />}
            Mark Mastery
          </Button>
        </div>
      </header>

      {/* Split Screen Lab */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Video & Content */}
        <div className="w-1/2 p-10 overflow-y-auto border-r border-[#004B40]/10 bg-[#004B40]/5 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl group bg-black border-4 border-white">
              {!videoStarted ? (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="absolute inset-0 bg-[#004B40]/40 backdrop-blur-sm" />
                  <Button 
                    onClick={() => setVideoStarted(true)}
                    className="w-24 h-24 rounded-full bg-white text-[#004B40] hover:scale-110 transition-transform shadow-2xl z-20"
                  >
                    <Play className="w-10 h-10 fill-current ml-1" />
                  </Button>
                </div>
              ) : (
                <iframe
                  src={module.videoUrl || "https://player.vimeo.com/video/76979871"}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  title={module.title}
                />
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#FF671F] font-bold uppercase tracking-[0.3em] text-[10px]">
                <BookOpen className="w-4 h-4" /> Curriculum Intelligence
              </div>
              <h2 className="text-4xl font-headline font-bold text-[#004B40] tracking-tight leading-tight">{module.title}</h2>
              <div className="prose prose-green text-lg leading-relaxed text-muted-foreground font-medium">
                {module.description}
              </div>

              <Card className="bg-white border-none p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF671F]/5 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-[#004B40] mb-4 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                  <Sparkles className="w-4 h-4 text-[#FF671F]" /> Active Strategic Objective
                </h4>
                <p className="text-[#004B40] font-bold text-xl leading-relaxed italic border-l-4 border-[#FF671F] pl-6">
                  "{module.labTask || 'Draft a strategic brief for this unit using the AI Lab.'}"
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* Right: AI Strategist Lab */}
        <div className="w-1/2 flex flex-col p-10 bg-white/40">
          <NicoleChat />
        </div>
      </div>
    </div>
  );
}
