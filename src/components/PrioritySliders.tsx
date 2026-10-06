import React from 'react';
import { FarmerPriorities } from '../types/scoring';
import { Droplet, Sprout, DollarSign, ShieldAlert, Sparkles, Activity, SlidersHorizontal } from 'lucide-react';

interface PrioritySlidersProps {
  priorities: FarmerPriorities;
  onChange: (priorities: FarmerPriorities) => void;
  lang: string;
}

export const PrioritySliders: React.FC<PrioritySlidersProps> = ({ priorities, onChange }) => {
  const handleChange = (key: keyof FarmerPriorities, value: number) => {
    onChange({
      ...priorities,
      [key]: value,
    });
  };

  const applyPreset = (preset: Partial<FarmerPriorities>) => {
    onChange({
      ...priorities,
      ...preset,
    });
  };

  const sliderConfig = [
    {
      key: 'waterSavings' as const,
      label: 'Water Savings & Conservation',
      description: 'Prioritize crops requiring less water and reducing irrigation pumping costs.',
      icon: Droplet,
      color: 'text-blue-400',
      accentColor: 'accent-blue-500',
    },
    {
      key: 'soilHealth' as const,
      label: 'Soil Health & Organic Matter',
      description: 'Maximize biological nitrogen fixation, deep root aeration, and residue cover.',
      icon: Sprout,
      color: 'text-emerald-400',
      accentColor: 'accent-emerald-500',
    },
    {
      key: 'incomeStability' as const,
      label: 'Income & Market Stability',
      description: 'Balance cash-crop profitability with reliable market commodity demand.',
      icon: DollarSign,
      color: 'text-amber-400',
      accentColor: 'accent-amber-500',
    },
    {
      key: 'droughtResilience' as const,
      label: 'Drought & Heat Resilience',
      description: 'Select crops that withstand erratic rains and high-temperature stress waves.',
      icon: ShieldAlert,
      color: 'text-rose-400',
      accentColor: 'accent-rose-500',
    },
    {
      key: 'lowInputCost' as const,
      label: 'Low Synthetic Fertilizer Cost',
      description: 'Substitute expensive chemical nitrogen with natural biological legumes.',
      icon: Sparkles,
      color: 'text-purple-400',
      accentColor: 'accent-purple-500',
    },
    {
      key: 'laborEase' as const,
      label: 'Manageable Labor & Field Operations',
      description: 'Avoid excessive seasonal labor peaks and heavy manual weeding demands.',
      icon: Activity,
      color: 'text-teal-400',
      accentColor: 'accent-teal-500',
    },
  ];

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/20 p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-slate-100">Farmer Strategic Priorities</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Adjust the sliders to personalize how candidates are scored for your farm goals.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() =>
              applyPreset({
                waterSavings: 90,
                soilHealth: 60,
                incomeStability: 40,
                droughtResilience: 85,
                lowInputCost: 60,
                laborEase: 40,
              })
            }
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-blue-600/30 text-blue-300 rounded-lg border border-blue-500/30 transition active:scale-95"
          >
            💧 Water Saver
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({
                waterSavings: 60,
                soilHealth: 95,
                incomeStability: 50,
                droughtResilience: 70,
                lowInputCost: 80,
                laborEase: 40,
              })
            }
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-emerald-600/30 text-emerald-300 rounded-lg border border-emerald-500/30 transition active:scale-95"
          >
            🌱 Soil Builder
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({
                waterSavings: 50,
                soilHealth: 50,
                incomeStability: 95,
                droughtResilience: 50,
                lowInputCost: 40,
                laborEase: 50,
              })
            }
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-amber-600/30 text-amber-300 rounded-lg border border-amber-500/30 transition active:scale-95"
          >
            💰 High Profit
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({
                waterSavings: 80,
                soilHealth: 70,
                incomeStability: 40,
                droughtResilience: 95,
                lowInputCost: 60,
                laborEase: 40,
              })
            }
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-rose-600/30 text-rose-300 rounded-lg border border-rose-500/30 transition active:scale-95"
          >
            🛡️ Climate Fortress
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({
                waterSavings: 50,
                soilHealth: 50,
                incomeStability: 50,
                droughtResilience: 50,
                lowInputCost: 50,
                laborEase: 50,
              })
            }
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
          >
            ⚖️ Balanced
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {sliderConfig.map((item) => {
          const Icon = item.icon;
          const val = priorities[item.key];
          return (
            <div
              key={item.key}
              className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 hover:border-slate-600 transition"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">{item.label}</span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-200">
                  {val}%
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mb-2 leading-tight">{item.description}</p>

              {/* Accessible touch-target slider (min 48px touch zone) */}
              <div className="relative py-2 flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={val}
                  onChange={(e) => handleChange(item.key, parseInt(e.target.value, 10))}
                  className={`w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer ${item.accentColor}`}
                  aria-label={item.label}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
