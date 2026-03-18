"use client";

import { useJobStore } from "@/store/useJobStore";
import Image from "next/image";
import Link from "next/link";

interface JobCardProps {
  job: {
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
  };
}

export default function JobCard({ job }: JobCardProps) {
  const { addFilter } = useJobStore();

  const tags = [job.role, job.level, ...job.languages, ...job.tools];

  return (
    <div className={`job-card ${job.featured ? "featured" : ""}`}>
      <div className="job-info">
        <div className="logo-wrapper">
          <Image
            src={job.logo.replace("./", "/")}
            alt={`${job.company} logo`}
            width={88}
            height={88}
            className="logo"
          />
        </div>
        <div className="details">
          <div className="company-row">
            <span className="company">{job.company}</span>
            <div className="badges">
              {job.new && <span className="badge badge-new">New!</span>}
              {job.featured && (
                <span className="badge badge-featured">Featured</span>
              )}
            </div>
          </div>
          <Link href={`/jobs/${job.id}`} className="position">
            {job.position}
          </Link>
          <div className="meta">
            <span>{job.postedAt}</span>
            <span className="dot"></span>
            <span>{job.contract}</span>
            <span className="dot"></span>
            <span>{job.location}</span>
          </div>
        </div>
      </div>
      <div className="divider"></div>
      <div className="tags">
        {tags.map((tag) => (
          <button key={tag} className="tag" onClick={() => addFilter(tag)}>
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
