import React from 'react';
import { NASAFieldReport } from '../types/data';
import { RotationCandidate } from '../types/scoring';
import { Printer, X } from 'lucide-react';

interface PrintSummaryProps {
  report: NASAFieldReport;
  topRotation: RotationCandidate;
  fieldSizeHa: number;
  irrigation: string;
  onClose: () => void;
}

export const PrintSummary: React.FC<PrintSummaryProps> = ({
  report,
  topRotation,
  fieldSizeHa,
  irrigation,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:max-h-none print:shadow-none print:rounded-none">
        {/* Header Controls (Hidden during print) */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div>
            <h3 className="text-base font-bold text-slate-900">Printable Farm Action Plan Summary</h3>
            <p className="text-xs text-slate-600">Clean high-contrast printable document for field records or agronomist review.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 print:p-0 print:overflow-visible">
          {/* Header */}
          <div className="border-b-2 border-emerald-600 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black text-emerald-800 tracking-tight">RotaSense Action Plan</h1>
              <p className="text-xs text-slate-600 font-medium">
                Crop Rotation & Climate Resilience Strategy Grounded in NASA Earth Data
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>Generated: {new Date().toLocaleDateString()}</p>
              <p className="font-semibold text-slate-700">{report.regionName}</p>
            </div>
          </div>

          {/* Field & Soil Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Field Coordinates</span>
              <strong className="text-slate-800">
                {report.coordinates.lat.toFixed(3)}°, {report.coordinates.lon.toFixed(3)}°
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Field Size & Water</span>
              <strong className="text-slate-800">
                {fieldSizeHa} ha ({irrigation})
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">ISRIC Soil Profile</span>
              <strong className="text-slate-800">
                {report.soil.textureClass} (pH {report.soil.ph})
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Organic Carbon (SOC)</span>
              <strong className="text-emerald-700">
                {report.soil.socPct.toFixed(2)}% ({report.soil.socGPerKg} g/kg)
              </strong>
            </div>
          </div>

          {/* NASA Climate Context Findings */}
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
              NASA Climate & Telemetry Findings
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed mb-3">{report.plainLanguageSummary}</p>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 border rounded-lg">
                <span className="text-slate-500 block">Annual Precipitation</span>
                <span className="font-bold text-slate-800">
                  {report.recent12Months.recentPrecipSum} mm ({report.recent12Months.precipAnomalyPct.toFixed(0)}% vs 30-yr)
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 border rounded-lg">
                <span className="text-slate-500 block">SMAP Soil Moisture</span>
                <span className="font-bold text-slate-800">
                  {report.soilMoisture.rootZoneMoisture} m³/m³ ({report.soilMoisture.status})
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 border rounded-lg">
                <span className="text-slate-500 block">GRACE Groundwater Trend</span>
                <span className="font-bold text-slate-800">
                  {report.groundwater.graceTrendCmPerYear} cm/yr ({report.groundwater.aquiferDepletionRisk})
                </span>
              </div>
            </div>
          </div>

          {/* Recommended Rotation Details */}
          <div>
            <div className="flex items-baseline justify-between mb-2 border-b border-slate-200 pb-1">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Recommended Strategy: {topRotation.title}
              </h2>
              <span className="text-sm font-bold text-emerald-700 font-mono">
                Resilience Score: {topRotation.scores.overallScore} / 100
              </span>
            </div>
            <p className="text-xs text-slate-700 italic mb-3">"{topRotation.tagline}"</p>

            {/* Projected Benefits */}
            <div className="grid grid-cols-4 gap-2 text-xs mb-4">
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                <span className="text-emerald-800 block text-[10px]">Projected Soil Carbon</span>
                <strong className="text-emerald-700 font-bold">
                  +{topRotation.projectedImpacts.somDeltaPctPerYear}% / yr
                </strong>
              </div>
              <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <span className="text-blue-800 block text-[10px]">Annual Water Saved</span>
                <strong className="text-blue-700 font-bold">
                  {topRotation.projectedImpacts.waterSavingsM3PerHa} m³/ha
                </strong>
              </div>
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                <span className="text-emerald-800 block text-[10px]">Biological Nitrogen</span>
                <strong className="text-emerald-700 font-bold">
                  +{topRotation.projectedImpacts.nitrogenFixedKgPerHaTotal} kg N/ha
                </strong>
              </div>
              <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-center">
                <span className="text-amber-800 block text-[10px]">Drought Survival</span>
                <strong className="text-amber-700 font-bold">
                  {topRotation.projectedImpacts.droughtSurvivalIndex} / 100
                </strong>
              </div>
            </div>

            {/* Succession Timeline */}
            <h3 className="text-xs font-bold text-slate-800 mb-2">Crop Succession Timeline</h3>
            <table className="w-full text-xs text-left border border-slate-300 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="p-2 border-b">Phase</th>
                  <th className="p-2 border-b">Crop</th>
                  <th className="p-2 border-b">Family</th>
                  <th className="p-2 border-b">Root Depth</th>
                  <th className="p-2 border-b">N Fixation</th>
                  <th className="p-2 border-b">Role & Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {topRotation.seasons.map((s, idx) => (
                  <tr key={idx} className={s.isCoverCrop ? 'bg-emerald-50/50' : ''}>
                    <td className="p-2 font-medium">Year {s.year} {s.seasonName}</td>
                    <td className="p-2 font-bold text-slate-900">{s.crop.name}</td>
                    <td className="p-2 text-slate-600">{s.crop.family}</td>
                    <td className="p-2 text-slate-600">{s.crop.rootDepth}</td>
                    <td className="p-2 text-emerald-700 font-semibold">
                      {s.crop.nitrogenFixationKgPerHa > 0 ? `+${s.crop.nitrogenFixationKgPerHa} kg/ha` : '0'}
                    </td>
                    <td className="p-2 text-slate-600">{s.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Agronomic Recommendations */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <h3 className="font-bold text-slate-800 mb-1">Agronomic Recommendations & Advice</h3>
            <p className="text-slate-700 leading-relaxed mb-2">{topRotation.whyThisRotation.plainLanguageAdvice}</p>
            <div className="text-[11px] text-slate-500 border-t pt-2 mt-2">
              <strong>Disclaimer:</strong> RotaSense provides decision-support analysis using NASA Earth observation and ISRIC SoilGrids data. Actual farm performance depends on local microclimates, seed varieties, and management practices.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
