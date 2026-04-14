// 1. IMPORTS
// React Three Fiber (R3F) is a powerful library that lets us build 3D objects using normal React Components!
import { Canvas, useFrame } from "@react-three/fiber";
// Drei is an extension library containing specifically helpful 3D tools like Orbits, Cameras, and pre-built Sparkles
import { OrbitControls, Sparkles, Float, Environment } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
// Three.js itself handles all the incredibly complex WebGL mathematics behind the scenes
import * as THREE from "three";

// 2. 3D OBJECT COMPONENTS
// Below are multiple custom React Components, each building a unique 3D mesh for a specific character's wand.

// --- HERMIONE WAND ---
// Generate highly procedural 3D organic wand for Hermione Granger
const HermioneWand = () => {
  // useRef allows us to hook into the actual 3D Mesh object inside the physics engine
  const meshRef = useRef<THREE.Mesh>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  // useFrame is a React-Three-Fiber hook that acts just like requestAnimationFrame.
  // This code runs literally 60 times a second for every frame painted to your monitor!
  useFrame((state) => {
    if (meshRef.current) {
      // Math.sin creates a smooth up-and-down floating wave based on elapsed time
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 - 0.2;
    }
    if (pointLightRef.current) {
      // Modulates the brightness of the light on the tip for a pulsing glow
      pointLightRef.current.intensity = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.5;
    }
  });

  // useMemo runs the heavy 3D math EXACTLY ONCE and caches the resulting Geometry
  const geometry = useMemo(() => {
    // Basic tapering cylinder: topRadius, bottomRadius, height, radialSeg, heightSeg
    // Using high density so our 3D math has a lot of vertices to mold organically
    const geo = new THREE.CylinderGeometry(0.012, 0.07, 3.8, 64, 150);
    const pos = geo.attributes.position;
    
    // We bend and twist the straight cylinder mathematically
    for(let i=0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      // Crooked natural branch bending
      const dx = Math.sin(y * 1.6) * 0.05;
      const dz = Math.cos(y * 2.1) * 0.04;

      // Calculate localized angle and distance around the cylinder slice
      const angle = Math.atan2(z, x);
      let radiusMultiplier = 1;

      // --- HANDLE REGION (Bottom) ---
      if (y < -0.5) {
        // Spiral weaving roots / twisting carved branches pattern using complex sine waves
        const spirals = Math.sin(angle * 4 + y * 10);
        const secondarySpirals = Math.cos(angle * 3 - y * 6);
        
        // Accumulate bumps only when positive to look like distinct wrapped roots
        let bump = 0;
        if (spirals > 0) bump += spirals * 0.5;
        if (secondarySpirals > 0) bump += secondarySpirals * 0.3;
        
        radiusMultiplier += bump;

        // Pommel (swelling bulb) at the very base to balance weight
        if (y < -1.6) {
          radiusMultiplier += Math.pow((-1.6 - y) * 3, 2); 
        }
        
        // Main Guard ring separating handle from shaft
        if (y > -0.65 && y < -0.45) {
           const guardScale = Math.sin((y - (-0.65)) / 0.2 * Math.PI);
           radiusMultiplier += guardScale * 0.8; // Stick out heavily
        }

      } else {
        // --- SHAFT REGION (Middle & Top) ---
        // Wood grain organic roughness / subtle imperfections
        const bark = Math.sin(angle * 15 + y * 35) * Math.cos(angle * 6 + y * 12);
        radiusMultiplier += bark * 0.04; 

        // Add a realistic organic 'knot' (like a cut-off small branch) halfway up
        const knotY = 0.5;
        const knotAngle = Math.PI / 1.5;
        const distToKnot = Math.sqrt(Math.pow(y - knotY, 2) + Math.pow(angle - knotAngle, 2));
        if (distToKnot < 0.25) {
          radiusMultiplier += Math.max(0, (0.25 - distToKnot) * 2.0); // sharp bump
        }
      }

      // Re-apply radius modifier radiating outwards from the curved center
      const newX = (x * radiusMultiplier) + dx;
      const newZ = (z * radiusMultiplier) + dz;

      pos.setX(i, newX);
      pos.setZ(i, newZ);
    }
    
    // Crucial for letting light bounce properly off our new organic bumpy curves
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Compute the absolute wand tip offset (y = 1.9) dynamically to place the light physically correctly
  const tipDx = Math.sin(1.9 * 1.6) * 0.05 * 1.2;
  const tipDz = Math.cos(1.9 * 2.1) * 0.04 * 1.2;

  // We group everything together into one transformable chunk!
  return (
    <group rotation={[0, 0, Math.PI / 3.5]} position={[0, -0.2, 0]} scale={[1.2, 1.2, 1.2]}>
      {/* Procedural Wand Mesh with High Quality Wood Material */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial 
          color="#8c4720" // Beautiful warm golden-reddish wood matching the image
          emissive="#240c00" 
          emissiveIntensity={0.5}
          roughness={0.65} // Authentic wood
          metalness={0.08} // Gives it that slight hand-polished sheen
          clearcoat={0.35} 
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Wand Tip Glow/Energy matching positional bend */}
      <mesh position={[tipDx, 2.05, tipDz]}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#d4af37" emissiveIntensity={4} />
        {/* Soft pulsating aura (a real 3D lightsource) */}
        <pointLight ref={pointLightRef} distance={2.5} intensity={1.5} color="#d4af37" />
      </mesh>

      {/* Ambient Magical Particles at Tip */}
      <Sparkles count={30} scale={0.3} size={4} speed={0.8} opacity={0.9} position={[tipDx, 1.9, tipDz]} color="#ffeba8" />
    </group>
  );
};

// --- RON WEASLEY WAND ---
const RonWand = () => {
  const meshRef = useRef<THREE.Group>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 - 0.2;
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.015, 0.05, 3.8, 64, 150);
    const pos = geo.attributes.position;
    
    for(let i=0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);

        let radiusMultiplier = 1;
        const angle = Math.atan2(z, x);

        // Handle area matching the image
        if (y < -0.8) {
            // Rougher bark-like texture on the handle
            const bark = Math.sin(angle * 10 + y * 20) * Math.cos(angle * 5);
            radiusMultiplier += bark * 0.08;

            // Flat blunt base
            if (y < -1.8) {
                radiusMultiplier += (-1.8 - y) * 2;
            }
            
            // Adding the two carved rings shown in the image
            if (y > -1.75 && y < -1.65) radiusMultiplier += 0.3; // Ring 1
            if (y > -1.55 && y < -1.45) radiusMultiplier += 0.3; // Ring 2
            
            // The frayed bark/leaves bursting out at the top of the handle
            if (y > -1.1 && y < -0.8) {
                 const fray = Math.sin(angle * 6);
                 const progress = (y - (-1.1)) / 0.3; // 0 to 1
                 if (fray > 0) radiusMultiplier += fray * 1.5 * progress; 
            }
        } else {
             // Shaft - smoother wood with slight grain
             const bark = Math.sin(angle * 8 + y * 15);
             radiusMultiplier += bark * 0.02;
        }

        // Slight organic bend near the top half
        const dx = (y > 0) ? Math.sin(y * 1.5) * 0.05 : 0;
        const dz = (y > 0) ? Math.cos(y * 2.0) * 0.04 - 0.04 : 0;

        pos.setX(i, (x * radiusMultiplier) + dx);
        pos.setZ(i, (z * radiusMultiplier) + dz);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const tipDx = Math.sin(1.9 * 1.5) * 0.05 * 1.35;
  const tipDz = (Math.cos(1.9 * 2.0) * 0.04 - 0.04) * 1.35;

  return (
    <group ref={meshRef} rotation={[0, 0, Math.PI / 3.5]} position={[0, -0.2, 0]} scale={[1.35, 1.35, 1.35]}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial 
          color="#663311" // Warm, richer mid-tone brown
          emissive="#1a0d05" 
          emissiveIntensity={0.2}
          roughness={0.6} // Better reflection
          clearcoat={0.3} // Give a bit more depth so it's not completely flat
          clearcoatRoughness={0.4}
        />
      </mesh>
      
      {/* Subtle duller glow since it's an older/sturdier wand */}
      <mesh position={[tipDx, 2.0, tipDz]}>
        <pointLight ref={pointLightRef} distance={2.0} intensity={1} color="#ffb84d" />
      </mesh>
      <Sparkles count={20} scale={0.5} size={2} speed={0.4} opacity={0.4} position={[0, 0.5, 0]} color="#ffb84d" />
    </group>
  );
};

// --- HARRY POTTER WAND ---
const HarryWand = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 - 0.2;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.018, 0.055, 3.8, 64, 150); // Thicker top and bottom for appropriate scaling
    const pos = geo.attributes.position;
    
    for(let i=0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);

        let radiusMultiplier = 1;

        // Handle area matching the image: deep spherical ridges
        if (y < -0.8) {
            // Intense deep grooves via sharp sine wave absolute values
            const bumps = Math.sin((y - (-1.8)) * 35); 
            radiusMultiplier += Math.abs(bumps) * 0.8; // Reduced thickness of bumps
            
            // Flat pommel taper
            if (y < -1.75) {
                radiusMultiplier -= (-1.75 - y) * 10; // Moderated flat taper
            }
        } 
        // Small guard where the feathers attach
        else if (y > -0.8 && y < -0.6) {
             radiusMultiplier += Math.sin((y - (-0.8)) * Math.PI / 0.2) * 0.4;
        }
        else {
             // Shaft - long straight grain
             const angle = Math.atan2(z, x);
             const grain = Math.sin(angle * 12 + y * 5);
             radiusMultiplier += grain * 0.06;
        }

        pos.setX(i, x * radiusMultiplier);
        pos.setZ(i, z * radiusMultiplier);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Pre-calculate the phoenix feathers radially
  const feathers = useMemo(() => {
      const arr = [];
      for(let i=0; i<60; i++) {
          const angle = (i / 60) * Math.PI * 2;
          const tilt = (Math.PI / 2) - Math.random() * 0.7; // angle them mostly outwards, slightly upwards
          const length = 0.5 + Math.random() * 0.4;
          const isRed = Math.random() > 0.4;
          arr.push({ angle, tilt, length, isRed });
      }
      return arr;
  }, []);

  return (
    // Re-centered pivot (removed the position offset so it spins directly around its center perfectly)
    <group ref={meshRef} rotation={[0, 0, Math.PI / 3.5]} position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial 
          color="#422518" // Slightly lighter and richer brown so details are visible
          emissive="#150500" 
          roughness={0.65} // Less dull
          clearcoat={0.3} // Give it a finished, magical varnished look
        />
      </mesh>
      
      {/* Phoenix Feathers Cluster */}
      <group position={[0, -0.65, 0]}>
        {feathers.map((f, i) => (
           <group key={i} rotation={[0, f.angle, f.tilt]}>
              <mesh position={[0, f.length / 2, 0]}>
                 <coneGeometry args={[0.005, f.length, 4]} />
                 <meshStandardMaterial 
                    color={f.isRed ? "#ff2a00" : "#ffaa00"} 
                    emissive={f.isRed ? "#330000" : "#331100"} 
                 />
              </mesh>
           </group>
        ))}
      </group>

      {/* Magical fire aura at the feather hilt, reduced in size to not obscure wand */}
      <Sparkles count={30} scale={0.4} size={1.5} speed={0.5} opacity={0.6} position={[0, -0.65, 0]} color="#ff4400" />
      <Sparkles count={15} scale={0.2} size={1.5} speed={0.4} opacity={0.6} position={[0, 1.9, 0]} color="#ffffff" />
    </group>
  );
};

