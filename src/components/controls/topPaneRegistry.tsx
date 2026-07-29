import type { ReactElement, ReactNode } from 'react';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import RouteIcon from '@mui/icons-material/Route';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import RouteManagerPane from '@/components/builder/RouteManagerPane';
import RouteComposer from '@/components/builder/RouteComposer';
import WaypointCreatorPane from '@/components/builder/WaypointCreatorPane';

export type PaneDock = 'top' | 'left';

export interface TopPane {
  id: string;
  label: string;
  icon: ReactElement;
  dock: PaneDock;
  content: ReactNode;
}

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
    content: <RouteComposer />,
  },
  {
    id: 'create',
    label: 'Waypoint Creator',
    icon: <AddLocationAltIcon fontSize="small" />,
    dock: 'top',
    content: <WaypointCreatorPane />,
  },
];
