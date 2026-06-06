import type { Bezirk } from '@/types/location';

export function normalizeBezirkQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function matchesBezirkQuery(bezirk: Bezirk, rawQuery: string): boolean {
  const query = normalizeBezirkQuery(rawQuery);
  if (!query) return false;

  const name = bezirk.name.toLowerCase();
  const postalCode = bezirk.postalCode;

  if (name.includes(query)) return true;
  if (postalCode === query) return true;
  if (query.length >= 3 && /^\d+$/.test(query) && postalCode.startsWith(query)) return true;

  const districtMatch = query.match(/^(\d{1,2})\.?$/);
  if (districtMatch && Number(districtMatch[1]) === bezirk.number) return true;

  const labeledMatch = query.match(/^(\d{1,2})\.\s*(.+)$/);
  if (labeledMatch) {
    const number = Number(labeledMatch[1]);
    const label = labeledMatch[2].trim();
    if (number === bezirk.number && name.includes(label)) return true;
  }

  return false;
}
