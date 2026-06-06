import { ExternalLink, Heart, MapPin, Navigation } from 'lucide-react';
import type { LocationWithDistance } from '@/types/location';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistance, getDirectionsUrl } from '@/lib/geo';
import { cn } from '@/lib/utils';

interface LocationDetailProps {
  location: LocationWithDistance;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onBack?: () => void;
}

export function LocationDetail({
  location,
  isFavorite,
  onToggleFavorite,
  onBack,
}: LocationDetailProps) {
  return (
    <div className="space-y-4">
      {onBack && (
        <Button type="button" variant="ghost" size="sm" onClick={onBack}>
          Zurück zur Liste
        </Button>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">{location.name}</h2>
          {location.bezirk && (
            <p className="text-sm text-muted-foreground">
              {location.bezirk.number}. {location.bezirk.name} · {location.bezirk.postalCode}
            </p>
          )}
          {location.distanceKm !== undefined && (
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {formatDistance(location.distanceKm)} entfernt
            </p>
          )}
        </div>
        <Button
          type="button"
          variant={isFavorite ? 'default' : 'outline'}
          size="icon"
          aria-label={isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(location.id)}
        >
          <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Ausstattung
        </h3>
        <p className="text-sm leading-relaxed">{location.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {location.categories.map((category) => (
          <Badge key={category} variant="secondary">
            {category}
          </Badge>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button asChild variant="default">
          <a href={getDirectionsUrl(location, 'google')} target="_blank" rel="noreferrer">
            <Navigation className="h-4 w-4" />
            Route planen
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href={getDirectionsUrl(location, 'osm')} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" />
            OpenStreetMap
          </a>
        </Button>
      </div>
    </div>
  );
}
