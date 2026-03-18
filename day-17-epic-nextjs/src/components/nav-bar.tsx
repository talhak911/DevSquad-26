"use client";

import { useState } from "react";

export default function NavBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return <>
        <header className="bg-header-bg w-full text-[12px] font-medium leading-[18px]">
            <div className="max-w-[1440px] mx-auto h-[42px] flex items-center justify-between px-[20px] md:px-[60px] lg:px-[100px] xl:px-[181px]">
                <div className="flex items-center h-full w-full justify-between md:justify-start">
                    {/* Logo */}
                    <a href="#" className="mr-[25px] flex-shrink-0">
                        <img
                            className="w-[24px] h-[28.8px]"
                            src="/images/logo.png"
                            alt="logo"
                        />
                    </a>
                    {/* Desktop Nav Links */}
                    <nav className="hidden md:flex items-center h-full space-x-[24px] relative">
                        <a
                            href="#"
                            className="nav-link text-text-active flex items-center justify-center h-full relative transition-colors duration-200"
                        >
                            <span>STORE</span>
                            <span className="nav-indicator absolute bottom-0 w-[calc(100%+14px)] h-[5px] bg-accent-blue" />
                        </a>
                        <a
                            href="#"
                            className="nav-link text-text-muted hover:text-text-active flex items-center justify-center h-full relative transition-colors duration-200"
                        >
                            <span>FAQ</span>
                        </a>
                        <a
                            href="#"
                            className="nav-link text-text-muted hover:text-text-active flex items-center justify-center h-full relative transition-colors duration-200"
                        >
                            <span>HELP</span>
                        </a>
                        <a
                            href="#"
                            className="nav-link text-text-muted hover:text-text-active flex items-center justify-center h-full relative transition-colors duration-200"
                        >
                            <span>UNREAL ENGINE</span>
                        </a>
                    </nav>
                    {/* Mobile Toggle */}
                    <div className="flex items-center justify-end h-full md:hidden flex-grow">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-text-muted hover:text-text-active focus:outline-none cursor-pointer"
                        >
                            <svg
                                className="w-[24px] h-[24px]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                {/* Right Side Actions */}
                <div className="hidden md:flex items-center h-full">
                    <button className="text-text-muted hover:text-text-active h-full flex items-center justify-center px-[22px] lg:px-[32px]">
                        <svg
                            width={20}
                            height={20}
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0 10C0 7.34784 1.05357 4.8043 2.92893 2.92893C4.8043 1.05357 7.34784 0 10 0C12.6522 0 15.1957 1.05357 17.0711 2.92893C18.9464 4.8043 20 7.34784 20 10C20 12.6522 18.9464 15.1957 17.0711 17.0711C15.1957 18.9464 12.6522 20 10 20C7.34784 20 4.8043 18.9464 2.92893 17.0711C1.05357 15.1957 0 12.6522 0 10ZM9.375 1.346C8.537 1.601 7.706 2.371 7.016 3.665C6.789 4.095 6.593 4.541 6.431 5H9.375V1.346ZM5.112 5C5.321 4.336 5.589 3.692 5.912 3.076C6.129 2.668 6.378 2.277 6.659 1.91C5.11025 2.55227 3.77775 3.62452 2.819 5H5.112ZM4.385 9.375C4.423 8.279 4.558 7.227 4.775 6.25H2.092C1.62591 7.23132 1.34778 8.29126 1.272 9.375H4.385ZM6.059 6.25C5.81298 7.27474 5.67125 8.32173 5.636 9.375H9.375V6.25H6.059ZM10.625 6.25V9.375H14.363C14.3281 8.32176 14.1868 7.27476 13.941 6.25H10.625ZM5.638 10.625C5.672 11.678 5.813 12.725 6.058 13.75H9.375V10.625H5.638ZM10.625 10.625V13.75H13.941C14.175 12.794 14.324 11.74 14.364 10.625H10.625ZM6.431 15C6.604 15.483 6.8 15.93 7.016 16.335C7.706 17.629 8.539 18.398 9.375 18.654V15H6.431ZM6.659 18.09C6.37823 17.7226 6.12837 17.3326 5.912 16.924C5.58808 16.308 5.32033 15.6641 5.112 15H2.82C3.77871 16.3755 5.11122 17.4478 6.66 18.09H6.659ZM4.775 13.75C4.54896 12.7226 4.4184 11.6765 4.385 10.625H1.273C1.34784 11.7089 1.62601 12.769 2.093 13.75H4.775ZM13.341 18.09C14.8898 17.4478 16.2223 16.3755 17.181 15H14.887C14.6787 15.6641 14.4109 16.308 14.087 16.924C13.871 17.3326 13.6215 17.7226 13.341 18.09ZM10.625 15V18.654C11.463 18.399 12.294 17.629 12.984 16.335C13.2 15.93 13.396 15.483 13.569 15H10.625ZM15.225 13.75H17.907C18.374 12.769 18.6522 11.7089 18.727 10.625H15.615C15.5816 11.6765 15.4511 12.7226 15.225 13.75ZM18.727 9.375C18.6512 8.29126 18.3731 7.23132 17.907 6.25H15.225C15.442 7.227 15.577 8.279 15.615 9.375H18.728H18.727ZM14.087 3.076C14.397 3.656 14.665 4.301 14.887 5H17.181C16.2223 3.62448 14.8898 2.55222 13.341 1.91C13.614 2.265 13.864 2.657 14.087 3.076ZM13.57 5C13.4079 4.54131 13.2123 4.09512 12.985 3.665C12.295 2.371 11.464 1.602 10.626 1.346V5H13.57Z"
                                fill="#AAAAAA"
                            />
                        </svg>
                    </button>
                    <a
                        href="#"
                        className="flex items-center text-text-muted hover:text-text-active h-full space-x-[8px] justify-center pr-[18px]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-[24px] h-[24px]"
                        >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <span className="tracking-widest text-nowrap">SIGN IN</span>
                    </a>
                    <a
                        href="#"
                        className="bg-accent-blue text-btn-download-text h-full flex items-center justify-center w-[112px] hover:bg-blue-600 transition-colors duration-200 tracking-wide font-medium"
                    >
                        DOWNLOAD
                    </a>
                </div>
            </div>
        </header>

        {/* Mobile Menu */}
        <div
            className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:hidden bg-header-bg border-t border-[rgba(255,255,255,0.1)] flex-col w-full absolute z-50`}
        >
            <nav className="flex flex-col px-5 py-2 space-y-2 text-[12px] font-medium leading-[18px]">
                <a
                    href="#"
                    className="mobile-nav-link text-text-active block py-2 border-b-[2px] border-accent-blue text-left w-max"
                >
                    STORE
                </a>
                <a
                    href="#"
                    className="mobile-nav-link text-text-muted hover:text-text-active block py-2 transition-colors duration-200 text-left w-full border-b-[2px] border-transparent"
                >
                    FAQ
                </a>
                <a
                    href="#"
                    className="mobile-nav-link text-text-muted hover:text-text-active block py-2 transition-colors duration-200 text-left w-full border-b-[2px] border-transparent"
                >
                    HELP
                </a>
                <a
                    href="#"
                    className="mobile-nav-link text-text-muted hover:text-text-active block py-2 transition-colors duration-200 text-left w-full border-b-[2px] border-transparent"
                >
                    UNREAL ENGINE
                </a>
                <div className="flex flex-col border-t border-[rgba(255,255,255,0.1)] pt-2 space-y-2">
                    <a
                        href="#"
                        className="text-text-muted hover:text-text-active py-2 flex items-center space-x-[6px]"
                    >
                        <svg
                            width={20}
                            height={20}
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0 10C0 7.34784 1.05357 4.8043 2.92893 2.92893C4.8043 1.05357 7.34784 0 10 0C12.6522 0 15.1957 1.05357 17.0711 2.92893C18.9464 4.8043 20 7.34784 20 10C20 12.6522 18.9464 15.1957 17.0711 17.0711C15.1957 18.9464 12.6522 20 10 20C7.34784 20 4.8043 18.9464 2.92893 17.0711C1.05357 15.1957 0 12.6522 0 10ZM9.375 1.346C8.537 1.601 7.706 2.371 7.016 3.665C6.789 4.095 6.593 4.541 6.431 5H9.375V1.346ZM5.112 5C5.321 4.336 5.589 3.692 5.912 3.076C6.129 2.668 6.378 2.277 6.659 1.91C5.11025 2.55227 3.77775 3.62452 2.819 5H5.112ZM4.385 9.375C4.423 8.279 4.558 7.227 4.775 6.25H2.092C1.62591 7.23132 1.34778 8.29126 1.272 9.375H4.385ZM6.059 6.25C5.81298 7.27474 5.67125 8.32173 5.636 9.375H9.375V6.25H6.059ZM10.625 6.25V9.375H14.363C14.3281 8.32176 14.1868 7.27476 13.941 6.25H10.625ZM5.638 10.625C5.672 11.678 5.813 12.725 6.058 13.75H9.375V10.625H5.638ZM10.625 10.625V13.75H13.941C14.175 12.794 14.324 11.74 14.364 10.625H10.625ZM6.431 15C6.604 15.483 6.8 15.93 7.016 16.335C7.706 17.629 8.539 18.398 9.375 18.654V15H6.431ZM6.659 18.09C6.37823 17.7226 6.12837 17.3326 5.912 16.924C5.58808 16.308 5.32033 15.6641 5.112 15H2.82C3.77871 16.3755 5.11122 17.4478 6.66 18.09H6.659ZM4.775 13.75C4.54896 12.7226 4.4184 11.6765 4.385 10.625H1.273C1.34784 11.7089 1.62601 12.769 2.093 13.75H4.775ZM13.341 18.09C14.8898 17.4478 16.2223 16.3755 17.181 15H14.887C14.6787 15.6641 14.4109 16.308 14.087 16.924C13.871 17.3326 13.6215 17.7226 13.341 18.09ZM10.625 15V18.654C11.463 18.399 12.294 17.629 12.984 16.335C13.2 15.93 13.396 15.483 13.569 15H10.625ZM15.225 13.75H17.907C18.374 12.769 18.6522 11.7089 18.727 10.625H15.615C15.5816 11.6765 15.4511 12.7226 15.225 13.75ZM18.727 9.375C18.6512 8.29126 18.3731 7.23132 17.907 6.25H15.225C15.442 7.227 15.577 8.279 15.615 9.375H18.728H18.727ZM14.087 3.076C14.397 3.656 14.665 4.301 14.887 5H17.181C16.2223 3.62448 14.8898 2.55222 13.341 1.91C13.614 2.265 13.864 2.657 14.087 3.076ZM13.57 5C13.4079 4.54131 13.2123 4.09512 12.985 3.665C12.295 2.371 11.464 1.602 10.626 1.346V5H13.57Z"
                                fill="#AAAAAA"
                            />
                        </svg>
                        <span>Language</span>
                    </a>
                    <a
                        href="#"
                        className="text-text-muted hover:text-text-active py-2 flex items-center space-x-[6px]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-[20px] h-[20px]"
                        >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <span>SIGN IN</span>
                    </a>
                    <a
                        href="#"
                        className="bg-accent-blue text-btn-download-text text-center py-2 mt-2 rounded font-medium hover:bg-blue-600"
                    >
                        DOWNLOAD
                    </a>
                </div>
            </nav>
        </div>
    </>;
}