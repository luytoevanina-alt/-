import React, { useState } from 'react';
import { X, Printer, Check } from 'lucide-react';
import { VertexConfig } from '../types/geometry';
import { COORDS } from './ParallelogramCanvas';

interface PrintWorksheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  cfg: VertexConfig;
}

export const PrintWorksheetModal: React.FC<PrintWorksheetModalProps> = ({
  isOpen,
  onClose,
  cfg,
}) => {
  const [includeAnswers, setIncludeAnswers] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const { A, B, C, D } = COORDS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-xl border border-slate-200 relative my-6">
        {/* Modal Controls - Hidden when printing */}
        <div className="print:hidden flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Печать раздаточного материала для урока
            </h3>
            <p className="text-xs text-slate-500">
              Готовая проверочная карточка для 8 класса по чертежу параллелограмма
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeAnswers}
                onChange={(e) => setIncludeAnswers(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Включить ответы для учителя</span>
            </label>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Распечатать</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Worksheet Area */}
        <div id="printable-worksheet" className="p-4 sm:p-8 text-black bg-white">
          {/* Header of Worksheet */}
          <div className="border-b-2 border-black pb-3 mb-4 flex justify-between items-end">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wide">
                Геометрия 8 класс: Параллелограмм и углы
              </h2>
              <p className="text-xs text-gray-600">
                Тема: Трехбуквенное обозначение углов и свойства углов при диагонали
              </p>
            </div>
            <div className="text-xs space-y-1 text-right">
              <div>Фамилия, Имя: ___________________________</div>
              <div>Класс: 8 «____» &nbsp;&nbsp;&nbsp;&nbsp; Дата: ____________</div>
            </div>
          </div>

          {/* Diagram Section */}
          <div className="my-4 flex flex-col md:flex-row items-center gap-6 p-4 border border-gray-300 rounded-lg">
            <div className="w-full max-w-[340px] shrink-0">
              <svg viewBox="0 0 780 490" className="w-full h-auto">
                {/* Polygon with bold stroke */}
                <polygon
                  points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`}
                  fill="#f9fafb"
                  stroke="#000000"
                  strokeWidth="4"
                />
                {/* Diagonal */}
                <line
                  x1={A.x}
                  y1={A.y}
                  x2={C.x}
                  y2={C.y}
                  stroke="#000000"
                  strokeWidth="3"
                  strokeDasharray="8 6"
                />

                {/* Angle 1 Arc */}
                <circle cx={A.x + 46} cy={A.y - 70} r="14" fill="#fff" stroke="#000" strokeWidth="2" />
                <text x={A.x + 46} y={A.y - 65} textAnchor="middle" fontSize="15" fontWeight="bold">1</text>

                {/* Angle 2 Arc (Double) */}
                <circle cx={A.x + 85} cy={A.y - 25} r="14" fill="#fff" stroke="#000" strokeWidth="2" />
                <text x={A.x + 85} y={A.y - 20} textAnchor="middle" fontSize="15" fontWeight="bold">2</text>

                {/* Angle 3 Arc (Double) */}
                <circle cx={C.x - 85} cy={C.y + 25} r="14" fill="#fff" stroke="#000" strokeWidth="2" />
                <text x={C.x - 85} y={C.y + 30} textAnchor="middle" fontSize="15" fontWeight="bold">3</text>

                {/* Angle 4 Arc */}
                <circle cx={C.x - 46} cy={C.y + 70} r="14" fill="#fff" stroke="#000" strokeWidth="2" />
                <text x={C.x - 46} y={C.y + 75} textAnchor="middle" fontSize="15" fontWeight="bold">4</text>

                {/* Angle 5 Arc */}
                <circle cx={B.x + 30} cy={B.y + 55} r="14" fill="#fff" stroke="#000" strokeWidth="2" />
                <text x={B.x + 30} y={B.y + 60} textAnchor="middle" fontSize="15" fontWeight="bold">5</text>

                {/* Angle 6 Arc */}
                <circle cx={D.x - 30} cy={D.y - 55} r="14" fill="#fff" stroke="#000" strokeWidth="2" />
                <text x={D.x - 30} y={D.y - 50} textAnchor="middle" fontSize="15" fontWeight="bold">6</text>

                {/* Vertices with bold lettering */}
                <circle cx={A.x} cy={A.y} r="6" fill="#000" />
                <text x={A.x - 28} y={A.y + 28} fontSize="22" fontWeight="bold" fontStyle="italic">{cfg.A}</text>

                <circle cx={B.x} cy={B.y} r="6" fill="#000" />
                <text x={B.x - 26} y={B.y - 18} fontSize="22" fontWeight="bold" fontStyle="italic">{cfg.B}</text>

                <circle cx={C.x} cy={C.y} r="6" fill="#000" />
                <text x={C.x + 22} y={C.y - 18} fontSize="22" fontWeight="bold" fontStyle="italic">{cfg.C}</text>

                <circle cx={D.x} cy={D.y} r="6" fill="#000" />
                <text x={D.x + 22} y={D.y + 28} fontSize="22" fontWeight="bold" fontStyle="italic">{cfg.D}</text>
              </svg>
            </div>
            <div className="text-xs space-y-2 text-gray-800">
              <p><strong>Дано:</strong> Четырехугольник <span className="font-mono font-bold">{cfg.A}{cfg.B}{cfg.C}{cfg.D}</span> — параллелограмм.</p>
              <p>Отрезок <span className="font-mono font-bold">{cfg.A}{cfg.C}</span> — его диагональ.</p>
              <p className="text-[11px] text-gray-500 italic">
                Внимание: вершина любого угла при трехбуквенной записи всегда располагается в середине!
              </p>
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-4 text-xs">
            <div>
              <p className="font-bold text-sm mb-1.5">
                Задание 1. Выберите верное трехбуквенное обозначение для каждого угла:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="border border-gray-200 p-2 rounded">
                  <p><strong>1) Угол № 1:</strong></p>
                  <p>а) ∠{cfg.B}{cfg.A}{cfg.C} &nbsp;&nbsp; б) ∠{cfg.A}{cfg.B}{cfg.C} &nbsp;&nbsp; в) ∠{cfg.B}{cfg.C}{cfg.A}</p>
                </div>
                <div className="border border-gray-200 p-2 rounded">
                  <p><strong>2) Угол № 2:</strong></p>
                  <p>а) ∠{cfg.C}{cfg.A}{cfg.D} &nbsp;&nbsp; б) ∠{cfg.A}{cfg.C}{cfg.D} &nbsp;&nbsp; в) ∠{cfg.A}{cfg.D}{cfg.C}</p>
                </div>
                <div className="border border-gray-200 p-2 rounded">
                  <p><strong>3) Угол № 3:</strong></p>
                  <p>а) ∠{cfg.B}{cfg.C}{cfg.A} &nbsp;&nbsp; б) ∠{cfg.B}{cfg.A}{cfg.C} &nbsp;&nbsp; в) ∠{cfg.C}{cfg.B}{cfg.A}</p>
                </div>
                <div className="border border-gray-200 p-2 rounded">
                  <p><strong>4) Угол № 4:</strong></p>
                  <p>а) ∠{cfg.A}{cfg.C}{cfg.D} &nbsp;&nbsp; б) ∠{cfg.C}{cfg.A}{cfg.D} &nbsp;&nbsp; в) ∠{cfg.C}{cfg.D}{cfg.A}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="font-bold text-sm mb-1.5">
                Задание 2. Установите соответствие (соедините стрелками):
              </p>
              <div className="flex justify-around items-center border border-gray-300 p-3 rounded">
                <div className="space-y-1.5">
                  <p>Угол 1</p>
                  <p>Угол 2</p>
                  <p>Угол 3</p>
                  <p>Угол 4</p>
                  <p>Угол 5</p>
                </div>
                <div className="text-gray-400">•••••••••••</div>
                <div className="space-y-1.5 font-mono">
                  <p>∠{cfg.B}{cfg.C}{cfg.A}</p>
                  <p>∠{cfg.A}{cfg.B}{cfg.C}</p>
                  <p>∠{cfg.B}{cfg.A}{cfg.C}</p>
                  <p>∠{cfg.A}{cfg.C}{cfg.D}</p>
                  <p>∠{cfg.C}{cfg.A}{cfg.D}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="font-bold text-sm mb-1.5">
                Задание 3. Равные углы:
              </p>
              <p>
                Запишите равенство углов и обоснуйте:
              </p>
              <div className="mt-1 space-y-1 text-gray-700">
                <p>а) Угол 1 = Углу ______ как накрест лежащие при параллельных прямых ____________ и секущей ____________.</p>
                <p>б) Угол 2 = Углу ______ как накрест лежащие при параллельных прямых ____________ и секущей ____________.</p>
                <p>в) Угол 5 = Углу ______ как _____________________________________________________________________.</p>
              </div>
            </div>
          </div>

          {/* Teacher Answers Key (Shown conditionally) */}
          {includeAnswers && (
            <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-400 text-xs">
              <p className="font-bold uppercase text-gray-800">
                Ключ ответов (для учителя):
              </p>
              <p className="mt-1">
                <strong>Задание 1:</strong> 1) а; 2) а; 3) а; 4) а.<br />
                <strong>Задание 2:</strong> Угол 1 ↔ ∠{cfg.B}{cfg.A}{cfg.C}; Угол 2 ↔ ∠{cfg.C}{cfg.A}{cfg.D}; Угол 3 ↔ ∠{cfg.B}{cfg.C}{cfg.A}; Угол 4 ↔ ∠{cfg.A}{cfg.C}{cfg.D}; Угол 5 ↔ ∠{cfg.A}{cfg.B}{cfg.C}.<br />
                <strong>Задание 3:</strong> а) Угол 1 = Углу 4 при {cfg.A}{cfg.B} ∥ {cfg.C}{cfg.D} и секущей {cfg.A}{cfg.C}; б) Угол 2 = Углу 3 при {cfg.B}{cfg.C} ∥ {cfg.A}{cfg.D} и секущей {cfg.A}{cfg.C}; в) Угол 5 = Углу 6 как противоположные углы параллелограмма.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
