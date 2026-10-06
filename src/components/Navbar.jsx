import React, { useState, useEffect } from "react";
import AudioPad from "./AudioPad";
import { Menu, X, ChevronRight } from "lucide-react";

export default function Navbar({ onOpenScripture, onOpenCommunity }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);

      const winHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (winHeight > 0) {
        setScrollProgress((scrollY / winHeight) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "bg-[#0D0C0B]/85 backdrop-blur-md border-b border-[#C8A66A]/20 py-3.5 shadow-2xl"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8">
          {/* Brand Wordmark with Sacred Cross */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("top");
            }}
            className="group flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.02]"
            aria-label="The Living Story Home"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#C8A66A]/40 bg-[#C8A66A]/10 text-[#C8A66A] shadow-[0_0_12px_rgba(200,166,106,0.3)] transition-colors group-hover:border-[#C8A66A] group-hover:bg-[#C8A66A]/25">
              ✝
            </span>
            <span className="font-display text-lg tracking-[0.12em] text-[#FFF7E8] sm:text-xl font-medium gold-glow-subtle">
              The Living Story
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-8 text-sm md:flex" aria-label="Main Navigation">
            <button
              onClick={() => scrollTo("scene-01")}
              className="text-[#E7D8BB]/75 transition-colors duration-200 hover:text-[#C8A66A] cursor-pointer"
            >
              The Story
            </button>
            <button
              onClick={() => onOpenScripture("01")}
              className="text-[#E7D8BB]/75 transition-colors duration-200 hover:text-[#C8A66A] cursor-pointer"
            >
              Scripture
            </button>
            <button
              onClick={() => scrollTo("cross-particles")}
              className="text-[#E7D8BB]/75 transition-colors duration-200 hover:text-[#C8A66A] cursor-pointer"
            >
              The Cross
            </button>
            <button
              onClick={() => scrollTo("journey")}
              className="text-[#E7D8BB]/75 transition-colors duration-200 hover:text-[#C8A66A] cursor-pointer"
            >
              Hope
            </button>
          </nav>

          {/* Right Action Controls: Audio + CTA */}
          <div className="flex items-center gap-3">
            {/* Ambient Pad Audio Synthesizer */}
            <AudioPad />

            {/* Desktop CTA Button */}
            <button
              onClick={() => scrollTo("scene-01")}
              className="hidden lg:inline-flex items-center gap-2 rounded-full bg-[#C8A66A] px-5 py-2 text-xs font-semibold tracking-wider uppercase text-[#0D0C0B] transition-all duration-300 hover:bg-[#E4C58B] hover:shadow-[0_0_20px_rgba(200,166,106,0.4)] active:scale-95 cursor-pointer"
            >
              <span>Begin the Journey</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full border border-[#E7D8BB]/20 p-2 text-[#E7D8BB] md:hidden hover:border-[#C8A66A]"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Minimal Gold Scroll Progress Line at Bottom of Nav */}
        <div
          className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C8A66A] to-transparent transition-all duration-150"
          style={{ width: `${scrollProgress}%`, opacity: isScrolled ? 0.9 : 0 }}
        />
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 flex flex-col justify-between bg-[#0D0C0B]/95 p-8 pt-28 backdrop-blur-xl md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex flex-col gap-6 text-center">
            <button
              onClick={() => scrollTo("scene-01")}
              className="font-serif text-2xl text-[#E7D8BB] hover:text-[#C8A66A]"
            >
              The Story
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenScripture("01");
              }}
              className="font-serif text-2xl text-[#E7D8BB] hover:text-[#C8A66A]"
            >
              Read Scripture
            </button>
            <button
              onClick={() => scrollTo("cross-particles")}
              className="font-serif text-2xl text-[#E7D8BB] hover:text-[#C8A66A]"
            >
              The Living Cross
            </button>
            <button
              onClick={() => scrollTo("journey")}
              className="font-serif text-2xl text-[#E7D8BB] hover:text-[#C8A66A]"
            >
              Hope & Invitation
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenCommunity();
              }}
              className="font-serif text-2xl text-[#C8A66A] hover:text-[#FFF]"
            >
              Find a Community
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => scrollTo("scene-01")}
              className="w-full rounded-full bg-[#C8A66A] py-3 text-sm font-semibold tracking-wider uppercase text-[#0D0C0B]"
            >
              Begin the Journey
            </button>
            <p className="mt-4 text-xs text-[#E7D8BB]/40">
              A cinematic contemplation of Scripture
            </p>
          </div>
        </div>
      )}
    </>
  );
}
