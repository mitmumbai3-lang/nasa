import React, { useState } from 'react';
import { RotationCandidate } from '../types/scoring';
import {
  Award,
  ChevronDown,
  ChevronUp,
  Droplet,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Layers,
  Leaf,
} from 'lucide-react';

interface RotationCardProps {
  rotation: RotationCandidate;
  rank: number;
  isSelectedForComparison: boolean;
  onToggleCompare: (id: string) => void;
  lang: string;
}

export const RotationCard: React.FC<RotationCardProps> = ({
  rotation,
  rank,
  isSelectedForComparison,
  onToggleCompare,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(rank === 1);

  const { title, tagline, badge, scores, projectedImpacts, seasons, ruleEffects, whyThisRotation } = rotation;

  // Color for score badge
  const score = scores.overallScore;
  const scoreColor =
    score >= 80
      ? 'bg-emerald-500 text-white border-emerald-400'
      : score >= 65
      ? 'bg-teal-600 text-white border-teal-400'
      : score >= 50
      ? 'bg-amber-600 text-white border-amber-400'
      : 'bg-rose-600 text-white border-rose-400';

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-xl ${
        rank === 1
          ? 'bg-slate-900/95 border-emerald-500/50 ring-1 ring-emerald-500/30'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Banner */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Rank #{rank}</span>
              </span>

              {badge && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {badge}
                </span>
              )}

              {/* Compare Checkbox */}
              <label className="ml-auto flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1 rounded-lg border border-slate-700 select-none transition">
                <input
                  type="checkbox"
                  checked={isSelectedForComparison}
                  onChange={() => onToggleCompare(rotation.id)}
                  className="rounded accent-emerald-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Compare</span>
              </label>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-100">{title}</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-snug">{tagline}</p>
          </div>

          {/* Overall Score Badge */}
          <div className="text-center shrink-0">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center font-bold border-2 shadow-lg ${scoreColor}`}
            >
              <span className="text-xl sm:text-2xl leading-none font-black">{score}</span>
              <span className="text-[9px] uppercase tracking-wider opacity-90">Score</span>
            </div>
          </div>
        </div>

        {/* Seasonal Timeline Progression */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Multi-Year Crop Succession Timeline ({rotation.years} Years)
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {seasons.map((slot, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                  slot.isCoverCrop
                    ? 'bg-emerald-950/40 border-emerald-500/40'
                    : 'bg-slate-800/70 border-slate-700/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mb-1">
                    <span>Y{slot.year} • {slot.seasonName}</span>
                    {slot.isCoverCrop && <Leaf className="w-3 h-3 text-emerald-400" />}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-100 block truncate" title={slot.crop.name}>
                    {slot.crop.name}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1 mt-2">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">
                    {slot.crop.rootDepth} root
                  </span>
                  {slot.crop.nitrogenFixationKgPerHa > 0 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-mono">
                      +{slot.crop.nitrogenFixationKgPerHa}kg N
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projected Real-World Impacts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3.5 pt-3 border-t border-slate-800/80">
          <div className="p-2.5 bg-slate-800/40 rounded-xl">
            <span className="text-[10px] text-slate-400 block mb-0.5">Soil Organic Matter</span>
            <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs sm:text-sm">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{projectedImpacts.somDeltaPctPerYear}% / yr</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-800/40 rounded-xl">
            <span className="text-[10px] text-slate-400 block mb-0.5">Water Conserved</span>
            <div className="flex items-center gap-1 text-blue-400 font-bold text-xs sm:text-sm">
              <Droplet className="w-3.5 h-3.5" />
              <span>{projectedImpacts.waterSavingsM3PerHa} m³/ha</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-800/40 rounded-xl">
            <span className="text-[10px] text-slate-400 block mb-0.5">Biological Nitrogen</span>
            <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs sm:text-sm">
              <Sprout className="w-3.5 h-3.5" />
              <span>+{projectedImpacts.nitrogenFixedKgPerHaTotal} kg N</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-800/40 rounded-xl">
            <span className="text-[10px] text-slate-400 block mb-0.5">Drought Survival</span>
            <div className="flex items-center gap-1 text-rose-400 font-bold text-xs sm:text-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{projectedImpacts.droughtSurvivalIndex} / 100</span>
            </div>
          </div>
        </div>

        {/* Expand Details Button */}
        <div className="mt-3 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            <span>{isExpanded ? 'Hide Details & Score Breakdown' : 'View "Why this rotation?" & Breakdown'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Breakdown & "Why this rotation?" Section */}
      {isExpanded && (
        <div className="p-4 sm:p-5 bg-slate-950/60 border-t border-slate-800 space-y-4">
          {/* Dimension Progress Bars */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Score Dimension Breakdown (0 - 100)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Water Conservation', val: scores.waterScore, color: 'bg-blue-500' },
                { label: 'Soil Health & OM', val: scores.soilScore, color: 'bg-emerald-500' },
                { label: 'Drought/Heat Resilience', val: scores.resilienceScore, color: 'bg-rose-500' },
                { label: 'Income & Stability', val: scores.incomeScore, color: 'bg-amber-500' },
                { label: 'Low Fertilizer Cost', val: scores.inputCostScore, color: 'bg-purple-500' },
                { label: 'Labor Feasibility', val: scores.laborScore, color: 'bg-teal-500' },
              ].map((dim) => (
                <div key={dim.label} className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-400 truncate">{dim.label}</span>
                    <span className="font-mono font-bold text-slate-200">{dim.val}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${dim.color}`} style={{ width: `${dim.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agronomic Rule Adjustments (Penalties & Bonuses) */}
          {ruleEffects.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Agronomic Rule Applications
              </h4>
              <div className="space-y-1.5">
                {ruleEffects.map((rule, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border flex items-start gap-2 text-xs ${
                      rule.type === 'bonus'
                        ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                        : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                    }`}
                  >
                    <span
                      className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0 ${
                        rule.type === 'bonus' ? 'bg-emerald-900 text-emerald-300' : 'bg-rose-900 text-rose-300'
                      }`}
                    >
                      {rule.type === 'bonus' ? `+${rule.points} pts` : `${rule.points} pts`}
                    </span>
                    <div>
                      <strong className="block text-slate-100">{rule.rule}</strong>
                      <span className="text-[11px] opacity-90">{rule.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plain Language "Why this rotation?" */}
          <div className="p-3.5 bg-slate-900/90 rounded-xl border border-emerald-500/30">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sprout className="w-4 h-4" />
              <span>Why This Rotation?</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
              {whyThisRotation.plainLanguageAdvice}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide block mb-1">
                  Key Strengths
                </span>
                <ul className="space-y-1 text-slate-300">
                  {whyThisRotation.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wide block mb-1">
                  Management Watchouts
                </span>
                <ul className="space-y-1 text-slate-300">
                  {whyThisRotation.risksAndWatchouts.map((risk, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
