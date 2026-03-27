import React from 'react';
import { Plus, ArrowLeft, ArrowRight, Star } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  from: string;
  rating: number;
  content: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex flex-row items-center gap-[4px] px-[10px] py-[6px] bg-bg-custom border border-border-darker rounded-[51px]">
       <div className="flex flex-row gap-[2px]">
          {[1,2,3,4,5].map(star => {
             if (star <= Math.floor(rating)) {
               return <Star key={star} size={18} fill="#E60000" stroke="#E60000" className="w-[14px] h-[14px] xl:w-[18px] xl:h-[18px]" />;
             } else if (star === Math.ceil(rating) && rating % 1 !== 0) {
               return (
                 <div key={star} className="relative w-[14px] h-[14px] xl:w-[18px] xl:h-[18px]">
                   <Star className="w-[14px] h-[14px] xl:w-[18px] xl:h-[18px]" fill="#999999" stroke="#999999" />
                   <div className="absolute inset-0 w-1/2 overflow-hidden">
                     <Star className="w-[14px] h-[14px] xl:w-[18px] xl:h-[18px]" fill="#E60000" stroke="#E60000" />
                   </div>
                 </div>
               );
             } else {
               return <Star key={star} size={18} fill="#999999" stroke="#999999" className="w-[14px] h-[14px] xl:w-[18px] xl:h-[18px]" />;
             }
          })}
       </div>
       <span className="text-text-p font-medium text-[12px] xl:text-[14px] ml-[2px]">{rating}</span>
    </div>
  );
};

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  return (
    <div className="w-full bg-surface border border-border-darker rounded-[12px] p-[24px] xl:p-[40px] flex flex-col gap-[30px] xl:gap-[40px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-[16px]">
        <h3 className="text-text-s font-medium text-[16px] xl:text-[18px]">Reviews</h3>
        <button className="flex items-center justify-center gap-[4px] px-[16px] py-[12px] xl:px-[20px] xl:py-[14px] bg-bg-custom border border-border-darker rounded-[8px] text-text-p hover:bg-border-darker transition-colors font-medium text-[14px] xl:text-[16px] cursor-pointer">
          <Plus className="w-[16px] h-[16px] xl:w-[20px] xl:h-[20px]" /> Add Your Review
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="flex flex-col md:flex-row gap-[20px]">
        {reviews.map(review => (
          <div key={review.id} className="flex-1 bg-bg-custom border border-border-darker rounded-[10px] p-[30px] xl:p-[40px] flex flex-col gap-[20px]">
             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full gap-[16px]">
                <div className="flex flex-col gap-[4px]">
                   <h4 className="text-text-p font-medium text-[16px] xl:text-[20px]">{review.name}</h4>
                   <span className="text-text-s text-[14px] xl:text-[16px]">From {review.from}</span>
                </div>
                <StarRating rating={review.rating} />
             </div>
             <p className="text-text-s text-[14px] xl:text-[16px] leading-[150%]">{review.content}</p>
          </div>
         ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-row items-center justify-center gap-[10px] w-full mt-[-10px] xl:mt-[0px]">
          <button className="w-[44px] h-[44px] xl:w-[56px] xl:h-[56px] rounded-full bg-bg-custom border border-border-darker flex justify-center items-center text-text-p hover:bg-border-darker transition-colors cursor-pointer">
            <ArrowLeft className="w-[20px] h-[20px] xl:w-[28px] xl:h-[28px]" />
          </button>
          <div className="flex flex-row gap-[5px] items-center mx-[10px]">
             <div className="w-[16px] h-[4px] xl:w-[24px] xl:h-[4px] bg-primary rounded-[100px]" />
             <div className="w-[16px] h-[4px] xl:w-[24px] xl:h-[4px] bg-border-darker rounded-[100px]" />
             <div className="w-[16px] h-[4px] xl:w-[24px] xl:h-[4px] bg-border-darker rounded-[100px]" />
             <div className="w-[16px] h-[4px] xl:w-[24px] xl:h-[4px] bg-border-darker rounded-[100px]" />
          </div>
          <button className="w-[44px] h-[44px] xl:w-[56px] xl:h-[56px] rounded-full bg-bg-custom border border-border-darker flex justify-center items-center text-text-p hover:bg-border-darker transition-colors cursor-pointer">
            <ArrowRight className="w-[20px] h-[20px] xl:w-[28px] xl:h-[28px]" />
          </button>
      </div>
    </div>
  );
};

export default ReviewsSection;
