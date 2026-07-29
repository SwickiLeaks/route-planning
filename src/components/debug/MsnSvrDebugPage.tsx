import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { colors } from '@/theme/tokens';
import { MONO, MUTED, FAINT } from '@/components/shared/hudStyle';
import { missionClient } from '@/api/msnsvr/missionClient';

interface Field {
  key: string;
  label: string;
  placeholder?: string;
}

interface DebugAction {
  group: string;
  name: string;
  hint?: string;
  fields: Field[];
  run: (v: Record<string, string>) => Promise<unknown>;
}

const num = (raw: string): number => Number(raw);
const opt = (raw: string): string | undefined => (raw.trim() === '' ? undefined : raw);

// Every MissionClient call, described as an enterable form.
const ACTIONS: DebugAction[] = [
  {
    group: 'Session',
    name: 'handshake',
    hint: 'Connectivity check',
    fields: [{ key: 'appId', label: 'appId', placeholder: 'handshake' }],
    run: (v) => missionClient.handshake(opt(v.appId) ?? 'handshake'),
  },
  {
    group: 'Session',
    name: 'createMissionAndRoute',
    hint: 'Bootstrap: mission + route + segment',
    fields: [],
    run: () => missionClient.createMissionAndRoute(),
  },
  { group: 'Session', name: 'addMission', fields: [], run: () => missionClient.addMission() },
  {
    group: 'Session',
    name: 'addRoute',
    fields: [{ key: 'missionId', label: 'missionId' }],
    run: (v) => missionClient.addRoute(v.missionId),
  },
  {
    group: 'Session',
    name: 'getSegmentId',
    fields: [
      { key: 'missionId', label: 'missionId' },
      { key: 'routeId', label: 'routeId' },
    ],
    run: (v) => missionClient.getSegmentId(v.missionId, v.routeId),
  },
  {
    group: 'Session',
    name: 'startTransaction',
    fields: [
      { key: 'missionId', label: 'missionId' },
      { key: 'description', label: 'description' },
    ],
    run: (v) => missionClient.startTransaction(v.missionId, v.description),
  },
  { group: 'Session', name: 'endTransaction', fields: [], run: () => missionClient.endTransaction() },

  {
    group: 'Points',
    name: 'addPointToCurrentRoute',
    hint: 'Appends a point',
    fields: [],
    run: () => missionClient.addPointToCurrentRoute(),
  },
  {
    group: 'Points',
    name: 'insertPointToCurrentRoute',
    fields: [{ key: 'index', label: 'index', placeholder: '0' }],
    run: (v) => missionClient.insertPointToCurrentRoute(num(v.index)),
  },
  {
    group: 'Points',
    name: 'setPointCoordinate',
    fields: [
      { key: 'pointId', label: 'pointId' },
      { key: 'coordinate', label: 'coordinate', placeholder: 'N 36 07.00/W 86 40.00' },
    ],
    run: (v) => missionClient.setPointCoordinate(v.pointId, v.coordinate),
  },
  {
    group: 'Points',
    name: 'setPointAltitude',
    fields: [
      { key: 'pointId', label: 'pointId' },
      { key: 'altitude', label: 'altitude', placeholder: '5000 M' },
    ],
    run: (v) => missionClient.setPointAltitude(v.pointId, v.altitude),
  },
  {
    group: 'Points',
    name: 'setPointSpeed',
    fields: [
      { key: 'pointId', label: 'pointId' },
      { key: 'speed', label: 'speed', placeholder: '100 T' },
    ],
    run: (v) => missionClient.setPointSpeed(v.pointId, v.speed),
  },
  {
    group: 'Points',
    name: 'setPointAttribute',
    fields: [
      { key: 'pointId', label: 'pointId' },
      { key: 'attributeId', label: 'attributeId' },
      { key: 'attributeType', label: 'attributeType' },
      { key: 'attributeValue', label: 'attributeValue' },
    ],
    run: (v) => missionClient.setPointAttribute(v.pointId, v.attributeId, v.attributeType, v.attributeValue),
  },

  {
    group: 'Reads',
    name: 'getPointCoordinate',
    fields: [{ key: 'pointId', label: 'pointId' }],
    run: (v) => missionClient.getPointCoordinate(v.pointId),
  },
  {
    group: 'Reads',
    name: 'getPointAttribute',
    fields: [
      { key: 'pointId', label: 'pointId' },
      { key: 'attributeId', label: 'attributeId' },
    ],
    run: (v) => missionClient.getPointAttribute(v.pointId, v.attributeId),
  },
  {
    group: 'Reads',
    name: 'getAllAttributes',
    fields: [{ key: 'pointId', label: 'pointId' }],
    run: (v) => missionClient.getAllAttributes(v.pointId),
  },
  {
    group: 'Reads',
    name: 'getSegmentAttribute',
    fields: [{ key: 'attributeId', label: 'attributeId', placeholder: 'SegmentCalcState' }],
    run: (v) => missionClient.getSegmentAttribute(v.attributeId),
  },
  {
    group: 'Reads',
    name: 'getRouteAttribute',
    fields: [{ key: 'attributeId', label: 'attributeId' }],
    run: (v) => missionClient.getRouteAttribute(v.attributeId),
  },

  {
    group: 'Calculation',
    name: 'beginCalculation',
    fields: [],
    run: () => missionClient.beginCalculation(),
  },
  {
    group: 'Calculation',
    name: 'getSegmentCalculationState',
    fields: [],
    run: () => missionClient.getSegmentCalculationState(),
  },
  {
    group: 'Calculation',
    name: 'calculateAndWait',
    hint: 'begin + poll to completion',
    fields: [
      { key: 'completeStatus', label: 'completeStatus (optional)', placeholder: 'Calculated' },
      { key: 'intervalMs', label: 'intervalMs', placeholder: '500' },
      { key: 'timeoutMs', label: 'timeoutMs', placeholder: '30000' },
    ],
    run: (v) => {
      const target = opt(v.completeStatus);
      return missionClient.calculateAndWait({
        intervalMs: opt(v.intervalMs) ? num(v.intervalMs) : undefined,
        timeoutMs: opt(v.timeoutMs) ? num(v.timeoutMs) : undefined,
        isComplete: target ? (s) => s === target : undefined,
      });
    },
  },
  {
    group: 'Calculation',
    name: 'getCalculatedPointId',
    fields: [{ key: 'pointId', label: 'pointId' }],
    run: (v) => missionClient.getCalculatedPointId(v.pointId),
  },
  {
    group: 'Calculation',
    name: 'getCalcPointAttribute',
    fields: [
      { key: 'pointId', label: 'pointId' },
      { key: 'calcPointId', label: 'calcPointId' },
      { key: 'attributeId', label: 'attributeId' },
    ],
    run: (v) => missionClient.getCalcPointAttribute(v.pointId, v.calcPointId, v.attributeId),
  },
  {
    group: 'Calculation',
    name: 'getEventId',
    fields: [{ key: 'pointId', label: 'pointId' }],
    run: (v) => missionClient.getEventId(v.pointId),
  },
  {
    group: 'Calculation',
    name: 'getEventAttribute',
    fields: [
      { key: 'pointId', label: 'pointId' },
      { key: 'eventId', label: 'eventId' },
      { key: 'attributeId', label: 'attributeId' },
    ],
    run: (v) => missionClient.getEventAttribute(v.pointId, v.eventId, v.attributeId),
  },
];

