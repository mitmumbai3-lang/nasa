import React from 'react';
import { DEMO_REGIONS } from '../data/seedBenchmarks';
import { MapPin, Sparkles } from 'lucide-react';

interface DemoRegionBarProps {
  currentRegionKey: string;
  onSelectRegion: (regionKey: string) => void;
  lang: string;
}

export const DemoRegionBar: React.FC<DemoRegionBarProps> = ({ currentRegionKey, onSelectRegion }) => {
  return (
    <div className="bg-slate-900/90 border-b border-emerald-950/40 px-3 sm:px-6 py-2.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Quick Demo Regions (Authentic NASA Data):</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {Object.entries(DEMO_REGIONS).map(([key, demo]) => {
            const isSelected = currentRegionKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectRegion(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 border border-emerald-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                <span>
                  {key === 'iowa' ? '🌽 Iowa, USA' : key === 'punjab' ? '🌾 Punjab, India' : '🌿 Kenya Rift Valley'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
