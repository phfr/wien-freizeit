import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { MarkerClusterGroup } from '@/components/map/MarkerClusterGroup';
import type { Location } from '@/types/location';
import { LocationMarker } from '@/components/map/LocationMarker';
import { getBoundsForLocations, getViennaCenter } from '@/lib/geo';

interface MapViewProps {
  locations: Location[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function MapController({
  locations,
  selectedId,
  locationById,
}: {
  locations: Location[];
  selectedId: string | null;
  locationById: Map<string, Location>;
}) {
  const map = useMap();

  useEffect(() => {
    const bounds = getBoundsForLocations(locations);
    if (bounds && locations.length > 1) {
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
    } else if (locations.length === 1) {
      map.setView([locations[0].lat, locations[0].lng], 15);
    }
  }, [locations, map]);

  useEffect(() => {
    if (!selectedId) return;
    const location = locationById.get(selectedId);
    if (!location) return;
    map.flyTo([location.lat, location.lng], Math.max(map.getZoom(), 15), {
      duration: 0.8,
    });
  }, [selectedId, locationById, map]);

  return null;
}

export function MapView({ locations, selectedId, onSelect }: MapViewProps) {
  const center = getViennaCenter();
  const locationById = useMemo(
    () => new Map(locations.map((location) => [location.id, location])),
    [locations],
  );

  const tileUrl =
    import.meta.env.VITE_TILE_URL ?? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={12}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url={tileUrl}
      />
      <MapController
        locations={locations}
        selectedId={selectedId}
        locationById={locationById}
      />
      <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
        {locations.map((location) => (
          <LocationMarker
            key={location.id}
            location={location}
            isSelected={location.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
