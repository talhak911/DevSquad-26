"use client";

import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useGameStore } from '@/store/game-store';

export default function HighlightGrid() {
  const { openModal, highlights, isHighlightsLoading, fetchHighlights } = useGameStore();

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  return (
    <section className="my-[40px] w-full overflow-hidden">
      {isHighlightsLoading ? (
        <div className="flex gap-[16px] overflow-hidden w-full">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col w-[85%] md:w-[353px] flex-shrink-0 animate-pulse">
              <div className="w-full h-[198px] bg-surface-dim rounded-[20px] mb-[15px] xl:mb-[25px]"></div>
              <div className="flex flex-col items-start px-[7px] gap-[7px]">
                <div className="w-[140px] h-[24px] bg-surface-dim rounded-[4px]"></div>
                <div className="w-full h-[16px] bg-surface-dim rounded-[4px]"></div>
                <div className="w-[80%] h-[16px] bg-surface-dim rounded-[4px]"></div>
                <div className="w-[80px] h-[24px] bg-surface-dim rounded-[4px] mt-[8px] xl:mt-[4px]"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Swiper
          slidesPerView={"auto"}
          spaceBetween={16}
          className="w-full"
        >
          {highlights.map((item, i) => (
            <SwiperSlide key={i} className="!w-[85%] md:!w-[353px]">
              <div 
                onClick={() => openModal(item)}
                className="flex flex-col w-full flex-shrink-0 cursor-pointer group"
              >
                <div
                  className="w-full h-[198px] bg-surface-dim rounded-[20px] mb-[15px] xl:mb-[25px] bg-cover bg-center transition-transform duration-300 group-hover:brightness-110"
                  style={{ backgroundImage: `url(${item.img})` }}
                ></div>
                <div className="flex flex-col items-start px-[7px] gap-[7px]">
                  <h3 className="font-normal text-[16px] leading-[24px] text-text-active">{item.title}</h3>
                  <p className="font-normal text-[14px] leading-[21px] text-text-dim w-full max-w-[350px]">
                    {item.desc}
                  </p>
                  <div className="font-normal text-[16px] leading-[24px] text-text-active mt-[8px] xl:mt-[4px]">{item.price}</div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}
