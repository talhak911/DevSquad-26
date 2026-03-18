"use client";

import { useEffect } from 'react';
import { useGameStore } from '@/store/game-store';

export default function GameLists() {
  const { openModal, gameLists, isListsLoading, fetchGameLists } = useGameStore();

  useEffect(() => {
    fetchGameLists();
  }, [fetchGameLists]);

  if (isListsLoading) {
    return (
      <section className="my-[40px] w-full flex flex-col xl:flex-row gap-[30px] xl:gap-0 justify-between items-start">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className={`flex flex-col flex-1 w-full xl:w-[353px] ${
              i !== 2 ? 'xl:pr-[30px] xl:border-r border-border-divider' : ''
            } ${
              i !== 0 ? 'xl:pl-[30px]' : ''
            }`}
          >
            <div className="flex justify-between items-center mb-[20px] w-full xl:max-w-[343px]">
              <div className="w-[140px] h-[33px] bg-surface-dim rounded-[4px] animate-pulse"></div>
              <div className="w-[100px] h-[32px] rounded-[5px] border border-[rgba(255,255,255,0.1)] flex items-center justify-center animate-pulse">
                  <div className="w-[60px] h-[16px] bg-surface-dim rounded-[2px]" />
              </div>
            </div>
            <div className="flex flex-col gap-[10px] w-full xl:max-w-[343px]">
              {[...Array(5)].map((_, j) => (
                <div 
                  key={j} 
                  className="flex items-center gap-[12px] h-[85px] w-full rounded-[16px] xl:-ml-[8px] px-[4px] xl:px-[8px] animate-pulse"
                >
                  <div className="w-[60px] h-[80px] rounded-[4px] flex-shrink-0 bg-surface-dim"></div>
                  <div className="flex flex-col items-start w-full pr-[10px] gap-[8px]">
                    <div className="w-[140px] h-[16px] bg-surface-dim rounded-[4px]"></div>
                    <div className="w-[60px] h-[12px] bg-surface-dim rounded-[4px]"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="my-[40px] w-full flex flex-col xl:flex-row gap-[30px] xl:gap-0 justify-between items-start">
      {gameLists.map((list, i) => (
        <div 
          key={i} 
          className={`flex flex-col flex-1 w-full xl:w-[353px] ${
            i !== gameLists.length - 1 ? 'xl:pr-[30px] xl:border-r border-border-divider' : ''
          } ${
            i !== 0 ? 'xl:pl-[30px]' : ''
          }`}
        >
          <div className="flex justify-between items-center mb-[20px] w-full xl:max-w-[343px]">
            <h3 className="font-normal text-[22px] leading-[33px] text-text-active">{list.title}</h3>
            <button className="flex items-center justify-center w-[100px] h-[32px] border border-text-active rounded-[5px] hover:text-primary transition-colors cursor-pointer group">
              <span className="font-normal text-[16px] leading-[24px] text-text-active group-hover:text-primary transition-colors">view more</span>
            </button>
          </div>
          <div className="flex flex-col gap-[10px] w-full xl:max-w-[343px]">
            {list.items.map((item, j) => (
              <div 
                key={j} 
                onClick={() => openModal({ ...item, title: item.name || item.title })}
                className="flex items-center gap-[12px] h-[85px] w-full rounded-[16px] xl:-ml-[8px] hover:bg-list-hover cursor-pointer px-[4px] xl:px-[8px] transition-colors"
                title={item.name || item.title}
              >
                <div 
                  className="w-[60px] h-[80px] rounded-[4px] flex-shrink-0 bg-surface-dim bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.img})` }}
                ></div>
                <div className="flex flex-col items-start w-full pr-[10px] overflow-hidden">
                  <p className="font-normal text-[14px] leading-[21px] text-text-active truncate w-full">
                    {item.name || item.title}
                  </p>
                  <p className="font-normal text-[12px] leading-[18px] text-text-active opacity-80 mt-[2px]">
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
