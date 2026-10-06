import { describe, it, expect } from 'vitest';
import { DEMO_REGIONS } from './data/seedBenchmarks';
import { generateCandidateRotations } from './services/scoring/rotationGenerator';
import { scoreAndRankRotations, evaluateRotationCandidate } from './services/scoring/scoringEngine';
import { TRANSLATIONS } from './i18n/translations';
import { CROPS } from './data/crops';
import { ClimateScenario, FarmerPriorities } from './types/scoring';

describe('RotaSense End-to-End Pipeline & Scenarios Integration', () => {
  const defaultPriorities: FarmerPriorities = {
    waterSavings: 50,
    soilHealth: 50,
    incomeStability: 50,
    droughtResilience: 50,
    lowInputCost: 50,
    laborEase: 50,
  };

  const scenarios: Record<string, ClimateScenario> = {
    baseline: {
      id: 'baseline',
      name: 'Baseline',
      tempDeltaC: 0,
      precipDeltaPct: 0,
      description: 'Historical normals',
    },
    hotter: {
      id: 'hotter',
      name: 'Hotter (+2°C)',
      tempDeltaC: 2.0,
      precipDeltaPct: 0,
      description: 'Heat stress',
    },
    drier: {
      id: 'drier',
      name: 'Drier (-15%)',
      tempDeltaC: 0,
      precipDeltaPct: -15.0,
      description: 'Drought stress',
    },
    hot_dry: {
      id: 'hot_dry',
      name: 'Hot & Dry (+2°C, -15%)',
      tempDeltaC: 2.0,
      precipDeltaPct: -15.0,
      description: 'Compound stress',
    },
  };

  it('verifies all 3 demo regions generate ranked candidates across all 4 climate scenarios', () => {
    const regionKeys = ['iowa', 'punjab', 'kenya'];

    for (const rKey of regionKeys) {
      const demo = DEMO_REGIONS[rKey];
      expect(demo).toBeDefined();

      const candidates = generateCandidateRotations(demo.report, demo.currentCrop);
      expect(candidates.length).toBeGreaterThanOrEqual(3);

      for (const [scKey, scenario] of Object.entries(scenarios)) {
        const ranked = scoreAndRankRotations(
          candidates,
          demo.report,
          defaultPriorities,
          scenario,
          demo.defaultIrrigation
        );

        expect(ranked.length).toBe(candidates.length);
        // Scores must be within valid range 0 to 100
        for (const r of ranked) {
          expect(r.scores.overallScore).toBeGreaterThanOrEqual(5);
          expect(r.scores.overallScore).toBeLessThanOrEqual(100);
          expect(r.scores.waterScore).toBeGreaterThanOrEqual(0);
          expect(r.scores.soilScore).toBeGreaterThanOrEqual(0);
          expect(r.scores.resilienceScore).toBeGreaterThanOrEqual(0);
          expect(r.projectedImpacts.somDeltaPctPerYear).toBeGreaterThan(0);
          expect(r.whyThisRotation.plainLanguageAdvice.length).toBeGreaterThan(10);
        }

        // Verify descending rank order
        for (let i = 0; i < ranked.length - 1; i++) {
          expect(ranked[i].scores.overallScore).toBeGreaterThanOrEqual(ranked[i + 1].scores.overallScore);
        }
      }
    }
  });

  it('validates i18n dictionaries have complete keys across all 5 languages', () => {
    const langs = ['en', 'es', 'fr', 'hi', 'sw'] as const;
    const requiredKeys = Object.keys(TRANSLATIONS.en);

    for (const l of langs) {
      const dict = TRANSLATIONS[l];
      expect(dict).toBeDefined();
      for (const k of requiredKeys) {
        expect((dict as any)[k]).toBeDefined();
        expect(typeof (dict as any)[k]).toBe('string');
        expect((dict as any)[k].length).toBeGreaterThan(0);
      }
    }
  });

  it('validates crop database integrity', () => {
    const cropKeys = Object.keys(CROPS);
    expect(cropKeys.length).toBeGreaterThanOrEqual(15);

    for (const [key, crop] of Object.entries(CROPS)) {
      expect(crop.name).toBeDefined();
      expect(crop.family).toBeDefined();
      expect(crop.waterNeedMmPerSeason).toBeGreaterThan(100);
      expect(crop.droughtTolerance).toBeGreaterThanOrEqual(0);
      expect(crop.droughtTolerance).toBeLessThanOrEqual(1);
      expect(crop.seasonDays).toBeGreaterThan(40);
    }
  });
});
