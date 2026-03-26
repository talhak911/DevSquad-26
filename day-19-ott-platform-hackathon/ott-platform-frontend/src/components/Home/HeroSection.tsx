import React from 'react';
import { Play } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full h-[800px] flex items-center justify-center overflow-hidden">
      {/* Background with fading gradients and images */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-cover bg-center opacity-30" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop)' }}></div>
        {/* Gradients */}
        <div className="absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-bg-custom to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-bg-custom to-transparent"></div>
      </div>

      {/* Abstract Design - Play Button Background */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 z-0 pointer-events-none">
         <div className="w-[300px] h-[300px] md:w-[470px] md:h-[470px] rounded-full border-[20px] border-border-custom blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="w-full max-w-[1920px] mx-auto px-[15px] laptop:px-[80px] desktop:px-[162px] relative z-10 flex flex-col items-center text-center mt-20">
        <h1 className="text-[28px] md:text-[58px] font-bold text-text-p mb-4 tracking-tight">
          The Best Streaming Experience
        </h1>
        <p className="text-[14px] md:text-[18px] text-text-s font-normal max-w-[1000px] mb-10 leading-[150%]">
          StreamVibe is the best streaming experience for watching your favorite movies and shows on demand, anytime, anywhere. With StreamVibe, you can enjoy a wide variety of content, including the latest blockbusters, classic movies, popular TV shows, and more. You can also create your own watchlists, so you can easily find the content you want to watch.
        </p>
        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-text-p font-semibold text-[18px] rounded-[8px] hover:bg-red-700 transition-colors">
          <Play fill="currentColor" size={24} />
          Start Watching Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
