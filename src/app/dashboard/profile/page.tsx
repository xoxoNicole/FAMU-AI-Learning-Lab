
"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { User, ShieldCheck, Mail, Calendar, Key, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [db, user]);

  const { data: profile } = useDoc(userRef);

  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || ''
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user || !profile) return;
    setLoading(true);

    try {
      // Update Auth Profile
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      // Update Firestore
      await updateDoc(doc(db, 'userProfiles', user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        updatedAt: new Date().toISOString()
      });

      toast({ title: "Profile Updated", description: "Your account details have been successfully synchronized." });
    } catch (err) {
      toast({ variant: "destructive", title: "Update Failed", description: "There was an error saving your changes." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10">
      <header>
        <p className="text-[10px] font-bold text-[#FF671F] uppercase tracking-[0.3em]">Account Management</p>
        <h1 className="text-4xl font-headline font-bold text-[#004B40]">Settings</h1>
        <p className="text-muted-foreground font-medium">Manage your profile and institutional access settings.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="border-b border-muted">
              <CardTitle className="text-xl font-headline text-[#004B40]">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">First Name</label>
                    <Input 
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      className="h-12 rounded-xl bg-muted/30 border-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Last Name</label>
                    <Input 
                      value={formData.lastName}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                      className="h-12 rounded-xl bg-muted/30 border-none" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Email Address</label>
                  <Input 
                    value={user?.email || ''} 
                    disabled 
                    className="h-12 rounded-xl bg-muted/20 border-none opacity-60 cursor-not-allowed" 
                  />
                  <p className="text-[9px] text-muted-foreground font-medium italic">Institutional emails are managed by the system administrator.</p>
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#004B40] hover:bg-[#004B40]/90 text-white font-bold h-12 px-8 rounded-xl"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="border-b border-muted">
              <CardTitle className="text-xl font-headline text-[#004B40] flex items-center gap-2">
                <Key className="w-5 h-5 text-[#FF671F]" /> Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <p className="text-sm text-muted-foreground font-medium">Password resets are handled via FAMU institutional security protocols.</p>
              <Button variant="outline" className="rounded-xl h-12 border-[#004B40]/10 text-[#004B40] font-bold">
                Reset Password via Email
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#004B40] text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />
            <h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FF671F]" /> License Status
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1">Tier</p>
                <p className="font-bold text-sm">Limited License</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1">Provisioned</p>
                <p className="font-bold text-sm">2026 Spring/Summer</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
