import React, { useEffect } from 'react';
import { AnswerRecord } from '../types/quiz';
import { RotateCcw, Home, CheckCircle, XCircle, Award, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

interface ResultScreenProps {
  answers: AnswerRecord[];
  onRetry: () => void;
  onGoHome: () => void;
  onOpenTeacherModal: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  answers,
  onRetry,
  onGoHome,
  onOpenTeacherModal,
}) => {
  const totalCount = answers.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  useEffect(() => {
    sounds.playCelebration();
    try {
      // Big celebratory fireworks confetti
      const end = Date.now() + 1.2 * 1000;
      const interval: NodeJS.Timeout = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2,
          },
        });
      }, 250);
    } catch {
      // Safe fail
    }
  }, []);

  const getCheerMessage = () => {
    if (correctCount === totalCount) {
      return {
        badge: '🏆 공간과 입체 마스터!',
        title: '만점이에요! 완벽해요!',
        desc: '쌓기나무의 모든 방향과 개수를 완벽하게 마스터했습니다!',
        color: 'from-amber-400 to-yellow-500 text-amber-950',
      };
    } else if (correctCount >= Math.ceil(totalCount * 0.7)) {
      return {
        badge: '🌟 우수한 실력자!',
        title: '대단해요! 거의 다 맞혔어요!',
        desc: '틀린 문제의 해설을 다시 읽어보면 다음엔 100점 맞을 거예요!',
        color: 'from-sky-400 to-blue-500 text-blue-950',
      };
    } else {
      return {
        badge: '🌱 노력하는 꿈나무!',
        title: '수고했어요! 좋은 복습이었어요!',
        desc: '해설을 꼼꼼히 확인하고 다시 풀기로 만점에 도전해 보세요!',
        color: 'from-emerald-400 to-teal-500 text-emerald-950',
      };
    }
  };

  const cheer = getCheerMessage();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-8 animate-pop-in">
      {/* Result Card Hero */}
      <div className="bg-white rounded-3xl border-2 border-amber-200 p-6 sm:p-8 text-center shadow-sm relative overflow-hidden mb-6">
        <div className="inline-block px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs sm:text-sm mb-3">
          {cheer.badge}
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 font-jua mb-1">
          {cheer.title}
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto mb-6">
          {cheer.desc}
        </p>

        {/* Score Circles */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 my-3">
          <div className="flex flex-col items-center p-4 bg-amber-50 rounded-2xl border border-amber-200 min-w-32">
            <span className="text-xs font-bold text-amber-700">맞힌 개수</span>
            <div className="text-3xl sm:text-4xl font-black text-amber-600 font-jua mt-0.5">
              {correctCount} <span className="text-base text-slate-400 font-normal">/ {totalCount}</span>
            </div>
          </div>

          <div className="flex flex-col items-center p-4 bg-sky-50 rounded-2xl border border-sky-200 min-w-32">
            <span className="text-xs font-bold text-sky-700">점수 환산</span>
            <div className="text-3xl sm:text-4xl font-black text-sky-600 font-jua mt-0.5">
              {score}<span className="text-xl">점</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: 다시 풀기 & 처음으로 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => {
              sounds.playClick();
              onRetry();
            }}
            className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-lg font-jua shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>다시 풀기</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onGoHome();
            }}
            className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-lg font-jua transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer border border-slate-200"
          >
            <Home className="w-5 h-5 text-slate-500" />
            <span>처음 화면으로</span>
          </button>
        </div>
      </div>

      {/* 문항별 O / X 내역 */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-black text-slate-800 font-jua">
              문항별 O · X 결과 확인
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-bold">
            클릭하여 정답과 해설을 다시 읽어보세요
          </span>
        </div>

        <div className="space-y-3">
          {answers.map((ans, idx) => {
            const isCorrect = ans.isCorrect;
            const chosenOption = ans.question.options[ans.selectedAnswer];
            const correctOption = ans.question.options[ans.question.correctAnswer];

            return (
              <div
                key={ans.questionId || idx}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  isCorrect
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-rose-50/50 border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    {/* Big O / X symbol */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xl shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-rose-500 text-white shadow-xs'
                      }`}
                    >
                      {isCorrect ? 'O' : 'X'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                          {idx + 1}번 문제
                        </span>
                        <span
                          className={`text-xs font-black ${
                            isCorrect ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {isCorrect ? '정답 (+20점)' : '오답'}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-slate-800 mt-1 break-keep">
                        {ans.question.title}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Answer Summary & One-Line Explanation */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-xs sm:text-sm space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-slate-500 font-medium">내가 고른 답:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800 line-through'
                      }`}
                    >
                      {chosenOption}
                    </span>

                    {!isCorrect && (
                      <>
                        <span className="text-slate-400">→</span>
                        <span className="text-slate-500 font-medium">정답:</span>
                        <span className="font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {correctOption}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-start gap-1.5 text-slate-700 bg-white/80 p-2.5 rounded-xl border border-slate-200">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">한 줄 해설: </span>
                      <span>{ans.question.explanation}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Retry Button repeat at bottom for convenience */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              sounds.playClick();
              onRetry();
            }}
            className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base font-jua shadow-sm transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>한 번 더 도전하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
