import { WaterStressData } from '../../types/data';

/**
 * MODIS/ECOSTRESS Evapotranspiration and crop water balance module.
 * Evaluates reference evapotranspiration (ET0) and cumulative water deficit (Precip - ET0).
 */
export function calculateWaterStress(annualPrecip: number, meanTemp: number): WaterStressData {
  // Hargreaves / Turc approximation of annual reference evapotranspiration (ET0)
  const baseET0 = Math.round(Math.max(600, meanTemp * 58 + 250));
  const deficit = Math.max(0, baseET0 - annualPrecip);
  const etRatio = Math.round((Math.min(baseET0, annualPrecip) / baseET0) * 100) / 100;

  let category: WaterStressData['waterStressCategory'] = 'low';
  if (deficit > 650) category = 'critical';
  else if (deficit > 350) category = 'severe';
  else if (deficit > 100) category = 'moderate';
  else category = 'low';

  return {
    annualET0: baseET0,
    cropWaterDeficit: deficit,
    evapotranspirationIndex: etRatio,
    waterStressCategory: category,
  };
}
