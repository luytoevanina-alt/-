import React from 'react';
import { ANGLES } from '../data/trainerData';
import { AngleInfo, VertexConfig, VertexKey } from '../types/geometry';

interface ParallelogramCanvasProps {
  vertexConfig: VertexConfig;
  highlightedAngleIds?: number[];
  activeRayAngle?: AngleInfo | null;
  onSelectAngle?: (angleId: number) => void;
  onSelectVertex?: (vKey: VertexKey) => void;
  selectedVertices?: VertexKey[];
}

// Large, prominent geometry coordinates for desktop computer screens (ViewBox 0 0 780 490)
export const COORDS: Record<VertexKey, { x: number; y: number }> = {
  A: { x: 120, y: 400 },
  B: { x: 280, y: 70 },
  C: { x: 680, y: 70 },
  D: { x: 520, y: 400 },
};

// Bright, distinctive color palette for each vertex
export const VERTEX_COLORS: Record<VertexKey, {
  stroke: string;
  fill: string;
  text: string;
  glow: string;
  labelBg: string;
}> = {
  A: {
    stroke: '#2563EB', // Vibrant Blue
    fill: '#EFF6FF',
    text: '#1D4ED8',
    glow: 'rgba(37, 99, 235, 0.35)',
    labelBg: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  B: {
    stroke: '#16A34A', // Vibrant Emerald Green
    fill: '#F0FDF4',
    text: '#15803D',
    glow: 'rgba(22, 163, 74, 0.35)',
    labelBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  C: {
    stroke: '#9333EA', // Vibrant Purple / Violet
    fill: '#FAF5FF',
    text: '#7E22CE',
    glow: 'rgba(147, 51, 234, 0.35)',
    labelBg: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  D: {
    stroke: '#DC2626', // Vibrant Crimson Red
    fill: '#FEF2F2',
    text: '#B91C1C',
    glow: 'rgba(220, 38, 38, 0.35)',
    labelBg: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

export const ParallelogramCanvas: React.FC<ParallelogramCanvasProps> = ({
  vertexConfig,
  highlightedAngleIds = [],
  activeRayAngle = null,
  onSelectAngle,
  onSelectVertex,
  selectedVertices = [],
}) => {
  const { A, B, C, D } = COORDS;

  // Arc path generator
  const createArcPath = (
    cx: number,
    cy: number,
    radius: number,
    startAngleRad: number,
    endAngleRad: number
  ) => {
    let start = startAngleRad;
    let end = endAngleRad;
    if (end < start) {
      end += 2 * Math.PI;
    }
    const x1 = cx + radius * Math.cos(start);
    const y1 = cy + radius * Math.sin(start);
    const x2 = cx + radius * Math.cos(end);
    const y2 = cy + radius * Math.sin(end);
    const sweepFlag = 1;
    const largeArcFlag = end - start > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`;
  };

  // Vector angles from vertices
  const angleAtA_AB = Math.atan2(B.y - A.y, B.x - A.x); // ~ -1.12 rad (-64.1°)
  const angleAtA_AC = Math.atan2(C.y - A.y, C.x - A.x); // ~ -0.53 rad (-30.5°)
  const angleAtA_AD = 0; // 0 rad (0°)

  const angleAtC_CB = Math.PI; // 180°
  const angleAtC_CA = Math.atan2(A.y - C.y, A.x - C.x); // ~ 2.61 rad (149.5°)
  const angleAtC_CD = Math.atan2(D.y - C.y, D.x - C.x); // ~ 2.02 rad (115.9°)

  const angleAtB_BA = Math.atan2(A.y - B.y, A.x - B.x); // ~ 2.02 rad
  const angleAtB_BC = 0; // 0 rad

  const angleAtD_DA = Math.PI; // 180°
  const angleAtD_DC = Math.atan2(C.y - D.y, C.x - D.x); // ~ -1.12 rad

  // Map angles to arc definitions (large, visible scale)
  const angleArcDefs: Record<number, {
    cx: number;
    cy: number;
    start: number;
    end: number;
    radius: number;
    badgeDist: number;
    color: string;
    isDouble: boolean;
  }> = {
    1: {
      cx: A.x,
      cy: A.y,
      start: angleAtA_AB,
      end: angleAtA_AC,
      radius: 64,
      badgeDist: 98,
      color: '#2563EB',
      isDouble: false,
    },
    2: {
      cx: A.x,
      cy: A.y,
      start: angleAtA_AC,
      end: angleAtA_AD,
      radius: 68,
      badgeDist: 104,
      color: '#D97706',
      isDouble: true,
    },
    3: {
      cx: C.x,
      cy: C.y,
      start: angleAtC_CA,
      end: angleAtC_CB,
      radius: 68,
      badgeDist: 104,
      color: '#D97706',
      isDouble: true,
    },
    4: {
      cx: C.x,
      cy: C.y,
      start: angleAtC_CD,
      end: angleAtC_CA,
      radius: 64,
      badgeDist: 98,
      color: '#2563EB',
      isDouble: false,
    },
    5: {
      cx: B.x,
      cy: B.y,
      start: angleAtB_BC,
      end: angleAtB_BA,
      radius: 50,
      badgeDist: 80,
      color: '#059669',
      isDouble: false,
    },
    6: {
      cx: D.x,
      cy: D.y,
      start: angleAtD_DC,
      end: angleAtD_DA,
      radius: 50,
      badgeDist: 80,
      color: '#059669',
      isDouble: false,
    },
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-white border-2 border-slate-300 shadow-md select-none">
      {/* Top subtle toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 text-sm">Чертеж к заданиям:</span>
          <span className="font-medium text-slate-700">
            Параллелограмм{' '}
            <strong className="font-mono text-blue-700">{vertexConfig.A}</strong>
            <strong className="font-mono text-emerald-700">{vertexConfig.B}</strong>
            <strong className="font-mono text-purple-700">{vertexConfig.C}</strong>
            <strong className="font-mono text-rose-700">{vertexConfig.D}</strong> с диагональю{' '}
            <strong className="font-mono text-slate-900">{vertexConfig.A}{vertexConfig.C}</strong>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
            вершина {vertexConfig.A} (синяя)
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
            вершина {vertexConfig.B} (зеленая)
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-100 text-purple-800">
            вершина {vertexConfig.C} (фиолетовая)
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800">
            вершина {vertexConfig.D} (красная)
          </span>
        </div>
      </div>

      {/* Large SVG Drawing for Computer Screens */}
      <div className="p-3 sm:p-5 flex items-center justify-center bg-white">
        <svg
          viewBox="0 0 780 490"
          className="w-full h-auto max-h-[500px] font-sans"
          style={{ shapeRendering: 'geometricPrecision' }}
        >
          <defs>
            {/* Fine coordinate grid */}
            <pattern id="geometryGridLarge" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#F1F5F9" strokeWidth="1" />
            </pattern>

            {/* Parallel markers */}
            <marker id="arrowDoubleThick" viewBox="0 0 14 10" refX="7" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
              <path d="M 0 1 L 5 5 L 0 9 M 4 1 L 9 5 L 4 9" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
            </marker>
            <marker id="arrowSingleThick" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 1 L 7 5 L 0 9 z" fill="#475569" />
            </marker>
          </defs>

          {/* Grid background */}
          <rect x="0" y="0" width="780" height="490" fill="url(#geometryGridLarge)" rx="16" />

          {/* Main Parallelogram Shape with THICK BOLD LINES */}
          <polygon
            points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`}
            fill="#F8FAFC"
            fillOpacity="0.85"
            stroke="#0F172A"
            strokeWidth="5"
            strokeLinejoin="round"
          />

          {/* Diagonal AC - BOLD THICK DASHED LINE */}
          <line
            x1={A.x}
            y1={A.y}
            x2={C.x}
            y2={C.y}
            stroke="#1E293B"
            strokeWidth="4"
            strokeDasharray="10 7"
            strokeLinecap="round"
          />

          {/* Parallel side indicators on thick sides */}
          <line
            x1={B.x + 170}
            y1={B.y}
            x2={B.x + 205}
            y2={B.y}
            stroke="transparent"
            markerEnd="url(#arrowDoubleThick)"
          />
          <line
            x1={A.x + 170}
            y1={A.y}
            x2={A.x + 205}
            y2={A.y}
            stroke="transparent"
            markerEnd="url(#arrowDoubleThick)"
          />
          <line
            x1={A.x + 70}
            y1={A.y - 145}
            x2={A.x + 85}
            y2={A.y - 175}
            stroke="transparent"
            markerEnd="url(#arrowSingleThick)"
          />
          <line
            x1={D.x + 70}
            y1={D.y - 145}
            x2={D.x + 85}
            y2={D.y - 175}
            stroke="transparent"
            markerEnd="url(#arrowSingleThick)"
          />

          {/* Active Ray Highlight (When hovering an option or button) */}
          {activeRayAngle && (
            <g className="transition-all duration-200">
              <circle
                cx={COORDS[activeRayAngle.vertex].x}
                cy={COORDS[activeRayAngle.vertex].y}
                r="24"
                fill={activeRayAngle.color}
                fillOpacity="0.25"
              />
              <line
                x1={COORDS[activeRayAngle.vertex].x}
                y1={COORDS[activeRayAngle.vertex].y}
                x2={COORDS[activeRayAngle.ray1].x}
                y2={COORDS[activeRayAngle.ray1].y}
                stroke={activeRayAngle.color}
                strokeWidth="7"
                strokeLinecap="round"
                strokeOpacity="0.85"
              />
              <line
                x1={COORDS[activeRayAngle.vertex].x}
                y1={COORDS[activeRayAngle.vertex].y}
                x2={COORDS[activeRayAngle.ray2].x}
                y2={COORDS[activeRayAngle.ray2].y}
                stroke={activeRayAngle.color}
                strokeWidth="7"
                strokeLinecap="round"
                strokeOpacity="0.85"
              />
            </g>
          )}

          {/* Selected path in Constructor Mode */}
          {selectedVertices.length > 0 && (
            <g>
              {selectedVertices.length === 1 && (
                <circle
                  cx={COORDS[selectedVertices[0]].x}
                  cy={COORDS[selectedVertices[0]].y}
                  r="24"
                  fill="#6366F1"
                  fillOpacity="0.3"
                  className="animate-pulse"
                />
              )}
              {selectedVertices.length >= 2 && (
                <line
                  x1={COORDS[selectedVertices[0]].x}
                  y1={COORDS[selectedVertices[0]].y}
                  x2={COORDS[selectedVertices[1]].x}
                  y2={COORDS[selectedVertices[1]].y}
                  stroke="#4F46E5"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              )}
              {selectedVertices.length === 3 && (
                <line
                  x1={COORDS[selectedVertices[1]].x}
                  y1={COORDS[selectedVertices[1]].y}
                  x2={COORDS[selectedVertices[2]].x}
                  y2={COORDS[selectedVertices[2]].y}
                  stroke="#4F46E5"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              )}
            </g>
          )}

          {/* Draw Angles Arcs and Badges (Large & High Contrast) */}
          {ANGLES.map((angle) => {
            const def = angleArcDefs[angle.id];
            if (!def) return null;

            const isHighlighted = highlightedAngleIds.includes(angle.id);
            const isAngleActive = activeRayAngle?.id === angle.id;
            const strokeColor = isHighlighted || isAngleActive ? '#EF4444' : def.color;
            const strokeWidth = isHighlighted || isAngleActive ? 4.5 : 3.5;

            // Compute midpoint angle for number label
            let start = def.start;
            let end = def.end;
            if (end < start) end += 2 * Math.PI;
            const mid = (start + end) / 2;
            const badgeX = def.cx + def.badgeDist * Math.cos(mid);
            const badgeY = def.cy + def.badgeDist * Math.sin(mid);

            return (
              <g
                key={angle.id}
                className="cursor-pointer group"
                onClick={() => onSelectAngle?.(angle.id)}
              >
                {/* Single or Inner Arc */}
                <path
                  d={createArcPath(def.cx, def.cy, def.radius, def.start, def.end)}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  className="transition-all duration-150"
                />

                {/* Double Arc for angles 2 and 3 */}
                {def.isDouble && (
                  <path
                    d={createArcPath(def.cx, def.cy, def.radius - 12, def.start, def.end)}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className="transition-all duration-150"
                  />
                )}

                {/* Hover / Click Area */}
                <path
                  d={createArcPath(def.cx, def.cy, def.radius, def.start, def.end)}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="22"
                  strokeOpacity={isHighlighted || isAngleActive ? '0.22' : '0'}
                  className="hover:stroke-opacity-20 transition-all duration-150"
                />

                {/* Large Number Badge */}
                <g transform={`translate(${badgeX}, ${badgeY})`}>
                  <circle
                    r="16"
                    fill={isHighlighted || isAngleActive ? '#EF4444' : def.color}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="transition-colors duration-150 shadow-md"
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#FFFFFF"
                    fontSize="16"
                    fontWeight="800"
                    className="font-sans pointer-events-none"
                  >
                    {angle.numberLabel}
                  </text>
                </g>
              </g>
            );
          })}

          {/* BRIGHT, MULTI-COLORED VERTEX LABELS AND NODES */}
          {(['A', 'B', 'C', 'D'] as VertexKey[]).map((vKey) => {
            const coord = COORDS[vKey];
            const letter = vertexConfig[vKey];
            const colors = VERTEX_COLORS[vKey];
            const isVertexSelected = selectedVertices.includes(vKey);
            const isRayVertex = activeRayAngle?.vertex === vKey;

            // Offset label position outside the polygon
            const offsets: Record<VertexKey, { x: number; y: number }> = {
              A: { x: -38, y: 32 },
              B: { x: -34, y: -34 },
              C: { x: 38, y: -34 },
              D: { x: 38, y: 32 },
            };
            const off = offsets[vKey];

            return (
              <g
                key={vKey}
                className="cursor-pointer group"
                onClick={() => onSelectVertex?.(vKey)}
              >
                {/* Glow ring */}
                {(isVertexSelected || isRayVertex) && (
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="18"
                    fill={colors.stroke}
                    fillOpacity="0.3"
                    className="animate-ping"
                  />
                )}

                {/* Vertex node dot */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={isVertexSelected || isRayVertex ? 9 : 7.5}
                  fill={colors.stroke}
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  className="transition-all duration-150 group-hover:scale-125 shadow-sm"
                />

                {/* Large Bright Multi-Colored Vertex Bubble */}
                <g transform={`translate(${coord.x + off.x}, ${coord.y + off.y})`}>
                  {/* Outer vibrant border circle */}
                  <circle
                    r="24"
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth="3.5"
                    className="shadow-md transition-all duration-150 group-hover:scale-110"
                  />

                  {/* Bright bold letter inside */}
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={colors.text}
                    fontSize="24"
                    fontWeight="800"
                    fontStyle="italic"
                    className="font-math select-none pointer-events-none drop-shadow-2xs"
                  >
                    {letter}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Dynamic bottom guidance caption */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs sm:text-sm text-slate-700 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">💡 Подсказка:</span>
          {activeRayAngle ? (
            <span>
              Угол <strong className="text-slate-900 font-bold">{activeRayAngle.numberLabel}</strong>: вершина{' '}
              <strong
                className="font-extrabold px-1.5 py-0.5 rounded text-white"
                style={{ backgroundColor: VERTEX_COLORS[activeRayAngle.vertex].stroke }}
              >
                {vertexConfig[activeRayAngle.vertex]}
              </strong>{' '}
              в центре! Обозначение:{' '}
              <span className="font-mono font-bold text-slate-900 text-sm">
                {activeRayAngle.namePrimary(vertexConfig)}
              </span>
            </span>
          ) : (
            <span>
              Кликни по номеру угла или вершине на чертеже, чтобы подсветить его стороны!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
