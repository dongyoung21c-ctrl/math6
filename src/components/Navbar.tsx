import React from 'react';
import { Volume2, VolumeX, Settings, BookOpen } from 'lucide-react';
import { sounds } from '../utils/audio';

interface NavbarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenTeacherModal: () => void;
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenTeacherModal,
  onGoHome,
}) => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-xs border-b border-amber-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Logo / Chapter Title */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 group text-left transition-transform active:scale-95"
          title="처음으로 이동"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-xs font-black text-lg">
            📐
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                초등 6학년 수학
              </span>
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                단원 복습
              </span>
            </div>
            <div className="text-base sm:text-lg font-black text-slate-800 font-jua leading-tight group-hover:text-amber-600 transition-colors">
              공간과 입체
            </div>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleSound();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-all border border-slate-200 flex items-center gap-1.5 text-xs font-bold"
            title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
            aria-label="효과음 설정"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">소리 켜짐</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline text-slate-400">소리 꺼짐</span>
              </>
            )}
          </button>

          {/* Teacher Mode Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenTeacherModal();
            }}
            className="px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 hover:border-indigo-300 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-bold shadow-xs active:scale-95"
            title="교사용 문제 편집"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
            <span>교사용 편집</span>
          </button>
        </div>
      </div>
    </header>
  );
};
