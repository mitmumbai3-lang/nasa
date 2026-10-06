import React from "react";
import { ArrowDown, Sparkles } from "lucide-react";

export default function Hero({ onBeginJourney, onOpenScripture }) {
  return (
    <header
      id="top"
      className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#0D0C0B] px-6 pb-12 pt-28 sm:px-10 md:px-16"
      aria-label="The Living Story Hero"
    >
      {/* Background Classical Oil Painting: Primal Light Breaking Over Waters */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="/images/creation.jpg"
          alt="Painted darkness opening into light over water"
          className="h-full w-full object-cover object-center scale-105 transition-transform duration-[12000ms] ease-out hover:scale-110 opacity-60"
        />
        {/* Layered Cinematic Vignette & Deep Charcoal Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0B] via-[#0D0C0B]/60 to-[#0D0C0B]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0C0B] via-transparent to-[#0D0C0B]/70" />
        <div className="absolute inset-0 cinematic-vignette opacity-80" />
        <div className="absolute inset-0 halftone-overlay opacity-30" />
        <div className="absolute inset-0 canvas-grain opacity-50" />
      </div>

      {/* Top Pre-kicker & Sacred Citation */}
      <div className="relative z-10 mx-auto w-full max-w-7xl pt-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C8A66A]/30 bg-[#0D0C0B]/60 px-4 py-1.5 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C8A66A] animate-ping" />
          <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#C8A66A]">
            The Biblical Story • Sacred Chronicles
          </p>
        </div>
      </div>

      {/* Hero Massive Editorial Typography */}
      <div className="relative z-10 mx-auto my-auto w-full max-w-7xl py-12">
        <div className="max-w-4xl">
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight leading-[0.92] text-[#FFF7E8] gold-glow">
            In the beginning,<br />
            <span className="font-normal italic text-[#C8A66A]">God made a way.</span>
          </h1>

          <p className="mt-8 max-w-xl font-sans text-base sm:text-lg md:text-xl text-[#E7D8BB]/80 font-light leading-relaxed">
            A journey through creation, covenant, Christ, and new creation.
          </p>

          {/* Action Row */}
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <button
              onClick={onBeginJourney}
              className="group flex items-center gap-3 rounded-full bg-[#C8A66A] px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#0D0C0B] transition-all duration-300 hover:bg-[#E4C58B] hover:shadow-[0_0_30px_rgba(200,166,106,0.5)] active:scale-95 cursor-pointer"
            >
              <span>Begin the Story</span>
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
            </button>

            <button
              onClick={() => onOpenScripture("01")}
              className="flex items-center gap-2 rounded-full border border-[#E7D8BB]/30 bg-[#0D0C0B]/50 px-6 py-3.5 text-xs uppercase tracking-wider text-[#E7D8BB] backdrop-blur-sm transition-all duration-300 hover:border-[#C8A66A] hover:bg-[#C8A66A]/15 hover:text-[#FFF] cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#C8A66A]" />
              <span>Read Genesis 1:1</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Bottom Bar with Scene Quick-Strip and Scroll Prompt */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-t border-[#C8A66A]/20 pt-6">
        <div className="flex items-center gap-4 text-xs text-[#E7D8BB]/60">
          <span className="font-display text-[#C8A66A]">VI CHAPTERS</span>
          <span className="h-3 w-px bg-[#E7D8BB]/20" />
          <span className="font-sans">GENESIS TO REVELATION</span>
          <span className="h-3 w-px bg-[#E7D8BB]/20" />
          <span className="font-sans hidden sm:inline">ORIGINAL SACRED ART DIRECTION</span>
        </div>

        {/* Animated Scroll Prompt */}
        <button
          onClick={onBeginJourney}
          className="group flex items-center gap-3 text-xs tracking-widest uppercase text-[#C8A66A] transition-colors hover:text-[#FFF] cursor-pointer"
        >
          <span className="font-sans text-[11px] tracking-[0.25em]">Scroll to enter the epic</span>
          <div className="flex h-8 w-5 items-start justify-center rounded-full border border-[#C8A66A]/50 p-1">
            <span className="h-1.5 w-1 rounded-full bg-[#C8A66A] animate-bounce" />
          </div>
        </button>
      </div>
    </header>
  );
}
