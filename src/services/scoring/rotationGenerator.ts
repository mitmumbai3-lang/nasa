import { CROPS } from '../../data/crops';
import { NASAFieldReport } from '../../types/data';
import { RotationCandidate, RotationSeasonSlot } from '../../types/scoring';

interface RegionRotationTemplates {
  id: string;
  title: string;
  tagline: string;
  badge?: string;
  years: number;
  seasons: { year: number; seasonIndex: number; seasonName: string; cropId: string; isCoverCrop: boolean; notes: string }[];
  primaryBenefit: string;
  strengths: string[];
  risksAndWatchouts: string[];
  plainLanguageAdvice: string;
}

/**
 * Builds candidate rotation structures tailored to the field's climate and geography.
 */
export function generateCandidateRotations(
  report: NASAFieldReport,
  currentCropId: string = 'corn'
): RotationCandidate[] {
  const { lat, lon } = report.coordinates;

  // Determine regional agro-ecological template group
  let templates: RegionRotationTemplates[];

  if (lat > 35 && lat < 50 && lon > -105 && lon < -75) {
    // US Corn Belt / Midwest
    templates = getMidwestTemplates();
  } else if (lat > 20 && lat < 34 && lon > 68 && lon < 88) {
    // South Asia / Indo-Gangetic Plains
    templates = getPunjabTemplates();
  } else if (lat > -10 && lat < 10 && lon > 28 && lon < 45) {
    // East African Highlands / Rift Valley
    templates = getEastAfricaTemplates();
  } else {
    // Global adaptable agroclimatic templates
    templates = getGlobalAdaptableTemplates(report);
  }

  return templates.map((t) => {
    const seasons: RotationSeasonSlot[] = t.seasons.map((s) => ({
      ...s,
      crop: CROPS[s.cropId] || CROPS.corn,
    }));

    return {
      id: t.id,
      title: t.title,
      tagline: t.tagline,
      badge: t.badge,
      years: t.years,
      seasons,
      // Default placeholder scores (will be evaluated by pure scoringEngine)
      scores: {
        overallScore: 50,
        waterScore: 50,
        soilScore: 50,
        incomeScore: 50,
        resilienceScore: 50,
        inputCostScore: 50,
        laborScore: 50,
      },
      projectedImpacts: {
        somDeltaPctPerYear: 0,
        waterSavingsM3PerHa: 0,
        nitrogenFixedKgPerHaTotal: 0,
        droughtSurvivalIndex: 50,
      },
      ruleEffects: [],
      whyThisRotation: {
        primaryBenefit: t.primaryBenefit,
        strengths: t.strengths,
        risksAndWatchouts: t.risksAndWatchouts,
        plainLanguageAdvice: t.plainLanguageAdvice,
      },
    };
  });
}

