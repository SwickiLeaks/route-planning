import { useEffect, useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_DensityState,
  type MRT_Icons,
  type MRT_PaginationState,
  type MRT_Updater,
} from "material-react-table";
import type { RouteTabularColumn } from "@/interfaces/route-tabular-column";
import type {
  RouteTabularColumnId,
  RouteTabularDataObject,
} from "@/interfaces/route-tabular-data-object";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import { colors } from "@/theme/tokens";
import type { RouteTabularColumnVisibility } from "@/interfaces/route-tabular-column-visibility";
import { useRouteTabular } from "@/route/RouteTabularContext";

export interface RouteTabularViewProps {
  columns: RouteTabularColumn[];
  rows: RouteTabularDataObject[];
  selectedWaypointId: string | null;
  setSelectedWaypointId: (newWaypointId: string) => void;
  isCalculating: boolean;
}

export function RouteTabularView(
  props: RouteTabularViewProps,
): React.JSX.Element {
  const routeTabularContext = useRouteTabular();

  useEffect(() => {
    if (props.selectedWaypointId !== null) {
      //find the index
      const indexOfSelectedWaypoint: number = props.rows.findIndex(
        (routeData: RouteTabularDataObject) =>
          routeData.id === props.selectedWaypointId,
      );
      if (indexOfSelectedWaypoint > -1) {
        const indexOfSelectedWaypoint = props.rows.findIndex(
          (row) => row.id === props.selectedWaypointId,
        );
        const indexOfDesiredPage = Math.floor(
          indexOfSelectedWaypoint / routeTabularContext.pagination.pageSize,
        );

        routeTabularContext.setPagination((prevPagination) => {
          const newPagination: MRT_PaginationState = {
            ...prevPagination,
            pageIndex: indexOfDesiredPage,
          };
          routeTabularContext.setPagination(newPagination);
          return newPagination;
        });
      }
    }
  }, [props.selectedWaypointId]);

  const mrtColumns: MRT_ColumnDef<RouteTabularDataObject>[] = useMemo(() => {
    return props.columns.map((routeTabColumn) => {
      return {
        header: routeTabColumn.header,
        accessorKey: routeTabColumn.id,
      };
    });
  }, [props.columns]);

  const customIcons: Partial<MRT_Icons> = {
    DragHandleIcon: (props: object) => (
      <DragIndicatorIcon {...props} color="primary" />
    ),
    ViewColumnIcon: (props: object) => <ViewWeekIcon {...props} />,
  };

  const handlePaginationChange = (
    updater: MRT_Updater<MRT_PaginationState>,
  ) => {
    routeTabularContext.setPagination((prev) => {
      const nextPagination: MRT_PaginationState =
        typeof updater === "function" ? updater(prev) : updater;
      routeTabularContext.setPagination(nextPagination);
      return nextPagination;
    });
  };

  const handleDensityChange = (updater: MRT_Updater<MRT_DensityState>) => {
    routeTabularContext.setDensity((prev) => {
      const nextDensity: MRT_DensityState =
        typeof updater === "function" ? updater(prev) : updater;
      routeTabularContext.setDensity(nextDensity);
      return nextDensity;
    });
  };

  const handleColumnVisibilityChange = (
    updater: MRT_Updater<RouteTabularColumnVisibility>,
  ) => {
    routeTabularContext.setColumnVisibility((prev) => {
      const nextVisibility: RouteTabularColumnVisibility =
        typeof updater === "function" ? updater(prev) : updater;
      routeTabularContext.setColumnVisibility(nextVisibility);
      return nextVisibility;
    });
  };

  const handleColumnOrderChange = (updater: MRT_Updater<string[]>) => {
    routeTabularContext.setColumnOrder((prev) => {
      const nextVisibility: string[] =
        typeof updater === "function" ? updater(prev) : updater;
      routeTabularContext.setColumnOrder(
        nextVisibility as RouteTabularColumnId[],
      );
      return nextVisibility;
    });
  };

  const table = useMaterialReactTable({
    columns: mrtColumns,
    getRowId: (row) => row.id,
    enableColumnOrdering: true,
    enableColumnActions: false,
    enableSorting: false,
    enableFullScreenToggle: false,
    enableColumnFilters: false,
    data: props.rows.slice(
      routeTabularContext.pagination.pageIndex *
        routeTabularContext.pagination.pageSize,
      (routeTabularContext.pagination.pageIndex + 1) *
        routeTabularContext.pagination.pageSize,
    ),
    initialState: {
      columnVisibility: routeTabularContext.columnVisibility,
      density: routeTabularContext.density,
    },
    icons: customIcons,
    muiPaginationProps: {
      color: "primary",
      shape: "rounded",
      variant: "outlined",
      rowsPerPageOptions: [3, 5, 10, 15],
    },
    onPaginationChange: handlePaginationChange,
    manualPagination: true,
    rowCount: props.rows.length,
    state: {
      pagination: routeTabularContext.pagination,
      density: routeTabularContext.density,
      columnVisibility: routeTabularContext.columnVisibility,
      columnOrder: routeTabularContext.columnOrder,
      isLoading: props.isCalculating,
    },
    paginationDisplayMode: "pages",
    onDensityChange: handleDensityChange,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onColumnOrderChange: handleColumnOrderChange,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        if (props.selectedWaypointId === row.original.id) {
          props.setSelectedWaypointId("");
        } else {
          props.setSelectedWaypointId(row.original.id);
        }
      },
      sx: {
        // Highlight the row that contains the selected waypoint
        backgroundColor:
          row.original.id === props.selectedWaypointId
            ? `${colors.gold}26`
            : "inherit",
      },
    }),
  });

  return <MaterialReactTable table={table} />;
}
