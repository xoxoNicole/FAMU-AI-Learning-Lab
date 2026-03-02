
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center famu-login-bg relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <Image 
          src="https://images.unsplash.com/photo-1689686610856-3bcf921eb1f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHx1bml2ZXJzaXR5JTIwY2FtcHVzfGVufDB8fHx8MTc3MjM3NTc1OHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Campus Background"
          fill
          className="object-cover"
        />
      </div>

      <div className="z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-headline font-bold text-white mb-2">AI Literacy Lab</h1>
          <p className="text-white/80 font-body">Exclusive Lab for FAMU Faculty Administrators</p>
        </div>

        <Card className="glass-card border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Secure Access</CardTitle>
            <CardDescription>Enter your FAMU credentials to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">FAMU Email</label>
              <Input 
                type="email" 
                placeholder="faculty.member@famu.edu" 
                className="bg-white/50 border-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="bg-white/50 border-primary/20"
              />
            </div>
            
            <Link href="/dashboard" className="block w-full">
              <Button className="w-full h-12 text-lg famu-orange-button rounded-xl font-headline font-semibold">
                Sign In
              </Button>
            </Link>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-primary/40 font-bold">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full h-12 border-primary/20 text-primary hover:bg-primary/5 rounded-xl font-medium">
              <Image 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                width={18} 
                height={18} 
                className="mr-2"
              />
              Google Workspace
            </Button>
          </CardContent>
        </Card>

        <p className="text-center mt-8 text-white/60 text-sm">
          Protected by Platform Security & Regular Audits.
        </p>
      </div>
    </div>
  );
}
