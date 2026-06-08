import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import {
  List,
  Loader2,
  Map as MapIcon,
  Moon,
  SlidersHorizontal,
  Sun,
  SunMoon,
} from 'lucide-react';
import { FilterCategoryCombobox } from '@/components/filters/FilterCategoryCombobox';
import { SearchBar } from '@/components/filters/SearchBar';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { SidebarSection } from '@/components/layout/SidebarSection';
import { LocationList } from '@/components/sidebar/LocationList';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useFilters } from '@/hooks/useFilters';
import { useFavorites } from '@/hooks/useFavorites';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useLocations } from '@/hooks/useLocations';
import { useTheme } from '@/hooks/useTheme';
import { filterLocations } from '@/lib/filter';

const MapView = lazy(() =>
  import('@/components/map/MapView').then((module) => ({ default: module.MapView })),
);

function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();

  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : SunMoon;
  const label =
    theme === 'dark' ? 'Dunkelmodus' : theme === 'light' ? 'Hellmodus' : 'Systemmodus';

  return (
    <Button type="button" variant="outline" size="icon" onClick={cycleTheme} aria-label={label}>
      <Icon className="h-4 w-4" />
    </Button>
  );
}

function SidebarContent({
  resultCount,
  filteredLocations,
  selectedId,
  favoriteIds,
  onSelect,
  onToggleFavorite,
  filters,
  categoryGroups,
  setQuery,
  toggleCategory,
  clearPanelFilters,
  toggleFavoritesOnly,
  setSort,
  userLocation,
  requestLocation,
  isLoadingLocation,
  locationError,
}: {
  resultCount: number;
  filteredLocations: ReturnType<typeof filterLocations>;
  selectedId: string | null;
  favoriteIds: Set<string>;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  filters: ReturnType<typeof useFilters>['filters'];
  categoryGroups: ReturnType<typeof useLocations>['categoryGroups'];
  setQuery: ReturnType<typeof useFilters>['setQuery'];
  toggleCategory: ReturnType<typeof useFilters>['toggleCategory'];
  clearPanelFilters: ReturnType<typeof useFilters>['clearPanelFilters'];
  toggleFavoritesOnly: ReturnType<typeof useFilters>['toggleFavoritesOnly'];
  setSort: ReturnType<typeof useFilters>['setSort'];
  userLocation: ReturnType<typeof useGeolocation>['userLocation'];
  requestLocation: ReturnType<typeof useGeolocation>['requestLocation'];
  isLoadingLocation: boolean;
  locationError: string | null;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3 px-1 pt-1">
        <div>
          <p className="text-sm font-medium text-primary">Wien Freizeit</p>
          <h1 className="text-2xl font-semibold tracking-tight">Spiel & Sport in Wien</h1>
        </div>
        <ThemeToggle />
      </div>

      <SidebarSection variant="surface">
        <div className="space-y-3">
          <SearchBar value={filters.query} onChange={setQuery} />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={userLocation ? 'default' : 'outline'}
              onClick={requestLocation}
              disabled={isLoadingLocation}
            >
              {isLoadingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapIcon className="h-4 w-4" />
              )}
              In meiner Nähe
            </Button>
            <Button
              type="button"
              size="sm"
              variant={filters.sort === 'distance' ? 'default' : 'outline'}
              onClick={() => setSort(filters.sort === 'distance' ? 'name' : 'distance')}
              disabled={!userLocation}
            >
              Nach Entfernung
            </Button>
          </div>
          {locationError && <p className="text-sm text-destructive">{locationError}</p>}
        </div>
      </SidebarSection>

      <SidebarSection variant="muted">
        <FilterPanel
          categoryGroups={categoryGroups}
          selectedCategories={filters.categories}
          favoritesOnly={filters.favoritesOnly}
          onToggleCategory={toggleCategory}
          onClearPanelFilters={clearPanelFilters}
          onToggleFavoritesOnly={toggleFavoritesOnly}
        />
      </SidebarSection>

      <SidebarSection
        title="Standorte"
        description={`${resultCount} Spielplätze gefunden`}
        variant="elevated"
      >
        <LocationList
          locations={filteredLocations}
          selectedId={selectedId}
          favoriteIds={favoriteIds}
          onSelect={onSelect}
          onToggleFavorite={onToggleFavorite}
        />
      </SidebarSection>
    </div>
  );
}

