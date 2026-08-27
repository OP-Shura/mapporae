'use client';

import React, { createContext, useContext, useState } from 'react';
import { Coordinates } from '@/lib/types';
import { calculateDistanceKm } from '@/lib/api/places';
import { VARANASI_PRESET_LOCATIONS } from '@/lib/api/geocoding';

// Varanasi City Center (Godowlia / Dashashwamedh)
export const DEFAULT_VARANASI_COORDS: Coordinates = {
  lat: 25.3072,
  lng: 83.0104,
};

// Maximum threshold for Varanasi metropolitan region coverage (~35 km radius)
const VARANASI_COVERAGE_RADIUS_KM = 35;

interface LocationContextType {
  userLocation: Coordinates;
  effectiveLocation: Coordinates; // Always in Varanasi for place queries even if user is outside
  locationName: string;
  isLocating: boolean;
  isOutsideCoverage: boolean;
  permissionStatus: 'prompt' | 'granted' | 'denied' | 'unsupported';
  errorMessage: string | null;
  requestLocation: () => Promise<void>;
  setUserCoords: (coords: Coordinates, name?: string) => void;
  getDistanceTo: (targetCoords: Coordinates) => number;
  presets: typeof VARANASI_PRESET_LOCATIONS;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocation] = useState<Coordinates>(DEFAULT_VARANASI_COORDS);
  const [locationName, setLocationName] = useState<string>('Dashashwamedh, Varanasi');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isOutsideCoverage, setIsOutsideCoverage] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestLocation = async () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setPermissionStatus('unsupported');
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);
        setPermissionStatus('granted');
        setIsLocating(false);

        // Check if user is outside Varanasi coverage
        const distanceFromVaranasi = calculateDistanceKm(coords, DEFAULT_VARANASI_COORDS);
        if (distanceFromVaranasi > VARANASI_COVERAGE_RADIUS_KM) {
          setIsOutsideCoverage(true);
          setLocationName(`Current location (${coords.lat.toFixed(2)}°, ${coords.lng.toFixed(2)}°)`);
        } else {
          setIsOutsideCoverage(false);
          setLocationName(`Current location (${coords.lat.toFixed(3)}°, ${coords.lng.toFixed(3)}°)`);
        }
      },
      (error) => {
        setIsLocating(false);
        setPermissionStatus('denied');
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMessage('Location permission was denied. Using Varanasi City Center.');
        } else {
          setErrorMessage('Could not retrieve precise location. Using Varanasi default.');
        }
        setUserLocation(DEFAULT_VARANASI_COORDS);
        setIsOutsideCoverage(false);
        setLocationName('Varanasi City Center');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  const setUserCoords = (coords: Coordinates, name?: string) => {
    setUserLocation(coords);
    const distanceFromVaranasi = calculateDistanceKm(coords, DEFAULT_VARANASI_COORDS);
    setIsOutsideCoverage(distanceFromVaranasi > VARANASI_COVERAGE_RADIUS_KM);
    if (name) {
      setLocationName(name);
    }
  };

  // If user is outside coverage, calculate distances relative to Varanasi City Center so places aren't filtered out
  const effectiveLocation = isOutsideCoverage ? DEFAULT_VARANASI_COORDS : userLocation;

  const getDistanceTo = (targetCoords: Coordinates): number => {
    return calculateDistanceKm(effectiveLocation, targetCoords);
  };

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        effectiveLocation,
        locationName,
        isLocating,
        isOutsideCoverage,
        permissionStatus,
        errorMessage,
        requestLocation,
        setUserCoords,
        getDistanceTo,
        presets: VARANASI_PRESET_LOCATIONS,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