function getMidwestTemplates(): RegionRotationTemplates[] {
  return [
    {
      id: 'mw-continuous-corn',
      title: 'Continuous Corn (Current Monoculture)',
      tagline: 'Standard high-yield monoculture with heavy synthetic fertilizer and chemical weed reliance.',
      badge: 'Baseline Monoculture',
      years: 2,
      seasons: [
        { year: 1, seasonIndex: 1, seasonName: 'Summer', cropId: 'corn', isCoverCrop: false, notes: 'Main cash crop' },
        { year: 1, seasonIndex: 2, seasonName: 'Winter', cropId: 'corn', isCoverCrop: false, notes: 'Bare fallow / stubble' },
        { year: 2, seasonIndex: 1, seasonName: 'Summer', cropId: 'corn', isCoverCrop: false, notes: 'Repeated family Poaceae' },
        { year: 2, seasonIndex: 2, seasonName: 'Winter', cropId: 'corn', isCoverCrop: false, notes: 'Bare fallow' },
      ],
      primaryBenefit: 'Familiar operations and established grain elevator logistics.',
      strengths: ['High gross revenue in years with optimal rainfall', 'Simplified machinery setup'],
      risksAndWatchouts: [
        'Rootworm and corn leaf blight pest buildup',
        'High synthetic nitrogen input required (>160 kg N/ha/yr)',
        'Winter soil erosion from bare winter fallow',
      ],
      plainLanguageAdvice:
        'Continuous corn exposes your wallet to volatile fertilizer prices and steadily depletes natural soil biological health.',
    },
    {
      id: 'mw-corn-soybean',
      title: 'Corn – Soybean Two-Year Cycle',
      tagline: 'The classic Corn Belt rotation balancing grain with natural legume nitrogen fixation.',
      badge: 'Standard Rotation',
      years: 2,
      seasons: [
        { year: 1, seasonIndex: 1, seasonName: 'Summer', cropId: 'corn', isCoverCrop: false, notes: 'Heavy N feeder' },
        { year: 1, seasonIndex: 2, seasonName: 'Winter', cropId: 'corn', isCoverCrop: false, notes: 'Corn stover winter cover' },
        { year: 2, seasonIndex: 1, seasonName: 'Summer', cropId: 'soybean', isCoverCrop: false, notes: 'Legume N fixer' },
        { year: 2, seasonIndex: 2, seasonName: 'Winter', cropId: 'corn', isCoverCrop: false, notes: 'Soybean stubble' },
      ],
      primaryBenefit: 'Breaks corn rootworm cycles while providing a 35-45 kg/ha nitrogen credit.',
      strengths: ['Reduced nitrogen fertilizer bill for corn phase', 'Liquid commodity market liquidity', 'Solid weed control options'],
      risksAndWatchouts: ['Soybean residue decomposes quickly, leaving soil exposed to winter winds', 'Susceptible to late summer flash droughts'],
      plainLanguageAdvice:
        'A dependable improvement over monoculture corn. Adding an overwinter cover crop will elevate soil carbon retention even higher.',
    },
    {
      id: 'mw-regenerative-soil-builder',
      title: 'Corn – Rye Cover – Soybean – Winter Wheat + Clover',
      tagline: 'High-resilience 3-year regenerative cycle maximizing living roots and continuous soil armor.',
      badge: 'Top Soil Builder',
      years: 3,
      seasons: [
        { year: 1, seasonIndex: 1, seasonName: 'Summer', cropId: 'corn', isCoverCrop: false, notes: 'Fed by preceding clover N credit' },
        { year: 1, seasonIndex: 2, seasonName: 'Winter', cropId: 'rye_cover', isCoverCrop: true, notes: 'Cereal rye winter living armor' },
        { year: 2, seasonIndex: 1, seasonName: 'Summer', cropId: 'soybean', isCoverCrop: false, notes: 'Planted green into terminated rye mulch' },
        { year: 2, seasonIndex: 2, seasonName: 'Winter', cropId: 'wheat', isCoverCrop: false, notes: 'Winter wheat established after early soy' },
        { year: 3, seasonIndex: 1, seasonName: 'Summer', cropId: 'wheat', isCoverCrop: false, notes: 'Wheat harvest in July with frost-seeded clover' },
        { year: 3, seasonIndex: 2, seasonName: 'Fall Cover', cropId: 'vetch_cover', isCoverCrop: true, notes: 'Hairy vetch fixing >100 kg N/ha' },
      ],
      primaryBenefit: 'Builds soil organic matter rapidly while slashing synthetic fertilizer needs by up to 50%.',
      strengths: [
        'Massive biological nitrogen fixation (>110 kg N/ha)',
        'Continuous living root protects topsoil from erosion',
        'Wheat straw plus rye mulch dramatically cuts weed germination',
      ],
      risksAndWatchouts: ['Requires timely spring cover crop termination', 'Requires small-grain storage or straw baling logistics'],
      plainLanguageAdvice:
        'This 3-year sequence is the gold standard for long-term farm resilience. It transforms your soil into a moisture sponge that withstands summer droughts.',
    },
    {
      id: 'mw-bio-tillage-water-saver',
      title: 'Corn – Oats + Radish – Soybean',
      tagline: 'Bio-drilling hardpans with deep taproot radish while reducing overall rotation water demand.',
      badge: 'Hardpan Breaker',
      years: 2,
      seasons: [
        { year: 1, seasonIndex: 1, seasonName: 'Summer', cropId: 'corn', isCoverCrop: false, notes: 'Main cash crop' },
        { year: 1, seasonIndex: 2, seasonName: 'Fall Cover', cropId: 'radish_cover', isCoverCrop: true, notes: 'Daikon radish drills compacted subsoil' },
        { year: 2, seasonIndex: 1, seasonName: 'Spring', cropId: 'oats', isCoverCrop: false, notes: 'Early spring cool-season grain' },
        { year: 2, seasonIndex: 2, seasonName: 'Summer/Fall', cropId: 'soybean', isCoverCrop: false, notes: 'Short-season pulse legume' },
      ],
      primaryBenefit: 'Biological tillage opens macro-pores for rain infiltration, reducing runoff by 35%.',
      strengths: ['Tillage radish winter-kills naturally (no termination herbicide needed)', 'Breaks plow-pans without diesel subsoiling cost'],
      risksAndWatchouts: ['Radish needs planting by early September for maximum root growth'],
      plainLanguageAdvice:
        'An excellent, low-hassle pathway to break up dense subsoil layers without expensive diesel subsoiling equipment.',
    },
  ];
}

