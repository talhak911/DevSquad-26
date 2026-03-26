import React from "react";
import { Search, Bell } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <nav className="h-[120px] bg-transparent w-full z-50 relative">
      <div className="flex flex-row justify-between items-center px-[15px] laptop:px-[80px] desktop:px-[162px] py-[30px] h-full w-full max-w-[1920px] mx-auto">
        {/* Logo Container */}
        <div className="flex items-center cursor-pointer">
          <img
            src="/logo.png"
            alt="StreamVibe Logo"
            className="w-[116px] h-[35px] laptop:w-[165px] laptop:h-[50px] desktop:w-[199px] desktop:h-[60px]"
          />
        </div>

        {/* Navigation Buttons Container */}
        <div className="hidden xl:flex flex-row items-center pt-[10px] pb-[10px] pl-[10px] pr-[40px] gap-[30px] w-auto h-[75px] bg-bg-custom border-[4px] border-border-custom rounded-[12px]">
          <div className="flex flex-row items-center gap-[10px] h-full px-[10px]">
            <a
              href="/"
              className="flex items-center justify-center px-[24px] py-[14px] bg-surface border border-surface rounded-[8px] text-[18px] font-medium leading-[150%] text-text-p transition-all font-manrope whitespace-nowrap"
            >
              Home
            </a>
            <a
              href="/movies"
              className="flex items-center justify-center px-[24px] py-[14px] text-[18px] font-normal leading-[150%] text-text-s hover:text-text-p transition-all font-manrope whitespace-nowrap"
            >
              Movies & Shows
            </a>
            <a
              href="/support"
              className="flex items-center justify-center px-[24px] py-[14px] text-[18px] font-normal leading-[150%] text-text-s hover:text-text-p transition-all font-manrope whitespace-nowrap"
            >
              Support
            </a>
            <a
              href="/subscriptions"
              className="flex items-center justify-center px-[24px] py-[14px] text-[18px] font-normal leading-[150%] text-text-s hover:text-text-p transition-all font-manrope whitespace-nowrap"
            >
              Subscriptions
            </a>
          </div>
        </div>

        {/* Utilities/Action Icons Container */}
        <div className="flex flex-row items-center gap-[20px] md:gap-[30px]">
          <button className="w-auto h-auto flex items-center justify-center text-text-p transition-opacity hover:opacity-70">
            <Search size={28} className="md:w-[34px] md:h-[34px]" />
          </button>
          <button className="w-auto h-auto flex items-center justify-center text-text-p transition-opacity hover:opacity-70">
            <Bell size={28} className="md:w-[34px] md:h-[34px]" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
