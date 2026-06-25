import { getBezierPath, type EdgeProps } from "@xyflow/react";

export function BeamEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    curvature: 0.5,
  });

  const color = (data?.color as string) ?? "#cf4d6b";
  const dur = (data?.dur as number) ?? 4.5; // más lento a propósito
  const active = (data?.active as boolean) ?? false;
  const pending = (data?.pending as boolean) ?? false;
  const gid = `beamgrad-${id}`;
  const pid = `beampath-${id}`;

  return (
    <>
      <defs>
        <linearGradient id={gid}>
          <stop offset="0%" stopColor={color} stopOpacity="0.03" />
          <stop offset="50%" stopColor={color} stopOpacity={active ? "1" : "0.7"} />
          <stop offset="100%" stopColor={color} stopOpacity="0.03" />
        </linearGradient>
      </defs>

      <path id={pid} d={path} fill="none" stroke="#ffffff" strokeOpacity={0.06} strokeWidth={1.5} />

      {!pending && (
        <>
          <path
            d={path}
            fill="none"
            stroke={`url(#${gid})`}
            strokeWidth={active ? 2.6 : 1.8}
            strokeLinecap="round"
            strokeDasharray="6 12"
            className="beam-dash"
            style={{ animationDuration: `${dur}s` }}
          />
          <circle r={active ? 3.4 : 2.6} fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
            <animateMotion dur={`${dur}s`} repeatCount="indefinite" rotate="auto">
              <mpath href={`#${pid}`} />
            </animateMotion>
          </circle>
        </>
      )}

      {pending && (
        <path d={path} fill="none" stroke={color} strokeOpacity={0.25} strokeWidth={1.4} strokeDasharray="2 8" />
      )}
    </>
  );
}
