import React, { useState, useEffect } from "react";
import { X, BookOpen, Copy, Check, ChevronRight, ChevronLeft, Palette, Flame } from "lucide-react";
import { chaptersData } from "../data/chaptersData";

export default function ScriptureModal({ isOpen, onClose, initialChapterId = "01" }) {
  const [selectedId, setSelectedId] = useState(initialChapterId);
  const [prevInitialId, setPrevInitialId] = useState(initialChapterId);
  const [copied, setCopied] = useState(false);

  // Sync selectedId when initialChapterId changes between modal opens
  if (initialChapterId !== prevInitialId) {
    setPrevInitialId(initialChapterId);
    setSelectedId(initialChapterId);
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentChapter = chaptersData.find((c) => c.id === selectedId) || chaptersData[0];
  const currentIndex = chaptersData.findIndex((c) => c.id === selectedId);

  const handleCopy = () => {
    const textToCopy = `"${currentChapter.fullScripture}" — ${currentChapter.verse}\n\nFrom "The Living Story"`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedId(chaptersData[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < chaptersData.length - 1) {
      setSelectedId(chaptersData[currentIndex + 1].id);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scripture-dialog-title"
    >
      {/* Backdrop with blur & grain */}
      <div
        className="fixed inset-0 bg-[#0D0C0B]/90 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-0 canvas-grain opacity-40 pointer-events-none" />

      {/* Modal Card */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#C8A66A]/30 bg-[#161514] text-[#E7D8BB] shadow-2xl">
        {/* Top Header */}
        <header className="flex items-center justify-between border-b border-[#C8A66A]/20 bg-[#0D0C0B]/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-[#C8A66A]" />
            <div>
              <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#C8A66A]">
                Sacred Chronicles • Chapter {currentChapter.id}
              </span>
              <h3 id="scripture-dialog-title" className="font-serif text-xl text-[#FFF7E8]">
                {currentChapter.title} — {currentChapter.verse}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-[#E7D8BB]/20 p-2 text-[#E7D8BB]/70 transition-colors hover:border-[#C8A66A] hover:bg-[#C8A66A]/10 hover:text-[#FFF]"
            aria-label="Close Scripture Reader"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Chapter Selection Bar */}
        <nav
          className="flex border-b border-[#E7D8BB]/10 bg-[#121110] px-4 py-2 overflow-x-auto scrollbar-none"
          aria-label="Chapters"
        >
          {chaptersData.map((chap) => {
            const isActive = chap.id === selectedId;
            return (
              <button
                key={chap.id}
                onClick={() => setSelectedId(chap.id)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#C8A66A]/20 text-[#FFF] border border-[#C8A66A]/50 shadow-sm"
                    : "text-[#E7D8BB]/60 hover:text-[#E7D8BB] hover:bg-white/5"
                }`}
              >
                <span className="font-display text-[10px] text-[#C8A66A]">{chap.numeral}</span>
                <span className="font-sans hidden md:inline">{chap.verse}</span>
                <span className="font-serif md:hidden">{chap.title}</span>
              </button>
            );
          })}
        </nav>

        {/* Modal Body with Two Columns */}
        <div className="grid flex-1 grid-cols-1 overflow-y-auto md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#C8A66A]/15">
          {/* Left Column: Scripture & Reflection */}
          <div className="p-6 md:p-8 md:col-span-7 flex flex-col gap-6">
            <div className="rounded-xl border border-[#C8A66A]/20 bg-[#0D0C0B]/60 p-6 relative overflow-hidden">
              <div className="absolute top-2 right-3 text-[48px] font-display text-[#C8A66A]/10 pointer-events-none select-none">
                “
              </div>
              <p className="font-serif text-xl sm:text-2xl leading-relaxed text-[#FFF7E8] italic font-light">
                {currentChapter.fullScripture}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-[#C8A66A]/15 pt-3">
                <span className="font-display text-sm tracking-wider text-[#C8A66A]">
                  {currentChapter.verse}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-full border border-[#C8A66A]/30 px-3 py-1 text-xs text-[#E7D8BB]/80 hover:border-[#C8A66A] hover:text-[#FFF]"
                  aria-label="Copy scripture passage"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#C8A66A]" />
                      <span className="text-[#C8A66A]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Passage</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C8A66A]">
                <Flame className="h-3.5 w-3.5 text-[#7B1E22]" />
                <span>Theological Reflection</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#E7D8BB]/80">
                {currentChapter.theology}
              </p>
            </div>

            <div className="rounded-lg border border-[#7B1E22]/30 bg-[#7B1E22]/10 p-4">
              <span className="font-sans text-[11px] uppercase tracking-wider text-[#C8A66A]">
                Contemplative Prompt
              </span>
              <p className="mt-1 font-serif text-base italic text-[#E7D8BB]">
                "{currentChapter.reflectionPrompt}"
              </p>
            </div>
          </div>

          {/* Right Column: Visual Art & Classical Painting Insight */}
          <div className="p-6 md:p-8 md:col-span-5 flex flex-col justify-between gap-6 bg-[#141312]">
            <div>
              <div className="relative overflow-hidden rounded-xl border border-[#C8A66A]/20 shadow-lg aspect-video group">
                <img
                  src={currentChapter.image}
                  alt={currentChapter.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0B] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="font-display text-[10px] uppercase tracking-widest text-[#C8A66A]">
                    Masterpiece Plate
                  </span>
                  <p className="font-serif text-sm text-[#FFF] line-clamp-1">
                    {currentChapter.title}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C8A66A]">
                  <Palette className="h-3.5 w-3.5 text-[#C8A66A]" />
                  <span>Sacred Art Direction</span>
                </div>
                <h4 className="mt-2 font-serif text-base text-[#FFF]">
                  {currentChapter.artStyle}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[#E7D8BB]/70">
                  {currentChapter.artDescription}
                </p>
              </div>
            </div>

            {/* Bottom Nav inside Modal */}
            <div className="flex items-center justify-between border-t border-[#C8A66A]/15 pt-4">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 text-xs text-[#E7D8BB]/60 disabled:opacity-30 hover:text-[#C8A66A] disabled:hover:text-[#E7D8BB]/60"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous Scene</span>
              </button>
              <span className="font-display text-xs text-[#C8A66A]">
                {currentChapter.id} / 06
              </span>
              <button
                onClick={handleNext}
                disabled={currentIndex === chaptersData.length - 1}
                className="flex items-center gap-1 text-xs text-[#E7D8BB]/60 disabled:opacity-30 hover:text-[#C8A66A] disabled:hover:text-[#E7D8BB]/60"
              >
                <span>Next Scene</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