function getPunjabTemplates(): RegionRotationTemplates[] {
  return [
    {
      id: 'pb-rice-wheat-baseline',
      title: 'Paddy Rice – Wheat (Current Intensive Baseline)',
      tagline: 'Traditional high-pumping continuous cereal rotation causing catastrophic groundwater depletion.',
      badge: 'Depleting Baseline',
      years: 2,
      seasons: [
        { year: 1, seasonIndex: 1, seasonName: 'Kharif (Monsoon)', cropId: 'rice', isCoverCrop: false, notes: 'Heavy flood irrigation (>1200mm)' },
        { year: 1, seasonIndex: 2, seasonName: 'Rabi (Winter)', cropId: 'wheat', isCoverCrop: false, notes: 'Cereal grain, sensitive to spring heat' },
        { year: 2, seasonIndex: 1, seasonName: 'Kharif (Monsoon)', cropId: 'rice', isCoverCrop: false, notes: 'Repeated Poaceae family' },
        { year: 2, seasonIndex: 2, seasonName: 'Rabi (Winter)', cropId: 'wheat', isCoverCrop: false, notes: 'Winter staple' },
      ],
      primaryBenefit: 'Guaranteed government procurement (MSP) and familiar farm machinery.',
      strengths: ['High assured market purchase', 'Predictable milling channels'],
      risksAndWatchouts: [
        'Extreme groundwater depletion (-4.8 cm/yr GRACE loss)',
        'High diesel and electricity pumping bills',
        'Vulnerable to terminal spring heatwaves and yellow rust',
      ],
      plainLanguageAdvice:
        'While economically established, continuing rice-wheat will deplete your tube-wells within a decade. Diversification is urgent.',
    },
    {
      id: 'pb-maize-wheat-moong',
      title: 'Maize – Wheat – Summer Moong Bean',
      tagline: 'Saves 60% irrigation water over paddy while introducing a lucrative 60-day summer pulse.',
      badge: 'Top Water Saver',
      years: 2,
      seasons: [
        { year: 1, seasonIndex: 1, seasonName: 'Kharif', cropId: 'corn', isCoverCrop: false, notes: 'Replaces water-hungry paddy rice' },
        { year: 1, seasonIndex: 2, seasonName: 'Rabi', cropId: 'wheat', isCoverCrop: false, notes: 'Staple wheat crop' },
        { year: 1, seasonIndex: 3, seasonName: 'Zaid (Summer)', cropId: 'moong', isCoverCrop: false, notes: '60-day pulse fixing 50 kg N/ha' },
        { year: 2, seasonIndex: 1, seasonName: 'Kharif', cropId: 'corn', isCoverCrop: false, notes: 'Benefits from moong N residue' },
        { year: 2, seasonIndex: 2, seasonName: 'Rabi', cropId: 'wheat', isCoverCrop: false, notes: 'Winter wheat' },
        { year: 2, seasonIndex: 3, seasonName: 'Zaid (Summer)', cropId: 'sunn_hemp', isCoverCrop: true, notes: 'Green manure biomass' },
      ],
      primaryBenefit: 'Saves over 3,000 m³/ha of irrigation water each year while adding high-value pulse cash.',
      strengths: [
        'Drastically reduces tube-well pumping hours',
        'Moong bean brings strong market prices and food security',
        'Replenishes depleted soil organic carbon',
      ],
      risksAndWatchouts: ['Maize requires well-drained fields during heavy monsoon cloudbursts', 'Moong harvest must finish before monsoon onset'],
      plainLanguageAdvice:
        'This 3-crop sequence is Punjab’s best water-saving alternative. It protects your water table while giving your family an extra harvest season.',
    },
    {
      id: 'pb-millet-mustard-chickpea',
      title: 'Pearl Millet – Mustard – Chickpea (Climate Fortress)',
      tagline: 'Extremely drought-hardy, low-water rotation built to thrive through extreme heat and water scarcity.',
      badge: 'Heat & Drought Shield',
      years: 2,
      seasons: [
        { year: 1, seasonIndex: 1, seasonName: 'Kharif', cropId: 'millet', isCoverCrop: false, notes: 'Thrives in 42°C heat with minimal water' },
        { year: 1, seasonIndex: 2, seasonName: 'Rabi', cropId: 'mustard', isCoverCrop: false, notes: 'Deep taproot oilseed; biofumigant action' },
        { year: 2, seasonIndex: 1, seasonName: 'Kharif', cropId: 'cowpea', isCoverCrop: false, notes: 'Heat-hardy legume covering sandy soil' },
        { year: 2, seasonIndex: 2, seasonName: 'Rabi', cropId: 'chickpea', isCoverCrop: false, notes: 'Deep-root pulse; fixes 65 kg N/ha' },
      ],
      primaryBenefit: 'Eliminates 75% of irrigation pumping needs and eliminates heat shock vulnerability.',
      strengths: [
        'Virtually drought-proof against monsoon delays',
        'Mustard biofumigant suppresses soil pathogens',
        'High return per liter of water applied',
      ],
      risksAndWatchouts: ['Lower biomass residue than continuous wheat', 'Mustard susceptible to aphids during warm winters'],
      plainLanguageAdvice:
        'If tube-well water is salty or failing, this rotation provides guaranteed grain and oil without needing constant pumping.',
    },
    {
      id: 'pb-cotton-wheat-sunnhemp',
      title: 'Cotton – Wheat – Sunn Hemp Green Manure',
      tagline: 'Commercial fiber and cereal sequence paired with rapid tropical green manure.',
      badge: 'Cash & Soil Balance',
      years: 2,
      seasons: [
        { year: 1, seasonIndex: 1, seasonName: 'Kharif', cropId: 'cotton', isCoverCrop: false, notes: 'Deep-rooted commercial cash crop' },
        { year: 1, seasonIndex: 2, seasonName: 'Rabi', cropId: 'wheat', isCoverCrop: false, notes: 'Winter cereal' },
        { year: 2, seasonIndex: 1, seasonName: 'Summer Gap', cropId: 'sunn_hemp', isCoverCrop: true, notes: '60-day Sunn hemp fixing 120 kg N/ha' },
        { year: 2, seasonIndex: 2, seasonName: 'Rabi', cropId: 'wheat', isCoverCrop: false, notes: 'Winter wheat' },
      ],
      primaryBenefit: 'Breaks cereal monoculture with deep taproots and provides substantial green manure N.',
      strengths: ['High commercial revenue from cotton fiber', 'Sunn hemp adds 4+ tons of organic biomass'],
      risksAndWatchouts: ['Cotton requires pest management against whitefly and bollworm', 'Cotton harvest timing must align with wheat sowing'],
      plainLanguageAdvice:
        'Ideal for farmers with well-drained soils looking to combine cash crop profitability with soil restoration.',
    },
  ];
}

