import type { SvgIconComponent } from '@mui/icons-material';
import FlightIcon from '@mui/icons-material/Flight';
import { colors } from '@/theme/tokens';
import type { WaypointActionType } from '@/route/routeBuilderTypes';

export interface ActionDef {
  type: WaypointActionType;
  label: string;
  short: string;
  color: string;
  Icon: SvgIconComponent;
}

export const ACTION_CATALOG: ActionDef[] = [
  { type: 'hover', label: 'Hover', short: 'HOV', color: colors.accent, Icon: FlightIcon },
];

const byType = new Map(ACTION_CATALOG.map((def) => [def.type, def]));

// Looks up an action definition by type, falling back to the first entry.
export const actionDef = (type: WaypointActionType): ActionDef =>
  byType.get(type) ?? ACTION_CATALOG[0];
