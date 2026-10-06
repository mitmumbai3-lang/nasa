import React from 'react';
import { X, BookOpen, Calculator, Layers, AlertCircle, ShieldAlert } from 'lucide-react';

interface MethodologyModalProps {
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold text-slate-100">
                RotaSense Methodology & Scientific Assumptions
              </h3>
              <p className="text-xs text-slate-400">
                Transparent multi-criteria scoring, Earth observation integration, and scientific boundaries.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Section 1: Core Philosophy */}
          <div>
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span>1. Multi-Criteria Scoring Model (0 – 100)</span>
            </h4>
            <p className="mb-2">
              RotaSense scores candidate multi-year crop rotations through an objective, weighted multi-attribute utility function. The final score integrates six foundational dimensions:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs my-3">
              <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                <strong className="text-blue-400">Sw (Water Conservation):</strong> Compares rotational crop water requirement against effective satellite precipitation + available irrigation budget.
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                <strong className="text-emerald-400">Ss (Soil Health):</strong> Rewards biological nitrogen fixation (kg N/ha), continuous living root ground armor, residue C:N ratio, and root depth layering.
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                <strong className="text-rose-400">Sd (Climate Resilience):</strong> Cross-references crop drought and heat tolerance indices with NASA temperature anomalies and SMAP root-zone soil moisture.
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                <strong className="text-amber-400">Si (Income Stability):</strong> Evaluates revenue diversification across crop commodities to insulate against single-crop market crashes.
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                <strong className="text-purple-400">Sc (Low Input Cost):</strong> Computes synthetic fertilizer savings enabled by legume nitrogen credits and natural disease breaks.
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                <strong className="text-teal-400">Sl (Labor Feasibility):</strong> Measures operational feasibility across planting, maintenance, and harvest cycles.
              </div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-slate-300 border border-slate-800">
              Score = clamp(0, 100, [Σ (w_i × S_i) / Σ w_i] + Σ RuleBonuses - Σ RulePenalties)
            </div>
          </div>

          {/* Section 2: Agronomic Rules */}
          <div>
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>2. Agronomic Succession Rules</span>
            </h4>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>Repeated Family Penalty (-15 pts):</strong> Planting crops of the same botanical family consecutively (e.g. Poaceae corn → corn, or wheat → barley) without an intervening break crop increases soil-borne pathogen retention and is penalized.
              </li>
              <li>
                <strong>Legume Nitrogen Credit (+10 pts):</strong> A legume pulse preceding a high-nitrogen feeder (e.g. soybean or moong before wheat/maize) receives credit for biological nitrogen fixation.
              </li>
              <li>
                <strong>Root Stratification (+8 pts):</strong> Alternating shallow fibrous roots with deep taproots (e.g. chickpea, pigeonpea, sunflower, radish) breaks up plow-pans and optimizes nutrient recovery across soil horizons.
              </li>
              <li>
                <strong>Continuous Living Soil Armor (+12 pts):</strong> Inclusion of dedicated cover crops (cereal rye, hairy vetch, radish) rewards soil erosion prevention, weed suppression, and mycorrhizal fungal support.
              </li>
            </ul>
          </div>

          {/* Section 3: Data Provenance & Fallback Integrity */}
          <div>
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>3. Data Provenance & Offline Fallbacks</span>
            </h4>
            <p>
              RotaSense upholds strict data transparency: <em>we never fabricate NASA values</em>. Live API calls query NASA POWER and ISRIC SoilGrids directly. When offline or when APIs are unavailable, the application gracefully loads curated regional satellite benchmarks from our verified archive and tags all figures clearly with the data source provenance badge.
            </p>
          </div>

          {/* Section 4: Scientific Disclaimer */}
          <div className="p-4 bg-amber-950/30 border border-amber-600/30 rounded-xl text-xs text-amber-200">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Decision Support Disclaimer</span>
            </div>
            RotaSense is an informational decision-support tool, not an agronomic or financial guarantee. Actual farm yields and soil responses depend on field microclimates, specific seed cultivars, local pest pressure, tillage practices, and timing of farm operations. Farmers should consult with local extension advisors when making capital investments.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
