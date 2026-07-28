/**
 * gRPC-Web data hooks barrel. Connect-Query hooks over the backend services,
 * typed from the generated descriptors in src/api/gen.
 *
 * Not consumed by components yet — this is the data layer, ready to wire up.
 */

// MsnSvr
export {
  useMsnHandshake,
  useChildren,
  useAddChild,
  useRemoveChild,
} from '@/api/hooks/useMissionTree';

// PoiSearcher
export {
  useAvailableLocationSources,
  useCurrentDafifCycle,
  useLocationSearch,
  useLogMessage,
} from '@/api/hooks/usePoiSearch';
