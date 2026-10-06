import React from 'react';
import { RotationCandidate } from '../types/scoring';
import { X, Award, Droplet, Sprout, ShieldCheck, TrendingUp, CheckCircle2 } from 'lucide-react';

interface RotationComparisonModalProps {
  rotations: RotationCandidate[];
  onClose: () => void;
  lang: string;
}

export const RotationComparisonModal: React.FC<RotationComparisonModalProps> = ({ rotations, onClose }) => {
  if (rotations.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-xl font-bold text-slate-100">
              Side-by-Side Rotation Strategy Comparison
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparing {rotations.length} candidate rotations under current climate scenario and priority weights.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Columns Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-${rotations.length} gap-4`}>
            {rotations.map((r, idx) => (
              <div key={r.id} className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      Option {idx + 1}
                    </span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      {r.scores.overallScore} <span className="text-[10px] text-slate-400 font-normal">pts</span>
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-100 mb-1">{r.title}</h4>
                  <p className="text-xs text-slate-400 mb-4">{r.tagline}</p>

                  {/* Impact Summary */}
                  <div className="space-y-2 py-3 border-y border-slate-700/60 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Soil Organic Matter</span>
                      </span>
                      <strong className="text-emerald-400">+{r.projectedImpacts.somDeltaPctPerYear}% / yr</strong>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Droplet className="w-3.5 h-3.5 text-blue-400" />
                        <span>Water Conserved</span>
                      </span>
                      <strong className="text-blue-400">{r.projectedImpacts.waterSavingsM3PerHa} m³/ha</strong>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Biological N Fixed</span>
                      </span>
                      <strong className="text-emerald-300">+{r.projectedImpacts.nitrogenFixedKgPerHaTotal} kg N</strong>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                        <span>Drought Survival Index</span>
                      </span>
                      <strong className="text-rose-400">{r.projectedImpacts.droughtSurvivalIndex} / 100</strong>
                    </div>
                  </div>

                  {/* Score breakdown metrics */}
                  <div className="mt-4 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Dimension Scores
                    </span>
                    {[
                      { name: 'Water Conservation', score: r.scores.waterScore },
                      { name: 'Soil Health', score: r.scores.soilScore },
                      { name: 'Drought/Heat Resilience', score: r.scores.resilienceScore },
                      { name: 'Income Stability', score: r.scores.incomeScore },
                      { name: 'Low Input Cost', score: r.scores.inputCostScore },
                      { name: 'Labor Feasibility', score: r.scores.laborScore },
                    ].map((m) => (
                      <div key={m.name} className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px]">{m.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${m.score}%` }} />
                          </div>
                          <span className="font-mono text-slate-200 text-[10px] w-5 text-right">{m.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Crop Succession */}
                  <div className="mt-4 pt-3 border-t border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Crop Succession
                    </span>
                    <div className="space-y-1">
                      {r.seasons.map((s, sIdx) => (
                        <div key={sIdx} className="text-xs text-slate-300 flex items-center justify-between">
                          <span>Y{s.year} {s.seasonName}:</span>
                          <strong className={s.isCoverCrop ? 'text-emerald-400' : 'text-slate-100'}>
                            {s.crop.name}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700 text-xs text-slate-300 italic">
                  "{r.whyThisRotation.primaryBenefit}"
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
