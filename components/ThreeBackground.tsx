import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    // Deep space fog to fade particles in the distance
    scene.fog = new THREE.FogExp2(0x050505, 0.02);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 0; // Camera is inside the tunnel

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
    mountRef.current.appendChild(renderer.domElement);

    // 4. Geometry (Tunnel Particles)
    const geometry = new THREE.BufferGeometry();
    const count = 4000;
    const posArray = new Float32Array(count * 3);
    const colorArray = new Float32Array(count * 3);

    const colorOrange = new THREE.Color('#ea580c');
    const colorBlue = new THREE.Color('#0ea5e9'); // Cyan/Blue for contrast
    const tempColor = new THREE.Color();

    for(let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Cylindrical coordinates for a tunnel
        // Random angle
        const angle = Math.random() * Math.PI * 2;
        // Radius: Keep a clear path in the middle (inner radius 2, outer 8)
        const radius = 2 + Math.random() * 10;
        
        // Convert to Cartesian
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 100; // Long depth

        posArray[i3] = x;
        posArray[i3 + 1] = y;
        posArray[i3 + 2] = z;

        // Mix colors: Mostly Orange, some Blue accents
        if (Math.random() > 0.7) {
            tempColor.copy(colorBlue);
        } else {
            tempColor.copy(colorOrange);
        }

        // Add slight random variation to brightness
        tempColor.multiplyScalar(0.8 + Math.random() * 0.4);

        colorArray[i3] = tempColor.r;
        colorArray[i3 + 1] = tempColor.g;
        colorArray[i3 + 2] = tempColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    // Material
    const material = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true, // Enable per-particle coloring
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    // 5. Interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
        // Normalize mouse -0.5 to 0.5
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // 6. Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Warp Speed Effect: Move particles towards camera (positive Z)
      const positions = particlesMesh.geometry.attributes.position.array as Float32Array;
      const speed = 0.2; // Warp speed

      for(let i = 2; i < count * 3; i+=3) {
          positions[i] += speed;

          // If particle passes camera (z > 5), reset to far back
          if (positions[i] > 5) {
              positions[i] = -60;
          }
      }
      particlesMesh.geometry.attributes.position.needsUpdate = true;

      // Interaction: Rotate the tunnel slightly based on mouse
      particlesMesh.rotation.z += 0.001; // Constant slow spin
      
      // Parallax camera movement
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
      
      // Look slightly ahead
      camera.lookAt(0, 0, -10);

      renderer.render(scene, camera);
    };

    animate();

    // 7. Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      // Deep space gradient background behind the particles
      style={{ background: 'radial-gradient(circle at center, #1e1b4b 0%, #020617 100%)' }}
    />
  );
};