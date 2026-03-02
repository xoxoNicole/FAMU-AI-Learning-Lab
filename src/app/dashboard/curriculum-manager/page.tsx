"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { BookOpen, Plus, Trash2, LayoutGrid, Clock, Video } from 'lucide-react';
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

  const { data: modules } = useCollection(modulesQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !formData.title) return;

    addDocumentNonBlocking(collection(db, 'modules'), {
      ...formData,
      createdAt: new Date().toISOString()
    });
    
    toast({ 
      title: "Module Request Sent", 
      description: `${formData.title} is being deployed to the catalog.` 
    });
    
    setFormData({ title: '', description: '', duration: '', category: '', thumbnail: '', videoUrl: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (!db) return;
    deleteDocumentNonBlocking(doc(db, 'modules', id));
    toast({ title: "Module Deletion Initiated" });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-[#FF671F] uppercase tracking-[0.3em]">Administration Tool</p>
          <h1 className="text-4xl font-headline font-bold text-[#004B40]">Curriculum Manager</h1>
          <p className="text-muted-foreground font-medium">Create and manage institutional learning modules for faculty.</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="rounded-2xl h-12 bg-[#004B40] hover:bg-[#004B40]/90 text-white font-bold"
        >
          {showForm ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> New Module</>}
        </Button>
      </header>

      {showForm && (
        <Card className="glass-card border-none shadow-2xl rounded-[2.5rem] animate-in slide-in-from-top-4 duration-500 overflow-hidden">
          <div className="h-2 bg-[#FF671F]" />
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-[#004B40]">Module Configuration</CardTitle>
            <CardDescription>Enter the details for the new strategic learning unit.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Module Title</label>
                  <Input 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Strategic Grant Writing"
                    className="h-12 rounded-xl bg-muted/50 border-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Category</label>
                  <Input 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    placeholder="e.g., Development, Ethics"
                    className="h-12 rounded-xl bg-muted/50 border-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Description</label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Explain the learning objectives..."
                  className="rounded-xl bg-muted/50 border-none h-32"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Duration (e.g., 45 mins)</label>
                  <Input 
                    value={formData.duration} 
                    onChange={e => setFormData({...formData, duration: e.target.value})}
                    placeholder="45 mins"
                    className="h-12 rounded-xl bg-muted/50 border-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Thumbnail URL</label>
                  <Input 
                    value={formData.thumbnail} 
                    onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                    placeholder="Unsplash or direct image link"
                    className="h-12 rounded-xl bg-muted/50 border-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Video URL (Vimeo/YT)</label>
                  <Input 
                    value={formData.videoUrl} 
                    onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                    placeholder="Embedded video link"
                    className="h-12 rounded-xl bg-muted/50 border-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="submit" className="h-14 px-10 rounded-2xl bg-[#FF671F] hover:bg-[#FF671F]/90 text-white font-headline font-bold shadow-xl">
                  Deploy Module to Catalog
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-xl font-headline font-bold text-[#004B40] flex items-center gap-2 mb-2">
          <LayoutGrid className="w-5 h-5 text-[#FF671F]" /> Active Modules ({modules?.length || 0})
        </h3>
        {modules?.map(module => (
          <Card key={module.id} className="glass-card border-none hover:shadow-lg transition-all group overflow-hidden">
            <div className="flex items-center p-6 gap-6">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-muted">
                {module.thumbnail && <img src={module.thumbnail} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xl font-headline font-bold text-[#004B40] truncate">{module.title}</h4>
                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#FF671F]" /> {module.duration}</span>
                  <span className="flex items-center gap-1"><Video className="w-3 h-3 text-[#FF671F]" /> {module.category}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleDelete(module.id)}
                  className="rounded-xl h-10 w-10 border-destructive/10 text-destructive hover:bg-destructive hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}