function getEastAfricaTemplates(): RegionRotationTemplates[] {
  return [
    {
      id: 'ea-maize-monoculture',
      title: 'Maize Sole-Cropping (Current Smallholder Baseline)',
      tagline: 'Continuous maize season after season leaving farmers vulnerable to fall armyworm and drought.',
      badge: 'Vulnerable Baseline',
      years: 2,
      seasons: [
        { year: 1, seasonIndex: 1, seasonName: 'Long Rains', cropId: 'maize', isCoverCrop: false, notes: 'Primary food staple' },
        { year: 1, seasonIndex: 2, seasonName: 'Short Rains', cropId: 'maize', isCoverCrop: false, notes: 'Often stunted by early rain cutoff' },
        { year: 2, seasonIndex: 1, seasonName: 'Long Rains', cropId: 'maize', isCoverCrop: false, notes: 'Repeated Poaceae family' },
        { year: 2, seasonIndex: 2, seasonName: 'Short Rains', cropId: 'maize', isCoverCrop: false, notes: 'Soil nutrient depletion' },
      ],
      primaryBenefit: 'Familiar household staple food supply.',
      strengths: ['Standard family food preference'],
      risksAndWatchouts: [
        'Total crop loss if Long Rains dry spells exceed 25 days',
        'Severe Striga weed and Stem Borer infestation',
        'Declining soil organic carbon and nutrient mining',
      ],
      plainLanguageAdvice:
        'Continuous maize is high risk under changing rain patterns. One mid-season dry spell can wipe out your whole season.',
    },
    {
      id: 'ea-maize-pigeonpea-sorghum',
      title: 'Maize – Pigeonpea – Sorghum – Cowpea Cycle',
      tagline: 'Deep-taproot drought shield combining food security with biological nitrogen fixing.',
      badge: 'Top Climate Resilience',
      years: 2,
      seasons: [
        { year: 1, seasonIndex: 1, seasonName: 'Long Rains', cropId: 'maize', isCoverCrop: false, notes: 'Intercropped with long-duration pigeonpea' },
        { year: 1, seasonIndex: 2, seasonName: 'Short Rains', cropId: 'pigeonpea', isCoverCrop: false, notes: 'Matures into dry season on residual moisture' },
        { year: 2, seasonIndex: 1, seasonName: 'Long Rains', cropId: 'sorghum', isCoverCrop: false, notes: 'Drought-hardy grain, immune to maize wilt' },
        { year: 2, seasonIndex: 2, seasonName: 'Short Rains', cropId: 'cowpea', isCoverCrop: false, notes: 'Fast 70-day pulse providing food + N fixation' },
      ],
      primaryBenefit: 'Pigeonpea taproots punch through hard volcanic subsoil, unlocking water while fixing 90 kg N/ha.',
      strengths: [
        'Sorghum ensures grain harvest even if Long Rains drop 30%',
        'Pigeonpea provides food protein and fuelwood stems',
        'Cowpeas cover bare soil rapidly, blocking weed growth',
      ],
      risksAndWatchouts: ['Local bird scaring needed for sorghum near maturity', 'Pigeonpea requires protection from browsing livestock'],
      plainLanguageAdvice:
        'The best smallholder strategy for Nakuru. It guarantees grain for your family even in drought years and fertilizes your land naturally.',
    },
    {
      id: 'ea-sorghum-cowpea-sunnhemp',
      title: 'Sorghum – Cowpea – Sunn Hemp Biomass Builder',
      tagline: 'Maximum drought defense for erratic rainfall areas with low fertilizer budgets.',
      badge: 'Low Input / High Resilience',
      years: 2,
      seasons: [
        { year: 1, seasonIndex: 1, seasonName: 'Long Rains', cropId: 'sorghum', isCoverCrop: false, notes: 'Deep-root drought tolerant cereal' },
        { year: 1, seasonIndex: 2, seasonName: 'Short Rains', cropId: 'cowpea', isCoverCrop: false, notes: 'Nitrogen-fixing pulse' },
        { year: 2, seasonIndex: 1, seasonName: 'Long Rains', cropId: 'sunn_hemp', isCoverCrop: true, notes: 'Rapid 60-day green manure fixing 120 kg N' },
        { year: 2, seasonIndex: 2, seasonName: 'Short Rains', cropId: 'groundnut', isCoverCrop: false, notes: 'High cash value legume' },
      ],
      primaryBenefit: 'Eliminates reliance on costly commercial DAP fertilizer through twin biological legume cycles.',
      strengths: ['Near zero pesticide and commercial nitrogen requirement', 'Thrives in sandy or rocky soils with erratic rains'],
      risksAndWatchouts: ['Requires groundnut threshing labor at harvest'],
      plainLanguageAdvice:
        'Ideal if commercial fertilizer costs are too high. It builds natural soil fertility fast without taking on farm debt.',
    },
  ];
}

