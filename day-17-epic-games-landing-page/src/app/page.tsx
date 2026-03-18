'use client';

import Header from '@/components/Header';
import { ChevronRight, Gamepad2, Gift, Rocket, Star, Trophy } from 'lucide-react';
import Link from 'next/link';

const BannerData = {
  title: 'GALACTIC FANTASY: LEGENDS UNITE',
  description: 'Experience the ultimate clash of kingdoms and technology in our most ambitious RPG yet. Pre-purchase now for exclusive legendary skins.',
  cta: 'PRE-PURCHASE',
  secondary: 'WISHLIST',
  tag: 'AVAILABLE SOON'
};

const FeaturedGames = [
  {
    id: 1,
    title: 'Cyber Ronin: Nexus',
    category: 'FREE GAME',
    available: 'Now - Mar 25',
    imageUrl: 'https://placehold.co/600x400'
  },
  {
    id: 2,
    title: 'Echoes of Valhalla',
    category: 'FREE GAME',
    available: 'Mar 25 - Apr 01',
    imageUrl: 'https://placehold.co/600x400'
  },
  {
    id: 3,
    title: 'Nebula Vanguard',
    category: 'MYSTERY GAME',
    available: 'Unlocking in 4 days',
    imageUrl: 'https://placehold.co/600x400'
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-accent-blue/30 overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-[85vh] overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10" />

        {/* Hero Content */}
        <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-20 max-w-4xl space-y-6 animate-in fade-in slide-in-from-left duration-700">
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue font-bold text-[10px] tracking-widest uppercase">
            {BannerData.tag}
          </div>

          <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-tight uppercase font-sans">
            {BannerData.title}
          </h1>

          <p className="text-lg md:text-xl text-text-muted max-w-xl leading-relaxed">
            {BannerData.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <button className="w-full sm:w-auto px-10 py-4 bg-foreground text-background font-bold tracking-widest text-sm hover:opacity-90 transition-all uppercase rounded-sm cursor-pointer active:scale-95">
              {BannerData.cta}
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-transparent border border-foreground/20 text-foreground font-bold tracking-widest text-sm hover:bg-foreground/5 transition-all uppercase rounded-sm cursor-pointer active:scale-95">
              {BannerData.secondary}
            </button>
          </div>
        </div>

        {/* Hero Background Animation Placeholder */}
        <div className="absolute inset-0 z-0 scale-105">
           <div className="w-full h-full bg-background/50" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] opacity-20 blur-[120px] bg-accent-blue rounded-full" />
        </div>
      </section>

      {/* Free Games Section */}
      <section className="px-6 md:px-20 py-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-accent-blue/10 rounded-sm">
               <Gift className="text-accent-blue" size={24} />
             </div>
             <h2 className="text-2xl font-bold uppercase tracking-widest">Free Games</h2>
          </div>
          <button className="flex items-center space-x-1 px-4 py-2 border border-foreground/10 rounded-sm text-[10px] font-bold tracking-widest hover:bg-foreground/5 transition-all uppercase cursor-pointer">
            <span>VIEW MORE</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FeaturedGames.map((game, idx) => (
            <div key={game.id} className="group cursor-pointer animate-in fade-in slide-in-from-bottom duration-500 delay-100" style={{ animationDelay: `${idx * 150}ms` }}>
              <div className="relative aspect-video overflow-hidden rounded-md mb-4 border border-foreground/5 group-hover:border-accent-blue/30 transition-all duration-300 shadow-xl shadow-black/20">
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100 bg-[#1e2329]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="space-y-1 px-1">
                <div className="text-[10px] font-bold text-accent-blue tracking-tighter uppercase mb-1">
                  {game.category}
                </div>
                <h3 className="text-lg font-bold group-hover:text-accent-blue transition-colors leading-tight">
                  {game.title}
                </h3>
                <p className="text-sm text-text-muted">
                  Free {game.available}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Section */}
      <section className="px-6 md:px-20 py-24 mb-20 bg-accent-blue/5 rounded-[40px] mx-6 md:mx-20 border border-accent-blue/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-accent-blue/10 blur-[80px] rounded-full" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center relative z-10">
          {[
            { Icon: Rocket, title: 'Ultra Fast', desc: 'Proprietary tech.' },
            { Icon: Trophy, title: 'Leaderboards', desc: 'Reach the top.' },
            { Icon: Gamepad2, title: 'Cloud Save', desc: 'Sync everywhere.' },
            { Icon: Star, title: 'Exclusives', desc: 'Epic only.' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-4 hover:translate-y-[-4px] transition-transform duration-300">
              <div className="w-16 h-16 bg-accent-blue/10 rounded-2xl flex items-center justify-center mx-auto border border-accent-blue/20">
                <item.Icon className="text-accent-blue" size={32} />
              </div>
              <h4 className="font-black uppercase tracking-tight text-lg">{item.title}</h4>
              <p className="text-xs text-text-muted font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-16 px-6 md:px-20 border-t border-foreground/5 bg-header-bg/50">
         <div className="flex justify-between items-center mb-12 flex-wrap gap-6">
            <div className="flex items-center space-x-4">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="w-10 h-10 bg-foreground/5 rounded-full flex items-center justify-center hover:bg-accent-blue/20 hover:text-accent-blue transition-all cursor-pointer">
                    <Star size={18} />
                 </div>
               ))}
            </div>
            <button className="text-accent-blue font-bold tracking-widest text-[10px] uppercase border-b border-accent-blue/30 hover:border-accent-blue transition-all pb-1">
              Scroll to top
            </button>
         </div>
         <p className="text-[10px] text-text-muted max-w-3xl mx-auto uppercase tracking-[0.2em] leading-loose opacity-60">
           © 2026, EPIC GAMES, INC. ALL RIGHTS RESERVED. EPIC, EPIC GAMES, THE EPIC GAMES LOGO, FORTNITE, THE FORTNITE LOGO, UNREAL, UNREAL ENGINE, THE UNREAL ENGINE LOGO, UNREAL TOURNAMENT, AND THE UNREAL TOURNAMENT LOGO ARE TRADEMARKS OR REGISTERED TRADEMARKS OF EPIC GAMES, INC. IN THE UNITED STATES OF AMERICA AND ELSEWHERE.
         </p>
      </footer>
    </main>
  );
}
