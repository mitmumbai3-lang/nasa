import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Scene from "./components/Scene";
import ParticleCross from "./components/ParticleCross";
import EndJourney from "./components/EndJourney";
import ScriptureModal from "./components/ScriptureModal";
import CommunityModal from "./components/CommunityModal";
import { chaptersData } from "./data/chaptersData";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [scriptureModalOpen, setScriptureModalOpen] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState("01");
  const [communityModalOpen, setCommunityModalOpen] = useState(false);

  const lenisRef = useRef(null);

  // Initialize Lenis Smooth Scrolling and GSAP Parallax
  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // Connect Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 2. Setup GSAP Scroll Animations on each Scene
    const scenes = gsap.utils.toArray(".scene");
    const triggers = [];

    scenes.forEach((scene) => {
      const copy = scene.querySelector(".scene-copy");
      const img = scene.querySelector(".scene-image");
      const halftone = scene.querySelector(".scene-halftone");
      const numeral = scene.querySelector(".scene-numeral");

      if (prefersReducedMotion) {
        // Simplified accessible fades
        const t1 = gsap.fromTo(
          copy,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1,
            scrollTrigger: {
              trigger: scene,
              start: "top 60%",
              toggleActions: "play none none reverse",
            },
          }
        );
        triggers.push(t1.scrollTrigger);
        return;
      }

      // Parallax Editorial Copy
      if (copy) {
        const tCopy = gsap.fromTo(
          copy,
          { opacity: 0, y: 70 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: scene,
              start: "top 75%",
              end: "top 25%",
              scrub: 0.8,
            },
          }
        );
        triggers.push(tCopy.scrollTrigger);
      }

      // Parallax Classical Canvas Image (Layered camera zoom & pan)
      if (img) {
        const tImg = gsap.fromTo(
          img,
          { scale: 1.0, y: -25 },
          {
            scale: 1.15,
            y: 35,
            ease: "none",
            scrollTrigger: {
              trigger: scene,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
        triggers.push(tImg.scrollTrigger);
      }

      // Halftone Particle Dissolve as scene leaves viewport
      if (halftone) {
        const tHalf = gsap.fromTo(
          halftone,
          { opacity: 0.15 },
          {
            opacity: 0.65,
            ease: "power1.in",
            scrollTrigger: {
              trigger: scene,
              start: "center center",
              end: "bottom top",
              scrub: true,
            },
          }
        );
        triggers.push(tHalf.scrollTrigger);
      }

      // Background Roman Numeral Watermark parallax
      if (numeral) {
        const tNum = gsap.fromTo(
          numeral,
          { y: -30, opacity: 0 },
          {
            y: 50,
            opacity: 0.8,
            ease: "none",
            scrollTrigger: {
              trigger: scene,
              start: "top 80%",
              end: "bottom 30%",
              scrub: true,
            },
          }
        );
        triggers.push(tNum.scrollTrigger);
      }
    });

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((trigger) => trigger?.kill());
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  const handleOpenScripture = (chapterId = "01") => {
    setSelectedChapterId(chapterId);
    setScriptureModalOpen(true);
  };

  const handleBeginJourney = () => {
    const firstScene = document.getElementById("scene-01");
    if (firstScene) {
      firstScene.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Group chapters: 01 to 05 before the Particle Cross, and 06 after the Particle Cross
  const chaptersBeforeCross = chaptersData.slice(0, 5);
  const chapterAfterCross = chaptersData.slice(5, 6);

  return (
    <div className="relative min-h-screen bg-[#0D0C0B] text-[#E7D8BB] selection:bg-[#C8A66A]/30 selection:text-[#FFF7E8]">
      {/* Canvas Grain & Vignette Global Overlay */}
      <div className="fixed inset-0 canvas-grain opacity-30 pointer-events-none z-30" />

      {/* Navigation */}
      <Navbar
        onOpenScripture={handleOpenScripture}
        onOpenCommunity={() => setCommunityModalOpen(true)}
      />

      <main id="main-content" tabIndex="-1">
        {/* Hero Section */}
        <Hero
          onBeginJourney={handleBeginJourney}
          onOpenScripture={handleOpenScripture}
        />

        {/* Chapters 01 to 05 */}
        <section id="story-part-1" aria-label="Biblical Story: Creation to Resurrection">
          {chaptersBeforeCross.map((chapter) => (
            <Scene
              key={chapter.id}
              chapter={chapter}
              totalScenes={chaptersData.length}
              onOpenScripture={handleOpenScripture}
            />
          ))}
        </section>

        {/* Quiet Particle Sequence between Resurrection (Chapter 5) and New Creation (Chapter 6) */}
        <ParticleCross />

        {/* Chapter 06: All Things Made New (Revelation 21:5) */}
        <section id="story-part-2" aria-label="Biblical Story: All Things Made New">
          {chapterAfterCross.map((chapter) => (
            <Scene
              key={chapter.id}
              chapter={chapter}
              totalScenes={chaptersData.length}
              onOpenScripture={handleOpenScripture}
            />
          ))}
        </section>

        {/* End Journey Section */}
        <EndJourney
          onOpenScripture={handleOpenScripture}
          onOpenCommunity={() => setCommunityModalOpen(true)}
        />
      </main>

      {/* Interactive Modals */}
      <ScriptureModal
        isOpen={scriptureModalOpen}
        onClose={() => setScriptureModalOpen(false)}
        initialChapterId={selectedChapterId}
      />

      <CommunityModal
        isOpen={communityModalOpen}
        onClose={() => setCommunityModalOpen(false)}
      />
    </div>
  );
}
