export interface Task {
  id: string;
  title: string;
  subject: "TOÁN HỌC" | "HÓA HỌC" | "TIẾNG ANH" | "TỔNG HỢP";
  duration: string;
  questions: string;
  xp: number;
  completed: boolean;
  colorClass: string;
  icon: string;
}

export interface Activity {
  id: string;
  text: string;
  xp: number;
  time: string;
  icon: string;
  type: 'complete' | 'correct' | 'check' | 'subject';
}

export interface SubjectProgress {
  name: string;
  percentage: number;
  colorValue: string;
  colorClass: string;
  totalHours: string;
  rank: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date | string;
}

export interface Lesson {
  id: string;
  title: string;
  subject: "Toán học" | "Vật lý" | "Hóa học" | "Tiếng Anh";
  topic: string;
  duration: string;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  completed: boolean;
  content: string;
  summary: string;
  formula?: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation: string;
  formula?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: "Toán học" | "Vật lý" | "Hóa học" | "Tiếng Anh";
  questions: Question[];
  xpReward: number;
  duration: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: "Toán học" | "Vật lý" | "Hóa học" | "Tiếng Anh" | "Môn tổng hợp";
  durationMinutes: number;
  questions: Question[];
}

export interface ExamAttempt {
  id: string;
  examTitle: string;
  subject: string;
  score: number; // Thang điểm 10
  correctCount: number;
  totalQuestions: number;
  date: string;
  timeSpent: string; // Định dạng mm:ss
}
