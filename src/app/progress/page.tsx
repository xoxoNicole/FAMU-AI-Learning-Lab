
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Zap, 
  Target, 
  TrendingUp, 
  Award, 
  Clock, 
  ShieldCheck,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const efficiencyData = [
  { day: 'Mon', value: 65 },
  { day: 'Tue', value: 72 },
  { day: 'Wed', value: 85 },
  { day: 'Thu', value: 82 },
  { day: 'Fri', value: 94 },
  { day: 'Sat', value: 88 },
  { day: 'Sun', value: 96 },
];

export default function StrategicProgressPage() {
  const { user } = useUser();
  const db = useFirestore();

  const progressQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'userProfiles', user.uid, 'moduleProgress'));
  }, [db, user]);

  const { data: progress } = useCollection(progressQuery);

  const completedCount = progress?.filter(p => p.isCompleted).length || 0;
  const totalCount = 12; // Assuming 12 core modules for the curriculum

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#FF671F] uppercase tracking-[0.3em]">Performance Analytics</p>
          <h1 className="text-5xl font-headline font-bold text-[#004B40] tracking-tighter">
            Strategic Progress
          </h1>
          <p className="text-muted-foreground text-lg font-medium">Measuring institutional impact and AI literacy mastery.</p>
        </div>
        <div className="flex gap-4">
          <Card className="shadow-xl border-none px-6 py-4 flex items-center gap-4 bg-white rounded-3xl">
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Mastery Status</p>
              <p className="text-xl font-headline font-bold text-[#004B40]">Strategist Tier I</p>
            </div>
            <Award className="w-8 h-8 text-[#FF671F]" />
          </Card>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border-none bg-[#004B40] text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform" />
          <div className="relative z-10 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#FF671F]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Current Efficiency Rating</p>
              <h3 className="text-4xl font-headline font-bold">A+ (96%)</h3>
            </div>
            <p className="text-sm text-white/70 leading-relaxed font-medium">
              You are completing strategic drafts 4.2x faster than the institutional average.
            </p>
          </div>
        </Card>

        <Card className="border-none bg-white rounded-[2.5rem] p-8 shadow-sm border border-muted/50 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#FF671F]/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-[#FF671F]" />
              </div>
              <span className="text-[10px] font-bold text-[#004B40] uppercase tracking-widest bg-[#004B40]/5 px-3 py-1 rounded-full">
                Phase 1 of 3
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Curriculum Mastery</p>
              <h3 className="text-3xl font-headline font-bold text-[#004B40]">{completedCount} / {totalCount} Units</h3>
            </div>
            <Progress value={(completedCount / totalCount) * 100} className="h-3 rounded-full bg-muted" />
          </div>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-4">Next: Advanced Grant Drafting</p>
        </Card>

        <Card className="border-none bg-white rounded-[2.5rem] p-8 shadow-sm border border-muted/50 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#004B40]/5 flex items-center justify-center">
              <Target className="w-6 h-6 text-[#004B40]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Institutional Output</p>
              <h3 className="text-3xl font-headline font-bold text-[#004B40]">14 Initiatives</h3>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i <= 4 ? 'bg-[#004B40]' : 'bg-muted'}`} />
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-4">4 Projects in refinement phase</p>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none bg-white rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-xl font-headline font-bold text-[#004B40] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#FF671F]" /> Efficiency Trend
              </h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Calculated by draft-to-final duration</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#004B40]" /> Current Week</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={efficiencyData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004B40" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#004B40" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 10, fontWeight: 'bold' }} 
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontFamily: 'Space Grotesk'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#004B40" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-none bg-white rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-xl font-headline font-bold text-[#004B40] mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#FF671F]" /> Recent Milestones
          </h3>
          <div className="space-y-6">
            {[
              { label: 'AI Grantmaster', date: '2 hours ago', icon: Zap },
              { label: 'Strategic Clarity', date: 'Yesterday', icon: CheckCircle2 },
              { label: 'First Refinement', date: 'Oct 12', icon: BarChart3 },
              { label: 'Lab Initialized', date: 'Oct 10', icon: Clock },
            ].map((milestone, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-[#004B40]/5 flex items-center justify-center group-hover:bg-[#FF671F]/10 transition-colors">
                  <milestone.icon className="w-5 h-5 text-[#004B40] group-hover:text-[#FF671F] transition-colors" />
                </div>
                <div>
                  <p className="font-bold text-[#004B40] text-sm">{milestone.label}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{milestone.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
