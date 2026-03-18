"use client";

import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useGameStore } from '@/store/game-store';

export default function FreeGames() {
  const { openModal, freeGames, isFreeLoading, fetchFreeGames } = useGameStore();

  useEffect(() => {
    fetchFreeGames();
  }, [fetchFreeGames]);

  return (
    <section className="my-[40px] bg-free-games-bg rounded-[4px] px-[20px] md:px-[40px] py-[30px] w-full overflow-hidden">
      <div className="flex justify-between items-center mb-[30px] w-full">
        <div className="flex items-center gap-[10px]">
          <div className="w-[46px] h-[46px] flex flex-col items-center justify-center text-text-active">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 12V22H4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 7H2V12H22V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 22V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-[18px] leading-[27px] font-normal text-text-active mt-1">
            Free Games
          </h2>
        </div>
        <button className="flex items-center justify-center w-[100px] h-[32px] border border-text-active rounded-[4px]  hover:text-primary transition-colors cursor-pointer group">
          <span className="font-normal text-[16px] text-text-active group-hover:text-primary transition-colors leading-[24px]">view More</span>
        </button>
      </div>

      <div className="w-full">
        {isFreeLoading ? (
           <div className="flex gap-[20px] lg:gap-[45px] overflow-hidden w-full">
             {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col min-w-[200px] md:min-w-[220px] w-[220px] flex-shrink-0 animate-pulse">
                   <div className="w-[200px] md:w-[220px] h-[280px] md:h-[315px] bg-surface-dim rounded-[4px]"></div>
                   <div className="w-[140px] h-[20px] bg-surface-dim rounded-[4px] mt-[17px]"></div>
                   <div className="w-[100px] h-[16px] bg-surface-dim rounded-[4px] mt-[8px]"></div>
                </div>
             ))}
           </div>
        ) : (
          <Swiper
            slidesPerView={"auto"}
            spaceBetween={20}
            breakpoints={{
              1024: { spaceBetween: 45 }
            }}
            className="w-full"
          >
            {freeGames.map((game, i) => (
              <SwiperSlide key={i} className="!w-[200px] md:!w-[220px]">
                <div 
                  onClick={() => openModal(game)}
                  className="flex flex-col w-full flex-shrink-0 cursor-pointer group"
                >
                  <div
                    className="w-full h-[280px] md:h-[315px] bg-surface-dim rounded-[4px] relative overflow-hidden bg-cover bg-center transition-transform duration-300 group-hover:brightness-110"
                    style={{ backgroundImage: `url(${game.img})` }}
                  >
                  </div>

                  <h3 className="mt-[17px] font-normal text-[14px] leading-[21px] text-text-active truncate w-full">
                    {game.title}
                  </h3>
                  <p className="mt-[8px] font-normal text-[14px] leading-[21px] text-text-muted">
                    {game.subtitle}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
