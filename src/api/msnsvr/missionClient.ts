import {
  MsnSvr,
  type AttributeInfoList,
  type AttributeRequestSchema,
  type CallIdSchema,
  type ParentIdSchema,
} from "@/api/gen/MsnSvr_pb";
import { transport as defaultTransport } from "@/api/transport";
import type { MessageInitShape } from "@bufbuild/protobuf";
import { createClient, type Client, type Transport } from "@connectrpc/connect";

// Model-type codes for IdType/ChildId `type` (ModelType ordinals in the service).
export const ModelType = {
  Unknown: 0,
  Mission: 1,
  Route: 2,
  Segment: 3,
  RoutePoint: 4,
  Point: 5,
  CalculatedPoint: 6,
  Vehicle: 7,
  EventCollection: 8,
  Event: 9,
  DisconnectedCollection: 10,
  PointGroup: 11,
  TrackPoint: 12,
  PointGroupCollection: 13,
  TrackPointCollection: 14,
  MissionList: 15,
  CalculatedPointCollection: 16,
} as const;

// TransactionRequest.request_type codes (TransactionAction ordinals).
export const TransactionAction = {
  MetaData: 0,
  Start: 1,
  Commit: 2,
  Rollback: 3,
} as const;

// SegmentCalcState values. "Calculating" is the only one the sample confirms;
// confirm the rest against the service's CalculationStatus enum.
export const CalculationStatus = {
  Calculating: "Calculating",
  Calculated: "Calculated",
} as const;

export interface WaitOptions {
  /** How often to re-check the status. */
  intervalMs?: number;
  /** Give up (throw) after this long. */
  timeoutMs?: number;
  /** Treat a status as finished. Defaults to "settled and not Calculating". */
  isComplete?: (status: string) => boolean;
  /** Abort the wait early. */
  signal?: AbortSignal;
}

// Known point attributes: the `id` and CLR `type` the server expects.
export const PointAttribute = {
  Altitude: { id: "PlanAltitudeValue", type: "MP.Core.Weather.InputAltitude" },
  Speed: { id: "AirspeedValue", type: "MP.Vehicle.InputSpeed" },
  Coordinate: { id: "Coordinate", type: "MP.Core.Navigation.Coordinate" },
} as const;

// Attribute-id prefix the service uses for PropertyInfo-backed attributes.
const PROPERTY_PREFIX = "PropertyInfo";

// Hover (RotaryWingDelay) attributes. PointType lives on the route point; the
// dwell Duration and Height live on the hover event the service creates.
export const HoverAttribute = {
  PointType: {
    id: `${PROPERTY_PREFIX}PointType`,
    type: "MP.MissionEditor.PointUsageType",
  },
  Duration: {
    id: `${PROPERTY_PREFIX}Time`,
    type: "MP.Core.Units.TimeDelta",
  },
  Height: { id: "HoverHeightEvent", type: "MP.Core.Weather.AltitudeAGL" },
} as const;

// PointType values (MP.MissionEditor.PointUsageType).
export const PointUsageType = {
  Hover: "RotaryWingDelay",
  Turn: "Turn",
} as const;

// Attributes read off a point's event to inspect an existing (default) hover.
export const EventAttribute = {
  CommandName: "CmdName", // e.g. "…;HTO" — HTO marks a hover event
  HoverHeight: "HoverHeightEvent", // Length
  HoverDuration: "HoverManualEventTime", // TimeDelta
} as const;

// CmdName value that identifies a hover event.
export const HoverCommandName = "HTO";

// Attributes read from a point's calculated result. Route* / Segment* attributes
// are cumulative, so the final point in the route carries the route totals.
export const CalcPointAttribute = {
  LegTime: "StateLegTime", // elapsed time from the beginning of the leg
  LegDist: "StateLegDist", // cumulative distance from the beginning of the leg
  LegFuel: "StateLegFuel", // fuel consumed on this leg
  RouteTime: "StateRouteTime", // cumulative route time (total on the last point)
  RouteDistance: "StateRouteDistance", // cumulative route distance (total)
  SegmentFuel: "StateSegmentFuel", // cumulative fuel consumed (total)
} as const;

const CLIENT_ID = "demo";
const PROTOCOL_VERSION = "1.0.0.0";
const DEFAULT_TIMEOUT_MS = 5000;

