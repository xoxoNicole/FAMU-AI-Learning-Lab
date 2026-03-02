"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (auth) {
      // In a prototype, we'll use anonymous sign-in to quickly establish a session
      initiateAnonymousSignIn(auth);
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#004B40] relative overflow-hidden">
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Image 
          src="https://images.unsplash.com/photo-1689686610856-3bcf921eb1f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Campus Background"
          fill
          className="object-cover grayscale"
        />
      </div>

      <div className="z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#FF671F] shadow-2xl mb-6 transform -rotate-3">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-headline font-bold text-white mb-2 tracking-tighter text-shadow-sm">AI Literacy Lab</h1>
          <p className="text-white/70 font-body text-sm uppercase tracking-widest font-bold">Florida A&M University</p>
        </div>

        <Card className="border-none shadow-2xl overflow-hidden rounded-3xl">
          <div className="h-2 bg-[#FF671F]" />
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-headline text-[#004B40]">Faculty Access</CardTitle>
            <CardDescription>Enter your iRattler credentials to enter the lab.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">FAMU Email</label>
                <Input 
                  type="email" 
                  placeholder="firstname.lastname@famu.edu" 
                  className="bg-muted/50 border-none h-12 rounded-xl focus-visible:ring-[#FF671F]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Password</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="bg-muted/50 border-none h-12 rounded-xl focus-visible:ring-[#FF671F]"
                />
              </div>
              
              <Button type="submit" className="w-full h-14 text-lg bg-[#FF671F] hover:bg-[#FF671F]/90 text-white rounded-2xl font-headline font-bold shadow-lg shadow-orange-900/20 mt-2">
                Secure Sign In
              </Button>
            </form>

            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-4 text-muted-foreground font-bold tracking-widest">Or use Workspace</span>
              </div>
            </div>

            <Button onClick={handleSignIn} variant="outline" className="w-full h-12 border-muted hover:bg-muted/50 rounded-xl font-bold text-[#004B40]">
              <Image 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                width={18} 
                height={18} 
                className="mr-3"
              />
              FAMU Google Account
            </Button>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 mt-8 text-white/40 text-xs font-bold uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" />
          <span>Strike from the Top • Enterprise Secure</span>
        </div>
      </div>
    </div>
  );
}