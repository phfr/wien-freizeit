import { useCallback, useEffect, useState } from 'react';
import { loadFavoriteIds, saveFavoriteIds } from '@/lib/storage';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => loadFavoriteIds());

  useEffect(() => {
    saveFavoriteIds(favoriteIds);
  }, [favoriteIds]);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.has(id),
    [favoriteIds],
  );

  return { favoriteIds, toggleFavorite, isFavorite };
}