// The CLR assembly an attribute type belongs to, keyed by its namespace prefix.
const assemblyNameFor = (attributeType: string): string => {
  if (attributeType.startsWith("MP.Core."))
    return "MP.Core4, Version=4.0.0.0, Culture=neutral, PublicKeyToken=null;";
  if (attributeType.startsWith("System."))
    return "netstandard, Version=2.0.0.0, Culture=neutral, PublicKeyToken=cc7b13ffcd2ddd51;";
  if (attributeType.startsWith("MP.Vehicle."))
    return "MP.Vehicle.Interfaces4, Version=4.0.0.0, Culture=neutral, PublicKeyToken=null;";
  if (attributeType.startsWith("MP.Mission.Data."))
    return "MP.Mission.Data.Core7, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null;";
  if (attributeType.startsWith("MP.Geometry."))
    return "MP.Geometry3, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null;";
  if (attributeType.startsWith("MP.MissionEditor"))
    return "MP.MissionEditor7, Version=2.0.0.0, Culture=neutral, PublicKeyToken=null;";
  return "";
};

// TODO: the reference client runs values through a CrossPlatformSerializer
// before sending. Until that format is confirmed, pass the raw string through.
const serializeValue = (value: string): string => value;

// SegmentCalcState comes back as "<something>;<CalculationState>" (or ""). The
// state after the last semicolon is what tells us whether it finished.
export const parseCalcState = (raw: string): string => {
  const idx = raw.lastIndexOf(";");
  return (idx >= 0 ? raw.slice(idx + 1) : raw).trim();
};

// A settled, successful state — "Calculated", "CalculatedWithAlerts", … — but
// not "NotCalculated" (starts with "Not") or an empty/in-progress value.
export const isCalculatedState = (raw: string): boolean =>
  parseCalcState(raw).startsWith("Calculated");

type CallIdInit = MessageInitShape<typeof CallIdSchema>;
type ParentIdInit = MessageInitShape<typeof ParentIdSchema>;
type AttributeRequestInit = MessageInitShape<typeof AttributeRequestSchema>;

// Imperative MsnSvr client that mirrors the reference MsnSvrOuterClass flow:
// build a Mission → Route → Segment → RoutePoint tree inside transactions.
export class MissionClient {
  private readonly client: Client<typeof MsnSvr>;
  private readonly timeoutMs: number;
  private transactionId = "";
  private activeMissionId = "";
  currentMissionId = "";
  currentRouteId = "";
  currentSegmentId = "";

  constructor(
    transport: Transport = defaultTransport,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  ) {
    this.client = createClient(MsnSvr, transport);
    this.timeoutMs = timeoutMs;
  }

  // Connectivity check; returns the server's reported State.
  async handshake(appId = "demo"): Promise<string> {
    const res = await this.client.handshake({ id: appId });
    return res.state;
  }

  // The caller envelope carried on every request; context tags the call.
  private callId(context = ""): CallIdInit {
    return {
      version: PROTOCOL_VERSION,
      clientId: CLIENT_ID,
      transactionId: this.transactionId,
      context,
    };
  }

  // Opens a transaction and adopts the server-issued transaction id.
  async startTransaction(
    missionId: string,
    description: string,
  ): Promise<void> {
    // A fresh (non-nested) transaction must never carry a stale id — e.g. one a
    // calculation left behind — or the server rejects it. Clear before starting.
    this.transactionId = "";
    const res = await this.client.transactionData({
      caller: this.callId(),
      missionId,
      name: description,
      requestType: TransactionAction.Start,
      timeoutMill: this.timeoutMs,
    });
    this.activeMissionId = missionId;
    this.transactionId = res.caller?.transactionId ?? "";
  }

  // Closes the active transaction and clears the transaction id.
  async endTransaction(): Promise<void> {
    await this.client.transactionData({
      caller: this.callId(),
      missionId: this.activeMissionId,
      name: "",
      requestType: TransactionAction.Commit,
      timeoutMill: this.timeoutMs,
    });
    this.activeMissionId = "";
    this.transactionId = "";
  }

  // Creates the mission at the tree root; returns its id.
  async addMission(): Promise<string> {
    await this.startTransaction("", "Add mission");
    try {
      const res = await this.client.addChild({
        client: this.callId(),
        parent: this.parentIdForMissions(),
        child: { type: ModelType.Mission, id: "", index: 0 },
      });
      this.currentMissionId = res.id;
      return this.currentMissionId;
    } finally {
      await this.endTransaction();
    }
  }

