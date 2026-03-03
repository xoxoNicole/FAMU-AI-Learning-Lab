"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Mic, Video, UserCheck, Send, BookOpen, Globe, ShieldCheck, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { askNicole, MentorshipOutput } from '@/ai/flows/nicole-mentorship';
import { useToast } from '@/hooks/use-toast';

export default function DigitalTwinLab() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<MentorshipOutput | null>(null);
  const { toast } = useToast();

  const handleAskNicole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      // In this prototype, we simulate the 'contextFromIP' retrieval
      const res = await askNicole({ 
        userQuery: query,
        contextFromIP: "Strategic Framework: AI transformation in Higher Ed requires a top-down leadership mandate combined with bottom-up faculty literacy. Focus on efficiency gains in administrative drafting to buy back time for research."
      });
      setResponse(res);
      setQuery('');
    } catch (err) {
      toast({ variant: 'destructive', title: 'Mentor Connection Error', description: 'Nicole is briefly unavailable. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-[#FF671F] font-bold uppercase tracking-widest text-xs">
          <Sparkles className="w-4 h-4" /> The CEO's Office
        </div>
        <h1 className="text-5xl font-headline font-bold text-[#004B40] tracking-tight">Talk to Nicole</h1>
        <p className="text-xl text-muted-foreground font-medium">Your 24/7 executive coach for institutional transformation.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none bg-[#004B40]/5 rounded-[2.5rem] overflow-hidden relative min-h-[450px] flex flex-col border-dashed border-2 border-[#004B40]/20 shadow-inner">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <Image 
                src="https://images.unsplash.com/photo-1689686610856-3bcf921eb1f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Lab Background"
                fill
                className="object-cover grayscale"
              />
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto space-y-6 relative z-10">
              {response ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FF671F] flex items-center justify-center shrink-0 shadow-lg">
                      <UserCheck className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white p-6 rounded-2xl rounded-tl-none shadow-sm border border-[#004B40]/10">
                        <p className="text-[#004B40] font-medium leading-relaxed">{response.answer}</p>
                      </div>
                      <div className="bg-[#FF671F]/5 border border-[#FF671F]/20 p-6 rounded-2xl">
                        <p className="text-[10px] font-bold uppercase text-[#FF671F] tracking-widest mb-2 flex items-center gap-2">
                          <ShieldCheck className="w-3 h-3" /> Nicole's Strategic Directive
                        </p>
                        <p className="text-[#004B40] font-bold italic">"{response.suggestedAction}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-xl">
                    <Mic className="w-10 h-10 text-[#004B40]" />
                  </div>
                  <p className="font-headline font-bold text-[#004B40] text-xl">Mentor link ready.</p>
                  <p className="text-sm font-medium max-w-xs">Ask Nicole a question about your strategic goals or a specific course module.</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-white/60 backdrop-blur-xl border-t border-[#004B40]/10 relative z-20">
              <form onSubmit={handleAskNicole} className="flex gap-3">
                <Input 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a strategic question..."
                  className="flex-1 h-14 rounded-2xl bg-white border-none shadow-sm focus-visible:ring-[#FF671F]"
                />
                <Button 
                  type="submit" 
                  disabled={loading || !query.trim()}
                  className="w-14 h-14 rounded-2xl bg-[#004B40] hover:bg-[#004B40]/90 text-white shadow-lg"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                </Button>
              </form>
            </div>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 bg-white border-none shadow-sm rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#004B40]/5 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#004B40]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Grounded IP</p>
                <p className="text-sm font-bold text-[#004B40]">Nicole's Frameworks</p>
              </div>
            </Card>
            <Card className="p-6 bg-white border-none shadow-sm rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF671F]/5 flex items-center justify-center">
                <Globe className="w-6 h-6 text-[#FF671F]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Search Anchor</p>
                <p className="text-sm font-bold text-[#004B40]">Live Academic Web</p>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-none rounded-3xl p-8 shadow-xl">
            <h3 className="font-headline font-bold text-[#004B40] mb-6 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#FF671F]" /> Mentorship Areas
            </h3>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              {["Strategic Memo Review", "Budget Narrative Enhancement", "Change Management Coaching", "AI Ethics in Higher Education"].map((area, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#004B40]/5 transition-colors group cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-[#FF671F] mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="bg-[#004B40] text-white border-none rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />
            <h3 className="font-headline font-bold mb-4 flex items-center gap-2 relative z-10">
              <Globe className="w-5 h-5 text-[#FF671F]" /> Grounding Logic
            </h3>
            <p className="text-white/80 text-sm leading-relaxed mb-8 relative z-10">
              Nicole's twin is anchored in your agency's proprietary frameworks (Memory) and cross-references live information using Google Search (Anchor). This ensures every response is both original and accurate.
            </p>
            <Button variant="outline" className="w-full rounded-xl border-white/20 text-white hover:bg-white/10 font-bold h-12">
              View Memory Documents
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
