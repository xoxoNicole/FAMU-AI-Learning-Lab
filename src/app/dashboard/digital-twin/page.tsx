
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Sparkles, 
  Mic, 
  UserCheck, 
  Send, 
  Globe, 
  ShieldCheck, 
  Loader2, 
  Star, 
  Database,
  ThumbsUp,
  ThumbsDown,
  Settings,
  Shield
} from 'lucide-react';
import Image from 'next/image';
import { askNicole, MentorshipOutput } from '@/ai/flows/nicole-mentorship';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Link from 'next/link';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function DigitalTwinLab() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<MentorshipOutput | null>(null);
  const [lastQuery, setLastQuery] = useState('');
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();

  const nicoleAvatar = PlaceHolderImages.find(img => img.id === 'nicole-avatar')?.imageUrl || "https://picsum.photos/seed/nicole/400/400";

  const handleAskNicole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setLastQuery(query);
    try {
      const res = await askNicole({ userQuery: query });
      setResponse(res);
      setQuery('');
    } catch (err) {
      toast({ 
        variant: 'destructive', 
        title: 'Mentor Connection Error', 
        description: 'Nicole is briefly unavailable via Vertex AI. Deep breath, and let\'s try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (isPositive: boolean) => {
    if (!user || !db || !response) return;

    addDocumentNonBlocking(collection(db, 'feedback'), {
      userId: user.uid,
      userEmail: user.email,
      query: lastQuery,
      response: response.answer,
      isPositive,
      timestamp: new Date().toISOString()
    });

    toast({ 
      title: "Feedback Recorded", 
      description: "The Strike Team will use this to further refine Nicole's strategic persona." 
    });
  };

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
        <Link href="/dashboard/admin/maintenance">
          <Button variant="outline" className="rounded-xl border-[#004B40]/10 text-[#004B40] font-bold h-12">
            <Settings className="w-4 h-4 mr-2" /> Antigravity Maintenance
          </Button>
        </Link>
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
            
            <div className="flex-1 p-8 overflow-y-auto space-y-8 relative z-10">
              {response ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex gap-4">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-white shrink-0">
                      <Image src={nicoleAvatar} alt="Nicole" fill className="object-cover" />
                    </div>
                    <div className="space-y-4 flex-1">
                      <div className="bg-white p-6 rounded-3xl rounded-tl-none shadow-sm border border-[#004B40]/10">
                        <p className="text-[#004B40] font-medium leading-relaxed whitespace-pre-wrap">{response.answer}</p>
                      </div>
                      <div className="bg-[#FF671F]/5 border border-[#FF671F]/20 p-6 rounded-3xl flex justify-between items-start gap-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase text-[#FF671F] tracking-widest mb-2 flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3" /> Strategic Directive
                          </p>
                          <p className="text-[#004B40] font-bold italic">"{response.suggestedAction}"</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button size="icon" variant="ghost" className="rounded-full hover:bg-white" onClick={() => handleFeedback(true)}>
                            <ThumbsUp className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button size="icon" variant="ghost" className="rounded-full hover:bg-white" onClick={() => handleFeedback(false)}>
                            <ThumbsDown className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative w-32 h-32 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                    <Image src={nicoleAvatar} alt="Nicole Murray" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#004B40]/40 to-transparent" />
                  </div>
                  <div className="space-y-2 opacity-60">
                    <p className="font-headline font-bold text-[#004B40] text-2xl">Digital Nicole Ready.</p>
                    <p className="text-sm font-medium max-w-xs mx-auto">"Let's build something great. Ask a question about your curriculum or the AI landscape."</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-white/60 backdrop-blur-xl border-t border-[#004B40]/10 relative z-20">
              <form onSubmit={handleAskNicole} className="flex gap-3">
                <Input 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Talk to Nicole..."
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
                <Database className="w-6 h-6 text-[#004B40]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Vertex AI Search</p>
                <p className="text-sm font-bold text-[#004B40]">FAMU Data Store</p>
              </div>
            </Card>
            <Card className="p-6 bg-white border-none shadow-sm rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF671F]/5 flex items-center justify-center">
                <Globe className="w-6 h-6 text-[#FF671F]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Live Grounding</p>
                <p className="text-sm font-bold text-[#004B40]">Google Search</p>
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
              Nicole is the CEO and Lead Instructor. Her digital twin is an extension of her strategic brain, anchored in Vertex AI to help Rattler leaders implement change with absolute technological confidence.
            </p>
            <Button variant="outline" className="w-full rounded-xl border-white/20 text-white hover:bg-white/10 font-bold h-12">
              View Bio
            </Button>
          </Card>

          <Card className="glass-card border-none rounded-3xl p-8 shadow-xl">
            <h3 className="font-headline font-bold text-[#004B40] mb-6 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#FF671F]" /> Mentorship Areas
            </h3>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              {[
                "Strategic Memo Review", 
                "Budget Narrative Enhancement", 
                "Change Management Coaching", 
                "AI Ethics in Higher Education",
                "Faculty Innovation Loops"
              ].map((area, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#004B40]/5 transition-colors group cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-[#FF671F] mt-2 shrink-0 group-hover:scale-150 transition-transform" />
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