  // Creates a route under the mission and resolves its default segment id.
  async addRoute(missionId: string): Promise<string> {
    await this.startTransaction(missionId, "Add route");
    try {
      const res = await this.client.addChild({
        client: this.callId(),
        parent: this.missionAsParentId(missionId),
        child: { type: ModelType.Route, id: "", index: 0 },
      });
      this.currentRouteId = res.id;
    } finally {
      await this.endTransaction();
    }
    await this.getSegmentId(this.currentMissionId, this.currentRouteId);
    return this.currentRouteId;
  }

  // Reads (and caches) the route's first segment id.
  async getSegmentId(missionId: string, routeId: string): Promise<string> {
    const res = await this.client.getChildrenInfo({
      client: this.callId(),
      parent: this.routeAsParentId(missionId, routeId),
      child: { type: ModelType.Segment },
    });
    const first = res.objects[0];
    if (first) this.currentSegmentId = first.id;
    return this.currentSegmentId;
  }

  // Appends a point to the current route (after the existing points).
  async addPointToCurrentRoute(): Promise<string> {
    const res = await this.client.getChildrenInfo({
      client: this.callId(),
      parent: this.segmentAsParentId(),
      child: { type: ModelType.RoutePoint },
    });
    return this.insertPointToCurrentRoute(res.objects.length);
  }

  // Inserts a route point at `index`; returns the new point id.
  async insertPointToCurrentRoute(index: number): Promise<string> {
    await this.startTransaction(this.currentMissionId, "Add route point");
    try {
      const res = await this.client.addChild({
        client: this.callId(),
        parent: this.segmentAsParentId(),
        child: { type: ModelType.RoutePoint, id: "", index },
      });
      return res.id;
    } finally {
      await this.endTransaction();
    }
  }

  // Sets one attribute on a route point, inside a transaction.
  async setPointAttribute(
    pointId: string,
    attributeId: string,
    attributeType: string,
    attributeValue: string | null,
  ): Promise<void> {
    await this.startTransaction(
      this.currentMissionId,
      `Set point ${attributeId}`,
    );
    try {
      console.log(
        "Attribute Request: ",
        this.attributeRequest(
          this.pointId(pointId),
          attributeId,
          attributeType,
          attributeValue,
        ),
      );
      await this.client.setAttributes(
        this.attributeRequest(
          this.pointId(pointId),
          attributeId,
          attributeType,
          attributeValue,
        ),
      );
    } finally {
      await this.endTransaction();
    }
  }

  // e.g. "500 A" for AGL, "5000 M" for MSL.
  setPointAltitude(pointId: string, altitude: string): Promise<void> {
    return this.setPointAttribute(
      pointId,
      PointAttribute.Altitude.id,
      PointAttribute.Altitude.type,
      altitude,
    );
  }

  // e.g. "100 T" for true airspeed, "110 C" for calibrated.
  setPointSpeed(pointId: string, speed: string): Promise<void> {
    return this.setPointAttribute(
      pointId,
      PointAttribute.Speed.id,
      PointAttribute.Speed.type,
      speed,
    );
  }

  // e.g. "N 33 10.00/W 95 30.00".
  setPointCoordinate(pointId: string, coordinate: string): Promise<void> {
    return this.setPointAttribute(
      pointId,
      PointAttribute.Coordinate.id,
      PointAttribute.Coordinate.type,
      coordinate,
    );
  }

  // Sets one attribute on a point's event, inside a transaction.
  async setEventAttribute(
    pointId: string,
    eventId: string,
    attributeId: string,
    attributeType: string,
    attributeValue: string | null,
  ): Promise<void> {
    await this.startTransaction(
      this.currentMissionId,
      `Set event ${attributeId}`,
    );
    try {
      await this.client.setAttributes(
        this.attributeRequest(
          this.eventId(pointId, eventId),
          attributeId,
          attributeType,
          attributeValue,
        ),
      );
    } finally {
      await this.endTransaction();
    }
  }

  // Marks a route point as a hover; the service then adds a hover event to it.
  setPointTypeToHover(pointId: string): Promise<void> {
    return this.setPointAttribute(
      pointId,
      HoverAttribute.PointType.id,
      HoverAttribute.PointType.type,
      PointUsageType.Hover,
    );
  }

  // Reverts a hover point back to a normal turn point.
  setPointTypeToNormalTurn(pointId: string): Promise<void> {
    return this.setPointAttribute(
      pointId,
      HoverAttribute.PointType.id,
      HoverAttribute.PointType.type,
      PointUsageType.Turn,
    );
  }

