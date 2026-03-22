'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

function Eyes({ position = [0, 0, 0], offset = 0.5 }) {
  const leftEye = useRef();
  const rightEye = useRef();
  // Simple blinking state
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  useFrame((state) => {
    // Make eyes follow cursor subtly
    const { x, y } = state.mouse;
    if (leftEye.current && rightEye.current) {
      const rx = -y * 0.5;
      const ry = x * 0.5;
      leftEye.current.rotation.set(rx, ry, 0);
      rightEye.current.rotation.set(rx, ry, 0);
    }
  });

  const eyeScale = blink ? [1, 0.1, 1] : [1, 1, 1];

  return (
    <group position={position}>
      {/* Left Eye Container */}
      <group position={[-0.35, 0.2, offset]} ref={leftEye}>
        <mesh scale={eyeScale}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0, 0, 0.12]} scale={eyeScale}>
          <sphereGeometry args={[0.07, 32, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>

      {/* Right Eye Container */}
      <group position={[0.35, 0.2, offset]} ref={rightEye}>
        <mesh scale={eyeScale}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0, 0, 0.12]} scale={eyeScale}>
          <sphereGeometry args={[0.07, 32, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>
    </group>
  );
}

export default function GeometricCharacter({ type = 'cube', color = 'orange' }) {
  return (
    <group>
       {type === 'cube' && (
         <mesh>
           <boxGeometry args={[1.8, 1.8, 1.8]} />
           <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
           <Eyes offset={0.9} />
         </mesh>
       )}
       
       {type === 'sphere' && (
         <mesh>
           <sphereGeometry args={[1.1, 32, 32]} />
           <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
           <Eyes offset={1.0} />
         </mesh>
       )}
       
       {type === 'pyramid' && (
         <mesh position={[0, -0.5, 0]}>
           <coneGeometry args={[1.3, 2.2, 4]} />
           <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
           <Eyes position={[0, 0.5, 0]} offset={0.8} />
         </mesh>
       )}
    </group>
  );
}
