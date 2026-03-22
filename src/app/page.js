'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import InteractiveCard from '@/components/InteractiveCard';
import { useInView } from 'react-intersection-observer';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const theme = {
    bg: isDarkMode ? '#111111' : '#FFFDF5',
    navBg: isDarkMode ? 'rgba(17,17,17,0.8)' : 'rgba(255,253,245,0.8)',
    textPrimary: isDarkMode ? '#F5F5F7' : '#2D2D2D',
    textSecondary: isDarkMode ? '#A1A1A6' : '#777777',
    textLight: isDarkMode ? '#888888' : '#999999',
    cardBg: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)',
    border: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
  };

  const containerRef = useRef(null);
  const imageStackRef = useRef(null);

  const heroRef = useRef(null);
  const deskLookingRef = useRef(null);
  const deskWavingRef = useRef(null);
  const standingRef = useRef(null);
  const typingRef = useRef(null);
  const hologramRef = useRef(null);
  const casualRef = useRef(null);
  const magicBgRef = useRef(null);

  const { ref: contactRef, inView: contactInView } = useInView({
    triggerOnce: false,
    threshold: 0.2, // Trigger when 20% visible
  });

  // ── SCROLL ANIMATIONS ──
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const master = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          pin: imageStackRef.current,
          pinSpacing: false,
        }
      });

      // Based on having 6 main scroll heights (~6 timelines sections)
      // Scene 1 (0) -> Hero
      master
        .to(heroRef.current, {opacity: 0, scale: 0.95, duration: 0.4, ease: 'power2.inOut'}, 0)
        .to(deskLookingRef.current, {opacity: 1, scale: 1, duration: 0.4, ease: 'power2.inOut'}, 0)
        .to(deskLookingRef.current, {opacity: 0, scale: 0.95, duration: 0.4, ease: 'power2.inOut'}, 0.3)
        .to(deskWavingRef.current, {opacity: 1, scale: 1, duration: 0.4, ease: 'power2.inOut'}, 0.3)

      // Scene 2 (0.6) -> About Me
        .to(deskWavingRef.current, {opacity: 0, scale: 0.95, y: -30, duration: 0.4, ease: 'power2.inOut'}, 0.8)
        .to(standingRef.current, {opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.inOut'}, 0.8)

      // Scene 3 (1.5) -> Tech Stack
        .to(standingRef.current, {opacity: 0, x: -60, duration: 0.4, ease: 'power2.inOut'}, 1.8)
        .to(typingRef.current, {opacity: 1, x: 0, rotate: 0, scale: 1, duration: 0.4, ease: 'power2.inOut'}, 1.8)

      // Scene 4 (2.4) -> Projects
        .to(imageStackRef.current, {x: '27.5vw', duration: 0.4, ease: 'power2.inOut'}, 2.8)
        .to(typingRef.current, {opacity: 0, duration: 0.4, ease: 'power2.inOut'}, 2.8)
        .to(magicBgRef.current, {opacity: 0, duration: 0.5, ease: 'power2.inOut'}, 2.6)
        .to(hologramRef.current, {opacity: 1, scale: 1, y: 0, filter: 'drop-shadow(0 0 0px rgba(0,150,255,0))', duration: 0.4, ease: 'power2.inOut'}, 2.8)

      // Scene 5 (3.2) -> Certifications & Achievements
        .to(imageStackRef.current, {x: '0vw', duration: 0.4, ease: 'power2.inOut'}, 3.8)
        .to(hologramRef.current, {opacity: 0, y: -30, duration: 0.4, ease: 'power2.inOut'}, 3.8)
        .to(magicBgRef.current, {opacity: 0, duration: 0.4, ease: 'power2.inOut'}, 3.8)
        .to(casualRef.current, {opacity: 1, y: 0, scale: 0.75, transformOrigin: 'left center', duration: 0.4, ease: 'power2.inOut'}, 3.8)

      // Scene 6 (4.0) -> Education/Experience
        .to(casualRef.current, {opacity: 0, y: -30, duration: 0.4, ease: 'power2.inOut'}, 4.8)
        .to(deskLookingRef.current, {opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.inOut'}, 4.8)

      // Scene 7 (5.0) -> Contact
        .to(deskLookingRef.current, {opacity: 0, y: 40, duration: 0.4, ease: 'power2.inOut'}, 5.8)
        .to(deskWavingRef.current, {opacity: 1, scale: 1, y:0, x:0, duration: 0.4, ease: 'power2.inOut'}, 6.0);

    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const sectionStyle = {
    position: 'relative',
    height: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isMobile ? 'center' : 'flex-end',
    paddingRight: isMobile ? '0' : '5vw',
    overflow: 'hidden',
  };

  const imageWrapperBase = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    willChange: 'transform, opacity',
  };

  const textBlockStyle = {
    position: 'relative',
    zIndex: 15,
    textAlign: 'left',
    padding: isMobile ? '0 2rem' : '0 2rem', // keep it
    width: isMobile ? '100%' : '50%',
    maxWidth: '650px',
  };

  const projects = [
    {
      title: 'TravelVerse',
      description: 'MERN Stack Travel Booking Platform',
      tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Zod'],
      color: '#60a5fa',
      image: 'travelverse.png',
      link: 'https://github.com/reallymanya/PackYourBags/tree/main/Travel_Verse_MERN',
    },
    {
      title: 'Second Brain',
      description: 'Digital Knowledge Management System',
      tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
      color: '#FF8E3C',
      image: 'secondbrain.png',
      link: 'https://github.com/reallymanya/SecondBrain',
    },
    {
      title: 'Heritage Museum',
      description: 'Chatbot-Based Ticketing System',
      tech: ['HTML', 'Tailwind CSS', 'JavaScript', 'PHP', 'MySQL', 'Razorpay API'],
      color: '#a78bfa',
      image: 'heritage.png',
      link: 'https://github.com/reallymanya/Heritage-museum',
    },
  ];

  return (
    <main ref={containerRef} style={{ position: 'relative', background: theme.bg, color: theme.textPrimary, overflowX: 'hidden', transition: 'background 0.3s ease, color 0.3s ease', fontFamily: 'var(--font-nunito), Arial, sans-serif' }}>
      {/* ── NAVBAR ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 4vw', background: theme.navBg, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: `1px solid ${theme.border}`, transition: 'background 0.3s ease, border-color 0.3s ease' }}>
        <a href="#scene-1" style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '1.2rem', fontWeight: 800, color: theme.textPrimary, textDecoration: 'none', letterSpacing: '-0.02em' }}>
          Manya<span style={{ fontFamily: 'var(--font-dancing), cursive', color: '#FF8E3C', marginLeft: '0.25rem', fontSize: '110%' }}>Takkar</span>
        </a>
        <div style={{ display: isMobile ? 'none' : 'flex', gap: '2rem', alignItems: 'center' }}>
          {[
            { label: 'Skills', href: '#scene-3' },
            { label: 'Projects', href: '#scene-4' },
            { label: 'Certifications', href: '#scene-5' },
            { label: 'Achievements', href: '#scene-5' },
            { label: 'Education', href: '#scene-6' },
            { label: 'Contact', href: '#scene-7' },
          ].map((link) => (
            <a key={link.label} href={link.href} style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '0.85rem', fontWeight: 600, color: theme.textSecondary, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#FF8E3C'} onMouseLeave={(e) => e.target.style.color = theme.textSecondary}>{link.label}</a>
          ))}
          <a href="/MANYATAKKAR.pdf" download style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '0.8rem', fontWeight: 700, padding: '0.5rem 1.25rem', borderRadius: '999px', border: '1px solid #FF8E3C', color: '#FF8E3C', textDecoration: 'none', textTransform: 'uppercase', transition: 'background 0.3s ease, color 0.3s ease' }} onMouseEnter={(e) => { e.target.style.background = '#FF8E3C'; e.target.style.color = '#FFF'; }} onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#FF8E3C'; }}>
            Resume
          </a>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      {/* ── PINNED IMAGE STACK ── */}
      <div ref={imageStackRef} style={{ position: 'absolute', top: 0, left: 0, width: isMobile ? '100%' : '45%', opacity: isMobile ? 0.15 : 1, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 0 }}>
        <div ref={magicBgRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'radial-gradient(ellipse at 30% center, #0f172a 0%, #020617 100%)', opacity: 0, zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', width: 'min(420px, 35vw)', height: 'min(500px, 65vh)', zIndex: 1 }}>
          <div ref={heroRef} style={{ ...imageWrapperBase, opacity: 1 }}><Image src="/characters/desk-coding.png" alt="Coding at desk" fill style={{ objectFit: 'contain' }} priority unoptimized /></div>
          <div ref={deskLookingRef} style={{ ...imageWrapperBase, opacity: 0 }}><Image src="/characters/desk-looking.png" alt="Looking at user" fill style={{ objectFit: 'contain' }} priority unoptimized /></div>
          <div ref={deskWavingRef} style={{ ...imageWrapperBase, opacity: 0 }}><Image src="/characters/desk-waving.png" alt="Waving at user" fill style={{ objectFit: 'contain' }} priority unoptimized /></div>
          <div ref={standingRef} style={{ ...imageWrapperBase, opacity: 0, transform: 'translateY(60px) scale(1.05)' }}><Image src="/characters/standing.png" alt="Standing" fill style={{ objectFit: 'contain' }} unoptimized /></div>
          <div ref={typingRef} style={{ ...imageWrapperBase, opacity: 0, transform: 'translateX(120px) rotate(2deg) scale(1.03)' }}><Image src="/characters/laptop-desk.png" alt="Typing" fill style={{ objectFit: 'contain' }} unoptimized /></div>
          <div ref={hologramRef} style={{ ...imageWrapperBase, opacity: 0, transform: 'translateY(30px) scale(0.9)' }}><Image src="/characters/hologram-ui.png" alt="Hologram" fill style={{ objectFit: 'contain' }} unoptimized /></div>
          <div ref={casualRef} style={{ ...imageWrapperBase, opacity: 0, transform: 'translateY(40px) scale(1.04)' }}><Image src="/characters/sitting-laptop.png" alt="Casual" fill style={{ objectFit: 'contain' }} unoptimized /></div>
        </div>
      </div>

      {/* ── SCROLLABLE SECTIONS ── */}
      <section id="scene-1" style={sectionStyle}>
        <div style={textBlockStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '2rem', height: '2px', background: '#FF8E3C' }} />
            <span style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#FF8E3C' }}>Software Developer</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.04em', lineHeight: 1.1, margin: '0 0 0.5rem 0' }}>
            Manya
            <br />
            <span style={{ fontFamily: 'var(--font-dancing), cursive', color: '#FF8E3C', fontWeight: 700, fontSize: '105%', letterSpacing: '0.01em' }}>Takkar</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-nunito), sans-serif', fontSize: '1.1rem', color: theme.textLight, fontWeight: 400, lineHeight: 1.6, maxWidth: '440px', marginTop: '1rem' }}>
            I engineer scalable, highly interactive full-stack web architectures, bridging the gap between robust functionality and pixel-perfect design.
          </p>
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.5rem', color: theme.textPrimary }}>
            <a href="https://github.com/reallymanya" target="_blank" rel="noreferrer" style={{ color: 'inherit', transition: 'transform 0.3s ease, color 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.color = '#FF8E3C'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.color = 'inherit'; }} aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/manya-takkar-395a67241/" target="_blank" rel="noreferrer" style={{ color: 'inherit', transition: 'transform 0.3s ease, color 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.color = '#FF8E3C'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.color = 'inherit'; }} aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="https://leetcode.com/u/Manyaa_28/" target="_blank" rel="noreferrer" style={{ color: 'inherit', transition: 'transform 0.3s ease, color 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.color = '#FF8E3C'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.color = 'inherit'; }} aria-label="LeetCode">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.396.702-1.863l4.332-4.363c.467-.467 1.112-.662 1.824-.662s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.046.536-.543.555-1.396.041-1.91l-2.964-2.864c-1.072-1.07-2.58-1.522-4.135-1.522s-3.064.453-4.136 1.522l-4.478 4.51c-1.072 1.07-1.637 2.55-1.637 4.103s.565 3.033 1.637 4.103l4.478 4.51c1.072 1.07 2.58 1.522 4.136 1.522s3.063-.453 4.135-1.522l2.964-2.865c.514-.514.495-1.366-.041-1.91-.535-.542-1.386-.56-1.9-.045zm1.902-7.535h-8.006c-.718 0-1.3.582-1.3 1.3s.582 1.3 1.3 1.3h8.006c.718 0 1.3-.582 1.3-1.3s-.582-1.3-1.3-1.3z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section id="scene-2" style={sectionStyle}>
        <div style={textBlockStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '2rem', height: '2px', background: '#FF8E3C' }} />
            <span style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#FF8E3C' }}>About Me</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.03em', lineHeight: 1.25, marginBottom: '1.5rem' }}>
            Transforming {' '}
            <span style={{ fontFamily: 'var(--font-dancing), cursive', color: '#FF8E3C', fontWeight: 700, fontSize: '120%' }}>Ideas</span>
            <br />
            into digital realities.
          </h2>
          <p style={{ fontFamily: 'var(--font-nunito), sans-serif', fontSize: '1rem', color: theme.textSecondary, lineHeight: 1.8, maxWidth: '460px', marginBottom: '2rem' }}>
            Pursuing a B.Tech in Computer Science and Engineering at Lovely Professional University, specializing in developing scalable and efficient web applications using the MERN stack. Focused on clean architecture, modular design, and maintainable code practices.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[
              { number: '7.98', label: 'B.Tech CGPA' },
              { number: '200+', label: 'DSA Questions' },
              { number: '3+', label: 'Projects Built' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: theme.textPrimary, lineHeight: 1.1 }}>{stat.number}</div>
                <div style={{ fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.7rem', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.3rem', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="scene-3" style={sectionStyle}>
        <div style={textBlockStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '2rem', height: '2px', background: '#FF8E3C' }} />
            <span style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#FF8E3C' }}>Technical Arsenal</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 800, color: theme.textPrimary, marginBottom: '1.5rem', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Tools I{' '}
            <span style={{ fontFamily: 'var(--font-dancing), cursive', color: '#FF8E3C', fontWeight: 700, fontSize: '115%' }}>love using</span>
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'flex-start', maxWidth: '420px' }}>
            {['C++', 'JavaScript', 'TypeScript', 'PHP', 'SQL', 'HTML', 'CSS', 'Tailwind CSS', 'NodeJS', 'React', 'Next.js', 'MySQL', 'MongoDB', 'Postman'].map((tech, i) => (
              <span key={i} style={{ display: 'inline-block', fontFamily: 'var(--font-syne), sans-serif', padding: '0.5rem 1.2rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, border: `1.5px solid ${theme.border}`, color: theme.textPrimary, background: theme.cardBg, backdropFilter: 'blur(8px)', letterSpacing: '0.02em', transition: 'all 0.3s ease', cursor: 'default' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 15px rgba(255,142,60,0.12)'; e.currentTarget.style.borderColor = '#FF8E3C'; e.currentTarget.style.color = '#FF8E3C'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textPrimary; }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="scene-4" style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <div style={{ position: isMobile ? 'relative' : 'absolute', top: isMobile ? 0 : '15vh', left: isMobile ? '2rem' : '8vw', zIndex: 15, marginTop: isMobile ? '2rem' : 0 }}>
          <span style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '0.9rem', fontWeight: 800, color: '#FFF', backgroundColor: '#3b82f6', padding: '0.4rem 0.8rem', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-block', transform: 'rotate(-4deg) translateY(12px) translateX(5px)', position: 'relative', zIndex: 2 }}>Selected</span>
          <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900, color: theme.textPrimary, letterSpacing: '-0.02em', lineHeight: 1, marginTop: '0.2rem', position: 'relative', zIndex: 1 }}>Projects</h2>
        </div>
        
        <div style={{ display: isMobile ? 'flex' : 'block', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '2rem' : 0, width: '100%', padding: isMobile ? '20vh 10vw' : 0, height: isMobile ? '100vh' : 'auto', overflowY: isMobile ? 'auto' : 'visible' }}>
        {/* Project 1 */}
        <div style={{ position: isMobile ? 'relative' : 'absolute', top: isMobile ? 0 : '12vh', right: isMobile ? 0 : '8vw', width: isMobile ? '100%' : 'clamp(260px, 22vw, 340px)', zIndex: 15, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.8rem', transition: 'transform 0.4s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.firstChild.style.boxShadow = '0 0 0 2px #3b82f6, 0 8px 20px rgba(59,130,246,0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.firstChild.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'; }}>
          <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '16px', border: '1px solid #3b82f6', background: 'transparent', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'box-shadow 0.3s ease' }}>
            <Image src={`/${projects[0].image}`} alt={projects[0].title} fill style={{ objectFit: 'contain' }} unoptimized />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '1.25rem', fontWeight: 800, color: theme.textPrimary, margin: '0 0 0.3rem 0', transition: 'color 0.3s ease' }}>{projects[0].title}</h3>
            <p style={{ fontSize: '0.9rem', color: theme.textSecondary, margin: 0, fontWeight: 500, transition: 'color 0.3s ease' }}>{projects[0].description}</p>
            {projects[0].link !== '#' && (
              <a href={projects[0].link} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-syne), sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#FF8E3C', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.8rem', transition: 'transform 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
                View Project
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Project 2 */}
        <div style={{ position: isMobile ? 'relative' : 'absolute', bottom: isMobile ? 0 : '12vh', left: isMobile ? 0 : '8vw', width: isMobile ? '100%' : 'clamp(260px, 22vw, 340px)', zIndex: 15, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.8rem', transition: 'transform 0.4s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.firstChild.style.boxShadow = '0 0 0 2px #3b82f6, 0 8px 20px rgba(59,130,246,0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.firstChild.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'; }}>
          <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '16px', border: '1px solid #3b82f6', background: 'transparent', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'box-shadow 0.3s ease' }}>
            <Image src={`/${projects[1].image}`} alt={projects[1].title} fill style={{ objectFit: 'contain' }} unoptimized />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '1.25rem', fontWeight: 800, color: theme.textPrimary, margin: '0 0 0.3rem 0', transition: 'color 0.3s ease' }}>{projects[1].title}</h3>
            <p style={{ fontSize: '0.9rem', color: theme.textSecondary, margin: 0, fontWeight: 500, transition: 'color 0.3s ease' }}>{projects[1].description}</p>
            {projects[1].link !== '#' && (
              <a href={projects[1].link} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-syne), sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#FF8E3C', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.8rem', transition: 'transform 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
                View Project
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Project 3 */}
        <div style={{ position: isMobile ? 'relative' : 'absolute', bottom: isMobile ? 0 : '12vh', right: isMobile ? 0 : '8vw', width: isMobile ? '100%' : 'clamp(260px, 22vw, 340px)', zIndex: 15, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.8rem', transition: 'transform 0.4s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.firstChild.style.boxShadow = '0 0 0 2px #3b82f6, 0 8px 20px rgba(59,130,246,0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.firstChild.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'; }}>
          <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '16px', border: '1px solid #3b82f6', background: 'transparent', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'box-shadow 0.3s ease' }}>
            <Image src={`/${projects[2].image}`} alt={projects[2].title} fill style={{ objectFit: 'contain' }} unoptimized />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '1.25rem', fontWeight: 800, color: theme.textPrimary, margin: '0 0 0.3rem 0', transition: 'color 0.3s ease' }}>{projects[2].title}</h3>
            <p style={{ fontSize: '0.9rem', color: theme.textSecondary, margin: 0, fontWeight: 500, transition: 'color 0.3s ease' }}>{projects[2].description}</p>
            {projects[2].link !== '#' && (
              <a href={projects[2].link} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-syne), sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#FF8E3C', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.8rem', transition: 'transform 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
                View Project
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            )}
          </div>
        </div>

      </div>
      </section>

      <section id="scene-5" style={{...sectionStyle, overflow: 'visible', justifyContent: 'center', padding: '6vh 5vw 4rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
        <div style={{ width: isMobile ? '100%' : '65%', maxWidth: '900px', textAlign: 'left', padding: isMobile ? '0 1rem' : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '2rem', height: '2px', background: '#FF8E3C' }} />
            <span style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#FF8E3C' }}>Milestones</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 800, color: theme.textPrimary, marginBottom: '2rem', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Certifications & {' '}
            <span style={{ fontFamily: 'var(--font-dancing), cursive', color: '#FF8E3C', fontWeight: 700, fontSize: '115%' }}>Achievements</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h4 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '1.3rem', marginBottom: '1rem', fontWeight: 700, color: theme.textPrimary }}>Certifications</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
                {[
                  { title: 'Responsive Web Design', issuer: 'FreeCodeCamp', date: 'Nov 2023', icon: '💻', link: 'https://www.freecodecamp.org/certification/fccd81d0961-774a-4191-a534-0d92b7c679b6/responsive-web-design', image: '/fcc.png' },
                  { title: 'Computer Networking', issuer: 'Coursera', date: 'Sep 2024', icon: '🌐', link: 'https://www.coursera.org/account/accomplishments/verify/FCVKNEFQ0FIJ', image: '/network.png' },
                  { title: 'Master GenAI Tools', issuer: 'Udemy', date: 'Sep 2025', icon: '🤖', link: 'https://ude.my/UC-4bc7c36b-1f04-490f-ab67-c5f68088e578', image: '/udemy.png' }
                ].map((cert, i) => (
                  <a key={i} href={cert.link} target={cert.link !== '#' ? "_blank" : "_self"} rel="noreferrer" style={{ textDecoration: 'none', padding: '1.2rem', background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '12px', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    {cert.image ? (
                      <div style={{ width: '100%', aspectRatio: '16/9', marginBottom: '1rem', borderRadius: '6px', overflow: 'hidden', background: theme.border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={cert.image} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.2rem' }} />
                      </div>
                    ) : (
                      <div style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{cert.icon}</div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '1rem', fontWeight: 700, color: theme.textPrimary, lineHeight: 1.3, marginBottom: '0.3rem' }}>{cert.title}</div>
                      {cert.link !== '#' && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: '#FF8E3C', marginLeft: '0.5rem', marginTop: '0.1rem' }}>
                          <path d="M7 17l9.2-9.2M17 17V7H7"/>
                        </svg>
                      )}
                    </div>
                    <div style={{ fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.85rem', color: theme.textSecondary }}>{cert.issuer}</div>
                    <div style={{ fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.75rem', color: '#FF8E3C', marginTop: 'auto', paddingTop: '0.8rem', fontWeight: 600 }}>{cert.date}</div>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '1.3rem', marginBottom: '1rem', fontWeight: 700, color: theme.textPrimary }}>Achievements</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                {[
                  { title: 'LeetCode Statistics', platform: 'Solved 150+ DSA Problems & Heatmap', icon: '🚀', image: 'https://leetcard.jacoblin.cool/Manyaa_28?theme=dark&font=Syne&ext=heatmap', link: 'https://leetcode.com/u/Manyaa_28/' },
                  { title: 'Web Hackathon Participant', platform: 'Code Off Duty', icon: '🏆', link: '#', image: '/codeoffduty.jpg' }
                ].map((ach, i) => (
                  <a key={i} href={ach.link} target={ach.link !== '#' ? "_blank" : "_self"} rel="noreferrer" style={{ textDecoration: 'none', padding: '1.2rem', background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '12px', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer', backdropFilter: 'blur(10px)', color: 'inherit' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    {ach.image ? (
                      ach.title.includes('LeetCode') ? (
                        <img src={ach.image} alt={ach.title} style={{ width: '100%', marginBottom: '0.8rem', borderRadius: '8px' }} />
                      ) : (
                        <div style={{ width: '100%', aspectRatio: '16/9', marginBottom: '1rem', borderRadius: '6px', overflow: 'hidden', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img src={ach.image} alt={ach.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.2rem' }} />
                        </div>
                      )
                    ) : (
                      <div style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>{ach.icon}</div>
                    )}
                    <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '1rem', fontWeight: 700, color: theme.textPrimary, lineHeight: 1.3, marginBottom: '0.3rem' }}>{ach.title}</div>
                    <div style={{ fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.85rem', color: theme.textSecondary }}>{ach.platform}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="scene-6" style={sectionStyle}>
        <div style={textBlockStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '2rem', height: '2px', background: '#FF8E3C' }} />
            <span style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#FF8E3C' }}>Background</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 800, color: theme.textPrimary, marginBottom: '2rem', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            My {' '}
            <span style={{ fontFamily: 'var(--font-dancing), cursive', color: '#FF8E3C', fontWeight: 700, fontSize: '115%' }}>Education</span>
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ paddingLeft: '1.5rem', borderLeft: `2px solid #FF8E3C`, position: 'relative' }}>
              <div style={{ position: 'absolute', width: '12px', height: '12px', background: '#FF8E3C', borderRadius: '50%', left: '-7px', top: '5px' }}></div>
              <h4 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '1.2rem', margin: '0', fontWeight: 700, color: theme.textPrimary }}>Lovely Professional University</h4>
              <p style={{ fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.95rem', color: theme.textLight, margin: '0.25rem 0 0.5rem 0', fontWeight: 500 }}>B.Tech - Computer Science and Engineering | Aug 2023 - Present</p>
              <p style={{ fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.95rem', color: theme.textSecondary, margin: '0', fontWeight: 500 }}>CGPA: 7.98</p>
            </div>
            <div style={{ paddingLeft: '1.5rem', borderLeft: `2px solid ${theme.border}`, position: 'relative' }}>
              <div style={{ position: 'absolute', width: '12px', height: '12px', background: theme.border, borderRadius: '50%', left: '-7px', top: '5px' }}></div>
              <h4 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '1.2rem', margin: '0', fontWeight: 700, color: theme.textPrimary }}>St Mary's Academy (Intermediate)</h4>
              <p style={{ fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.95rem', color: theme.textLight, margin: '0.25rem 0 0.5rem 0', fontWeight: 500 }}>Saharanpur | Apr 2022 - Mar 2023</p>
              <p style={{ fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.95rem', color: theme.textSecondary, margin: '0', fontWeight: 500 }}>Percentage: 87.2%</p>
            </div>
            <div style={{ paddingLeft: '1.5rem', borderLeft: `2px solid ${theme.border}`, position: 'relative' }}>
              <div style={{ position: 'absolute', width: '12px', height: '12px', background: theme.border, borderRadius: '50%', left: '-7px', top: '5px' }}></div>
              <h4 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '1.2rem', margin: '0', fontWeight: 700, color: theme.textPrimary }}>St Mary's Academy (Matriculation)</h4>
              <p style={{ fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.95rem', color: theme.textLight, margin: '0.25rem 0 0.5rem 0', fontWeight: 500 }}>Saharanpur | Apr 2020 - Mar 2021</p>
              <p style={{ fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.95rem', color: theme.textSecondary, margin: '0', fontWeight: 500 }}>Percentage: 99.80%</p>
            </div>
          </div>
        </div>
      </section>

      <section id="scene-7" ref={contactRef} style={{ ...sectionStyle, background: theme.bg, width: '100vw', position: 'relative', left: '50%', transform: 'translateX(-50%)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '0 5vw', boxSizing: 'border-box', zIndex: 20 }}>
        <div style={{ ...textBlockStyle, textAlign: 'left', flex: 1, zIndex: 10 }}>
          <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, color: theme.textPrimary, marginBottom: '0.5rem', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Let's <span style={{ fontFamily: 'var(--font-dancing), cursive', color: '#FF8E3C', fontWeight: 700, fontSize: '110%' }}>connect</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-nunito), sans-serif', fontSize: '1.05rem', color: theme.textSecondary, marginBottom: '2rem', maxWidth: '380px', lineHeight: 1.7 }}>
            Ready to collaborate or have an inquiry? I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
             <p style={{fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 500, fontSize: '0.95rem'}}>Email: <a href="mailto:manyatakkar.01@gmail.com" style={{color: '#FF8E3C', textDecoration: 'none'}}>manyatakkar.01@gmail.com</a></p>
             <p style={{fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 500, fontSize: '0.95rem'}}>Phone: <span style={{color: theme.textSecondary}}>+91-7983359040</span></p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', color: theme.textPrimary, marginBottom: '2.5rem' }}>
            <a href="https://github.com/reallymanya" target="_blank" rel="noreferrer" style={{ color: 'inherit', transition: 'transform 0.3s ease, color 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.color = '#FF8E3C'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.color = 'inherit'; }} aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/manya-takkar-395a67241/" target="_blank" rel="noreferrer" style={{ color: 'inherit', transition: 'transform 0.3s ease, color 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.color = '#FF8E3C'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.color = 'inherit'; }} aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="https://leetcode.com/u/Manyaa_28/" target="_blank" rel="noreferrer" style={{ color: 'inherit', transition: 'transform 0.3s ease, color 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.color = '#FF8E3C'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.color = 'inherit'; }} aria-label="LeetCode">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.396.702-1.863l4.332-4.363c.467-.467 1.112-.662 1.824-.662s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.046.536-.543.555-1.396.041-1.91l-2.964-2.864c-1.072-1.07-2.58-1.522-4.135-1.522s-3.064.453-4.136 1.522l-4.478 4.51c-1.072 1.07-1.637 2.55-1.637 4.103s.565 3.033 1.637 4.103l4.478 4.51c1.072 1.07 2.58 1.522 4.136 1.522s3.063-.453 4.135-1.522l2.964-2.865c.514-.514.495-1.366-.041-1.91-.535-.542-1.386-.56-1.9-.045zm1.902-7.535h-8.006c-.718 0-1.3.582-1.3 1.3s.582 1.3 1.3 1.3h8.006c.718 0 1.3-.582 1.3-1.3s-.582-1.3-1.3-1.3z"/>
              </svg>
            </a>
          </div>
          <a href="mailto:manyatakkar.01@gmail.com" style={{ display: 'inline-block', background: '#FF8E3C', color: '#fff', padding: '0.9rem 2.2rem', borderRadius: '999px', fontFamily: 'var(--font-syne), sans-serif', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer', textDecoration: 'none', letterSpacing: '0.03em', transition: 'transform 0.3s ease', boxShadow: '0 8px 30px rgba(255,142,60,0.3)' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
            Say Hello →
          </a>
        </div>
        <div style={{ flex: 1, height: '80%', position: 'relative', minWidth: '300px' }}>
          {contactInView && <InteractiveCard />}
        </div>
      </section>

    </main>
  );
}
