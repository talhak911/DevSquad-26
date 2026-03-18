export default function HeroBanner() {
  const gamesList = [
    { title: "God Of War 4", img: "https://picsum.photos/seed/gow/60/80", active: true },
    { title: "Farcry 6 Golden Edition", img: "https://picsum.photos/seed/fc6/60/80", active: false },
    { title: "GTA V", img: "https://picsum.photos/seed/gta/60/80", active: false },
    { title: "Outlast 2", img: "https://picsum.photos/seed/outlast/60/80", active: false },
  ];

  return (
    <section className="flex flex-col xl:flex-row gap-[16px] xl:gap-[25px] mt-[10px] w-full">
      {/* Main Feature Banner */}
      <div className="relative flex-1 rounded-[20px] overflow-hidden min-h-[350px] md:min-h-[432px] w-full">
        {/* Background placeholder or image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://picsum.photos/seed/gowbg/800/432)' }}
        >
          {/* Gradient overlay to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-banner-grad via-banner-grad/60 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="absolute left-[20px] md:left-[39px] bottom-[30px] md:bottom-auto md:top-[150px] lg:top-[172px] flex flex-col items-start gap-[20px] md:gap-[40px] max-w-[300px] z-10 w-full pr-4">
          <div className="flex flex-col items-start gap-[8px] max-w-[300px]">
            <p className="font-normal text-[12px] leading-[18px] text-white">PRE-PURCHASE AVAILABLE</p>
            <p className="font-normal text-[14px] md:text-[16px] leading-[22px] md:leading-[24px] text-white drop-shadow-md">
              Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive
            </p>
          </div>
          
          <button className="flex flex-row items-center justify-center px-[16px] py-[13px] bg-white rounded-[4px] hover:opacity-80 transition-opacity w-full sm:w-auto">
            <span className="font-normal text-[14px] md:text-[16px] leading-[24px] text-black">PRE-PURCHASE NOW</span>
          </button>
        </div>
      </div>

      {/* Side Menu */}
      <div className="flex flex-col sm:flex-row xl:flex-col items-center xl:items-start gap-[10px] xl:gap-[3px] w-full xl:w-[256px] min-w-[256px] overflow-x-auto xl:overflow-visible pb-2 xl:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {gamesList.map((game, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-start px-[16px] py-[13px] gap-[10px] min-w-[200px] xl:w-[256px] h-auto xl:h-[105.5px] rounded-[16px] cursor-pointer transition-colors ${game.active ? 'bg-list-active' : 'bg-search-bg xl:bg-transparent hover:bg-list-hover'}`}
          >
            <div className="flex flex-row items-center gap-[16px] w-full">
              <div 
                className="w-[60px] h-[80px] rounded-[8px] bg-cover bg-center bg-surface-dim flex-shrink-0"
                style={{ backgroundImage: `url(${game.img})` }}
              ></div>
              <div className="font-normal text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-text-active line-clamp-2">
                {game.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
