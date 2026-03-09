"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowRight, BookOpen, Target, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-accent/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-muted">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#004B40] flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-headline font-bold text-[#004B40] tracking-tight block leading-none">AI Literacy Lab</span>
              <span className="text-[10px] font-bold text-[#FF671F] uppercase tracking-[0.2em]">Florida A&M University</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-[#004B40] font-bold">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button className="rounded-xl px-6 h-11 bg-[#FF671F] hover:bg-[#FF671F]/90 text-white font-headline font-bold shadow-lg shadow-orange-200">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#004B40]/5 border border-[#004B40]/10">
              <span className="w-2 h-2 rounded-full bg-[#FF671F]" />
              <span className="text-xs font-bold text-[#004B40] uppercase tracking-widest">Faculty Innovation Initiative</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-headline font-bold text-[#004B40] leading-[0.9] tracking-tighter">
              Institutional <br />
              <span className="text-[#FF671F]">Excellence.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg font-medium">
              A specialized platform empowering academic leaders to refine grant proposals, draft strategic institutional content, and leverage AI with professional precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/login">
                <Button className="h-16 px-10 rounded-2xl bg-[#004B40] text-white text-lg font-headline font-bold shadow-2xl hover:scale-105 transition-all group">
                  Enter the Lab <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="h-16 px-10 rounded-2xl border-[#004B40]/20 bg-white text-[#004B40] text-lg font-headline font-bold hover:bg-muted">
                  Curriculum Overview
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
              <Image 
                src="https://images.unsplash.com/photo-1689686610856-3bcf921eb1f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="FAMU Campus"
                fill
                className="object-cover"
                data-ai-hint="university campus"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#004B40]/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-4xl font-headline font-bold leading-tight">Advanced Literacy for Higher Education.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-headline font-bold text-[#004B40] mb-4">Core Capabilities</h2>
              <p className="text-muted-foreground text-lg font-medium">Designed for the unique challenges of modern academic administration.</p>
            </div>
            <div className="h-px flex-1 bg-[#004B40]/10 mx-8 hidden md:block" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Specialized Curriculum",
                desc: "Strategic lessons curated for the HBCU administrative landscape.",
                color: "bg-[#004B40]"
              },
              {
                icon: Sparkles,
                title: "Drafting Assistant",
                desc: "Efficiency tools to help generate first drafts of memos, reports, and proposals.",
                color: "bg-[#FF671F]"
              },
              {
                icon: Target,
                title: "Strategy Lab",
                desc: "Interactive environment to stress-test initiatives and refine institutional goals.",
                color: "bg-[#004B40]"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-muted group">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg", feature.color)}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-headline font-bold text-[#004B40] mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-16 border-t border-muted">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full border-4 border-[#004B40]/10 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-[#004B40]" />
              </div>
              <div>
                <p className="font-headline font-bold text-[#004B40] text-lg uppercase tracking-tight">Enterprise Standard</p>
                <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Data Privacy and Institutional Security</p>
              </div>
            </div>
            <div className="flex gap-12 font-headline font-bold text-[#004B40]/40 text-sm uppercase tracking-[0.3em]">
              <span>FAMU Licensed</span>
              <span>Secure Portal</span>
              <span>2026 Edition</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
