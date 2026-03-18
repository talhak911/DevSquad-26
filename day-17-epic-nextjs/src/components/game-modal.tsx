"use client";

import { useGameStore } from "@/store/game-store";
import { X } from "lucide-react";

export default function GameModal() {
  const { isModalOpen, selectedGame, closeModal } = useGameStore();

  if (!isModalOpen || !selectedGame) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity" 
      onClick={closeModal}
    >
      <div 
        className="relative w-full max-w-[600px] bg-search-bg rounded-[10px] overflow-hidden shadow-2xl transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={closeModal}
          className="absolute top-[16px] right-[16px] z-10 w-[32px] h-[32px] flex items-center justify-center rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
        >
          <X className="w-[18px] h-[18px]" strokeWidth={2} />
        </button>
        <div 
          className="w-full h-[250px] sm:h-[300px] bg-cover bg-center bg-surface-dim"
          style={{ backgroundImage: `url(${selectedGame.img})` }}
        />
        <div className="p-[24px] md:p-[32px]">
          <h2 className="text-[24px] md:text-[28px] font-normal leading-[36px] text-text-active mb-[8px]">{selectedGame.title}</h2>
          
          {(selectedGame.subtitle || selectedGame.desc) && (
             <p className="text-text-dim text-[16px] leading-[24px] mb-[24px] font-normal">
               {selectedGame.desc || selectedGame.subtitle}
             </p>
          )}

          <div className="flex items-center gap-[16px]">
             {selectedGame.discount && (
                <div className="px-[12px] h-[32px] flex items-center bg-discount-bg text-white font-normal rounded-[4px] text-[16px]">
                   {selectedGame.discount}
                </div>
             )}
             
             {selectedGame.status && (
                <div className={`px-[12px] h-[32px] flex items-center text-white font-normal rounded-[4px] text-[16px] tracking-wide ${selectedGame.bg || 'bg-black'}`}>
                   {selectedGame.status}
                </div>
             )}

             <div className="flex flex-row items-center gap-[12px] ml-auto">
               {selectedGame.oldPrice && (
                  <span className="text-[16px] text-text-dim line-through">{selectedGame.oldPrice}</span>
               )}
               <span className="text-[20px] font-normal text-text-active">
                  {selectedGame.newPrice || selectedGame.price || (selectedGame.status && selectedGame.status.includes('FREE') ? 'Free' : selectedGame.status) || "Free"}
               </span>
             </div>
          </div>

          <button className="w-full mt-[32px] h-[48px] bg-text-active text-primary rounded-[5px] font-normal text-[16px] hover:brightness-110 transition-all cursor-pointer">
            Get Now
          </button>
        </div>
      </div>
    </div>
  );
}
