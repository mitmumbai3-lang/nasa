import React, { useState, useEffect, useMemo } from 'react';
import { SupportedLanguage, TRANSLATIONS } from './i18n/translations';
import { DEMO_REGIONS } from './data/seedBenchmarks';
import { NASAFieldReport, SoilData } from './types/data';
import { ClimateScenario, ClimateScenarioId, FarmerPriorities, RotationCandidate } from './types/scoring';
import { CROPS } from './data/crops';
import { getFieldClimateAndSoilData } from './services/data/dataService';
import { generateCandidateRotations } from './services/scoring/rotationGenerator';
import { scoreAndRankRotations } from './services/scoring/scoringEngine';

import { Header } from './components/Header';
import { DemoRegionBar } from './components/DemoRegionBar';
import { FieldMap } from './components/FieldMap';
import { SoilCard } from './components/SoilCard';
import { PrioritySliders } from './components/PrioritySliders';
import { ClimateDashboard } from './components/ClimateDashboard';
import { RotationCard } from './components/RotationCard';
import { RotationComparisonModal } from './components/RotationComparisonModal';
import { SeasonalCalendar } from './components/SeasonalCalendar';
import { PrintSummary } from './components/PrintSummary';
import { MethodologyModal } from './components/MethodologyModal';
import { AboutNasaModal } from './components/AboutNasaModal';

