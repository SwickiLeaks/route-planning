import type { RouteTabularColumn } from "./route-tabular-column";

export type RouteTabularColumnVisibility = {
  [Property in RouteTabularColumn["id"]]?: boolean;
};
