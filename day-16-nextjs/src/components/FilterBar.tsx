'use client';

import { useJobStore } from '@/store/useJobStore';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function FilterBar() {
  const { filters, removeFilter, clearFilters } = useJobStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || filters.length === 0) return null;

  return (
    <div className="container">
      <div className="filter-bar">
        <div className="filter-tags">
          {filters.map((filter: string) => (
            <div key={filter} className="filter-tag-wrapper">
              <span className="filter-tag-text">{filter}</span>
              <button 
                className="remove-btn" 
                onClick={() => removeFilter(filter)}
                aria-label={`Remove ${filter} filter`}
              >
                <Image src="/images/icon-remove.svg" alt="" width={14} height={14} />
              </button>
            </div>
          ))}
        </div>
        <button className="clear-btn" onClick={clearFilters}>
          Clear
        </button>
      </div>
    </div>
  );
}