  // Hover dwell time on the point's event, e.g. "00+05+00" for 5 minutes.
  setHoverDuration(
    pointId: string,
    eventId: string,
    duration: string,
  ): Promise<void> {
    return this.setEventAttribute(
      pointId,
      eventId,
      HoverAttribute.Duration.id,
      HoverAttribute.Duration.type,
      duration,
    );
  }

  // Hover height AGL on the point's event, e.g. "50A" for 50 feet.
  setHoverHeight(
    pointId: string,
    eventId: string,
    heightAgl: string,
  ): Promise<void> {
    return this.setEventAttribute(
      pointId,
      eventId,
      HoverAttribute.Height.id,
      HoverAttribute.Height.type,
      heightAgl,
    );
  }

  // Applies a hover to a route point: sets its type, then writes the duration and
  // height onto the hover event the service creates in response.
  async setPointHover(
    pointId: string,
    duration: string,
    heightAgl: string,
  ): Promise<void> {
    await this.setPointTypeToHover(pointId);
    const eventId = await this.getEventId(pointId);
    if (!eventId) throw new Error(`No hover event created for point ${pointId}`);
    await this.setHoverDuration(pointId, eventId, duration);
    await this.setHoverHeight(pointId, eventId, heightAgl);
  }

  // Sets only the dwell time on a point's existing hover event.
  async setPointHoverDuration(pointId: string, duration: string): Promise<void> {
    const eventId = await this.getEventId(pointId);
    if (!eventId) throw new Error(`No hover event on point ${pointId}`);
    await this.setHoverDuration(pointId, eventId, duration);
  }

  // Sets only the height on a point's existing hover event.
  async setPointHoverHeight(pointId: string, heightAgl: string): Promise<void> {
    const eventId = await this.getEventId(pointId);
    if (!eventId) throw new Error(`No hover event on point ${pointId}`);
    await this.setHoverHeight(pointId, eventId, heightAgl);
  }

  // Convenience bootstrap: create the demo's single mission and route.
  async createMissionAndRoute(): Promise<{
    missionId: string;
    routeId: string;
  }> {
    const missionId = await this.addMission();
    const routeId = await this.addRoute(missionId);
    return { missionId, routeId };
  }

  // Triggers a route calculation unless one is already running. The transaction
  // stays open through the calculation; calculateAndWait commits it once settled.
  async beginCalculation(): Promise<void> {
    const status = await this.getSegmentCalculationState();
    console.log("Beging Calculation Status: ", status);
    if (parseCalcState(status) === "Calculating") return;
    // Empty description on purpose — a named transaction becomes undoable, and
    // calculations cannot be undone.
    await this.startTransaction(this.currentMissionId, "");
    try {
      await this.client.doAction({
        client: this.callId("Calculate"),
        parent: this.missionAsParentId(this.currentMissionId),
      });
    } catch (e) {
      // Submission failed — close the transaction so it can't block later work.
      await this.endCalculationTransaction();
      throw e;
    }
  }

  // Commits the open calculation transaction so a later mutation for the same
  // mission isn't rejected with "a transaction already exists". Tolerates the
  // server having already closed it.
  private async endCalculationTransaction(): Promise<void> {
    if (!this.activeMissionId) return;
    try {
      await this.endTransaction();
    } catch (e) {
      console.error("[msnsvr] failed to end calculation transaction", e);
      this.transactionId = "";
      this.activeMissionId = "";
    }
  }

  getSegmentCalculationState(): Promise<string> {
    return this.getSegmentAttribute("SegmentCalcState");
  }

  // Polls SegmentCalcState until it settles; resolves with the final status.
  // Throws on timeout or abort.
  async waitForCalculation(options: WaitOptions = {}): Promise<string> {
    const { intervalMs = 500, timeoutMs = 30_000, signal } = options;
    const isComplete = options.isComplete ?? isCalculatedState;
    const startedAt = Date.now();

    for (;;) {
      if (signal?.aborted)
        throw signal.reason ?? new Error("Calculation wait aborted");
      const status = await this.getSegmentCalculationState();
      console.log("Calculate And Wait Status: ", status);
      if (isComplete(status)) return status;
      if (Date.now() - startedAt > timeoutMs) {
        throw new Error(
          `Calculation timed out after ${timeoutMs}ms (last status: "${status}")`,
        );
      }
      await delay(intervalMs, signal);
    }
  }

