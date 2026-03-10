
"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ShieldCheck, Key, Loader2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pwDialogOpen, setPwDialogOpen] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.next.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError('New passwords do not match.');
      return;
    }
    if (!user || !user.email) return;
    setPwLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, pwForm.current);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, pwForm.next);
      toast({ title: "Password Updated", description: "Your password has been changed successfully." });
      setPwDialogOpen(false);
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setPwError('Current password is incorrect.');
      } else if (err.code === 'auth/too-many-requests') {
        setPwError('Too many attempts. Please try again later.');
      } else {
        setPwError('Something went wrong. Please try again.');
      }
    } finally {
      setPwLoading(false);
    }
  };

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
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      await updateDoc(doc(db, 'userProfiles', user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        updatedAt: new Date().toISOString()
      });

      toast({ title: "Profile Updated", description: "Your account details have been saved." });
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
              <p className="text-sm text-muted-foreground font-medium">Update your password at any time. You will need your current password to make changes.</p>
              <Button
                variant="outline"
                onClick={() => { setPwError(''); setPwForm({ current: '', next: '', confirm: '' }); setPwDialogOpen(true); }}
                className="rounded-xl h-12 border-[#004B40]/10 text-[#004B40] font-bold"
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>

        <Dialog open={pwDialogOpen} onOpenChange={setPwDialogOpen}>
          <DialogContent className="rounded-[2rem] max-w-md">
            <DialogHeader>
              <DialogTitle className="font-headline text-[#004B40] text-xl">Change Password</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleChangePassword} className="space-y-5 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Current Password</label>
                <div className="relative">
                  <Input
                    type={showCurrent ? 'text' : 'password'}
                    value={pwForm.current}
                    onChange={e => setPwForm({ ...pwForm, current: e.target.value })}
                    required
                    className="h-12 rounded-xl bg-muted/30 border-none pr-10"
                  />
                  <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-3 text-muted-foreground">
                    {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">New Password</label>
                <div className="relative">
                  <Input
                    type={showNew ? 'text' : 'password'}
                    value={pwForm.next}
                    onChange={e => setPwForm({ ...pwForm, next: e.target.value })}
                    required
                    className="h-12 rounded-xl bg-muted/30 border-none pr-10"
                  />
                  <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-3 text-muted-foreground">
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Confirm New Password</label>
                <div className="relative">
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    value={pwForm.confirm}
                    onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                    required
                    className="h-12 rounded-xl bg-muted/30 border-none pr-10"
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-3 text-muted-foreground">
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {pwError && <p className="text-sm text-destructive font-medium">{pwError}</p>}
              <DialogFooter className="pt-2">
                <Button type="button" variant="ghost" onClick={() => setPwDialogOpen(false)} className="rounded-xl">Cancel</Button>
                <Button
                  type="submit"
                  disabled={pwLoading}
                  className="bg-[#004B40] hover:bg-[#004B40]/90 text-white font-bold h-12 px-8 rounded-xl"
                >
                  {pwLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {pwLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

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
