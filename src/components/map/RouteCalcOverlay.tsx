import { useEffect } from 'react';
import { useMap } from 'react-map-gl/maplibre';
import type { RouteCalculation } from '@/calc/types';
import type { BuilderRoute } from '@/route/routeBuilderTypes';
import { useRouteBuilder } from '@/route/RouteBuilderContext';
import WaypointMarker from '@/components/map/WaypointMarker';
import LegCallout from '@/components/map/LegCallout';

interface RouteCalcOverlayProps {
  route: BuilderRoute;
  calc: RouteCalculation;
  calculating?: boolean;
}

// Map overlay drawing a callout per leg and a marker per waypoint.
const RouteCalcOverlay = ({ route, calc, calculating = false }: RouteCalcOverlayProps) => {
  const { selectedWaypointId, selectWaypoint, placing } = useRouteBuilder();
  const { current: map } = useMap();
  const lastIndex = route.waypoints.length - 1;

  const selected = route.waypoints.find((w) => w.id === selectedWaypointId);
  const selLng = selected?.position.lng;
  const selLat = selected?.position.lat;

  useEffect(() => {
    if (placing || !map || selLng == null || selLat == null) return;
    map.easeTo({ center: [selLng, selLat], duration: 500 });
  }, [map, placing, selectedWaypointId, selLng, selLat]);

  return (
    <>
      {calc.legs.map((leg) => (
        <LegCallout key={`leg-${leg.index}`} leg={leg} calculating={calculating} />
      ))}

      {route.waypoints.map((waypoint, index) => (
        <WaypointMarker
          key={waypoint.id}
          waypoint={waypoint}
          index={index}
          remainingFuelLb={
            index === 0
              ? calc.totals.startFuelLb
              : calc.legs[index - 1]?.remainingFuelLb ?? calc.totals.startFuelLb
          }
          isEndpoint={index === 0 || index === lastIndex}
          selected={waypoint.id === selectedWaypointId}
          onSelect={() => selectWaypoint(waypoint.id)}
        />
      ))}
    </>
  );
};

export default RouteCalcOverlay;
