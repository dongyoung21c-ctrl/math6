import React, { useState } from 'react';
import { Question } from '../types/quiz';
import { DiagramRenderer } from './DiagramRenderer';
import { CheckCircle2, XCircle, ArrowRight, Lightbulb, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

interface QuizScreenProps {
  questions: Question[];
  currentIndex: number;
  onSelectAnswer: (answerIndex: number) => void;
  onNextQuestion: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  currentIndex,
  onSelectAnswer,
  onNextQuestion,
}) => {
  const currentQ = questions[currentIndex];
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  if (!currentQ) {
    return null;
  }

  const isLastQuestion = currentIndex === questions.length - 1;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleChoiceClick = (index: number) => {
    if (isAnswered) return;

    setSelectedIdx(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctAnswer;
    onSelectAnswer(index);

    if (isCorrect) {
      sounds.playCorrect();
      // Light burst confetti for encouragement
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#fbbf24'],
        });
      } catch {
        // Safe fail
      }
    } else {
      sounds.playIncorrect();
    }
  };

  const handleNextClick = () => {
    sounds.playClick();
    setSelectedIdx(null);
    setIsAnswered(false);
    onNextQuestion();
  };

  const optionNumbers = ['①', '②', '③', '④'];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 animate-pop-in">
      {/* Progress Section */}
      <div className="mb-5 bg-white p-3.5 sm:p-4 rounded-2xl border border-amber-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-800 font-bold text-xs sm:text-sm">
              문제 {currentIndex + 1}
            </span>
            <span className="text-xs sm:text-sm text-slate-400 font-bold">
              / 총 {questions.length}문항
            </span>
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-amber-600 font-jua">
            {progressPercent}% 완료
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-sky-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-7 shadow-sm">
        {/* Question Header */}
        <div className="flex items-start gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 font-black flex items-center justify-center shrink-0 text-base font-jua shadow-xs">
            Q{currentIndex + 1}
          </div>
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 leading-snug break-keep">
              {currentQ.title}
            </h2>
            {currentQ.subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                {currentQ.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Diagram Renderer (if available) */}
        {currentQ.diagram && <DiagramRenderer diagram={currentQ.diagram} />}

        {/* 4 Options Grid */}
        <div className="mt-5 space-y-2.5">
          {currentQ.options.map((optText, idx) => {
            const isSelected = selectedIdx === idx;
            const isThisCorrect = idx === currentQ.correctAnswer;

            let buttonStyle = 'bg-slate-50 hover:bg-amber-50/70 border-slate-200 text-slate-700 hover:border-amber-300';
            let badgeStyle = 'bg-white text-slate-700 border-slate-200';

            if (isAnswered) {
              if (isThisCorrect) {
                // Correct answer is always marked in green
                buttonStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-200 font-bold';
                badgeStyle = 'bg-emerald-500 text-white border-emerald-600';
              } else if (isSelected && !isThisCorrect) {
                // Selected incorrect option marked in red
                buttonStyle = 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-200';
                badgeStyle = 'bg-rose-500 text-white border-rose-600';
              } else {
                // Dim other unselected incorrect options
                buttonStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                badgeStyle = 'bg-slate-100 text-slate-400 border-slate-200';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleChoiceClick(idx)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 text-base sm:text-lg group ${buttonStyle} ${
                  !isAnswered ? 'active:scale-[0.99] cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-sm border shadow-2xs shrink-0 ${badgeStyle}`}
                  >
                    {optionNumbers[idx]}
                  </span>
                  <span className="font-bold leading-snug break-keep">{optText}</span>
                </div>

                {isAnswered && (
                  <div className="shrink-0 flex items-center gap-1 font-bold text-sm">
                    {isThisCorrect && (
                      <span className="flex items-center gap-1 text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-xl text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>정답</span>
                      </span>
                    )}
                    {isSelected && !isThisCorrect && (
                      <span className="flex items-center gap-1 text-rose-600 bg-rose-100 px-2.5 py-1 rounded-xl text-xs sm:text-sm">
                        <XCircle className="w-4 h-4" />
                        <span>오답</span>
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback & One-Line Explanation */}
        {isAnswered && (
          <div className="mt-5 pt-4 border-t-2 border-slate-100 animate-pop-in">
            {selectedIdx === currentQ.correctAnswer ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 mb-4">
                <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-base sm:text-lg mb-1 font-jua">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>맞았습니다! 참 잘했어요! 🎉</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-emerald-900 font-medium">
                  <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">한 줄 해설: </span>
                    <span>{currentQ.explanation}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 mb-4">
                <div className="flex items-center gap-2 text-rose-700 font-extrabold text-base sm:text-lg mb-1 font-jua">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>아쉽게 틀렸어요! 괜찮아요, 다음 문제에서 맞혀봐요! 💪</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-rose-950 font-medium">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-900">한 줄 해설: </span>
                    <span>{currentQ.explanation}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Next / Result Button */}
            <button
              onClick={handleNextClick}
              className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold text-base sm:text-lg font-jua shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
            >
              <span>{isLastQuestion ? '결과 확인하러 가기 🎉' : '다음 문제 풀기'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
