import type { ReactElement, ReactNode } from 'react';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import WaypointEditor from '@/components/builder/WaypointEditor';
import WaypointCreatorPane from '@/components/builder/WaypointCreatorPane';
import RouteManagerPane from '@/components/builder/RouteManagerPane';

export interface SidePanel {
  id: string;
  label: string;
  icon: ReactElement;
  content: ReactNode;
}

// Panels launched by the buttons on the right of the top route bar.
export const SIDE_PANELS: SidePanel[] = [
  {
    id: 'edit',
    label: 'Edit',
    icon: <EditLocationAltIcon fontSize="small" />,
    content: <WaypointEditor />,
  },
  {
    id: 'create',
    label: 'Create',
    icon: <AddLocationAltIcon fontSize="small" />,
    content: <WaypointCreatorPane />,
  },
  {
    id: 'routes',
    label: 'Routes',
    icon: <FormatListBulletedIcon fontSize="small" />,
    content: <RouteManagerPane />,
  },
];
