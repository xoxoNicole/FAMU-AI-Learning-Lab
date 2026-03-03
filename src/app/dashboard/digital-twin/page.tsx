
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Mic, Video, ShieldCheck, Zap, Info } from 'lucide-react';
import Image from 'next/image';

export default function DigitalTwinLab() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-[#FF671F] font-bold uppercase tracking-widest text-xs">
          <Zap className="w-4 h-4" /> Future Initiative
        </div>
        <h1 className="text-5xl font-headline font-bold text-[#004B40] tracking-tight">Digital Twin Laboratory</h1>
        <p className="text-xl text-muted-foreground font-medium">Cloning institutional knowledge through Multimodal AI.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none bg-[#004B40]/5 rounded-[2.5rem] overflow-hidden relative min-h-[500px] flex flex-col items-center justify-center border-dashed border-2 border-[#004B40]/20">
          <div className="absolute inset-0 opacity-10">
            <Image 
              src="https://images.unsplash.com/photo-1689686610856-3bcf921eb1f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Background"
              fill
              className="object-cover grayscale"
            />
          </div>
          <div className="relative z-10 text-center space-y-6 px-12">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <Video className="w-10 h-10 text-[#FF671F]" />
            </div>
            <h2 className="text-3xl font-headline font-bold text-[#004B40]">Under Construction</h2>
            <p className="text-muted-foreground font-medium max-w-md mx-auto">
              The Digital Twin interface requires Vertex AI Custom Voice and Avatar synthesis. We are currently preparing the hardware infrastructure for high-fidelity rendering.
            </p>
            <div className="flex gap-4 justify-center">
              <Button disabled className="rounded-xl h-12 bg-[#004B40] opacity-50">Initialize Camera</Button>
              <Button disabled className="rounded-xl h-12 bg-[#FF671F] opacity-50">Test Vocal Clone</Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card border-none rounded-3xl p-6 shadow-xl">
            <h3 className="font-headline font-bold text-[#004B40] mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FF671F]" /> Ethical Guardrails
            </h3>
            <ul className="space-y-3 text-sm font-medium text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF671F] mt-1.5 shrink-0" />
                Faculty-only data ownership.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF671F] mt-1.5 shrink-0" />
                Encrypted biometric signatures.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF671F] mt-1.5 shrink-0" />
                Manual override for all AI sessions.
              </li>
            </ul>
          </Card>

          <Card className="bg-[#004B40] text-white border-none rounded-3xl p-6 shadow-2xl">
            <h3 className="font-headline font-bold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#FF671F]" /> Next Step
            </h3>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              To begin, we recommend recording 60 minutes of your core lectures in a quiet environment. This will serve as the "Vocal Seed" for your twin.
            </p>
            <Button variant="outline" className="w-full rounded-xl border-white/20 text-white hover:bg-white/10">
              Download Recording Guide
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
