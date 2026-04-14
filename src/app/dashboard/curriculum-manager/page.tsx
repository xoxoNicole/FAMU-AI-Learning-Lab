
"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirestore, useCollection, useMemoFirebase, useDoc, useUser } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc, increment } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { BookOpen, Plus, Trash2, LayoutGrid, Clock, Video, X, Zap, ShieldCheck, TrendingUp, Users, Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CurriculumManager() {
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [newTotalLicenses, setNewTotalLicenses] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    category: '',
    thumbnail: '',
    videoUrl: '',
    labTask: '',
    difficulty: 'Foundational'
  });

  // License Management
  const licenseRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'system', 'license');
  }, [db, user]);
  const { data: licenseConfig } = useDoc(licenseRef);

  const handleUpdateLicenses = async () => {
    if (!db || !newTotalLicenses) return;
    const val = parseInt(newTotalLicenses);
    if (isNaN(val)) return;

    try {
      await updateDoc(doc(db, 'system', 'license'), {
        totalLicenses: val,
        updatedAt: new Date().toISOString()
      });
      toast({ title: "Licensing Updated", description: `Client provisioned for ${val} total faculty licenses.` });
      setNewTotalLicenses('');
    } catch (err) {
      toast({ variant: "destructive", title: "Update Failed", description: "Builder Terminal authentication required." });
    }
  };

  const modulesQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'modules'), orderBy('title', 'asc'));
  }, [db, user]);

  const { data: modules, isLoading } = useCollection(modulesQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !formData.title || !formData.labTask) return;

    addDocumentNonBlocking(collection(db, 'modules'), {
      ...formData,
      createdAt: new Date().toISOString()
    });
    
    toast({ 
      title: "Module Deployed", 
      description: `${formData.title} is now active in the client's catalog.` 
    });
    
    setFormData({ 
      title: '', 
      description: '', 
      duration: '', 
      category: '', 
      thumbnail: '', 
      videoUrl: '', 
      labTask: '',
      difficulty: 'Foundational' 
    });
    setShowForm(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (!db) return;
    deleteDocumentNonBlocking(doc(db, 'modules', id));
    toast({ 
      title: "Module Decommissioned",
      description: `Removing ${title} from the client environment.`
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-[#FF671F] uppercase tracking-[0.3em] flex items-center gap-2">
            <Terminal className="w-3 h-3" /> Builder Command Center
          </p>
          <h1 className="text-4xl font-headline font-bold text-[#004B40]">Strategic Control</h1>
          <p className="text-muted-foreground font-medium">Manage client curriculum and provision institutional capacity.</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className={`rounded-2xl h-12 font-bold transition-all ${showForm ? 'bg-muted text-muted-foreground hover:bg-muted/80' : 'bg-[#FF671F] hover:bg-[#FF671F]/90 text-white shadow-lg shadow-orange-900/20'}`}
        >
          {showForm ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Plus className="w-4 h-4 mr-2" /> New Module</>}
        </Button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#004B40] text-white border-none rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <Users className="w-6 h-6 text-[#FF671F]" />
              <span className="text-[9px] font-bold uppercase tracking-widest bg-white/10 px-2 py-1 rounded-full">Active Capacity</span>
            </div>
            <div>
              <p className="text-3xl font-headline font-bold">{licenseConfig?.activeLicenses || 0} / {licenseConfig?.totalLicenses || 0}</p>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">Faculty Licenses In Use</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white border-none rounded-[2.5rem] p-6 shadow-sm border border-muted/50 col-span-2 flex items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-bold text-[#004B40] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FF671F]" /> Modify Provisioning
            </h3>
            <p className="text-xs text-muted-foreground font-medium">Set the total faculty licenses for this client instance.</p>
          </div>
          <div className="flex gap-3">
            <input 
              type="number" 
              placeholder="e.g. 10" 
              value={newTotalLicenses}
              onChange={e => setNewTotalLicenses(e.target.value)}
              className="w-24 h-12 rounded-xl bg-muted/30 border-none px-4 text-sm font-bold focus:ring-2 focus:ring-[#FF671F] outline-none"
            />
            <Button onClick={handleUpdateLicenses} className="h-12 px-6 rounded-xl bg-[#004B40] text-white font-bold hover:bg-[#004B40]/90">
              Update Cap
            </Button>
          </div>
        </Card>
      </section>

      {showForm && (
        <Card className="border-none shadow-2xl rounded-[2.5rem] animate-in slide-in-from-top-4 duration-500 overflow-hidden bg-white">
          <div className="h-2 bg-[#FF671F]" />
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-[#004B40]">Deploy New Unit</CardTitle>
            <CardDescription>Populate the curriculum for the institutional faculty.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-[#004B40]/60 tracking-widest">Module Title</label>
                  <input 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., AI-Assisted Grant Writing"
                    className="w-full flex h-12 rounded-xl bg-muted/30 border-none px-4 text-sm focus:ring-2 focus:ring-[#FF671F] outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-[#004B40]/60 tracking-widest">Difficulty Tier</label>
                  <Select 
                    value={formData.difficulty} 
                    onValueChange={val => setFormData({...formData, difficulty: val})}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-none focus:ring-[#FF671F]">
                      <SelectValue placeholder="Select Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Foundational">Foundational</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-[#004B40]/60 tracking-widest">Module Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="What will faculty master in this unit?"
                  className="w-full flex min-h-[100px] rounded-xl bg-muted/30 border-none p-4 text-sm focus:ring-2 focus:ring-[#FF671F] outline-none resize-none"
                  required
                />
              </div>

              <div className="space-y-2 bg-[#004B40]/5 p-6 rounded-2xl border border-[#004B40]/10">
                <label className="text-[10px] font-bold uppercase text-[#004B40] tracking-widest flex items-center gap-2">
                  <Zap className="w-3 h-3 text-[#FF671F]" /> AI Lab Active Task
                </label>
                <textarea 
                  value={formData.labTask} 
                  onChange={e => setFormData({...formData, labTask: e.target.value})}
                  placeholder="Describe the specific prompt or task the user should complete in the AI sidebar."
                  className="w-full flex min-h-[100px] rounded-xl bg-white border-none p-4 text-sm focus:ring-2 focus:ring-[#FF671F] outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-[#004B40]/60 tracking-widest">Strategic Category</label>
                  <input 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    placeholder="e.g., Academic Innovation"
                    className="w-full flex h-12 rounded-xl bg-muted/30 border-none px-4 text-sm focus:ring-2 focus:ring-[#FF671F] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-[#004B40]/60 tracking-widest">Duration</label>
                  <input 
                    value={formData.duration} 
                    onChange={e => setFormData({...formData, duration: e.target.value})}
                    placeholder="e.g., 45 mins"
                    className="w-full flex h-12 rounded-xl bg-muted/30 border-none px-4 text-sm focus:ring-2 focus:ring-[#FF671F] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-[#004B40]/60 tracking-widest">Resource Link (Video)</label>
                  <input
                    value={formData.videoUrl}
                    onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                    placeholder="Paste share URL — Vimeo, YouTube, Loom, or Drive"
                    className="w-full flex h-12 rounded-xl bg-muted/30 border-none px-4 text-sm focus:ring-2 focus:ring-[#FF671F] outline-none"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Paste any share URL — manage/admin URLs also work. Auto-converts to the embed format on play.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-muted">
                <Button type="submit" className="h-14 px-10 rounded-2xl bg-[#004B40] hover:bg-[#004B40]/90 text-white font-headline font-bold shadow-xl">
                  Push to Catalog
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <h3 className="text-xl font-headline font-bold text-[#004B40] flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-[#FF671F]" /> Deployed Curriculum Inventory
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
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-[#004B40]/5 border border-muted flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-[#004B40]/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h4 className="text-xl font-headline font-bold text-[#004B40] truncate">{module.title}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-[#FF671F]/10 text-[#FF671F] text-[9px] font-bold uppercase tracking-widest">
                        {module.difficulty || 'Foundational'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate font-medium mt-1">{module.description}</p>
                    <div className="flex items-center gap-6 text-[10px] font-bold text-muted-foreground mt-3 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#FF671F]" /> {module.duration || 'N/A'}</span>
                      <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-[#FF671F]" /> {module.videoUrl ? 'Video Connected' : 'No Resource'}</span>
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
            <p className="text-muted-foreground font-medium italic">Client curriculum is empty. Deploy a module to begin.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