export function AppShell() {
  const isDesktop = useIsDesktop();
  const { locations, categoryGroups } = useLocations();
  const {
    filters,
    setQuery,
    toggleCategory,
    clearPanelFilters,
    toggleFavoritesOnly,
    setSort,
    resetFilters,
    activeFilterCount,
  } = useFilters();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { userLocation, requestLocation, isLoading: isLoadingLocation, error: locationError } =
    useGeolocation();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hadUserLocation = useRef(false);

  useEffect(() => {
    if (userLocation && !hadUserLocation.current) {
      setSort('distance');
      hadUserLocation.current = true;
    }
    if (!userLocation) {
      hadUserLocation.current = false;
    }
  }, [userLocation, setSort]);

  const filteredLocations = useMemo(
    () => filterLocations(locations, filters, favoriteIds, userLocation),
    [locations, filters, favoriteIds, userLocation],
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (!isDesktop) {
      setFiltersOpen(false);
      setMobileSheetOpen(false);
    }
  };

  const toggleFiltersSheet = () => {
    setFiltersOpen((open) => {
      const next = !open;
      if (next) setMobileSheetOpen(false);
      return next;
    });
  };

  const toggleListSheet = () => {
    setMobileSheetOpen((open) => {
      const next = !open;
      if (next) setFiltersOpen(false);
      return next;
    });
  };

  const sidebarProps = {
    resultCount: filteredLocations.length,
    filteredLocations,
    selectedId,
    favoriteIds,
    onSelect: handleSelect,
    onToggleFavorite: toggleFavorite,
    filters,
    categoryGroups,
    setQuery,
    toggleCategory,
    clearPanelFilters,
    toggleFavoritesOnly,
    setSort,
    userLocation,
    requestLocation,
    isLoadingLocation,
    locationError,
  };

  return (
    <div className="flex h-full overflow-hidden lg:flex-row">
      {isDesktop && (
        <aside className="flex h-full min-h-0 w-[380px] shrink-0 flex-col overflow-hidden border-r border-border bg-muted/30">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-3">
            <SidebarContent {...sidebarProps} />
          </div>
        </aside>
      )}

      <main className="relative h-full min-h-0 flex-1 overflow-hidden">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center bg-muted">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <MapView
            locations={filteredLocations}
            selectedId={selectedId}
            favoriteIds={favoriteIds}
            onSelect={handleSelect}
            onToggleFavorite={toggleFavorite}
          />
        </Suspense>

        {!isDesktop && (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-0 z-[1100] px-3 pt-2 pb-1">
              <div className="pointer-events-auto rounded-2xl border border-border bg-background/95 p-2.5 shadow-lg backdrop-blur">
                <SearchBar value={filters.query} onChange={setQuery} />
                <div className="mt-2 flex items-center gap-2">
                  <FilterCategoryCombobox
                    className="min-w-0 flex-1"
                    compact
                    categoryGroups={categoryGroups}
                    selectedCategories={filters.categories}
                    favoritesOnly={filters.favoritesOnly}
                    onToggleCategory={toggleCategory}
                    onClearAll={clearPanelFilters}
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="shrink-0"
                    variant={filtersOpen ? 'default' : 'outline'}
                    onClick={toggleFiltersSheet}
                    aria-expanded={filtersOpen}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter
                    {activeFilterCount > 0 && ` (${activeFilterCount})`}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="shrink-0"
                    variant={mobileSheetOpen ? 'default' : 'outline'}
                    onClick={toggleListSheet}
                    aria-expanded={mobileSheetOpen}
                  >
                    <List className="h-4 w-4" />
                    Liste ({filteredLocations.length})
                  </Button>
                  <ThemeToggle />
                </div>
              </div>
            </div>

            <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
              <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto px-4 pb-6 pt-3">
                <SheetHeader className="mb-3 text-left">
                  <SheetTitle>Standorte</SheetTitle>
                </SheetHeader>
                <LocationList
                  locations={filteredLocations}
                  selectedId={selectedId}
                  favoriteIds={favoriteIds}
                  onSelect={handleSelect}
                  onToggleFavorite={toggleFavorite}
                />
              </SheetContent>
            </Sheet>

            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto px-4 pb-6 pt-3">
                <FilterPanel
                  showCombobox={false}
                  categoryGroups={categoryGroups}
                  selectedCategories={filters.categories}
                  favoritesOnly={filters.favoritesOnly}
                  onToggleCategory={toggleCategory}
                  onClearPanelFilters={clearPanelFilters}
                  onToggleFavoritesOnly={toggleFavoritesOnly}
                />
                <div className="mt-4 flex gap-2">
                  <Button type="button" variant="outline" onClick={resetFilters}>
                    Alles zurücksetzen
                  </Button>
                  <Button type="button" onClick={() => setFiltersOpen(false)}>
                    Anwenden
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}
      </main>
    </div>
  );
}