// --- ELDER WAND ---
const ElderWand = () => {
  const meshRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 - 0.2;
    }
    if (glowRef.current) {
      // The Elder Wand has a more intense, ominous pulse
      glowRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 6) * 0.8;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.01, 0.045, 4.0, 64, 250);
    const pos = geo.attributes.position;
    const colors = [];
    const colorObj = new THREE.Color();

    for(let i=0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);

        let radiusMultiplier = 1;
        let isGold = false;

        // Elder Wand Nodes (The distinct bulges)
        const nodes = [-1.9, -1.35, -0.7, -0.1, 0.5, 1.1];
        let nodeInfluence = 0;
        
        for (let ny of nodes) {
            const dist = Math.abs(y - ny);
            if (dist < 0.18) {
                // Creates a smooth spherical bulge
                const bulge = Math.cos((dist / 0.18) * Math.PI / 2);
                nodeInfluence = Math.max(nodeInfluence, bulge * 1.5);
                
                // The center of each bulge has intricate golden rings
                if (dist < 0.05) {
                    isGold = true;
                }
                // Double ring at the big nodes
                if (dist > 0.08 && dist < 0.11 && ny > -1.5) {
                    isGold = true;
                }
            }
        }

        // Tapering
        const taper = 1.0 - ((y + 2) / 4.2) * 0.4;
        
        radiusMultiplier = taper + (nodeInfluence * 0.8);

        const angle = Math.atan2(z, x);

        // Organic swirling carved vines in the dark wood sections
        if (!isGold) {
            const swirl = Math.sin(angle * 4 + y * 12) * Math.cos(angle * 2 - y * 6);
            radiusMultiplier += swirl * 0.1;
            // Very dark ebony wood
            colorObj.setHex(0x181210);
        } else {
            // Gold ring intricate details / filigree
            const filigree = Math.sin(angle * 24) * Math.cos(y * 120);
            radiusMultiplier += filigree * 0.06;
            // Yellow gold
            colorObj.setHex(0xebd183); 
        }

        // The Elder Wand leans and curves slightly ominously
        const dx = Math.sin(y * 2.0) * 0.04;
        const dz = Math.cos(y * 1.5) * 0.03;

        pos.setX(i, x * radiusMultiplier + dx);
        pos.setZ(i, z * radiusMultiplier + dz);

        colors.push(colorObj.r, colorObj.g, colorObj.b);
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  const tipDx = Math.sin(2.0 * 2.0) * 0.04 * 1.2;
  const tipDz = Math.cos(2.0 * 1.5) * 0.03 * 1.2;

  return (
    <group ref={meshRef} rotation={[0, 0, Math.PI / 3.5]} position={[0, -0.2, 0]} scale={[1.2, 1.2, 1.2]}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial 
          vertexColors={true}
          roughness={0.4} // Smooth enough to reflect brilliantly
          metalness={0.5} // Balances gold and glossy ebony wood
          clearcoat={0.8} // Glossy varnished look
          clearcoatRoughness={0.2}
          emissive="#110500"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Intense White/Blue Elder Magic Glow */}
      <mesh position={[tipDx, 2.1, tipDz]}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#a3d5ff" emissiveIntensity={5} />
        <pointLight ref={glowRef} distance={3.0} intensity={2} color="#a3d5ff" />
      </mesh>

      <Sparkles count={40} scale={0.4} size={3} speed={1.0} opacity={0.7} position={[0, 0.5, 0]} color="#ffffff" />
      <Sparkles count={30} scale={0.2} size={2} speed={1.5} opacity={0.9} position={[tipDx, 2.0, tipDz]} color="#a3d5ff" />
    </group>
  );
};

