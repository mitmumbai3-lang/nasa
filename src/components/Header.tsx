import React from 'react';
import { SupportedLanguage } from '../i18n/translations';
import { Sprout, Globe, BookOpen, Satellite, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenMethodology: () => void;
  onOpenAboutNasa: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onOpenMethodology,
  onOpenAboutNasa,
}) => {
  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'sw', label: 'Kiswahili' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 border-b border-emerald-900/40 backdrop-blur-md px-3 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Tagline */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-xl font-black tracking-tight text-white font-sans">
                Rota<span className="text-emerald-400">Sense</span>
              </span>
              <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                NASA Earth Data
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 font-medium">
              Climate-Resilient Crop Rotation Planning for Farmers
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Methodology Button */}
          <button
            type="button"
            onClick={onOpenMethodology}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-emerald-300 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/80 transition active:scale-95"
            title="Scientific Methodology"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Methodology</span>
          </button>

          {/* About NASA Data Button */}
          <button
            type="button"
            onClick={onOpenAboutNasa}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-blue-300 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/80 transition active:scale-95"
            title="About NASA Data Sources"
          >
            <Satellite className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">NASA Data</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 rounded-xl px-2 py-1">
            <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer pr-1"
              aria-label="Select Language"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-slate-200">
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
