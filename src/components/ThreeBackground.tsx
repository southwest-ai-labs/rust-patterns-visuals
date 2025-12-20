
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeBackgroundProps {
  isDark: boolean;
}

export const ThreeBackground: React.FC<ThreeBackgroundProps> = ({ isDark }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    
    // Theme Config
    const bgColors = isDark 
        ? { fog: 0x050505, core: '#ea580c', accent: '#0ea5e9', gradient: 'radial-gradient(circle at center, #1e1b4b 0%, #020617 100%)' }
        : { fog: 0xf8fafc, core: '#2563eb', accent: '#64748b', gradient: 'radial-gradient(circle at center, #f1f5f9 0%, #e2e8f0 100%)' };

    scene.fog = new THREE.FogExp2(bgColors.fog, 0.02);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 0; 

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
    mountRef.current.appendChild(renderer.domElement);

    // 4. Geometry (Tunnel Particles)
    const geometry = new THREE.BufferGeometry();
    const count = 4000;
    const posArray = new Float32Array(count * 3);
    const colorArray = new Float32Array(count * 3);

    const colorCore = new THREE.Color(bgColors.core);
    const colorAccent = new THREE.Color(bgColors.accent);
    const tempColor = new THREE.Color();

    for(let i = 0; i < count; i++) {
        const i3 = i * 3;
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * 10;
        
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 100;

        posArray[i3] = x;
        posArray[i3 + 1] = y;
        posArray[i3 + 2] = z;

        if (Math.random() > 0.7) {
            tempColor.copy(colorAccent);
        } else {
            tempColor.copy(colorCore);
        }

        tempColor.multiplyScalar(0.8 + Math.random() * 0.4);

        colorArray[i3] = tempColor.r;
        colorArray[i3 + 1] = tempColor.g;
        colorArray[i3 + 2] = tempColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true, 
        transparent: true,
        opacity: isDark ? 0.9 : 0.7, 
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending, 
        depthWrite: false
    });

    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    let frameId = 0;
    let isVisible = true;

    const animate = () => {
      if (!isVisible) return; 

      frameId = requestAnimationFrame(animate);

      const positions = particlesMesh.geometry.attributes.position.array as Float32Array;
      const speed = 0.2;

      for(let i = 2; i < count * 3; i+=3) {
          positions[i] += speed;
          if (positions[i] > 5) {
              positions[i] = -60;
          }
      }
      particlesMesh.geometry.attributes.position.needsUpdate = true;

      particlesMesh.rotation.z += 0.001; 
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, -10);

      renderer.render(scene, camera);
    };

    const handleVisibilityChange = () => {
        if (document.hidden) {
            isVisible = false;
            cancelAnimationFrame(frameId);
        } else {
            isVisible = true;
            animate();
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    if (mountRef.current) {
        mountRef.current.style.background = bgColors.gradient;
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, [isDark]); 

  return (
    <div 
      ref={mountRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none transition-all duration-500"
    />
  );
};
