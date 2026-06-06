import { useMemo } from 'react';
import locationsData from '@/data/locations.json';
import type { Location } from '@/types/location';
import { getCategoryGroups } from '@/lib/categories';

export function useLocations() {
  const locations = locationsData as Location[];

  const categoryGroups = useMemo(() => getCategoryGroups(locations), [locations]);

  return { locations, categoryGroups };
}