import {
  MapPin,
  SlidersHorizontal,
  SunMedium,
  Award,
  Calendar,
  Printer,
  Sparkles,
  RefreshCw,
  Droplet,
  Flame,
  Sun,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

export default function App() {
  // Localization
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const t = useMemo(() => TRANSLATIONS[lang] || TRANSLATIONS.en, [lang]);

  // Modals state
  const [showMethodology, setShowMethodology] = useState<boolean>(false);
  const [showAboutNasa, setShowAboutNasa] = useState<boolean>(false);
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Field & Location State
  const [currentRegionKey, setCurrentRegionKey] = useState<string>('iowa');
  const [fieldLat, setFieldLat] = useState<number>(DEMO_REGIONS.iowa.lat);
  const [fieldLon, setFieldLon] = useState<number>(DEMO_REGIONS.iowa.lon);
  const [fieldSizeHa, setFieldSizeHa] = useState<number>(DEMO_REGIONS.iowa.defaultFieldSizeHa);
  const [irrigation, setIrrigation] = useState<'none' | 'limited' | 'full'>('none');
  const [currentCrop, setCurrentCrop] = useState<string>('corn');
  const [cropHistory, setCropHistory] = useState<string[]>(['corn', 'soybean', 'corn']);

  // NASA Field Report & Soil Data State
  const [fieldReport, setFieldReport] = useState<NASAFieldReport>(DEMO_REGIONS.iowa.report);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  // Farmer Priorities
  const [priorities, setPriorities] = useState<FarmerPriorities>({
    waterSavings: 50,
    soilHealth: 50,
    incomeStability: 50,
    droughtResilience: 50,
    lowInputCost: 50,
    laborEase: 50,
  });

  // Climate Scenario State
  const [activeScenarioId, setActiveScenarioId] = useState<ClimateScenarioId>('baseline');

  // Multi-rotation comparison selection
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  // Active UI Navigation Tab / Step
  const [activeStep, setActiveStep] = useState<'setup' | 'climate' | 'rotations' | 'calendar'>('setup');

  // Load field data whenever coordinates change
  const loadDataForCoords = async (lat: number, lon: number, isDemoKey?: string) => {
    setIsLoadingData(true);
    try {
      const data = await getFieldClimateAndSoilData(lat, lon);
      setFieldReport(data);
      if (isDemoKey) {
        setCurrentRegionKey(isDemoKey);
        const demo = DEMO_REGIONS[isDemoKey];
        if (demo) {
          setFieldSizeHa(demo.defaultFieldSizeHa);
          setIrrigation(demo.defaultIrrigation);
          setCurrentCrop(demo.currentCrop);
          setCropHistory(demo.cropHistory);
        }
      } else {
        setCurrentRegionKey('custom');
      }
    } catch (e) {
      console.error('Error loading field data:', e);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSelectDemoRegion = (key: string) => {
    const demo = DEMO_REGIONS[key];
    if (!demo) return;
    setFieldLat(demo.lat);
    setFieldLon(demo.lon);
    loadDataForCoords(demo.lat, demo.lon, key);
  };

  const handleMapLocationChange = (newLat: number, newLon: number) => {
    setFieldLat(newLat);
    setFieldLon(newLon);
    loadDataForCoords(newLat, newLon);
  };

  const handleUpdateSoil = (updatedSoil: SoilData) => {
    setFieldReport((prev) => ({
      ...prev,
      soil: updatedSoil,
    }));
  };

  // Scenarios definition
  const scenarios: Record<ClimateScenarioId, ClimateScenario> = {
    baseline: {
      id: 'baseline',
      name: t.scenarioBaseline,
      tempDeltaC: 0,
      precipDeltaPct: 0,
      description: 'Historical climate normals & 12-month rolling satellite observations.',
    },
    hotter: {
      id: 'hotter',
      name: t.scenarioHotter,
      tempDeltaC: 2.0,
      precipDeltaPct: 0,
      description: 'Simulated +2.0°C warming increase during summer flowering phases.',
    },
    drier: {
      id: 'drier',
      name: t.scenarioDrier,
      tempDeltaC: 0,
      precipDeltaPct: -15.0,
      description: 'Simulated 15% rainfall reduction with extended mid-season dry spells.',
    },
    hot_dry: {
      id: 'hot_dry',
      name: t.scenarioHotDry,
      tempDeltaC: 2.0,
      precipDeltaPct: -15.0,
      description: 'Severe compound climate stress: +2.0°C heatwave coupled with -15% rainfall.',
    },
  };

  // Pure Scoring Engine Evaluation
  const rankedRotations = useMemo<RotationCandidate[]>(() => {
    if (!fieldReport) return [];
    const candidates = generateCandidateRotations(fieldReport, currentCrop);
    const scenario = scenarios[activeScenarioId];
    return scoreAndRankRotations(candidates, fieldReport, priorities, scenario, irrigation);
  }, [fieldReport, currentCrop, priorities, activeScenarioId, irrigation]);

  // Toggle selection for comparison modal
  const handleToggleCompare = (id: string) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 rotations side-by-side.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const comparedRotations = useMemo(() => {
    return rankedRotations.filter((r) => selectedForComparison.includes(r.id));
  }, [rankedRotations, selectedForComparison]);

  const topRotation = rankedRotations[0] || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        currentLang={lang}
        onLanguageChange={setLang}
        onOpenMethodology={() => setShowMethodology(true)}
        onOpenAboutNasa={() => setShowAboutNasa(true)}
      />

      {/* Demo Region Presets Bar */}
      <DemoRegionBar
        currentRegionKey={currentRegionKey}
        onSelectRegion={handleSelectDemoRegion}
        lang={lang}
      />

      {/* Main Flow Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 space-y-6">
        {/* Step Navigation Tabs (Mobile-Friendly Pill Bar) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 shadow-md scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveStep('setup')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition active:scale-95 ${
              activeStep === 'setup'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{t.fieldSetup}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('climate')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition active:scale-95 ${
              activeStep === 'climate'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <SunMedium className="w-4 h-4" />
            <span>{t.climateContext}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('rotations')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition active:scale-95 ${
              activeStep === 'rotations'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{t.rotationResults} ({rankedRotations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('calendar')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition active:scale-95 ${
              activeStep === 'calendar'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{t.actionPlan}</span>
          </button>

          {/* Quick Print Summary Button */}
          <button
            type="button"
            onClick={() => setShowPrintModal(true)}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition shrink-0"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{t.printExport}</span>
          </button>
        </div>

        {/* STEP 1: FIELD SETUP & PRIORITIES */}
        {activeStep === 'setup' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Interactive Satellite Map */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-base sm:text-lg font-bold text-slate-100">{t.fieldLocation}</h2>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {fieldLat.toFixed(3)}°, {fieldLon.toFixed(3)}°
                  </span>
                </div>

                <FieldMap
                  lat={fieldLat}
                  lon={fieldLon}
                  onLocationChange={handleMapLocationChange}
                  lang={lang}
                />

                <p className="text-xs text-slate-400 leading-relaxed">
                  💡 Drop a pin anywhere on Earth or draw your boundary. NASA GIBS overlays let you inspect real-time vegetation health (MODIS NDVI) and surface moisture directly.
                </p>
              </div>

              {/* Field Attributes & ISRIC Soil Card */}
              <div className="lg:col-span-5 space-y-4">
                {/* Field Parameters Form */}
                <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/20 p-4 sm:p-5 shadow-lg space-y-4">
                  <h3 className="text-sm sm:text-base font-bold text-slate-100 pb-2 border-b border-slate-800">
                    Farm Profile & Management
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1">{t.fieldSize}</label>
                      <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
                        <input
                          type="number"
                          min="0.1"
                          max="5000"
                          step="0.5"
                          value={fieldSizeHa}
                          onChange={(e) => setFieldSizeHa(parseFloat(e.target.value) || 1)}
                          className="w-full bg-transparent text-sm font-bold text-slate-100 focus:outline-none"
                        />
                        <span className="text-xs text-slate-400 font-medium">ha</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1">{t.irrigation}</label>
                      <select
                        value={irrigation}
                        onChange={(e) => setIrrigation(e.target.value as any)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="none">{t.irrigationNone}</option>
                        <option value="limited">{t.irrigationLimited}</option>
                        <option value="full">{t.irrigationFull}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1">{t.currentCrop}</label>
                      <select
                        value={currentCrop}
                        onChange={(e) => setCurrentCrop(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        {Object.values(CROPS)
                          .filter((c) => c.category !== 'cover')
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1">Previous Crop</label>
                      <select
                        value={cropHistory[1] || 'soybean'}
                        onChange={(e) => setCropHistory([currentCrop, e.target.value, cropHistory[2] || 'corn'])}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        {Object.values(CROPS).map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Auto-detected ISRIC Soil Card with User Override */}
                <SoilCard
                  soil={fieldReport.soil}
                  onUpdateSoil={handleUpdateSoil}
                  lang={lang}
                />
              </div>
            </div>

            {/* Farmer Priority Sliders */}
            <PrioritySliders
              priorities={priorities}
              onChange={setPriorities}
              lang={lang}
            />

            {/* Next Action Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveStep('rotations')}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/40 transition active:scale-95"
              >
                <span>Generate & Compare Rotations</span>
                <Award className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: NASA CLIMATE DASHBOARD */}
        {activeStep === 'climate' && (
          <div className="space-y-6 animate-fadeIn">
            <ClimateDashboard report={fieldReport} lang={lang} />

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setActiveStep('setup')}
                className="px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl"
              >
                ← Back to Field Setup
              </button>
              <button
                type="button"
                onClick={() => setActiveStep('rotations')}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition"
              >
                <span>View Recommended Rotations</span>
                <Award className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ROTATION RESULTS & SCENARIO TOGGLE */}
        {activeStep === 'rotations' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Climate Stress Scenario Switcher */}
            <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/20 p-4 sm:p-5 shadow-xl backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base sm:text-lg font-bold text-slate-100">
                      Live Climate Scenario Simulation
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Test how rotations withstand future heatwaves and rainfall shortages. Reruns scoring in real time.
                  </p>
                </div>

                {/* Scenario Toggle Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {(['baseline', 'hotter', 'drier', 'hot_dry'] as ClimateScenarioId[]).map((scId) => {
                    const isSelected = activeScenarioId === scId;
                    const sc = scenarios[scId];
                    return (
                      <button
                        key={scId}
                        type="button"
                        onClick={() => setActiveScenarioId(scId)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition text-center ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        {sc.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scenario Explanation Banner */}
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-300 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Active Scenario:</strong> {scenarios[activeScenarioId].description}
                </span>
              </div>
            </div>

            {/* Comparison Floating Action Bar (If any selected) */}
            {selectedForComparison.length > 0 && (
              <div className="sticky top-16 z-20 p-3 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-200">
                  <span>Selected for comparison: <strong>{selectedForComparison.length} of 3</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedForComparison([])}
                    className="px-3 py-1.5 text-xs text-emerald-300 hover:text-white"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowComparisonModal(true)}
                    className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition"
                  >
                    Open Comparison Modal
                  </button>
                </div>
              </div>
            )}

            {/* Candidate Rotation Cards */}
            <div className="space-y-4">
              {rankedRotations.map((rotation, index) => (
                <RotationCard
                  key={rotation.id}
                  rotation={rotation}
                  rank={index + 1}
                  isSelectedForComparison={selectedForComparison.includes(rotation.id)}
                  onToggleCompare={handleToggleCompare}
                  lang={lang}
                />
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveStep('setup')}
                className="px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl"
              >
                ← Edit Field Setup & Priorities
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPrintModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span>{t.printExport}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep('calendar')}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow transition"
                >
                  <span>Seasonal Calendar Plan →</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SEASONAL CALENDAR & ACTION PLAN */}
        {activeStep === 'calendar' && topRotation && (
          <div className="space-y-6 animate-fadeIn">
            <SeasonalCalendar rotation={topRotation} lang={lang} />

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveStep('rotations')}
                className="px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl"
              >
                ← Back to Rotations
              </button>
              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Export PDF / Print Action Plan</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-800/80 px-4 py-6 text-center text-xs text-slate-400 mt-12 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setShowMethodology(true)}
            className="hover:text-emerald-400 underline underline-offset-4"
          >
            Methodology & Formulas
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setShowAboutNasa(true)}
            className="hover:text-blue-400 underline underline-offset-4"
          >
            NASA Earth Science Data Sources
          </button>
          <span>•</span>
          <span>ISRIC SoilGrids v2</span>
        </div>
        <p className="text-[11px] text-slate-500">
          RotaSense is an open-science decision support tool built with NASA Earth observations. Field data stored locally in your browser.
        </p>
      </footer>

      {/* Modals */}
      {showComparisonModal && (
        <RotationComparisonModal
          rotations={comparedRotations}
          onClose={() => setShowComparisonModal(false)}
          lang={lang}
        />
      )}

      {showPrintModal && topRotation && (
        <PrintSummary
          report={fieldReport}
          topRotation={topRotation}
          fieldSizeHa={fieldSizeHa}
          irrigation={irrigation}
          onClose={() => setShowPrintModal(false)}
        />
      )}

      {showMethodology && <MethodologyModal onClose={() => setShowMethodology(false)} />}

      {showAboutNasa && <AboutNasaModal onClose={() => setShowAboutNasa(false)} />}
    </div>
  );
}
