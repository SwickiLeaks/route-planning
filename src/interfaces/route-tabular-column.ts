export type Column<header, id> = {
  header: header;
  id: id;
};

export type PointCodeColumn = Column<"Code", "code">;
export type PointNameColumn = Column<"Name", "name">;

export type TimeRemainColumn = Column<"Time (remain)", "timeRem">;
export type TimeTotalColumn = Column<"Time (total)", "timeTotal">;
export type TimeEnrouteColumn = Column<"Time (enroute)", "timeEnroute">;

export type FuelRemainColumn = Column<"Fuel (remain)", "fuelRem">;
export type FuelTotalColumn = Column<"Fuel (total)", "fuelTotal">;
export type FuelEnrouteColumn = Column<"Fuel (enroute)", "fuelEnroute">;

export type DistanceRemainColumn = Column<"Distance (remain)", "distanceRem">;
export type DistanceTotalColumn = Column<"Distance (total)", "distanceTotal">;
export type DistanceEnrouteColumn = Column<
  "Distance (enroute)",
  "distanceEnroute"
>;

export type GroundSpeedColumn = Column<"Ground Speed", "grndSpd">;

export type TrueCourseColumn = Column<"True Course", "trueCourse">;

export type RouteTabularColumn =
  | PointCodeColumn
  | PointNameColumn
  | TimeRemainColumn
  | TimeTotalColumn
  | TimeEnrouteColumn
  | FuelRemainColumn
  | FuelTotalColumn
  | FuelEnrouteColumn
  | DistanceRemainColumn
  | DistanceTotalColumn
  | DistanceEnrouteColumn
  | GroundSpeedColumn
  | TrueCourseColumn;
