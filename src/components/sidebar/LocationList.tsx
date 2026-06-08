import { Heart, MapPin } from 'lucide-react';
import type { LocationWithDistance } from '@/types/location';
import { Button } from '@/components/ui/button';
import { formatDistance } from '@/lib/geo';
import { cn } from '@/lib/utils';

interface LocationListProps {
  locations: LocationWithDistance[];
  selectedId: string | null;
  favoriteIds: Set<string>;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function LocationList({
  locations,
  selectedId,
  favoriteIds,
  onSelect,
  onToggleFavorite,
}: LocationListProps) {
  if (locations.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-center">
        <MapPin className="mb-3 h-8 w-8 text-muted-foreground" />
        <p className="font-medium">Keine Treffer</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Passe Suche oder Filter an, um Spielplätze zu finden.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {locations.map((location) => {
        const isSelected = location.id === selectedId;
        const isFavorite = favoriteIds.has(location.id);

        return (
          <li key={location.id}>
            <div
              className={cn(
                'rounded-xl border bg-background p-3 transition-colors',
                isSelected ? 'border-primary shadow-sm' : 'border-border',
              )}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left"
                  onClick={() => onSelect(location.id)}
                >
                  <p className="truncate font-medium">{location.name}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {location.description}
                  </p>
                  {location.distanceKm !== undefined && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDistance(location.distanceKm)}
                    </p>
                  )}
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                  onClick={() => onToggleFavorite(location.id)}
                >
                  <Heart className={cn('h-4 w-4', isFavorite && 'fill-primary text-primary')} />
                </Button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
