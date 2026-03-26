import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const categories = [
  { name: "Action", images: ["img1", "img2", "img3", "img4"] },
  { name: "Adventure", images: ["img1", "img2", "img3", "img4"] },
  { name: "Comedy", images: ["img1", "img2", "img3", "img4"] },
  { name: "Drama", images: ["img1", "img2", "img3", "img4"] },
  { name: "Horror", images: ["img1", "img2", "img3", "img4"] },
];

interface CategoriesSectionProps {
  title?: string;
  description?: string;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  title = "Explore our wide variety of categories",
  description = "Whether you're looking for a comedy to make you laugh, a drama to make you think, or a documentary to learn something new",
}) => {
  return (
    <section className="w-full">
      {/* Header - gap: 100px between heading and nav from CSS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-[50px] md:gap-[100px]">
        <div className="flex flex-col max-w-[1141px]">
          <h2 className="text-[28px] md:text-[38px] font-bold text-text-p">
            {title}
          </h2>
          {description && (
            <p className="text-[14px] md:text-[18px] text-text-s font-normal mt-3">
              {description}
            </p>
          )}
        </div>
        {/* Navigation Controls - padding: 16px, gap: 16px from CSS */}
        <div className="flex items-center gap-4 bg-[#0F0F0F] p-4 rounded-[12px] border border-[#1F1F1F]">
          <button className="w-14 h-14 bg-[#1A1A1A] border border-[#1F1F1F] rounded-[8px] flex items-center justify-center text-text-p hover:bg-[#262626] transition-colors">
            <ArrowLeft size={28} />
          </button>
          {/* Indicators - gap: 3px from CSS */}
          <div className="flex gap-[3px]">
            <div className="w-[23px] h-1 bg-primary rounded-full"></div>
            <div className="w-[16px] h-1 bg-[#333333] rounded-full"></div>
            <div className="w-[16px] h-1 bg-[#333333] rounded-full"></div>
            <div className="w-[16px] h-1 bg-[#333333] rounded-full"></div>
          </div>
          <button className="w-14 h-14 bg-[#1A1A1A] border border-[#1F1F1F] rounded-[8px] flex items-center justify-center text-text-p hover:bg-[#262626] transition-colors">
            <ArrowRight size={28} />
          </button>
        </div>
      </div>

      {/* Cards Grid - gap: 30px between cards from CSS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-[30px] mt-[50px]">
        {categories.map((category, idx) => (
          <div
            key={idx}
            className="bg-surface border border-border-darker rounded-[12px] p-[30px] flex flex-col cursor-pointer hover:border-primary transition-colors group"
          >
            {/* Image Grid with Fade Out */}
            <div className="relative isolate">
              <div className="grid grid-cols-2 gap-[5px]">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="w-full h-[80px] md:h-[100px] lg:h-[123.5px] bg-border-darker rounded-[10px] overflow-hidden"
                  >
                    <img
                      src={`https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=300&auto=format&fit=crop`}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
              {/* Fade Out Overlay - matches design gradient */}
              <div 
                className="absolute inset-x-0 bottom-0 h-full pointer-events-none z-[1]"
                style={{
                  background: "linear-gradient(180deg, rgba(26, 26, 26, 0) 0%, var(--color-surface) 100%)"
                }}
              />
            </div>

            {/* Title and Icon */}
            <div className="flex items-center justify-between z-[2] mt-[14px]">
              <span className="text-[16px] md:text-[18px] font-semibold text-text-p">
                {category.name}
              </span>
              <ArrowRight
                size={24}
                className="text-text-p opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
