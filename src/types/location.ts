export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  categories: string[];
  bezirk?: Bezirk;
}

export interface Bezirk {
  number: number;
  name: string;
  postalCode: string;
}

export interface CategoryGroup {
  label: string;
  categories: CategoryOption[];
}

export interface CategoryOption {
  name: string;
  count: number;
}

export type SortMode = 'name' | 'distance';

export interface FilterState {
  query: string;
  categories: string[];
  favoritesOnly: boolean;
  sort: SortMode;
}

export interface UserLocation {
  lat: number;
  lng: number;
}

export interface LocationWithDistance extends Location {
  distanceKm?: number;
}
