import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface JobState {
  filters: string[];
  isDarkMode: boolean;
  addFilter: (filter: string) => void;
  removeFilter: (filter: string) => void;
  clearFilters: () => void;
  toggleDarkMode: () => void;
}

export const useJobStore = create<JobState>()(
  persist(
    (set) => ({
      filters: [],
      isDarkMode: false,
      addFilter: (filter: string) =>
        set((state: JobState) => ({
          filters: state.filters.includes(filter)
            ? state.filters
            : [...state.filters, filter],
        })),
      removeFilter: (filter: string) =>
        set((state: JobState) => ({
          filters: state.filters.filter((f: string) => f !== filter),
        })),
      clearFilters: () => set({ filters: [] }),
      toggleDarkMode: () => set((state: JobState) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'job-storage',
    }
  )
);
