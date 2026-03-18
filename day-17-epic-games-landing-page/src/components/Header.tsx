'use client';

import React, { useState } from 'react';
import { Menu, X, Globe, User } from 'lucide-react';
import Link from 'next/link';

const NavLinks = [
  { name: 'STORE', href: '#' },
  { name: 'FAQ', href: '#' },
  { name: 'HELP', href: '#' },
  { name: 'UNREAL ENGINE', href: '#' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <header className="bg-header-bg h-[42px] flex items-center justify-between text-[12px] font-medium leading-[18px] sticky top-0 z-50 transition-colors duration-200">
      <div className="flex items-center h-full pl-[16px] w-full justify-between md:justify-start">
        {/* Logo */}
        <Link href="/" className="mr-[25px] flex-shrink-0">
          <svg
            viewBox="0 0 24 24"
            className="w-[24px] h-[28.8px] fill-current text-text-active"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 0L24 4.5V19.5L12 24L0 19.5V4.5L12 0Z" />
          </svg>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center h-full space-x-[24px] relative">
          {NavLinks.map((link, idx) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setActiveIndex(idx)}
              className={`flex items-center justify-center h-full relative transition-colors duration-200 hover:text-text-active ${
                activeIndex === idx ? 'text-text-active' : 'text-text-muted'
              }`}
            >
              <span>{link.name}</span>
              {activeIndex === idx && (
                <span className="absolute bottom-0 w-[calc(100%+14px)] h-[5px] bg-accent-blue" />
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <div className="flex items-center justify-end h-full md:hidden pr-[16px] flex-grow">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-text-muted hover:text-text-active transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="hidden md:flex items-center h-full">
        <button className="text-text-muted hover:text-text-active h-full flex items-center justify-center px-[22px] lg:px-[32px] transition-colors">
          <Globe size={18} />
        </button>

        <Link
          href="#"
          className="flex items-center text-text-muted hover:text-text-active h-full space-x-[8px] justify-center pr-[18px] transition-colors"
        >
          <User size={20} />
          <span className="tracking-widest whitespace-nowrap">SIGN IN</span>
        </Link>

        <button className="bg-accent-blue text-primary-foreground h-full flex items-center justify-center w-[112px] hover:bg-opacity-90 transition-all font-medium tracking-wide">
          DOWNLOAD
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-[42px] left-0 right-0 md:hidden bg-header-bg border-t border-white/10 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col px-4 py-2 space-y-2 text-[12px] font-medium leading-[18px]">
            {NavLinks.map((link, idx) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => {
                  setActiveIndex(idx);
                  setIsOpen(false);
                }}
                className={`block py-2 text-left w-full transition-colors ${
                  activeIndex === idx
                    ? 'text-text-active border-b-2 border-accent-blue w-max'
                    : 'text-text-muted hover:text-text-active'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="flex flex-col border-t border-white/10 pt-2 space-y-2">
              <button className="text-text-muted hover:text-text-active py-2 flex items-center space-x-[6px] transition-colors">
                <Globe size={18} />
                <span>Language</span>
              </button>
              <Link
                href="#"
                className="text-text-muted hover:text-text-active py-2 flex items-center space-x-[6px] transition-colors"
              >
                <User size={20} />
                <span>SIGN IN</span>
              </Link>
              <button className="bg-accent-blue text-primary-foreground text-center py-3 mt-2 rounded-sm font-medium hover:bg-opacity-90 transition-all">
                DOWNLOAD
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
