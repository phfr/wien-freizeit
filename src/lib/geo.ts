import type { Location, LocationWithDistance, UserLocation } from '@/types/location';
import type { LatLngBoundsExpression } from 'leaflet';

const VIENNA_CENTER: UserLocation = { lat: 48.201776, lng: 16.376621 };
const EARTH_RADIUS_KM = 6371;

export function getViennaCenter(): UserLocation {
  return VIENNA_CENTER;
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function sortByDistance(locations: LocationWithDistance[]): LocationWithDistance[] {
  return [...locations].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function getBoundsForLocations(locations: Location[]): LatLngBoundsExpression | null {
  if (locations.length === 0) return null;

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  for (const location of locations) {
    minLat = Math.min(minLat, location.lat);
    maxLat = Math.max(maxLat, location.lat);
    minLng = Math.min(minLng, location.lng);
    maxLng = Math.max(maxLng, location.lng);
  }

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
}

export function getDirectionsUrl(location: Location, provider: 'google' | 'apple' | 'osm' = 'google'): string {
  const { lat, lng, name } = location;

  if (provider === 'apple') {
    return `https://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(name)}`;
  }

  if (provider === 'osm') {
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
}
