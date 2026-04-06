"use client";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuctionSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [filters, setFilters] = useState({
        category: searchParams.get("category") || "",
        make: searchParams.get("make") || "",
        model: searchParams.get("model") || "",
        maxPrice: searchParams.get("maxPrice") || "500000",
    });

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (filters.category) params.append("category", filters.category);
        if (filters.make) params.append("make", filters.make);
        if (filters.model) params.append("model", filters.model);
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
        router.push(`/auction?${params.toString()}`);
    };

    return (
        <aside className="w-full bg-[#2E3D83] rounded-[5px] p-0 flex flex-col shadow-lg sticky top-24">
            <div className="bg-[#4658AC] rounded-t-[5px] px-6 py-4 flex items-center gap-3 border-b border-white/10">
                <div className="w-[3px] h-[31px] bg-[#FDB94B]" />
                <h3 className="text-[18px] font-bold text-white tracking-wide uppercase">
                    Filter By
                </h3>
            </div>

            <div className="p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-4 text-white">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold uppercase opacity-60">Category</label>
                        <select 
                            value={filters.category}
                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full h-[40px] bg-transparent border border-[#828BB5] rounded-[2px] px-4 appearance-none text-[14px] font-medium focus:outline-none focus:border-[#F4C23D] cursor-pointer"
                        >
                            <option value="" className="text-black">Any Car Type</option>
                            <option value="Sedan" className="text-black">Sedan</option>
                            <option value="SUV" className="text-black">SUV</option>
                            <option value="Hatchback" className="text-black">Hatchback</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold uppercase opacity-60">Make</label>
                        <select 
                            value={filters.make}
                            onChange={(e) => setFilters(prev => ({ ...prev, make: e.target.value }))}
                            className="w-full h-[40px] bg-transparent border border-[#828BB5] rounded-[2px] px-4 appearance-none text-[14px] font-medium focus:outline-none focus:border-[#F4C23D] cursor-pointer"
                        >
                            <option value="" className="text-black">Any Make</option>
                            <option value="Audi" className="text-black">Audi</option>
                            <option value="BMW" className="text-black">BMW</option>
                            <option value="Porsche" className="text-black">Porsche</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-4 mt-2">
                    <label className="text-xs font-bold uppercase text-white opacity-60">Max Price</label>
                    <input 
                        type="range" 
                        min="1000" 
                        max="500000" 
                        step="1000"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                        className="w-full accent-[#F4C23D] cursor-pointer"
                    />
                    <div className="text-center text-[14px] font-bold text-white tracking-widest mt-1">
                        UP TO: ${Number(filters.maxPrice).toLocaleString()}
                    </div>
                </div>

                <button 
                    onClick={handleFilter}
                    className="w-full h-[50px] bg-[#F4C23D] text-[#000000] text-[18px] font-bold rounded-[3px] hover:bg-[#eab02d] active:scale-[0.98] transition-all uppercase tracking-widest mt-2 shadow-inner"
                >
                    Apply Filter
                </button>
            </div>
        </aside>
    );
}
