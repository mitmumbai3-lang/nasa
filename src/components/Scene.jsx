import React from "react";
import { BookOpen } from "lucide-react";

export default function Scene({
  chapter,
  onOpenScripture,
  totalScenes
}) {
  const { id, numeral, verse, title, reflective, image, artStyle } = chapter;

  return (
    <article
      id={`scene-${id}`}
      className="scene relative flex min-h-screen w-full items-end justify-between overflow-hidden bg-[#0D0C0B] px-6 py-16 sm:px-12 md:px-20 lg:py-24"
      aria-label={`Chapter ${id}: ${title} — ${verse}`}
    >
      {/* 1. Parallax Painterly Artwork Layer */}
      <div className="scene-bg absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={image}
          alt={`${title} — ${artStyle}`}
          className="scene-image absolute inset-0 h-full w-full object-cover object-center will-change-transform opacity-65"
          loading="lazy"
        />

        {/* Cinematic chiaroscuro gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0B] via-[#0D0C0B]/40 to-[#0D0C0B]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0C0B] via-transparent to-[#0D0C0B]/70" />
        <div className="absolute inset-0 cinematic-vignette opacity-70" />
        
        {/* Subtle Canvas Grain Overlay */}
        <div className="absolute inset-0 canvas-grain opacity-40" />

        {/* Dynamic Halftone Particle Mesh for Grana Style Transition */}
        <div className="scene-halftone absolute inset-0 halftone-overlay opacity-30 transition-opacity duration-300" />
      </div>

      {/* 2. Giant Roman Numeral Watermark in the Background */}
      <div
        className="scene-numeral absolute right-6 top-16 md:right-16 md:top-24 select-none pointer-events-none font-display text-[120px] sm:text-[180px] md:text-[260px] font-bold text-[#E7D8BB]/[0.035] leading-none z-0"
        aria-hidden="true"
      >
        {numeral}
      </div>

      {/* 3. Foreground Editorial Content Layer */}
      <div className="scene-copy relative z-10 max-w-3xl will-change-transform">
        {/* Chapter & Scripture Tag */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-[#C8A66A]/30 bg-[#0D0C0B]/75 px-4 py-1.5 backdrop-blur-md">
          <span className="font-display text-[11px] font-semibold text-[#C8A66A]">
            {id}
          </span>
          <span className="h-2.5 w-px bg-[#C8A66A]/30" />
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#E7D8BB]">
            {verse}
          </span>
        </div>

        {/* Massive Editorial Heading */}
        <h2 className="mt-5 font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-[#FFF7E8] leading-[0.95] gold-glow">
          {title}
        </h2>

        {/* Concise Reflective Line */}
        <p className="mt-6 max-w-xl font-serif text-xl sm:text-2xl md:text-3xl text-[#E7D8BB]/90 italic font-light leading-relaxed">
          “{reflective}”
        </p>

        {/* Classical Art Insight Tag & Action Button */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={() => onOpenScripture(id)}
            className="group flex items-center gap-2.5 rounded-full border border-[#C8A66A]/50 bg-[#0D0C0B]/70 px-5 py-2.5 text-xs uppercase tracking-wider text-[#E7D8BB] backdrop-blur-sm transition-all duration-300 hover:border-[#C8A66A] hover:bg-[#C8A66A] hover:text-[#0D0C0B] active:scale-95 cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5 text-[#C8A66A] group-hover:text-[#0D0C0B] transition-colors" />
            <span>Read Passage & Context</span>
          </button>

          <span className="hidden sm:inline font-sans text-xs text-[#E7D8BB]/50">
            • {artStyle}
          </span>
        </div>
      </div>

      {/* 4. Scene Index Indicator on the Right */}
      <div className="relative z-10 hidden lg:flex flex-col items-end gap-2 text-right">
        <span className="font-display text-sm tracking-widest text-[#C8A66A]">
          {id} / {totalScenes < 10 ? `0${totalScenes}` : totalScenes}
        </span>
        <div className="h-16 w-px bg-gradient-to-b from-[#C8A66A] to-transparent" />
      </div>
    </article>
  );
}
