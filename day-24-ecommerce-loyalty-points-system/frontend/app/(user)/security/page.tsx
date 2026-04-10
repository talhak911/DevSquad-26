'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  Key,
  Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function SecurityPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Password State
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  if (!user) return null;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.oldPassword || !passwords.newPassword) return toast.error('All fields are required');
    if (passwords.newPassword !== passwords.confirmPassword) return toast.error('Passwords do not match');
    
    setIsLoading(true);
    try {
      await api.patch('/users/change-password', {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      });
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-white rounded-[40px] border-2 border-gray-50 p-8 shadow-sm">
        <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
          <div className="w-2 h-8 bg-black rounded-full" />
          Update Password
        </h3>
        
        <form onSubmit={handleChangePassword} className="max-w-md space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="password" 
                required
                value={passwords.oldPassword}
                onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                className="w-full bg-gray-50 pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all font-bold"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="password" 
                required
                value={passwords.newPassword}
                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                className="w-full bg-gray-50 pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all font-bold"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="password" 
                required
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                className="w-full bg-gray-50 pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all font-bold"
                placeholder="••••••••"
              />
            </div>
          </div>
          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-black hover:bg-gray-800 h-12 uppercase font-black tracking-widest text-[10px] px-8"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save New Password
          </Button>
        </form>
      </div>
    </div>
  );
}
