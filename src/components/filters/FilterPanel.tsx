import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CategoryGroup, CategoryOption } from '@/types/location';

const ACTIVITIES_INITIAL_VISIBLE = 8;
const PLACE_TYPES_LABEL = 'Spielplatztypen';

interface FilterPanelProps {
  categoryGroups: CategoryGroup[];
  selectedCategories: string[];
  favoritesOnly: boolean;
  onToggleCategory: (category: string) => void;
  onClearPanelFilters: () => void;
  onToggleFavoritesOnly: () => void;
}

function getVisibleCategories(
  categories: CategoryOption[],
  selectedCategories: string[],
  expanded: boolean,
): CategoryOption[] {
  if (expanded) return categories;

  const initial = categories.slice(0, ACTIVITIES_INITIAL_VISIBLE);
  const initialNames = new Set(initial.map((category) => category.name));

  const selectedHidden = categories.filter(
    (category) =>
      selectedCategories.includes(category.name) && !initialNames.has(category.name),
  );

  return [...initial, ...selectedHidden];
}

function CategoryChipGroup({
  group,
  selectedCategories,
  onToggleCategory,
  defaultOpen,
  showAllChips,
}: {
  group: CategoryGroup;
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  defaultOpen: boolean;
  showAllChips: boolean;
}) {
  const selectedInGroup = useMemo(
    () => group.categories.filter((category) => selectedCategories.includes(category.name)),
    [group.categories, selectedCategories],
  );

  const [sectionOpen, setSectionOpen] = useState(
    () => defaultOpen || selectedInGroup.length > 0,
  );
  const [chipsExpanded, setChipsExpanded] = useState(false);

  const visibleCategories = showAllChips
    ? group.categories
    : getVisibleCategories(group.categories, selectedCategories, chipsExpanded);

  const hiddenCount = group.categories.length - ACTIVITIES_INITIAL_VISIBLE;
  const showChipsToggle = !showAllChips && hiddenCount > 0;

  return (
    <div className="rounded-xl border border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 rounded-xl p-3 text-left transition-colors hover:bg-muted/50"
        onClick={() => setSectionOpen((current) => !current)}
        aria-expanded={sectionOpen}
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {group.label}
          {selectedInGroup.length > 0 && (
            <span className="ml-1 normal-case text-primary">({selectedInGroup.length} aktiv)</span>
          )}
        </span>
        {sectionOpen ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>

      {sectionOpen && (
        <div className="space-y-2 border-t border-border px-3 pb-3 pt-2">
          <div className="flex flex-wrap gap-2">
            {visibleCategories.map((category) => {
              const isActive = selectedCategories.includes(category.name);
              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => onToggleCategory(category.name)}
                  aria-pressed={isActive}
                >
                  <Badge variant={isActive ? 'active' : 'outline'}>
                    {category.name} ({category.count})
                  </Badge>
                </button>
              );
            })}
          </div>
          {showChipsToggle && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 px-2 text-muted-foreground"
              onClick={() => setChipsExpanded((current) => !current)}
              aria-expanded={chipsExpanded}
            >
              {chipsExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Weniger anzeigen
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Mehr anzeigen ({hiddenCount})
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function FilterPanel({
  categoryGroups,
  selectedCategories,
  favoritesOnly,
  onToggleCategory,
  onClearPanelFilters,
  onToggleFavoritesOnly,
}: FilterPanelProps) {
  const hasActivePanelFilters = selectedCategories.length > 0 || favoritesOnly;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={favoritesOnly ? 'default' : 'outline'}
          onClick={onToggleFavoritesOnly}
          aria-pressed={favoritesOnly}
        >
          Favoriten
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onClearPanelFilters}
          disabled={!hasActivePanelFilters}
        >
          Filter zurücksetzen
        </Button>
      </div>

      {categoryGroups.map((group) => (
        <CategoryChipGroup
          key={group.label}
          group={group}
          selectedCategories={selectedCategories}
          onToggleCategory={onToggleCategory}
          defaultOpen={group.label === PLACE_TYPES_LABEL}
          showAllChips={group.label === PLACE_TYPES_LABEL}
        />
      ))}
    </div>
  );
}
