import { useMemo } from 'react';
import type { Location } from '@/types/location';
import { getMergedAmenityTags } from '@/lib/amenities';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AmenityTagsProps {
  location: Location;
  className?: string;
}

export function AmenityTags({ location, className }: AmenityTagsProps) {
  const tags = useMemo(() => getMergedAmenityTags(location), [location]);

  if (tags.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
