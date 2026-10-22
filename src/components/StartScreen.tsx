import React from 'react';
import { Play, Sparkles, BookCheck, ShieldAlert, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/audio';

interface StartScreenProps {
  questionCount: number;
  onStartQuiz: () => void;
  onOpenTeacherModal: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  questionCount,
  onStartQuiz,
  onOpenTeacherModal,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center animate-pop-in">
      {/* Decorative badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300 shadow-xs mb-4">
        <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
        <span className="text-xs sm:text-sm font-black tracking-wide">초등학교 6학년 2학기 수학</span>
      </div>

      {/* Main Title & Chapter Name */}
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 font-jua leading-tight drop-shadow-xs">
          공간과 입체
        </h1>
        <div className="text-xl sm:text-2xl font-bold text-sky-600 font-jua mt-1">
          단원 복습 퀴즈 🎯
        </div>
        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-md mx-auto">
          쌓기나무 모양을 머릿속으로 돌려보고, 위·앞·옆에서 본 모양을 재미있게 복습해요!
        </p>
      </div>

      {/* Fun 3D Cube Visual Hero */}
      <div className="w-full bg-gradient-to-br from-amber-50 via-sky-50 to-indigo-50 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 mb-6 shadow-sm flex flex-col items-center relative overflow-hidden">
        {/* Playful background decorative shapes */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-200/40 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-sky-200/40 rounded-full blur-xl pointer-events-none" />

        {/* Isometric stacked cubes graphic using SVG */}
        <div className="w-36 h-36 sm:w-44 sm:h-44 relative flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Isometric Cube Helper Defs */}
            <defs>
              <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#facc15" />
              </linearGradient>
              <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="cubeRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>

              {/* Blue Cube Gradients */}
              <linearGradient id="blueTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              <linearGradient id="blueLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              <linearGradient id="blueRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>

            {/* Base layer cubes */}
            {/* Cube 1 (Bottom Left) */}
            <g transform="translate(60, 110)">
              <polygon points="0,0 35,-20 70,0 35,20" fill="url(#cubeTop)" stroke="#b45309" strokeWidth="1.5" />
              <polygon points="0,0 35,20 35,60 0,40" fill="url(#cubeLeft)" stroke="#b45309" strokeWidth="1.5" />
              <polygon points="35,20 70,0 70,40 35,60" fill="url(#cubeRight)" stroke="#b45309" strokeWidth="1.5" />
            </g>
            {/* Cube 2 (Bottom Right) */}
            <g transform="translate(95, 90)">
              <polygon points="0,0 35,-20 70,0 35,20" fill="url(#cubeTop)" stroke="#b45309" strokeWidth="1.5" />
              <polygon points="0,0 35,20 35,60 0,40" fill="url(#cubeLeft)" stroke="#b45309" strokeWidth="1.5" />
              <polygon points="35,20 70,0 70,40 35,60" fill="url(#cubeRight)" stroke="#b45309" strokeWidth="1.5" />
            </g>
            {/* Cube 3 (Second Floor on Cube 1) */}
            <g transform="translate(60, 70)">
              <polygon points="0,0 35,-20 70,0 35,20" fill="url(#blueTop)" stroke="#0369a1" strokeWidth="1.5" />
              <polygon points="0,0 35,20 35,60 0,40" fill="url(#blueLeft)" stroke="#0369a1" strokeWidth="1.5" />
              <polygon points="35,20 70,0 70,40 35,60" fill="url(#blueRight)" stroke="#0369a1" strokeWidth="1.5" />
            </g>
            {/* Cube 4 (Third Floor) */}
            <g transform="translate(60, 30)">
              <polygon points="0,0 35,-20 70,0 35,20" fill="url(#cubeTop)" stroke="#b45309" strokeWidth="1.5" />
              <polygon points="0,0 35,20 35,60 0,40" fill="url(#cubeLeft)" stroke="#b45309" strokeWidth="1.5" />
              <polygon points="35,20 70,0 70,40 35,60" fill="url(#cubeRight)" stroke="#b45309" strokeWidth="1.5" />
            </g>
          </svg>
        </div>

        {/* Feature Highlights for Kids */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full mt-4">
          <div className="bg-white/90 p-2.5 sm:p-3 rounded-2xl border border-amber-200 text-center shadow-2xs">
            <div className="text-base sm:text-lg font-black text-amber-600 font-jua">{questionCount}문제</div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-bold">4지선다형</div>
          </div>
          <div className="bg-white/90 p-2.5 sm:p-3 rounded-2xl border border-sky-200 text-center shadow-2xs">
            <div className="text-base sm:text-lg font-black text-sky-600 font-jua">즉시 확인</div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-bold">정답·오답 표시</div>
          </div>
          <div className="bg-white/90 p-2.5 sm:p-3 rounded-2xl border border-emerald-200 text-center shadow-2xs">
            <div className="text-base sm:text-lg font-black text-emerald-600 font-jua">한 줄 해설</div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-bold">쉽고 명쾌하게</div>
          </div>
        </div>
      </div>

      {/* Start Button - Big & Touch-Friendly */}
      <button
        onClick={() => {
          sounds.playClick();
          onStartQuiz();
        }}
        className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-900 font-black text-xl sm:text-2xl font-jua shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] flex items-center justify-center gap-3 border-2 border-amber-500/80 cursor-pointer"
      >
        <Play className="w-7 h-7 fill-slate-900" />
        <span>퀴즈 시작하기!</span>
      </button>

      {/* Anonymous student notice */}
      <p className="text-xs sm:text-sm text-slate-400 mt-3 flex items-center gap-1.5 font-medium">
        <span>🔒 별도의 이름 입력이나 로그인 없이 편하게 풀 수 있어요</span>
      </p>

      {/* Teacher shortcut */}
      <div className="mt-8 pt-6 border-t border-slate-200 w-full flex flex-col items-center">
        <button
          onClick={() => {
            sounds.playClick();
            onOpenTeacherModal();
          }}
          className="text-xs sm:text-sm text-slate-500 hover:text-indigo-600 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <span>선생님이신가요?</span>
          <span className="text-indigo-600 underline underline-offset-2">문제를 추가하거나 수정하기</span>
        </button>
      </div>
    </div>
  );
};
