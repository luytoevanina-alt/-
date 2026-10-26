import React from 'react';
import { BookOpen, Volume2, VolumeX, Printer, RotateCcw } from 'lucide-react';
import { playClick } from '../utils/audio';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenTheory: () => void;
  onOpenPrint: () => void;
  onResetProgress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenTheory,
  onOpenPrint,
  onResetProgress,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            ∠
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
              ГеоТренер <span className="text-blue-600">8 класс</span>
            </h1>
            <p className="text-[11px] text-slate-500 hidden sm:block">Параллелограмм · Обозначение углов тремя буквами</p>
          </div>
        </div>

        {/* Zone 2: Navigation / Info */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => {
              playClick();
              onOpenTheory();
            }}
            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Памятка правил</span>
          </button>
          <button
            onClick={() => {
              playClick();
              onOpenPrint();
            }}
            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Распечатать карточки</span>
          </button>
        </div>

        {/* Zone 3: Primary action & controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              playClick();
              onToggleSound();
            }}
            title={soundEnabled ? 'Выключить звук' : 'Включить звук'}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Звук"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            onClick={() => {
              playClick();
              onResetProgress();
            }}
            title="Сбросить счет и начать заново"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Сброс"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              playClick();
              onOpenTheory();
            }}
            className="md:hidden px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
          >
            Памятка
          </button>
        </div>
      </div>
    </header>
  );
};
