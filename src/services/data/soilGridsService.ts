import { SoilData } from '../../types/data';

/**
 * Determines USDA Soil Texture classification from sand, silt, and clay percentages.
 */
export function determineUsdaTextureClass(sand: number, silt: number, clay: number): string {
  if (sand + silt + clay === 0) return 'Loam';
  // Normalize to 100%
  const total = sand + silt + clay;
  const s = (sand / total) * 100;
  const si = (silt / total) * 100;
  const c = (clay / total) * 100;

  if (c >= 40) {
    if (s >= 45) return 'Sandy Clay';
    if (si >= 40) return 'Silty Clay';
    return 'Clay';
  }
  if (c >= 27 && c < 40) {
    if (s >= 20 && s <= 45) return 'Clay Loam';
    if (s > 45) return 'Sandy Clay Loam';
    return 'Silty Clay Loam';
  }
  if (c >= 7 && c < 27) {
    if (si >= 50 && (c >= 12 || s < 50)) return 'Silt Loam';
    if (s >= 52) return 'Sandy Loam';
    return 'Loam';
  }
  // c < 7
  if (si >= 80) return 'Silt';
  if (s >= 85) return 'Sand';
  if (s >= 70) return 'Loamy Sand';
  return 'Sandy Loam';
}

/**
 * Estimates soil water holding capacity (mm water / meter soil depth)
 * based on texture and organic carbon content.
 */
export function estimateWaterHoldingCapacity(sand: number, clay: number, socPct: number): number {
  // Basic Saxton-Rawls pedotransfer approximation
  let baseWhc = 140; // baseline loam
  if (sand > 60) baseWhc = 90; // sandy
  else if (clay > 35) baseWhc = 160; // clay
  else if (sand < 30 && clay < 25) baseWhc = 180; // silt loam

  // Organic matter significantly expands water retention (+15-20 mm per 1% SOC)
  const socBonus = Math.min(60, socPct * 18);
  return Math.round(baseWhc + socBonus);
}

/**
 * Fetches soil characteristics from the official ISRIC SoilGrids v2 REST API.
 */
export async function fetchSoilGridsData(
  lat: number,
  lon: number,
  timeoutMs: number = 5000
): Promise<SoilData | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon.toFixed(4)}&lat=${lat.toFixed(4)}&property=clay&property=sand&property=silt&property=soc&property=phh2o&depth=0-30cm&value=mean`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`ISRIC SoilGrids API returned ${res.status}`);
      return null;
    }

    const json = await res.json();
    const layers = json?.properties?.layers;
    if (!layers || !Array.isArray(layers)) return null;

    const findMeanValue = (propName: string): number | null => {
      const layer = layers.find((l: any) => l.name === propName);
      const depth = layer?.depths?.find((d: any) => d.range?.top_depth === 0 || d.label === '0-30cm' || d.label === '0-5cm');
      const val = depth?.values?.mean;
      return typeof val === 'number' ? val : null;
    };

    // ISRIC raw units:
    // sand, silt, clay: g/kg (divide by 10 to get %)
    // soc: dg/kg (divide by 10 to get g/kg, divide by 100 for %)
    // phh2o: pH * 10 (divide by 10 to get standard pH)
    const rawSand = findMeanValue('sand');
    const rawSilt = findMeanValue('silt');
    const rawClay = findMeanValue('clay');
    const rawSoc = findMeanValue('soc');
    const rawPh = findMeanValue('phh2o');

    if (rawSand === null && rawClay === null) return null;

    const sandPct = Math.round((rawSand ?? 400) / 10);
    const siltPct = Math.round((rawSilt ?? 400) / 10);
    const clayPct = Math.round((rawClay ?? 200) / 10);
    const socGPerKg = Math.round(((rawSoc ?? 150) / 10) * 10) / 10;
    const socPct = Math.round((socGPerKg / 10) * 100) / 100;
    const ph = Math.round(((rawPh ?? 65) / 10) * 10) / 10;

    const textureClass = determineUsdaTextureClass(sandPct, siltPct, clayPct);
    const waterHoldingCapacityMmPerM = estimateWaterHoldingCapacity(sandPct, clayPct, socPct);

    return {
      textureClass,
      sandPct,
      siltPct,
      clayPct,
      socGPerKg,
      socPct,
      ph,
      waterHoldingCapacityMmPerM,
      source: 'isric-live',
    };
  } catch (err) {
    clearTimeout(timer);
    console.info('ISRIC SoilGrids live fetch skipped/failed, using fallback benchmark.', err);
    return null;
  }
}
