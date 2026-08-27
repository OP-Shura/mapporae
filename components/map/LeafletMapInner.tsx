'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Coordinates, Place } from '@/lib/types';
import Link from 'next/link';
import { StatusBadge, OpenBadge } from '@/components/ui/Badge';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';

// Self-hosted Leaflet default marker icons (Reliability & Performance)
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/leaflet/marker-icon-2x.png',
  iconUrl: '/images/leaflet/marker-icon.png',
  shadowUrl: '/images/leaflet/marker-shadow.png',
});

// Custom SVG Category Pin Builder
function createCategoryIcon(category: string, isSelected: boolean = false, isDark: boolean = false) {
  let color = '#0E7490';
  let symbol = '📍';

  switch (category) {
    case 'ghats':
      color = '#0E7490';
      symbol = '🌊';
      break;
    case 'temples':
      color = '#D97706';
      symbol = '🛕';
      break;
    case 'food':
      color = '#E11D48';
      symbol = '🍲';
      break;
    case 'cafes':
      color = '#9333EA';
      symbol = '☕';
      break;
    case 'hospitals':
      color = '#DC2626';
      symbol = '🏥';
      break;
    case 'pharmacies':
      color = '#059669';
      symbol = '💊';
      break;
    case 'atms':
      color = '#2563EB';
      symbol = '🏧';
      break;
    case 'transport':
      color = '#4F46E5';
      symbol = '⛵';
      break;
    default:
      color = '#172554';
      symbol = '📍';
  }

  const size = isSelected ? 44 : 36;
  const pinBg = isSelected ? (isDark ? '#38BDF8' : '#172554') : (isDark ? '#1E293B' : 'white');
  const pinBorder = isSelected ? '#F59E0B' : color;

  const pinSvg = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${size}px;
      height: ${size}px;
      background: ${pinBg};
      border: ${isSelected ? '3px solid #F59E0B' : `2.5px solid ${pinBorder}`};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    ">
      <span style="
        transform: rotate(45deg);
        font-size: ${isSelected ? 18 : 14}px;
        line-height: 1;
      ">${symbol}</span>
    </div>
  `;

  return L.divIcon({
    html: pinSvg,
    className: 'custom-map-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

function UserLocationMarker({ coords }: { coords: Coordinates }) {
  const icon = L.divIcon({
    html: `
      <div style="
        width: 22px;
        height: 22px;
        background: #0E7490;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 6px rgba(14, 116, 144, 0.3);
        animation: pulse 2s infinite;
      "></div>
    `,
    className: 'user-loc-pin',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

  return (
    <Marker position={[coords.lat, coords.lng]} icon={icon}>
      <Popup>
        <div className="p-2 text-center text-xs font-semibold text-[#172554] dark:text-slate-200">
          📍 You are here (Reference point)
        </div>
      </Popup>
    </Marker>
  );
}

function MapCenterController({ center, zoom }: { center: Coordinates; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom, { animate: true });
  }, [center.lat, center.lng, zoom, map]);
  return null;
}

interface LeafletMapInnerProps {
  places: Place[];
  center: Coordinates;
  zoom?: number;
  selectedPlaceId?: string | null;
  onSelectPlace?: (place: Place) => void;
  userLocation?: Coordinates | null;
  className?: string;
}

export default function LeafletMapInner({
  places,
  center,
  zoom = 14,
  selectedPlaceId,
  onSelectPlace,
  userLocation,
  className = 'h-[500px] w-full',
}: LeafletMapInnerProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const tileAttribution = isDark
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-[#E8D9C0] dark:border-slate-800 shadow-md ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full z-10"
      >
        <TileLayer
          key={isDark ? 'dark-tiles' : 'light-tiles'}
          attribution={tileAttribution}
          url={tileUrl}
          maxZoom={19}
        />

        <MapCenterController center={center} zoom={zoom} />

        {userLocation && <UserLocationMarker coords={userLocation} />}

        {places.map(place => {
          const isSelected = selectedPlaceId === place.id;

          return (
            <Marker
              key={place.id}
              position={[place.coordinates.lat, place.coordinates.lng]}
              icon={createCategoryIcon(place.category, isSelected, isDark)}
              eventHandlers={{
                click: () => {
                  if (onSelectPlace) {
                    onSelectPlace(place);
                  }
                },
              }}
            >
              <Popup>
                <div className="w-64 overflow-hidden rounded-xl bg-[#FAF9F6] dark:bg-slate-900 text-[#172554] dark:text-slate-100">
                  {place.coverImage && (
                    <div className="relative h-28 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={place.coverImage}
                        alt={place.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <StatusBadge
                          status={place.status}
                          sourceUrl={place.sourceUrl}
                          verifiedAt={place.verifiedAt}
                        />
                      </div>
                    </div>
                  )}

                  <div className="p-3">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <h4 className="text-sm font-bold text-[#172554] dark:text-slate-100 leading-snug">
                          {place.name}
                        </h4>
                        {place.hindiName && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{place.hindiName}</p>
                        )}
                      </div>
                      <span className="flex items-center gap-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 text-xs font-bold text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        ★ {place.rating}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {place.description}
                    </p>

                    <div className="mt-2 flex items-center justify-between border-t border-[#E8D9C0] dark:border-slate-800 pt-2 text-xs">
                      <OpenBadge isOpen={place.openNow} />

                      <Link
                        href={`/place/${place.id}`}
                        className="inline-flex items-center gap-1 font-semibold text-[#0E7490] dark:text-[#38BDF8] hover:underline"
                      >
                        Details <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
