import { VegetationHealthData } from '../../types/data';

/**
 * MODIS/VIIRS NDVI & EVI service module.
 * Provides vegetation health history, peak greenness anomaly, and seasonal vigor classification.
 */
export function evaluateVegetationHealth(
  currentNDVI: number,
  baselinePeakNDVI: number = 0.78,
  seasonalCurve?: { month: string; ndvi: number; baseline: number }[]
): VegetationHealthData {
  const clampedNDVI = Math.max(0.05, Math.min(0.95, currentNDVI));
  const anomalyPct = Math.round(((clampedNDVI - baselinePeakNDVI) / baselinePeakNDVI) * 100);

  let vigorStatus: VegetationHealthData['vigorStatus'] = 'normal';
  if (clampedNDVI >= 0.72) vigorStatus = 'vigorous';
  else if (clampedNDVI <= 0.35) vigorStatus = 'dormant';
  else if (anomalyPct < -15) vigorStatus = 'stressed';
  else vigorStatus = 'normal';

  const defaultCurve = [
    { month: 'Apr', ndvi: 0.32, baseline: 0.35 },
    { month: 'May', ndvi: 0.54, baseline: 0.58 },
    { month: 'Jun', ndvi: 0.74, baseline: 0.78 },
    { month: 'Jul', ndvi: clampedNDVI, baseline: baselinePeakNDVI },
    { month: 'Aug', ndvi: 0.71, baseline: 0.76 },
    { month: 'Sep', ndvi: 0.52, baseline: 0.58 },
  ];

  return {
    currentNDVI: Math.round(clampedNDVI * 100) / 100,
    historicalPeakNDVI: Math.round(baselinePeakNDVI * 100) / 100,
    anomalyPct,
    vigorStatus,
    seasonalCurve: seasonalCurve ?? defaultCurve,
  };
}
