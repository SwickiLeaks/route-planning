# How the map works

A plain-language guide to the map stack: what each library and data file does,
and why the map looks the way it does.

## The analogy

Think of it like a paper chart on a table:

- **MapLibre** is the printer — it draws pixels, but has no idea what a road is.
- **Protomaps** is the ink and the rulebook — the geographic data, plus rules
  like "highways are orange, 3px wide."
- **PMTiles** is the filing cabinet — one big file you can pull a single page
  from without opening the whole thing.
- **react-map-gl** is just a React-friendly handle on the printer.

None of them do each other's job, which is why all four are needed.

## The libraries

| Library | Job |
| --- | --- |
| `maplibre-gl` | Does all the drawing (WebGL). |
| `react-map-gl` | Lets you write `<Map>` / `<Layer>` in React instead of imperative calls. |
| `pmtiles` | Teaches MapLibre to read `.pmtiles` files. |
| `@protomaps/basemaps` | Generates the ~69 styling rules for roads, water, parks, labels, etc. |

## The data files

All live in `public/map/` and are served from local disk — **no network calls
at runtime**.

| File | What it is | Size | In git? |
| --- | --- | --- | --- |
| `basemap.pmtiles` | The region in full detail, zoom 0–14 | ~19 MB | No (gitignored) |
| `context.pmtiles` | Whole US, coarse, zoom 0–7 | ~18 MB | No (gitignored) |
| `terrain.pmtiles` | Elevation data for the region only | ~33 MB | No (gitignored) |
| `fonts/` | Label glyphs (MapLibre can't render text without these) | ~1 MB | Yes |

The three `.pmtiles` files are large, regenerable binaries, so they are
**gitignored** — a fresh clone does not have them (see [Setup](#setup)).
Sizes above are for the Middle Tennessee region; they vary by area.

## Why there's a detailed "box" surrounded by plain terrain

Because we only download a box. The full planet basemap is ~120 GB, so the
fetch script pulls out just the rectangle we need. That produces exactly what
you see on screen:

- **Inside the box** — full street detail *and* hillshade, because
  `terrain.pmtiles` only covers that region. Terrain is the most visually
  obvious difference, so the box edge shows up sharply.
- **Outside the box** — `context.pmtiles` takes over. It's real map data, just
  coarse (zoom 7 max) and label-free at high zoom, which reads as flat
  black/grey.

Without the context file, everything outside the box would be **empty black** —
nothing at all.

## The layer stack, bottom to top

```
routes + waypoints      ← app data (GeoJSON)
detail: roads, labels   ← only zoom 8+, only the region
hillshade               ← only zoom 8+, only the region  ← the terrain you see
context: whole US       ← always on, all zooms
background              ← flat color
```

The rule that makes it work: **detail layers are hidden below zoom 8.** Zoomed
out you see only context; zoom past 8 and the region's detail switches on over
the top. That handoff zoom lives in `src/map/region.ts` as `DETAIL_MIN_ZOOM`.

## How the pieces map to the code

| Concern | File |
| --- | --- |
| Style assembly (sources, layers, hillshade, context handoff) | `src/map/style.ts` |
| Region bounds + camera (generated — do not hand-edit) | `src/map/region.ts` |
| Route/waypoint → GeoJSON | `src/map/routes.ts` |
| The map component (`pmtiles://` protocol, WebGL check, error UI) | `src/components/MapView.tsx` |
| Route/waypoint layers | `src/components/RouteLayers.tsx` |

## Setup

Because the `.pmtiles` files are gitignored, a fresh clone must download them
once:

```bash
npm install
npm run map:fetch     # downloads the map tiles into public/map/ (needs internet)
npm run dev
```

`map:fetch` defaults to whatever region is committed in `src/map/region.ts`, so
data and config stay in sync. To switch regions:

```bash
REGION=grand-canyon npm run map:fetch   # los-angeles | grand-canyon | nyc | middle-tennessee | interlaken
```

This regenerates `src/map/region.ts` and the `public/map/*.pmtiles` files
together.

## Gotchas

- **Fresh clone shows an empty map.** The `.pmtiles` files aren't in git — run
  `npm run map:fetch`. The app now surfaces this with an on-screen message
  instead of failing silently.
- **"Failed to initialize WebGL" on a VM.** MapLibre renders through WebGL,
  which a GPU-less Linux VM often can't provide. Rendering happens client-side,
  so the fix is to view from a machine with graphics acceleration — e.g. run
  `npm run dev -- --host` on the VM and open it from your desktop browser.
- **The box edge is a data boundary, not a setting.** Widening it means
  re-extracting a larger bbox, and the file size grows roughly with area.
- **Everything is local.** No API keys, no tile server, works offline. The only
  cost is ~70 MB of map data on disk, which is why it's regenerable rather than
  committed.
