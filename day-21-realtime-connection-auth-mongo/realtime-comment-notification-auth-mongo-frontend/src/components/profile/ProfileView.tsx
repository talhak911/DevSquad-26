'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { EditProfileModal } from './EditProfileModal';
import { User as UserIcon, Calendar, Mail, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface ProfileData {
  _id: string;
  username: string;
  email: string;
  bio: string;
  profilePicture: string;
  followersCount: number;
  followingCount: number;
  createdAt: string;
}

export function ProfileView({ username }: { username: string }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/${username}`);
        setProfile(res.data);
        
        // If logged in, check if we're following this profile
        if (user && res.data._id !== user.id) {
          try {
            const followRes = await api.get(`/users/${res.data._id}/is-following`);
            setIsFollowing(followRes.data.isFollowing);
          } catch (e) {
            console.error('Failed to get follow status');
          }
        }
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username, user]);

  const handleFollowToggle = async () => {
    if (!user) {
      toast.error('Please login to follow users');
      return;
    }
    if (!profile) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await api.delete(`/users/${profile._id}/unfollow`);
        setProfile({ ...profile, followersCount: profile.followersCount - 1 });
        setIsFollowing(false);
        toast.success(`Unfollowed @${profile.username}`);
      } else {
        await api.post(`/users/${profile._id}/follow`);
        setProfile({ ...profile, followersCount: profile.followersCount + 1 });
        setIsFollowing(true);
        toast.success(`Following @${profile.username}`);
      }
    } catch (error) {
      toast.error('Action failed');
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-pulse">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-[var(--border-subtle)]" />
          <div className="space-y-3 flex-1">
            <div className="h-6 bg-[var(--border-subtle)] w-1/3 rounded" />
            <div className="h-4 bg-[var(--border-subtle)] w-1/4 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-20 text-center">
        <p className="text-xl text-[var(--text-muted)]">User not found</p>
      </div>
    );
  }

  const isOwnProfile = user?.id === profile._id || user?.username === profile.username;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-default)] p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Avatar */}
          <div className="shrink-0 relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-[var(--bg-avatar)] border-4 border-[var(--border-default)] flex items-center justify-center shadow-lg">
              {profile.profilePicture ? (
                <img src={profile.profilePicture} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={64} className="text-[var(--text-icon)]" />
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">@{profile.username}</h1>
            
            <div className="flex justify-center md:justify-start gap-3 mt-4 mb-6">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-page-mid)] text-sm font-medium text-[var(--text-secondary)]">
                <span className="text-[var(--text-primary)] font-bold">{profile.followersCount}</span> Followers
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-page-mid)] text-sm font-medium text-[var(--text-secondary)]">
                <span className="text-[var(--text-primary)] font-bold">{profile.followingCount}</span> Following
              </div>
            </div>

            {profile.bio ? (
              <p className="text-[var(--text-body)] mb-6 whitespace-pre-wrap">{profile.bio}</p>
            ) : (
              <p className="text-[var(--text-hint)] italic mb-6">No bio provided yet.</p>
            )}

            <div className="flex flex-col gap-2 text-sm text-[var(--text-muted)] mt-auto border-t border-[var(--border-default)] pt-4">
              {isOwnProfile && (
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Mail size={16} />
                  <span>{profile.email}</span>
                </div>
              )}
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Calendar size={16} />
                <span>Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
            {isOwnProfile ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`w-full md:w-auto px-6 py-2.5 font-semibold rounded-xl transition-all shadow-sm ${
                  isFollowing 
                    ? 'bg-[var(--bg-page)] text-[var(--text-primary)] border border-[var(--border-default)] hover:border-red-500 hover:text-red-500' 
                    : 'bg-[var(--text-primary)] text-[var(--bg-page)] hover:opacity-90'
                }`}
              >
                {followLoading ? 'Wait...' : isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>

        </div>
      </div>

      {isEditing && (
        <EditProfileModal 
          onClose={() => setIsEditing(false)} 
          currentBio={profile.bio} 
        />
      )}
    </div>
  );
}
