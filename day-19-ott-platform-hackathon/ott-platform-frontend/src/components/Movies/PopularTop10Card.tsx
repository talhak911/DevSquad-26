import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PopularTop10CardProps {
  title: string;
}

const PopularTop10Card: React.FC<PopularTop10CardProps> = ({ title }) => {
  return (
    <div className="bg-surface border border-border-darker rounded-[12px] p-[30px] flex flex-col gap-[20px] w-[352px] h-[378px] flex-shrink-0 cursor-pointer hover:border-primary transition-colors group relative">
      {/* Image Grid Container */}
      <div className="relative isolate flex flex-col gap-[10px] w-full h-[252px]">
        {/* Row 1 */}
        <div className="flex flex-row gap-[10px] w-full h-[121px]">
          <div className="flex-1 bg-border-darker rounded-[4px] overflow-hidden">
             <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=200&auto=format&fit=crop" alt="movie" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="flex-1 bg-border-darker rounded-[4px] overflow-hidden">
             <img src="https://images.unsplash.com/photo-1489599848827-30998a83c8a9?q=80&w=200&auto=format&fit=crop" alt="movie" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
        {/* Row 2 */}
        <div className="flex flex-row gap-[10px] w-full h-[121px]">
          <div className="flex-1 bg-border-darker rounded-[4px] overflow-hidden">
             <img src="https://images.unsplash.com/photo-1440404809759-8e5777763241?q=80&w=200&auto=format&fit=crop" alt="movie" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="flex-1 bg-border-darker rounded-[4px] overflow-hidden">
             <img src="https://images.unsplash.com/photo-1478720568257-3dab4b4e2f4a?q=80&w=200&auto=format&fit=crop" alt="movie" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
        
        {/* Fade Out Overlay */}
        <div 
          className="absolute inset-x-0 bottom-0 h-full pointer-events-none z-[1]"
          style={{
            background: "linear-gradient(180deg, rgba(26, 26, 26, 0) 0%, var(--color-surface) 100%)"
          }}
        />
      </div>

      {/* Footer Container */}
      <div className="flex items-center justify-between w-full h-[66px] mt-auto relative z-[2]">
        <div className="flex flex-col gap-1 items-start">
           <div className="bg-primary px-[10px] py-[6px] rounded-[5px] flex items-center justify-center">
             <span className="text-white text-[16px] font-semibold leading-none">Top 10 In</span>
           </div>
           <h3 className="text-white text-[20px] font-semibold leading-[150%]">{title}</h3>
        </div>
        <ArrowRight size={30} className="text-white opacity-80 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

export default PopularTop10Card;
