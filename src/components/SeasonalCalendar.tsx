import React from 'react';
import { RotationCandidate } from '../types/scoring';
import { Calendar, CheckCircle2, AlertCircle, Clock, Droplet, Sprout } from 'lucide-react';

interface SeasonalCalendarProps {
  rotation: RotationCandidate;
  lang: string;
}

export const SeasonalCalendar: React.FC<SeasonalCalendarProps> = ({ rotation }) => {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/20 p-4 sm:p-6 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <Calendar className="w-5 h-5 text-emerald-400" />
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100">Seasonal Operational Action Plan</h3>
          <p className="text-xs text-slate-400">
            Recommended management calendar for <span className="text-emerald-400 font-semibold">{rotation.title}</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {rotation.seasons.map((slot, idx) => (
          <div key={idx} className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-900/60 text-emerald-300 font-bold text-xs">
                  Year {slot.year} • {slot.seasonName}
                </span>
                <span className="text-sm font-bold text-slate-100">{slot.crop.name}</span>
                {slot.isCoverCrop && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Cover Crop Armor
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400">
                Duration: <strong className="text-slate-200">{slot.crop.seasonDays} days</strong>
              </span>
            </div>

            {/* Milestones */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-slate-900/70 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                  1. Pre-Planting Prep
                </span>
                <p className="text-slate-300 text-[11px] leading-tight">
                  {slot.isCoverCrop
                    ? 'Broadcast seed into standing crop or light no-till drill.'
                    : slot.crop.family === 'Fabaceae'
                    ? 'Inoculate seed with specific Rhizobium strain for max N fixation.'
                    : 'Soil test for residual N from preceding pulse; minimize tillage.'}
                </p>
              </div>

              <div className="p-2.5 bg-slate-900/70 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                  2. Sowing & Emergence
                </span>
                <p className="text-slate-300 text-[11px] leading-tight">
                  Optimal soil temp: &gt;12°C. Ensure firm seed-to-soil contact. Monitor early moisture.
                </p>
              </div>

              <div className="p-2.5 bg-slate-900/70 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                  3. Mid-Season Scouting
                </span>
                <p className="text-slate-300 text-[11px] leading-tight">
                  Check root nodulation or vegetative vigor. Scout for pests; weed suppression is active.
                </p>
              </div>

              <div className="p-2.5 bg-slate-900/70 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                  4. Termination / Harvest
                </span>
                <p className="text-slate-300 text-[11px] leading-tight">
                  {slot.isCoverCrop
                    ? 'Terminate via roller-crimper or mowing at 50% bloom to maximize mulch.'
                    : 'Combine harvest at safe moisture; spread residue evenly to armor soil.'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