function getGlobalAdaptableTemplates(report: NASAFieldReport): RegionRotationTemplates[] {
  const isDry = report.climateNormals.annualPrecip < 600;
  return [
    {
      id: 'gen-cereal-monoculture',
      title: 'Continuous Cereal Baseline',
      tagline: 'Standard grain-after-grain monoculture with recurring pest pressure.',
      badge: 'Baseline Monoculture',
      years: 2,
      seasons: [
        { year: 1, seasonIndex: 1, seasonName: 'Primary Season', cropId: isDry ? 'sorghum' : 'corn', isCoverCrop: false, notes: 'Primary grain crop' },
        { year: 1, seasonIndex: 2, seasonName: 'Secondary Season', cropId: 'wheat', isCoverCrop: false, notes: 'Secondary cereal' },
        { year: 2, seasonIndex: 1, seasonName: 'Primary Season', cropId: isDry ? 'sorghum' : 'corn', isCoverCrop: false, notes: 'Repeated cereal' },
        { year: 2, seasonIndex: 2, seasonName: 'Secondary Season', cropId: 'wheat', isCoverCrop: false, notes: 'Secondary cereal' },
      ],
      primaryBenefit: 'Known market and straightforward crop management.',
      strengths: ['Standard farm operations'],
      risksAndWatchouts: ['Continuous cereal leads to weed and soil pest accumulation', 'Requires continuous synthetic nitrogen applications'],
      plainLanguageAdvice: 'Continuing a single cereal family limits soil biological diversity and increases fertilizer expenses.',
    },
    {
      id: 'gen-cereal-pulse-rotation',
      title: 'Cereal – Pulse Balanced Rotation',
      tagline: 'Two-year rotation alternating heavy grain feeders with biological nitrogen-fixing pulses.',
      badge: 'Balanced Sustainable',
      years: 2,
      seasons: [
        { year: 1, seasonIndex: 1, seasonName: 'Primary Season', cropId: isDry ? 'sorghum' : 'corn', isCoverCrop: false, notes: 'Heavy cereal feeder' },
        { year: 1, seasonIndex: 2, seasonName: 'Secondary Season', cropId: 'lentil', isCoverCrop: false, notes: 'Cool-season legume' },
        { year: 2, seasonIndex: 1, seasonName: 'Primary Season', cropId: 'soybean', isCoverCrop: false, notes: 'Warm-season cash pulse' },
        { year: 2, seasonIndex: 2, seasonName: 'Secondary Season', cropId: 'wheat', isCoverCrop: false, notes: 'Fed by preceding soybean N credit' },
      ],
      primaryBenefit: 'Cuts fertilizer bills by 30% and disrupts pest life cycles.',
      strengths: ['Diversified income sources', 'Significant biological nitrogen credit'],
      risksAndWatchouts: ['Requires pulse harvesting and storage care'],
      plainLanguageAdvice: 'A proven, reliable strategy that cuts fertilizer dependency while boosting yield stability across seasons.',
    },
    {
      id: 'gen-resilience-armor',
      title: 'Climate-Resilient Multi-Species Cycle',
      tagline: 'Three-year multi-family cycle combining deep taproots, cover crop armor, and drought tolerance.',
      badge: 'Top Climate Resilience',
      years: 3,
      seasons: [
        { year: 1, seasonIndex: 1, seasonName: 'Primary Season', cropId: isDry ? 'millet' : 'corn', isCoverCrop: false, notes: 'Drought-hardy grain' },
        { year: 1, seasonIndex: 2, seasonName: 'Cover Phase', cropId: 'rye_cover', isCoverCrop: true, notes: 'Living winter soil armor' },
        { year: 2, seasonIndex: 1, seasonName: 'Primary Season', cropId: 'cowpea', isCoverCrop: false, notes: 'Heat-resilient pulse' },
        { year: 2, seasonIndex: 2, seasonName: 'Secondary Season', cropId: 'mustard', isCoverCrop: false, notes: 'Biofumigant oilseed' },
        { year: 3, seasonIndex: 1, seasonName: 'Primary Season', cropId: 'sunflower', isCoverCrop: false, notes: 'Deep subsoil nutrient scavenger' },
        { year: 3, seasonIndex: 2, seasonName: 'Secondary Season', cropId: 'chickpea', isCoverCrop: false, notes: 'Deep taproot pulse' },
      ],
      primaryBenefit: 'Maximum multi-year buffer against drought, heatwaves, and soil degradation.',
      strengths: ['Extreme drought tolerance', 'Comprehensive root stratification', 'Continuous living ground cover'],
      risksAndWatchouts: ['Requires managing diverse crop planting calendars'],
      plainLanguageAdvice: 'The ultimate shield against erratic weather. Maximizes soil health and cushions your income against market swings.',
    },
  ];
}
