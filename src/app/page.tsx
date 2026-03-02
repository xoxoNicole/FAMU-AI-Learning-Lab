
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sparkles, ShieldCheck, ArrowRight, Zap, BookOpen, Target } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#E1E9EE] selection:bg-accent/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/40 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-headline font-bold text-primary tracking-tight">AI Literacy Lab</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/login">
              <Button className="rounded-xl px-6 h-11 bg-primary hover:bg-primary/90 font-headline font-bold">
                Faculty Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white/20 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Exclusively for FAMU Administrators</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-headline font-bold text-primary leading-[1.1] tracking-tight">
              Scale Your <br />
              <span className="text-accent">Strategic Impact</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              A specialized AI training environment designed to transform faculty administrators into tech-empowered leaders. Draft strategic memos, challenge institutional assumptions, and master generative tools in a secure laboratory.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/login">
                <Button className="h-14 px-8 rounded-2xl bg-primary text-white text-lg font-headline font-bold shadow-xl hover:translate-y-[-2px] transition-all group">
                  Enter the Lab <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" className="h-14 px-8 rounded-2xl border-primary/10 bg-white/40 backdrop-blur-md text-primary text-lg font-headline font-bold hover:bg-white/60">
                View Curriculum
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/40">
              <Image 
                src="https://images.unsplash.com/photo-1689686610856-3bcf921eb1f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHx1bml2ZXJzaXR5JTIwY2FtcHVzfGVufDB8fHx8MTc3MjM3NTc1OHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="FAMU Innovation"
                fill
                className="object-cover"
                data-ai-hint="university campus"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>
            {/* Floating Stats Card */}
            <div className="absolute -bottom-10 -left-10 glass-card p-6 rounded-3xl animate-bounce-slow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">Strategic Efficiency</p>
                  <p className="text-2xl font-headline font-bold text-accent">+80% Growth</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-headline font-bold text-primary mb-4">Core Lab Capabilities</h2>
            <p className="text-muted-foreground text-lg">Meticulously designed tools for the modern academic leader.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Curated Learning",
                desc: "Modular lessons specifically for Higher-Ed administration scenarios.",
                color: "bg-blue-500"
              },
              {
                icon: Sparkles,
                title: "Strategic Drafter",
                desc: "Generate comprehensive first drafts of memos, grants, and reports instantly.",
                color: "bg-purple-500"
              },
              {
                icon: Target,
                title: "Assumptions Lab",
                desc: "Critique your own proposals using AI that thinks like a strategic mentor.",
                color: "bg-orange-500"
              }
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-[2rem] hover:translate-y-[-8px] transition-all duration-300 border-none group">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg transition-transform group-hover:scale-110", feature.color)}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-headline font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-12 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <span className="font-headline font-bold text-primary">SECURE ENTERPRISE ENVIROMENT</span>
          </div>
          <div className="flex gap-12 font-headline font-bold text-primary/40">
            <span>FAMU EXCLUSIVE</span>
            <span>DATA PRIVACY GUARANTEED</span>
            <span>FACULTY AUDITED</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
