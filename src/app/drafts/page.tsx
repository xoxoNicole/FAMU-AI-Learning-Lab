
"use client";

import React, { useState } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Trash2, 
  ExternalLink, 
  Search, 
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import Link from 'next/link';

export default function MyDraftsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');

  const draftsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'userProfiles', user.uid, 'outputs'),
      orderBy('createdAt', 'desc')
    );
  }, [db, user]);

  const { data: drafts, isLoading: loading } = useCollection(draftsQuery);

  const filteredDrafts = drafts?.filter(draft => 
    draft.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!db || !user) return;
    try {
      await deleteDoc(doc(db, 'userProfiles', user.uid, 'outputs', id));
    } catch (err) {
      console.error("Failed to delete draft", err);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-headline font-bold text-primary">My Strategic Drafts</h1>
          <p className="text-muted-foreground mt-2 text-lg">Your repository of AI-assisted institutional content.</p>
        </div>
        <Link href="/strategist">
          <Button className="rounded-xl h-11 bg-accent hover:bg-accent/90">
            <Sparkles className="w-4 h-4 mr-2" /> New Draft
          </Button>
        </Link>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input 
          placeholder="Search by title..." 
          className="pl-10 h-12 bg-white/50 border-primary/10 rounded-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading your drafts...</div>
        ) : filteredDrafts && filteredDrafts.length > 0 ? (
          filteredDrafts.map((draft) => (
            <Card key={draft.id} className="glass-card border-none hover:shadow-lg transition-all group overflow-hidden">
              <div className="flex items-center p-6 gap-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-headline font-bold text-primary truncate">{draft.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {draft.createdAt ? format(new Date(draft.createdAt), 'MMM d, yyyy h:mm a') : 'Unknown Date'}
                    </span>
                    <span className="bg-accent/10 text-accent px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      {draft.outputType || 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/strategist?draftId=${draft.id}`}>
                    <Button variant="outline" size="icon" className="rounded-lg h-10 w-10 border-primary/10 text-primary hover:bg-primary hover:text-white">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-lg h-10 w-10 border-destructive/10 text-destructive hover:bg-destructive hover:text-white"
                    onClick={() => handleDelete(draft.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform ml-2 self-center" />
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="glass-card border-none p-20 text-center">
            <div className="max-w-xs mx-auto space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto opacity-50">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-headline font-bold text-primary">No drafts yet</h3>
              <p className="text-muted-foreground italic">Start crafting your first institutional document in the AI Lab.</p>
              <Link href="/strategist">
                <Button variant="outline" className="mt-4">Go to AI Lab</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
