import type { ReactElement, ReactNode } from 'react';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import RouteIcon from '@mui/icons-material/Route';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import RouteManagerPane from '@/components/builder/RouteManagerPane';
import RouteBuilderPanel from '@/components/builder/RouteBuilderPanel';
import WaypointCreatorPane from '@/components/builder/WaypointCreatorPane';

/** Where a control's pane appears when its tile is selected. */
export type PaneDock = 'top' | 'left';

export interface TopPane {
  id: string;
  label: string;
  icon: ReactElement;
  dock: PaneDock;
  content: ReactNode;
}

/**
 * The controls in the top tile bar. Clicking a tile opens its pane in the dock
 * it declares. To add a control: add an entry here — the tile and toggle
 * behavior come free.
 */
export const TOP_PANES: TopPane[] = [
  {
    id: 'routes',
    label: 'Route Manager',
    icon: <FormatListBulletedIcon fontSize="small" />,
    dock: 'top',
    content: <RouteManagerPane />,
  },
  {
    id: 'builder',
    label: 'Route Builder',
    icon: <RouteIcon fontSize="small" />,
    dock: 'top',
    content: <RouteBuilderPanel />,
  },
  {
    id: 'create',
    label: 'Waypoint Creator',
    icon: <AddLocationAltIcon fontSize="small" />,
    dock: 'top',
    content: <WaypointCreatorPane />,
  },
];
