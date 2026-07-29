import { useEffect, useRef, useState } from 'react';
import { missionClient } from '@/api/msnsvr/missionClient';

export interface MissionSession {
  missionId: string;
  routeId: string;
}

// Creates the demo's single mission + route once on startup; failures are
// logged (not thrown) so the app still runs when the service is unavailable.
export const useMissionSession = () => {
  const [session, setSession] = useState<MissionSession | null>(null);
  const [error, setError] = useState<unknown>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    missionClient
      .createMissionAndRoute()
      .then(setSession)
      .catch((e) => {
        console.error('[msnsvr] failed to create mission/route', e);
        setError(e);
      });
  }, []);

  return { session, error, client: missionClient };
};
