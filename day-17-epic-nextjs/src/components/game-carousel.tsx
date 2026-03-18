"use client";

import { useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { useGameStore } from '@/store/game-store';

export default function GameCarousel({ title }: { title: string }) {
  const { openModal, carouselGames, isCarouselLoading, fetchCarouselGames } = useGameStore();
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    fetchCarouselGames();
  }, [fetchCarouselGames]);

  return (
    <section className="my-[40px] w-full overflow-hidden">
      <div className="flex justify-between items-center mb-[20px]">
        <h2 className="text-[18px] leading-[27px] font-normal text-text-active flex items-center gap-[4px] cursor-pointer group">
          {title}
          <div className="flex items-center justify-center p-[2px] mt-[1px] group-hover:underline">
             <ChevronRight className="w-[16px] h-[16px]" strokeWidth={2} />
          </div>
        </h2>
        <div className="flex gap-[8px]">
          <button onClick={() => swiperRef.current?.slidePrev()} className="w-[30px] h-[30px] rounded-full bg-search-bg flex items-center justify-center text-text-active hover:bg-list-hover transition-colors cursor-pointer">
            <ChevronLeft className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </button>
          <button onClick={() => swiperRef.current?.slideNext()} className="w-[30px] h-[30px] rounded-full bg-search-bg flex items-center justify-center text-text-active hover:bg-list-hover transition-colors cursor-pointer">
            <ChevronRight className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div className="w-full">
        {isCarouselLoading ? (
          <div className="flex gap-[20px] overflow-hidden w-full">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-[10px] w-[200px] flex-shrink-0 animate-pulse">
                <div className="w-[200px] h-[284px] rounded-[4px] bg-surface-dim"></div>
                <div className="flex flex-col items-start gap-[10px] w-full mt-[4px]">
                  <div className="w-[140px] h-[20px] bg-surface-dim rounded-[4px]"></div>
                  <div className="w-[80px] h-[24px] bg-surface-dim rounded-[4px]"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            slidesPerView={"auto"}
            spaceBetween={20}
            className="w-full pb-[4px]"
          >
            {carouselGames.map((game, i) => (
              <SwiperSlide key={i} className="!w-[200px]">
                <div onClick={() => openModal(game)} className="flex flex-col gap-[10px] w-full flex-shrink-0 group cursor-pointer">
                  <div 
                    className="w-[200px] h-[284px] rounded-[4px] bg-cover bg-center bg-surface-dim transition-transform duration-300 group-hover:brightness-110"
                    style={{ backgroundImage: `url(${game.img})` }}
                  >
                  </div>
                  
                  <div className="flex flex-col items-start gap-[10px] w-full">
                    <p className="font-normal text-[16px] leading-[24px] text-text-active truncate w-full pt-[4px]">{game.title}</p>
                    
                    {game.discount ? (
                      <div className="flex flex-row items-center gap-[8px]">
                        <div className="flex flex-row items-center px-[8px] h-[24px] bg-discount-bg rounded-[4px]">
                          <span className="font-normal text-[16px] leading-[24px] text-white">{game.discount}</span>
                        </div>
                        <div className="flex flex-row items-center gap-[8px]">
                          <span className="font-normal text-[16px] leading-[24px] text-text-dim line-through">{game.oldPrice}</span>
                          <span className="font-normal text-[16px] leading-[24px] text-text-active">{game.newPrice}</span>
                        </div>
                      </div>
                    ) : (
                       <div className="flex flex-row items-center gap-[8px]">
                          <span className="font-normal text-[16px] leading-[24px] text-text-active">{game.newPrice}</span>
                       </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
