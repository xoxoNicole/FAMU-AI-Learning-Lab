"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { ShieldAlert, ThumbsDown, ThumbsUp, Clock, User, MessageSquare, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default function MaintenanceDashboard() {
  const db = useFirestore();

  const feedbackQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'feedback'), orderBy('timestamp', 'desc'), limit(50));
  }, [db]);

  const { data: feedbackList, isLoading } = useCollection(feedbackQuery);

  const stats = {
    total: feedbackList?.length || 0,
    positive: feedbackList?.filter(f => f.isPositive).length || 0,
    negative: feedbackList?.filter(f => !f.isPositive).length || 0,
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-[#FF671F] uppercase tracking-[0.3em]">Institutional Audit</p>
          <h1 className="text-4xl font-headline font-bold text-[#004B40]">Institutional Maintenance</h1>
          <p className="text-muted-foreground font-medium">Monitoring AI mentor responses and faculty feedback loops.</p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-muted/50">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Total Audit Events</p>
          <p className="text-3xl font-headline font-bold text-[#004B40]">{stats.total}</p>
        </Card>
        <Card className="bg-green-50 p-6 rounded-[2.5rem] border border-green-100">
          <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-2">Success (Pass)</p>
          <p className="text-3xl font-headline font-bold text-green-700">{stats.positive}</p>
        </Card>
        <Card className="bg-red-50 p-6 rounded-[2.5rem] border border-red-100">
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-2">Needs Refinement (Fail)</p>
          <p className="text-3xl font-headline font-bold text-red-700">{stats.negative}</p>
        </Card>
      </section>

      <div className="space-y-6">
        <h3 className="text-xl font-headline font-bold text-[#004B40] flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#FF671F]" /> Active Audit Log
        </h3>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Syncing feedback store...</div>
        ) : feedbackList && feedbackList.length > 0 ? (
          <div className="space-y-4">
            {feedbackList.map((item) => (
              <Card key={item.id} className="border-none bg-white shadow-sm overflow-hidden group">
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.isPositive ? <ThumbsUp className="w-5 h-5" /> : <ThumbsDown className="w-5 h-5" />}
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {item.userEmail || 'Anonymous'}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {format(new Date(item.timestamp), 'MMM d, h:mm a')}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="rounded-xl h-8 text-[10px] font-bold text-[#004B40] uppercase">
                        Refine IP <ExternalLink className="ml-2 w-3 h-3" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-[#004B40] uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare className="w-3 h-3 text-[#FF671F]" /> User Query
                      </p>
                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl italic">"{item.query}"</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-[#004B40] uppercase tracking-wider flex items-center gap-2">
                        <ShieldAlert className="w-3 h-3 text-[#FF671F]" /> Response Provided
                      </p>
                      <p className="text-sm text-[#004B40] font-medium leading-relaxed">{item.response}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 p-20 text-center rounded-[2.5rem] bg-transparent">
            <p className="text-muted-foreground italic">No feedback has been recorded yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}