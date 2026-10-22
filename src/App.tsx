import React, { useState, useEffect } from 'react';
import { ScreenType, Question, AnswerRecord } from './types/quiz';
import { DEFAULT_QUESTIONS } from './data/defaultQuestions';
import { Navbar } from './components/Navbar';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { TeacherEditorModal } from './components/TeacherEditorModal';
import { sounds } from './utils/audio';

const STORAGE_KEY = 'space_solids_quiz_questions_v1';

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('start');
  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    return DEFAULT_QUESTIONS;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => sounds.isEnabled());

  // Save questions whenever updated
  const saveQuestions = (updated: Question[]) => {
    setQuestions(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save questions to localStorage', e);
    }
  };

  const handleResetToDefaults = () => {
    saveQuestions(DEFAULT_QUESTIONS);
  };

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    sounds.setEnabled(nextVal);
    setSoundEnabled(nextVal);
  };

  const handleStartQuiz = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setScreen('quiz');
  };

  const handleSelectAnswer = (selectedAnswerIndex: number) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const record: AnswerRecord = {
      questionId: currentQ.id,
      selectedAnswer: selectedAnswerIndex,
      isCorrect: selectedAnswerIndex === currentQ.correctAnswer,
      question: currentQ,
    };

    setAnswers((prev) => {
      // Replace if existing for this question, or append
      const filtered = prev.filter((a) => a.questionId !== currentQ.id);
      return [...filtered, record];
    });
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setScreen('result');
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setScreen('quiz');
  };

  const handleGoHome = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setScreen('start');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Navbar */}
      <Navbar
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
        onGoHome={handleGoHome}
      />

      {/* Main Screen Content */}
      <main className="flex-1 flex flex-col justify-center items-center py-4">
        {screen === 'start' && (
          <StartScreen
            questionCount={questions.length}
            onStartQuiz={handleStartQuiz}
            onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
          />
        )}

        {screen === 'quiz' && (
          <QuizScreen
            questions={questions}
            currentIndex={currentIndex}
            onSelectAnswer={handleSelectAnswer}
            onNextQuestion={handleNextQuestion}
          />
        )}

        {screen === 'result' && (
          <ResultScreen
            answers={answers}
            onRetry={handleRetry}
            onGoHome={handleGoHome}
            onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
          />
        )}
      </main>

      {/* Teacher Editor Modal */}
      <TeacherEditorModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        questions={questions}
        onSaveQuestions={saveQuestions}
        onResetToDefaults={handleResetToDefaults}
      />

      {/* Educational Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-200/80 bg-white/70">
        <p>초등학교 6학년 수학 ㆍ 2단원 공간과 입체 단원 복습 퀴즈</p>
      </footer>
    </div>
  );
}