  // Starts a calculation and resolves once it finishes (ready for calc points).
  async calculateAndWait(options?: WaitOptions): Promise<string> {
    await this.beginCalculation();
    try {
      return await this.waitForCalculation(options);
    } finally {
      // Close the calculation transaction before returning so the next add can
      // open its own transaction for this mission.
      await this.endCalculationTransaction();
    }
  }

  // Reads a single attribute value from a route point.
  async getPointAttribute(
    pointId: string,
    attributeId: string,
  ): Promise<string> {
    const res = await this.client.getAttributes(
      this.attributeRequest(this.pointId(pointId), attributeId, "", null),
    );
    return readAttribute(res, attributeId);
  }

  async getCalcPointAttribute(
    pointId: string,
    calcPointId: string,
    attributeId: string,
  ): Promise<string> {
    const res = await this.client.getAttributes(
      this.attributeRequest(
        this.calculatedPointId(pointId, calcPointId),
        attributeId,
        "",
        null,
      ),
    );
    return readAttribute(res, attributeId);
  }

  async getEventAttribute(
    pointId: string,
    eventId: string,
    attributeId: string,
  ): Promise<string> {
    const res = await this.client.getAttributes(
      this.attributeRequest(
        this.eventId(pointId, eventId),
        attributeId,
        "",
        null,
      ),
    );
    return readAttribute(res, attributeId);
  }

  async getSegmentAttribute(attributeId: string): Promise<string> {
    const res = await this.client.getAttributes(
      this.attributeRequest(this.segmentAsParentId(), attributeId, "", null),
    );
    return readAttribute(res, attributeId);
  }

  async getRouteAttribute(attributeId: string): Promise<string> {
    const res = await this.client.getAttributes(
      this.attributeRequest(
        this.routeAsParentId(this.currentMissionId, this.currentRouteId),
        attributeId,
        "",
        "",
      ),
    );
    return readAttribute(res, attributeId);
  }

  getPointCoordinate(pointId: string): Promise<string> {
    return this.getPointAttribute(pointId, PointAttribute.Coordinate.id);
  }

  // The point's planned (default) altitude value, e.g. "1500 A".
  getPointPlannedAltitude(pointId: string): Promise<string> {
    return this.getPointAttribute(pointId, PointAttribute.Altitude.id);
  }

  // The point's usage type, e.g. "…;RotaryWingDelay" for a hover, "…;Turn" for a
  // normal point.
  getPointType(pointId: string): Promise<string> {
    return this.getPointAttribute(pointId, HoverAttribute.PointType.id);
  }

  // Reads the point's default hover from its event, if any. Returns null when the
  // point has no event or its event isn't a hover (CmdName ≠ "HTO"). The height
  // and duration come back raw (Length / TimeDelta) for the caller to parse.
  async getPointHover(
    pointId: string,
  ): Promise<{ height: string; duration: string } | null> {
    const eventId = await this.getEventId(pointId);
    if (!eventId) return null;
    const command = await this.getEventAttribute(
      pointId,
      eventId,
      EventAttribute.CommandName,
    );
    if (parseCalcState(command) !== HoverCommandName) return null;
    const [height, duration] = await Promise.all([
      this.getEventAttribute(pointId, eventId, EventAttribute.HoverHeight),
      this.getEventAttribute(pointId, eventId, EventAttribute.HoverDuration),
    ]);
    return { height, duration };
  }

  // The last calculated point (which holds the results) for a route point.
  async getCalculatedPointId(pointId: string): Promise<string> {
    const res = await this.client.getChildrenInfo({
      client: this.callId(),
      parent: this.calculatedPointCollectionId(pointId),
      child: { type: ModelType.CalculatedPoint },
    });
    return res.objects[res.objects.length - 1]?.id ?? "";
  }

  // Reads a calculated-result attribute for a route point, resolving its
  // calculated-point id first. Empty string if the point hasn't been calculated.
  async getPointCalcAttribute(
    pointId: string,
    attributeId: string,
  ): Promise<string> {
    const calcPointId = await this.getCalculatedPointId(pointId);
    if (!calcPointId) return "";
    return this.getCalcPointAttribute(pointId, calcPointId, attributeId);
  }

  // Reads several calculated attributes for a point, resolving its calculated
  // point once. Empty object if the point has no calculated point (e.g. origin).
  async getPointCalcAttributes(
    pointId: string,
    attributeIds: string[],
  ): Promise<Record<string, string>> {
    const calcPointId = await this.getCalculatedPointId(pointId);
    if (!calcPointId) return {};
    const values: Record<string, string> = {};
    for (const attributeId of attributeIds) {
      values[attributeId] = await this.getCalcPointAttribute(
        pointId,
        calcPointId,
        attributeId,
      );
    }
    return values;
  }

