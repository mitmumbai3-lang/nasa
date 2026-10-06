import React, { useState } from 'react';
import { NASAFieldReport } from '../types/data';
import {
  CloudRain,
  SunMedium,
  Droplets,
  Layers,
  Waves,
  Sprout,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ClimateDashboardProps {
  report: NASAFieldReport;
  lang: string;
}

export const ClimateDashboard: React.FC<ClimateDashboardProps> = ({ report }) => {
  const [activeChartTab, setActiveChartTab] = useState<'precip' | 'temp' | 'ndvi'>('precip');
  const [showDataDetails, setShowDataDetails] = useState<boolean>(false);

  const { climateNormals, recent12Months, soilMoisture, vegetationHealth, rainfallVariability, waterStress, groundwater, anomalyFlags, plainLanguageSummary, provenance } = report;

  // SVG Chart Dimensions
  const chartHeight = 180;
  const chartWidth = 560;
  const paddingX = 40;
  const paddingY = 24;
  const plotWidth = chartWidth - paddingX * 2;
  const plotHeight = chartHeight - paddingY * 2;

  // Max precip for scale
  const maxPrecip = Math.max(
    120,
    ...climateNormals.monthly.map((m) => m.precip),
    ...recent12Months.monthlyPrecip
  );

  // Min and Max Temp for scale
  const allTemps = [
    ...climateNormals.monthly.map((m) => m.tempMean),
    ...recent12Months.monthlyTemp,
  ];
  const minTemp = Math.floor(Math.min(...allTemps) - 3);
  const maxTemp = Math.ceil(Math.max(...allTemps) + 3);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudRain':
        return <CloudRain className="w-4 h-4 text-amber-400" />;
      case 'SunMedium':
      case 'Flame':
        return <SunMedium className="w-4 h-4 text-rose-400" />;
      case 'Droplets':
        return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'Waves':
        return <Waves className="w-4 h-4 text-cyan-400" />;
      case 'Sprout':
        return <Sprout className="w-4 h-4 text-emerald-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/20 p-4 sm:p-6 shadow-xl backdrop-blur-sm space-y-5">
      {/* Header & Data Provenance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
              <SunMedium className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-100">NASA Earth Observation Climate Context</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{report.regionName}</p>
        </div>

        {/* Provenance Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
              provenance.isRealTime
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${provenance.isRealTime ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'}`} />
            {provenance.label}
          </span>
          <button
            type="button"
            onClick={() => setShowDataDetails(!showDataDetails)}
            className="p-1 text-slate-400 hover:text-slate-200 transition"
            title="Toggle data citation"
          >
            {showDataDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Data Citation Info */}
      {showDataDetails && (
        <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <Info className="w-3.5 h-3.5" />
            <span>Official Data Sources & Models</span>
          </div>
          <p className="text-slate-300">
            <strong>Sensors:</strong> {provenance.citation}
          </p>
          <p className="text-slate-400 text-[11px]">
            <strong>Grid/Station:</strong> {provenance.stationOrModel} • <strong>Retrieved:</strong>{' '}
            {new Date(provenance.timestamp).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Plain Language Summary Card */}
      <div className="p-4 bg-emerald-950/30 border border-emerald-600/30 rounded-xl">
        <div className="flex items-start gap-2.5">
          <Sprout className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wide mb-1">
              Plain-Language Agroclimatic Assessment
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{plainLanguageSummary}</p>
          </div>
        </div>
      </div>

      {/* Anomaly Flag Pills */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Detected Climate & Soil Anomalies
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {anomalyFlags.map((flag) => {
            const isDanger = flag.type === 'danger';
            const isWarning = flag.type === 'warning';
            const isSuccess = flag.type === 'success';

            const bgClass = isDanger
              ? 'bg-rose-950/40 border-rose-500/40'
              : isWarning
              ? 'bg-amber-950/40 border-amber-500/40'
              : isSuccess
              ? 'bg-emerald-950/40 border-emerald-500/40'
              : 'bg-blue-950/40 border-blue-500/40';

            return (
              <div key={flag.id} className={`p-3 rounded-xl border ${bgClass} flex items-start gap-2.5 shadow-sm`}>
                <div className="p-1.5 bg-slate-900/60 rounded-lg shrink-0 mt-0.5">{getIcon(flag.iconName)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold text-slate-100 truncate">{flag.title}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-900/80 rounded text-slate-300 shrink-0">
                      {flag.metric}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight">{flag.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Satellite Telemetry Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* SMAP Soil Moisture */}
        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-medium">SMAP Root Moisture</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-bold text-slate-100">{soilMoisture.rootZoneMoisture}</span>
            <span className="text-[11px] text-slate-400">m³/m³</span>
          </div>
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded mt-1 inline-block ${
              soilMoisture.status === 'optimal'
                ? 'bg-emerald-500/20 text-emerald-300'
                : soilMoisture.status === 'dry'
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-rose-500/20 text-rose-300'
            }`}
          >
            {soilMoisture.plantAvailableWaterPct}% Plant Available
          </span>
        </div>

        {/* MODIS NDVI */}
        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-medium">MODIS Greenness (NDVI)</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-bold text-slate-100">{vegetationHealth.currentNDVI}</span>
            <span className="text-[11px] text-slate-400">/ 1.0</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            Peak: {vegetationHealth.historicalPeakNDVI} ({vegetationHealth.vigorStatus})
          </span>
        </div>

        {/* GPM IMERG Rainfall */}
        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-medium">Annual Rainfall</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-bold text-slate-100">{recent12Months.recentPrecipSum}</span>
            <span className="text-[11px] text-slate-400">mm</span>
          </div>
          <span
            className={`text-[10px] font-medium block mt-1 ${
              recent12Months.precipAnomalyPct < 0 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {recent12Months.precipAnomalyPct > 0 ? '+' : ''}
            {recent12Months.precipAnomalyPct.toFixed(0)}% vs 30-yr Normal
          </span>
        </div>

        {/* GRACE-FO Groundwater */}
        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Waves className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px] font-medium">GRACE-FO Groundwater</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-bold text-slate-100">{groundwater.graceTrendCmPerYear}</span>
            <span className="text-[11px] text-slate-400">cm/yr</span>
          </div>
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded mt-1 inline-block ${
              groundwater.aquiferDepletionRisk === 'critical-overdraft'
                ? 'bg-rose-500/20 text-rose-300'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            {groundwater.aquiferDepletionRisk === 'critical-overdraft' ? 'Critical Overdraft' : 'Moderate Trend'}
          </span>
        </div>
      </div>

      {/* Interactive Trend Chart Section */}
      <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-bold text-slate-200">Historical 30-Year Normals vs Recent Trends</span>
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setActiveChartTab('precip')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition ${
                activeChartTab === 'precip' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Precipitation (mm)
            </button>
            <button
              type="button"
              onClick={() => setActiveChartTab('temp')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition ${
                activeChartTab === 'temp' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Temperature (°C)
            </button>
            <button
              type="button"
              onClick={() => setActiveChartTab('ndvi')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition ${
                activeChartTab === 'ndvi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              MODIS NDVI
            </button>
          </div>
        </div>

        {/* Responsive SVG Chart */}
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto min-w-[480px]">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = paddingY + plotHeight * (1 - pct);
              return (
                <g key={i}>
                  <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="#334155" strokeDasharray="3,3" />
                  <text x={paddingX - 6} y={y + 3} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">
                    {activeChartTab === 'precip'
                      ? Math.round(maxPrecip * pct)
                      : activeChartTab === 'temp'
                      ? Math.round(minTemp + (maxTemp - minTemp) * pct)
                      : (pct).toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Precipitation Chart (Bar chart comparison) */}
            {activeChartTab === 'precip' && (
              <>
                {climateNormals.monthly.map((m, idx) => {
                  const barWidth = 14;
                  const x = paddingX + (idx / 11) * (plotWidth - barWidth * 2);
                  const hNormal = (m.precip / maxPrecip) * plotHeight;
                  const recentP = recent12Months.monthlyPrecip[idx] ?? m.precip * 0.9;
                  const hRecent = (recentP / maxPrecip) * plotHeight;

                  return (
                    <g key={m.month}>
                      {/* 30-year normal bar */}
                      <rect
                        x={x}
                        y={paddingY + plotHeight - hNormal}
                        width={barWidth / 2}
                        height={Math.max(2, hNormal)}
                        fill="#64748b"
                        rx="1"
                      />
                      {/* Recent 12-month bar */}
                      <rect
                        x={x + barWidth / 2 + 1}
                        y={paddingY + plotHeight - hRecent}
                        width={barWidth / 2}
                        height={Math.max(2, hRecent)}
                        fill="#38bdf8"
                        rx="1"
                      />
                      {/* Month label */}
                      <text x={x + barWidth / 2} y={chartHeight - 6} textAnchor="middle" fill="#94a3b8" fontSize="9">
                        {m.month}
                      </text>
                    </g>
                  );
                })}
              </>
            )}

            {/* Temperature Chart (Line comparison) */}
            {activeChartTab === 'temp' && (
              <>
                {/* 30-year normal line */}
                <path
                  d={climateNormals.monthly
                    .map((m, idx) => {
                      const x = paddingX + (idx / 11) * plotWidth;
                      const y = paddingY + plotHeight * (1 - (m.tempMean - minTemp) / (maxTemp - minTemp));
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
                {/* Recent 12-month line */}
                <path
                  d={recent12Months.monthlyTemp
                    .map((t, idx) => {
                      const x = paddingX + (idx / 11) * plotWidth;
                      const y = paddingY + plotHeight * (1 - (t - minTemp) / (maxTemp - minTemp));
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                />
                {recent12Months.monthlyTemp.map((t, idx) => {
                  const x = paddingX + (idx / 11) * plotWidth;
                  const y = paddingY + plotHeight * (1 - (t - minTemp) / (maxTemp - minTemp));
                  const m = climateNormals.monthly[idx];
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r="3" fill="#f43f5e" />
                      <text x={x} y={chartHeight - 6} textAnchor="middle" fill="#94a3b8" fontSize="9">
                        {m.month}
                      </text>
                    </g>
                  );
                })}
              </>
            )}

            {/* MODIS NDVI Curve */}
            {activeChartTab === 'ndvi' && (
              <>
                <path
                  d={vegetationHealth.seasonalCurve
                    .map((p, idx) => {
                      const x = paddingX + (idx / (vegetationHealth.seasonalCurve.length - 1)) * plotWidth;
                      const y = paddingY + plotHeight * (1 - p.baseline);
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
                <path
                  d={vegetationHealth.seasonalCurve
                    .map((p, idx) => {
                      const x = paddingX + (idx / (vegetationHealth.seasonalCurve.length - 1)) * plotWidth;
                      const y = paddingY + plotHeight * (1 - p.ndvi);
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
                {vegetationHealth.seasonalCurve.map((p, idx) => {
                  const x = paddingX + (idx / (vegetationHealth.seasonalCurve.length - 1)) * plotWidth;
                  const y = paddingY + plotHeight * (1 - p.ndvi);
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r="3" fill="#10b981" />
                      <text x={x} y={chartHeight - 6} textAnchor="middle" fill="#94a3b8" fontSize="9">
                        {p.month}
                      </text>
                    </g>
                  );
                })}
              </>
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-2 pt-2 border-t border-slate-700/60 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 bg-slate-500 rounded-sm" />
            <span>30-Year Historical Climatology</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-3 h-1.5 rounded-sm ${
                activeChartTab === 'precip' ? 'bg-sky-400' : activeChartTab === 'temp' ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
            />
            <span>Recent 12-Month Satellite Observations</span>
          </div>
        </div>
      </div>
    </div>
  );
};
