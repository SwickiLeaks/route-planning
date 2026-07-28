import {
  useQuery,
  useMutation,
  skipToken,
  createConnectQueryKey,
} from '@connectrpc/connect-query';
import { useQueryClient } from '@tanstack/react-query';
import { MsnSvr } from '@/api/gen/MsnSvr_pb';
import { callId, parentPath } from '@/api/msnsvr/identity';
import type { NodeRef } from '@/api/msnsvr/identity';

/**
 * Generic MsnSvr tree hooks. These are the addressing primitives the app builds
 * on: read a node's children, add a child, remove a child. The higher-level
 * "ensure one route with a default segment" flow will compose these once the
 * NodeType codes and transaction semantics are pinned down.
 */

/** MsnSvr session handshake. */
export const useMsnHandshake = () =>
  useQuery(MsnSvr.method.handshake, { id: 'handshake' });

/**
 * Children of the node at `path` (a path from the mission root). Pass null to
 * hold the query idle — e.g. while the parent id isn't known yet.
 */
export const useChildren = (path: NodeRef[] | null) =>
  useQuery(
    MsnSvr.method.getChildrenInfo,
    path
      ? { client: callId('getChildrenInfo'), parent: parentPath(path) }
      : skipToken,
  );

/** Invalidate all getChildrenInfo queries after a tree mutation. */
const useInvalidateChildren = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: createConnectQueryKey({
        schema: MsnSvr.method.getChildrenInfo,
        cardinality: 'finite',
      }),
    });
};

/**
 * Add a child of `childType` under `parent`. The caller supplies the parent
 * path and child descriptor; the CallId envelope is injected here.
 */
export const useAddChild = () => {
  const invalidate = useInvalidateChildren();

  const base = useMutation(MsnSvr.method.addChild, {
    onSuccess: () => invalidate(),
  });

  const addChild = (parent: NodeRef[], childType: number, index = -1) =>
    base.mutateAsync({
      client: callId('addChild'),
      parent: parentPath(parent),
      child: { type: childType, id: '', index },
    });

  return { ...base, addChild };
};

/** Remove the child identified by `childType`/`index` under `parent`. */
export const useRemoveChild = () => {
  const invalidate = useInvalidateChildren();

  const base = useMutation(MsnSvr.method.removeChild, {
    onSuccess: () => invalidate(),
  });

  const removeChild = (parent: NodeRef[], childType: number, index: number) =>
    base.mutateAsync({
      client: callId('removeChild'),
      parent: parentPath(parent),
      child: { type: childType, id: '', index },
    });

  return { ...base, removeChild };
};
