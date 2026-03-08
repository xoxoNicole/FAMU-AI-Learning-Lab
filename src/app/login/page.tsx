"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Sparkles, UserPlus, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, increment } from 'firebase/firestore';
import { setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const licenseRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'system', 'license');
  }, [db]);

  const { data: licenseConfig, isLoading: licenseLoading } = useDoc(licenseRef);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !loading) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [auth, router, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    setLoading(true);

    try {
      if (isSignUp) {
        // License Check
        if (licenseConfig && licenseConfig.activeLicenses >= licenseConfig.totalLicenses) {
          toast({
            variant: "destructive",
            title: "License Capacity Reached",
            description: "No more faculty licenses are available. Contact the administrator."
          });
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`
        });

        // Create the Profile in Firestore (Non-blocking)
        setDocumentNonBlocking(doc(db, 'userProfiles', user.uid), {
          id: user.uid,
          email: user.email,
          firstName,
          lastName,
          role: 'faculty',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, { merge: true });

        // Increment License Count (Non-blocking)
        updateDocumentNonBlocking(doc(db, 'system', 'license'), {
          activeLicenses: increment(1),
          updatedAt: new Date().toISOString()
        });

        toast({ title: "License Registered", description: "Welcome to the Strategic AI Lab." });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: err.message || "Failed to authenticate."
      });
      setLoading(false);
    }
  };

  const licensesRemaining = licenseConfig ? licenseConfig.totalLicenses - licenseConfig.activeLicenses : 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#004B40] relative overflow-hidden p-6">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Image 
          src="https://images.unsplash.com/photo-1689686610856-3bcf921eb1f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Campus Background"
          fill
          className="object-cover grayscale"
          data-ai-hint="university campus"
        />
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#FF671F] shadow-2xl mb-6 transform -rotate-3">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-headline font-bold text-white mb-2 tracking-tighter">AI Literacy Lab</h1>
          <p className="text-white/70 font-body text-sm uppercase tracking-widest font-bold">Florida A&M University</p>
        </div>

        <Card className="border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-white">
          <div className="h-2 bg-[#FF671F]" />
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-3xl font-headline text-[#004B40]">
              {isSignUp ? 'Apply for License' : 'Faculty Access'}
            </CardTitle>
            <CardDescription>
              {isSignUp ? 'Join the strategic laboratory for innovation.' : 'Enter your credentials to enter the lab.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSignUp && !licenseLoading && licensesRemaining <= 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs font-medium">
                  <p className="font-bold uppercase tracking-wider mb-1">Waitlist Active</p>
                  All licenses are provisioned. Contact your administrator.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">First Name</label>
                    <Input 
                      required
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="Jane" 
                      className="bg-muted/30 border-none h-12 rounded-xl focus-visible:ring-[#FF671F]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Last Name</label>
                    <Input 
                      required
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Doe" 
                      className="bg-muted/30 border-none h-12 rounded-xl focus-visible:ring-[#FF671F]"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">FAMU Email</label>
                <Input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@famu.edu" 
                  className="bg-muted/30 border-none h-12 rounded-xl focus-visible:ring-[#FF671F]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Password</label>
                <Input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="bg-muted/30 border-none h-12 rounded-xl focus-visible:ring-[#FF671F]"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={loading || (isSignUp && licensesRemaining <= 0)}
                className="w-full h-14 text-lg bg-[#FF671F] hover:bg-[#FF671F]/90 text-white rounded-2xl font-headline font-bold shadow-xl shadow-orange-900/10 mt-4"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : isSignUp ? <><UserPlus className="w-5 h-5 mr-2" /> Register License</> : <><LogIn className="w-5 h-5 mr-2" /> Secure Sign In</>}
              </Button>
            </form>

            <div className="flex flex-col gap-4 mt-8">
              <Button 
                variant="ghost" 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#004B40] font-bold text-sm hover:bg-[#004B40]/5 rounded-xl h-12"
              >
                {isSignUp ? 'Already have a license? Sign In' : 'Need a license? Apply here'}
              </Button>
              
              <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 border-t border-muted pt-6">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${licensesRemaining > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                  {licenseLoading ? 'Syncing...' : `${licensesRemaining} Licenses Left`}
                </div>
                <div className="w-1 h-1 rounded-full bg-muted-foreground/20" />
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Enterprise Secure
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
