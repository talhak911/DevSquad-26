import React, { useState } from 'react';

const plans = [
  { name: 'Basic Plan', desc: 'Enjoy an extensive library of movies and shows, featuring a range of content, including recently released titles.', price: 9.99 },
  { name: 'Standard Plan', desc: 'Access to a wider selection of movies and shows, including most new releases and exclusive content.', price: 12.99 },
  { name: 'Premium Plan', desc: 'Access to a widest selection of movies and shows, including all new releases and Offline Viewing.', price: 14.99 },
];

const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section className="w-full mt-[100px] md:mt-[150px]">
      <div className="w-full max-w-[1920px] mx-auto px-[15px] laptop:px-[80px] desktop:px-[162px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-[80px]">
          <div className="flex flex-col max-w-[900px]">
            <h2 className="text-[28px] md:text-[38px] font-bold text-text-p mb-3">Choose the plan that's right for you</h2>
            <p className="text-[14px] md:text-[18px] text-text-s font-normal">Join StreamVibe and select from our flexible subscription options tailored to suit your viewing preferences. Get ready for non-stop entertainment!</p>
          </div>
          
          {/* Toggle */}
          <div className="flex items-center bg-bg-custom border border-border-custom rounded-[12px] p-2 mt-6 md:mt-0">
            <button 
              className={`px-6 py-3 rounded-[10px] text-[16px] font-semibold transition-colors ${billingCycle === 'monthly' ? 'bg-surface text-text-p' : 'text-text-s hover:text-text-p'}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`px-6 py-3 rounded-[10px] text-[16px] font-semibold transition-colors ${billingCycle === 'yearly' ? 'bg-surface text-text-p' : 'text-text-s hover:text-text-p'}`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-[30px]">
          {plans.map((plan, idx) => (
            <div key={idx} className="bg-surface border border-border-custom rounded-[12px] p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <h3 className="text-[24px] font-semibold text-text-p mb-4">{plan.name}</h3>
                <p className="text-[16px] text-text-s font-normal mb-8 leading-[150%]">{plan.desc}</p>
                <div className="text-[40px] font-bold text-text-p mb-8 border-t border-border-custom pt-8">
                  ${billingCycle === 'yearly' ? (plan.price * 10).toFixed(2) : plan.price}
                  <span className="text-[16px] text-text-s font-medium">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                </div>
              </div>
              <div className="flex gap-4 w-full">
                <button className="flex-1 px-4 py-4 bg-bg-custom border border-border-custom text-text-p rounded-[8px] font-semibold hover:bg-border-custom transition-colors">Start Free Trial</button>
                <button className="flex-1 px-4 py-4 bg-primary text-text-p rounded-[8px] font-semibold hover:bg-red-700 transition-colors">Choose Plan</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