const formatResult = (value: unknown): string => {
  if (value === undefined) return '✓ ok (no return value)';
  if (typeof value === 'string') return value === '' ? '(empty string)' : value;
  return JSON.stringify(value, null, 2);
};

// One runnable call: its inputs, a Run button, and the result/error.
const ActionCard = ({ action, onRan }: { action: DebugAction; onRan: () => void }) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'running' | 'ok' | 'error'>('idle');
  const [output, setOutput] = useState('');
  const [elapsed, setElapsed] = useState<number | null>(null);

  const run = async () => {
    setStatus('running');
    setOutput('');
    const startedAt = Date.now();
    try {
      const result = await action.run(values);
      setOutput(formatResult(result));
      setStatus('ok');
    } catch (e) {
      setOutput(e instanceof Error ? `${e.name}: ${e.message}` : String(e));
      setStatus('error');
    } finally {
      setElapsed(Date.now() - startedAt);
      onRan();
    }
  };

  const barColor = status === 'error' ? colors.red : status === 'ok' ? colors.accent : colors.brown;

  return (
    <Paper sx={{ p: 1.5, borderRadius: '10px', border: `1px solid ${barColor}44`, bgcolor: 'rgba(255,255,255,0.03)' }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: action.fields.length ? 1.25 : 1 }}>
        <Typography sx={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: colors.white }}>{action.name}</Typography>
        {action.hint && <Typography sx={{ fontSize: 11, color: FAINT }}>{action.hint}</Typography>}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
        {action.fields.map((f) => (
          <TextField
            key={f.key}
            size="small"
            label={f.label}
            placeholder={f.placeholder}
            value={values[f.key] ?? ''}
            onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
            sx={{ width: '11rem' }}
          />
        ))}
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlayArrowIcon />}
          onClick={run}
          disabled={status === 'running'}
        >
          {status === 'running' ? 'Running…' : 'Run'}
        </Button>
        {elapsed != null && <Typography sx={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>{elapsed} ms</Typography>}
      </Box>

      {output && (
        <Box
          component="pre"
          sx={{
            mt: 1.25,
            m: 0,
            p: 1,
            borderRadius: '7px',
            bgcolor: 'rgba(0,0,0,0.35)',
            border: `1px solid ${barColor}33`,
            fontFamily: MONO,
            fontSize: 12,
            color: status === 'error' ? colors.red : colors.white,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: 220,
            overflow: 'auto',
          }}
        >
          {output}
        </Box>
      )}
    </Paper>
  );
};

