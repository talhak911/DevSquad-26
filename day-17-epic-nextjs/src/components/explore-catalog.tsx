export default function ExploreCatalog() {
  return (
    <section className="my-[60px] xl:my-[80px] w-full flex flex-col xl:flex-row items-center justify-start gap-[30px] xl:gap-[46px]">
      {/* Visual Content (Frame 221) */}
      <div 
        className="w-full xl:w-[610px] h-[280px] xl:h-[343px] rounded-[10px] bg-cover bg-center flex-shrink-0 bg-surface-dim transition-opacity duration-300 hover:opacity-90 cursor-pointer"
        style={{ backgroundImage: 'url(https://picsum.photos/seed/explorecatalog/610/343)' }}
      ></div>
      
      {/* Text Content (Frame 111) */}
      <div className="flex flex-col items-start w-full xl:w-[547px] gap-[19px]">
        <h2 className="font-normal text-[22px] leading-[33px] text-text-active">
          Explore our Catalog
        </h2>
        <p className="font-normal text-[14px] leading-[21px] text-text-dim w-full max-w-[456px]">
          Browse by genre, features, price, and more to find your next favorite game.
        </p>
      </div>
    </section>
  );
}
