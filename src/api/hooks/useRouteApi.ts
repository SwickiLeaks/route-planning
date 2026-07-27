// import { useQuery, useMutation } from '@connectrpc/connect-query';
// import { useQueryClient } from '@tanstack/react-query';
// import { createConnectQueryKey } from '@connectrpc/connect-query';
// import { RouteService } from '@/api/gen/helicopter/v1/route_pb';

/**
 * Example connect-query hooks over the gRPC-Web RouteService. Typed end-to-end
 * from the proto: request shape, response shape, and errors are all inferred.
 *
 * Not consumed by any component yet — this is the data layer, ready to wire up.
 */

/** Fetch routes for a region. */
// export const useRoutesQuery = (region: string) =>
//   useQuery(RouteService.method.listRoutes, { region });

/** Create a route, invalidating the routes list on success. */
// export const useCreateRoute = () => {
//   const queryClient = useQueryClient();

//   return useMutation(RouteService.method.createRoute, {
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: createConnectQueryKey({
//           schema: RouteService.method.listRoutes,
//           cardinality: 'finite',
//         }),
//       });
//     },
//   });
// };
