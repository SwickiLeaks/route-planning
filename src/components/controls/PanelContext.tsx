import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface PanelValue {
  /** Id of the open top-bar side panel, or null when none is open. */
  activePanel: string | null;
  /** Open a panel by id, or close it if it's already the open one. */
  togglePanel: (id: string) => void;
  /** Close whatever panel is open (no-op if none). */
  closePanel: () => void;
}

const PanelContext = createContext<PanelValue | null>(null);

// Tracks which top-bar side panel is open. Shared so the control bar and the map
// markers can keep an open panel and an expanded waypoint tooltip mutually
// exclusive — the two float over the same space and would otherwise collide.
export const PanelProvider = ({ children }: { children: ReactNode }) => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const value = useMemo<PanelValue>(
    () => ({
      activePanel,
      togglePanel: (id) => setActivePanel((cur) => (cur === id ? null : id)),
      closePanel: () => setActivePanel(null),
    }),
    [activePanel],
  );
  return <PanelContext.Provider value={value}>{children}</PanelContext.Provider>;
};

// Reads the side-panel state, throwing if used outside its provider.
export const usePanels = (): PanelValue => {
  const ctx = useContext(PanelContext);
  if (!ctx) throw new Error('usePanels must be used within PanelProvider');
  return ctx;
};
