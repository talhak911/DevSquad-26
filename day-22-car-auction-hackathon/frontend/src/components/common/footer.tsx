"use client";
import { Car } from "lucide-react";

const homeLinks = ["Help Center", "FAQ", "My Account", "My Account"];
const auctionLinks = ["Help Center", "FAQ", "My Account", "My Account"];

export default function Footer() {
    return (
        <footer className="bg-[#2e3d83] w-full pt-[60px]">
            <div className="max-w-[1440px] mx-auto px-[118px] max-lg:px-8 max-sm:px-5 grid grid-cols-[2fr_1fr_1fr_1.6fr] max-lg:grid-cols-2 max-sm:grid-cols-1 gap-10">
                {/* Brand */}
                <div>
                    <a href="/" className="flex items-center gap-2 mb-4">
                        <Car size={28} className="text-[#f9c146]" />
                        <span className="font-[family-name:var(--font-display)] text-[22px] font-bold text-[#e9e9e9]">
                            Car <span className="text-[#f9c146]">Deposit</span>
                        </span>
                    </a>
                    <p className="text-[16px] font-normal text-[#b9b9b9] leading-[19px] mb-6">
                        Lorem ipsum dolor sit amet consectetur. Mauris eu convallis proin turpis pretium donec
                        orci semper. Sit suscipit lacus cras commodo in lectus sed egestas. Mattis egestas sit
                        viverra pretium tincidunt libero.
                    </p>
                    <p className="text-[20px] font-bold text-white tracking-[0.015em] leading-[133%] mb-2">
                        Follow Us
                    </p>
                    <div className="w-[52px] h-[3px] bg-white mb-3.5" />
                    <div className="flex gap-2">
                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="26" height="26" rx="13" fill="#023D95" />
                            <path d="M18 3H15.2727C14.0672 3 12.911 3.50044 12.0586 4.39124C11.2062 5.28204 10.7273 6.49022 10.7273 7.75V10.6H8V14.4H10.7273V22H14.3636V14.4H17.0909L18 10.6H14.3636V7.75C14.3636 7.49804 14.4594 7.25641 14.6299 7.07825C14.8004 6.90009 15.0316 6.8 15.2727 6.8H18V3Z" fill="white" />
                        </svg>
                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="25.7247" height="25.7247" rx="12.8624" fill="#023D95" />
                            <path d="M16.5 6H9.5C7.567 6 6 7.567 6 9.5V16.5C6 18.433 7.567 20 9.5 20H16.5C18.433 20 20 18.433 20 16.5V9.5C20 7.567 18.433 6 16.5 6Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15.9675 12.56C16.0601 13.1841 15.9535 13.8216 15.6629 14.3817C15.3722 14.9418 14.9124 15.396 14.3488 15.6797C13.7851 15.9634 13.1464 16.0621 12.5234 15.9619C11.9004 15.8616 11.3249 15.5675 10.8787 15.1213C10.4325 14.6751 10.1384 14.0996 10.0381 13.4766C9.93786 12.8536 10.0366 12.2149 10.3203 11.6512C10.604 11.0876 11.0582 10.6278 11.6183 10.3371C12.1784 10.0465 12.8159 9.93989 13.4401 10.0325C14.0767 10.1269 14.6662 10.4235 15.1213 10.8787C15.5765 11.3338 15.8731 11.9233 15.9675 12.56Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19.7578 7.96729H19.768" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="26" height="26" rx="13" fill="#023D95" />
                            <path d="M15.8003 10.4209C16.9142 10.4209 17.9826 10.8867 18.7703 11.7158C19.5579 12.5449 20.0005 13.6694 20.0005 14.8419V19.9998H17.2003V14.8419C17.2003 14.4511 17.0528 14.0762 16.7903 13.7999C16.5277 13.5235 16.1716 13.3682 15.8003 13.3682C15.429 13.3682 15.0728 13.5235 14.8103 13.7999C14.5477 14.0762 14.4002 14.4511 14.4002 14.8419V19.9998H11.6001V14.8419C11.6001 13.6694 12.0426 12.5449 12.8303 11.7158C13.618 10.8867 14.6863 10.4209 15.8003 10.4209Z" fill="white" />
                            <path d="M8.80012 11.158H6V20H8.80012V11.158Z" fill="white" />
                            <path d="M7.40006 8.94735C8.17329 8.94735 8.80012 8.28756 8.80012 7.47367C8.80012 6.65979 8.17329 6 7.40006 6C6.62683 6 6 6.65979 6 7.47367C6 8.28756 6.62683 8.94735 7.40006 8.94735Z" fill="white" />
                        </svg>
                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="26" height="26" rx="13" fill="#023D95" />
                            <path d="M15.8003 10.4209C16.9142 10.4209 17.9826 10.8867 18.7703 11.7158C19.5579 12.5449 20.0005 13.6694 20.0005 14.8419V19.9998H17.2003V14.8419C17.2003 14.4511 17.0528 14.0762 16.7903 13.7999C16.5277 13.5235 16.1716 13.3682 15.8003 13.3682C15.429 13.3682 15.0728 13.5235 14.8103 13.7999C14.5477 14.0762 14.4002 14.4511 14.4002 14.8419V19.9998H11.6001V14.8419C11.6001 13.6694 12.0426 12.5449 12.8303 11.7158C13.618 10.8867 14.6863 10.4209 15.8003 10.4209Z" fill="white" />
                            <path d="M8.80012 11.158H6V20H8.80012V11.158Z" fill="white" />
                            <path d="M7.40006 8.94735C8.17329 8.94735 8.80012 8.28756 8.80012 7.47367C8.80012 6.65979 8.17329 6 7.40006 6C6.62683 6 6 6.65979 6 7.47367C6 8.28756 6.62683 8.94735 7.40006 8.94735Z" fill="white" />
                        </svg>

                    </div>
                </div>

                {/* Home */}
                <div>
                    <h4 className="text-[20px] font-bold text-[#e9e9e9] mb-5">Home</h4>
                    <ul className="flex flex-col gap-5">
                        {homeLinks.map((l, i) => (
                            <li key={i}>
                                <a href="#" className="text-[20px] font-normal text-white hover:opacity-75 transition-opacity">
                                    {l}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Car Auction */}
                <div>
                    <h4 className="text-[20px] font-bold text-[#e9e9e9] mb-5">Car Auction</h4>
                    <ul className="flex flex-col gap-5">
                        {auctionLinks.map((l, i) => (
                            <li key={i}>
                                <a href="#" className="text-[20px] font-normal text-white hover:opacity-75 transition-opacity">
                                    {l}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* About Us */}
                <div>
                    <h4 className="text-[20px] font-bold text-[#e9e9e9] mb-5">About us</h4>
                    <ul className="flex flex-col gap-6">
                        <li className="flex gap-3.5 items-start">
                            <span className="w-[17px] h-[17px] rounded-full bg-white shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[14px] font-normal text-white text-center">Hot Line Number</p>
                                <p className="text-[14px] font-semibold text-white text-center">+054 211 4444</p>
                            </div>
                        </li>
                        <li className="flex gap-3.5 items-start">
                            <span className="w-[17px] h-[17px] rounded-full bg-white shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[16px] font-medium text-white">
                                    Email Id :{" "}
                                    <a href="mailto:info@cardeposit.com" className="underline">
                                        info@cardeposit.com
                                    </a>
                                </p>
                            </div>
                        </li>
                        <li className="flex gap-3.5 items-start">
                            <span className="w-[17px] h-[17px] rounded-full bg-white shrink-0 mt-0.5" />
                            <p className="text-[12px] font-normal text-white leading-[14px]">
                                Office No 6, SKB Plaza next to Bentley showroom, Umm Al Sheif Street, Sheikh Zayed Road, Dubai, UAE
                            </p>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-[#656565] mt-12" />
            <div className="py-6 text-center">
                <p className="text-[20px] font-medium text-white underline tracking-[0.015em]">
                    Copyright 2022 All Rights Reserved
                </p>
            </div>
        </footer>
    );
}