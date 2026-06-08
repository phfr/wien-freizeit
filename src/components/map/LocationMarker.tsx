import { useEffect, useMemo, useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Location } from '@/types/location';
import { LocationPopupContent } from '@/components/map/LocationPopupContent';

interface LocationMarkerProps {
  location: Location;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

function createIcon(isSelected: boolean) {
  const size = isSelected ? 26 : 20;

  return L.divIcon({
    className: '',
    html: `<div class="custom-marker${isSelected ? ' selected' : ''}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function LocationMarker({
  location,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
}: LocationMarkerProps) {
  const markerRef = useRef<L.Marker>(null);
  const icon = useMemo(() => createIcon(isSelected), [isSelected]);

  useEffect(() => {
    if (!isSelected) return;
    markerRef.current?.openPopup();
  }, [isSelected]);

  return (
    <Marker
      ref={markerRef}
      position={[location.lat, location.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect(location.id),
      }}
    >
      <Popup className="map-popup">
        <LocationPopupContent
          location={location}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      </Popup>
    </Marker>
  );
}
