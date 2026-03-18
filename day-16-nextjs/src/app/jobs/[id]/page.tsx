"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Image from "next/image";
import { useJobStore } from "@/store/useJobStore";

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

export default function JobDetails() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addFilter } = useJobStore();

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await fetch(`/api/jobs/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Job not found");
          }
          throw new Error("Failed to fetch job");
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen app-container">
        <Header />
        <main className="main-content">
          <div className="container">
            <div className="loading">Loading job details...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen app-container">
        <Header />
        <main className="main-content">
          <div className="container">
            <div className="error-message">
              <h2>{error || "Job not found"}</h2>
              <button onClick={() => router.push("/")} className="back-btn">
                Back to Jobs
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const tags = [job.role, job.level, ...job.languages, ...job.tools];

  return (
    <div className="min-h-screen app-container">
      <Header />
      <main className="main-content">
        <div className="container">
          <button onClick={() => router.push("/")} className="back-link">
            ← Back to Jobs
          </button>

          <div className="job-details-card">
            <div className="job-details-header">
              <div className="job-details-logo">
                <Image
                  src={job.logo.replace("./", "/")}
                  alt={`${job.company} logo`}
                  width={120}
                  height={120}
                  className="logo-large"
                />
              </div>
              <div className="job-details-info">
                <div className="company-row">
                  <span className="company">{job.company}</span>
                  <div className="badges">
                    {job.new && <span className="badge badge-new">New!</span>}
                    {job.featured && (
                      <span className="badge badge-featured">Featured</span>
                    )}
                  </div>
                </div>
                <h1 className="job-title">{job.position}</h1>
                <div className="meta">
                  <span>{job.postedAt}</span>
                  <span className="dot"></span>
                  <span>{job.contract}</span>
                  <span className="dot"></span>
                  <span>{job.location}</span>
                </div>
              </div>
            </div>

            <div className="job-details-section">
              <h2>Position Details</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Role</span>
                  <span className="detail-value">{job.role}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Level</span>
                  <span className="detail-value">{job.level}</span>
                </div>
              </div>
            </div>

            <div className="job-details-section">
              <h2>Requirements</h2>
              <div className="tags-container">
                <h3>Languages</h3>
                <div className="flex gap-3 items-center">
                  {job.languages.map((lang) => (
                    <button
                      key={lang}
                      className="tag"
                      onClick={() => addFilter(lang)}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                {job.tools.length > 0 && (
                  <>
                    <h3>Tools</h3>
                    <div className="flex gap-3 items-center">
                      {job.tools.map((tool) => (
                        <button
                          key={tool}
                          className="tag"
                          onClick={() => addFilter(tool)}
                        >
                          {tool}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="job-details-section">
              <h2>All Skills</h2>
              <div className="flex items-center gap-3">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    className="tag"
                    onClick={() => addFilter(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="job-details-actions">
              <button className="apply-btn">Apply Now</button>
              <button onClick={() => router.push("/")} className="view-all-btn">
                View All Jobs
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
