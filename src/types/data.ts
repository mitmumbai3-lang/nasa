// Type definitions for RotaSense Data Layer

export type DataProvenance = 'live-nasa' | 'isric-live' | 'regional-benchmark' | 'offline-cache';

export interface DataProvenanceInfo {
  source: DataProvenance;
  label: string;
  isRealTime: boolean;
  citation: string;
  timestamp: string;
  stationOrModel: string;
}

export interface MonthlyClimatePoint {
  month: string; // 'Jan', 'Feb', etc.
  monthIndex: number; // 1-12
  tempMean: number; // °C
  tempMax: number; // °C
  tempMin: number; // °C
  precip: number; // mm/month
  solarRad: number; // MJ/m^2/day or kWh/m^2/day
  humidity: number; // %
}

export interface ClimateNormals {
  annualPrecip: number; // mm
  meanTemp: number; // °C
  maxTemp: number; // °C
  minTemp: number; // °C
  growingSeasonDays: number; // days with T > 10°C
  monthly: MonthlyClimatePoint[];
}

export interface ClimateRecent12Months {
  monthlyPrecip: number[]; // 12 values
  monthlyTemp: number[]; // 12 values
  monthlySolarRad: number[];
  recentPrecipSum: number; // mm
  precipAnomalyPct: number; // e.g. -18.5%
  tempAnomalyC: number; // e.g. +1.4°C
  consecutiveDryDaysMax: number; // days
  extremeRainEventsCount: number; // events > 25mm
}

export interface SoilMoistureData {
  surfaceMoisture: number; // 0-5 cm (m³/m³, e.g. 0.22)
  rootZoneMoisture: number; // 0-100 cm (m³/m³, e.g. 0.28)
  plantAvailableWaterPct: number; // 0-100%
  status: 'optimal' | 'moderate' | 'dry' | 'drought-stressed' | 'saturated';
  anomalyVsAveragePct: number; // e.g. -15%
}

export interface VegetationHealthData {
  currentNDVI: number; // 0.0 - 1.0 (e.g. 0.65)
  historicalPeakNDVI: number;
  anomalyPct: number; // e.g. +5% or -12%
  seasonalCurve: { month: string; ndvi: number; baseline: number }[];
  vigorStatus: 'vigorous' | 'normal' | 'stressed' | 'dormant';
}

export interface RainfallVariabilityData {
  cvPrecipitation: number; // coefficient of variation (0-1)
  monsoonOrRainySeasonWindow: string; // e.g., 'May - Sep' or 'Mar - May & Oct - Dec'
  droughtFrequencyYears: number; // e.g. 1 in 4 years
  heavyStormRisk: 'low' | 'moderate' | 'high';
  gpmStationName: string;
}

export interface WaterStressData {
  annualET0: number; // mm/year
  cropWaterDeficit: number; // mm/year (ET0 - Precip)
  evapotranspirationIndex: number; // ratio (ETa / ET0)
  waterStressCategory: 'low' | 'moderate' | 'severe' | 'critical';
}

export interface GroundwaterTrendData {
  graceTrendCmPerYear: number; // cm equivalent water thickness/year (e.g. -3.2 cm/yr)
  aquiferDepletionRisk: 'stable' | 'moderate-depletion' | 'critical-overdraft' | 'recharging';
  basinName: string;
}

export interface SoilData {
  textureClass: string; // 'Loam', 'Clay Loam', 'Sandy Loam', 'Silky Clay', etc.
  sandPct: number; // 0-100
  siltPct: number; // 0-100
  clayPct: number; // 0-100
  socGPerKg: number; // Soil organic carbon g/kg (e.g. 18.5 = ~1.85%)
  socPct: number; // % (socGPerKg / 10)
  ph: number; // 4.5 - 9.0
  waterHoldingCapacityMmPerM: number; // mm water / meter soil
  source: 'isric-live' | 'soil-benchmark' | 'farmer-override';
}

export interface ClimateAnomalyFlag {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  metric: string;
  iconName: string;
}

export interface NASAFieldReport {
  coordinates: { lat: number; lon: number };
  regionName: string;
  provenance: DataProvenanceInfo;
  climateNormals: ClimateNormals;
  recent12Months: ClimateRecent12Months;
  soilMoisture: SoilMoistureData;
  vegetationHealth: VegetationHealthData;
  rainfallVariability: RainfallVariabilityData;
  waterStress: WaterStressData;
  groundwater: GroundwaterTrendData;
  soil: SoilData;
  anomalyFlags: ClimateAnomalyFlag[];
  plainLanguageSummary: string;
}
