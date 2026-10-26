import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Lightbulb, Sparkles } from 'lucide-react';
import { QUIZ_QUESTIONS, ANGLES } from '../../data/trainerData';
import { AngleInfo, VertexConfig } from '../../types/geometry';
import { playClick, playSuccess, playError } from '../../utils/audio';

interface QuizModeProps {
  vertexConfig: VertexConfig;
  onHoverAngle: (angle: AngleInfo | null) => void;
  onSetHighlightedAngles: (ids: number[]) => void;
  onScoreIncrement: () => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({
  vertexConfig,
  onHoverAngle,
  onSetHighlightedAngles,
  onScoreIncrement,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];
  const options = currentQ.options(vertexConfig);
  const selectedOption = options.find((opt) => opt.id === selectedOptionId);

  // Sync highlight on question change
  React.useEffect(() => {
    if (currentQ.targetAngleId) {
      onSetHighlightedAngles([currentQ.targetAngleId]);
    } else if (currentQ.highlightAngles) {
      onSetHighlightedAngles(currentQ.highlightAngles);
    } else {
      onSetHighlightedAngles([]);
    }
    setShowHint(false);
  }, [currentIndex, currentQ, onSetHighlightedAngles]);

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    playClick();
    setSelectedOptionId(optionId);
    setIsAnswered(true);

    const chosen = options.find((opt) => opt.id === optionId);
    if (chosen?.isCorrect) {
      playSuccess();
      setScore((prev) => prev + 1);
      onScoreIncrement();
    } else {
      playError();
    }
  };

  const handleNext = () => {
    playClick();
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      onHoverAngle(null);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    playClick();
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    onHoverAngle(null);
  };

  if (isFinished) {
    const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
          Тест завершен!
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Твой результат: <span className="font-bold text-slate-900">{score}</span> из{' '}
          <span className="font-bold text-slate-900">{QUIZ_QUESTIONS.length}</span> ({percentage}%)
        </p>

        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 max-w-md mx-auto text-xs text-slate-600 text-left">
          {percentage >= 80 ? (
            <p className="text-emerald-700 font-medium">
              🎉 Отличная работа! Ты уверенно ориентируешься в трехбуквенном обозначении углов и свойствах параллелограмма.
            </p>
          ) : percentage >= 50 ? (
            <p className="text-blue-700 font-medium">
              👍 Хороший результат! Главное правило: буква вершины ВСЕГДА в центре (∠BAC = ∠CAB).
            </p>
          ) : (
            <p className="text-amber-700 font-medium">
              📚 Рекомендуем заглянуть в памятку правил и пройти тест еще раз, чтобы закрепить навык!
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Пройти тест заново</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
      {/* Header bar: Question index & score */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
            Вопрос {currentIndex + 1} из {QUIZ_QUESTIONS.length}
          </span>
          {currentQ.targetAngleId && (
            <span className="text-slate-500 hidden sm:inline">
              (Целевой угол на чертеже: <strong>№ {currentQ.targetAngleId}</strong>)
            </span>
          )}
        </div>
        <div className="text-slate-500 font-medium">
          Счет: <span className="text-slate-900 font-bold">{score}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
        <div
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Question Prompt */}
      <div className="mt-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {currentQ.questionText(vertexConfig)}
        </h3>
        {currentQ.subtitle && (
          <p className="text-xs text-slate-500 mt-1">
            {currentQ.subtitle(vertexConfig)}
          </p>
        )}
      </div>

      {/* Options List */}
      <div className="mt-5 space-y-2.5">
        {options.map((opt, idx) => {
          let btnStyle = 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-800';

          if (isAnswered) {
            if (opt.isCorrect) {
              btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-500';
            } else if (opt.id === selectedOptionId) {
              btnStyle = 'border-rose-400 bg-rose-50 text-rose-900';
            } else {
              btnStyle = 'border-slate-200 opacity-60 text-slate-500';
            }
          }

          // Optional hover detection to highlight corresponding angle on canvas
          const matchedAngle = ANGLES.find(
            (a) =>
              opt.text.includes(a.namePrimary(vertexConfig)) ||
              opt.text.includes(a.nameSecondary(vertexConfig)) ||
              opt.text.includes(`Угол ${a.id}`)
          );

          return (
            <button
              key={opt.id}
              disabled={isAnswered}
              onClick={() => handleSelectOption(opt.id)}
              onMouseEnter={() => matchedAngle && onHoverAngle(matchedAngle)}
              onMouseLeave={() => onHoverAngle(null)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 flex items-center justify-between text-sm cursor-pointer ${btnStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-mono text-sm sm:text-base font-medium">
                  {opt.text}
                </span>
              </div>
              {isAnswered && opt.isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
              )}
              {isAnswered && !opt.isCorrect && opt.id === selectedOptionId && (
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer feedback & Explanation */}
      {isAnswered && selectedOption && (
        <div
          className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed animate-in fade-in duration-200 ${
            selectedOption.isCorrect
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : 'bg-rose-50/80 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-start gap-2">
            {selectedOption.isCorrect ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-bold">
                {selectedOption.isCorrect ? 'Верно!' : 'Обрати внимание:'}
              </span>{' '}
              {selectedOption.explanation}
            </div>
          </div>
        </div>
      )}

      {/* Action Footer: Hint and Next Button */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          {!isAnswered && (
            <button
              onClick={() => {
                playClick();
                setShowHint(!showHint);
              }}
              className="flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-800 font-medium cursor-pointer"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>{showHint ? 'Скрыть подсказку' : 'Нужна подсказка?'}</span>
            </button>
          )}
        </div>

        {isAnswered && (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm ml-auto cursor-pointer"
          >
            <span>{currentIndex + 1 === QUIZ_QUESTIONS.length ? 'Завершить тест' : 'Следующий вопрос'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expandable Hint Box */}
      {showHint && !isAnswered && (
        <div className="mt-3 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2 animate-in fade-in">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>{currentQ.pedagogicalHint(vertexConfig)}</div>
        </div>
      )}
    </div>
  );
};
