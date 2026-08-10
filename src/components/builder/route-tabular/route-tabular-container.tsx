import React from "react";
import { RouteTabularView } from "./route-tabular-view";
import { useRouteBuilder } from "@/route/RouteBuilderContext";
import { useRouteCalc } from "@/route/RouteCalcContext";
import { CalcPointAttribute } from "@/api/msnsvr/missionClient";
import type { RouteTabularDataObject } from "@/interfaces/route-tabular-data-object";
import { PENDING } from "@/components/shared/hudStyle";

export function RouteTabularContainer(): React.JSX.Element {
  const { route, selectedWaypointId, selectWaypoint } = useRouteBuilder();
  const { value } = useRouteCalc();

  // Each calculated point carries its cumulative StateRouteTime/StateRouteDistance,
  // which is what the enroute/total columns show. The remaining columns stay blank
  // until their data sources are hooked up.
  const rows: RouteTabularDataObject[] = route.waypoints.map((wp) => ({
    id: wp.id,
    code: wp.name,
    timeEnroute: value(wp.id, CalcPointAttribute.LegTime) ?? PENDING,
    timeTotal: value(wp.id, CalcPointAttribute.RouteTime) ?? PENDING,
    distanceEnroute: value(wp.id, CalcPointAttribute.RouteDistance) ?? PENDING,
    fuelEnroute: value(wp.id, CalcPointAttribute.LegFuel) ?? PENDING,
    fuelTotal: PENDING,
    fuelRem: PENDING,
    grndSpd: PENDING,
    trueCourse: PENDING,
  }));

  return (
    <RouteTabularView
      columns={[
        { header: "Code", id: "code" },
        { header: "Time (enroute)", id: "timeEnroute" },
        { header: "Time (total)", id: "timeTotal" },
        { header: "Distance (enroute)", id: "distanceEnroute" },
        { header: "Fuel (enroute)", id: "fuelEnroute" },
        { header: "Fuel (total)", id: "fuelTotal" },
        { header: "Fuel (remain)", id: "fuelRem" },
        { header: "Ground Speed", id: "grndSpd" },
        { header: "True Course", id: "trueCourse" },
      ]}
      rows={rows}
      selectedWaypointId={selectedWaypointId}
      setSelectedWaypointId={selectWaypoint}
      isCalculating={false}
    />
  );
}
