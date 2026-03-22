'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { Float, Environment, ContactShadows } from '@react-three/drei';
import gsap from 'gsap';
import GeometricCharacter from './GeometricCharacter';

export default function SceneController({ step = 0 }) {
  const group = useRef();
  
  const char1Ref = useRef();
  const char2Ref = useRef();
  const char3Ref = useRef();

  useEffect(() => {
    const tl = gsap.timeline();

    if (step === 0) {
      // Scene 1: Cube (Hero)
      tl.to(group.current.rotation, { y: 0.2, x: 0.1, duration: 1.5, ease: "power2.inOut" })
        .to(char1Ref.current.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.7)" }, 0)
        .to(char2Ref.current.scale, { x: 0, y: 0, z: 0, duration: 0.5 }, 0)
        .to(char3Ref.current.scale, { x: 0, y: 0, z: 0, duration: 0.5 }, 0);
    } else if (step === 1) {
      // Scene 2: Sphere (Projects)
      tl.to(group.current.rotation, { y: Math.PI * 0.5, x: -0.1, duration: 1.5, ease: "power2.inOut" })
        .to(char1Ref.current.scale, { x: 0, y: 0, z: 0, duration: 0.5 }, 0)
        .to(char2Ref.current.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.7)" }, 0.2)
        .to(char3Ref.current.scale, { x: 0, y: 0, z: 0, duration: 0.5 }, 0);
    } else if (step === 2) {
      // Scene 3: Pyramid (Contact)
      tl.to(group.current.rotation, { y: -0.2, x: 0.1, duration: 1.5, ease: "power2.inOut" })
        .to(char1Ref.current.scale, { x: 0, y: 0, z: 0, duration: 0.5 }, 0)
        .to(char2Ref.current.scale, { x: 0, y: 0, z: 0, duration: 0.5 }, 0)
        .to(char3Ref.current.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.7)" }, 0.2);
    }
  }, [step]);

  useFrame((state) => {
    // Subtle float handled by <Float>, maybe add slight extra rotation
    if (group.current) {
       group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.2, 0.2]}>
        
        <group ref={char1Ref}>
           <GeometricCharacter type="cube" color="#FF8E3C" />
        </group>

        <group ref={char2Ref} scale={[0,0,0]}>
           <GeometricCharacter type="sphere" color="#FFD082" />
        </group>

        <group ref={char3Ref} scale={[0,0,0]}>
           <GeometricCharacter type="pyramid" color="#9dc0bc" />
        </group>

      </Float>
      <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} color="#FF8E3C" />
      <Environment preset="studio" />
    </group>
  );
}
