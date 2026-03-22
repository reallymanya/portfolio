'use client';

import React, { useRef, useLayoutEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function DeskModel({ scrollProgress }) {
  // Lazy load the GLB model
  const { scene } = useGLTF('/models/desk.glb');
  const modelRef = useRef();

  useFrame((state, delta) => {
    // Idle animation (yoyo loop is handled by Float, but we can add more subtle rotation)
    if (modelRef.current) {
       modelRef.current.rotation.y += delta * 0.05; 
    }
  });

  return (
    <Float 
      speed={2} // Animation speed
      rotationIntensity={0.5} // XYZ rotation intensity
      floatIntensity={0.5} // Up/down float intensity
    >
      <primitive 
        object={scene} 
        ref={modelRef} 
        scale={1.5} 
        position={[0, -1, 0]} 
      />
    </Float>
  );
}

function CameraController() {
  const cameraRef = useRef();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 3-step timeline triggered by scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "body", // Using body as scroll container wrapper
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        }
      });

      // (1) Intro Pan
      tl.to(cameraRef.current.position, {
        x: 0,
        y: 0,
        z: 5,
        duration: 2,
        ease: "power2.inOut"
      }, 0)
      
      // (2) Zoom into Hologram (assuming hologram is at a specific point)
      .to(cameraRef.current.position, {
        x: 1,
        y: 0.5,
        z: 2, // Zoom in
        duration: 2,
        ease: "power2.inOut"
      }, 2)

      // (3) Rotate to Avatar
      .to(cameraRef.current.rotation, {
        y: -0.5, // Look at avatar
        duration: 2,
        ease: "power2.inOut"
      }, 4);
    });

    return () => ctx.revert();
  }, []);

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 8]} fov={45} />;
}

export default function HeroScene() {
  return (
    <div className="w-full h-[600px] md:h-screen relative" aria-label="3D Desk Scene">
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <Environment preset="city" />
        
        {/* Camera Animation */}
        <CameraController />
        
        {/* Lazy Loaded Model */}
        <React.Suspense fallback={null}>
          <DeskModel />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
