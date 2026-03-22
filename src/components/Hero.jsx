'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const comp = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Create a timeline
      const tl = gsap.timeline();
      
      tl.from(".hero-text", {
        opacity: 0,
        y: 100,
        rotateX: -45,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out"
      });
      
      tl.from(".hero-btn", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.5");
      
    }, comp);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={comp} className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden perspective-1000">
      <div className="z-10 w-full max-w-5xl mx-auto space-y-8">
        <h1 className="hero-text text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter mix-blend-difference text-white mb-2">
          CREATIVE
        </h1>
        <h1 className="hero-text text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
          DEVELOPER
        </h1>
        
        <p className="hero-text text-lg md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed mt-8">
          Crafting immersive digital experiences through code and design.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12 pt-8">
          <button className="hero-btn group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            <span className="relative z-10 flex items-center gap-2">
              Explore Work
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-y-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
              </svg>
            </span>
          </button>
          
          <button className="hero-btn px-8 py-4 text-white font-medium text-lg border border-white/10 hover:border-white/30 rounded-full transition-all hover:bg-white/5 backdrop-blur-sm">
            About Me
          </button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="hero-btn absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-xs uppercase tracking-widest text-gray-500">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent"></div>
      </div>
    </section>
  );
}
