'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface EditProfileModalProps {
  onClose: () => void;
  currentBio?: string;
}

export function EditProfileModal({ onClose, currentBio }: EditProfileModalProps) {
  const { user, updateUser } = useAuth();
  const [bio, setBio] = useState(currentBio || '');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('bio', bio);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const res = await api.patch('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // The backend returns the updated user object.
      // Update our context so the nav and other places instantly reflect changes.
      updateUser({ 
        bio: res.data.bio, 
        profilePicture: res.data.profilePicture 
      } as any);
      toast.success('Profile updated!');
      window.location.reload(); // Quick refresh to update the ProfileView data as well (can be optimized later)
      onClose();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-default)] shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 tracking-tight">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Bio</label>
            <textarea
              className="w-full px-3 py-2 bg-[var(--bg-page)] border border-[var(--border-default)] rounded-xl text-[var(--text-body)] placeholder:text-[var(--text-hint)] focus:outline-none focus:ring-2 focus:ring-[var(--border-ring)] transition-shadow resize-none"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
              className="w-full text-sm text-[var(--text-body)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--border-subtle)] file:text-[var(--text-primary)] hover:file:bg-[var(--border-default)] transition-colors"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-page)] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-xl hover:shadow-md transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
