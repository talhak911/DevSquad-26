import StoreNav from "@/components/store-nav";
import HeroBanner from "@/components/hero-banner";
import GameCarousel from "@/components/game-carousel";
import HighlightGrid from "@/components/highlight-grid";
import FreeGames from "@/components/free-games";
import GameLists from "@/components/game-lists";
import ExploreCatalog from "@/components/explore-catalog";

export default function Home() {
  return (
    <div className="px-5 md:px-[60px] lg:px-[100px] xl:px-[181px]">
      <StoreNav />
      <main>
        <HeroBanner />
        <GameCarousel title="Games on Sale" />
        <HighlightGrid />
        <FreeGames />
        <GameLists />
        <HighlightGrid />
        <GameCarousel title="Game with Achivements" />
        <ExploreCatalog />
      </main>
    </div>
  );
}
