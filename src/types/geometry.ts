export type VertexKey = 'A' | 'B' | 'C' | 'D';

export interface VertexConfig {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface AngleInfo {
  id: number;
  numberLabel: string; // "1", "2", "3", "4", "5", "6"
  vertex: VertexKey;
  ray1: VertexKey;
  ray2: VertexKey;
  color: string;
  namePrimary: (cfg: VertexConfig) => string; // e.g. ∠BAC
  nameSecondary: (cfg: VertexConfig) => string; // e.g. ∠CAB
  description: (cfg: VertexConfig) => string;
  arcRadius: number;
  isDoubleArc?: boolean;
}

export type TrainerMode = 'quiz' | 'matching' | 'constructor';

export interface QuizQuestion {
  id: string;
  questionText: (cfg: VertexConfig) => string;
  subtitle?: (cfg: VertexConfig) => string;
  targetAngleId?: number;
  highlightAngles?: number[];
  options: (cfg: VertexConfig) => {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  pedagogicalHint: (cfg: VertexConfig) => string;
}

export interface EqualAnglePair {
  id: string;
  title: (cfg: VertexConfig) => string;
  angle1Id: number;
  angle2Id: number;
  reason: (cfg: VertexConfig) => string;
  parallelLines: (cfg: VertexConfig) => string;
  transversal: (cfg: VertexConfig) => string;
}
