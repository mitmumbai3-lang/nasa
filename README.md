# RotaSense 🌾🛰️

**RotaSense** is a mobile-first, responsive decision-support web application designed for smallholder and mid-size farmers. Grounded in Earth observation data from **NASA** and soil property intelligence from **ISRIC SoilGrids**, RotaSense helps farmers evaluate, score, and compare multi-year crop rotation strategies to restore soil organic carbon, conserve scarce water, and build resilience against heatwaves and flash droughts.

---

## 🌟 Key Features

1. **Mobile-First & Plain-Language UX**:
   - Designed for field smartphones with touch targets $\ge 48\text{px}$.
   - Multilingual support with instant reactive switching: **English, Español, Français, हिन्दी (Hindi), Kiswahili (Swahili)**.
   - Zero agronomic jargon; every recommendation includes clear, actionable explanations.
2. **Interactive Satellite Mapping with NASA GIBS Tile Overlays**:
   - Leaflet satellite mapping with drag-and-drop pin placement, polygon field boundary drawing, and device GPS location.
   - NASA GIBS real-time tile layers: **MODIS NDVI 8-day vegetation vigor**, **SMAP surface soil moisture**, and **MODIS True Color Surface Reflectance** with layer opacity controls.
   - One-tap quick presets for 3 demo regions:
     - 🌽 **Iowa, USA (Corn Belt)**
     - 🌾 **Punjab, India (Indo-Gangetic Basin)**
     - 🌿 **Kenya Rift Valley (Nakuru / Eldoret)**
3. **NASA Earth Observation Climate Dashboard**:
   - **NASA POWER API**: 30-year climatology normals vs. rolling 12-month temperature, precipitation, and solar radiation.
   - **NASA SMAP**: Root-zone (0-100 cm) and surface (0-5 cm) soil moisture and Plant Available Water (% PAW).
   - **MODIS / VIIRS**: Vegetation health history and seasonal NDVI trajectory curves.
   - **GPM IMERG**: Rainfall variability and extreme precipitation event frequency.
   - **GRACE-FO**: Regional groundwater storage trends and aquifer overdraft warnings.
   - **ISRIC SoilGrids v2**: Automated topsoil texture, Soil Organic Carbon (SOC), and pH with immediate farmer override capability.
4. **Transparent, Pure Scoring Engine (0–100)**:
   - Multi-criteria weighted scoring across 6 dimensions: Water Savings ($S_W$), Soil Health ($S_S$), Climate Resilience ($S_D$), Income Stability ($S_I$), Low Input Cost ($S_C$), and Labor Feasibility ($S_L$).
   - Built-in agronomic succession rules:
     - *Repeated Family Penalty (-15 pts)*: Deters consecutive monoculture (e.g. Poaceae $\to$ Poaceae).
     - *Legume Nitrogen Credit (+10 pts)*: Rewards biological N fixation before heavy cereal feeders.
     - *Root Depth Stratification (+8 pts)*: Rewards alternating shallow fibrous roots with deep taproots.
     - *Continuous Living Soil Armor (+12 pts)*: Rewards cover crops that prevent erosion and feed soil biology.
5. **Interactive Climate Stress Scenario Simulations**:
   - Real-time scenario toggle: **Baseline Normal**, **Hotter (+2°C)**, **Drier (-15% Rainfall)**, and **Hot & Dry (+2°C, -15%)**.
   - Watch drought-hardy rotations (sorghum, pearl millet, chickpea) surge to top rank as climate stress increases.
6. **Side-by-Side Comparison & Action Plan Export**:
   - Compare up to 3 candidate rotations side-by-side in a responsive modal.
   - Seasonal operational agricultural calendar with planting, scouting, cover termination, and harvest windows.
   - High-contrast, clean printable PDF export (`window.print()`) formatted for field records and agronomist consultations.
7. **Privacy & Offline Resilience**:
   - Field profiles and overrides stored locally in `localStorage`—no account or login required.
   - Graceful offline fallback with clear data provenance labeling: `Live NASA Data` vs `Regional Benchmark (NASA Archive)`.

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js $\ge 18$ (Tested on Node.js v24.21.0)
- npm $\ge 9$

### Installation
```bash
# Clone or navigate to the project directory
cd "Project 11"

# Install dependencies
npm install

# Run the development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Running Automated Tests
```bash
# Run unit and integration test suite via Vitest
npm test
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 📊 Scoring Methodology & Formula

The pure scoring engine (`src/services/scoring/scoringEngine.ts`) evaluates each candidate rotation through a transparent multi-attribute utility model:

