import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, MapPin, Navigation, Eye, CheckCircle2, RotateCcw } from 'lucide-react';

// Fix Leaflet's default icon path issue in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface FieldMapProps {
  lat: number;
  lon: number;
  onLocationChange: (lat: number, lon: number, polygonCoords?: [number, number][]) => void;
  lang: string;
}

export const FieldMap: React.FC<FieldMapProps> = ({ lat, lon, onLocationChange }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const polygonRef = useRef<L.Polygon | null>(null);
  const gibsLayerRef = useRef<L.TileLayer | null>(null);

  const [activeGibsOverlay, setActiveGibsOverlay] = useState<'none' | 'ndvi' | 'moisture' | 'truecolor'>('ndvi');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.7);
  const [isDrawingPolygon, setIsDrawingPolygon] = useState<boolean>(false);
  const [drawnPoints, setDrawnPoints] = useState<[number, number][]>([]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [lat, lon],
      zoom: 13,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // High resolution Satellite Base Layer (Esri)
    const baseSatellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Esri, Maxar, Earthstar Geographics, USDA, USGS',
        maxZoom: 18,
      }
    );
    baseSatellite.addTo(map);

    // Reference labels overlay
    L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      opacity: 0.8,
    }).addTo(map);

    // Initial Marker
    const marker = L.marker([lat, lon], {
      draggable: true,
      title: 'Field Center Location',
    }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      onLocationChange(pos.lat, pos.lng);
    });

    markerRef.current = marker;
    mapInstanceRef.current = map;

    // Map click handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (isDrawingPolygon) {
        setDrawnPoints((prev) => {
          const next: [number, number][] = [...prev, [e.latlng.lat, e.latlng.lng]];
          return next;
        });
      } else {
        const newLat = e.latlng.lat;
        const newLon = e.latlng.lng;
        marker.setLatLng([newLat, newLon]);
        onLocationChange(newLat, newLon);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center when props change
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    const current = mapInstanceRef.current.getCenter();
    const dLat = Math.abs(current.lat - lat);
    const dLon = Math.abs(current.lng - lon);
    if (dLat > 0.001 || dLon > 0.001) {
      mapInstanceRef.current.setView([lat, lon], 13);
      markerRef.current.setLatLng([lat, lon]);
    }
  }, [lat, lon]);

  // Handle GIBS NASA Tile Overlays
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (gibsLayerRef.current) {
      mapInstanceRef.current.removeLayer(gibsLayerRef.current);
      gibsLayerRef.current = null;
    }

    if (activeGibsOverlay === 'none') return;

    let tileUrl = '';
    let maxZoom = 9;

    if (activeGibsOverlay === 'ndvi') {
      // NASA GIBS MODIS Terra NDVI 8-day composite
      tileUrl =
        'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png';
      maxZoom = 8;
    } else if (activeGibsOverlay === 'moisture') {
      // NASA GIBS SMAP Soil Moisture
      tileUrl =
        'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/SMAP_L4_Analyzed_Surface_Soil_Moisture/default/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png';
      maxZoom = 8;
    } else if (activeGibsOverlay === 'truecolor') {
      // NASA GIBS MODIS Surface Reflectance True Color
      tileUrl =
        'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg';
      maxZoom = 9;
    }

    if (tileUrl) {
      const layer = L.tileLayer(tileUrl, {
        opacity: overlayOpacity,
        maxZoom,
        attribution: 'NASA Earthdata / GIBS',
      });
      layer.addTo(mapInstanceRef.current);
      gibsLayerRef.current = layer;
    }
  }, [activeGibsOverlay, overlayOpacity]);

  // Update polygon when drawing
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (polygonRef.current) {
      mapInstanceRef.current.removeLayer(polygonRef.current);
      polygonRef.current = null;
    }

    if (drawnPoints.length >= 3) {
      const poly = L.polygon(drawnPoints, {
        color: '#10b981',
        weight: 3,
        fillColor: '#34d399',
        fillOpacity: 0.35,
      }).addTo(mapInstanceRef.current);
      polygonRef.current = poly;
    }
  }, [drawnPoints]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = pos.coords.latitude;
        const uLon = pos.coords.longitude;
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([uLat, uLon], 14);
          markerRef.current.setLatLng([uLat, uLon]);
        }
        onLocationChange(uLat, uLon);
      },
      (err) => {
        alert('Could not access device GPS: ' + err.message);
      }
    );
  };

  const handleFinishPolygon = () => {
    setIsDrawingPolygon(false);
    if (drawnPoints.length >= 3) {
      // calculate centroid
      const cLat = drawnPoints.reduce((sum, p) => sum + p[0], 0) / drawnPoints.length;
      const cLon = drawnPoints.reduce((sum, p) => sum + p[1], 0) / drawnPoints.length;
      if (markerRef.current) markerRef.current.setLatLng([cLat, cLon]);
      onLocationChange(cLat, cLon, drawnPoints);
    }
  };

  const handleClearPolygon = () => {
    setDrawnPoints([]);
    setIsDrawingPolygon(false);
    if (polygonRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(polygonRef.current);
      polygonRef.current = null;
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-emerald-900/40 shadow-xl bg-slate-900">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-[380px] sm:h-[460px] z-0" />

      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* GPS Button */}
        <button
          type="button"
          onClick={handleUseMyLocation}
          className="pointer-events-auto flex items-center gap-2 px-3 py-2 bg-slate-900/90 hover:bg-emerald-900/80 text-emerald-300 text-xs sm:text-sm font-medium rounded-xl border border-emerald-500/40 shadow-lg backdrop-blur-md transition-all active:scale-95"
        >
          <Navigation className="w-4 h-4 text-emerald-400" />
          <span>Use GPS</span>
        </button>

        {/* Boundary Draw Toggle */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-emerald-500/30 backdrop-blur-md shadow-lg">
          {!isDrawingPolygon ? (
            <button
              type="button"
              onClick={() => {
                setDrawnPoints([]);
                setIsDrawingPolygon(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:text-emerald-300 rounded-lg hover:bg-slate-800 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Draw Boundary</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleFinishPolygon}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-500 transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Finish ({drawnPoints.length} pts)</span>
              </button>
              <button
                type="button"
                onClick={handleClearPolygon}
                className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg transition"
                title="Cancel Drawing"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom Floating NASA GIBS Overlays Selector */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-10 bg-slate-900/95 p-3 rounded-2xl border border-emerald-500/30 backdrop-blur-md shadow-2xl max-w-sm">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <Layers className="w-3.5 h-3.5" />
            <span>NASA GIBS Satellite Layer</span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Earthdata</span>
        </div>

        {/* Layer Selector Buttons */}
        <div className="grid grid-cols-4 gap-1 text-[11px] mb-2.5">
          <button
            type="button"
            onClick={() => setActiveGibsOverlay('none')}
            className={`py-1.5 px-2 rounded-lg font-medium transition text-center ${
              activeGibsOverlay === 'none'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            None
          </button>
          <button
            type="button"
            onClick={() => setActiveGibsOverlay('ndvi')}
            className={`py-1.5 px-2 rounded-lg font-medium transition text-center ${
              activeGibsOverlay === 'ndvi'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            NDVI
          </button>
          <button
            type="button"
            onClick={() => setActiveGibsOverlay('moisture')}
            className={`py-1.5 px-2 rounded-lg font-medium transition text-center ${
              activeGibsOverlay === 'moisture'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Moisture
          </button>
          <button
            type="button"
            onClick={() => setActiveGibsOverlay('truecolor')}
            className={`py-1.5 px-2 rounded-lg font-medium transition text-center ${
              activeGibsOverlay === 'truecolor'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            True Color
          </button>
        </div>

        {/* Opacity Slider */}
        {activeGibsOverlay !== 'none' && (
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
            <Eye className="w-3 h-3 text-slate-400" />
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-mono text-slate-300 w-8 text-right">
              {Math.round(overlayOpacity * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
