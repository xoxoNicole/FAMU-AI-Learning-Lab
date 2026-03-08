"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  Lightbulb, 
  ArrowRightLeft,
  Copy,
  Download,
  Save,
  Loader2,
  FileText,
  Check,
  History,
  ChevronDown,
  Clock,
  RotateCcw
} from 'lucide-react';
import { generateStrategicContent } from '@/ai/flows/generate-strategic-content';
import { challengeAssumptionsAndFeedback } from '@/ai/flows/challenge-assumptions-and-feedback';
import { refineContentWithAI } from '@/ai/flows/refine-content-with-ai';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { addDocumentNonBlocking, updateDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';

export function NicoleChat() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [tone, setTone] = useState([50]); // 0: Academic, 100: Visionary
  const [feedback, setFeedback] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);
  
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId');

  const revisionsQuery = useMemoFirebase(() => {
    if (!db || !user || !draftId) return null;
    return query(
      collection(db, 'userProfiles', user.uid, 'outputs', draftId, 'revisions'),
      orderBy('refinementTimestamp', 'desc')
    );
  }, [db, user, draftId]);

  const { data: revisions } = useCollection(revisionsQuery);

  useEffect(() => {
    async function loadDraft() {
      if (draftId && db && user) {
        const draftRef = doc(db, 'userProfiles', user.uid, 'outputs', draftId);
        const snap = await getDoc(draftRef);
        if (snap.exists()) {
          const data = snap.data();
          setOutput(data.content || '');
          setTone([data.currentToneSetting === 'visionary' ? 80 : data.currentToneSetting === 'academic' ? 20 : 50]);
          setInput(data.initialPrompt || '');
        }
      }
    }
    loadDraft();
  }, [draftId, db, user]);

  const saveRevision = (content: string, description: string, isAISuggested: boolean = false) => {
    if (!draftId || !db || !user) return;
    
    const revisionRef = collection(db, 'userProfiles', user.uid, 'outputs', draftId, 'revisions');
    addDocumentNonBlocking(revisionRef, {
      outputId: draftId,
      content,
      appliedRefinementDescription: description,
      refinementTimestamp: new Date().toISOString(),
      isAISuggested
    });

    const draftRef = doc(db, 'userProfiles', user.uid, 'outputs', draftId);
    updateDocumentNonBlocking(draftRef, {
      content: content,
      updatedAt: new Date().toISOString()
    });
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setSaveSuccess(false);
    try {
      const res = await generateStrategicContent({ request: input });
      setOutput(res.draft);
      toast({ title: "Draft Generated", description: "Strategic content is ready for refinement." });
      
      if (draftId) {
        saveRevision(res.draft, "Major re-generation from prompt", true);
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to generate content." });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!output || !db || !user) return;
    setSaving(true);
    try {
      const toneValue = tone[0] > 70 ? 'visionary' : tone[0] < 30 ? 'academic' : 'professional';
      
      if (draftId) {
        const draftRef = doc(db, 'userProfiles', user.uid, 'outputs', draftId);
        updateDocumentNonBlocking(draftRef, {
          title: input.substring(0, 50) || "Untitled Strategic Output",
          content: output,
          currentToneSetting: toneValue,
          updatedAt: new Date().toISOString()
        });
        saveRevision(output, "Manual Save/Checkpoint");
      } else {
        const title = input.length > 40 ? input.substring(0, 40) + "..." : input || "Untitled Strategic Output";
        const newDocRef = doc(collection(db, 'userProfiles', user.uid, 'outputs'));
        const newDocId = newDocRef.id;
        
        setDocumentNonBlocking(newDocRef, {
          id: newDocId,
          userId: user.uid,
          title: title,
          content: output,
          outputType: 'strategic memo',
          status: 'draft',
          initialPrompt: input,
          currentToneSetting: toneValue,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, { merge: true });

        addDocumentNonBlocking(collection(db, 'userProfiles', user.uid, 'outputs', newDocId, 'revisions'), {
          outputId: newDocId,
          content: output,
          appliedRefinementDescription: "Initial AI Generation",
          refinementTimestamp: new Date().toISOString(),
          isAISuggested: true
        });
      }
      setSaveSuccess(true);
      toast({ title: "Output Archived", description: "Successfully saved to your strategic repository." });
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save output." });
    } finally {
      setSaving(false);
    }
  };

  const handleChallenge = async () => {
    if (!output) return;
    setLoading(true);
    try {
      const res = await challengeAssumptionsAndFeedback({ draftedContent: output });
      setFeedback(res);
      toast({ title: "Analysis Complete", description: "Strategic friction identified." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to analyze content." });
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!output) return;
    setLoading(true);
    const toneDescription = tone[0] < 30 ? "more academic and formal" : tone[0] > 70 ? "more visionary and inspiring" : "balanced and direct";
    try {
      const res = await refineContentWithAI({ 
        content: output, 
        instructions: `Refine this content to be ${toneDescription}.` 
      });
      setOutput(res.refinedContent);
      if (draftId) {
        saveRevision(res.refinedContent, `AI Refinement: ${toneDescription}`, true);
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to refine content." });
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = (content: string) => {
    setOutput(content);
    toast({ title: "Revision Restored", description: "Switched to previous strategic state." });
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
        <Card className="glass-card p-6 border-none shadow-none bg-[#004B40]/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#004B40] flex items-center justify-center shrink-0 shadow-lg">
              <Sparkles className="w-6 h-6 text-[#FF671F]" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-[#004B40] uppercase tracking-widest mb-1">Strategic AI Lab</p>
              <p className="text-[#004B40] font-medium leading-relaxed">
                Describe the strategic output we're building today. "Deep breath," and let's find clarity.
              </p>
            </div>
          </div>
        </Card>

        {output && (
          <div className="space-y-6">
            <Card className="glass-card p-8 border-none shadow-2xl rounded-[2.5rem] animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white relative">
              <div className="absolute top-8 right-8 flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowHistory(!showHistory)}
                  className={cn("rounded-full transition-colors", showHistory ? "bg-[#004B40] text-white" : "bg-muted/50 text-[#004B40] hover:bg-muted")}
                >
                  <History className="w-4 h-4" />
                </Button>
              </div>
              <div className="prose prose-green max-w-none">
                <h4 className="text-xl font-headline font-bold text-[#004B40] mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#FF671F]" /> Active Strategic Brief
                </h4>
                <div className="text-[#004B40] leading-relaxed whitespace-pre-wrap font-medium">
                  {output}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-10 pt-8 border-t border-muted">
                <Button onClick={() => {
                  navigator.clipboard.writeText(output);
                  toast({ title: "Copied", description: "Strategy copied to clipboard." });
                }} variant="outline" className="rounded-xl h-12 border-[#004B40]/10 text-[#004B40] font-bold">
                  <Copy className="w-4 h-4 mr-2" /> Copy text
                </Button>
                <Button onClick={handleSave} disabled={saving} variant={saveSuccess ? "secondary" : "default"} className={cn("rounded-xl h-12 font-bold px-8 transition-all", saveSuccess ? "bg-green-600 hover:bg-green-700 text-white" : "bg-[#004B40] hover:bg-[#004B40]/90 text-white shadow-xl shadow-green-900/10")}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : saveSuccess ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  {saveSuccess ? "Archived!" : draftId ? "Save Changes" : "Save to Repository"}
                </Button>
                <Button variant="ghost" className="rounded-xl h-12 text-[#004B40] font-bold">
                  <Download className="w-4 h-4 mr-2" /> Export PDF
                </Button>
              </div>
            </Card>

            {showHistory && revisions && revisions.length > 0 && (
              <Card className="border-none bg-muted/30 rounded-[2.5rem] p-8 animate-in slide-in-from-right-4">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-headline font-bold text-[#004B40] flex items-center gap-2">
                    <History className="w-5 h-5 text-[#FF671F]" /> Antigravity Revision Log
                  </h4>
                  <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)} className="rounded-full h-8 w-8 p-0">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {revisions.map((rev) => (
                    <div 
                      key={rev.id} 
                      className="p-4 rounded-2xl bg-white border border-[#004B40]/5 hover:border-[#FF671F]/20 transition-all hover:shadow-md group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="text-sm font-bold text-[#004B40]">
                            {rev.appliedRefinementDescription}
                          </p>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {rev.refinementTimestamp ? format(new Date(rev.refinementTimestamp), 'MMM d, h:mm a') : 'Recent'}
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRestore(rev.content)}
                          className="rounded-lg h-8 px-3 text-[10px] font-bold uppercase text-[#FF671F] hover:bg-[#FF671F]/10 gap-1.5"
                        >
                          <RotateCcw className="w-3 h-3" /> Restore
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 italic mt-2">"{rev.content.substring(0, 100)}..."</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {feedback && (
          <Card className="border-none bg-[#FF671F]/5 rounded-[2.5rem] p-8 animate-in zoom-in-95 border border-[#FF671F]/10">
            <h4 className="text-xl font-headline font-bold text-[#FF671F] mb-6 flex items-center gap-2">
              <Lightbulb className="w-6 h-6" /> Strategic Friction Points
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF671F]">Structural Weaknesses</p>
                <div className="text-[#004B40] text-sm font-medium leading-relaxed bg-white/50 p-4 rounded-2xl border border-[#FF671F]/10 italic">
                  {feedback.identifiedWeaknesses}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF671F]">Alternative Perspectives</p>
                <div className="text-[#004B40] text-sm font-medium leading-relaxed bg-white/50 p-4 rounded-2xl border border-[#FF671F]/10 italic">
                  {feedback.alternativePerspectives}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-4 bg-white p-6 rounded-[2rem] border border-[#004B40]/10 shadow-2xl shadow-green-900/10">
        <div className="flex gap-3">
          <Textarea 
            placeholder="What should we refine or draft next?" 
            className="flex-1 bg-muted/30 border-none rounded-2xl h-28 focus-visible:ring-[#FF671F] font-medium text-[#004B40]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button 
            onClick={handleGenerate} 
            disabled={loading || !input}
            className="h-28 w-16 bg-[#004B40] hover:bg-[#004B40]/90 text-white rounded-2xl shrink-0 shadow-lg"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </Button>
        </div>

        {output && (
          <div className="space-y-6 pt-4 border-t border-muted">
            <div className="flex items-center gap-8">
              <div className="flex-1 space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-[#004B40] uppercase tracking-widest">
                  <span className="flex items-center gap-1"><History className="w-3 h-3" /> Academic</span>
                  <span className="flex items-center gap-1">Visionary <Sparkles className="w-3 h-3" /></span>
                </div>
                <Slider 
                  value={tone} 
                  onValueChange={setTone} 
                  max={100} 
                  step={1} 
                  className="[&_[role=slider]]:bg-[#FF671F] [&_[role=slider]]:border-white"
                />
              </div>
              <Button 
                onClick={handleRefine}
                disabled={loading}
                className="bg-[#FF671F]/10 hover:bg-[#FF671F]/20 text-[#FF671F] rounded-xl font-bold h-12"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} /> Apply Tone Slider
              </Button>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleChallenge}
                disabled={loading}
                className="flex-1 h-14 bg-[#FF671F] hover:bg-[#FF671F]/90 text-white rounded-2xl font-headline font-bold shadow-xl shadow-orange-900/10"
              >
                <ArrowRightLeft className="w-5 h-5 mr-2" /> Challenge My Assumptions
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
