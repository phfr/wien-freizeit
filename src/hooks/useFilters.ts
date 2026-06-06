import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FilterState } from '@/types/location';
import {
  filtersToSearchParams,
  parseFiltersFromSearchParams,
} from '@/lib/filter';

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(() =>
    parseFiltersFromSearchParams(new URLSearchParams(window.location.search)),
  );

  useEffect(() => {
    const params = filtersToSearchParams(filters);
    const next = params.toString();
    const url = next ? `${window.location.pathname}?${next}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  }, [filters]);

  const setQuery = useCallback((query: string) => {
    setFilters((current) => ({ ...current, query }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setFilters((current) => {
      const exists = current.categories.includes(category);
      return {
        ...current,
        categories: exists
          ? current.categories.filter((value) => value !== category)
          : [...current.categories, category],
      };
    });
  }, []);

  const clearCategories = useCallback(() => {
    setFilters((current) => ({ ...current, categories: [] }));
  }, []);

  const clearPanelFilters = useCallback(() => {
    setFilters((current) => ({
      ...current,
      categories: [],
      favoritesOnly: false,
    }));
  }, []);

  const toggleFavoritesOnly = useCallback(() => {
    setFilters((current) => ({ ...current, favoritesOnly: !current.favoritesOnly }));
  }, []);

  const setSort = useCallback((sort: FilterState['sort']) => {
    setFilters((current) => ({ ...current, sort }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      query: '',
      categories: [],
      favoritesOnly: false,
      sort: 'name',
    });
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.query.trim()) count += 1;
    count += filters.categories.length;
    if (filters.favoritesOnly) count += 1;
    return count;
  }, [filters]);

  return {
    filters,
    setQuery,
    toggleCategory,
    clearCategories,
    clearPanelFilters,
    toggleFavoritesOnly,
    setSort,
    resetFilters,
    activeFilterCount,
  };
}
