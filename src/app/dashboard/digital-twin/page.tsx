"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  UserCheck, 
  Globe, 
  ShieldCheck, 
  Loader2, 
  Database,
  Settings,
  Shield,
  Lock
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser, useDoc, useMemoFirebase, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function DigitalTwinLab() {
  const { user } = useUser();
  const db = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [db, user]);

  const { data: profile } = useDoc(userProfileRef);
  const isAdmin = profile?.role === 'admin';

  const nicoleAvatar = PlaceHolderImages.find(img => img.id === 'nicole-avatar')?.imageUrl || "https://picsum.photos/seed/nicole/400/400";

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <header className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#FF671F] font-bold uppercase tracking-widest text-xs">
            <Sparkles className="w-4 h-4" /> The CEO's Office
          </div>
          <h1 className="text-5xl font-headline font-bold text-[#004B40] tracking-tight">Talk to Nicole</h1>
          <p className="text-xl text-muted-foreground font-medium">Your 24/7 executive coach powered by Vertex AI.</p>
        </div>
        {isAdmin && (
          <Link href="/dashboard/admin/maintenance">
            <Button variant="outline" className="rounded-xl border-[#004B40]/10 text-[#004B40] font-bold h-12">
              <Settings className="w-4 h-4 mr-2" /> Antigravity Maintenance
            </Button>
          </Link>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none bg-[#004B40]/5 rounded-[2.5rem] overflow-hidden relative min-h-[550px] flex flex-col border-dashed border-2 border-[#004B40]/20 shadow-inner">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <Image 
                src="https://images.unsplash.com/photo-1689686610856-3bcf921eb1f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Lab Background"
                fill
                className="object-cover grayscale"
              />
            </div>
            
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-8 relative z-10">
              <div className="relative">
                <div className="relative w-40 h-40 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <Image src={nicoleAvatar} alt="Nicole Murray" fill className="object-cover grayscale" />
                  <div className="absolute inset-0 bg-[#004B40]/40 backdrop-blur-[2px]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-10 h-10 text-white opacity-50" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#FF671F] p-3 rounded-2xl shadow-xl animate-bounce-slow">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              </div>

              <div className="space-y-4 max-w-md">
                <h3 className="text-3xl font-headline font-bold text-[#004B40]">Strategic Calibration</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  Nicole is currently indexing the proprietary FAMU strategic frameworks and calibrating her digital persona via Vertex AI.
                </p>
                <div className="pt-4">
                  <span className="bg-[#004B40]/10 text-[#004B40] text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-[0.2em]">
                    Institutional Grounding in Progress
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/40 backdrop-blur-xl border-t border-[#004B40]/10 relative z-20">
              <div className="flex items-center justify-center gap-3 text-sm font-bold text-[#004B40]/40 uppercase tracking-widest italic">
                Strategic Chat Offline during Calibration
              </div>
            </div>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 bg-white border-none shadow-sm rounded-3xl flex items-center gap-4 opacity-50">
              <div className="w-12 h-12 rounded-2xl bg-[#004B40]/5 flex items-center justify-center">
                <Database className="w-6 h-6 text-[#004B40]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Vertex AI Search</p>
                <p className="text-sm font-bold text-[#004B40]">Syncing Data Store...</p>
              </div>
            </Card>
            <Card className="p-6 bg-white border-none shadow-sm rounded-3xl flex items-center gap-4 opacity-50">
              <div className="w-12 h-12 rounded-2xl bg-[#FF671F]/5 flex items-center justify-center">
                <Globe className="w-6 h-6 text-[#FF671F]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Live Grounding</p>
                <p className="text-sm font-bold text-[#004B40]">Calibrating Filters...</p>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#004B40] text-white border-none rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />
            <h3 className="font-headline font-bold mb-4 flex items-center gap-2 relative z-10">
              <Shield className="w-5 h-5 text-[#FF671F] fill-[#FF671F]" /> Enterprise Trust
            </h3>
            <p className="text-white/80 text-sm font-medium leading-relaxed mb-8 relative z-10">
              The Digital Twin is an extension of Nicole's strategic brain. By grounding the model in proprietary FAMU IP, we ensure every interaction is anchored in institutional excellence and technological sovereignty.
            </p>
            <Button variant="outline" className="w-full rounded-xl border-white/20 text-white hover:bg-white/10 font-bold h-12">
              View Bio
            </Button>
          </Card>

          <Card className="glass-card border-none rounded-3xl p-8 shadow-xl">
            <h3 className="font-headline font-bold text-[#004B40] mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FF671F]" /> Upcoming Capabilities
            </h3>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              {[
                "Proprietary Strategic Mentorship", 
                "Vocal Cloning Synchronization", 
                "Institutional Memo Synthesis", 
                "RAG-Grounded AI Ethics",
                "CEO Strategic Audit"
              ].map((area, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-[#004B40]/5 transition-colors group">
                  <span className="w-2 h-2 rounded-full bg-[#FF671F] mt-2 shrink-0" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
