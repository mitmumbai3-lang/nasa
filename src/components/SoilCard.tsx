import React, { useState } from 'react';
import { SoilData } from '../types/data';
import { Layers, Edit3, Check, X, ShieldCheck, HelpCircle } from 'lucide-react';
import { estimateWaterHoldingCapacity } from '../services/data/soilGridsService';

interface SoilCardProps {
  soil: SoilData;
  onUpdateSoil: (updatedSoil: SoilData) => void;
  lang: string;
}

export const SoilCard: React.FC<SoilCardProps> = ({ soil, onUpdateSoil }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [textureClass, setTextureClass] = useState(soil.textureClass);
  const [socPct, setSocPct] = useState(soil.socPct);
  const [ph, setPh] = useState(soil.ph);
  const [sandPct, setSandPct] = useState(soil.sandPct);
  const [clayPct, setClayPct] = useState(soil.clayPct);

  const handleSave = () => {
    const whc = estimateWaterHoldingCapacity(sandPct, clayPct, socPct);
    onUpdateSoil({
      ...soil,
      textureClass,
      socPct,
      socGPerKg: Math.round(socPct * 10 * 10) / 10,
      ph,
      sandPct,
      clayPct,
      waterHoldingCapacityMmPerM: whc,
      source: 'farmer-override',
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTextureClass(soil.textureClass);
    setSocPct(soil.socPct);
    setPh(soil.ph);
    setSandPct(soil.sandPct);
    setClayPct(soil.clayPct);
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/20 p-4 sm:p-5 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-100">Soil Baseline</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  soil.source === 'farmer-override'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {soil.source === 'farmer-override' ? 'Farmer Custom Override' : 'ISRIC SoilGrids v2 Auto-Detected'}
              </span>
            </div>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:text-white bg-slate-800 hover:bg-emerald-600/80 rounded-xl border border-slate-700 transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Override</span>
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Texture</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-200 block truncate" title={soil.textureClass}>
              {soil.textureClass}
            </span>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Organic Carbon (SOC)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-sm font-bold text-emerald-400">{soil.socPct.toFixed(2)}%</span>
              <span className="text-[10px] text-slate-400">({soil.socGPerKg} g/kg)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Soil pH (H₂O)</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-slate-200">{soil.ph.toFixed(1)}</span>
              <span className="text-[10px] text-slate-400">
                {soil.ph < 6.0 ? '(Acidic)' : soil.ph > 7.5 ? '(Alkaline)' : '(Neutral)'}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Water Holding Capacity</span>
            <span className="text-xs sm:text-sm font-bold text-blue-400">{soil.waterHoldingCapacityMmPerM} mm/m</span>
          </div>
        </div>
      ) : (
        /* Edit Override Form */
        <div className="mt-3 p-4 bg-slate-800/90 rounded-xl border border-emerald-500/40 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Texture Classification</label>
              <select
                value={textureClass}
                onChange={(e) => setTextureClass(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Loam">Loam (Balanced)</option>
                <option value="Clay Loam">Clay Loam</option>
                <option value="Sandy Loam">Sandy Loam (Drains quickly)</option>
                <option value="Clay">Heavy Clay</option>
                <option value="Silt Loam">Silt Loam</option>
                <option value="Sand">Sand / Coarse</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Organic Carbon: <strong className="text-emerald-400">{socPct.toFixed(2)}%</strong>
              </label>
              <input
                type="range"
                min="0.2"
                max="5.0"
                step="0.05"
                value={socPct}
                onChange={(e) => setSocPct(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Soil pH: <strong className="text-slate-100">{ph.toFixed(1)}</strong>
              </label>
              <input
                type="range"
                min="4.5"
                max="9.0"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer mt-1"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Override</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
