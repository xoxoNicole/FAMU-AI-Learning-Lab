
"use client";

import React, { Suspense } from 'react';
import { NicoleChat } from '@/components/strategist/NicoleChat';
import { Sparkles, Loader2, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function StrategistPage() {
  return (
    <div className="h-full flex flex-col p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#FF671F] font-bold uppercase tracking-widest text-xs">
            <Sparkles className="w-4 h-4" /> Antigravity Refinement
          </div>
          <h1 className="text-5xl font-headline font-bold text-[#004B40] tracking-tight">The AI Strategist Lab</h1>
          <p className="text-xl text-muted-foreground font-medium">Bypass the blank page. Refine your vision. Strike from the top.</p>
        </div>
      </header>

      <div className="flex-1 min-h-0">
        <Suspense fallback={
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        }>
          <NicoleChat />
        </Suspense>
      </div>

      <footer className="pt-4">
        <Card className="bg-[#004B40]/5 border-none rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3 text-sm text-[#004B40] font-medium">
            <Info className="w-4 h-4 text-[#FF671F]" />
            <span>Every generation and refinement is grounded in Nicole's proprietary institutional frameworks.</span>
          </CardContent>
        </Card>
      </footer>
    </div>
  );
}
