import type { MessageInitShape } from '@bufbuild/protobuf';
import { CallIdSchema } from '@/api/gen/MsnSvr_pb';
import { ModelType } from '@/api/msnsvr/missionClient';

/**
 * MsnSvr client identity and tree addressing.
 *
 * Every MsnSvr request carries a CallId envelope, and the tree is addressed by
 * a path of typed node ids (Mission → Route → Segment → RoutePoint). This
 * module centralizes the fixed demo identity and the path helpers so the hooks
 * stay declarative.
 */

/** Fixed for the demo — the same client and mission every time the app starts. */
export const CLIENT_ID = 'route-planning-demo';
export const MISSION_ID = 'demo-mission-1';
export const PROTOCOL_VERSION = '1.0';

/** Node type codes for the int32 `type` on IdType/ChildId (see ModelType). */
export const NodeType = {
  Mission: ModelType.Mission,
  Route: ModelType.Route,
  Segment: ModelType.Segment,
  RoutePoint: ModelType.RoutePoint,
} as const;

/** A single step in a tree path: a typed node id. */
export interface NodeRef {
  type: number;
  id: string;
}

/** The mission root ref — the top of every path in the demo. */
export const missionRef: NodeRef = { type: NodeType.Mission, id: MISSION_ID };

/** Builds a ParentId (path from root) from an ordered list of node refs. */
export const parentPath = (path: NodeRef[]) => ({ ids: path });

let transactionSeq = 0;

/**
 * Fresh CallId per request. version + clientId are fixed; transactionId is
 * unique so the server can correlate. Pass a context string to tag the call.
 */
export const callId = (context = ''): MessageInitShape<typeof CallIdSchema> => ({
  version: PROTOCOL_VERSION,
  clientId: CLIENT_ID,
  transactionId: `${CLIENT_ID}-${(transactionSeq += 1)}`,
  context,
});
