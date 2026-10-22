export type DiagramType = 'none' | 'top_number_grid' | 'layers' | 'views_comparison' | 'isometric_blocks';

export interface TopNumberGridData {
  rows: number;
  cols: number;
  grid: (number | null)[][]; // numbers on the top view
  label?: string;
}

export interface LayersData {
  layer1: number[][]; // 1 if block present, 0 if empty
  layer2: number[][];
  layer3: number[][];
}

export interface ViewsComparisonData {
  top: number[][];
  front: number[][];
  side: number[][];
}

export interface DiagramConfig {
  type: DiagramType;
  topNumberGrid?: TopNumberGridData;
  layers?: LayersData;
  viewsComparison?: ViewsComparisonData;
  customCaption?: string;
}

export interface Question {
  id: string;
  title: string;              // Question prompt (e.g. 쌓기나무로 쌓은 모양을 보고...)
  subtitle?: string;          // Supplementary hint or prompt
  options: [string, string, string, string]; // 4 choices
  correctAnswer: number;      // 0, 1, 2, or 3
  explanation: string;        // One-line clear explanation
  diagram?: DiagramConfig;    // Visual representation for math problem
}

export interface AnswerRecord {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  question: Question;
}

export type ScreenType = 'start' | 'quiz' | 'result';
