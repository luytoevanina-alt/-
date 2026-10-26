import React from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { VertexConfig } from '../types/geometry';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  cfg: VertexConfig;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({ isOpen, onClose, cfg }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Памятка: Как называть углы тремя буквами
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Справочник для 8 класса по теме «Параллелограмм и углы»
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="mt-4 space-y-4 text-sm text-slate-700 max-h-[75vh] overflow-y-auto pr-1">
          {/* Rule 1 */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0 mt-0.5">
                1
              </span>
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  Золотое правило: вершина угла ВСЕГДА в центре!
                </h4>
                <p className="mt-1 leading-relaxed text-slate-600">
                  Когда мы записываем угол тремя буквами, например{' '}
                  <span className="font-mono font-bold text-blue-700">∠{cfg.B}{cfg.A}{cfg.C}</span>,
                  буква посередине (<strong className="text-blue-700 font-bold">{cfg.A}</strong>) обозначает{' '}
                  <strong>вершину угла</strong>, из которой выходят два луча. Первая и третья буквы — это точки на сторонах угла.
                </p>
              </div>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold shrink-0 mt-0.5">
                2
              </span>
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  Порядок крайних букв не имеет значения!
                </h4>
                <p className="mt-1 leading-relaxed text-slate-600">
                  Угол можно читать в любую сторону — слева направо или справа налево:
                </p>
                <div className="mt-2 p-3 bg-white rounded-lg border border-amber-200/80 font-mono text-center font-bold text-slate-900 flex items-center justify-center gap-3">
                  <span className="text-blue-600">∠{cfg.B}{cfg.A}{cfg.C}</span>
                  <span className="text-slate-400">=</span>
                  <span className="text-blue-600">∠{cfg.C}{cfg.A}{cfg.B}</span>
                  <span className="text-xs text-emerald-600 font-sans font-normal ml-2">✓ Это один и тот же угол!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  Почему нельзя назвать угол 1 просто буквой «∠{cfg.A}»?
                </h4>
                <p className="mt-1 leading-relaxed text-slate-600">
                  Потому что диагональ <strong className="font-mono">{cfg.A}{cfg.C}</strong> делит угол при вершине <strong className="font-mono">{cfg.A}</strong> на две части:
                </p>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>Угол 1: <strong className="font-mono">∠{cfg.B}{cfg.A}{cfg.C}</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Угол 2: <strong className="font-mono">∠{cfg.C}{cfg.A}{cfg.D}</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span>Полный угол параллелограмма: <strong className="font-mono">∠{cfg.B}{cfg.A}{cfg.D}</strong></span>
                  </li>
                </ul>
                <p className="mt-2 text-xs text-rose-600 font-medium">
                  Если написать просто «∠{cfg.A}», никто не поймет, какой именно из этих трех углов имеется в виду!
                </p>
              </div>
            </div>
          </div>

          {/* Rule 4 */}
          <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  Цветные подсказки вершин на чертеже
                </h4>
                <p className="mt-1 leading-relaxed text-slate-600 text-xs">
                  Чтобы не путаться в чертеже, каждая вершина выделена своим ярким цветом:
                </p>
                <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold text-center">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-800 border border-blue-200">
                    {cfg.A} — Синяя
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {cfg.B} — Зеленая
                  </div>
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-800 border border-purple-200">
                    {cfg.C} — Фиолетовая
                  </div>
                  <div className="p-2 rounded-lg bg-rose-100 text-rose-800 border border-rose-200">
                    {cfg.D} — Красная
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Понятно, к тренировке!
          </button>
        </div>
      </div>
    </div>
  );
};
