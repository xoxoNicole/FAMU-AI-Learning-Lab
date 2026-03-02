"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { BookOpen, Plus, Trash2, LayoutGrid, Clock, Video, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CurriculumManager() {
  const db = useFirestore();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    category: '',
    thumbnail: '',
    videoUrl: ''
  });

  const modulesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'modules'), orderBy('title', 'asc'));
  }, [db]);

  const { data: modules, isLoading } = useCollection(modulesQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !formData.title) return;

    addDocumentNonBlocking(collection(db, 'modules'), {
      ...formData,
      createdAt: new Date().toISOString()
    });
    
    toast({ 
      title: "Module Deployment Started", 
      description: `${formData.title} is being synchronized with the global catalog.` 
    });
    
    setFormData({ title: '', description: '', duration: '', category: '', thumbnail: '', videoUrl: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (!db) return;
    deleteDocumentNonBlocking(doc(db, 'modules', id));
    toast({ 
      title: "Module Decommissioned",
      description: `Removing ${title} from the curriculum.`
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-[#FF671F] uppercase tracking-[0.3em]">Administration Terminal</p>
          <h1 className="text-4xl font-headline font-bold text-[#004B40]">Curriculum Lab</h1>
          <p className="text-muted-foreground font-medium">Design and deploy strategic learning units for the faculty body.</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className={`rounded-2xl h-12 font-bold transition-all ${showForm ? 'bg-muted text-muted-foreground hover:bg-muted/80' : 'bg-[#004B40] hover:bg-[#004B40]/90 text-white shadow-lg shadow-green-900/20'}`}
        >
          {showForm ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Plus className="w-4 h-4 mr-2" /> New Module</>}
        </Button>
      </header>

      {showForm && (
        <Card className="border-none shadow-2xl rounded-[2.5rem] animate-in slide-in-from-top-4 duration-500 overflow-hidden bg-white">
          <div className="h-2 bg-[#FF671F]" />
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-[#004B40]">Unit Configuration</CardTitle>
            <CardDescription>Configure the metadata for this institutional learning module.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-[#004B40]/60 tracking-widest">Module Title</label>
                  <Input 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., AI-Assisted Grant Writing"
                    className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-[#FF671F]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-[#004B40]/60 tracking-widest">Strategic Category</label>
                  <Input 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    placeholder="e.g., Academic Innovation"
                    className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-[#FF671F]"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-[#004B40]/60 tracking-widest">Objective & Description</label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="What will faculty master in this unit?"
                  className="rounded-xl bg-muted/30 border-none h-32 focus-visible:ring-[#FF671F]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-[#004B40]/60 tracking-widest">Duration</label>
                  <Input 
                    value={formData.duration} 
                    onChange={e => setFormData({...formData, duration: e.target.value})}
                    placeholder="e.g., 45 mins"
                    className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-[#FF671F]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-[#004B40]/60 tracking-widest">Visual Assets (URL)</label>
                  <Input 
                    value={formData.thumbnail} 
                    onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                    placeholder="Cover image URL"
                    className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-[#FF671F]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-[#004B40]/60 tracking-widest">Resource Link (Video)</label>
                  <Input 
                    value={formData.videoUrl} 
                    onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                    placeholder="Video/Interactive URL"
                    className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-[#FF671F]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-muted">
                <Button type="submit" className="h-14 px-10 rounded-2xl bg-[#FF671F] hover:bg-[#FF671F]/90 text-white font-headline font-bold shadow-xl shadow-orange-900/20">
                  Deploy to Course Catalog
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <h3 className="text-xl font-headline font-bold text-[#004B40] flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-[#FF671F]" /> Active Curriculum Inventory
        </h3>
        
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2].map(i => <Card key={i} className="h-24 animate-pulse bg-muted rounded-2xl" />)}
          </div>
        ) : modules && modules.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {modules.map(module => (
              <Card key={module.id} className="border-none bg-white hover:shadow-xl transition-all group overflow-hidden shadow-sm">
                <div className="flex items-center p-6 gap-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-muted border border-muted">
                    {module.thumbnail ? (
                      <img src={module.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#004B40]/5">
                        <BookOpen className="w-8 h-8 text-[#004B40]/20" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h4 className="text-xl font-headline font-bold text-[#004B40] truncate">{module.title}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-[#FF671F]/10 text-[#FF671F] text-[9px] font-bold uppercase tracking-widest">
                        {module.category || 'Standard'}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#FF671F]" /> {module.duration || 'N/A'}</span>
                      <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-[#FF671F]" /> Resources Linked</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDelete(module.id, module.title)}
                      className="rounded-xl h-12 w-12 border-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 bg-transparent p-12 text-center rounded-[2.5rem]">
            <p className="text-muted-foreground font-medium italic">No modules deployed. Click "New Module" to begin populating the curriculum.</p>
          </Card>
        )}
      </div>
    </div>
  );
}