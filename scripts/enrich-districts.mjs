import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const boundariesPath = join(root, 'scripts', 'data', 'bezirksgrenzen.geojson');
const locationsPath = join(root, 'src', 'data', 'locations.json');
const bezirkePath = join(root, 'src', 'data', 'bezirke.json');
const boundariesUrl =
  'https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:BEZIRKSGRENZEOGD&srsName=EPSG:4326&outputFormat=json';

function pointInRing(lng, lat, ring) {
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;

    if (intersects) inside = !inside;
  }

  return inside;
}

function findBezirk(lng, lat, districts) {
  for (const district of districts) {
    if (pointInRing(lng, lat, district.ring)) {
      return district.meta;
    }
  }

  return null;
}

async function ensureBoundaries() {
  if (existsSync(boundariesPath)) return;

  mkdirSync(dirname(boundariesPath), { recursive: true });
  console.log('Downloading Vienna district boundaries from data.wien.gv.at…');

  const response = await fetch(boundariesUrl);
  if (!response.ok) {
    throw new Error(`Failed to download district boundaries (${response.status})`);
  }

  writeFileSync(boundariesPath, await response.text(), 'utf8');
}

function loadDistricts(geojson) {
  return geojson.features
    .map((feature) => ({
      ring: feature.geometry.coordinates[0],
      meta: {
        number: feature.properties.BEZNR,
        name: feature.properties.NAMEK,
        postalCode: String(feature.properties.DISTRICT_CODE),
      },
    }))
    .sort((a, b) => a.meta.number - b.meta.number);
}

async function main() {
  await ensureBoundaries();

  const geojson = JSON.parse(readFileSync(boundariesPath, 'utf8'));
  const districts = loadDistricts(geojson);
  const bezirke = districts.map((district) => district.meta);

  const locations = JSON.parse(readFileSync(locationsPath, 'utf8'));
  let unmatched = 0;

  const enriched = locations.map((location) => {
    const bezirk = findBezirk(location.lng, location.lat, districts);

    if (!bezirk) {
      unmatched += 1;
      return location;
    }

    return { ...location, bezirk };
  });

  writeFileSync(bezirkePath, `${JSON.stringify(bezirke, null, 2)}\n`, 'utf8');
  writeFileSync(locationsPath, `${JSON.stringify(enriched, null, 2)}\n`, 'utf8');

  console.log(`Enriched ${enriched.length} locations with Bezirk data`);
  console.log(`Saved ${bezirke.length} districts to ${bezirkePath}`);
  if (unmatched > 0) {
    console.warn(`Warning: ${unmatched} locations outside Vienna district boundaries`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
