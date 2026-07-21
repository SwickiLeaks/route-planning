# Helicopter Tours

A React + TypeScript app (Vite) for showing mission routes on a 2D map.

Minimal starter for now — the map library and data layer come later.

## Getting started

```bash
npm install
npm run dev
```

The app runs on http://localhost:3000 and shows the main dashboard.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build
- `npm run lint` — type-check only (`tsc --noEmit`)

## Structure

```
src/
  api/
    client.ts         # service client — placeholder
  components/
    Dashboard.tsx     # dashboard
  hooks/
    index.ts          # data hooks — placeholder
  types/
    proto/
      index.ts        # proto-derived interfaces — placeholder
  App.tsx
  main.tsx
  index.css
```

The `@/` alias points at `src/` (configured in both `tsconfig.app.json` and `vite.config.ts`).

## Next steps

- Read the `.proto` files from your services and fill in `src/types/proto`.
- Add per-service hooks under `src/hooks`.
- Pick a 2D map library and render routes in the dashboard.
```
