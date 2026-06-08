import type { Location } from '@/types/location';

function normalizeAmenity(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '');
}

function parseDescriptionTokens(description: string): string[] {
  return description
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);
}

function amenitiesMatch(a: string, b: string): boolean {
  const left = normalizeAmenity(a);
  const right = normalizeAmenity(b);

  if (!left || !right) return false;
  if (left === right) return true;

  return left.startsWith(right) || right.startsWith(left);
}

function addUniqueTag(tags: string[], tag: string): void {
  const existingIndex = tags.findIndex((current) => amenitiesMatch(current, tag));

  if (existingIndex === -1) {
    tags.push(tag);
    return;
  }

  if (tag.length > tags[existingIndex].length) {
    tags[existingIndex] = tag;
  }
}

export function getMergedAmenityTags(location: Location): string[] {
  const tags: string[] = [];
  const descriptionTokens = parseDescriptionTokens(location.description);

  for (const category of location.categories) {
    const specificDescription = descriptionTokens.find(
      (token) => amenitiesMatch(token, category) && token.length > category.length,
    );
    addUniqueTag(tags, specificDescription ?? category);
  }

  for (const token of descriptionTokens) {
    addUniqueTag(tags, token);
  }

  return tags.sort((a, b) => a.localeCompare(b, 'de'));
}
