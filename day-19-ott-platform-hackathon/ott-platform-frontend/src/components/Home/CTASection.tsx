import React from "react";

const CTASection: React.FC = () => {
  return (
    <section className="w-full mt-[100px] md:mt-[150px] mb-[100px]">
      <div className="w-full max-w-[1920px] mx-auto px-[15px] laptop:px-[80px] desktop:px-[162px]">
        <div className="relative w-full rounded-[12px] overflow-hidden border border-border-custom flex items-center justify-between p-8 md:p-[80px] min-h-[300px] md:min-h-[400px]">
          {/* Background Images Grid */}
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="flex flex-col gap-[20px] h-full">
              {[1, 2, 3, 4].map((row) => (
                <div key={row} className="flex gap-[20px] flex-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => (
                    <div
                      key={col}
                      className="flex-1 bg-bg-custom rounded-[12px] overflow-hidden"
                    >
                      <img
                        src={`https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=200&auto=format&fit=crop`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-bg-custom via-bg-custom/90 to-transparent z-0"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-8">
            <div className="flex flex-col max-w-[900px]">
              <h2 className="text-[32px] md:text-[48px] font-bold text-text-p mb-4">
                Start your free trial today!
              </h2>
              <p className="text-[16px] md:text-[18px] text-text-s font-normal">
                This is a clear and concise call to action that encourages users
                to sign up for a free trial of StreamVibe.
              </p>
            </div>
            <button className="px-8 py-5 bg-primary text-text-p font-semibold text-[18px] rounded-[8px] hover:bg-red-700 transition-colors whitespace-nowrap">
              Start a Free Trail
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
