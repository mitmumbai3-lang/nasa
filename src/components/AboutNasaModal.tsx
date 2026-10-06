import React from 'react';
import { X, Globe2, ExternalLink, Satellite, Database } from 'lucide-react';

interface AboutNasaModalProps {
  onClose: () => void;
}

export const AboutNasaModal: React.FC<AboutNasaModalProps> = ({ onClose }) => {
  const datasets = [
    {
      name: 'NASA POWER (Prediction of Worldwide Energy Resources)',
      role: 'Agroclimatology 30-Year Normals & Daily Rolling Weather',
      description:
        'Provides solar radiation (ALLSKY_SFC_SW_DWN), surface temperature (T2M, T2M_MAX, T2M_MIN), precipitation, and relative humidity sourced from GMAO MERRA-2 assimilation and satellite solar observations.',
      url: 'https://power.larc.nasa.gov/',
    },
    {
      name: 'NASA SMAP (Soil Moisture Active Passive)',
      role: 'Root-Zone (0-100 cm) & Surface (0-5 cm) Soil Moisture',
      description:
        'L-band radiometer measuring topsoil moisture and assimilating physics models to compute root-zone soil moisture and plant-available water capacity.',
      url: 'https://smap.jpl.nasa.gov/',
    },
    {
      name: 'NASA MODIS / VIIRS (Terra & Aqua, Suomi NPP)',
      role: 'NDVI Vegetation Health & Historical Greenness Dynamics',
      description:
        'Normalized Difference Vegetation Index (NDVI) and Enhanced Vegetation Index (EVI) time series capturing canopy photosynthetic vigor and drought-induced crop stress.',
      url: 'https://modis.gsfc.nasa.gov/',
    },
    {
      name: 'NASA GPM IMERG (Global Precipitation Measurement)',
      role: 'High-Resolution Precipitation & Storm Extreme Events',
      description:
        'Constellation of international satellites providing multi-satellite precipitation estimates for rainfall variability, wet spells, and flash drought risk.',
      url: 'https://gpm.nasa.gov/',
    },
    {
      name: 'NASA GRACE & GRACE-FO (Gravity Recovery and Climate Experiment)',
      role: 'Regional Terrestrial Water Storage & Groundwater Trends',
      description:
        'Twin satellite gravimetry measuring shifts in Earth’s gravity field to track deep aquifer depletion rates and regional hydrological stress.',
      url: 'https://gracefo.jpl.nasa.gov/',
    },
    {
      name: 'NASA GIBS (Global Imagery Browse Services)',
      role: 'Full-Resolution Satellite Imagery Tile Overlays',
      description:
        'Delivers real-time and historical imagery layers (MODIS NDVI, SMAP Soil Moisture, True Color Surface Reflectance) directly to our interactive Leaflet satellite map.',
      url: 'https://www.earthdata.nasa.gov/eosdis/science-system-description/eosdis-components/gibs',
    },
    {
      name: 'ISRIC SoilGrids v2.0',
      role: 'Global Machine-Learned Soil Property Profiles (0-30 cm)',
      description:
        'Global spatial soil information system providing soil texture (sand, silt, clay), soil organic carbon (SOC), and pH in H₂O at 250m spatial resolution.',
      url: 'https://www.isric.org/explore/soilgrids',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold text-slate-100">About NASA Earth Observation Data</h3>
              <p className="text-xs text-slate-400">
                Official attribution, scientific instruments, and access links for datasets powering RotaSense.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300">
          <p className="text-slate-300 leading-relaxed">
            RotaSense is built upon open-science Earth observations from the <strong>NASA Earth Science Division</strong> and <strong>ISRIC – World Soil Information</strong>. These satellite instruments and assimilation models provide objective, high-resolution environmental intelligence that enables smallholder and mid-size farmers to build climate-resilient crop rotations.
          </p>

          <div className="space-y-3 mt-4">
            {datasets.map((d) => (
              <div key={d.name} className="p-3.5 bg-slate-800/70 rounded-xl border border-slate-700/80 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-100 text-xs sm:text-sm">{d.name}</h4>
                    <span className="text-[11px] text-emerald-400 font-medium block">{d.role}</span>
                  </div>
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-emerald-400 bg-slate-900 rounded-lg transition"
                    title="Visit official NASA portal"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">{d.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
