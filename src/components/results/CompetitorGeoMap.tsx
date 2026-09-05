import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Store, MapPin, Navigation, Info } from "lucide-react";
import { getDistrictCoordinates } from "@/lib/locations";
import type { FullResultsData } from "@/lib/resultsData";
import type { Competitor } from "@/types/business";

interface CompetitorGeoMapProps {
  data: FullResultsData;
}

// Custom SVG Icons to avoid Leaflet default asset bundling issues in Vite
const createUserIcon = (label: string) =>
  L.divIcon({
    className: "custom-leaflet-user-icon",
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
      ">
        <span style="
          position: absolute;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.35);
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></span>
        <div style="
          position: relative;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #10b981;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 15px;
        ">
          📍
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });

const createCompetitorIcon = (index: number) =>
  L.divIcon({
    className: "custom-leaflet-competitor-icon",
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
      ">
        <div style="
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #ef4444;
          border: 2px solid #ffffff;
          box-shadow: 0 3px 10px rgba(239, 68, 68, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 11px;
          font-weight: 800;
        ">
          ${index + 1}
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16],
  });

export function CompetitorGeoMap({ data }: CompetitorGeoMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  const formData = data?.formData ?? ({} as FullResultsData["formData"]);
  const category = data?.category ?? ({} as FullResultsData["category"]);
  const competitors = data?.competitors ?? [];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Center coordinate derived from user's selected district
  const districtCoords = useMemo(() => {
    return getDistrictCoordinates(formData.district || "Lucknow");
  }, [formData.district]);

  const center: [number, number] = [districtCoords.lat, districtCoords.lng];

  // Calculate coordinates for competitors offset from center based on their recorded distance_km
  const competitorMarkers = useMemo(() => {
    return competitors.map((comp: Competitor, i: number) => {
      const distance = Number(comp.distance_km) || (i + 1) * 2.2;
      // Distribute evenly around the trade radius using trigonometry
      const angleDeg = (i * (360 / Math.max(competitors.length, 1)) + 30 * (i + 1)) % 360;
      const angleRad = (angleDeg * Math.PI) / 180;

      // 1 deg latitude ~ 110.574 km, 1 deg longitude ~ 111.320 * cos(lat) km
      const latOffset = (distance / 110.574) * Math.cos(angleRad);
      const lngOffset =
        (distance / (111.32 * Math.cos((center[0] * Math.PI) / 180))) * Math.sin(angleRad);

      const markerPos: [number, number] = [center[0] + latOffset, center[1] + lngOffset];

      return {
        competitor: comp,
        position: markerPos,
        distance,
      };
    });
  }, [competitors, center]);

  if (!isMounted) {
    return (
      <div className="h-[400px] w-full rounded-2xl border border-border bg-card/60 flex items-center justify-center animate-pulse">
        <p className="text-xs text-muted-foreground font-semibold">
          Loading OpenStreetMap Geo Heatmap...
        </p>
      </div>
    );
  }

  const villageName = formData.village || "Your Village";
  const blockName = formData.block || "Your Block";

  return (
    <div className="human-card p-4 sm:p-6 space-y-4">
      {/* Header & Map Controls Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-foreground sm:text-lg flex items-center gap-2">
            <Navigation className="h-4 w-4 text-terracotta" />
            <span>Interactive Competitor Geo Map & Trade Catchment</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Visualizing competitor proximity relative to {villageName} ({formData.district || "District"} center).
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sage/10 px-3 py-1 font-bold text-sage border border-sage/30">
            <span className="h-2 w-2 rounded-full bg-sage" />
            <span>Your Village</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 font-bold text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>Competitors ({competitors.length})</span>
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-border shadow-inner">
        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom={false}
          touchZoom={true}
          dragging={true}
          style={{ height: "100%", width: "100%", zIndex: 10 }}
        >
          {/* OpenStreetMap Tile Layer (Free, no API key required) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={18}
          />

          {/* 5 km Radius Circle (Green, core catchment zone) */}
          <Circle
            center={center}
            radius={5000}
            pathOptions={{
              color: "#10b981",
              fillColor: "#10b981",
              fillOpacity: 0.14,
              weight: 2,
            }}
          />

          {/* 10 km Radius Circle (Yellow, extended trade catchment zone) */}
          <Circle
            center={center}
            radius={10000}
            pathOptions={{
              color: "#f59e0b",
              fillColor: "#f59e0b",
              fillOpacity: 0.07,
              weight: 1.5,
              dashArray: "6 6",
            }}
          />

          {/* User's Village Marker */}
          <Marker position={center} icon={createUserIcon(villageName)}>
            <Popup className="custom-leaflet-popup">
              <div className="p-1 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  <span>🟢 Your Location</span>
                </div>
                <p className="font-semibold text-foreground text-xs">
                  {villageName}, {blockName}
                </p>
                <p className="text-muted-foreground text-[11px]">
                  Proposed: <span className="font-semibold text-foreground">{category.name || "Enterprise"}</span>
                </p>
                <div className="mt-1 pt-1 border-t border-border/60 text-[10px] text-muted-foreground">
                  Trade Area: 5 km Core / 10 km Extended
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Competitor Markers */}
          {competitorMarkers.map(({ competitor, position, distance }, idx) => (
            <Marker
              key={competitor.id || `comp-${idx}`}
              position={position}
              icon={createCompetitorIcon(idx)}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 text-xs space-y-1">
                  <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-1">
                    <span className="font-bold text-foreground text-xs">{competitor.name}</span>
                    <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-extrabold text-red-600">
                      🔴 Competitor
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Category: <span className="font-medium text-foreground">{category.name || "Business"}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Distance: <span className="font-bold text-foreground">{distance.toFixed(1)} km</span> from your village
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                    <span>Est. Revenue:</span>
                    <span className="font-bold text-green">
                      ₹{(Number(competitor.est_monthly_revenue) || ((Number(competitor.years_active) || 2) * 4000 + 35000)).toLocaleString("en-IN")}/mo
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Active: {competitor.years_active} years in trade
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map Overlay Badges */}
        <div className="absolute bottom-3 left-3 z-[400] flex flex-wrap gap-1.5 text-[11px] bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-border/80 shadow-md">
          <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            5km Core Zone
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            10km Outer Zone
          </span>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground text-center">
        💡 Tip: Tap or click on any marker to view competitor turnover, years active, and exact distance. Pinch or double tap to zoom.
      </p>
    </div>
  );
}