$$\text{Final Score} = \text{clamp}\left(5, 100, \frac{\sum_{i=1}^6 w_i \times S_i}{\sum_{i=1}^6 w_i} + \sum \text{Bonuses} - \sum \text{Penalties}\right)$$

Where:
- $S_W$: Water Conservation score based on rotational water demand vs. satellite precipitation + irrigation.
- $S_S$: Soil Health score based on biological N fixation ($\text{kg N/ha}$), living cover ratio, and residue C:N quality.
- $S_D$: Climate Resilience score cross-referencing crop drought/heat tolerances with NASA temperature anomalies and SMAP root-zone moisture deficits.
- $S_I$: Income Stability score evaluating commodity market security and crop diversification.
- $S_C$: Low Input Cost score reflecting synthetic fertilizer savings and disease suppression.
- $S_L$: Labor Feasibility score measuring operational manageability.
- $w_i$: Farmer priority weights ($0\text{--}100$) set via the interactive sliders.

---

## 🛰️ NASA Earth Science Datasets Used

| Dataset | Instrument / Model | Spatial Resolution | Parameter Provided |
| :--- | :--- | :--- | :--- |
| **NASA POWER** | GMAO MERRA-2 & CERES | 0.5° × 0.5° Global Grid | Solar radiation (`ALLSKY_SFC_SW_DWN`), Air Temp (`T2M`, `T2M_MAX`, `T2M_MIN`), Precip (`PRECTOTCORR`), Humidity (`RH2M`). |
| **NASA SMAP** | L-band Radiometer (L4) | 9 km Global Grid | Surface ($0\text{-}5\text{ cm}$) and Root-Zone ($0\text{-}100\text{ cm}$) soil moisture, Plant Available Water (% PAW). |
| **MODIS / VIIRS** | Terra & Aqua / Suomi NPP | 250 m – 1 km | 16-day and 8-day NDVI & EVI vegetation health and canopy greenness trajectories. |
| **GPM IMERG** | International Satellite Constellation | 0.1° × 0.1° | Precipitation variability, high-intensity storm frequency, and dry spell duration. |
| **GRACE / GRACE-FO** | Satellite Gravimetry | ~300 km Basin Scale | Shallow groundwater storage anomalies and aquifer depletion rates ($\text{cm/yr}$). |
| **NASA GIBS** | Web Map Tile Service (WMTS) | Variable resolution | Interactive satellite map tile overlays for MODIS NDVI and SMAP soil moisture. |
| **ISRIC SoilGrids** | Machine Learning Soil Spatial Model | 250 m Global Grid | Topsoil sand, silt, clay, Organic Carbon (SOC), and pH in $H_2O$. |

---

## 🛠️ How to Add New Crops or Data Sources

### 1. Adding a New Crop
Open `src/data/crops.ts` and add a new entry to the `CROPS` dictionary:

```typescript
export const CROPS: Record<string, CropDefinition> = {
  // Example: Teff (Eragrostis tef)
  teff: {
    id: 'teff',
    name: 'Teff',
    scientificName: 'Eragrostis tef',
    family: 'Poaceae',
    category: 'cereal',
    waterNeedMmPerSeason: 320,
    droughtTolerance: 0.82,
    heatTolerance: 0.80,
    rootDepth: 'medium',
    nitrogenFixationKgPerHa: 0,
    nitrogenDemandKgPerHa: 50,
    residueContribution: 'medium',
    residueCarbonNitrogenRatio: 40,
    diseaseBreakValue: 0.6,
    seasonDays: 90,
    marketStabilityIndex: 0.85,
    laborIntensity: 0.45,
    inputCostIndex: 0.30,
    suitablePhRange: [5.5, 7.5],
    description: 'Resilient gluten-free Ethiopian cereal grain with low water requirements.',
  },
  // ... other crops
};
```

### 2. Adding a New Data Source
1. Define the data interface in `src/types/data.ts`.
2. Create a modular service in `src/services/data/` (e.g. `src/services/data/myNewService.ts`) with timeout handling and error catching.
3. Integrate the service into `getFieldClimateAndSoilData` in `src/services/data/dataService.ts`.
4. Add reference benchmark values to `src/data/seedBenchmarks.ts` for offline fallback.
5. Credit the dataset and link in `src/components/AboutNasaModal.tsx`.

---

## ⚖️ Scientific Disclaimer
*RotaSense is an informational decision-support tool, not an agronomic or financial guarantee. Actual farm yields and soil responses depend on field microclimates, specific cultivars, local pest pressure, tillage practices, and weather volatility. Farmers should consult with regional agricultural extension advisors when planning rotations and making input decisions.*

---

## 📄 License
MIT License. Open-source for farmers, agronomists, and researchers worldwide.
