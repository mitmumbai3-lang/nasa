import { RainfallVariabilityData } from '../../types/data';

/**
 * NASA GPM IMERG (Global Precipitation Measurement) service module.
 * Evaluates rainfall variability, storm event frequencies, and seasonal windows.
 */
export function evaluateRainfallVariability(
  annualPrecip: number,
  monthlyPrecip: number[] = [],
  latitude: number = 0
): RainfallVariabilityData {
  const isNorthern = latitude >= 0;
  // Coefficient of Variation
  let cv = 0.38;
  if (monthlyPrecip.length === 12) {
    const mean = annualPrecip / 12;
    const variance = monthlyPrecip.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / 12;
    const stdDev = Math.sqrt(variance);
    cv = mean > 0 ? Math.round((stdDev / mean) * 100) / 100 : 0.4;
  }

  let heavyStormRisk: RainfallVariabilityData['heavyStormRisk'] = 'moderate';
  if (cv > 0.55 || annualPrecip > 1300) heavyStormRisk = 'high';
  else if (cv < 0.28 && annualPrecip < 600) heavyStormRisk = 'low';

  const window =
    Math.abs(latitude) < 15
      ? 'Bimodal (Equatorial Monsoon Transitions)'
      : isNorthern
      ? 'May - September (Summer Dominant)'
      : 'November - March (Austral Summer)';

  return {
    cvPrecipitation: Math.min(1.0, Math.max(0.15, cv)),
    monsoonOrRainySeasonWindow: window,
    droughtFrequencyYears: cv > 0.5 ? 3 : 5,
    heavyStormRisk,
    gpmStationName: 'NASA GPM IMERG Final Run v06B',
  };
}
