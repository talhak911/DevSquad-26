import React, { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SingleMovieCard from "./SingleMovieCard";
import NewReleaseCard from "./NewReleaseCard";
import PopularTop10Card from "./PopularTop10Card";
import MustWatchCard from "./MustWatchCard";
import TrendingCard from "./TrendingCard";

interface Movie {
  id: string | number;
  title: string;
  image: string;
  duration?: string;
  views?: string;
  releaseDate?: string;
  seasons?: string;
}

interface ContentRowProps {
  title: string;
  movies: Movie[];
  variant?: "standard" | "new-release" | "top-10" | "must-watch" | "trending";
}

const ContentRow: React.FC<ContentRowProps> = ({ 
  title, 
  movies, 
  variant = "standard" 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      const newIndex =
        direction === "left"
          ? Math.max(0, currentIndex - 1)
          : Math.min(Math.ceil(movies.length / 4) - 1, currentIndex + 1); // rough approximation
      setCurrentIndex(newIndex);
    }
  };

  return (
    <section className="w-full">
      {/* Header - gap: 100px between heading and nav from CSS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-[50px] md:gap-[100px]">
        <h2 className="text-[28px] md:text-[38px] font-bold text-text-p">
          {title}
        </h2>

        {/* Navigation Controls - padding: 16px, gap: 16px from CSS */}
        <div className="flex items-center gap-4 bg-[#0F0F0F] p-4 rounded-[12px] border border-[#1F1F1F]">
          <button
            onClick={() => scroll("left")}
            className="w-14 h-14 bg-[#1A1A1A] border border-[#1F1F1F] rounded-[8px] flex items-center justify-center text-text-p hover:bg-[#262626] transition-colors disabled:opacity-50"
          >
            <ArrowLeft size={28} />
          </button>

          {/* Indicators - gap: 3px from CSS */}
          <div className="flex gap-[3px]">
            {[0, 1, 2, 3].map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all ${
                  idx === currentIndex
                    ? "w-[23px] bg-primary"
                    : "w-[16px] bg-[#333333]"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="w-14 h-14 bg-[#1A1A1A] border border-[#1F1F1F] rounded-[8px] flex items-center justify-center text-text-p hover:bg-[#262626] transition-colors disabled:opacity-50"
          >
            <ArrowRight size={28} />
          </button>
        </div>
      </div>

      {/* Cards Carousel - gap: 30px between cards from CSS */}
      <div
        ref={scrollRef}
        className="flex gap-[30px] overflow-x-auto scrollbar-hide mt-[50px]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {movies.map((movie) => {
          if (variant === "top-10") {
            return <PopularTop10Card key={movie.id} title={movie.title} />;
          }
          if (variant === "trending") {
            return (
              <TrendingCard
                key={movie.id}
                title={movie.title}
                image={movie.image}
                duration={movie.duration || "1h 30m"}
                seasons={movie.seasons || "1 Season"}
              />
            );
          }
          if (variant === "must-watch") {
             return (
               <MustWatchCard
                 key={movie.id}
                 title={movie.title}
                 image={movie.image}
                 duration={movie.duration || "1h 30m"}
                 views={movie.views || "2K"}
               />
             );
          }
          if (variant === "new-release") {
            return (
              <NewReleaseCard
                key={movie.id}
                title={movie.title}
                image={movie.image}
                releaseDate={movie.releaseDate || "14 April 2023"}
              />
            );
          }
          return (
            <SingleMovieCard
              key={movie.id}
              title={movie.title}
              image={movie.image}
              duration={movie.duration}
              views={movie.views}
            />
          );
        })}
      </div>
    </section>
  );
};

export default ContentRow;