// --- VOLDEMORT WAND ---
const VoldemortWand = () => {
  const meshRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 - 0.2;
    }
    if (glowRef.current) {
      // Sinister pulsing
      glowRef.current.intensity = 2.0 + Math.sin(state.clock.elapsedTime * 8) * 0.8;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.008, 0.045, 4.2, 64, 250);
    const pos = geo.attributes.position;
    const colors = [];
    const colorObj = new THREE.Color();

    for(let i=0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);

        let radiusMultiplier = 1;
        const angle = Math.atan2(z, x);

        // Sinister carved dark pommel
        if (y < -1.6) {
             colorObj.setHex(0x1a1a1a); // nearly black
             
             // The very bottom gold spike
             if (y < -1.95) {
                 colorObj.setHex(0xd4af37);
                 radiusMultiplier -= (-1.95 - y) * 15; 
             } else {
                 // Deep carved runic noise
                 const carving = Math.sin(angle * 12) * Math.cos(y * 40);
                 radiusMultiplier += Math.abs(carving) * 0.4;
                 
                 // taper towards the spike
                 if (y < -1.8) {
                     radiusMultiplier -= (-1.8 - y) * 3;
                 }
                 // Gold ring separating pommel from handle
                 if (y > -1.65 && y < -1.6) {
                     colorObj.setHex(0xd4af37);
                     radiusMultiplier += 0.2;
                 }
             }
        } 
        // Bone-like / Yew wood handle
        else if (y >= -1.6 && y < -0.5) {
             colorObj.setHex(0x522714); // rich reddish brown (yew wood)
             
             // Bone-like grooves (vertical organic flow)
             const boneGroove = Math.sin(angle * 6);
             radiusMultiplier += Math.abs(boneGroove) * 0.15;

             // Middle dark gnarly root wrap ring
             if (y > -1.15 && y < -1.0) {
                 colorObj.setHex(0x1a1a1a);
                 radiusMultiplier += Math.sin(angle * 12 + y * 60) * 0.25 + 0.15;
             }
             
             // Top Gold collar before shaft
             if (y > -0.65 && y < -0.5) {
                 colorObj.setHex(0xd4af37);
                 radiusMultiplier += 0.15;
                 if (y > -0.6) radiusMultiplier -= (y - (-0.6)) * 3; // slope quickly down to shaft
             }
        }
        else {
             // Shaft
             // Start brown, transition directly into a glowing bright green at the tip
             const shaftProgress = Math.max(0, (y - (-0.5)) / 2.6); // 0 to 1
             const woodColor = new THREE.Color(0x6e3318);
             const tipColor = new THREE.Color(0xaaff00);
             
             // Exponential blend so only the tip turns bright green
             colorObj.copy(woodColor).lerp(tipColor, Math.pow(shaftProgress, 4)); 

             // Exceptionally smooth curve, tiny subtle grain
             radiusMultiplier += Math.sin(angle * 10) * 0.01;
        }

        // Voldemort's wand is perfectly, unnaturally straight, no organic bends.
        pos.setX(i, x * radiusMultiplier);
        pos.setZ(i, z * radiusMultiplier);

        colors.push(colorObj.r, colorObj.g, colorObj.b);
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group ref={meshRef} rotation={[0, 0, Math.PI / 3.5]} position={[0, -0.2, 0]} scale={[1.2, 1.2, 1.2]}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial 
          vertexColors={true}
          roughness={0.2} // Unnaturally smooth and polished
          metalness={0.15}
          clearcoat={0.6} 
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Killing Curse Green Aura at tip */}
      <mesh position={[0, 2.1, 0]}>
        <pointLight ref={glowRef} distance={4.5} intensity={3} color="#22ff00" />
      </mesh>

      <Sparkles count={60} scale={0.3} size={2} speed={1.5} opacity={0.6} position={[0, 0.5, 0]} color="#55ff22" />
      <Sparkles count={40} scale={0.15} size={4} speed={2.5} opacity={1} position={[0, 2.0, 0]} color="#00ff00" />
    </group>
  );
};

// --- RANDOM DRAGON POPLAR WAND ---
const PoplarWand = () => {
  const meshRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 - 0.2;
    }
    if (glowRef.current) {
      glowRef.current.intensity = 1.0 + Math.sin(state.clock.elapsedTime * 5) * 0.5;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.008, 0.05, 4.0, 64, 250);
    const pos = geo.attributes.position;
    
    for(let i=0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);

        let radiusMultiplier = 1;
        const angle = Math.atan2(z, x);

        // Handle Base Cord wrap (at the very bottom)
        if (y < -1.6) {
             // Deeply twisted cord wrap effect
             const cord = Math.sin(angle * 6 + y * 80) * Math.cos(angle * 2 - y * 40);
             radiusMultiplier += Math.abs(cord) * 0.4;
             
             // Blunt base cap
             if (y < -1.95) {
                 radiusMultiplier -= (-1.95 - y) * 20;
             }
        } 
        // Middle Guard Ring (distinct projecting ring in the middle of the wand)
        else if (y > -0.25 && y < -0.15) {
             const ringScale = Math.sin((y - (-0.25)) / 0.1 * Math.PI);
             radiusMultiplier += ringScale * 1.5; // very prominent ring
        }
        else {
             // Twisted carved deep wood grain across the entire body
             const twist = Math.sin(angle * 8 + y * 18);
             radiusMultiplier += Math.abs(twist) * 0.15;
        }

        // Bending
        let dx = 0;
        let dz = 0;

        // The wand has a sudden sharp organic curve in the upper half of the shaft
        // mapping a curve only when y > 0
        if (y > 0) {
             // Sharp S-curve bend offset
             dx = Math.sin(y * 2.2) * 0.18;
             dz = (Math.cos(y * 1.8) - 1) * 0.15;
        }

        pos.setX(i, x * radiusMultiplier + dx);
        pos.setZ(i, z * radiusMultiplier + dz);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  // Compute the exact tip offset from the math above to pin the glow light accurately
  const tipDx = Math.sin(2.0 * 2.2) * 0.18 * 1.2;
  const tipDz = (Math.cos(2.0 * 1.8) - 1) * 0.15 * 1.2;

  return (
    <group ref={meshRef} rotation={[0, 0, Math.PI / 3.5]} position={[0, -0.2, 0]} scale={[1.2, 1.2, 1.2]}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial 
          color="#151515" // All dark charcoal black wood
          roughness={0.8} // Very matte and carved
          metalness={0.0}
          clearcoat={0.0} // No polish, very natural raw dark wood
        />
      </mesh>
      
      {/* Phoenix Core Fire Aura - since it's a dark wood with a phoenix core, give it fiery sparks */}
      <mesh position={[tipDx, 2.0, tipDz]}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ff4400" emissiveIntensity={4} />
        <pointLight ref={glowRef} distance={3.5} intensity={1.5} color="#ffaa00" />
      </mesh>

      <Sparkles count={45} scale={0.4} size={3} speed={0.8} opacity={0.7} position={[0, 0.5, 0]} color="#ff4400" />
      <Sparkles count={25} scale={0.2} size={4} speed={1.2} opacity={0.9} position={[tipDx, 1.9, tipDz]} color="#ffaa00" />
    </group>
  );
};

