import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Check, RotateCcw, Sparkles, ArrowLeftRight } from 'lucide-react';
import { ANGLES } from '../../data/trainerData';
import { AngleInfo, VertexConfig } from '../../types/geometry';
import { playClick, playSuccess, playError } from '../../utils/audio';

interface MatchingModeProps {
  vertexConfig: VertexConfig;
  onHoverAngle: (angle: AngleInfo | null) => void;
  onSetHighlightedAngles: (ids: number[]) => void;
  onScoreIncrement: () => void;
}

export const MatchingMode: React.FC<MatchingModeProps> = ({
  vertexConfig,
  onHoverAngle,
  onSetHighlightedAngles,
  onScoreIncrement,
}) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedLetterId, setSelectedLetterId] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [wrongAttempt, setWrongAttempt] = useState<{ number: number; letter: number } | null>(null);
  const [useSecondaryNotation, setUseSecondaryNotation] = useState(false);
  const [shuffledLetterAngleIds, setShuffledLetterAngleIds] = useState<number[]>([]);

  // Shuffle right column on mount or restart
  const resetGame = () => {
    const ids = ANGLES.map((a) => a.id);
    // Fisher-Yates shuffle
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setShuffledLetterAngleIds(ids);
    setMatchedPairs([]);
    setSelectedNumber(null);
    setSelectedLetterId(null);
    setWrongAttempt(null);
    onSetHighlightedAngles([]);
    onHoverAngle(null);
  };

  useEffect(() => {
    resetGame();
  }, []);

  const handleSelectNumber = (id: number) => {
    if (matchedPairs.includes(id)) return;
    playClick();
    setSelectedNumber(id);
    const angle = ANGLES.find((a) => a.id === id);
    if (angle) onHoverAngle(angle);

    if (selectedLetterId !== null) {
      checkMatch(id, selectedLetterId);
    }
  };

  const handleSelectLetter = (id: number) => {
    if (matchedPairs.includes(id)) return;
    playClick();
    setSelectedLetterId(id);
    const angle = ANGLES.find((a) => a.id === id);
    if (angle) onHoverAngle(angle);

    if (selectedNumber !== null) {
      checkMatch(selectedNumber, id);
    }
  };

  const checkMatch = (numId: number, letId: number) => {
    if (numId === letId) {
      playSuccess();
      const updated = [...matchedPairs, numId];
      setMatchedPairs(updated);
      setSelectedNumber(null);
      setSelectedLetterId(null);
      setWrongAttempt(null);
      onSetHighlightedAngles(updated);
      onScoreIncrement();

      if (updated.length === ANGLES.length) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } else {
      playError();
      setWrongAttempt({ number: numId, letter: letId });
      setTimeout(() => {
        setSelectedNumber(null);
        setSelectedLetterId(null);
        setWrongAttempt(null);
      }, 700);
    }
  };

  const isAllMatched = matchedPairs.length === ANGLES.length && ANGLES.length > 0;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Задание на соответствие
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Соедини номер угла на чертеже с его верным трехбуквенным именем
          </p>
        </div>

        {/* Toggle secondary notation (left-to-right vs right-to-left) */}
        <button
          onClick={() => {
            playClick();
            setUseSecondaryNotation(!useSecondaryNotation);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          title="Переключить порядок записи букв"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
          <span>
            {useSecondaryNotation ? 'Обратная запись (напр. ∠CAB)' : 'Прямая запись (напр. ∠BAC)'}
          </span>
        </button>
      </div>

      {/* Progress & instructions */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>
          Совпадений: <strong className="text-slate-900">{matchedPairs.length}</strong> из{' '}
          <strong>{ANGLES.length}</strong>
        </span>
        <span className="italic">
          {selectedNumber && !selectedLetterId ? 'Теперь выбери буквенное имя справа ➔' : ''}
          {!selectedNumber && selectedLetterId ? '⮠ Теперь выбери номер угла слева' : ''}
          {!selectedNumber && !selectedLetterId && !isAllMatched
            ? 'Кликни по номеру угла, затем по его названию'
            : ''}
        </span>
      </div>

      {/* Matching Grid */}
      <div className="mt-4 grid grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column: Number Badges */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider pb-1">
            Номер на чертеже
          </div>
          {ANGLES.map((angle) => {
            const isMatched = matchedPairs.includes(angle.id);
            const isSelected = selectedNumber === angle.id;
            const isWrong = wrongAttempt?.number === angle.id;

            let cardStyle =
              'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/30 text-slate-800';

            if (isMatched) {
              cardStyle = 'border-emerald-300 bg-emerald-50/80 text-emerald-800 opacity-80';
            } else if (isWrong) {
              cardStyle = 'border-rose-400 bg-rose-50 text-rose-900 ring-2 ring-rose-400';
            } else if (isSelected) {
              cardStyle = 'border-blue-500 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500';
            }

            return (
              <button
                key={angle.id}
                disabled={isMatched}
                onClick={() => handleSelectNumber(angle.id)}
                onMouseEnter={() => !isMatched && onHoverAngle(angle)}
                onMouseLeave={() => onHoverAngle(null)}
                className={`w-full p-3 rounded-xl border text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: angle.color }}
                  >
                    {angle.numberLabel}
                  </span>
                  <div className="text-xs sm:text-sm font-semibold">
                    Угол № {angle.numberLabel}
                  </div>
                </div>
                {isMatched && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            );
          })}
        </div>

        {/* Right Column: 3-Letter notations */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider pb-1">
            Буквенное имя (3 вершины)
          </div>
          {shuffledLetterAngleIds.map((angleId) => {
            const angle = ANGLES.find((a) => a.id === angleId);
            if (!angle) return null;

            const isMatched = matchedPairs.includes(angle.id);
            const isSelected = selectedLetterId === angle.id;
            const isWrong = wrongAttempt?.letter === angle.id;

            let cardStyle =
              'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/30 text-slate-800';

            if (isMatched) {
              cardStyle = 'border-emerald-300 bg-emerald-50/80 text-emerald-800 opacity-80';
            } else if (isWrong) {
              cardStyle = 'border-rose-400 bg-rose-50 text-rose-900 ring-2 ring-rose-400';
            } else if (isSelected) {
              cardStyle = 'border-blue-500 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500';
            }

            const angleName = useSecondaryNotation
              ? angle.nameSecondary(vertexConfig)
              : angle.namePrimary(vertexConfig);

            return (
              <button
                key={angle.id}
                disabled={isMatched}
                onClick={() => handleSelectLetter(angle.id)}
                onMouseEnter={() => !isMatched && onHoverAngle(angle)}
                onMouseLeave={() => onHoverAngle(null)}
                className={`w-full p-3 rounded-xl border text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${cardStyle}`}
              >
                <div className="font-mono text-sm sm:text-base font-bold tracking-wide">
                  {angleName}
                </div>
                {isMatched ? (
                  <span className="text-[11px] font-sans font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                    Угол {angle.numberLabel}
                  </span>
                ) : (
                  <span className="text-[11px] font-sans text-slate-400">
                    вершина {vertexConfig[angle.vertex]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Completion Banner */}
      {isAllMatched && (
        <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center animate-in fade-in">
          <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-sm">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>Превосходно! Все 6 углов сопоставлены безошибочно!</span>
          </div>
          <p className="text-xs text-emerald-700 mt-1">
            Теперь ты видишь: направление записи не имеет значения, главное — вершина всегда в середине!
          </p>
          <div className="mt-3">
            <button
              onClick={() => {
                playClick();
                resetGame();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Попробовать еще раз (с перемешиванием)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
