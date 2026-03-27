import React from 'react';
import { Play } from 'lucide-react';

const validImages = [
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1489599848827-30998a83c8a9?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1440404809759-8e5777763241?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1478720568257-3dab4b4e2f4a?q=80&w=300&auto=format&fit=crop",
];

const mockImages = [...validImages, ...validImages];

// Duplicate for smooth infinite scroll
const marqueeImages = [...mockImages, ...mockImages];

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-[600px] md:min-h-[860px] desktop:min-h-[1092px] flex flex-col justify-end items-center overflow-hidden bg-bg-custom mt-[0px] md:mt-[-64px] mb-[64px]">
      {/* Background Marquees */}
      <div className="absolute inset-x-0 top-0 h-full flex flex-col gap-[20px] py-[20px] opacity-20 pointer-events-none">
        {/* Row 1 (Left) */}
        <div className="flex flex-row gap-[20px] w-max animate-scroll-left">
          {marqueeImages.map((src, i) => (
            <img key={`r1-${i}`} src={src} className="w-[195px] h-[200px] rounded-[12px] object-cover" alt="movie" />
          ))}
        </div>
        {/* Row 2 (Right) */}
        <div className="flex flex-row gap-[20px] w-max animate-scroll-right">
          {marqueeImages.map((src, i) => (
            <img key={`r2-${i}`} src={src} className="w-[195px] h-[200px] rounded-[12px] object-cover" alt="movie" />
          ))}
        </div>
        {/* Row 3 (Left) */}
        <div className="flex flex-row gap-[20px] w-max animate-scroll-left">
          {marqueeImages.map((src, i) => (
            <img key={`r3-${i}`} src={src} className="w-[195px] h-[200px] rounded-[12px] object-cover" alt="movie" />
          ))}
        </div>
        {/* Row 4 (Right) */}
        <div className="flex flex-row gap-[20px] w-max animate-scroll-right">
          {marqueeImages.map((src, i) => (
            <img key={`r4-${i}`} src={src} className="w-[195px] h-[200px] rounded-[12px] object-cover" alt="movie" />
          ))}
        </div>
      </div>

      {/* Fade Overlays */}
      <div className="absolute top-0 inset-x-0 h-[300px] md:h-[580px] bg-gradient-to-b from-bg-custom to-transparent z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 inset-x-0 h-[300px] md:h-[580px] bg-gradient-to-t from-transparent to-bg-custom z-10 pointer-events-none"></div>

      {/* Center Logo */}
      <div className="absolute top-[35%] xl:top-[38%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <img src="/logo.svg" alt="StreamVibe Logo Background" className="w-[250px] h-[250px] desktop:w-[470px] desktop:h-[470px] opacity-80" />
      </div>

      {/* Bottom Content Container */}
      <div className="relative z-30 w-full max-w-[1920px] mx-auto px-[15px] xl:px-[412px] flex flex-col items-center text-center gap-[30px] md:gap-[50px] pb-[20px] md:pb-[40px]">
        <div className="flex flex-col gap-[14px] items-center">
          <h1 className="text-[32px] md:text-[58px] font-bold text-text-p leading-[150%]">
            The Best Streaming Experience
          </h1>
          <p className="text-[14px] md:text-[18px] text-text-s font-normal max-w-[1096px] leading-[150%]">
            StreamVibe is the best streaming experience for watching your favorite movies and shows on demand, anytime, anywhere. With StreamVibe, you can enjoy a wide variety of content, including the latest blockbusters, classic movies, popular TV shows, and more. You can also create your own watchlists, so you can easily find the content you want to watch.
          </p>
        </div>
        <button className="flex items-center justify-center gap-[4px] px-[24px] py-[18px] bg-primary text-text-p font-semibold text-[18px] rounded-[8px] hover:bg-red-700 transition-colors cursor-pointer h-[64px] min-w-[251px]">
          <Play fill="currentColor" size={28} />
          Start Watching Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
