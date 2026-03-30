import React from 'react';
import { useQuery } from '@tanstack/react-query';
import MovieHeroSection from '../components/Movies/MovieHeroSection';
import CategoriesSection from '../components/Home/CategoriesSection';
import ContentRow from '../components/Movies/ContentRow';
import CTASection from '../components/Home/CTASection';
import api from '../lib/axios';

const MoviesPage: React.FC = () => {
  // Fetch Movies Rows
  const { data: moviesTrending = [], isLoading: isTrendingLoading } = useQuery({
    queryKey: ['moviesTrending'],
    queryFn: async () => (await api.get('/movies?category=movie&sortBy=views:desc&limit=10&isPublished=true')).data.results,
  });

  const { data: moviesNew = [], isLoading: isNewLoading } = useQuery({
    queryKey: ['moviesNew'],
    queryFn: async () => (await api.get('/movies?category=movie&sortBy=releaseYear:desc&limit=10&isPublished=true')).data.results,
  });

  const { data: moviesMustWatch = [], isLoading: isMustWatchLoading } = useQuery({
    queryKey: ['moviesMustWatch'],
    queryFn: async () => (await api.get('/movies?category=movie&limit=10&isPublished=true')).data.results,
  });

  // Fetch Shows Rows
  const { data: showsTrending = [], isLoading: isShowsTrendingLoading } = useQuery({
    queryKey: ['showsTrending'],
    queryFn: async () => (await api.get('/movies?category=show&sortBy=views:desc&limit=10&isPublished=true')).data.results,
  });

  const { data: showsNew = [], isLoading: isShowsNewLoading } = useQuery({
    queryKey: ['showsNew'],
    queryFn: async () => (await api.get('/movies?category=show&sortBy=releaseYear:desc&limit=10&isPublished=true')).data.results,
  });

  const { data: showsMustWatch = [], isLoading: isShowsMustWatchLoading } = useQuery({
    queryKey: ['showsMustWatch'],
    queryFn: async () => (await api.get('/movies?category=show&limit=10&isPublished=true')).data.results,
  });

  return (
    <div className="w-full bg-bg-custom flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full mt-[40px] desktop:mt-[50px] px-[15px] laptop:px-[80px] desktop:px-[162px]">
        <MovieHeroSection />
      </div>

      {/* Movies Content wrapper */}
      <div className="w-full max-w-[1920px] mx-auto relative mt-[100px] md:mt-[150px] desktop:mt-[180px] px-[15px] laptop:px-[80px] desktop:px-[160px]">
        <div className="border border-border-darker rounded-[12px] p-[20px] lg:p-[50px] flex flex-col gap-[60px] lg:gap-[100px] relative mt-[30px]">
          {/* Legend Button */}
          <div className="absolute top-[0px] transform -translate-y-1/2 left-[30px] lg:left-[50px] z-10">
            <span className="inline-flex items-center justify-center px-6 py-[10px] bg-primary text-text-p font-semibold text-[18px] md:text-[20px] rounded-[8px] h-[44px] md:h-[50px]">
              Movies
            </span>
          </div>
          
          <CategoriesSection title="Our Genres" description="" showContainer={false} />
          
          <ContentRow title="Popular Top 10 In Genres" movies={moviesTrending.slice(0, 10)} variant="top-10" isLoading={isTrendingLoading} />
          <ContentRow title="Trending Now" movies={moviesTrending} variant="trending" isLoading={isTrendingLoading} />
          <ContentRow title="New Releases" movies={moviesNew} variant="new-release" isLoading={isNewLoading} />
          <ContentRow title="Must Watch Movies" movies={moviesMustWatch} variant="must-watch" isLoading={isMustWatchLoading} />
        </div>
      </div>

      {/* Shows Content wrapper */}
      <div className="w-full max-w-[1920px] mx-auto relative mt-[150px] md:mt-[180px] desktop:mt-[200px] px-[15px] laptop:px-[80px] desktop:px-[160px]">
        <div className="border border-border-darker rounded-[12px] p-[20px] lg:p-[50px] flex flex-col gap-[60px] lg:gap-[100px] relative mt-[30px]">
          {/* Legend Button */}
          <div className="absolute top-[0px] transform -translate-y-1/2 left-[30px] lg:left-[50px] z-10">
            <span className="inline-flex items-center justify-center px-6 py-[10px] bg-primary text-text-p font-semibold text-[18px] md:text-[20px] rounded-[8px] h-[44px] md:h-[50px]">
              Shows
            </span>
          </div>
          
          <CategoriesSection title="Our Genres" description="" showContainer={false} />
          
          <ContentRow title="Popular Top 10 In Genres" movies={showsTrending.slice(0, 10)} variant="top-10" isLoading={isShowsTrendingLoading} />
          <ContentRow title="Trending Now" movies={showsTrending} variant="trending" isLoading={isShowsTrendingLoading} />
          <ContentRow title="New Releases" movies={showsNew} variant="new-release" isLoading={isShowsNewLoading} />
          <ContentRow title="Must Watch Shows" movies={showsMustWatch} variant="must-watch" isLoading={isShowsMustWatchLoading} />
        </div>
      </div>

      <CTASection />
    </div>
  );
};

export default MoviesPage;
