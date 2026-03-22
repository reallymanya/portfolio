'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollSection({ 
  imageSrc, 
  title, 
  description, 
  index,
  total 
}) {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const text = textRef.current;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Simple fade only
      gsap.fromTo(section, 
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: 'center center',
            scrub: true,
          }
        }
      );
      return;
    }

    // Floating idle animation
    gsap.to(image, {
      y: -20,
      duration: 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // Entry animation from below
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'center center',
        scrub: 1.5,
        // markers: true, // Uncomment for debugging
      }
    });

    tl.fromTo(image,
      {
        y: 150,
        opacity: 0,
        scale: 0.85,
        rotateZ: -5,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateZ: 0,
        ease: 'power4.out',
      }
    );

    tl.fromTo(text,
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        ease: 'power4.out',
      },
      '-=0.6' // Overlap by 0.6s
    );

    // Exit animation (fade and scale down slightly)
    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'center center',
        end: 'bottom top',
        scrub: 1.5,
      }
    });

    exitTl.to(image, {
      y: -100,
      opacity: 0,
      scale: 0.9,
      rotateZ: 3,
      ease: 'power4.in',
    });

    exitTl.to(text, {
      y: -80,
      opacity: 0,
      ease: 'power4.in',
    }, '-=0.5');

    // Parallax effect on scroll
    gsap.to(image, {
      y: -150,
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ willChange: 'opacity' }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Image Column */}
        <div 
          ref={imageRef}
          className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center"
          style={{ willChange: 'transform, opacity' }}
        >
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-contain"
            loading={index === 0 ? 'eager' : 'lazy'}
            quality={90}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Text Column */}
        <div 
          ref={textRef}
          className="space-y-6"
          style={{ willChange: 'transform, opacity' }}
        >
          <span className="inline-block px-4 py-2 bg-[#FF8E3C]/20 text-[#FF8E3C] rounded-full text-sm font-bold tracking-wide">
            CHAPTER {index + 1}
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-[#2D2D2D] leading-tight">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

      </div>
    </section>
  );
}
