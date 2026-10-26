import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';
import { ANGLES } from '../../data/trainerData';
import { VertexConfig, VertexKey, AngleInfo } from '../../types/geometry';
import { playClick, playSuccess, playError } from '../../utils/audio';

interface ConstructorModeProps {
  vertexConfig: VertexConfig;
  selectedVertices: VertexKey[];
  onSelectVertex: (vKey: VertexKey) => void;
  onClearVertices: () => void;
  onHoverAngle: (angle: AngleInfo | null) => void;
  onSetHighlightedAngles: (ids: number[]) => void;
  onScoreIncrement: () => void;
}

export const ConstructorMode: React.FC<ConstructorModeProps> = ({
  vertexConfig,
  selectedVertices,
  onSelectVertex,
  onClearVertices,
  onHoverAngle,
  onSetHighlightedAngles,
  onScoreIncrement,
}) => {
  const [targetAngleId, setTargetAngleId] = useState<number>(1);
  const targetAngle = ANGLES.find((a) => a.id === targetAngleId) || ANGLES[0];

  const handlePickVertex = (vKey: VertexKey) => {
    if (selectedVertices.length >= 3) return;
    playClick();
    onSelectVertex(vKey);
  };

  const handleReset = () => {
    playClick();
    onClearVertices();
    onSetHighlightedAngles([targetAngleId]);
  };

  // Evaluate constructed angle when 3 vertices are chosen
  const isComplete = selectedVertices.length === 3;
  let constructedName = '';
  let reversedName = '';
  let recognizedAngle: AngleInfo | null = null;
  let isTargetMatch = false;

  if (isComplete) {
    const [p1, vertex, p2] = selectedVertices;
    constructedName = `∠${vertexConfig[p1]}${vertexConfig[vertex]}${vertexConfig[p2]}`;
    reversedName = `∠${vertexConfig[p2]}${vertexConfig[vertex]}${vertexConfig[p1]}`;

    // Check if this matches any known angle in ANGLES
    recognizedAngle =
      ANGLES.find(
        (a) =>
          a.vertex === vertex &&
          ((a.ray1 === p1 && a.ray2 === p2) || (a.ray1 === p2 && a.ray2 === p1))
      ) || null;

    if (recognizedAngle) {
      if (recognizedAngle.id === targetAngleId) {
        isTargetMatch = true;
      }
    }
  }

  // Effect to trigger success on target match
  React.useEffect(() => {
    if (isComplete && isTargetMatch) {
      playSuccess();
      onScoreIncrement();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else if (isComplete && !isTargetMatch) {
      playError();
    }
  }, [isComplete, isTargetMatch]);

  const nextTarget = () => {
    playClick();
    onClearVertices();
    const nextId = (targetAngleId % ANGLES.length) + 1;
    setTargetAngleId(nextId);
    onSetHighlightedAngles([nextId]);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Интерактивный конструктор угла
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Нажимай на вершины чертежа или кнопки внизу, чтобы на практике понять правило трех букв
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Очистить выбор</span>
        </button>
      </div>

      {/* Target Angle Mission */}
      <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
            Текущая миссия:
          </span>
          <span className="text-xs text-blue-700 font-medium">
            Угол {targetAngleId} из {ANGLES.length}
          </span>
        </div>
        <p className="text-sm sm:text-base font-bold text-slate-900 mt-1">
          Построй имя для угла{' '}
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs align-middle">
            {targetAngle.numberLabel}
          </span>
        </p>
        <p className="text-xs text-slate-600 mt-1">
          {targetAngle.description(vertexConfig)}. Вершина этого угла — точка{' '}
          <strong className="text-blue-700 font-bold">{vertexConfig[targetAngle.vertex]}</strong>!
        </p>
      </div>

      {/* Interactive Vertex Picker Buttons */}
      <div className="mt-5">
        <div className="text-xs font-semibold text-slate-600 mb-2">
          Шаг {selectedVertices.length + 1} из 3:{' '}
          {selectedVertices.length === 0
            ? 'Выбери первую точку (на луче)'
            : selectedVertices.length === 1
            ? 'Выбери ВЕРШИНУ угла (она встанет в центр!)'
            : selectedVertices.length === 2
            ? 'Выбери третью точку (на втором луче)'
            : 'Угол построен!'}
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {(['A', 'B', 'C', 'D'] as VertexKey[]).map((vKey) => {
            const letter = vertexConfig[vKey];
            const isPicked = selectedVertices.includes(vKey);

            const vColorStyles: Record<VertexKey, { active: string; inactive: string }> = {
              A: {
                active: 'border-blue-600 bg-blue-600 text-white shadow-sm font-bold scale-105',
                inactive: 'border-blue-200 bg-blue-50/70 hover:border-blue-500 text-blue-900',
              },
              B: {
                active: 'border-emerald-600 bg-emerald-600 text-white shadow-sm font-bold scale-105',
                inactive: 'border-emerald-200 bg-emerald-50/70 hover:border-emerald-500 text-emerald-900',
              },
              C: {
                active: 'border-purple-600 bg-purple-600 text-white shadow-sm font-bold scale-105',
                inactive: 'border-purple-200 bg-purple-50/70 hover:border-purple-500 text-purple-900',
              },
              D: {
                active: 'border-rose-600 bg-rose-600 text-white shadow-sm font-bold scale-105',
                inactive: 'border-rose-200 bg-rose-50/70 hover:border-rose-500 text-rose-900',
              },
            };

            const style = vColorStyles[vKey];

            return (
              <button
                key={vKey}
                onClick={() => handlePickVertex(vKey)}
                disabled={isComplete}
                className={`py-3.5 px-2 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  isPicked ? style.active : style.inactive
                }`}
              >
                <div className="font-math text-2xl font-bold italic">{letter}</div>
                <div className="text-[10px] mt-0.5 font-sans font-semibold">
                  {vKey === 'A' ? 'Синяя' : vKey === 'B' ? 'Зеленая' : vKey === 'C' ? 'Фиолетовая' : 'Красная'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Construction Result Box */}
      <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
        <div className="text-xs text-slate-500 font-semibold mb-1">
          Твоя трехбуквенная запись:
        </div>
        <div className="flex items-center gap-3 font-mono text-2xl font-bold text-slate-900 min-h-[36px]">
          {selectedVertices.length === 0 ? (
            <span className="text-slate-400 text-sm font-sans font-normal">
              (нажми три вершины, чтобы собрать название угла)
            </span>
          ) : (
            <>
              <span className="text-blue-600">∠</span>
              {selectedVertices.map((vKey, idx) => (
                <span
                  key={idx}
                  className={`px-1 rounded ${
                    idx === 1
                      ? 'bg-amber-100 text-amber-900 underline decoration-amber-500 font-extrabold'
                      : 'text-slate-800'
                  }`}
                  title={idx === 1 ? 'Вершина угла (в центре)' : 'Точка на стороне'}
                >
                  {vertexConfig[vKey]}
                </span>
              ))}
              {selectedVertices.length < 3 && (
                <span className="text-slate-300">...</span>
              )}
            </>
          )}
        </div>

        {/* Live pedagogical feedback */}
        {selectedVertices.length === 1 && (
          <p className="text-xs text-slate-600 mt-2">
            1-я точка: <strong>{vertexConfig[selectedVertices[0]]}</strong>. Теперь выбери вершину, из которой исходят лучи!
          </p>
        )}

        {selectedVertices.length === 2 && (
          <p className="text-xs text-slate-600 mt-2">
            Вершина угла: <strong className="text-amber-700">{vertexConfig[selectedVertices[1]]}</strong> (она будет в центре). Выбери финальную точку второго луча!
          </p>
        )}

        {isComplete && (
          <div className="mt-3 pt-3 border-t border-slate-200 text-xs">
            {isTargetMatch ? (
              <div className="text-emerald-800 bg-emerald-50 p-3 rounded-lg border border-emerald-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Браво! Угол № {targetAngleId} построен верно!</span>
                </div>
                <p>
                  Буквенное имя: <strong className="font-mono">{constructedName}</strong> или{' '}
                  <strong className="font-mono">{reversedName}</strong>.
                </p>
                <p className="text-emerald-700">
                  Обрати внимание: вершина <strong className="font-bold underline">{vertexConfig[selectedVertices[1]]}</strong> находится строго в центре!
                </p>
                <div className="pt-2">
                  <button
                    onClick={nextTarget}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <span>Следующий угол</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : recognizedAngle ? (
              <div className="text-blue-900 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="font-semibold">
                  Ты собрал угол <strong className="font-mono">{constructedName}</strong> — это угол № {recognizedAngle.id} на чертеже!
                </p>
                <p className="mt-1 text-slate-600">
                  А для текущей миссии требовалось построить угол № {targetAngleId}. Попробуй еще раз: вершина угла {targetAngleId} — это точка {vertexConfig[targetAngle.vertex]}.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-2 px-3 py-1 bg-white border border-blue-300 text-blue-700 rounded-lg text-xs font-medium cursor-pointer"
                >
                  Попробовать снова
                </button>
              </div>
            ) : (
              <div className="text-amber-900 bg-amber-50 p-3 rounded-lg border border-amber-200">
                <p className="font-semibold">
                  Угол <strong className="font-mono">{constructedName}</strong> не обозначен на чертеже дугой.
                </p>
                <p className="mt-1 text-slate-600">
                  Для угла № {targetAngleId} вершиной должна быть точка{' '}
                  <strong>{vertexConfig[targetAngle.vertex]}</strong>.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-2 px-3 py-1 bg-white border border-amber-300 text-amber-700 rounded-lg text-xs font-medium cursor-pointer"
                >
                  Сбросить и попробовать снова
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
