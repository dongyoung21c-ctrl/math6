import React, { useState } from 'react';
import { Question, DiagramConfig } from '../types/quiz';
import { X, Plus, Trash2, Edit3, RotateCcw, Check, AlertCircle, Save, Sparkles, Eye } from 'lucide-react';
import { sounds } from '../utils/audio';

interface TeacherEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  onSaveQuestions: (updated: Question[]) => void;
  onResetToDefaults: () => void;
}

export const TeacherEditorModal: React.FC<TeacherEditorModalProps> = ({
  isOpen,
  onClose,
  questions,
  onSaveQuestions,
  onResetToDefaults,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Form states for creating or editing
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formOptions, setFormOptions] = useState<[string, string, string, string]>(['', '', '', '']);
  const [formCorrectAnswer, setFormCorrectAnswer] = useState<number>(0);
  const [formExplanation, setFormExplanation] = useState('');
  const [formDiagramType, setFormDiagramType] = useState<'none' | 'top_number_grid'>('none');
  const [gridValues, setGridValues] = useState<number[][]>([[2, 1], [3, 1]]);

  if (!isOpen) return null;

  const startEdit = (q: Question) => {
    sounds.playClick();
    setEditingId(q.id);
    setIsCreatingNew(false);
    setFormTitle(q.title);
    setFormSubtitle(q.subtitle || '');
    setFormOptions([...q.options] as [string, string, string, string]);
    setFormCorrectAnswer(q.correctAnswer);
    setFormExplanation(q.explanation);

    if (q.diagram?.type === 'top_number_grid' && q.diagram.topNumberGrid) {
      setFormDiagramType('top_number_grid');
      const g = q.diagram.topNumberGrid.grid.map(row => row.map(v => v ?? 0));
      setGridValues(g);
    } else {
      setFormDiagramType('none');
      setGridValues([[2, 1], [3, 1]]);
    }
  };

  const startCreate = () => {
    sounds.playClick();
    setEditingId(null);
    setIsCreatingNew(true);
    setFormTitle('');
    setFormSubtitle('');
    setFormOptions(['', '', '', '']);
    setFormCorrectAnswer(0);
    setFormExplanation('');
    setFormDiagramType('none');
    setGridValues([[2, 1], [3, 1]]);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      alert('문제 내용을 입력해 주세요.');
      return;
    }
    if (formOptions.some((opt) => !opt.trim())) {
      alert('보기 4개를 모두 입력해 주세요.');
      return;
    }
    if (!formExplanation.trim()) {
      alert('한 줄 해설을 입력해 주세요.');
      return;
    }

    let diagramConfig: DiagramConfig | undefined = undefined;
    if (formDiagramType === 'top_number_grid') {
      diagramConfig = {
        type: 'top_number_grid',
        topNumberGrid: {
          rows: gridValues.length,
          cols: gridValues[0].length,
          grid: gridValues,
          label: '위에서 본 모양 (칸 안의 수: 쌓은 층수)',
        },
        customCaption: '각 자리에 쌓인 쌓기나무 개수를 확인해 보세요.',
      };
    }

    sounds.playCorrect();

    if (isCreatingNew) {
      const newQuestion: Question = {
        id: `custom_${Date.now()}`,
        title: formTitle.trim(),
        subtitle: formSubtitle.trim() || undefined,
        options: formOptions.map((o) => o.trim()) as [string, string, string, string],
        correctAnswer: formCorrectAnswer,
        explanation: formExplanation.trim(),
        diagram: diagramConfig,
      };
      onSaveQuestions([...questions, newQuestion]);
      setIsCreatingNew(false);
    } else if (editingId) {
      const updated = questions.map((q) => {
        if (q.id === editingId) {
          return {
            ...q,
            title: formTitle.trim(),
            subtitle: formSubtitle.trim() || undefined,
            options: formOptions.map((o) => o.trim()) as [string, string, string, string],
            correctAnswer: formCorrectAnswer,
            explanation: formExplanation.trim(),
            diagram: diagramConfig || q.diagram,
          };
        }
        return q;
      });
      onSaveQuestions(updated);
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (questions.length <= 1) {
      alert('최소 1문제 이상 있어야 합니다.');
      return;
    }
    if (confirm('이 문제를 삭제하시겠습니까?')) {
      sounds.playClick();
      const updated = questions.filter((q) => q.id !== id);
      onSaveQuestions(updated);
      if (editingId === id) {
        setEditingId(null);
      }
    }
  };

  const handleResetDefaults = () => {
    if (confirm('단원 기본 5문제로 초기화하시겠습니까? 작성한 변경사항은 리셋됩니다.')) {
      sounds.playClick();
      onResetToDefaults();
      setEditingId(null);
      setIsCreatingNew(false);
    }
  };

  const isFormOpen = isCreatingNew || editingId !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-pop-in">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-sky-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              ✏️
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-800 font-jua">
                교사용 문제 편집기
              </h2>
              <p className="text-xs text-slate-500">
                수정한 문제는 바로 학생 퀴즈에 반영되며 현재 기기에 저장됩니다.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {isFormOpen ? (
            /* Edit / Create Form */
            <form onSubmit={handleSaveForm} className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-black text-slate-800 font-jua text-base sm:text-lg">
                  {isCreatingNew ? '새 문제 추가하기' : '문제 수정하기'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingId(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                >
                  취소하고 목록 보기
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                  문제 내용 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="예: 쌓기나무로 쌓은 모양을 보고..."
                  className="w-full p-2.5 sm:p-3 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-400 bg-white"
                  required
                />
              </div>

              {/* Subtitle / Hint */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                  보조 안내문 / 힌트 (선택)
                </label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="예: 위에서 본 모양의 수를 모두 더해 보세요."
                  className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-400 bg-white"
                />
              </div>

              {/* 4 Options & Correct Answer Radio */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                  보기 4개 및 정답 선택 <span className="text-rose-500">*</span>
                </label>
                <p className="text-xs text-slate-500 mb-2">정답인 보기 앞의 동그라미를 선택해 주세요.</p>
                <div className="space-y-2">
                  {(['①', '②', '③', '④'] as const).map((numLabel, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                        formCorrectAnswer === idx
                          ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-300'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="correctAnswerGroup"
                        id={`opt_${idx}`}
                        checked={formCorrectAnswer === idx}
                        onChange={() => setFormCorrectAnswer(idx)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer ml-1"
                      />
                      <label htmlFor={`opt_${idx}`} className="font-bold text-sm cursor-pointer shrink-0">
                        {numLabel}
                      </label>
                      <input
                        type="text"
                        value={formOptions[idx]}
                        onChange={(e) => {
                          const newOpts = [...formOptions] as [string, string, string, string];
                          newOpts[idx] = e.target.value;
                          setFormOptions(newOpts);
                        }}
                        placeholder={`보기 ${idx + 1} 내용`}
                        className="flex-1 p-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-300 bg-white"
                        required
                      />
                      {formCorrectAnswer === idx && (
                        <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                          정답
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* One-Line Explanation */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                  한 줄 해설 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  placeholder="예: 각 자리에 적힌 숫자를 모두 더하면 7개입니다."
                  className="w-full p-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-400 bg-white"
                  required
                />
              </div>

              {/* Diagram Options */}
              <div className="pt-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                  도형 그림 유형
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormDiagramType('none')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border cursor-pointer ${
                      formDiagramType === 'none'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    그림 없음 (글만 표시)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormDiagramType('top_number_grid')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border cursor-pointer ${
                      formDiagramType === 'top_number_grid'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    위에서 본 모양 수 격자 (2×2)
                  </button>
                </div>

                {formDiagramType === 'top_number_grid' && (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 inline-block">
                    <span className="text-xs text-slate-500 font-bold block mb-2">
                      각 자리의 층수 숫자 (0은 빈칸)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {gridValues.map((row, rIdx) =>
                        row.map((val, cIdx) => (
                          <input
                            key={`${rIdx}-${cIdx}`}
                            type="number"
                            min="0"
                            max="9"
                            value={val}
                            onChange={(e) => {
                              const newGrid = gridValues.map((r, ri) =>
                                r.map((c, ci) => (ri === rIdx && ci === cIdx ? parseInt(e.target.value) || 0 : c))
                              );
                              setGridValues(newGrid);
                            }}
                            className="w-12 h-12 text-center text-lg font-bold border rounded-lg bg-amber-50 border-amber-300"
                          />
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isCreatingNew ? '새 문제 등록' : '수정사항 저장'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Question List View */
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <span className="text-xs sm:text-sm font-bold text-slate-600">
                  현재 등록된 문제: <b className="text-indigo-600">{questions.length}문항</b>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetDefaults}
                    className="px-2.5 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                    title="초기 기본 5문제로 리셋"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>기본 5문항 초기화</span>
                  </button>
                  <button
                    onClick={startCreate}
                    className="px-3 py-1.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>새 문제 추가</span>
                  </button>
                </div>
              </div>

              {/* Question Cards */}
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 transition-all shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 font-black text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-snug break-keep">
                            {q.title}
                          </h3>
                          {q.subtitle && (
                            <p className="text-xs text-slate-400 mt-0.5">{q.subtitle}</p>
                          )}
                        </div>
                      </div>

                      {/* Controls: Edit / Delete */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(q)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="수정하기"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="삭제하기"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Preview of choices */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-3 pt-2.5 border-t border-slate-100 text-xs">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-1.5 rounded-lg truncate border ${
                            oIdx === q.correctAnswer
                              ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-800'
                              : 'bg-slate-50 border-slate-100 text-slate-500'
                          }`}
                        >
                          <span>{['①', '②', '③', '④'][oIdx]} </span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>

                    {/* Explanation */}
                    <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                      <span className="font-bold text-slate-700">해설: </span>
                      <span>{q.explanation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            수정한 문제는 즉시 브라우저에 저장되어 퀴즈에 반영됩니다.
          </span>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
