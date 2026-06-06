import { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Location } from '@/types/location';
import { Badge } from '@/components/ui/badge';

interface LocationMarkerProps {
  location: Location;
  isSelected: boolean;
  onSelect: (id: string) => void;
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

export function LocationMarker({ location, isSelected, onSelect }: LocationMarkerProps) {
  const icon = useMemo(() => createIcon(isSelected), [isSelected]);

  return (
    <Marker
      position={[location.lat, location.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect(location.id),
      }}
    >
      <Popup className="map-popup">
        <div className="min-w-[220px] space-y-2 text-card-foreground">
          <h3 className="font-semibold text-foreground">{location.name}</h3>
          <p className="text-sm text-muted-foreground">{location.description}</p>
          <div className="flex flex-wrap gap-1">
            {location.categories.slice(0, 6).map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
