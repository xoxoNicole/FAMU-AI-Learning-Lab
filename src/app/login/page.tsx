
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Sparkles, UserPlus, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth, useFirestore, useDoc, useMemoFirebase, useUser } from '@/firebase';
import { doc, increment } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const { user } = useUser();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Prefetch dashboard for instant transition
  useEffect(() => {
    router.prefetch('/dashboard');
  }, [router]);

  // Global redirect: if user is authenticated, move to dashboard immediately
  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const licenseRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'system', 'license');
  }, [db]);

  const { data: licenseConfig, isLoading: licenseLoading } = useDoc(licenseRef);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    setLoading(true);

    const isBuilderDomain = email.toLowerCase().endsWith('@themogulfactory.co');

    try {
      if (isSignUp) {
        if (!isBuilderDomain) {
          const total = licenseConfig?.totalLicenses ?? 3;
          const active = licenseConfig?.activeLicenses ?? 0;

          if (active >= total && total > 0) {
            toast({
              variant: "destructive",
              title: "License Capacity Reached",
              description: "All institutional faculty licenses are currently provisioned."
            });
            setLoading(false);
            return;
          }
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;

        await updateProfile(newUser, {
          displayName: `${firstName} ${lastName}`
        });

        const role = isBuilderDomain ? 'admin' : 'faculty';

        setDocumentNonBlocking(doc(db, 'userProfiles', newUser.uid), {
          id: newUser.uid,
          email: newUser.email,
          firstName,
          lastName,
          role: role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, { merge: true });

        if (role === 'faculty') {
          setDocumentNonBlocking(doc(db, 'system', 'license'), {
            activeLicenses: increment(1),
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }

        toast({ 
          title: "Account Created", 
          description: "Entering the dashboard..." 
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      // Explicit navigation for speed - this solves the "forever spin"
      router.push('/dashboard');
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: err.message || "Failed to authenticate."
      });
      setLoading(false);
    }
  };

  const licensesRemaining = licenseConfig ? Math.max(0, licenseConfig.totalLicenses - licenseConfig.activeLicenses) : 3;

  // Don't show the login form if we're already authenticated
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#004B40]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-white mx-auto opacity-20" />
          <p className="text-[10px] font-bold text-white uppercase tracking-[0.3em] animate-pulse">Entering Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#004B40] relative overflow-hidden p-6">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Image 
          src="https://images.unsplash.com/photo-1689686610856-3bcf921eb1f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Campus Background"
          fill
          className="object-cover grayscale"
          priority
        />
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-[#FF671F] shadow-2xl mb-6 transform -rotate-3">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-headline font-bold text-white mb-2 tracking-tighter leading-none">AI Learning Lab</h1>
          <p className="text-white/70 font-body text-[10px] uppercase tracking-[0.2em] font-bold">FLORIDA A & M UNIVERSITY</p>
          <p className="text-brand-pink font-body text-[8px] uppercase tracking-widest font-bold mt-2">POWERED BY THE AI ACADEMY AT MOGUL SCHOOL</p>
        </div>

        <Card className="border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-white">
          <div className="h-2 bg-[#FF671F]" />
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-3xl font-headline text-[#004B40]">
              {isSignUp ? 'Apply for License' : 'Secure Access'}
            </CardTitle>
            <CardDescription>
              {isSignUp ? 'Registration for the institutional lab.' : 'Enter your credentials to enter the lab.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSignUp && !licenseLoading && licensesRemaining <= 0 && licenseConfig?.totalLicenses > 0 && !email.endsWith('@themogulfactory.co') && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs font-medium">
                  <p className="font-bold uppercase tracking-wider mb-1">Waitlist Active</p>
                  Institutional capacity reached. Contact the administrator for more licenses.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">First Name</label>
                    <input 
                      required
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="Jane" 
                      className="w-full flex h-12 rounded-xl bg-muted/30 border-none px-4 text-sm focus:ring-2 focus:ring-[#FF671F] outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Last Name</label>
                    <input 
                      required
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Doe" 
                      className="w-full flex h-12 rounded-xl bg-muted/30 border-none px-4 text-sm focus:ring-2 focus:ring-[#FF671F] outline-none"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Work Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@university.edu" 
                  className="w-full flex h-12 rounded-xl bg-muted/30 border-none px-4 text-sm focus:ring-2 focus:ring-[#FF671F] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full flex h-12 rounded-xl bg-muted/30 border-none px-4 text-sm focus:ring-2 focus:ring-[#FF671F] outline-none"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 text-lg bg-[#FF671F] hover:bg-[#FF671F]/90 text-white rounded-2xl font-headline font-bold shadow-xl shadow-orange-900/10 mt-4"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : isSignUp ? <><UserPlus className="w-5 h-5 mr-2" /> Register</> : <><LogIn className="w-5 h-5 mr-2" /> Secure Sign In</>}
              </Button>
            </form>

            <div className="flex flex-col gap-4 mt-8">
              <Button 
                variant="ghost" 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#004B40] font-bold text-sm hover:bg-[#004B40]/5 rounded-xl h-12"
              >
                {isSignUp ? 'Already have access? Sign In' : 'Need a license? Apply here'}
              </Button>
              
              <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 border-t border-muted pt-6">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${licensesRemaining > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                  {licenseLoading ? 'Syncing...' : `${licensesRemaining} Slots Available`}
                </div>
                <div className="w-1 h-1 rounded-full bg-muted-foreground/20" />
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Secure Access
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
