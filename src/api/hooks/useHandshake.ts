import { MsnSvr } from "@/api/gen/MsnSvr_pb";
import { useQuery } from "@connectrpc/connect-query";

// Method: Handshake.  MsnSvr proto
export const useHandshake = () =>
  useQuery(MsnSvr.method.handshake, { id: "1" });
