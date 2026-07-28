import { useQuery, useMutation, skipToken } from '@connectrpc/connect-query';
import type { MessageInitShape } from '@bufbuild/protobuf';
import { PoiSearcher, SearchOptionsSchema } from '@/api/gen/PoiLocator_pb';

/**
 * Hooks over the PoiSearcher gRPC-Web service — the location/POI data source
 * for building routes. Typed end-to-end from PoiLocator.proto: request shape,
 * response shape, and errors are all inferred from the generated descriptors.
 *
 * Three reusable patterns live here:
 *   1. no-input query        — useAvailableLocationSources
 *   2. guarded input query   — useLocationSearch (skipToken until there's text)
 *   3. mutation              — useLogMessage
 */

/** Location databases the server can search (DAFIF, user data, …). No input. */
export const useAvailableLocationSources = () =>
  useQuery(PoiSearcher.method.availableLocationSources, {});

/** Current DAFIF (aeronautical data) cycle identifier. No input. */
export const useCurrentDafifCycle = () =>
  useQuery(PoiSearcher.method.getCurrentDafifCycle, {});

/**
 * Free-text location search. `skipToken` keeps the query idle until there's
 * search text, so the hook can be mounted unconditionally — no request fires
 * for an empty box, and typing into it activates the query.
 */
export const useLocationSearch = (
  searchText: string,
  options?: MessageInitShape<typeof SearchOptionsSchema>,
) =>
  useQuery(
    PoiSearcher.method.searchForLocationByText,
    searchText.trim() ? { searchText, options } : skipToken,
  );

/** Server-side log write — the mutation pattern (returns mutate / mutateAsync). */
export const useLogMessage = () => useMutation(PoiSearcher.method.logMessage);
