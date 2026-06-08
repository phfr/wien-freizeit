import { useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CategoryGroup } from '@/types/location';

interface FilterCategoryComboboxProps {
  categoryGroups: CategoryGroup[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  onClearAll?: () => void;
  favoritesOnly?: boolean;
  compact?: boolean;
  className?: string;
}

export function FilterCategoryCombobox({
  categoryGroups,
  selectedCategories,
  onToggleCategory,
  onClearAll,
  favoritesOnly = false,
  compact = false,
  className,
}: FilterCategoryComboboxProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const allOptions = useMemo(
    () => categoryGroups.flatMap((group) => group.categories),
    [categoryGroups],
  );

  const countByName = useMemo(
    () => new Map(allOptions.map((option) => [option.name, option.count])),
    [allOptions],
  );

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return allOptions
      .filter((option) => !selectedCategories.includes(option.name))
      .filter((option) => !normalized || option.name.toLowerCase().includes(normalized))
      .slice(0, 10);
  }, [allOptions, selectedCategories, query]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const showDropdown = open && query.trim().length > 0 && suggestions.length > 0;
  const hasActiveFilters = selectedCategories.length > 0 || favoritesOnly;
  const showClearAll = Boolean(onClearAll && hasActiveFilters);

  const placeholder = compact
    ? selectedCategories.length === 0
      ? 'Filter…'
      : 'Weiter…'
    : selectedCategories.length === 0
      ? 'z. B. Basketball, Spielplatz…'
      : 'Weiteren Filter suchen…';

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div
        className={cn(
          'flex items-center gap-1 rounded-xl border border-input bg-background py-1.5 pl-2 focus-within:ring-2 focus-within:ring-ring',
          showClearAll ? 'pr-1' : 'pr-2',
          compact ? 'min-h-9' : 'min-h-11',
        )}
      >
        <div
          className={cn(
            'flex min-w-0 flex-1 flex-wrap items-center gap-1.5',
            compact ? 'max-h-24 overflow-y-auto' : '',
          )}
          onClick={() => setOpen(true)}
        >
          {selectedCategories.map((name) => (
            <Badge key={name} variant="active" className="gap-1 pr-1.5">
              <span>
                {name}
                {countByName.has(name) ? ` (${countByName.get(name)})` : ''}
              </span>
              <button
                type="button"
                className="rounded-sm opacity-80 transition-opacity hover:opacity-100"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleCategory(name);
                }}
                aria-label={`${name} entfernen`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <input
            id="filter-category-input"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className={cn(
              'flex-1 border-0 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground',
              compact ? 'min-w-0' : 'min-w-[8rem]',
            )}
            aria-label="Filter suchen"
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            role="combobox"
          />
        </div>
        {showClearAll && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn('shrink-0', compact ? 'h-8 w-8' : 'h-9 w-9')}
            onClick={(event) => {
              event.stopPropagation();
              setQuery('');
              setOpen(false);
              onClearAll?.();
            }}
            aria-label="Alle Filter löschen"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {showDropdown && (
        <ul
          className={cn(
            'absolute left-0 right-0 mt-1 max-h-52 overflow-y-auto rounded-xl border border-border bg-card py-1 shadow-lg',
            compact ? 'z-[1200]' : 'z-20',
          )}
          role="listbox"
        >
          {suggestions.map((option) => (
            <li key={option.name} role="option">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                onClick={() => {
                  onToggleCategory(option.name);
                  setQuery('');
                  setOpen(false);
                }}
              >
                <span>{option.name}</span>
                <span className="text-muted-foreground">({option.count})</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
