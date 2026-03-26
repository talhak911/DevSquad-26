import React from "react";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";

const categories = [
  { name: "Action", images: ["img1", "img2", "img3", "img4"] },
  { name: "Adventure", images: ["img1", "img2", "img3", "img4"] },
  { name: "Comedy", images: ["img1", "img2", "img3", "img4"] },
  { name: "Drama", images: ["img1", "img2", "img3", "img4"] },
  { name: "Horror", images: ["img1", "img2", "img3", "img4"] },
];

const CategoriesSection: React.FC = () => {
  return (
    <section className="w-full mt-[100px] md:mt-[150px]">
      <div className="w-full max-w-[1920px] mx-auto px-[15px] laptop:px-[80px] desktop:px-[162px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-[80px]">
          <div className="flex flex-col max-w-[900px]">
            <h2 className="text-[28px] md:text-[38px] font-bold text-text-p mb-3">
              Explore our wide variety of categories
            </h2>
            <p className="text-[14px] md:text-[18px] text-text-s font-normal">
              Whether you're looking for a comedy to make you laugh, a drama to
              make you think, or a documentary to learn something new
            </p>
          </div>
          <div className="flex items-center gap-4 bg-surface p-4 rounded-[12px] border border-border-custom mt-6 md:mt-0 hidden md:flex">
            <button className="w-14 h-14 bg-bg-custom border border-border-custom rounded-[8px] flex items-center justify-center text-text-p hover:bg-border-custom transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div className="flex gap-1">
              <div className="w-4 h-1 bg-primary rounded-full"></div>
              <div className="w-4 h-1 bg-border-custom rounded-full"></div>
              <div className="w-4 h-1 bg-border-custom rounded-full"></div>
              <div className="w-4 h-1 bg-border-custom rounded-full"></div>
            </div>
            <button className="w-14 h-14 bg-bg-custom border border-border-custom rounded-[8px] flex items-center justify-center text-text-p hover:bg-border-custom transition-colors">
              <ArrowRight size={24} />
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-[30px]">
          {categories.map((category, idx) => (
            <div
              key={idx}
              className="bg-surface border border-border-custom rounded-[12px] p-5 md:p-[30px] flex flex-col cursor-pointer hover:border-primary transition-colors group"
            >
              {/* Image Grid */}
              <div className="grid grid-cols-2 gap-[5px] mb-[5px]">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="w-full h-[80px] md:h-[100px] lg:h-[123.5px] bg-bg-custom rounded-[10px] overflow-hidden"
                  >
                    <img
                      src={`https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=300&auto=format&fit=crop`}
                      alt={category.name}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[16px] md:text-[18px] font-semibold text-text-p">
                  {category.name}
                </span>
                <ChevronRight
                  size={24}
                  className="text-text-p opacity-50 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
