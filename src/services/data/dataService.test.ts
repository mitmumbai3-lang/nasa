import { describe, it, expect } from 'vitest';
import { getFieldClimateAndSoilData } from './dataService';
import { DEMO_REGIONS, generateGenericRegionalReport } from '../../data/seedBenchmarks';
import { determineUsdaTextureClass, estimateWaterHoldingCapacity } from './soilGridsService';
import { calculateSMAPMetrics } from './smapService';
import { calculateWaterStress } from './etWaterService';

describe('Data Layer Services', () => {
  it('retrieves Iowa demo region benchmark with complete NASA data', async () => {
    const report = await getFieldClimateAndSoilData(42.0329, -93.5815);
    expect(report).toBeDefined();
    expect(report.regionName).toContain('Iowa');
    expect(report.climateNormals.annualPrecip).toBeGreaterThan(800);
    expect(report.soil.textureClass).toContain('Clay Loam');
    expect(report.anomalyFlags.length).toBeGreaterThan(0);
    expect(report.provenance.isRealTime).toBe(false);
  });

  it('retrieves Punjab demo region benchmark with severe groundwater overdraft', async () => {
    const report = await getFieldClimateAndSoilData(30.9010, 75.8573);
    expect(report).toBeDefined();
    expect(report.regionName).toContain('Punjab');
    expect(report.groundwater.aquiferDepletionRisk).toBe('critical-overdraft');
    expect(report.groundwater.graceTrendCmPerYear).toBe(-4.8);
    expect(report.soil.ph).toBeGreaterThan(7.5); // alkaline
  });

  it('retrieves Kenya demo region benchmark with bimodal rainfall', async () => {
    const report = await getFieldClimateAndSoilData(-0.3031, 36.0800);
    expect(report).toBeDefined();
    expect(report.regionName).toContain('Kenya');
    expect(report.rainfallVariability.monsoonOrRainySeasonWindow).toContain('Long Rains');
    expect(report.recent12Months.precipAnomalyPct).toBeLessThan(-20);
  });

  it('correctly classifies USDA soil textures', () => {
    expect(determineUsdaTextureClass(30, 40, 30)).toBe('Clay Loam');
    expect(determineUsdaTextureClass(65, 25, 10)).toBe('Sandy Loam');
    expect(determineUsdaTextureClass(10, 85, 5)).toBe('Silt');
    expect(determineUsdaTextureClass(20, 20, 60)).toBe('Clay');
  });

  it('calculates SMAP plant available water status appropriately', () => {
    const dry = calculateSMAPMetrics(0.12, 0.10);
    expect(dry.status).toBe('drought-stressed');
    expect(dry.plantAvailableWaterPct).toBeLessThan(25);

    const optimal = calculateSMAPMetrics(0.26, 0.22);
    expect(optimal.status).toBe('optimal');
    expect(optimal.plantAvailableWaterPct).toBeGreaterThanOrEqual(45);
  });

  it('estimates water stress deficit based on precipitation and temperature', () => {
    const stress = calculateWaterStress(600, 25);
    expect(stress.annualET0).toBeGreaterThan(1200);
    expect(stress.cropWaterDeficit).toBeGreaterThan(600);
    expect(stress.waterStressCategory).toBe('critical');
  });

  it('generates deterministic global fallback with transparent benchmark labeling', () => {
    const fallback = generateGenericRegionalReport(15.2, 102.5); // Thailand coordinate
    expect(fallback.provenance.source).toBe('regional-benchmark');
    expect(fallback.provenance.label).toContain('Baseline');
    expect(fallback.climateNormals.monthly.length).toBe(12);
  });
});
