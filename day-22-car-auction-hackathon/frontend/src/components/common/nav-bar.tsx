"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Star, Bell, ChevronDown, Menu, X, Car, User, LogOut, Hammer } from "lucide-react";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Car Auction", href: "/auction" },
    { label: "Sell Your Car", href: "/car/sell" },
    { label: "About us", href: "/about" },
    { label: "Contact", href: "/contact" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isHomePage = pathname === "/";
    const isTransparent = isHomePage;

    const handleLogout = () => {
        dispatch(logout());
        router.push("/login");
    };

    return (
        <nav className={`${isTransparent ? "bg-transparent absolute top-10 left-0 right-0" : "bg-[#e8edfa] relative"} w-full z-50 transition-all duration-300`}>
            <div className="max-w-[1440px] mx-auto px-[118px] max-lg:px-8 max-sm:px-5 h-[82px] flex items-center justify-between gap-6">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2 shrink-0">
                    <Image src="/logo.png" alt="Logo" width={165} height={55} style={{ height: "auto" }} />
                </a>

                {/* Desktop links */}
                <ul className="hidden md:flex items-center gap-8 list-none">
                    {navLinks.map((link) => {
                        const active = pathname === link.href;
                        return (
                            <li key={link.label} className="flex flex-col items-center">
                                <a
                                    href={link.href}
                                    className={`text-base whitespace-nowrap ${active
                                        ? `font-bold ${isTransparent ? "text-white" : "text-[#2e3d83]"}`
                                        : `${isTransparent ? "text-gray-200" : "text-[#545677]"} hover:${isTransparent ? "text-white" : "text-[#2e3d83]"} transition-colors font-medium`
                                        }`}
                                >
                                    {link.label}
                                </a>
                                {active && (
                                    <span className={`mt-1 w-4 h-[3px] ${isTransparent ? "bg-[#f9c146]" : "bg-[#2e3d83]"} rounded-[5px]`} />
                                )}
                            </li>
                        );
                    })}
                </ul>

                {/* Actions */}
                <div className={`hidden md:flex items-center gap-3 ${isTransparent ? "text-white" : "text-[#2e3d83]"} min-w-[150px] justify-end`}>
                    {!mounted ? (
                        <div className="h-10 w-24 bg-white/5 animate-pulse rounded-[5px]" />
                    ) : !isAuthenticated ? (
                        <>
                            <p className="mr-2 h-full flex items-center">
                                <button onClick={() => router.push("/login")} className="text-sm font-medium mr-1 text-[#898989] hover:text-[#2e3d83]">Sign in</button>
                                <span className="text-sm font-medium text-[#898989]">or</span>
                            </p>
                            <button 
                                onClick={() => router.push("/register")}
                                className="bg-[#2e3d83] text-white px-5 py-2.5 rounded-[5px] font-medium text-sm hover:opacity-90 transition-all"
                            >
                                Register now
                            </button>
                        </>
                    ) : (
                        <div className="relative">
                            <button 
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-2 font-medium bg-white/10 px-3 py-2 rounded-full hover:bg-white/20 transition-all"
                            >
                                <User size={20} />
                                <span>{user?.firstName}</span>
                                <ChevronDown size={16} />
                            </button>
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-[#2e3d83]">
                                    <button 
                                        onClick={() => { router.push("/my-profile?tab=personal"); setShowProfileMenu(false); }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 border-b border-gray-50"
                                    >
                                        <User size={16} /> My Profile
                                    </button>
                                    <button 
                                        onClick={() => { router.push("/my-profile?tab=my-bids"); setShowProfileMenu(false); }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 border-b border-gray-50"
                                    >
                                        <Hammer size={16} /> My Bids
                                    </button>
                                    <button 
                                        onClick={() => { router.push("/my-profile?tab=my-cars"); setShowProfileMenu(false); }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 border-b border-gray-50"
                                    >
                                        <Car size={16} /> My Cars
                                    </button>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    className={`md:hidden ${isTransparent ? "text-white" : "text-[#2e3d83]"}`}
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden flex flex-col bg-[#e8edfa] border-t border-[#eaecf3] px-5 py-4 gap-3">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={`text-base py-2 border-b border-[#eaecf3] ${pathname === link.href
                                ? "font-bold text-[#2e3d83]"
                                : "font-normal text-[#545677]"
                                }`}
                        >
                            {link.label}
                        </a>
                    ))}
                    {!mounted ? (
                        <div className="h-12 bg-gray-200/50 animate-pulse rounded-md mt-2" />
                    ) : !isAuthenticated ? (
                        <button 
                            onClick={() => { router.push("/login"); setOpen(false); }}
                            className="bg-[#2e3d83] text-white py-3 rounded-md font-bold mt-2"
                        >
                            Login / Register
                        </button>
                    ) : (
                        <button 
                            onClick={handleLogout}
                            className="bg-red-600 text-white py-3 rounded-md font-bold mt-2"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}