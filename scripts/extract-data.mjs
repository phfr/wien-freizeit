import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const sourcePath = join(root, 'legacy', 'index.html');
const outputPath = join(root, 'src', 'data', 'locations.json');

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateId(name, lat, lng) {
  const hash = createHash('md5')
    .update(`${name}|${lat}|${lng}`)
    .digest('hex')
    .slice(0, 8);
  return `${slugify(name) || 'location'}-${hash}`;
}

function cleanDescription(description) {
  return description.replace(/^[\s,]+/, '').trim();
}

const html = readFileSync(sourcePath, 'utf8');
const assignmentMarker = '});\nmarkers1 = [';
const startIndex = html.indexOf(assignmentMarker);

if (startIndex === -1) {
  console.error('Could not find markers1 array in legacy/index.html');
  process.exit(1);
}

const arrayStart = startIndex + assignmentMarker.length - 1;
const endIndex = html.indexOf('\n];', arrayStart);

const arraySource = html.slice(arrayStart, endIndex + 2);
const rawMarkers = Function(`"use strict"; return ${arraySource};`)();

const locations = rawMarkers.map((marker) => {
  const [name, lat, lng, description, categories] = marker;
  return {
    id: generateId(name, lat, lng),
    name,
    lat,
    lng,
    description: cleanDescription(description),
    categories,
  };
});

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(locations, null, 2)}\n`, 'utf8');

console.log(`Extracted ${locations.length} locations to ${outputPath}`);
