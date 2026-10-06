import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Compass } from "lucide-react";

export default function ParticleCross() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCrossFormed, setIsCrossFormed] = useState(true);
  const animFrameRef = useRef(null);
  const morphProgressRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 8.5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create radial soft particle texture
    const createParticleTexture = () => {
      const pCanvas = document.createElement("canvas");
      pCanvas.width = 64;
      pCanvas.height = 64;
      const ctx = pCanvas.getContext("2d");
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 245, 220, 1)");
      gradient.addColorStop(0.2, "rgba(225, 185, 110, 0.85)");
      gradient.addColorStop(0.6, "rgba(200, 150, 70, 0.3)");
      gradient.addColorStop(1, "rgba(200, 150, 70, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(pCanvas);
    };

    const particleTexture = createParticleTexture();

    // Particle Count
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 1800 : 3200;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const dispersePositions = new Float32Array(count * 3);
    const crossPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const randomPhases = new Float32Array(count);

    // Color palette
    const colorGold = new THREE.Color("#C8A66A");
    const colorBrightGold = new THREE.Color("#FFDF9E");
    const colorParchment = new THREE.Color("#E7D8BB");
    const colorCrimson = new THREE.Color("#8A2328");

    // Distribute particles into Dispersed Cloud and Cross
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // 1. Dispersed Nebula State (Fibonacci Sphere / swirling cloud)
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const radius = 1.2 + Math.random() * 4.2;
      dispersePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      dispersePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      dispersePositions[i3 + 2] = radius * Math.cos(phi) * 0.7;

      // 2. Cross Target State
      let cx = 0, cy = 0, cz = 0;
      const type = Math.random();

      if (type < 0.5) {
        // Vertical beam: y from -3.4 to 3.4
        const yNorm = (Math.random() - 0.5) * 6.8;
        const width = 0.38 * (1 - Math.abs(yNorm) * 0.05);
        cx = (Math.random() - 0.5) * width;
        cy = yNorm;
        cz = (Math.random() - 0.5) * 0.35;
      } else if (type < 0.82) {
        // Horizontal beam: x from -2.4 to 2.4, y centered at +0.95
        const xNorm = (Math.random() - 0.5) * 4.8;
        cx = xNorm;
        cy = 0.95 + (Math.random() - 0.5) * 0.38;
        cz = (Math.random() - 0.5) * 0.35;
      } else {
        // Aureole / Halo of light around the sacred nexus (0, 0.95)
        const angle = Math.random() * Math.PI * 2;
        const haloDist = 0.4 + Math.random() * 1.5;
        cx = Math.cos(angle) * haloDist * (0.8 + Math.random() * 0.4);
        cy = 0.95 + Math.sin(angle) * haloDist * (0.8 + Math.random() * 0.4);
        cz = (Math.random() - 0.5) * 0.5;
      }

      // Add delicate organic scatter
      crossPositions[i3] = cx + (Math.random() - 0.5) * 0.12;
      crossPositions[i3 + 1] = cy + (Math.random() - 0.5) * 0.12;
      crossPositions[i3 + 2] = cz + (Math.random() - 0.5) * 0.15;

      // Initial positions start at dispersed
      positions[i3] = dispersePositions[i3];
      positions[i3 + 1] = dispersePositions[i3 + 1];
      positions[i3 + 2] = dispersePositions[i3 + 2];

      // Colors
      let pColor;
      const randColor = Math.random();
      if (randColor < 0.6) pColor = colorGold;
      else if (randColor < 0.85) pColor = colorBrightGold;
      else if (randColor < 0.95) pColor = colorParchment;
      else pColor = colorCrimson;

      colors[i3] = pColor.r;
      colors[i3 + 1] = pColor.g;
      colors[i3 + 2] = pColor.b;

      // Scales & phases
      scales[i] = 0.045 + Math.random() * 0.08;
      randomPhases[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(scales, 1));

    const material = new THREE.PointsMaterial({
      size: 0.14,
      map: particleTexture,
      transparent: true,
      opacity: 0.88,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // Mouse and Touch Interaction
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      mouseRef.current.targetX = normX * 0.55;
      mouseRef.current.targetY = normY * 0.45;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth interpolation between dispersed state and cross
      const target = isCrossFormed ? 1.0 : 0.0;
      morphProgressRef.current += (target - morphProgressRef.current) * 0.04;
      const t = morphProgressRef.current;

      // Easing
      const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Base rotation and drift
      if (prefersReducedMotion) {
        particleSystem.rotation.y = 0;
        particleSystem.rotation.x = 0;
      } else {
        // Slow majestic breathing & cursor tilt
        const breath = Math.sin(elapsedTime * 0.9) * 0.04;
        particleSystem.rotation.y = mouseRef.current.x * 0.75 + Math.sin(elapsedTime * 0.25) * 0.08;
        particleSystem.rotation.x = -mouseRef.current.y * 0.65 + breath;
      }

      // Update particle positions
      const currentPos = geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const phase = randomPhases[i];
        
        // Gentle organic shimmer
        const flutter = Math.sin(elapsedTime * 1.5 + phase) * 0.025;
        const flutterY = Math.cos(elapsedTime * 1.2 + phase) * 0.025;

        const targetX = crossPositions[i3] + flutter;
        const targetY = crossPositions[i3 + 1] + flutterY;
        const targetZ = crossPositions[i3 + 2] + flutter;

        const startX = dispersePositions[i3] + Math.sin(elapsedTime * 0.4 + phase) * 0.1;
        const startY = dispersePositions[i3 + 1] + Math.cos(elapsedTime * 0.5 + phase) * 0.1;
        const startZ = dispersePositions[i3 + 2] + Math.sin(elapsedTime * 0.3 + phase) * 0.1;

        currentPos[i3] = THREE.MathUtils.lerp(startX, targetX, easeT);
        currentPos[i3 + 1] = THREE.MathUtils.lerp(startY, targetY, easeT);
        currentPos[i3 + 2] = THREE.MathUtils.lerp(startZ, targetZ, easeT);
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, [isCrossFormed]);

  return (
    <section
      id="cross-particles"
      ref={containerRef}
      className="relative flex min-h-[90vh] md:min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0D0C0B] px-6 py-20"
      aria-label="The Living Cross Particle Sequence"
    >
      {/* Halftone & Vignette Atmosphere */}
      <div className="absolute inset-0 halftone-overlay opacity-25" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#0D0C0B]/60 to-[#0D0C0B] pointer-events-none" />

      {/* WebGL Canvas for Sacred Gold Cross */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing touch-none"
        aria-hidden="true"
      />

      {/* Atmospheric Central Radiance */}
      <div className="absolute h-96 w-96 rounded-full bg-[#C8A66A]/10 blur-[100px] pointer-events-none animate-pulse-glow" />

      {/* Editorial Content Overlay */}
      <div className="relative z-10 mx-auto max-w-3xl text-center pointer-events-none select-none">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C8A66A]/30 bg-[#161514]/80 px-4 py-1.5 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-[#C8A66A]" />
          <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#C8A66A]">
            The Eternal Covenant
          </span>
        </div>

        <h3 className="mt-8 font-serif text-4xl leading-tight text-[#E7D8BB] md:text-6xl lg:text-7xl font-light">
          “The story is still being <br className="hidden sm:block" />
          <span className="italic text-[#C8A66A] font-normal">written in us.</span>”
        </h3>

        <p className="mx-auto mt-6 max-w-xl text-base text-[#E7D8BB]/75 leading-relaxed md:text-lg">
          Between the empty tomb of the garden and the glorious renewal of heaven and earth,
          the Spirit of God breathes through mortal lives. You are not a spectator of this epic;
          you are its living sanctuary.
        </p>

        {/* Interactive Controls Pill */}
        <div className="mt-8 inline-flex items-center gap-4 pointer-events-auto">
          <button
            onClick={() => setIsCrossFormed(!isCrossFormed)}
            className="group flex items-center gap-2 rounded-full border border-[#C8A66A]/40 bg-[#0D0C0B]/80 px-5 py-2.5 text-xs tracking-widest text-[#E7D8BB] uppercase transition-all duration-300 hover:border-[#C8A66A] hover:bg-[#C8A66A]/15 hover:text-[#FFF]"
          >
            <Compass className="h-3.5 w-3.5 text-[#C8A66A] transition-transform duration-500 group-hover:rotate-180" />
            <span>{isCrossFormed ? "Disperse Starlight" : "Gather Sacred Cross"}</span>
          </button>
        </div>

        {/* Quiet desktop interaction prompt */}
        <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-[#E7D8BB]/40">
          Move cursor to guide the celestial embers • Touch and tilt on mobile
        </p>
      </div>
    </section>
  );
}
