import type { RouteTabularColumnVisibility } from "@/interfaces/route-tabular-column-visibility";
import type {
  MRT_DensityState,
  MRT_PaginationState,
} from "material-react-table";
import React, { createContext, useContext, useState } from "react";

interface RouteTabularContextType {
  density: MRT_DensityState;
  setDensity: React.Dispatch<React.SetStateAction<MRT_DensityState>>;
  columnVisibility: RouteTabularColumnVisibility;
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<RouteTabularColumnVisibility>
  >;
  pagination: MRT_PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<MRT_PaginationState>>;
  columnOrder: string[];
  setColumnOrder: React.Dispatch<React.SetStateAction<string[]>>;
}

const RouteTabularContext = createContext<RouteTabularContextType | undefined>(
  undefined,
);

export const RouteTabularProvider = (props: { children: React.ReactNode }) => {
  const [density, setDensity] = useState<MRT_DensityState>("comfortable");
  const [columnVisibility, setColumnVisibility] =
    useState<RouteTabularColumnVisibility>({
      distanceRem: false,
      fuelEnroute: false,
      fuelTotal: false,
      name: false,
      timeRem: false,
    });
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  return (
    <RouteTabularContext.Provider
      value={{
        density: density,
        setDensity,
        columnVisibility: columnVisibility,
        setColumnVisibility,
        pagination: pagination,
        setPagination,
        columnOrder: columnOrder,
        setColumnOrder,
      }}
    >
      {props.children}
    </RouteTabularContext.Provider>
  );
};

export const useRouteTabular = () => {
  const context = useContext(RouteTabularContext);
  if (!context) {
    throw new Error(
      "useRouteTabular must be used within a useRouteTabular provider",
    );
  }
  return context;
};
