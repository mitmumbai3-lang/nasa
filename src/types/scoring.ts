// Type definitions for RotaSense Rotation & Scoring Engine

export type CropCategory = 'cereal' | 'pulse' | 'oilseed' | 'cover' | 'root' | 'fiber';
export type RootArchitecture = 'shallow' | 'medium' | 'deep';

export interface CropDefinition {
  id: string;
  name: string;
  scientificName: string;
  family: string; // e.g. Poaceae, Fabaceae, Brassicaceae, Solanaceae
  category: CropCategory;
  waterNeedMmPerSeason: number; // typical mm water required
  droughtTolerance: number; // 0.0 (very sensitive) to 1.0 (extremely drought hardy)
  heatTolerance: number; // 0.0 to 1.0
  rootDepth: RootArchitecture; // shallow (<40cm), medium (40-80cm), deep (>80cm taproot)
  nitrogenFixationKgPerHa: number; // kg biological N fixed per hectare
  nitrogenDemandKgPerHa: number; // kg N consumed
  residueContribution: 'low' | 'medium' | 'high';
  residueCarbonNitrogenRatio: number; // e.g. 12 (legume, fast decay) vs 60 (cereal rye, long armor)
  diseaseBreakValue: number; // 0.0 to 1.0
  seasonDays: number; // duration from sowing to harvest
  marketStabilityIndex: number; // 0.0 (highly volatile) to 1.0 (secure staple / MSP)
  laborIntensity: number; // 0.0 (low mechanical) to 1.0 (high manual)
  inputCostIndex: number; // 0.0 (cheap seed & low chem) to 1.0 (expensive hybrid + high chem)
  suitablePhRange: [number, number]; // [min, max]
  description: string;
}

export interface FarmerPriorities {
  waterSavings: number; // 0 - 100
  soilHealth: number; // 0 - 100
  incomeStability: number; // 0 - 100
  droughtResilience: number; // 0 - 100
  lowInputCost: number; // 0 - 100
  laborEase: number; // 0 - 100 (preference for low labor workload)
}

export type ClimateScenarioId = 'baseline' | 'hotter' | 'drier' | 'hot_dry';

export interface ClimateScenario {
  id: ClimateScenarioId;
  name: string;
  tempDeltaC: number; // e.g. +2.0
  precipDeltaPct: number; // e.g. -15.0
  description: string;
}

export interface RotationSeasonSlot {
  year: number; // Year 1, 2, 3, 4
  seasonIndex: number; // 1, 2, 3 in year
  seasonName: string; // 'Kharif', 'Rabi', 'Zaid' OR 'Spring', 'Summer', 'Winter Cover'
  cropId: string;
  crop: CropDefinition;
  isCoverCrop: boolean;
  notes: string;
}

export interface ScoreBreakdown {
  overallScore: number; // 0 - 100
  waterScore: number; // 0 - 100
  soilScore: number; // 0 - 100
  incomeScore: number; // 0 - 100
  resilienceScore: number; // 0 - 100
  inputCostScore: number; // 0 - 100
  laborScore: number; // 0 - 100
}

export interface AgronomicRuleEffect {
  rule: string;
  type: 'bonus' | 'penalty';
  points: number;
  description: string;
}

export interface ProjectedImpacts {
  somDeltaPctPerYear: number; // e.g. +0.08% / yr
  waterSavingsM3PerHa: number; // m³ saved vs baseline monoculture
  nitrogenFixedKgPerHaTotal: number; // kg N added by rotation legumes
  droughtSurvivalIndex: number; // 0 - 100
}

export interface WhyThisRotation {
  primaryBenefit: string;
  strengths: string[];
  risksAndWatchouts: string[];
  plainLanguageAdvice: string;
}

export interface RotationCandidate {
  id: string;
  title: string;
  tagline: string;
  years: number;
  seasons: RotationSeasonSlot[];
  scores: ScoreBreakdown;
  projectedImpacts: ProjectedImpacts;
  ruleEffects: AgronomicRuleEffect[];
  whyThisRotation: WhyThisRotation;
  badge?: string; // e.g. 'Top Pick', 'Max Soil Builder', 'Lowest Water'
}
