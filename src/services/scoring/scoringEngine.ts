import { NASAFieldReport } from '../../types/data';
import {
  AgronomicRuleEffect,
  ClimateScenario,
  FarmerPriorities,
  ProjectedImpacts,
  RotationCandidate,
  ScoreBreakdown,
} from '../../types/scoring';

/**
 * Pure, deterministic scoring engine for evaluating multi-year crop rotations.
 */
export function evaluateRotationCandidate(
  candidate: RotationCandidate,
  report: NASAFieldReport,
  priorities: FarmerPriorities,
  scenario: ClimateScenario,
  irrigation: 'none' | 'limited' | 'full' = 'none'
): RotationCandidate {
  const { seasons, years } = candidate;
  const numSeasons = seasons.length;
  if (numSeasons === 0) return candidate;

  // 1. Water Conservation Score (Sw)
  // Scenario precip adjustment
  const effectiveAnnualPrecip = Math.max(
    150,
    report.climateNormals.annualPrecip * (1 + scenario.precipDeltaPct / 100)
  );
  const irrigationMmPerYear = irrigation === 'full' ? 450 : irrigation === 'limited' ? 180 : 0;
  const totalWaterAvailableMm = effectiveAnnualPrecip * 0.75 + irrigationMmPerYear;

  const totalWaterNeedMm = seasons.reduce((sum, s) => sum + s.crop.waterNeedMmPerSeason, 0);
  const annualWaterNeedMm = totalWaterNeedMm / Math.max(1, years);

  // Water score: higher score when rotation fits comfortably within water budget
  const waterBalanceRatio = totalWaterAvailableMm / Math.max(200, annualWaterNeedMm);
  let rawWaterScore: number;
  if (waterBalanceRatio >= 1.2) {
    rawWaterScore = 95;
  } else if (waterBalanceRatio >= 1.0) {
    rawWaterScore = 80 + (waterBalanceRatio - 1.0) * 75;
  } else if (waterBalanceRatio >= 0.7) {
    rawWaterScore = 45 + ((waterBalanceRatio - 0.7) / 0.3) * 35;
  } else {
    rawWaterScore = Math.max(15, waterBalanceRatio * 60);
  }

  // 2. Soil Health & Regeneration Score (Ss)
  const totalNFixed = seasons.reduce((sum, s) => sum + s.crop.nitrogenFixationKgPerHa, 0);
  const annualNFixed = totalNFixed / Math.max(1, years);

  const coverCropCount = seasons.filter((s) => s.isCoverCrop || s.crop.category === 'cover').length;
  const coverRatio = coverCropCount / numSeasons;

  const highResidueCount = seasons.filter((s) => s.crop.residueContribution === 'high').length;
  const residueScore = (highResidueCount / numSeasons) * 30 + 15;

  const nFixScore = Math.min(45, (annualNFixed / 80) * 45);
  const coverBonus = coverRatio * 25;
  const rawSoilScore = Math.min(100, Math.round(residueScore + nFixScore + coverBonus + 15));

  // 3. Climate & Drought/Heat Resilience Score (Sd)
  const effectiveTemp = report.climateNormals.meanTemp + scenario.tempDeltaC;
  const avgDroughtTol = seasons.reduce((sum, s) => sum + s.crop.droughtTolerance, 0) / numSeasons;
  const avgHeatTol = seasons.reduce((sum, s) => sum + s.crop.heatTolerance, 0) / numSeasons;

  // If scenario is hot/dry, penalty on low drought tolerance crops increases
  const climateStressFactor = (scenario.tempDeltaC > 0 ? 1.25 : 1.0) * (scenario.precipDeltaPct < 0 ? 1.25 : 1.0);
  let rawResilienceScore = Math.round((avgDroughtTol * 0.55 + avgHeatTol * 0.45) * 100);

  // Soil moisture modifier: if SMAP indicates drought-stressed soil, high tolerance is essential
  if (report.soilMoisture.status === 'drought-stressed' || report.soilMoisture.status === 'dry') {
    if (avgDroughtTol < 0.5) rawResilienceScore -= 18;
    else if (avgDroughtTol >= 0.8) rawResilienceScore += 10;
  }
  if (climateStressFactor > 1.0 && avgDroughtTol < 0.5) {
    rawResilienceScore = Math.max(15, rawResilienceScore - 20);
  } else if (climateStressFactor > 1.0 && avgDroughtTol >= 0.75) {
    rawResilienceScore = Math.min(98, rawResilienceScore + 8);
  }

  // 4. Economic & Income Stability Score (Si)
  const avgMarketIndex = seasons.reduce((sum, s) => sum + s.crop.marketStabilityIndex, 0) / numSeasons;
  const uniqueCrops = new Set(seasons.map((s) => s.cropId)).size;
  const diversityFactor = Math.min(1.0, uniqueCrops / Math.max(2, numSeasons));
  const rawIncomeScore = Math.round((avgMarketIndex * 0.7 + diversityFactor * 0.3) * 100);

  // 5. Low Input Cost Score (Sc)
  // Saved fertilizer by N fixation + natural disease break reduction
  const avgDiseaseBreak = seasons.reduce((sum, s) => sum + s.crop.diseaseBreakValue, 0) / numSeasons;
  const avgInputCost = seasons.reduce((sum, s) => sum + s.crop.inputCostIndex, 0) / numSeasons;
  const nSavingBenefit = Math.min(35, (annualNFixed / 90) * 35);
  const rawInputCostScore = Math.round((1 - avgInputCost) * 45 + avgDiseaseBreak * 20 + nSavingBenefit);

  // 6. Labor Feasibility Score (Sl)
  const avgLabor = seasons.reduce((sum, s) => sum + s.crop.laborIntensity, 0) / numSeasons;
  const rawLaborScore = Math.round((1 - avgLabor) * 85 + 15);

  // 7. Agronomic Rotation Rules (Penalties & Bonuses)
  const ruleEffects: AgronomicRuleEffect[] = [];

  // Check 7a: Repeated Family Monoculture Penalty
  for (let i = 0; i < seasons.length - 1; i++) {
    const current = seasons[i];
    const next = seasons[i + 1];
    if (current.crop.family === next.crop.family && !current.isCoverCrop && !next.isCoverCrop) {
      ruleEffects.push({
        rule: 'Repeated Family Monoculture',
        type: 'penalty',
        points: -15,
        description: `Back-to-back ${current.crop.family} (${current.crop.name} → ${next.crop.name}) increases disease & pest retention.`,
      });
      break; // apply once to keep score intuitive
    }
  }

  // Check 7b: Legume Preceding Heavy Feeder Bonus
  for (let i = 0; i < seasons.length - 1; i++) {
    const current = seasons[i];
    const next = seasons[i + 1];
    if (current.crop.family === 'Fabaceae' && (next.crop.category === 'cereal' || next.crop.nitrogenDemandKgPerHa > 100)) {
      ruleEffects.push({
        rule: 'Legume Nitrogen Credit',
        type: 'bonus',
        points: +10,
        description: `${current.crop.name} biological N credit powers subsequent heavy feeder ${next.crop.name}.`,
      });
      break;
    }
  }

  // Check 7c: Root Depth Alternation Bonus (Stratification)
  let hasRootAlternation = false;
  for (let i = 0; i < seasons.length - 1; i++) {
    const r1 = seasons[i].crop.rootDepth;
    const r2 = seasons[i + 1].crop.rootDepth;
    if ((r1 === 'shallow' && r2 === 'deep') || (r1 === 'deep' && r2 === 'shallow')) {
      hasRootAlternation = true;
      break;
    }
  }
  if (hasRootAlternation) {
    ruleEffects.push({
      rule: 'Root Architecture Stratification',
      type: 'bonus',
      points: +8,
      description: 'Alternating deep taproot and shallow root systems loosens hardpan and mines distinct soil strata.',
    });
  }

  // Check 7d: Continuous Living Cover Bonus
  if (coverCropCount > 0) {
    ruleEffects.push({
      rule: 'Continuous Living Soil Armor',
      type: 'bonus',
      points: +12,
      description: 'Cover crop suppresses erosion, captures excess nitrate, and feeds beneficial mycorrhizal fungi.',
    });
  }

  const netRuleAdjustment = ruleEffects.reduce((sum, r) => sum + r.points, 0);

  // 8. Priority Weighting
  const w = priorities;
  const totalWeight =
    (w.waterSavings || 1) +
    (w.soilHealth || 1) +
    (w.incomeStability || 1) +
    (w.droughtResilience || 1) +
    (w.lowInputCost || 1) +
    (w.laborEase || 1);

  const weightedBaseScore =
    (rawWaterScore * (w.waterSavings || 1) +
      rawSoilScore * (w.soilHealth || 1) +
      rawIncomeScore * (w.incomeStability || 1) +
      rawResilienceScore * (w.droughtResilience || 1) +
      rawInputCostScore * (w.lowInputCost || 1) +
      rawLaborScore * (w.laborEase || 1)) /
    totalWeight;

  const finalOverallScore = Math.max(5, Math.min(100, Math.round(weightedBaseScore + netRuleAdjustment)));

  const scores: ScoreBreakdown = {
    overallScore: finalOverallScore,
    waterScore: Math.max(5, Math.min(100, Math.round(rawWaterScore))),
    soilScore: Math.max(5, Math.min(100, Math.round(rawSoilScore))),
    incomeScore: Math.max(5, Math.min(100, Math.round(rawIncomeScore))),
    resilienceScore: Math.max(5, Math.min(100, Math.round(rawResilienceScore))),
    inputCostScore: Math.max(5, Math.min(100, Math.round(rawInputCostScore))),
    laborScore: Math.max(5, Math.min(100, Math.round(rawLaborScore))),
  };

  // 9. Projected Physical Impacts
  // Organic matter delta (% SOM / year)
  const somDeltaPctPerYear =
    Math.round((0.02 + coverRatio * 0.08 + (annualNFixed / 100) * 0.05 + (highResidueCount / numSeasons) * 0.04) * 100) / 100;

  // Water savings vs 1000mm baseline monoculture (1 mm = 10 m³/ha)
  const baselineWaterMm = 950;
  const waterDiffMm = Math.max(0, baselineWaterMm - annualWaterNeedMm);
  const waterSavingsM3PerHa = Math.round(waterDiffMm * 10);

  // Drought survival index
  const droughtSurvivalIndex = Math.max(10, Math.min(100, Math.round(rawResilienceScore * 0.9 + (waterBalanceRatio >= 1 ? 10 : 0))));

  const projectedImpacts: ProjectedImpacts = {
    somDeltaPctPerYear,
    waterSavingsM3PerHa,
    nitrogenFixedKgPerHaTotal: Math.round(totalNFixed),
    droughtSurvivalIndex,
  };

  return {
    ...candidate,
    scores,
    projectedImpacts,
    ruleEffects,
  };
}

/**
 * Evaluates and sorts all candidate rotations by overall score in descending order.
 */
export function scoreAndRankRotations(
  candidates: RotationCandidate[],
  report: NASAFieldReport,
  priorities: FarmerPriorities,
  scenario: ClimateScenario,
  irrigation: 'none' | 'limited' | 'full' = 'none'
): RotationCandidate[] {
  const evaluated = candidates.map((c) => evaluateRotationCandidate(c, report, priorities, scenario, irrigation));
  return evaluated.sort((a, b) => b.scores.overallScore - a.scores.overallScore);
}
