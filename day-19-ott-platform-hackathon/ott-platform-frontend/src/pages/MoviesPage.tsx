import React from "react";
import MovieHeroSection from "../components/Movies/MovieHeroSection";
import CategoriesSection from "../components/Home/CategoriesSection";
import ContentRow from "../components/Movies/ContentRow";
import CTASection from "../components/Home/CTASection";
import Footer from "../components/Footer/Footer";

const mockMovies = [
  {
    id: 1,
    title: "Kantara",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=300&auto=format&fit=crop",
    duration: "2h 30m",
    views: "20K",
    releaseDate: "14 April 2023",
    seasons: "1 Season",
  },
  {
    id: 2,
    title: "Avatar",
    image:
      "https://images.unsplash.com/photo-1489599848827-30998a83c8a9?q=80&w=300&auto=format&fit=crop",
    duration: "3h 12m",
    views: "15.5K",
    releaseDate: "16 Dec 2022",
    seasons: "3 Seasons",
  },
  {
    id: 3,
    title: "The Matrix",
    image:
      "https://images.unsplash.com/photo-1440404809759-8e5777763241?q=80&w=300&auto=format&fit=crop",
    duration: "2h 16m",
    views: "45K",
    releaseDate: "22 Dec 2021",
    seasons: "4 Seasons",
  },
  {
    id: 4,
    title: "Inception",
    image:
      "https://images.unsplash.com/photo-1478720568257-3dab4b4e2f4a?q=80&w=300&auto=format&fit=crop",
    duration: "2h 28m",
    views: "32K",
    releaseDate: "16 July 2010",
    seasons: "2 Seasons",
  },
  {
    id: 5,
    title: "Interstellar",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=300&auto=format&fit=crop",
    duration: "2h 49m",
    views: "80K",
    releaseDate: "7 Nov 2014",
    seasons: "5 Seasons",
  },
];

const MoviesPage: React.FC = () => {
  return (
    <div className="w-full bg-bg-custom flex flex-col items-center">
      {/* Hero Section - top: 170px from CSS */}
      <div className="w-full mt-[40px] desktop:mt-[50px] px-[15px] laptop:px-[80px] desktop:px-[162px]">
        <MovieHeroSection />
      </div>

      {/* Movies Content wrapper - left: 160px from CSS */}
      <div className="w-full max-w-[1920px] mx-auto relative mt-[180px] px-[15px] laptop:px-[80px] desktop:px-[160px]">
        {/* Legend Button - cuts through border with negative margin */}
        <div className="relative z-10 -mb-[30px] ml-0">
          <span className="inline-flex items-center justify-center px-6 py-[10px] bg-primary text-text-p font-semibold text-[20px] rounded-[8px] h-[50px]">
            Movies
          </span>
        </div>
        {/* Main container: padding: 50px, gap: 100px from CSS */}
        <div className="border border-[#262626] rounded-[12px] p-[50px] flex flex-col gap-[100px]">
          <CategoriesSection title="Our Genres" description="" />
          <ContentRow title="Popular Top 10 In Genres" movies={mockMovies} variant="top-10" />
          <ContentRow title="Trending Now" movies={mockMovies} variant="trending" />
          <ContentRow title="New Releases" movies={mockMovies} variant="new-release" />
          <ContentRow title="Must Watch Movies" movies={mockMovies} variant="must-watch" />
        </div>
      </div>

      {/* Shows Content wrapper */}
      <div className="w-full max-w-[1920px] mx-auto relative mt-[200px] px-[15px] laptop:px-[80px] desktop:px-[160px]">
        {/* Legend Button - cuts through border with negative margin */}
        <div className="relative z-10 -mb-[30px] ml-0">
          <span className="inline-flex items-center justify-center px-6 py-[10px] bg-primary text-text-p font-semibold text-[20px] rounded-[8px] h-[50px]">
            Shows
          </span>
        </div>
        {/* Main container: padding: 50px, gap: 100px from CSS */}
        <div className="border border-[#262626] rounded-[12px] p-[50px] flex flex-col gap-[100px]">
          <CategoriesSection title="Our Genres" description="" />
          <ContentRow title="Popular Top 10 In Genres" movies={mockMovies} variant="top-10" />
          <ContentRow title="Trending Now" movies={mockMovies} variant="trending" />
          <ContentRow title="New Releases" movies={mockMovies} variant="new-release" />
          <ContentRow title="Must Watch Shows" movies={mockMovies} variant="must-watch" />
        </div>
      </div>

      <CTASection />
      <Footer />
    </div>
  );
};

export default MoviesPage;
