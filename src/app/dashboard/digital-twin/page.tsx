
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Mic, Video, ShieldCheck, Zap, Info, UserCheck } from 'lucide-react';
import Image from 'next/image';

export default function DigitalTwinLab() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-[#FF671F] font-bold uppercase tracking-widest text-xs">
          <Sparkles className="w-4 h-4" /> Strategic Mentorship
        </div>
        <h1 className="text-5xl font-headline font-bold text-[#004B40] tracking-tight">Meet Nicole: AI Mentor</h1>
        <p className="text-xl text-muted-foreground font-medium">Your 24/7 executive coach for institutional transformation.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none bg-[#004B40]/5 rounded-[2.5rem] overflow-hidden relative min-h-[550px] flex flex-col items-center justify-center border-dashed border-2 border-[#004B40]/20 shadow-inner">
          <div className="absolute inset-0 opacity-10">
            <Image 
              src="https://images.unsplash.com/photo-1689686610856-3bcf921eb1f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Lab Background"
              fill
              className="object-cover grayscale"
            />
          </div>
          <div className="relative z-10 text-center space-y-6 px-12">
            <div className="w-32 h-32 rounded-3xl bg-white flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden group border-4 border-white">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF671F]/20 to-transparent" />
              <Video className="w-12 h-12 text-[#FF671F] group-hover:scale-110 transition-transform" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-headline font-bold text-[#004B40]">Initializing Mentor Link...</h2>
              <p className="text-muted-foreground font-medium max-w-md mx-auto leading-relaxed">
                Nicole's Digital Twin is being synthesized using Vertex AI. Soon, you will be able to engage in voice-to-voice strategic sessions.
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button disabled className="rounded-xl h-14 px-8 bg-[#004B40] opacity-50 font-bold">Start Video Session</Button>
              <Button disabled className="rounded-xl h-14 px-8 bg-[#FF671F] opacity-50 font-bold">Voice Only</Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card border-none rounded-3xl p-8 shadow-xl">
            <h3 className="font-headline font-bold text-[#004B40] mb-6 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#FF671F]" /> Mentorship Areas
            </h3>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#004B40]/5 transition-colors">
                <span className="w-2 h-2 rounded-full bg-[#FF671F] mt-2 shrink-0" />
                <span>Strategic Memo Review & Feedback</span>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#004B40]/5 transition-colors">
                <span className="w-2 h-2 rounded-full bg-[#FF671F] mt-2 shrink-0" />
                <span>Budget Narrative Enhancement</span>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#004B40]/5 transition-colors">
                <span className="w-2 h-2 rounded-full bg-[#FF671F] mt-2 shrink-0" />
                <span>Change Management Coaching</span>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#004B40]/5 transition-colors">
                <span className="w-2 h-2 rounded-full bg-[#FF671F] mt-2 shrink-0" />
                <span>AI Ethics in Higher Education</span>
              </li>
            </ul>
          </Card>

          <Card className="bg-[#004B40] text-white border-none rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />
            <h3 className="font-headline font-bold mb-4 flex items-center gap-2 relative z-10">
              <Info className="w-5 h-5 text-[#FF671F]" /> Interaction Tip
            </h3>
            <p className="text-white/80 text-sm leading-relaxed mb-8 relative z-10">
              When the Twin is active, provide context about your specific department. Nicole's AI is tuned to provide advice specifically tailored to the Rattler administrative landscape.
            </p>
            <Button variant="outline" className="w-full rounded-xl border-white/20 text-white hover:bg-white/10 font-bold h-12">
              Request Early Beta Access
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
