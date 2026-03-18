import { Search } from 'lucide-react';

export default function StoreNav() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-[30px] pt-[40px] pb-6 relative z-10 w-full">
      <div className="flex flex-row items-center gap-[8px] px-[12px] py-[10px] w-full md:w-[220.44px] h-[40px] bg-search-bg rounded-[200px]">
        <Search className="w-[18px] h-[18px] text-text-placeholder" />
        <input 
          type="text" 
          placeholder="Search Store" 
          className="bg-transparent border-none outline-none w-full text-[12px] leading-[18px] text-text-placeholder placeholder:text-text-placeholder"
        />
      </div>
      
      <nav className="flex flex-row items-center text-[12px] leading-[18px]">
        <a href="#" className="flex justify-center items-center px-[14px] py-[12px] text-text-active">Discover</a>
        <a href="#" className="flex justify-center items-center px-[14px] py-[12px] text-text-muted hover:text-text-active transition-colors">Browse</a>
        <a href="#" className="flex justify-center items-center px-[14px] py-[12px] text-text-muted hover:text-text-active transition-colors">News</a>
      </nav>
    </div>
  );
}
