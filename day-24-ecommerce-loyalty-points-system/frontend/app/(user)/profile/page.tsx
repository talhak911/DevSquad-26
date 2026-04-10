'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { 
  User, 
  Mail, 
  Coins, 
  Settings, 
  Save,
  Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  if (!user) return null;

  const handleUpdateProfile = async () => {
    if (!name.trim()) return toast.error('Name cannot be empty');
    setIsLoading(true);
    try {
      await api.patch('/users/profile', { name });
      await refreshUser();
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Points Card */}
      <div className="bg-white p-8 rounded-[40px] border-2 border-gray-50 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
          <Coins className="w-24 h-24" />
        </div>
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs mb-2">Available Loyalty Points</p>
        <div className="flex items-baseline gap-2 mb-6">
          <h3 className="text-5xl font-black text-black">{user.points || 0}</h3>
          <span className="text-sm font-black text-gray-400 uppercase tracking-widest">LP</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div className="bg-black h-full" style={{ width: `${Math.min((user.points || 0) / 10, 100)}%` }} />
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white rounded-[40px] border-2 border-gray-50 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
            <div className="w-2 h-8 bg-black rounded-full" />
            Account Details
          </h3>
          <button 
            onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
            disabled={isLoading}
            className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : (isEditing ? <Save className="w-3 h-3" /> : <Settings className="w-3 h-3" />)}
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
             {isEditing ? (
               <input 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-black/5 focus:border-black outline-none transition-all font-bold"
               />
             ) : (
               <div className="bg-gray-50/50 p-4 rounded-2xl flex items-center gap-4 text-gray-700 font-bold border-2 border-transparent">
                  <User className="w-5 h-5 text-gray-400" />
                  {user.name}
               </div>
             )}
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
             <div className="bg-gray-50/50 p-4 rounded-2xl flex items-center gap-4 text-gray-700 font-bold border-2 border-transparent opacity-60">
                <Mail className="w-5 h-5 text-gray-400" />
                {user.email}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
