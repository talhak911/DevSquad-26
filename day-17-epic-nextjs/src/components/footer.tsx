import { Facebook, Twitter, Youtube, ChevronUp } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-footer-bg text-text-muted mt-[60px]">
      <div className="w-full max-w-[1440px] mx-auto px-[32px] pt-[32px] pb-[60px]">
        
        {/* Social and Up Button (Group 30 / Frame 217) */}
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-[8px]">
            <a href="#" className="w-[32px] h-[32px] flex items-center justify-center text-text-active border border-transparent hover:border-text-active bg-surface-dim rounded-[4px] hover:brightness-110 transition-all">
               <Facebook className="w-[18px] h-[18px]" />
            </a>
            <a href="#" className="w-[32px] h-[32px] flex items-center justify-center text-text-active border border-transparent hover:border-text-active bg-surface-dim rounded-[4px] hover:brightness-110 transition-all">
               <Twitter className="w-[18px] h-[18px]" />
            </a>
            <a href="#" className="w-[32px] h-[32px] flex items-center justify-center text-text-active border border-transparent hover:border-text-active bg-surface-dim rounded-[4px] hover:brightness-110 transition-all">
               <Youtube className="w-[18px] h-[18px]" />
            </a>
          </div>
          <button className="flex items-center justify-center w-[32px] h-[32px] border border-text-active rounded-[4px] text-text-active hover:bg-text-active hover:text-primary transition-colors cursor-pointer">
            <ChevronUp className="w-[20px] h-[20px]" />
          </button>
        </div>

        {/* Links Grid (Frame 216 / 122) */}
        <div className="mt-[64px] flex flex-col gap-[4px] w-full max-w-[682px]">
          <h4 className="font-normal text-[14px] leading-[21px] text-text-dim mb-[8px]">Resource</h4>
          <div className="flex flex-wrap md:flex-nowrap gap-[24px]">
            <div className="flex flex-col gap-[4px] w-[124px]">
              <a href="#" className="font-normal text-[14px] leading-[21px] text-footer-link hover:text-text-active transition-colors">Creator Support</a>
              <a href="#" className="font-normal text-[14px] leading-[21px] text-footer-link hover:text-text-active transition-colors">Published On Epic</a>
              <a href="#" className="font-normal text-[14px] leading-[21px] text-footer-link hover:text-text-active transition-colors">Profession</a>
              <a href="#" className="font-normal text-[14px] leading-[21px] text-footer-link hover:text-text-active transition-colors">Company</a>
            </div>
            <div className="flex flex-col gap-[4px] w-[113px]">
              <a href="#" className="font-normal text-[14px] leading-[21px] text-footer-link hover:text-text-active transition-colors">Fan Work Policy</a>
              <a href="#" className="font-normal text-[14px] leading-[21px] text-footer-link hover:text-text-active transition-colors">User Exp Service</a>
              <a href="#" className="font-normal text-[14px] leading-[21px] text-footer-link hover:text-text-active transition-colors">User Liscence</a>
            </div>
            <div className="flex flex-col gap-[4px] w-[108px]">
              <a href="#" className="font-normal text-[14px] leading-[21px] text-footer-link hover:text-text-active transition-colors">Online Service</a>
              <a href="#" className="font-normal text-[14px] leading-[21px] text-footer-link hover:text-text-active transition-colors">Community</a>
              <a href="#" className="font-normal text-[14px] leading-[21px] text-footer-link hover:text-text-active transition-colors">Epic Newsroom</a>
            </div>
            <div className="flex flex-col gap-[4px] w-[105px]">
              <a href="#" className="font-normal text-[14px] leading-[21px] text-footer-link hover:text-text-active transition-colors">Battle Breakers</a>
              <a href="#" className="font-normal text-[14px] leading-[21px] text-footer-link hover:text-text-active transition-colors">Fortnite</a>
              <a href="#" className="font-normal text-[14px] leading-[21px] text-footer-link hover:text-text-active transition-colors">Infinity Blade</a>
            </div>
            <div className="flex flex-col gap-[4px] w-[136px]">
              <a href="#" className="font-normal text-[14px] leading-[21px] text-footer-link hover:text-text-active transition-colors">Robo Recall</a>
              <a href="#" className="font-normal text-[14px] leading-[21px] text-footer-link hover:text-text-active transition-colors">Shadow Complex</a>
              <a href="#" className="font-normal text-[14px] leading-[21px] text-footer-link hover:text-text-active transition-colors">Unreal Tournament</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-[68px] max-w-[888px]">
          <p className="font-normal text-[14px] leading-[21px] text-text-dim text-justify tracking-wide">
            © 2022, Epic Games, Inc. All rights reserved. Epic, Epic Games, Epic Games logo, Fortnite, Fortnite logo, Unreal, Unreal Engine, Unreal Engine logo, Unreal Tournament ) and the Unreal Tournament logo are trademarks or registered trademarks of Epic Games, Inc. in the United States of America and elsewhere. Other brand or product names are trademarks of their respective owners. Transactions outside the United States are handled through Epic Games International, S.à r.l..
          </p>
        </div>

        {/* Bottom Legal Links & Logo */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-end w-full mt-[24px]">
          <div className="flex flex-row flex-wrap gap-[16px]">
            <a href="#" className="font-normal text-[12px] leading-[18px] text-footer-link hover:text-text-active transition-colors">Terms of Service</a>
            <a href="#" className="font-normal text-[12px] leading-[18px] text-footer-link hover:text-text-active transition-colors">Privacy Policy</a>
            <a href="#" className="font-normal text-[12px] leading-[18px] text-footer-link hover:text-text-active transition-colors">Store Refund Policy</a>
          </div>
          
          <div className="mt-[20px] lg:mt-0 flex gap-4 pr-[4px]">
             <img src="/images/logo.png" alt="Epic Games Logo" className="h-[38px] w-auto opacity-70 hover:opacity-100 transition-opacity cursor-pointer object-contain" />
          </div>
        </div>

      </div>
    </footer>
  );
}