// 3. MAIN EXPORT WRAPPER COMPONENT
// This sets up the actual camera, lights, and physics environment.

// --- NIMBUS 2001 BROOM ---
const Nimbus2001Broom = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 - 0.2;
    }
  });

  // Handle Geometry
  const handleGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.015, 0.045, 4.8, 64, 100);
    const pos = geo.attributes.position;
    
    for(let i=0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);

        let dx = x;
        let dy = y;
        let dz = z;

        // Flatten paddle tip
        if (y > 1.8) {
            // from 1.8 to 2.4, gradually spread X and squash Z
            const progress = (y - 1.8) / 0.6; // 0 to 1
            const spread = Math.sin(progress * Math.PI) * 0.08; // bulge out X
            const flat = Math.sin(progress * Math.PI) * 0.012;  // squash Z
            dx += Math.sign(x) * spread;
            if (z > 0) dz -= flat; else dz += flat;
        }

        // Extremely sleek, no wavy noise! Perfect polished cylinder
        pos.setX(i, dx);
        pos.setZ(i, dz);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Procedural Bristles
  const bristleGeo = useMemo(() => {
    // We start with a perfect cylinder and bulge it into an aerodynamic teardrop
    const geo = new THREE.CylinderGeometry(0.01, 0.01, 3.2, 64, 64);
    geo.translate(0, -1.6, 0); 
    const pos = geo.attributes.position;
    
    // We use vertex colors to create the precise gradient
    const colors = new Float32Array(pos.count * 3);
    
    for(let i=0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        
        const angle = Math.atan2(z, x);
        
        // Teardrop shape! 
        // 0 to -3.2. Peak bulge around -0.6
        const ny = Math.abs(y / 3.2); // 0 to 1
        let bulge = 0;
        if (ny <= 0.25) { // top part widens quickly
            bulge = Math.sin((ny / 0.25) * (Math.PI / 2)) * 0.35;
        } else { // bottom part tapers slowly to a sharp point
            bulge = Math.cos(((ny - 0.25) / 0.75) * (Math.PI / 2)) * 0.35;
        }
        
        // Smooth layered strands noise instead of chaotic messy twigs
        const strandNoise = (Math.sin(angle * 80) + Math.sin(angle * 140)) * 0.008;
        
        pos.setX(i, x + Math.cos(angle) * (bulge + strandNoise));
        pos.setZ(i, z + Math.sin(angle) * (bulge + strandNoise));

        // Colors: Pitch black fading to a yellowish tint at the absolute tip
        let r = 0.05, g = 0.05, b = 0.05; // sleek charcoal black
        if (y < -2.8) { // bottom 0.4 units
            const blend = Math.pow(Math.abs(y + 2.8) / 0.4, 1.5); // 0 to 1 scaling exponentially
            r += blend * 0.7; // yellow-olive glow
            g += blend * 0.6;
            b += blend * 0.2;
        }
        colors[i*3] = r;
        colors[i*3+1] = g;
        colors[i*3+2] = b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group ref={meshRef} rotation={[0, Math.PI / 4, Math.PI / 3.5]} position={[0, -0.5, 0]} scale={[0.8, 0.8, 0.8]}>
      
      {/* Broom Handle */}
      <mesh geometry={handleGeo} position={[0, 0.5, 0]}>
        <meshPhysicalMaterial 
          color="#151515" // matte charcoal
          roughness={0.7}
          metalness={0.3}
          clearcoat={0.1}
        />
      </mesh>

      {/* Paddle Emblem Logo at the tip */}
      <mesh position={[0, 2.65, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
         <cylinderGeometry args={[0.04, 0.04, 0.01, 32]} />
         <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} emissive="#665500" />
      </mesh>
      
      {/* Broom Tail (Bristles: highly aerodynamic teardrop) */}
      <mesh geometry={bristleGeo} position={[0, -1.5, 0]}>
        <meshPhysicalMaterial 
          vertexColors={true}
          roughness={0.2} // intensely smooth and slick
          metalness={0.15}
          clearcoat={0.4} // looks laminated/magically compacted
        />
      </mesh>
      
      {/* Heavy-Duty Silver Metal Binding */}
      <mesh position={[0, -1.6, 0]}>
         <cylinderGeometry args={[0.11, 0.14, 0.25, 32, 10]} />
         <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.4} wireframe={true} />
      </mesh>
      <mesh position={[0, -1.6, 0]}>
         <cylinderGeometry args={[0.10, 0.13, 0.25, 32]} />
         <meshStandardMaterial color="#d4d4d4" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Side Supports & Stirrups */}
      <group position={[0, -1.6, 0]}>
         {/* Left leg extension */}
         <mesh position={[0.18, -0.2, 0]} rotation={[0, 0, -0.4]}>
            <cylinderGeometry args={[0.015, 0.015, 0.4, 16]} />
            <meshStandardMaterial color="#d4d4d4" metalness={0.9} roughness={0.3} />
         </mesh>
         {/* Left Footrest */}
         <mesh position={[0.25, -0.38, 0]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.08, 0.02, 0.04]} />
            <meshStandardMaterial color="#d4d4d4" metalness={0.9} roughness={0.3} />
         </mesh>

         {/* Right leg extension */}
         <mesh position={[-0.18, -0.2, 0]} rotation={[0, 0, 0.4]}>
            <cylinderGeometry args={[0.015, 0.015, 0.4, 16]} />
            <meshStandardMaterial color="#d4d4d4" metalness={0.9} roughness={0.3} />
         </mesh>
         {/* Right Footrest */}
         <mesh position={[-0.25, -0.38, 0]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.08, 0.02, 0.04]} />
            <meshStandardMaterial color="#d4d4d4" metalness={0.9} roughness={0.3} />
         </mesh>
      </group>

      {/* Intense racing particles ONLY around the tail tip */}
      <Sparkles count={40} scale={1.0} size={1.5} speed={2.0} opacity={0.6} position={[0, -4.5, 0]} color="#ffdd77" />
    </group>
  );
};
// --- FIREBOLT BROOM ---
const FireboltBroom = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 - 0.2;
    }
  });

  // Handle Geometry
  const handleGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.015, 0.05, 4.8, 64, 100);
    const pos = geo.attributes.position;
    
    for(let i=0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);

        let radiusMultiplier = 1;
        const angle = Math.atan2(z, x);
        
        // Subtle indentations for wood grain/realism
        radiusMultiplier += Math.sin(y * 30 + angle * 4) * 0.03;
        
        // Thicker base where it meets bristles
        if (y < -1.5) {
            radiusMultiplier += (-1.5 - y) * 0.15;
            if (y < -2.2) radiusMultiplier += 0.2;
        }
        
        // Leather wrapping indentations in the grip area (y: 0.2 to 1.5)
        if (y > 0.2 && y < 1.5) {
            radiusMultiplier += 0.08 + Math.sin(y * 80) * 0.02; 
        }
        
        // Sharp taper at the front
        if (y > 1.5) {
            radiusMultiplier -= (y - 1.5) * 0.3;
        }

        // Bending the broom handle for a sharp, aggressive curve
        let dx = 0;
        let dz = 0;
        if (y > 0) {
            dx = Math.sin(y * 0.9) * 0.25;
            dz = (Math.cos(y * 0.6) - 1) * 0.15;
        } else {
            dx = Math.sin(y * 1.5) * 0.08;
        }

        pos.setX(i, x * radiusMultiplier + dx);
        pos.setZ(i, z * radiusMultiplier + dz);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Glow lines spiral geometry
  const glowCurve = useMemo(() => {
      const points = [];
      for (let y = -1.4; y <= 2.2; y += 0.05) {
          let dx = 0;
          let dz = 0;
          if (y > 0) {
              dx = Math.sin(y * 0.9) * 0.25;
              dz = (Math.cos(y * 0.6) - 1) * 0.15;
          } else {
              dx = Math.sin(y * 1.5) * 0.08;
          }
          // The radius maps to the cylinder width closely
          const radius = 0.052 + Math.abs(y * 0.005);
          const spiralX = dx + Math.cos(y * 15) * radius;
          const spiralZ = dz + Math.sin(y * 15) * radius;
          points.push(new THREE.Vector3(spiralX, y, spiralZ));
      }
      return new THREE.CatmullRomCurve3(points);
  }, []);

  // Procedural Bristles
  const bristleGeo = useMemo(() => {
    // Wider base for more spread
    const geo = new THREE.ConeGeometry(0.35, 3.2, 64, 40);
    geo.translate(0, -1.6, 0); // shift down
    
    const pos = geo.attributes.position;
    for(let i=0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        
        const angle = Math.atan2(z, x);
        
        // Sweep backwards
        const sweepZ = Math.pow(Math.abs(y), 1.6) * 0.08;
        
        // Spread the tail more at the very bottom
        // y goes down to about -3.2. So from -2.0 downwards, spread out
        let spread = 0;
        if (y < -2.0) {
            spread = Math.pow(Math.abs(y + 2.0), 1.5) * 0.15;
        }
        
        // Lots of noise for straw/twigs (making it brush-like)
        const twigNoise = Math.sin(angle * 100 + y * 25) * Math.cos(angle * 50 - y * 35);
        // Even finer noise for realism
        const microNoise = Math.sin(angle * 200) * 0.01;
        
        const noiseIntensity = 0.03 + Math.abs(y) * 0.05;
        
        pos.setX(i, x + Math.cos(angle) * (twigNoise * noiseIntensity + spread + microNoise));
        pos.setZ(i, z + Math.sin(angle) * (twigNoise * noiseIntensity + spread + microNoise) + sweepZ);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group ref={meshRef} rotation={[0, Math.PI / 4, Math.PI / 3.5]} position={[0, -0.5, 0]} scale={[0.8, 0.8, 0.8]}>
      
      {/* Broom Handle */}
      <mesh geometry={handleGeo} position={[0, 0.5, 0]}>
        <meshPhysicalMaterial 
          color="#110802" // Darker tone for realism
          roughness={0.4}
          metalness={0.1}
          clearcoat={0.3}
        />
      </mesh>

      {/* Glow lines along the handle */}
      <mesh position={[0, 0.5, 0]}>
          <tubeGeometry args={[glowCurve, 150, 0.004, 8, false]} />
          <meshBasicMaterial color="#ffaa00" toneMapped={false} />
      </mesh>
      
      {/* Broom Tail (Bristles: twigs / straw / synthetic fibers) */}
      <mesh geometry={bristleGeo} position={[0, -2.0, 0]}>
        <meshPhysicalMaterial 
          color="#2a1708" // Darker brown for the straw/twigs realism
          roughness={0.95}
          metalness={0.0}
        />
      </mesh>
      
      {/* Wire band that holds the bristles together */}
      <mesh position={[0, -1.9, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.08, 0.015, 16, 32]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.7} />
      </mesh>
      <mesh position={[0, -2.1, 0]} rotation={[Math.PI/2, 0.05, 0]}>
        <torusGeometry args={[0.09, 0.012, 16, 32]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.7} />
      </mesh>
      
      {/* Magical foot pedals (Stirrups) */}
      <group position={[0, -1.8, 0.12]} rotation={[0.5, 0, 0]}>
         <mesh position={[0.2, -0.5, 0]} rotation={[0, 0, -0.6]}>
            <cylinderGeometry args={[0.012, 0.012, 1.2, 8]} />
            <meshStandardMaterial color="#b5b5b5" metalness={0.95} roughness={0.3} />
         </mesh>
         <mesh position={[-0.2, -0.5, 0]} rotation={[0, 0, 0.6]}>
            <cylinderGeometry args={[0.012, 0.012, 1.2, 8]} />
            <meshStandardMaterial color="#b5b5b5" metalness={0.95} roughness={0.3} />
         </mesh>
      </group>

      {/* Intense racing particles ONLY around the tail */}
      <Sparkles count={80} scale={2.5} size={3} speed={4.0} opacity={0.6} position={[0, -4.5, 0.5]} color="#ffaa00" />
    </group>
  );
};

// --- NIMBUS 2000 BROOM ---
const NimbusBroom = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 - 0.2;
    }
  });

  // Handle Geometry
  const handleGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.015, 0.045, 5.0, 32, 100);
    const pos = geo.attributes.position;
    
    for(let i=0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);

        let radiusMultiplier = 1;
        const angle = Math.atan2(z, x);

        // Subtler wood grain noise
        radiusMultiplier += Math.sin(y * 60 + angle * 2) * 0.015;

        // Front Tip: Flattens out into an aerodynamic paddle
        let dz = 0;
        let dx_paddle = 0;
        if (y > 2.0) {
            const flatten = (y - 2.0) / 0.5; // 0 to ~1
            radiusMultiplier += flatten * 0.06; // flare out X slightly
            dz -= flatten * 0.04;               // squash Z (thickness)
            dx_paddle -= flatten * 0.02;        // tilt the paddle slightly
        }

        // Exact profile curve of the Nimbus 2000:
        // Straight near the bristles (y < -0.5)
        // Sharp S-bend upwards (-0.5 to 1.2)
        // Straight but parallel offset towards the tip (y > 1.2)
        let dx_curve = 0;
        if (y > -0.5 && y < 1.2) {
            // Smoothstep from 0 to 1
            const t = (y + 0.5) / 1.7; 
            const smooth = t * t * (3 - 2 * t);
            dx_curve = smooth * 0.45; // peak offset
        } else if (y >= 1.2) {
            dx_curve = 0.45; 
        }

        // Taper back down slightly at the very connection point
        if (y < -1.5) {
            radiusMultiplier -= Math.abs(y + 1.5) * 0.1;
        }

        pos.setX(i, x * radiusMultiplier + dx_curve + dx_paddle);
        pos.setZ(i, z * radiusMultiplier + dz);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Procedural Bristles
  const bristleGeo = useMemo(() => {
    // Start with a smooth cylinder and math-warp it into a bundle
    const geo = new THREE.CylinderGeometry(0.01, 0.01, 2.5, 64, 64);
    geo.translate(0, -1.25, 0); 
    
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    for(let i=0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        
        const angle = Math.atan2(z, x);
        
        // Teardrop / Witch's broom bulge
        // Bulge strongly at the top and taper smoothly down
        const ny = Math.abs(y / 2.5); // 0 to 1 (0 is top, 1 is tip)
        
        // Shift the peak bulge up higher (near ny = 0.3)
        let bulge = 0;
        if (ny < 0.3) {
            bulge = Math.sin((ny / 0.3) * (Math.PI / 2)) * 0.28;
        } else {
            bulge = Math.cos(((ny - 0.3) / 0.7) * (Math.PI / 2)) * 0.28;
        }

        // Horizontal binding compression logic 
        // Let's squeeze it where the bindings will go to make it look tightly bound
        if (ny > 0.05 && ny < 0.2) {
           bulge *= 0.95;
        }

        // Heavy sweeping twig noise
        const twigNoise = Math.sin(angle * 60 + y * 15) * Math.cos(angle * 40 - y * 35);
        const noiseIntensity = 0.02 + Math.abs(y) * 0.03;
        
        // Final position
        pos.setX(i, x + Math.cos(angle) * (bulge + twigNoise * noiseIntensity));
        pos.setZ(i, z + Math.sin(angle) * (bulge + twigNoise * noiseIntensity));

        // Color variation for twigs (light + dark natural straw/brown strands)
        let r = 0.40 + Math.sin(angle * 70) * 0.05;
        let g = 0.22 + Math.sin(angle * 30) * 0.04;
        let b = 0.12 + Math.sin(angle * 50) * 0.02;
        
        // Darken near the top where it's bound tightly
        if (ny < 0.2) {
            r *= 0.7; g *= 0.7; b *= 0.7;
        }
        
        colors[i*3] = r;
        colors[i*3+1] = g;
        colors[i*3+2] = b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Distinct brass kickstand curve matching the image perfectly
  const kickstandLeft = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),         // attached to binding
      new THREE.Vector3(-0.1, -0.4, 0),   // drops down and forwards
      new THREE.Vector3(-0.4, -0.8, -0.2),// sweeps heavily back and left
      new THREE.Vector3(-0.25, -1.0, -0.2),// hook loops down
      new THREE.Vector3(-0.4, -1.05, -0.2) // rests cleanly on surface
    ]);
  }, []);
  
  const kickstandRight = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),         
      new THREE.Vector3(-0.1, -0.4, 0),   
      new THREE.Vector3(-0.4, -0.8, 0.2), // sweeps heavily back and right
      new THREE.Vector3(-0.25, -1.0, 0.2),// hook loops down
      new THREE.Vector3(-0.4, -1.05, 0.2) // rests cleanly on surface
    ]);
  }, []);

  return (
    // Reoriented slightly based on the sharp visual curve so it levels out nicely in the viewer
    <group ref={meshRef} rotation={[0, Math.PI / 4, Math.PI / 3.0]} position={[-0.3, -0.2, 0]} scale={[0.8, 0.8, 0.8]}>
      
      {/* Broom Handle */}
      <mesh geometry={handleGeo} position={[0, 0.5, 0]}>
        <meshPhysicalMaterial 
          color="#5e2b17" // Rich, classic polished mahogany
          roughness={0.45}
          metalness={0.05}
          clearcoat={0.3} // Semi-gloss traditional finish
        />
      </mesh>

      {/* Front Tip Emblem Engraving ("Nimbus 2000" text representation) */}
      <mesh position={[0.45, 2.7, 0.05]} rotation={[0, 0, -0.7]}>
         <planeGeometry args={[0.08, 0.03]} />
         <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Broom Tail (Bristles) */}
      <mesh geometry={bristleGeo} position={[0, -1.7, 0]}>
        <meshPhysicalMaterial 
          vertexColors={true}
          roughness={1.0} // Fully organic matte twigs
          clearcoat={0.0}
        />
      </mesh>

      {/* Top golden cap between handle and bristles */}
      <mesh position={[0, -1.68, 0]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.06, 32]} />
        <meshStandardMaterial color="#c29836" metalness={0.9} roughness={0.3} />
      </mesh>
      
      {/* Multiple polished golden rings */}
      <mesh position={[0, -1.80, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.13, 0.015, 16, 32]} />
        <meshStandardMaterial color="#c29836" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.92, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.155, 0.015, 16, 32]} />
        <meshStandardMaterial color="#c29836" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0, -2.04, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.165, 0.015, 16, 32]} />
        <meshStandardMaterial color="#c29836" metalness={0.9} roughness={0.3} />
      </mesh>
      
      {/* Intricate Brass Kickstand attached to middle ring */}
      <group position={[0, -1.92, 0]}>
         {/* Attachment lug */}
         <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.08, 16]} />
            <meshStandardMaterial color="#c29836" metalness={0.9} roughness={0.3} />
         </mesh>

         {/* Left flowing brass wire leg */}
         <mesh rotation={[0, 0, 0]}>
           <tubeGeometry args={[kickstandLeft, 32, 0.012, 12, false]} />
           <meshStandardMaterial color="#c29836" metalness={0.9} roughness={0.3} />
         </mesh>

         {/* Right flowing brass wire leg */}
         <mesh rotation={[0, 0, 0]}>
           <tubeGeometry args={[kickstandRight, 32, 0.012, 12, false]} />
           <meshStandardMaterial color="#c29836" metalness={0.9} roughness={0.3} />
         </mesh>
      </group>
      
      {/* Subtle magical dust particles fitting a classic artifact (none in middle) */}
      <Sparkles count={10} scale={1.0} size={1} speed={0.2} opacity={0.3} position={[0, -3.0, 0]} color="#d4af37" />
    </group>
  );
};

