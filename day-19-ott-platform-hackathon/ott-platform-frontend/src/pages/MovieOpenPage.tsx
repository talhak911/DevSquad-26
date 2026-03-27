import React from 'react';
import { useParams } from 'react-router-dom';
import MovieOpenHero from '../components/MovieDetails/MovieOpenHero';
import MovieDescription from '../components/MovieDetails/MovieDescription';
import CastCarousel from '../components/MovieDetails/CastCarousel';
import ReviewsSection from '../components/MovieDetails/ReviewsSection';
import MovieInfoSidebar from '../components/MovieDetails/MovieInfoSidebar';
import CTASection from '../components/Home/CTASection';
import Footer from '../components/Footer/Footer';

// Mock Data
const mockMovie = {
  id: "1",
  title: "Kantara",
  description: "A fiery young man clashes with an unflinching forest officer in a south Indian village where spirituality, fate and folklore rule the lands.",
  image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1920&auto=format&fit=crop"
};

const mockDescription = "A fiery young man clashes with an unflinching forest officer in a south Indian village where spirituality, fate and folklore rule the lands.";

const mockCast = [
  { id: "1", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200" },
  { id: "2", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" },
  { id: "3", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200" },
  { id: "4", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" },
  { id: "5", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200" },
  { id: "6", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200" },
  { id: "7", image: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=200" },
  { id: "8", image: "https://images.unsplash.com/photo-1488161628813-04466f872507?w=200" }
];

const mockReviews = [
  {
    id: "1",
    name: "Aniket Roy",
    from: "India",
    rating: 4.5,
    content: "This movie was recommended to me by a very dear friend who went for the movie by herself. I went to the cinemas to watch but had a houseful board so couldn't watch it."
  },
  {
    id: "2",
    name: "Swaraj",
    from: "India",
    rating: 5,
    content: "A restless king promises his lands to the local tribals in exchange of a stone (Panjurli, a deity of Keradi Village) wherein he finds solace and peace of mind."
  }
];

const mockSidebarInfo = {
  releaseYear: "2022",
  languages: ["English", "Hindi", "Tamil", "Telegu", "Kannada"],
  ratings: {
    imdb: 4.5,
    streamvibe: 4
  },
  genres: ["Action", "Adventure"],
  director: {
    name: "Rishab Shetty",
    origin: "From India",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200"
  },
  music: {
    name: "B. Ajaneesh Loknath",
    origin: "From India",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
  }
};

const MovieOpenPage: React.FC = () => {
  return (
    <div className="w-full bg-bg-custom min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full mt-[40px] desktop:mt-[50px] px-[15px] laptop:px-[80px] desktop:px-[162px]">
        <MovieOpenHero movie={mockMovie} />
      </div>

      {/* Main Grid Layout */}
      <div className="w-full max-w-[1920px] mx-auto mt-[40px] xl:mt-[100px] desktop:mt-[150px] px-[15px] laptop:px-[80px] desktop:px-[162px]">
        <div className="flex flex-col xl:flex-row gap-[20px] desktop:gap-[30px]">
          {/* Left Column: Description, Cast, Reviews */}
          <div className="flex flex-col flex-[2] min-w-0 gap-[20px] desktop:gap-[30px]">
             <MovieDescription description={mockDescription} />
             <CastCarousel cast={mockCast} />
             <ReviewsSection reviews={mockReviews} />
          </div>
          
          {/* Right Column: Info Sidebar */}
          <div className="flex flex-col flex-1 gap-[20px] desktop:gap-[30px]">
             <MovieInfoSidebar movie={mockSidebarInfo} />
          </div>
        </div>
      </div>
      
      <CTASection />
      <Footer />
    </div>
  );
};

export default MovieOpenPage;
