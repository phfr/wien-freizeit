import type { FilterState, Location, LocationWithDistance, UserLocation } from '@/types/location';
import { matchesBezirkQuery } from '@/lib/bezirk';
import { haversineKm, sortByDistance } from '@/lib/geo';

function matchesQuery(location: Location, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  if (
    location.name.toLowerCase().includes(normalized) ||
    location.description.toLowerCase().includes(normalized) ||
    location.categories.some((category) => category.toLowerCase().includes(normalized))
  ) {
    return true;
  }

  if (location.bezirk && matchesBezirkQuery(location.bezirk, query)) {
    return true;
  }

  return false;
}

function matchesCategories(location: Location, categories: string[]): boolean {
  if (categories.length === 0) return true;
  return categories.some((category) => location.categories.includes(category));
}

export function filterLocations(
  locations: Location[],
  filters: FilterState,
  favoriteIds: Set<string>,
  userLocation?: UserLocation | null,
): LocationWithDistance[] {
  let results: LocationWithDistance[] = locations.filter((location) => {
    if (filters.favoritesOnly && !favoriteIds.has(location.id)) return false;
    if (!matchesQuery(location, filters.query)) return false;
    if (!matchesCategories(location, filters.categories)) return false;
    return true;
  });

  if (userLocation) {
    results = results.map((location) => ({
      ...location,
      distanceKm: haversineKm(userLocation.lat, userLocation.lng, location.lat, location.lng),
    }));
  }

  if (filters.sort === 'distance' && userLocation) {
    return sortByDistance(results);
  }

  return [...results].sort((a, b) => a.name.localeCompare(b.name, 'de'));
}

export function parseFiltersFromSearchParams(params: URLSearchParams): FilterState {
  const categories = params
    .get('cat')
    ?.split(',')
    .map((value) => value.trim())
    .filter(Boolean) ?? [];

  return {
    query: params.get('q') ?? '',
    categories,
    favoritesOnly: params.get('fav') === '1',
    sort: params.get('sort') === 'distance' ? 'distance' : 'name',
  };
}

export function filtersToSearchParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.query.trim()) {
    params.set('q', filters.query.trim());
  }

  if (filters.categories.length > 0) {
    params.set('cat', filters.categories.join(','));
  }

  if (filters.favoritesOnly) {
    params.set('fav', '1');
  }

  if (filters.sort === 'distance') {
    params.set('sort', 'distance');
  }

  return params;
}
