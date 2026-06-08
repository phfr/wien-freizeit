import { Heart, Navigation } from 'lucide-react';
import type { Location } from '@/types/location';
import { AmenityTags } from '@/components/shared/AmenityTags';
import { Button } from '@/components/ui/button';
import { getDirectionsUrl } from '@/lib/geo';
import { cn } from '@/lib/utils';

interface LocationPopupContentProps {
  location: Location;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function LocationPopupContent({
  location,
  isFavorite,
  onToggleFavorite,
}: LocationPopupContentProps) {
  return (
    <div className="min-w-[240px] space-y-3 text-card-foreground">
      <div className="flex items-center gap-2 pr-5">
        <Button
          type="button"
          variant={isFavorite ? 'default' : 'outline'}
          size="icon"
          className="h-8 w-8 shrink-0"
          aria-label={isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(location.id)}
        >
          <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
        </Button>
        <h3 className="min-w-0 flex-1 py-0.5 font-semibold leading-tight text-foreground">
          {location.name}
        </h3>
      </div>

      <AmenityTags location={location} className="gap-1.5" />

      <Button
        type="button"
        size="sm"
        className="w-full"
        onClick={() => window.open(getDirectionsUrl(location, 'google'), '_blank', 'noopener,noreferrer')}
      >
        <Navigation className="h-4 w-4" />
        Route planen
      </Button>
    </div>
  );
}
