
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
  Check
} from 'lucide-react';
import { generateStrategicContent } from '@/ai/flows/generate-strategic-content';
import { challengeAssumptionsAndFeedback } from '@/ai/flows/challenge-assumptions-and-feedback';
import { refineContentWithAI } from '@/ai/flows/refine-content-with-ai';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';

export function NicoleChat() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [tone, setTone] = useState([50]); // 0: Academic, 100: Visionary
  const [feedback, setFeedback] = useState<any>(null);
  
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId');

  // Load draft if ID is present
  useEffect(() => {
    async function loadDraft() {
      if (draftId && db && user) {
        const draftRef = doc(db, 'users', user.uid, 'drafts', draftId);
        const snap = await getDoc(draftRef);
        if (snap.exists()) {
          const data = snap.data();
          setOutput(data.content);
          setTone([data.tone || 50]);
          setInput(data.title || '');
        }
      }
    }
    loadDraft();
  }, [draftId, db, user]);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setSaveSuccess(false);
    try {
      const res = await generateStrategicContent({ request: input });
      setOutput(res.draft);
      toast({ title: "Draft Generated", description: "Your strategic content is ready for refinement." });
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
      if (draftId) {
        // Update existing
        const draftRef = doc(db, 'users', user.uid, 'drafts', draftId);
        await updateDoc(draftRef, {
          content: output,
          updatedAt: new Date().toISOString(),
          tone: tone[0]
        });
      } else {
        // Create new
        const title = input.length > 40 ? input.substring(0, 40) + "..." : input || "Untitled Strategic Content";
        await addDoc(collection(db, 'users', user.uid, 'drafts'), {
          title: title,
          content: output,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tone: tone[0],
          type: "AI Draft"
        });
      }
      setSaveSuccess(true);
      toast({ title: "Saved", description: "Your work has been saved to My Drafts." });
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save draft." });
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
      toast({ title: "Analysis Complete", description: "The AI has identified areas for improvement." });
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
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to refine content." });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Copied", description: "Content copied to clipboard." });
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex-1 overflow-y-auto space-y-6 pr-4">
        <Card className="glass-card p-6 border-none shadow-none bg-white/40">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-headline font-bold text-primary mb-2">AI Literacy Lab</p>
              <p className="text-muted-foreground leading-relaxed">
                Describe the strategic content you need (e.g., "Draft a memo to the board about budget allocations for digital transformation").
              </p>
            </div>
          </div>
        </Card>

        {output && (
          <Card className="glass-card p-8 border-none shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="prose prose-blue max-w-none">
              <h4 className="font-headline font-bold text-primary mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" /> {draftId ? 'Editing Draft' : 'Generated Draft'}
              </h4>
              <div className="text-foreground leading-relaxed whitespace-pre-wrap font-body">
                {output}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-primary/5">
              <Button onClick={copyToClipboard} variant="outline" size="sm" className="rounded-lg h-9">
                <Copy className="w-4 h-4 mr-2" /> Copy
              </Button>
              <Button onClick={handleSave} disabled={saving} variant={saveSuccess ? "secondary" : "outline"} size="sm" className="rounded-lg h-9 transition-all">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : saveSuccess ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {saveSuccess ? "Saved!" : "Save to My Drafts"}
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg h-9">
                <Download className="w-4 h-4 mr-2" /> PDF
              </Button>
            </div>
          </Card>
        )}

        {feedback && (
          <Card className="glass-card p-6 border-none bg-accent/5 animate-in zoom-in-95">
            <h4 className="font-headline font-bold text-accent mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" /> Strategic Insights
            </h4>
            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <p className="font-bold text-primary mb-1">Identified Weaknesses:</p>
                <p className="text-muted-foreground">{feedback.identifiedWeaknesses}</p>
              </div>
              <div>
                <p className="font-bold text-primary mb-1">Alternative Perspectives:</p>
                <p className="text-muted-foreground">{feedback.alternativePerspectives}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-4 bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/40 shadow-xl">
        <div className="flex gap-2">
          <Textarea 
            placeholder="What should we draft together?" 
            className="flex-1 bg-white border-none rounded-2xl h-24 focus-visible:ring-accent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button 
            onClick={handleGenerate} 
            disabled={loading || !input}
            className="h-24 w-16 bg-primary hover:bg-primary/90 rounded-2xl shrink-0"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </Button>
        </div>

        {output && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs font-bold text-primary uppercase">
                  <span>Tone: Academic</span>
                  <span>Visionary</span>
                </div>
                <Slider 
                  value={tone} 
                  onValueChange={setTone} 
                  max={100} 
                  step={1} 
                  className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-white"
                />
              </div>
              <Button 
                onClick={handleRefine}
                disabled={loading}
                variant="secondary" 
                className="bg-accent/10 hover:bg-accent/20 text-accent rounded-xl"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} /> Refine Tone
              </Button>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleChallenge}
                disabled={loading}
                className="flex-1 h-12 bg-accent hover:bg-accent/90 text-white rounded-xl font-headline"
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
