import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Bell } from "lucide-react";

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="h-[120px] bg-transparent w-full z-50 relative">
      <div className="flex flex-row justify-between items-center px-[15px] laptop:px-[80px] desktop:px-[162px] py-[30px] h-full w-full max-w-[1920px] mx-auto">
        {/* Logo Container */}
        <Link to="/" className="flex items-center cursor-pointer">
          <img
            src="/logo.png"
            alt="StreamVibe Logo"
            className="w-[116px] h-[35px] laptop:w-[165px] laptop:h-[50px] desktop:w-[199px] desktop:h-[60px]"
          />
        </Link>

        {/* Navigation Buttons Container */}
        <div className="hidden xl:flex flex-row items-center pt-[10px] pb-[10px] pl-[10px] pr-[40px] gap-[30px] w-auto h-[75px] bg-bg-custom border-[4px] border-border-custom rounded-[12px]">
          <div className="flex flex-row items-center gap-[10px] h-full px-[10px]">
            <Link
              to="/"
              className={`flex items-center justify-center px-[24px] py-[14px] text-[18px] font-medium leading-[150%] transition-all font-manrope whitespace-nowrap rounded-[8px] ${
                isActive("/")
                  ? "bg-surface border border-surface text-text-p"
                  : "text-text-s hover:text-text-p"
              }`}
            >
              Home
            </Link>
            <Link
              to="/movies"
              className={`flex items-center justify-center px-[24px] py-[14px] text-[18px] font-medium leading-[150%] transition-all font-manrope whitespace-nowrap rounded-[8px] ${
                isActive("/movies")
                  ? "bg-surface border border-surface text-text-p"
                  : "text-text-s hover:text-text-p"
              }`}
            >
              Movies & Shows
            </Link>
            <Link
              to="/support"
              className={`flex items-center justify-center px-[24px] py-[14px] text-[18px] font-medium leading-[150%] transition-all font-manrope whitespace-nowrap rounded-[8px] ${
                isActive("/support")
                  ? "bg-surface border border-surface text-text-p"
                  : "text-text-s hover:text-text-p"
              }`}
            >
              Support
            </Link>
            <Link
              to="/subscriptions"
              className={`flex items-center justify-center px-[24px] py-[14px] text-[18px] font-medium leading-[150%] transition-all font-manrope whitespace-nowrap rounded-[8px] ${
                isActive("/subscriptions")
                  ? "bg-surface border border-surface text-text-p"
                  : "text-text-s hover:text-text-p"
              }`}
            >
              Subscriptions
            </Link>
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