// Dev-only page to exercise every MsnSvr MissionClient call by hand.
const MsnSvrDebugPage = () => {
  const [version, setVersion] = useState(0);
  const bump = () => setVersion((v) => v + 1);

  const state = [
    { label: 'mission', value: missionClient.currentMissionId },
    { label: 'route', value: missionClient.currentRouteId },
    { label: 'segment', value: missionClient.currentSegmentId },
  ];

  const groups = [...new Set(ACTIONS.map((a) => a.group))];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--bg)', color: colors.white, p: 3 }}>
      <Box sx={{ maxWidth: 920, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: 22, fontWeight: 700 }}>MsnSvr Debug</Typography>
          <Typography sx={{ fontSize: 13, color: MUTED }}>
            Calls go to the live gRPC service (dev: /api → :5000). Remove <code>?debug</code> from the URL to return to the app.
          </Typography>
        </Box>

        <Paper sx={{ p: 1.5, borderRadius: '10px', bgcolor: `${colors.accent}12`, border: `1px solid ${colors.accent}44` }}>
          <Typography sx={{ fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: FAINT, mb: 0.75 }}>
            Client state
          </Typography>
          <Box key={version} sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {state.map((s) => (
              <Box key={s.label}>
                <Typography sx={{ fontSize: 10, textTransform: 'uppercase', color: MUTED }}>{s.label}</Typography>
                <Typography sx={{ fontFamily: MONO, fontSize: 13, color: s.value ? colors.accent : FAINT }}>
                  {s.value || '—'}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {groups.map((group) => (
          <Box key={group} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.gold }}>
              {group}
            </Typography>
            {ACTIONS.filter((a) => a.group === group).map((a) => (
              <ActionCard key={a.name} action={a} onRan={bump} />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MsnSvrDebugPage;
