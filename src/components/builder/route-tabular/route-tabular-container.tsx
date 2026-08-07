import React from "react";
import {
  RouteTabularView,
  type RouteTabularViewProps,
} from "./route-tabular-view";
import { useRouteBuilder } from "@/route/RouteBuilderContext";
import type { RouteTabularDataObject } from "@/interfaces/route-tabular-data-object";
import { DEFAULT_AIRCRAFT, type LegCalc } from "@/calc/types";
import { useRouteCalculation } from "@/calc/useRouteCalculation";
import type { BuilderWaypoint } from "@/route/routeBuilderTypes";
import {
  convertFuelLbsToGal,
  formatCourse,
  formatDisplayDistance,
  formatDisplayGal,
  formatDisplaySpeed,
  formatDisplayTime,
} from "@/calc/utils";

export function RouteTabularContainer(): React.JSX.Element {
  const { route, selectedWaypointId, selectWaypoint } = useRouteBuilder();
  const calculatedResults = useRouteCalculation(route);
  const newRows: RouteTabularViewProps["rows"] =
    calculatedResults.data?.legs.map((legCalc: LegCalc) => {
      const row: RouteTabularDataObject = {
        id: legCalc.to.id,
        code: legCalc.to.name,
        timeEnroute: formatDisplayTime(legCalc.legTimeMin),
        timeTotal: formatDisplayTime(legCalc.cumulativeTimeMin),
        fuelEnroute: formatDisplayGal(convertFuelLbsToGal(legCalc.legFuelLb)),
        fuelTotal: formatDisplayGal(
          convertFuelLbsToGal(legCalc.cumulativeFuelLb),
        ),
        distanceEnroute: formatDisplayDistance(legCalc.distanceNm),
        fuelRem: formatDisplayGal(convertFuelLbsToGal(legCalc.remainingFuelLb)),
        grndSpd: formatDisplaySpeed(legCalc.groundSpeedKt),
        trueCourse: formatCourse(legCalc.bearingDeg),
      };
      return row;
    }) ?? [];
  //Add first point data for visualization
  const firstWaypoint: BuilderWaypoint | undefined = route.waypoints[0];
  if (firstWaypoint) {
    newRows.unshift({
      id: firstWaypoint.id,
      code: firstWaypoint.name,
      timeEnroute: formatDisplayTime(0),
      timeTotal: formatDisplayTime(0),
      fuelEnroute: formatDisplayGal(0),
      fuelTotal: formatDisplayGal(0),
      distanceEnroute: formatDisplayDistance(0),
      fuelRem: formatDisplayGal(
        convertFuelLbsToGal(DEFAULT_AIRCRAFT.fuelCapacityLb),
      ),
      grndSpd: formatDisplaySpeed(0),
      trueCourse: "----",
    });
  }
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
      rows={newRows}
      selectedWaypointId={selectedWaypointId}
      setSelectedWaypointId={selectWaypoint}
      isCalculating={calculatedResults.isCalculating}
    />
  );
}