// --- COMET 260 BROOM ---
const Comet260Broom = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 - 0.2;
    }
  });

  const getCurveX = (y: number) => Math.sin(y * 0.8) * 0.15;
  const getCurveZ = (y: number) => (Math.cos(y * 1.0) - 1.0) * 0.08;

  // Handle Geometry
  const handleGeo = useMemo(() => {
    const points = [];
    for(let y = 0.0; y <= 4.5; y += 0.2) {
       points.push(new THREE.Vector3(getCurveX(y), y, getCurveZ(y)));
    }
    const path = new THREE.CatmullRomCurve3(points);
    const geo = new THREE.TubeGeometry(path, 64, 0.045, 16, false);
    
    geo.computeBoundingBox();
    const minY = geo.boundingBox!.min.y;
    const maxY = geo.boundingBox!.max.y;
    
    const pos = geo.attributes.position;
    for(let i=0; i < pos.count; i++) {
        let y = pos.getY(i);
        let x = pos.getX(i);
        let z = pos.getZ(i);
        
        const t = (y - minY) / (maxY - minY);
        const center = path.getPointAt(t);
        
        let dx = x - center.x;
        let dz = z - center.z;
        
        // organic taper, slight thick in middle
        let taper = 1.0 - (t * 0.35);
        if (t > 0.8) taper -= (t - 0.8) * 0.5; 
        
        // slight noise for wood grain
        const angle = Math.atan2(dz, dx);
        taper += Math.sin(y * 40 + angle * 2) * 0.03;

        // 2-3 carved ring ridges near front 
        if (t > 0.82 && t < 0.85) {
            taper += Math.sin((t - 0.82) / 0.03 * Math.PI) * 0.25;
        }
        if (t > 0.88 && t < 0.91) {
            taper += Math.sin((t - 0.88) / 0.03 * Math.PI) * 0.25;
        }
        
        pos.setX(i, center.x + dx * taper);
        pos.setZ(i, center.z + dz * taper);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Bristles (scaled sphere with grooves)
  const bristleGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.35, 64, 64);
    geo.scale(1.0, 3.5, 0.5); 
    geo.translate(0, -1.0, 0); // moves center down so top is around Y=0
    
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    
    for(let i=0; i < pos.count; i++) {
       let x = pos.getX(i);
       let y = pos.getY(i);
       let z = pos.getZ(i);
       let angle = Math.atan2(z, x);
       
       // vertical grooves
       const groove = Math.abs(Math.sin(angle * 35)) * 0.04;
       const irregularity = Math.sin(angle * 12 + y * 25) * 0.02;
       
       // irregularity at bottom
       if (y < -2.0) {
            y += Math.sin(angle * 50) * 0.08;
       }
       
       x += Math.cos(angle) * (groove + irregularity);
       z += Math.sin(angle) * (groove + irregularity);
       
       pos.setX(i, x);
       pos.setY(i, y);
       pos.setZ(i, z);
       
       // Colors: dark brown to lighter brown tips
       let r = 0.29, g = 0.18, b = 0.12;
       
       let localY = (-y) / 2.0; 
       if (localY < 0) localY = 0; if (localY > 1) localY = 1;

       r += localY * 0.25; 
       g += localY * 0.15; 
       b += localY * 0.05; 
       
       colors[i*3] = r;
       colors[i*3+1] = g;
       colors[i*3+2] = b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  const hookLeftCurve = useMemo(() => {
     return new THREE.CatmullRomCurve3([
         new THREE.Vector3(0, 0, 0),
         new THREE.Vector3(-0.15, -0.2, 0.1),
         new THREE.Vector3(-0.12, -0.4, -0.05),
         new THREE.Vector3(-0.18, -0.6, 0)
     ]);
  }, []);
  
  const hookRightCurve = useMemo(() => {
     return new THREE.CatmullRomCurve3([
         new THREE.Vector3(0, 0, 0),
         new THREE.Vector3(0.12, -0.15, -0.08),
         new THREE.Vector3(0.18, -0.4, 0.05),
         new THREE.Vector3(0.14, -0.55, 0)
     ]);
  }, []);

  return (
    <group ref={meshRef} rotation={[0, Math.PI / 4, Math.PI / 3.5]} position={[0, -0.5, 0]} scale={[0.8, 0.8, 0.8]}>
      
      {/* Handle */}
      <mesh geometry={handleGeo} position={[0, 0, 0]}>
         <meshStandardMaterial 
            color="#c28b4a" 
            roughness={0.6} 
            metalness={0.0} 
         />
      </mesh>

      {/* Front Tip (flattened round) */}
      <mesh position={[getCurveX(4.5), 4.5, getCurveZ(4.5)]} scale={[1, 0.4, 1]}>
         <sphereGeometry args={[0.025, 32, 32]} />
         <meshStandardMaterial color="#c28b4a" roughness={0.4} />
      </mesh>

      {/* Bristles */}
      <mesh geometry={bristleGeo} position={[0, -0.2, 0]}>
         <meshStandardMaterial vertexColors={true} roughness={0.8} />
      </mesh>

      {/* Binding section - wooden ring */}
      <mesh position={[0, 0.0, 0]} rotation={[Math.PI/2, 0, 0]}>
         <torusGeometry args={[0.05, 0.015, 16, 32]} />
         <meshStandardMaterial color="#301b12" roughness={0.8} />
      </mesh>

      {/* Binding section - golden cone collar */}
      <mesh position={[0, -0.15, 0]} rotation={[0, 0, 0]}>
         <cylinderGeometry args={[0.045, 0.08, 0.3, 32]} />
         <meshStandardMaterial color="#d4af37" metalness={1.0} roughness={0.25} />
      </mesh>

      {/* Hooks */}
      <mesh position={[0, -0.1, 0]}>
         <tubeGeometry args={[hookLeftCurve, 32, 0.01, 8, false]} />
         <meshStandardMaterial color="#d4af37" metalness={1.0} roughness={0.25} />
      </mesh>
      
      <mesh position={[0, -0.1, 0]}>
         <tubeGeometry args={[hookRightCurve, 32, 0.01, 8, false]} />
         <meshStandardMaterial color="#d4af37" metalness={1.0} roughness={0.25} />
      </mesh>

      {/* Magical dust */}
      <Sparkles count={15} scale={1.5} size={1} speed={0.5} opacity={0.4} position={[0, -1.5, 0]} color="#d4af37" />
    </group>
  );
};

// --- CLEANSWEEP ELEVEN BROOM ---
const CleansweepBroom = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 - 0.2;
    }
  });

  // Handle: Catmull curve for organic branch shape with sharp kink
  const getCurveX = (y: number) => {
      if (y < 1.5) return -0.15 * Math.sin(y * 1.5);
      return -0.15 * Math.sin(1.5 * 1.5) + (y - 1.5) * 0.18; 
  };
  const getCurveZ = (y: number) => {
      return Math.sin(y * 1.2) * 0.08;
  };

  const handleGeo = useMemo(() => {
    const points = [];
    for(let y = 0.0; y <= 4.5; y += 0.2) {
       points.push(new THREE.Vector3(getCurveX(y), y, getCurveZ(y)));
    }
    const path = new THREE.CatmullRomCurve3(points);
    const geo = new THREE.TubeGeometry(path, 64, 0.04, 16, false);
    
    geo.computeBoundingBox();
    const minY = geo.boundingBox!.min.y;
    const maxY = geo.boundingBox!.max.y;
    
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    
    for(let i=0; i < pos.count; i++) {
        let y = pos.getY(i);
        let x = pos.getX(i);
        let z = pos.getZ(i);
        
        const t = (y - minY) / (maxY - minY);
        const center = path.getPointAt(t);
        
        let dx = x - center.x;
        let dz = z - center.z;
        
        // Base taper and organic branch bumps
        let taper = 1.0;
        if (t > 0.95) taper -= (t - 0.95) * 1.5; // taper cut tip hard
        
        // Massive noise for the raw branch bottom, smoother top
        const angle = Math.atan2(dz, dx);
        
        let noiseScale = y < 2.3 ? 0.08 : 0.02; // More gnarly on raw wood bottom
        let bump = Math.sin(y * 50 + angle * 3) * noiseScale + Math.cos(y * 80) * (noiseScale * 0.5);
        taper += bump;

        pos.setX(i, center.x + dx * taper);
        pos.setZ(i, center.z + dz * taper);
        
        // Vertex colors: Two tone!
        let r, g, b;
        if (y < 2.2) { 
            // Raw dark grey/brown wood
            r = 0.25; g = 0.20; b = 0.15;
            // Add grain variation to bottom
            const grain = Math.sin(angle * 5)*0.03;
            r+=grain; g+=grain; b+=grain;
        } else if (y > 2.5) {
            // Painted glossy red mahogany
            r = 0.55; g = 0.15; b = 0.15;
        } else {
            // Blend zone
            const blend = (y - 2.2) / 0.3; // 0 to 1
            r = 0.25 + blend * 0.30;
            g = 0.20 - blend * 0.05;
            b = 0.15 + blend * 0.00;
        }
        
        // Darken crevices based on bump
        if (bump < 0) { r *= 0.8; g *= 0.8; b *= 0.8; }
        
        colors[i*3] = r; colors[i*3+1] = g; colors[i*3+2] = b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  const bristleGeo = useMemo(() => {
    // Light blonde straight stray bristles
    const geo = new THREE.ConeGeometry(0.35, 2.8, 64, 32);
    geo.translate(0, -1.4, 0); 
    
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    
    for(let i=0; i < pos.count; i++) {
       let x = pos.getX(i);
       let y = pos.getY(i);
       let z = pos.getZ(i);
       let angle = Math.atan2(z, x);
       
       // Flare out naturally
       const flare = Math.pow(Math.abs(y), 1.2) * 0.04;
       
       // Stray sharp noise representing loose dry straw
       const stray = (Math.sin(angle * 90) + Math.cos(angle * 130 - y * 60)) * 0.015 * Math.abs(y);
       const bulkNoise = Math.sin(angle * 40 + y * 15) * 0.02;
       
       x += Math.cos(angle) * (flare + stray + bulkNoise);
       z += Math.sin(angle) * (flare + stray + bulkNoise);
       
       // Fray the bottom edges heavily
       if (y < -2.2) {
           y += Math.abs(Math.sin(angle * 70 + y * 10)) * 0.25;
       }
       
       pos.setX(i, x);
       pos.setY(i, y);
       pos.setZ(i, z);
       
       // Pale blonde straw colors: #cdba96
       let r = 0.80, g = 0.72, b = 0.58;
       // Add variation per strand
       const tint = Math.sin(angle * 60) * 0.05 + Math.sin(y*15)*0.05;
       r += tint; g += tint; b += tint;
       
       // Darker underneath and near the core binding
       if (y > -0.5 || Math.cos(angle) > 0.5) {
           r *= 0.8; g *= 0.8; b *= 0.8;
       }
       
       colors[i*3] = r; colors[i*3+1] = g; colors[i*3+2] = b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Hook Structures (twine wire loops)
  const hookLeftCurve = useMemo(() => {
     return new THREE.CatmullRomCurve3([
         new THREE.Vector3(0, 0, 0),
         new THREE.Vector3(-0.25, 0.05, 0.05), // sticks out wide
         new THREE.Vector3(-0.35, -0.1, -0.05), // curls back
         new THREE.Vector3(-0.2, -0.15, 0) // loose frayed end
     ]);
  }, []);
  
  const hookRightCurve = useMemo(() => {
     return new THREE.CatmullRomCurve3([
         new THREE.Vector3(0, 0, 0),
         new THREE.Vector3(0.15, -0.1, -0.05),
         new THREE.Vector3(0.2, -0.3, 0.05),
         new THREE.Vector3(0.1, -0.35, 0)
     ]);
  }, []);

  return (
    <group ref={meshRef} rotation={[0, Math.PI / 4, Math.PI / 3.0]} position={[-0.2, -0.5, 0]} scale={[0.8, 0.8, 0.8]}>
      
      {/* Handle */}
      <mesh geometry={handleGeo} position={[0, 0, 0]}>
         {/* Using PhysicalMaterial with vertex colors so the polished part shines and raw wood stays matte */}
         <meshPhysicalMaterial 
            vertexColors={true}
            roughness={0.65} 
            clearcoat={0.15} 
         />
      </mesh>

      {/* Bristles */}
      <mesh geometry={bristleGeo} position={[0, 0, 0]}>
         <meshStandardMaterial vertexColors={true} roughness={0.9} />
      </mesh>

      {/* Top twine binding near the raw wood */}
      <mesh position={[0, -0.05, 0]} rotation={[Math.PI/2, 0, 0]}>
         <cylinderGeometry args={[0.05, 0.055, 0.1, 32]} />
         <meshStandardMaterial color="#c2b08f" roughness={1.0} />
      </mesh>
      
      {/* Dark metal gunmetal band below the twine */}
      <mesh position={[0, -0.18, 0]} rotation={[Math.PI/2, 0, 0]}>
         <cylinderGeometry args={[0.052, 0.065, 0.15, 32]} />
         <meshStandardMaterial color="#2a2b2e" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Silver wires crossing over the gunmetal band */}
      <group position={[0, -0.18, 0]} rotation={[Math.PI/2, 0, 0]}>
         <mesh rotation={[0.2, 0, 0]}>
            <torusGeometry args={[0.06, 0.003, 8, 32]} />
            <meshStandardMaterial color="#cccccc" metalness={1.0} roughness={0.2} />
         </mesh>
         <mesh rotation={[-0.2, 0, 0]}>
            <torusGeometry args={[0.06, 0.003, 8, 32]} />
            <meshStandardMaterial color="#cccccc" metalness={1.0} roughness={0.2} />
         </mesh>
      </group>

      {/* Twine hooks sticking out loosely */}
      <mesh position={[0, 0.0, 0]}>
         <tubeGeometry args={[hookLeftCurve, 32, 0.005, 8, false]} />
         <meshStandardMaterial color="#c2b08f" roughness={1.0} />
      </mesh>
      
      <mesh position={[0, -0.15, 0]}>
         <tubeGeometry args={[hookRightCurve, 32, 0.004, 8, false]} />
         <meshStandardMaterial color="#c2b08f" roughness={1.0} />
      </mesh>

      {/* Magical dust */}
      <Sparkles count={12} scale={1.5} size={1} speed={0.5} opacity={0.3} position={[0, -1.5, 0]} color="#fff3db" />
    </group>
  );
};

export const ThreeDViewer = ({ productName }: { productName?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Lazy load the WebGL Context to prevent browser crashes when many cards are grouped in CSS Grids!
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { rootMargin: "300px" } // Load slightly before coming into view
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing group bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-400/40 via-stone-800 to-black rounded-md overflow-hidden">
      
      {/* The cinematic background lighting user requested */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity pointer-events-none z-10" />

      {/* The <Canvas> starts the WebGL / React Three Fiber engine! */}
      {isVisible ? (
        <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
          
          {/* Soft magical ambient light illuminating everything generally */}
          <ambientLight intensity={0.6} color="#ffffff" />
          
          {/* Key Light (warm main light acting like the sun) */}
          <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffeba8" castShadow />
          
          {/* Rim Light (cool blue light hitting from the back for dramatic edge highlighting) */}
          <directionalLight position={[-5, 0, -5]} intensity={1.8} color="#8cb6ff" />
          
          {/* Float gives the whole object a nice hovering bob effect automatically */}
          <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.2}>
            {/* Conditional rendering based on the wand name injected from products.ts! */}
            {productName === "Phoenix Core & Poplar Wood" ? (
               <PoplarWand />
            ) : productName === "Nimbus 2000" ? (
               <NimbusBroom />
            ) : productName === "Nimbus 2001" ? (
               <Nimbus2001Broom />
            ) : productName === "Firebolt" ? (
               <FireboltBroom />
            ) : productName === "Comet 260" ? (
               <Comet260Broom />
            ) : productName === "Cleansweep Eleven" ? (
               <CleansweepBroom />
            ) : productName === "Voldemort's Wand" || productName === "Dragon Core & Sycamore Wood" || productName === "Dragon Core & Poplar Wood" ? (
               <VoldemortWand />
            ) : productName === "The Elder Wand" || productName === "Unicorn Core & Alder Wood" ? (
               <ElderWand />
            ) : productName === "Harry Potter's Wand" || productName === "Unicorn Core & Sycamore Wood" ? (
               <HarryWand />
            ) : productName === "Ron Weasley's Wand" || productName === "Phoenix Core & Sycamore Wood" ? (
               <RonWand /> 
            ) : productName === "Hermione Granger's Wand" || productName === "Unicorn Core & Laurel Wood" ? (
               <HermioneWand />
            ) : (
               <HermioneWand />
            )}
          </Float>
          
          {/* This allows the user to drag the mouse to spin the wand around! */}
          <OrbitControls 
            enableZoom={false} // Locked so they can't scroll wheel through it
            enablePan={false}  // Locked so they can't right click drag it off screen
            autoRotate // Spins on its own!
            autoRotateSpeed={1.0}
            maxPolarAngle={Math.PI / 1.5} // Stops them from looking exactly top-down
            minPolarAngle={Math.PI / 3}   // Stops them from looking exactly bottom-up
          />
        </Canvas>
      ) : (
        <div className="flex items-center justify-center h-full w-full text-muted-foreground/50 text-xs font-display animate-pulse">
           Summoning...
        </div>
      )}
    </div>
  );
};
