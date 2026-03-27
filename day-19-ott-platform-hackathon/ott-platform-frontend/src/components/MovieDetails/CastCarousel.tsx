import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface CastCarouselProps {
  cast: {
    id: string;
    image: string;
  }[];
}

const CastCarousel: React.FC<CastCarouselProps> = ({ cast }) => {
  return (
    <div className="w-full bg-surface border border-border-darker rounded-[12px] p-[24px] xl:p-[40px] flex flex-col gap-[30px] xl:gap-[40px]">
      {/* Header */}
      <div className="flex flex-row items-center justify-between w-full">
        <h3 className="text-text-s font-medium text-[16px] xl:text-[18px]">Cast</h3>
        <div className="flex flex-row gap-[10px] xl:gap-[16px]">
          <button className="w-[44px] h-[44px] xl:w-[56px] xl:h-[56px] rounded-full bg-bg-custom border border-border-darker flex justify-center items-center text-text-p hover:bg-border-darker transition-colors cursor-pointer">
            <ArrowLeft className="w-[20px] h-[20px] xl:w-[28px] xl:h-[28px]" />
          </button>
          <button className="w-[44px] h-[44px] xl:w-[56px] xl:h-[56px] rounded-full bg-bg-custom border border-border-darker flex justify-center items-center text-text-p hover:bg-border-darker transition-colors cursor-pointer">
            <ArrowRight className="w-[20px] h-[20px] xl:w-[28px] xl:h-[28px]" />
          </button>
        </div>
      </div>

      {/* Cast Scrollable Row */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex flex-row gap-[10px] xl:gap-[20px]">
          {cast.map(actor => (
            <div key={actor.id} className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] xl:w-[105px] xl:h-[105px] flex-shrink-0 rounded-[10px] overflow-hidden">
              <img src={actor.image} alt="actor" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CastCarousel;
