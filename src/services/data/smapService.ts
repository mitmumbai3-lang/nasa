import { SoilMoistureData } from '../../types/data';

/**
 * NASA SMAP (Soil Moisture Active Passive) service module.
 * Provides surface (0-5 cm) and root-zone (0-100 cm) volumetric soil moisture (m³/m³),
 * plant available water %, and anomaly vs 10-year satellite average.
 */
export function calculateSMAPMetrics(
  rootZoneVolumetric: number,
  surfaceVolumetric: number,
  soilWhcMmPerM: number = 150
): SoilMoistureData {
  // Clamping to realistic physical ranges
  const rz = Math.max(0.05, Math.min(0.55, rootZoneVolumetric));
  const sf = Math.max(0.04, Math.min(0.55, surfaceVolumetric));

  // Permanent wilting point typically ~0.10 - 0.14 m³/m³; field capacity ~0.30 - 0.38 m³/m³
  const pwp = 0.11;
  const fc = 0.34;
  const paw = Math.max(0, Math.min(100, Math.round(((rz - pwp) / (fc - pwp)) * 100)));

  let status: SoilMoistureData['status'] = 'optimal';
  if (paw < 25) status = 'drought-stressed';
  else if (paw < 45) status = 'dry';
  else if (paw > 85) status = 'saturated';
  else if (paw >= 45 && paw <= 70) status = 'optimal';
  else status = 'moderate';

  // Anomaly calculation against benchmark 0.28
  const baselineAverage = 0.28;
  const anomalyVsAveragePct = Math.round(((rz - baselineAverage) / baselineAverage) * 100);

  return {
    surfaceMoisture: Math.round(sf * 100) / 100,
    rootZoneMoisture: Math.round(rz * 100) / 100,
    plantAvailableWaterPct: paw,
    status,
    anomalyVsAveragePct,
  };
}
