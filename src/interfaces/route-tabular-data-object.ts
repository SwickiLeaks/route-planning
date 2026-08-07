import { type RouteTabularColumn } from "./route-tabular-column";

export type RouteTabularColumnIdMap = {
  [Property in RouteTabularColumn["id"]]?: string;
};

export type RouteTabularColumnId = keyof RouteTabularColumnIdMap;

type IdType = {
  id: string;
};

export type RouteTabularDataObject = RouteTabularColumnIdMap & IdType;
