import type { ReactElement, ReactNode } from "react";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import MultipleStopIcon from "@mui/icons-material/MultipleStop";
import StorageIcon from "@mui/icons-material/Storage";
import WaypointCreatorPane from "@/components/builder/WaypointCreatorPane";
import RouteManagerPane from "@/components/builder/RouteManagerPane";
import { RouteTabularContainer } from "../builder/route-tabular/route-tabular-container";

export interface SidePanel {
  id: string;
  label: string;
  icon: ReactElement;
  content: ReactNode;
}

// Tool panels launched by the buttons on the right of the top route bar. The
// waypoint editor is not here — it opens contextually when a waypoint is selected.
export const SIDE_PANELS: SidePanel[] = [
  {
    id: "create",
    label: "Create",
    icon: <AddLocationAltIcon fontSize="small" />,
    content: <WaypointCreatorPane />,
  },
  {
    id: "routes",
    label: "Routes",
    icon: <MultipleStopIcon fontSize="small" />,
    content: <RouteManagerPane />,
  },
  {
    id: "route-tabular",
    label: "Tabular",
    icon: <StorageIcon fontSize="small" />,
    content: <RouteTabularContainer />,
  },
];
