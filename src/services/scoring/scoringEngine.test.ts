import { describe, it, expect } from 'vitest';
import { DEMO_REGIONS } from '../../data/seedBenchmarks';
import { generateCandidateRotations } from './rotationGenerator';
import { evaluateRotationCandidate, scoreAndRankRotations } from './scoringEngine';
import { ClimateScenario, FarmerPriorities } from '../../types/scoring';

const defaultPriorities: FarmerPriorities = {
  waterSavings: 50,
  soilHealth: 50,
  incomeStability: 50,
  droughtResilience: 50,
  lowInputCost: 50,
  laborEase: 50,
};

const baselineScenario: ClimateScenario = {
  id: 'baseline',
  name: 'Current Baseline',
  tempDeltaC: 0,
  precipDeltaPct: 0,
  description: 'Historical climate normals and recent rolling trends.',
};

const hotterScenario: ClimateScenario = {
  id: 'hotter',
  name: 'Hotter (+2.0°C)',
  tempDeltaC: 2.0,
  precipDeltaPct: 0,
  description: 'Simulated +2.0°C summer heatwave stress.',
};

const drierScenario: ClimateScenario = {
  id: 'drier',
  name: 'Drier (-15% Rain)',
  tempDeltaC: 0,
  precipDeltaPct: -15.0,
  description: 'Simulated 15% rainfall reduction.',
};

const hotDryScenario: ClimateScenario = {
  id: 'hot_dry',
  name: 'Hot & Dry (+2°C, -15% Rain)',
  tempDeltaC: 2.0,
  precipDeltaPct: -15.0,
  description: 'Combined severe compound heatwave and drought stress.',
};

describe('Rotation Recommender & Scoring Engine (Milestone 2)', () => {
  it('generates 3 to 4 candidates for Iowa Corn Belt', () => {
    const report = DEMO_REGIONS.iowa.report;
    const candidates = generateCandidateRotations(report, 'corn');
    expect(candidates.length).toBeGreaterThanOrEqual(3);
    expect(candidates.some((c) => c.id.includes('continuous-corn'))).toBe(true);
    expect(candidates.some((c) => c.id.includes('regenerative'))).toBe(true);
  });

  it('penalizes continuous monoculture with repeated family rule', () => {
    const report = DEMO_REGIONS.iowa.report;
    const candidates = generateCandidateRotations(report, 'corn');
    const mono = candidates.find((c) => c.id.includes('continuous-corn'))!;

    const evaluatedMono = evaluateRotationCandidate(mono, report, defaultPriorities, baselineScenario);
    const penalty = evaluatedMono.ruleEffects.find((r) => r.rule === 'Repeated Family Monoculture');
    expect(penalty).toBeDefined();
    expect(penalty?.points).toBe(-15);
  });

  it('rewards regenerative rotation with legume credit and living cover bonuses', () => {
    const report = DEMO_REGIONS.iowa.report;
    const candidates = generateCandidateRotations(report, 'corn');
    const regen = candidates.find((c) => c.id.includes('regenerative'))!;

    const evaluatedRegen = evaluateRotationCandidate(regen, report, defaultPriorities, baselineScenario);
    const coverBonus = evaluatedRegen.ruleEffects.find((r) => r.rule === 'Continuous Living Soil Armor');
    const legumeBonus = evaluatedRegen.ruleEffects.find((r) => r.rule === 'Legume Nitrogen Credit');

    expect(coverBonus).toBeDefined();
    expect(coverBonus?.points).toBe(12);
    expect(legumeBonus).toBeDefined();
    expect(legumeBonus?.points).toBe(10);
    expect(evaluatedRegen.scores.overallScore).toBeGreaterThan(evaluatedRegen.scores.waterScore - 20);
    expect(evaluatedRegen.scores.soilScore).toBeGreaterThan(80);
  });

  it('proves climate stress scenario changes scores and shifts resilience advantage', () => {
    const report = DEMO_REGIONS.punjab.report;
    const candidates = generateCandidateRotations(report, 'rice');

    const baselineRanked = scoreAndRankRotations(candidates, report, defaultPriorities, baselineScenario);
    const hotDryRanked = scoreAndRankRanked(candidates, report, defaultPriorities, hotDryScenario);

    function scoreAndRankRanked(c: any, r: any, p: any, s: any) {
      return scoreAndRankRotations(c, r, p, s);
    }

    // In Punjab, the drought-hardy millet/mustard/chickpea should score higher under hot & dry scenario
    const milletBaseline = baselineRanked.find((c) => c.id.includes('millet'))!;
    const milletHotDry = hotDryRanked.find((c) => c.id.includes('millet'))!;
    const riceBaseline = baselineRanked.find((c) => c.id.includes('rice-wheat'))!;
    const riceHotDry = hotDryRanked.find((c) => c.id.includes('rice-wheat'))!;

    expect(riceHotDry.scores.overallScore).toBeLessThan(riceBaseline.scores.overallScore);
    expect(milletHotDry.scores.overallScore).toBeGreaterThan(riceHotDry.scores.overallScore);
  });

  it('dynamically adapts rank when farmer sets water savings to maximum priority', () => {
    const report = DEMO_REGIONS.punjab.report;
    const candidates = generateCandidateRotations(report, 'rice');

    const waterFirstPriorities: FarmerPriorities = {
      waterSavings: 100,
      soilHealth: 20,
      incomeStability: 20,
      droughtResilience: 30,
      lowInputCost: 30,
      laborEase: 20,
    };

    const ranked = scoreAndRankRotations(candidates, report, waterFirstPriorities, baselineScenario);
    // Rice-wheat should be ranked at the bottom due to massive water footprint
    expect(ranked[ranked.length - 1].id).toContain('rice-wheat');
    // Top pick should be either maize-moong or millet
    expect(ranked[0].id).not.toContain('rice-wheat');
  });

  it('calculates physical deltas for organic carbon accumulation and water savings', () => {
    const report = DEMO_REGIONS.kenya.report;
    const candidates = generateCandidateRotations(report, 'maize');
    const pigeonpeaRotation = candidates.find((c) => c.id.includes('pigeonpea'))!;

    const evaluated = evaluateRotationCandidate(pigeonpeaRotation, report, defaultPriorities, baselineScenario);
    expect(evaluated.projectedImpacts.somDeltaPctPerYear).toBeGreaterThan(0.05);
    expect(evaluated.projectedImpacts.nitrogenFixedKgPerHaTotal).toBeGreaterThan(50);
    expect(evaluated.projectedImpacts.droughtSurvivalIndex).toBeGreaterThan(60);
  });
});
