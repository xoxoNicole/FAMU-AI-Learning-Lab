
"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { NicoleChat } from '@/components/strategist/NicoleChat';
import { ChevronLeft, Play, Maximize2, CheckCircle } from 'lucide-react';

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const [videoStarted, setVideoStarted] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="h-16 border-b border-white/20 px-6 flex items-center justify-between bg-white/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Module {params.id}</span>
            <h1 className="font-headline font-bold text-primary">Strategic Content Drafting</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-accent/20 text-accent hover:bg-accent/5 rounded-xl">
            <CheckCircle className="w-4 h-4 mr-2" /> Mark Complete
          </Button>
        </div>
      </header>

      {/* Split Screen Lab */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Video & Content */}
        <div className="w-1/2 p-8 overflow-y-auto border-r border-white/20 bg-white/20">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group bg-black">
              {!videoStarted ? (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Button 
                    onClick={() => setVideoStarted(true)}
                    className="w-20 h-20 rounded-full bg-white text-primary hover:scale-110 transition-transform shadow-xl"
                  >
                    <Play className="w-8 h-8 fill-current" />
                  </Button>
                  <div className="absolute inset-0 bg-primary/20" />
                </div>
              ) : (
                <iframe
                  src="https://player.vimeo.com/video/76979871?h=8272103f6e&badge=0&autopause=0&player_id=0&app_id=58479"
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  title="Module Intro"
                />
              )}
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-headline font-bold text-primary">Mastering the First Draft</h2>
              <div className="prose prose-blue text-lg leading-relaxed text-muted-foreground">
                <p>
                  In this session, we explore the psychology of the "Blank Page" and how to use the AI Literacy Lab as your primary brainstorming partner.
                </p>
                <p>
                  Administrators often spend 80% of their time just getting the structure right. We're going to flip that. You'll use the lab on the right to prompt the AI for a memo structure based on FAMU's current strategic plan.
                </p>
              </div>

              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                  <Maximize2 className="w-4 h-4" /> Lab Activity
                </h4>
                <p className="text-sm text-primary/80 italic">
                  "Prompt the AI with: 'Draft a three-paragraph memo about our new research initiative for the Fall 2024 semester. Use a collaborative and encouraging tone.'"
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
