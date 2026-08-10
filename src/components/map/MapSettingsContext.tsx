import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface MapSettingsValue {
  /** Map dim overlay strength, 0 (off) … 1 (fully dark). */
  dim: number;
  setDim: (value: number) => void;
}

const MapSettingsContext = createContext<MapSettingsValue | null>(null);

// Holds user-adjustable map display settings (currently just the dim overlay).
// Shared so the Map controls panel and the on-map dimmer read the same value.
export const MapSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [dim, setDim] = useState(0);
  const value = useMemo<MapSettingsValue>(() => ({ dim, setDim }), [dim]);
  return <MapSettingsContext.Provider value={value}>{children}</MapSettingsContext.Provider>;
};

// Reads the map settings, throwing if used outside its provider.
export const useMapSettings = (): MapSettingsValue => {
  const ctx = useContext(MapSettingsContext);
  if (!ctx) throw new Error('useMapSettings must be used within MapSettingsProvider');
  return ctx;
};
