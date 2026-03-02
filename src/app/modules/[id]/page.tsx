
"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { NicoleChat } from '@/components/strategist/NicoleChat';
import { ChevronLeft, Play, CheckCircle, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const db = useFirestore();
  const [videoStarted, setVideoStarted] = useState(false);

  const moduleId = params.id as string;
  const moduleRef = React.useMemo(() => {
    if (!db || !moduleId) return null;
    return doc(db, 'modules', moduleId);
  }, [db, moduleId]);

  const { data: module, isLoading } = useDoc(moduleRef);

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
        <Button onClick={() => router.push('/modules')}>Return to Curriculum</Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="h-16 border-b border-white/20 px-6 flex items-center justify-between bg-white/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#FF671F] uppercase tracking-widest">Module Session</span>
              <span className="bg-[#004B40]/10 text-[#004B40] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">{module.difficulty}</span>
            </div>
            <h1 className="font-headline font-bold text-[#004B40] leading-none">{module.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-[#FF671F]/20 text-[#FF671F] hover:bg-[#FF671F]/5 rounded-xl font-bold">
            <CheckCircle className="w-4 h-4 mr-2" /> Mark Complete
          </Button>
        </div>
      </header>

      {/* Split Screen Lab */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Video & Content */}
        <div className="w-1/2 p-8 overflow-y-auto border-r border-white/20 bg-white/10">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group bg-black">
              {!videoStarted ? (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="absolute inset-0 bg-[#004B40]/40" />
                  <Button 
                    onClick={() => setVideoStarted(true)}
                    className="w-20 h-20 rounded-full bg-white text-[#004B40] hover:scale-110 transition-transform shadow-2xl z-20"
                  >
                    <Play className="w-8 h-8 fill-current" />
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
              <div className="flex items-center gap-2 text-[#FF671F] font-bold uppercase tracking-[0.2em] text-[10px]">
                <BookOpen className="w-3.5 h-3.5" /> Unit Intelligence
              </div>
              <h2 className="text-4xl font-headline font-bold text-[#004B40] tracking-tight">{module.title}</h2>
              <div className="prose prose-green text-lg leading-relaxed text-muted-foreground font-medium">
                {module.description}
              </div>

              <div className="bg-[#004B40]/5 p-8 rounded-[2rem] border border-[#004B40]/10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF671F]/5 rounded-full translate-x-1/2 -translate-y-1/2" />
                <h4 className="font-bold text-[#004B40] mb-3 flex items-center gap-2 uppercase tracking-widest text-xs">
                  <Sparkles className="w-4 h-4 text-[#FF671F]" /> Active Lab Task
                </h4>
                <p className="text-primary/90 font-medium leading-relaxed italic">
                  "{module.labTask || 'Use the AI Lab on the right to draft a strategic brief for this module.'}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Strategist Lab */}
        <div className="w-1/2 flex flex-col p-8 bg-white/40">
          <NicoleChat />
        </div>
      </div>
    </div>
  );
}
