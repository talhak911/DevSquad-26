'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import JobCard from '@/components/JobCard';
import { useJobStore } from '@/store/useJobStore';

interface Job {
  id: number;
  company: string;
  logo: string;
  new: boolean;
  featured: boolean;
  position: string;
  role: string;
  level: string;
  postedAt: string;
  contract: string;
  location: string;
  languages: string[];
  tools: string[];
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { filters } = useJobStore();

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('/api/jobs');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    if (filters.length === 0) return true;
    
    const jobTags = [job.role, job.level, ...job.languages, ...job.tools];
    return filters.every((filter: string) => jobTags.includes(filter));
  });

  return (
    <div className="min-h-screen app-container">
      <Header />
      <main className="main-content">
        <FilterBar />
        <div className="container job-list">
          {loading ? (
            <div className="loading">Loading jobs...</div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="no-results">
              No jobs found matching the selected filters.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
