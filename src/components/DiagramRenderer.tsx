import React from 'react';
import { DiagramConfig } from '../types/quiz';

interface DiagramRendererProps {
  diagram?: DiagramConfig;
}

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({ diagram }) => {
  if (!diagram || diagram.type === 'none') {
    return null;
  }

  return (
    <div className="my-4 p-4 sm:p-5 bg-sky-50/70 border-2 border-sky-200 rounded-2xl flex flex-col items-center justify-center">
      {diagram.type === 'top_number_grid' && diagram.topNumberGrid && (
        <div className="flex flex-col items-center">
          {diagram.topNumberGrid.label && (
            <div className="text-sm sm:text-base font-bold text-sky-900 mb-2 font-jua">
              {diagram.topNumberGrid.label}
            </div>
          )}

          <div className="relative p-2 bg-white rounded-xl shadow-sm border border-sky-200">
            {/* Compass / Direction indicators */}
            <div className="text-center text-xs font-bold text-slate-400 mb-1">▲ 뒤쪽</div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 -rotate-90">왼쪽</span>
              
              <div 
                className="grid gap-2 p-2 bg-amber-50/60 rounded-lg border-2 border-dashed border-amber-300"
                style={{
                  gridTemplateColumns: `repeat(${diagram.topNumberGrid.cols}, minmax(0, 1fr))`
                }}
              >
                {diagram.topNumberGrid.grid.map((row, rIdx) =>
                  row.map((val, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black shadow-sm transition-all ${
                        val !== null && val > 0
                          ? 'bg-amber-400 text-amber-950 border-2 border-amber-500 scale-100 ring-2 ring-amber-200/60'
                          : 'bg-white/80 text-slate-300 border-2 border-slate-200'
                      }`}
                    >
                      {val !== null && val > 0 ? val : ''}
                    </div>
                  ))
                )}
              </div>

              <span className="text-xs font-bold text-slate-400 rotate-90">오른쪽</span>
            </div>
            <div className="text-center text-xs font-bold text-sky-600 mt-1 flex items-center justify-center gap-1">
              <span>▼ 앞쪽에서 바라본 방향</span>
            </div>
          </div>
        </div>
      )}

      {diagram.type === 'layers' && diagram.layers && (
        <div className="flex flex-col items-center w-full">
          <div className="text-sm sm:text-base font-bold text-sky-900 mb-2 font-jua">
            층별로 나타낸 모양
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {[
              { name: '1층 (4개)', grid: diagram.layers.layer1, color: 'bg-emerald-400 border-emerald-500 text-emerald-950' },
              { name: '2층 (2개)', grid: diagram.layers.layer2, color: 'bg-amber-400 border-amber-500 text-amber-950' },
              { name: '3층 (1개)', grid: diagram.layers.layer3, color: 'bg-rose-400 border-rose-500 text-rose-950' },
            ].map((layer, lIdx) => (
              <div key={lIdx} className="bg-white p-3 rounded-xl border border-sky-200 shadow-xs flex flex-col items-center">
                <span className="text-xs sm:text-sm font-bold text-slate-600 mb-1.5">{layer.name}</span>
                <div
                  className="grid gap-1.5 p-1.5 bg-slate-50 rounded-lg border border-slate-200"
                  style={{
                    gridTemplateColumns: `repeat(${layer.grid[0].length}, minmax(0, 1fr))`
                  }}
                >
                  {layer.grid.map((row, rIdx) =>
                    row.map((cell, cIdx) => (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border-2 flex items-center justify-center text-sm font-bold ${
                          cell === 1
                            ? `${layer.color} shadow-xs`
                            : 'bg-white border-dashed border-slate-200'
                        }`}
                      >
                        {cell === 1 ? '■' : ''}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {diagram.type === 'views_comparison' && diagram.viewsComparison && (
        <div className="flex flex-col items-center w-full">
          <div className="text-sm sm:text-base font-bold text-sky-900 mb-2 font-jua">
            방향에 따른 모양 관찰
          </div>
          <div className="flex flex-wrap items-end justify-center gap-5 sm:gap-8 bg-white p-4 rounded-xl border border-sky-200 shadow-xs">
            {/* Top View */}
            <div className="flex flex-col items-center">
              <span className="text-xs sm:text-sm font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md mb-2">
                위에서 본 모양
              </span>
              <div className="flex gap-1">
                {diagram.viewsComparison.top[0].map((_, idx) => (
                  <div key={idx} className="w-8 h-8 rounded bg-sky-400 border-2 border-sky-500 shadow-xs" />
                ))}
              </div>
            </div>

            {/* Front View */}
            <div className="flex flex-col items-center">
              <span className="text-xs sm:text-sm font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md mb-2">
                앞에서 본 모양
              </span>
              <div className="flex gap-1 items-end">
                {/* 3 columns: 2 floors, 1 floor, 3 floors */}
                <div className="flex flex-col-reverse gap-1">
                  <div className="w-8 h-8 rounded bg-amber-400 border-2 border-amber-500 shadow-xs" />
                  <div className="w-8 h-8 rounded bg-amber-400 border-2 border-amber-500 shadow-xs" />
                  <span className="text-[10px] text-center font-bold text-amber-800">2층</span>
                </div>
                <div className="flex flex-col-reverse gap-1">
                  <div className="w-8 h-8 rounded bg-amber-400 border-2 border-amber-500 shadow-xs" />
                  <div className="w-8 h-8 opacity-0" />
                  <span className="text-[10px] text-center font-bold text-amber-800">1층</span>
                </div>
                <div className="flex flex-col-reverse gap-1">
                  <div className="w-8 h-8 rounded bg-amber-400 border-2 border-amber-500 shadow-xs" />
                  <div className="w-8 h-8 rounded bg-amber-400 border-2 border-amber-500 shadow-xs" />
                  <div className="w-8 h-8 rounded bg-amber-400 border-2 border-amber-500 shadow-xs" />
                  <span className="text-[10px] text-center font-bold text-amber-800">3층</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {diagram.customCaption && (
        <p className="text-xs sm:text-sm text-slate-600 mt-2 text-center font-medium">
          💡 {diagram.customCaption}
        </p>
      )}
    </div>
  );
};
