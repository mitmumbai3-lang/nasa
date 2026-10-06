import React from "react";
import { BookOpen, Users, ArrowUp, Heart } from "lucide-react";
import { chaptersData } from "../data/chaptersData";

export default function EndJourney({ onOpenScripture, onOpenCommunity }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToScene = (id) => {
    const el = document.getElementById(`scene-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="journey"
      className="relative overflow-hidden bg-[#0D0C0B] px-6 py-28 sm:px-12 md:px-20 lg:py-36 text-center"
      aria-label="Continue the Journey"
    >
      {/* Subtle Background Gradients & Halftone Overlay */}
      <div className="absolute inset-0 halftone-overlay opacity-20 pointer-events-none" />
      <div className="absolute inset-0 canvas-grain opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#C8A66A]/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Sacred Pre-kicker */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C8A66A]/30 bg-[#161514]/80 px-4 py-1.5 backdrop-blur-md">
          <Heart className="h-3.5 w-3.5 text-[#7B1E22]" />
          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#C8A66A]">
            The Invitation Remains
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="mt-8 font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-[#FFF7E8] gold-glow">
          Continue the journey.
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-xl font-serif text-xl sm:text-2xl text-[#E7D8BB]/80 italic font-light leading-relaxed">
          “Read Scripture. Reflect on the story. Find your place within it.”
        </p>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
          <button
            onClick={() => onOpenScripture("01")}
            className="group flex items-center gap-3 rounded-full bg-[#C8A66A] px-8 py-4 text-xs font-semibold uppercase tracking-wider text-[#0D0C0B] transition-all duration-300 hover:bg-[#E4C58B] hover:shadow-[0_0_25px_rgba(200,166,106,0.4)] active:scale-95 cursor-pointer"
          >
            <BookOpen className="h-4 w-4" />
            <span>Read Scripture</span>
          </button>

          <button
            onClick={onOpenCommunity}
            className="flex items-center gap-3 rounded-full border border-[#E7D8BB]/30 bg-[#161514]/70 px-8 py-4 text-xs uppercase tracking-wider text-[#E7D8BB] backdrop-blur-sm transition-all duration-300 hover:border-[#C8A66A] hover:bg-[#C8A66A]/15 hover:text-[#FFF] active:scale-95 cursor-pointer"
          >
            <Users className="h-4 w-4 text-[#C8A66A]" />
            <span>Find a Community</span>
          </button>
        </div>

        {/* Six Chapter Chronicle Navigator */}
        <div className="mt-20 border-t border-[#C8A66A]/20 pt-16">
          <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#C8A66A]">
            Chronicle Index • Six Milestones
          </span>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6 text-left">
            {chaptersData.map((chap) => (
              <div
                key={chap.id}
                onClick={() => scrollToScene(chap.id)}
                className="group cursor-pointer rounded-xl border border-[#C8A66A]/20 bg-[#161514]/50 p-4 transition-all duration-300 hover:border-[#C8A66A] hover:bg-[#1C1A18] hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs text-[#C8A66A]">{chap.numeral}</span>
                  <span className="font-sans text-[10px] text-[#E7D8BB]/50">{chap.id}</span>
                </div>
                <h4 className="mt-2 font-serif text-sm text-[#FFF7E8] group-hover:text-[#C8A66A] transition-colors line-clamp-1">
                  {chap.title}
                </h4>
                <p className="mt-1 font-sans text-[11px] text-[#E7D8BB]/60 line-clamp-1">
                  {chap.verse}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Classical Art Credits and Benediction */}
        <footer className="mt-20 border-t border-[#E7D8BB]/10 pt-10 text-xs text-[#E7D8BB]/50 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <span>The Living Story © 2026</span>
            <span>•</span>
            <span>Fine Art Plates: Caravaggio, C.D. Friedrich, Rembrandt, Carl Bloch, John Martin</span>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-[#C8A66A] hover:text-[#FFF] transition-colors"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
          <p className="text-[11px] text-[#E7D8BB]/40">
            Dedicated to the contemplative exploration of sacred truth, hope, and redemption.
          </p>
        </footer>
      </div>
    </section>
  );
}
