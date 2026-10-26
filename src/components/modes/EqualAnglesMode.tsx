import React, { useState } from 'react';
import { CheckCircle2, XCircle, Eye, EyeOff, Sparkles, HelpCircle } from 'lucide-react';
import { EQUAL_ANGLE_PAIRS, ANGLES } from '../../data/trainerData';
import { EqualAnglePair, VertexConfig, AngleInfo } from '../../types/geometry';
import { playClick, playSuccess, playError } from '../../utils/audio';

interface EqualAnglesModeProps {
  vertexConfig: VertexConfig;
  onHoverAngle: (angle: AngleInfo | null) => void;
  onSetHighlightedAngles: (ids: number[]) => void;
  onSetZPair: (pair: { parallelLines: string; angle1: number; angle2: number; color?: string } | null) => void;
  onScoreIncrement: () => void;
}

export const EqualAnglesMode: React.FC<EqualAnglesModeProps> = ({
  vertexConfig,
  onHoverAngle,
  onSetHighlightedAngles,
  onSetZPair,
  onScoreIncrement,
}) => {
  const [activePairIndex, setActivePairIndex] = useState<number | null>(0);
  const [showZOverlay, setShowZOverlay] = useState(true);

  // Mini-Quiz challenge state
  const [challengeStep, setChallengeStep] = useState(0);
  const [challengeAnswers, setChallengeAnswers] = useState<Record<number, string>>({});
  const [challengeSolved, setChallengeSolved] = useState<Record<number, boolean>>({});

  const challenges = [
    {
      id: 0,
      question: `Какому углу РАВЕН угол ∠${vertexConfig.B}${vertexConfig.A}${vertexConfig.C} (угол 1) как накрест лежащий?`,
      correctAngleId: 4,
      correctNotation: `∠${vertexConfig.A}${vertexConfig.C}${vertexConfig.D}`,
      options: [
        { id: 'opt4', text: `∠${vertexConfig.A}${vertexConfig.C}${vertexConfig.D} (угол 4)`, isCorrect: true },
        { id: 'opt2', text: `∠${vertexConfig.C}${vertexConfig.A}${vertexConfig.D} (угол 2)`, isCorrect: false },
        { id: 'opt3', text: `∠${vertexConfig.B}${vertexConfig.C}${vertexConfig.A} (угол 3)`, isCorrect: false },
        { id: 'opt5', text: `∠${vertexConfig.A}${vertexConfig.B}${vertexConfig.C} (угол 5)`, isCorrect: false },
      ],
      explanation: `При сторонах ${vertexConfig.A}${vertexConfig.B} ∥ ${vertexConfig.C}${vertexConfig.D} и секущей ${vertexConfig.A}${vertexConfig.C} накрест лежащими являются углы 1 и 4. Поэтому ∠${vertexConfig.B}${vertexConfig.A}${vertexConfig.C} = ∠${vertexConfig.A}${vertexConfig.C}${vertexConfig.D}!`,
      pairIndex: 0,
    },
    {
      id: 1,
      question: `Какому углу РАВЕН угол ∠${vertexConfig.C}${vertexConfig.A}${vertexConfig.D} (угол 2) как накрест лежащий?`,
      correctAngleId: 3,
      correctNotation: `∠${vertexConfig.B}${vertexConfig.C}${vertexConfig.A}`,
      options: [
        { id: 'opt3', text: `∠${vertexConfig.B}${vertexConfig.C}${vertexConfig.A} (угол 3)`, isCorrect: true },
        { id: 'opt1', text: `∠${vertexConfig.B}${vertexConfig.A}${vertexConfig.C} (угол 1)`, isCorrect: false },
        { id: 'opt4', text: `∠${vertexConfig.A}${vertexConfig.C}${vertexConfig.D} (угол 4)`, isCorrect: false },
        { id: 'opt6', text: `∠${vertexConfig.A}${vertexConfig.D}${vertexConfig.C} (угол 6)`, isCorrect: false },
      ],
      explanation: `При сторонах ${vertexConfig.B}${vertexConfig.C} ∥ ${vertexConfig.A}${vertexConfig.D} и секущей ${vertexConfig.A}${vertexConfig.C} накрест лежащими являются углы 2 и 3. Поэтому ∠${vertexConfig.C}${vertexConfig.A}${vertexConfig.D} = ∠${vertexConfig.B}${vertexConfig.C}${vertexConfig.A}!`,
      pairIndex: 1,
    },
    {
      id: 2,
      question: `Какой угол равен углу ∠${vertexConfig.A}${vertexConfig.B}${vertexConfig.C} (угол 5) как противоположный угол параллелограмма?`,
      correctAngleId: 6,
      correctNotation: `∠${vertexConfig.A}${vertexConfig.D}${vertexConfig.C}`,
      options: [
        { id: 'opt6', text: `∠${vertexConfig.A}${vertexConfig.D}${vertexConfig.C} (угол 6)`, isCorrect: true },
        { id: 'opt1', text: `∠${vertexConfig.B}${vertexConfig.A}${vertexConfig.C} (угол 1)`, isCorrect: false },
        { id: 'opt2', text: `∠${vertexConfig.C}${vertexConfig.A}${vertexConfig.D} (угол 2)`, isCorrect: false },
        { id: 'opt3', text: `∠${vertexConfig.B}${vertexConfig.C}${vertexConfig.A} (угол 3)`, isCorrect: false },
      ],
      explanation: `Противоположные углы параллелограмма равны по его свойству: ∠${vertexConfig.A}${vertexConfig.B}${vertexConfig.C} = ∠${vertexConfig.A}${vertexConfig.D}${vertexConfig.C}!`,
      pairIndex: 2,
    },
  ];

  const currentChallenge = challenges[challengeStep];

  const selectPair = (idx: number) => {
    setActivePairIndex(idx);
    const pair = EQUAL_ANGLE_PAIRS[idx];
    onSetHighlightedAngles([pair.angle1Id, pair.angle2Id]);
    onSetZPair({
      parallelLines: pair.parallelLines(vertexConfig),
      angle1: pair.angle1Id,
      angle2: pair.angle2Id,
    });
  };

  React.useEffect(() => {
    selectPair(0);
    return () => {
      onSetZPair(null);
      onSetHighlightedAngles([]);
    };
  }, []);

  const handleChallengeOption = (optId: string) => {
    playClick();
    setChallengeAnswers((prev) => ({ ...prev, [challengeStep]: optId }));

    const isCorrect = currentChallenge.options.find((o) => o.id === optId)?.isCorrect;
    if (isCorrect) {
      playSuccess();
      setChallengeSolved((prev) => ({ ...prev, [challengeStep]: true }));
      onScoreIncrement();
    } else {
      playError();
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Равные углы параллелограмма
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Накрест лежащие углы при диагонали и противоположные углы
          </p>
        </div>

        <button
          onClick={() => {
            playClick();
            setShowZOverlay(!showZOverlay);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          {showZOverlay ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-slate-500" />
              <span>Скрыть Z-линии</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Включить Z-линии</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Pairs Explorer Tabs */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {EQUAL_ANGLE_PAIRS.map((pair, idx) => {
          const isSelected = activePairIndex === idx;
          return (
            <button
              key={pair.id}
              onClick={() => {
                playClick();
                selectPair(idx);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/80 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 truncate">
                  Углы {pair.angle1Id} = {pair.angle2Id}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                {pair.reason(vertexConfig)}
              </p>
            </button>
          );
        })}
      </div>

      {/* Detail explanation of selected pair */}
      {activePairIndex !== null && (
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 font-mono text-sm">
              {EQUAL_ANGLE_PAIRS[activePairIndex].title(vertexConfig)}
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium text-[11px]">
              Пара {activePairIndex + 1}
            </span>
          </div>
          <p className="mt-2 text-slate-700 leading-relaxed">
            <strong>Обоснование:</strong> {EQUAL_ANGLE_PAIRS[activePairIndex].reason(vertexConfig)}.
          </p>
          <div className="mt-2 flex flex-wrap gap-4 text-slate-600">
            <div>
              Параллельные прямые:{' '}
              <strong className="font-mono text-slate-900">
                {EQUAL_ANGLE_PAIRS[activePairIndex].parallelLines(vertexConfig)}
              </strong>
            </div>
            <div>
              Секущая:{' '}
              <strong className="font-mono text-slate-900">
                {EQUAL_ANGLE_PAIRS[activePairIndex].transversal(vertexConfig)}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Challenge Section */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Проверь себя: задание {challengeStep + 1} из {challenges.length}
            </span>
          </div>
          <div className="flex gap-1.5">
            {challenges.map((c, i) => (
              <button
                key={c.id}
                onClick={() => {
                  playClick();
                  setChallengeStep(i);
                  selectPair(c.pairIndex);
                }}
                className={`w-6 h-6 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                  challengeStep === i
                    ? 'bg-blue-600 text-white'
                    : challengeSolved[i]
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <h4 className="text-sm font-bold text-slate-900 mt-2">
          {currentChallenge.question}
        </h4>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {currentChallenge.options.map((opt) => {
            const isSelected = challengeAnswers[challengeStep] === opt.id;
            const isAnswered = !!challengeAnswers[challengeStep];

            let optStyle = 'border-slate-200 hover:border-blue-400 bg-white text-slate-800';

            if (isAnswered) {
              if (opt.isCorrect) {
                optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-500';
              } else if (isSelected) {
                optStyle = 'border-rose-400 bg-rose-50 text-rose-900';
              } else {
                optStyle = 'border-slate-200 opacity-60 text-slate-500';
              }
            }

            return (
              <button
                key={opt.id}
                disabled={isAnswered}
                onClick={() => handleChallengeOption(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-mono flex items-center justify-between transition-all cursor-pointer ${optStyle}`}
              >
                <span>{opt.text}</span>
                {isAnswered && opt.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                )}
                {isAnswered && !opt.isCorrect && isSelected && (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {challengeAnswers[challengeStep] && (
          <div className="mt-3 p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
            <span className="font-bold">Пояснение:</span> {currentChallenge.explanation}
          </div>
        )}
      </div>
    </div>
  );
};
