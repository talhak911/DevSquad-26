import React from 'react';
import { Play, Plus, ThumbsUp, Volume2 } from 'lucide-react';

interface MovieOpenHeroProps {
  movie: {
    title: string;
    description: string;
    image: string;
  };
}

const MovieOpenHero: React.FC<MovieOpenHeroProps> = ({ movie }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-[12px] h-[835px]">
      {/* Background Image */}
      <img
        src={movie.image}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-lighter from-0% via-bg-lighter/40 to-transparent to-100%" />

      {/* Main Container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end items-center pb-[20px] px-[24px] gap-[20px] xl:pb-[30px] xl:px-[40px] xl:gap-[30px] desktop:pb-[40px] desktop:px-[50px] desktop:gap-[50px]">
        {/* Text Container */}
        <div className="flex flex-col items-center w-full px-0 gap-[4px] xl:px-[100px] desktop:px-[150px] max-w-[1494px]">
          <h1 className="font-bold text-center text-text-p text-[28px] xl:text-[34px] desktop:text-[38px]">
            {movie.title}
          </h1>
          <p className="font-medium text-center text-text-s leading-[150%] max-w-[1194px] text-[14px] xl:text-[16px] desktop:text-[18px]">
            {movie.description}
          </p>
        </div>

        {/* Center Buttons Container */}
        <div className="flex flex-row items-center justify-center gap-[10px] md:gap-[16px] desktop:gap-[20px] w-full max-w-[1494px]">
          {/* Play Button */}
          <button className="flex items-center justify-center font-semibold text-text-p rounded-[8px] bg-primary hover:bg-red-700 transition-colors h-[44px] px-[16px] gap-[4px] text-[16px] xl:h-[52px] xl:px-[20px] desktop:h-[56px] desktop:px-[24px] desktop:text-[18px]">
            <Play fill="currentColor" className="w-[20px] h-[20px] xl:w-[24px] xl:h-[24px] desktop:w-[28px] desktop:h-[28px]" />
            Play Now
          </button>

          {/* Icons Container */}
          <div className="flex flex-row items-center gap-[8px] desktop:gap-[10px]">
            <button className="flex items-center justify-center bg-bg-custom border border-border-darker rounded-[8px] text-text-p hover:bg-surface transition-colors w-[44px] h-[44px] xl:w-[48px] xl:h-[48px] desktop:w-[56px] desktop:h-[56px]">
              <Plus className="w-[20px] h-[20px] xl:w-[24px] xl:h-[24px] desktop:w-[28px] desktop:h-[28px]" />
            </button>
            <button className="flex items-center justify-center bg-bg-custom border border-border-darker rounded-[8px] text-text-p hover:bg-surface transition-colors w-[44px] h-[44px] xl:w-[48px] xl:h-[48px] desktop:w-[56px] desktop:h-[56px]">
              <ThumbsUp className="w-[20px] h-[20px] xl:w-[24px] xl:h-[24px] desktop:w-[28px] desktop:h-[28px]" />
            </button>
            <button className="flex items-center justify-center bg-bg-custom border border-border-darker rounded-[8px] text-text-p hover:bg-surface transition-colors w-[44px] h-[44px] xl:w-[48px] xl:h-[48px] desktop:w-[56px] desktop:h-[56px]">
              <Volume2 className="w-[20px] h-[20px] xl:w-[24px] xl:h-[24px] desktop:w-[28px] desktop:h-[28px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieOpenHero;
