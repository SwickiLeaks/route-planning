import { create } from "zustand";
import { type Route, type Waypoint } from "../types/proto";
import { KBNA, KCKV, KHOP, KXNX, M91 } from "../test-data/waypoints";
import { v4 } from "uuid";

export interface RouteState {
  currentRoute: Route;
  allSavedRoutes: Route[];
  availableWaypoints: Waypoint[];
}

export interface RouteActions {
  setCurrentRoute: (newRoute: Route) => void;
  setSavedRoutes: (savedRoutes: Route[]) => void;
}

export interface RouteStore extends RouteState, RouteActions {}

export const emptyRouteState: RouteState = {
  currentRoute: { id: v4(), name: "New Route", waypoints: [] },
  allSavedRoutes: [],
  availableWaypoints: [KBNA, KCKV, KHOP, KXNX, M91],
};

export const useRouteStore = create<RouteStore>()((set) => ({
  ...emptyRouteState,
  setCurrentRoute: (newRoute: Route) => {
    set({ currentRoute: { ...newRoute } });
  },
  setSavedRoutes: (savedRoutes: Route[]) =>
    set({ allSavedRoutes: [...savedRoutes] }),
}));
