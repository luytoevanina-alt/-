/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ListChecks,
  Network,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { Header } from './components/Header';
import { ParallelogramCanvas, VERTEX_COLORS } from './components/ParallelogramCanvas';
import { QuizMode } from './components/modes/QuizMode';
import { MatchingMode } from './components/modes/MatchingMode';
import { ConstructorMode } from './components/modes/ConstructorMode';
import { TheoryModal } from './components/TheoryModal';
import { PrintWorksheetModal } from './components/PrintWorksheetModal';
import { PRESET_CONFIGS, ANGLES } from './data/trainerData';
import { AngleInfo, TrainerMode, VertexConfig, VertexKey } from './types/geometry';
import { getSoundEnabled, setSoundEnabled, playClick } from './utils/audio';

export default function App() {
  // App state
  const [activeMode, setActiveMode] = useState<TrainerMode>('quiz');
  const [selectedConfigPreset, setSelectedConfigPreset] = useState<string>('abcd');
  const [customConfig] = useState<VertexConfig>({
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
  });
  const [soundOn, setSoundOn] = useState<boolean>(getSoundEnabled());
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);
  const [isPrintOpen, setIsPrintOpen] = useState<boolean>(false);
  const [totalScore, setTotalScore] = useState<number>(0);

  // Canvas interactivity state
  const [highlightedAngleIds, setHighlightedAngleIds] = useState<number[]>([1]);
  const [activeRayAngle, setActiveRayAngle] = useState<AngleInfo | null>(null);
  const [selectedVertices, setSelectedVertices] = useState<VertexKey[]>([]);

  // Current active vertex configuration
  const currentPreset = PRESET_CONFIGS.find((p) => p.id === selectedConfigPreset);
  const activeVertexConfig = currentPreset ? currentPreset.cfg : customConfig;

  const handleToggleSound = () => {
    const newVal = !soundOn;
    setSoundOn(newVal);
    setSoundEnabled(newVal);
  };

  const handleResetProgress = () => {
    setTotalScore(0);
    setSelectedVertices([]);
    setHighlightedAngleIds([1]);
    setActiveRayAngle(null);
  };

  const handleSelectAngleFromCanvas = (angleId: number) => {
    playClick();
    const angle = ANGLES.find((a) => a.id === angleId);
    if (angle) {
      setActiveRayAngle(angle);
      setHighlightedAngleIds([angleId]);
    }
  };

  const handleSelectVertexFromCanvas = (vKey: VertexKey) => {
    if (activeMode === 'constructor') {
      if (selectedVertices.length < 3) {
        setSelectedVertices((prev) => [...prev, vKey]);
      }
    } else {
      playClick();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <Header
        soundEnabled={soundOn}
        onToggleSound={handleToggleSound}
        onOpenTheory={() => setIsTheoryOpen(true)}
        onOpenPrint={() => setIsPrintOpen(true)}
        onResetProgress={handleResetProgress}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Top Control Bar: Mode Tabs + Letter Presets + Score */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-5">
          {/* Mode Switcher Tabs (3 Tabs: Test, Matching, Constructor) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/90 rounded-xl overflow-x-auto text-xs sm:text-sm font-medium shadow-2xs">
            <button
              onClick={() => {
                playClick();
                setActiveMode('quiz');
                setHighlightedAngleIds([1]);
                setActiveRayAngle(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeMode === 'quiz'
                  ? 'bg-white text-blue-700 shadow-xs font-bold ring-1 ring-slate-200'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <ListChecks className="w-4 h-4 text-blue-600" />
              <span>1. Тест с выбором ответа</span>
            </button>

            <button
              onClick={() => {
                playClick();
                setActiveMode('matching');
                setHighlightedAngleIds([]);
                setActiveRayAngle(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeMode === 'matching'
                  ? 'bg-white text-amber-700 shadow-xs font-bold ring-1 ring-slate-200'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Network className="w-4 h-4 text-amber-600" />
              <span>2. Задания на соответствие</span>
            </button>

            <button
              onClick={() => {
                playClick();
                setActiveMode('constructor');
                setSelectedVertices([]);
                setHighlightedAngleIds([1]);
                setActiveRayAngle(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeMode === 'constructor'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold ring-1 ring-slate-200'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>3. Интерактивный конструктор</span>
            </button>
          </div>

          {/* Configuration & Score Badges */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            {/* Presets Dropdown / Selector */}
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm shadow-xs">
              <span className="text-slate-500 font-medium">Вершины:</span>
              <select
                value={selectedConfigPreset}
                onChange={(e) => {
                  playClick();
                  setSelectedConfigPreset(e.target.value);
                }}
                className="font-mono font-bold text-slate-800 bg-transparent border-none outline-hidden cursor-pointer"
              >
                {PRESET_CONFIGS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Points Tally */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-amber-900 shadow-xs">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>{totalScore} баллов</span>
            </div>
          </div>
        </div>

        {/* 2-Zone Sandbox: Left Diagram Canvas (Large for desktop screens), Right Interactive Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Visual Stage - Large and Prominent (Col 1-6 or 1-7) */}
          <div className="lg:col-span-7 space-y-4">
            <ParallelogramCanvas
              vertexConfig={activeVertexConfig}
              highlightedAngleIds={highlightedAngleIds}
              activeRayAngle={activeRayAngle}
              onSelectAngle={handleSelectAngleFromCanvas}
              onSelectVertex={handleSelectVertexFromCanvas}
              selectedVertices={selectedVertices}
            />

            {/* Golden Rule Card with Colorful Vertex Legend */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-300 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-base">
                  ★
                </div>
                <div className="flex-1">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                    Золотое правило геометра (8 класс)
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 mt-1.5 leading-relaxed">
                    При трехбуквенном обозначении угла <strong className="font-mono text-blue-700 font-bold">∠{activeVertexConfig.B}{activeVertexConfig.A}{activeVertexConfig.C}</strong> буква вершины (<strong className="text-blue-700 font-bold underline">{activeVertexConfig.A}</strong>) ВСЕГДА стоит <u>строго в центре</u>!
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 font-bold text-blue-700">
                      Вершина {activeVertexConfig.A} (синяя)
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 font-bold text-emerald-700">
                      Вершина {activeVertexConfig.B} (зеленая)
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 font-bold text-purple-700">
                      Вершина {activeVertexConfig.C} (фиолетовая)
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 font-bold text-rose-700">
                      Вершина {activeVertexConfig.D} (красная)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Interactive Deck (Col 8-12 or 7-12) */}
          <div className="lg:col-span-5">
            {activeMode === 'quiz' && (
              <QuizMode
                vertexConfig={activeVertexConfig}
                onHoverAngle={setActiveRayAngle}
                onSetHighlightedAngles={setHighlightedAngleIds}
                onScoreIncrement={() => setTotalScore((s) => s + 10)}
              />
            )}

            {activeMode === 'matching' && (
              <MatchingMode
                vertexConfig={activeVertexConfig}
                onHoverAngle={setActiveRayAngle}
                onSetHighlightedAngles={setHighlightedAngleIds}
                onScoreIncrement={() => setTotalScore((s) => s + 10)}
              />
            )}

            {activeMode === 'constructor' && (
              <ConstructorMode
                vertexConfig={activeVertexConfig}
                selectedVertices={selectedVertices}
                onSelectVertex={(vKey) => setSelectedVertices((prev) => [...prev, vKey])}
                onClearVertices={() => setSelectedVertices([])}
                onHoverAngle={setActiveRayAngle}
                onSetHighlightedAngles={setHighlightedAngleIds}
                onScoreIncrement={() => setTotalScore((s) => s + 20)}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <TheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
        cfg={activeVertexConfig}
      />

      <PrintWorksheetModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        cfg={activeVertexConfig}
      />

      {/* Subtle Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Учебный тренажер по геометрии для 8 класса · Обозначение углов параллелограмма тремя буквами
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTheoryOpen(true)}
              className="hover:text-blue-600 transition-colors cursor-pointer font-medium"
            >
              Справочник правил
            </button>
            <span>·</span>
            <button
              onClick={() => setIsPrintOpen(true)}
              className="hover:text-blue-600 transition-colors cursor-pointer font-medium"
            >
              Распечатать карточки
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