  // The first event (which holds the data) for a route point.
  async getEventId(pointId: string): Promise<string> {
    const res = await this.client.getChildrenInfo({
      client: this.callId(),
      parent: this.eventCollectionId(pointId),
      child: { type: ModelType.Event },
    });
    return res.objects[0]?.id ?? "";
  }

  // Every attribute id available on a point (from the "AllAtts" action).
  async getAllAttributes(pointId: string): Promise<string[]> {
    const res = await this.client.doAction({
      client: this.callId("AllAtts"),
      parent: this.pointId(pointId),
    });
    const attList = res.attributes.find((a) => a.name === "AttList");
    return attList ? attList.value.split(";").filter(Boolean) : [];
  }

  // ── Request + path builders ──────────────────────────────────────────────

  // Builds an AttributeRequest; a null value marks the attribute as cleared.
  private attributeRequest(
    parent: ParentIdInit,
    attributeId: string,
    attributeType: string,
    value: string | null,
  ): AttributeRequestInit {
    const attribute =
      value === null
        ? {
            name: attributeId,
            value: "",
            isNull: true,
            typeName: "",
            assemblyName: "",
          }
        : {
            name: attributeId,
            value: serializeValue(
              attributeType +
                ", " +
                [assemblyNameFor(attributeType), value].join(""),
            ),
            isNull: false,
            typeName: "",
            assemblyName: "",
          };
    return { client: this.callId(), parent, attributes: [attribute] };
  }

  private parentIdForMissions(): ParentIdInit {
    return { ids: [] };
  }

  private missionAsParentId(missionId: string): ParentIdInit {
    return { ids: [{ type: ModelType.Mission, id: missionId }] };
  }

  private routeAsParentId(missionId: string, routeId: string): ParentIdInit {
    return {
      ids: [
        { type: ModelType.Mission, id: missionId },
        { type: ModelType.Route, id: routeId },
      ],
    };
  }

  private segmentAsParentId(): ParentIdInit {
    return {
      ids: [
        { type: ModelType.Mission, id: this.currentMissionId },
        { type: ModelType.Route, id: this.currentRouteId },
        { type: ModelType.Segment, id: this.currentSegmentId },
      ],
    };
  }

  private pointId(pointId: string): ParentIdInit {
    return {
      ids: [
        { type: ModelType.Mission, id: this.currentMissionId },
        { type: ModelType.Route, id: this.currentRouteId },
        { type: ModelType.Segment, id: this.currentSegmentId },
        { type: ModelType.RoutePoint, id: pointId },
      ],
    };
  }

  private calculatedPointCollectionId(pointId: string): ParentIdInit {
    return {
      ids: [
        { type: ModelType.Mission, id: this.currentMissionId },
        { type: ModelType.Route, id: this.currentRouteId },
        { type: ModelType.Segment, id: this.currentSegmentId },
        { type: ModelType.CalculatedPointCollection, id: pointId },
      ],
    };
  }

  private calculatedPointId(
    pointId: string,
    calcPointId: string,
  ): ParentIdInit {
    return {
      ids: [
        ...this.calculatedPointCollectionId(pointId).ids!,
        { type: ModelType.CalculatedPoint, id: calcPointId },
      ],
    };
  }

  private eventCollectionId(pointId: string): ParentIdInit {
    return {
      ids: [
        { type: ModelType.Mission, id: this.currentMissionId },
        { type: ModelType.Route, id: this.currentRouteId },
        { type: ModelType.Segment, id: this.currentSegmentId },
        { type: ModelType.EventCollection, id: pointId },
      ],
    };
  }

  private eventId(pointId: string, eventId: string): ParentIdInit {
    return {
      ids: [
        ...this.eventCollectionId(pointId).ids!,
        { type: ModelType.Event, id: eventId },
      ],
    };
  }
}

// Pulls the value for `attributeId` out of an AttributeInfoList response.
const readAttribute = (list: AttributeInfoList, attributeId: string): string =>
  list.attributes.find((a) => a.name === attributeId)?.value ?? "";

// A promise that resolves after `ms`, or rejects if `signal` aborts first.
const delay = (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new Error("aborted"));
      return;
    }
    const id = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(id);
        reject(signal.reason ?? new Error("aborted"));
      },
      { once: true },
    );
  });

// Shared demo instance — one mission/route session for the app.
export const missionClient = new MissionClient();
