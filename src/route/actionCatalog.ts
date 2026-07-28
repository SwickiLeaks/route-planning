import type { SvgIconComponent } from '@mui/icons-material';
import FlightIcon from '@mui/icons-material/Flight';
import { colors } from '@/theme/tokens';
import type { WaypointActionType } from '@/route/routeBuilderTypes';

/**
 * The catalog of waypoint actions. This is the single source of truth for every
 * action the UI knows about — chips, markers, and the add-menu all read from
 * it. To add an action: extend WaypointActionType, then add a row here.
 */
export interface ActionDef {
  type: WaypointActionType;
  /** Full name for menus and the editor. */
  label: string;
  /** Compact code for map/chip badges. */
  short: string;
  /** Accent color (from the theme palette) that identifies the action. */
  color: string;
  Icon: SvgIconComponent;
}

export const ACTION_CATALOG: ActionDef[] = [
  { type: 'hover', label: 'Hover', short: 'HOV', color: colors.accent, Icon: FlightIcon },
];

const byType = new Map(ACTION_CATALOG.map((def) => [def.type, def]));

export const actionDef = (type: WaypointActionType): ActionDef =>
  byType.get(type) ?? ACTION_CATALOG[0];
