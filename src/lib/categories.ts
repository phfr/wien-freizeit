import type { CategoryGroup, Location } from '@/types/location';

const PLACE_TYPES = [
  'Ballspielkäfig',
  'Ballspielplatz',
  'Generationenspielplatz',
  'Kleinkinderspielplatz',
  'Skaterpark',
  'Spielplatz',
  'Themenspielplatz',
  'Wasserspielplatz',
  'sonstiger Spielplatz',
] as const;

export function buildCategoryIndex(locations: Location[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const location of locations) {
    for (const category of location.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }

  return counts;
}

export function getCategoryGroups(locations: Location[]): CategoryGroup[] {
  const counts = buildCategoryIndex(locations);

  const placeTypes = PLACE_TYPES.filter((name) => counts.has(name)).map((name) => ({
    name,
    count: counts.get(name) ?? 0,
  }));

  const activities = [...counts.entries()]
    .filter(([name]) => !PLACE_TYPES.includes(name as (typeof PLACE_TYPES)[number]))
    .sort(([a], [b]) => a.localeCompare(b, 'de'))
    .map(([name, count]) => ({ name, count }));

  return [
    { label: 'Spielplatztypen', categories: placeTypes },
    { label: 'Aktivitäten & Ausstattung', categories: activities },
  ];
}
