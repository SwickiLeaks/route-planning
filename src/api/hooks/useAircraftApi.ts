import { useQuery } from '@connectrpc/connect-query';
import { AircraftService } from '@/api/gen/helicopter/v1/aircraft_pb';

/** Example query over the second service, proving multi-file codegen works. */
export const useAircraftQuery = () =>
  useQuery(AircraftService.method.listAircraft, {});
