# Wien Freizeit

Interaktive Karte für Spielplätze, Sportflächen und Freizeitangebote in Wien — modern, schnell und für Desktop sowie Mobile optimiert.

## Features

- **733 Standorte** mit Ausstattungsbeschreibung und Kategorien
- **Interaktive Karte** mit OpenStreetMap und Marker-Clustering
- **Suche & Multi-Filter** nach Name, Beschreibung, Kategorien und **Bezirk** (z. B. `1160`, `Ottakring`, `16`)
- **Favoriten** (lokal gespeichert)
- **„In meiner Nähe“** mit Entfernungssortierung
- **Responsive UI** mit Sidebar (Desktop) und Bottom Sheet (Mobile)
- **Hell/Dunkel/System** Theme
- **Teilbare Filter-URLs** via Query-Parameter (`?q=…&cat=…&fav=1`)

## Tech Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- react-leaflet + Leaflet MarkerCluster
- Radix UI primitives (shadcn-style components)

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Build für Produktion:

```bash
npm run build
npm run preview
```

## Daten

Die Standortdaten stammen aus dem ursprünglichen Prototyp (`legacy/index.html`) und wurden nach `src/data/locations.json` extrahiert.

**Bezirkszuordnung:** Jeder Standort wurde anhand der offiziellen Bezirksgrenzen der Stadt Wien (OGD) einem Bezirk zugeordnet. Metadaten liegen in `src/data/bezirke.json`, Grenzen in `scripts/data/bezirksgrenzen.geojson`.

Zum erneuten Extrahieren aus dem Legacy-HTML:

```bash
npm run extract-data
npm run enrich-districts
```

`enrich-districts` lädt die Bezirksgrenzen bei Bedarf von [data.wien.gv.at](https://data.wien.gv.at) und schreibt `bezirk` (Nummer, Name, Postleitzahl) in jede Location.

## Umgebungsvariablen

Optional in `.env`:

```env
VITE_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

## Karten-Attribution

© [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors

## Manuelle Test-Checkliste

- [ ] Karte lädt und zeigt Marker-Cluster
- [ ] Suche filtert Standorte (inkl. Bezirk: `1160`, `Ottakring`)
- [ ] Kategorie-Chips filtern korrekt (OR-Semantik)
- [ ] Marker-Klick öffnet Detail mit Beschreibung (nicht nur Kategorien)
- [ ] Listen-Klick fliegt zur Karte
- [ ] Favoriten persistieren nach Reload
- [ ] Geolocation + Entfernungssortierung
- [ ] Mobile Bottom Sheet funktioniert
- [ ] Dark Mode umschaltbar
- [ ] URL-Parameter spiegeln Filter wider
