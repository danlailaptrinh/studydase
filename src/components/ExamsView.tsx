import React, { useState, useEffect, useRef } from "react";
import { 
  Clock, 
  Award, 
  Send, 
  AlertTriangle, 
  BarChart2, 
  RotateCcw, 
  X, 
  Calendar, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight,
  TrendingUp,
  Sliders,
  ChevronRight
} from "lucide-react";
import { Exam, Question, ExamAttempt } from "../types";
import { mockExams } from "../data/mockDatabase";

interface ExamsViewProps {
  currentXP: number;
  setCurrentXP: React.Dispatch<React.SetStateAction<number>>;
  playSfx: (type: 'check' | 'level' | 'click') => void;
  triggerParticles: () => void;
  addActivity: (text: string, xp: number, icon: string, type: 'complete' | 'correct' | 'check' | 'subject') => void;
  updateSubjectProgress: (subjectName: string, pctAmount: number) => void;
}

export default function ExamsView({
  currentXP,
  setCurrentXP,
  playSfx,
  triggerParticles,
  addActivity,
  updateSubjectProgress
}: ExamsViewProps) {
  const [activePlayExam, setActivePlayExam] = useState<Exam | null>(null);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({}); // Map: questionIdx -> optionIdx
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0); // Seconds
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [examFinished, setExamFinished] = useState<boolean>(false);
  const [finalScoreStats, setFinalScoreStats] = useState<ExamAttempt | null>(null);
  const [attemptsList, setAttemptsList] = useState<ExamAttempt[]>([]);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load attempt logs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("studycase_exam_attempts");
    if (saved) {
      try { setAttemptsList(JSON.parse(saved)); } catch (e) { setAttemptsList([]); }
    }
  }, []);

  const saveAttempt = (attempt: ExamAttempt) => {
    const updated = [attempt, ...attemptsList];
    setAttemptsList(updated);
    localStorage.setItem("studycase_exam_attempts", JSON.stringify(updated));
  };

  // Start selected exam
  const handleStartExam = (selectedExam: Exam) => {
    // Generate full 50 questions
    // First N are detailed from database, subsequent 50-N are dynamically generated
    const dbQuestions = selectedExam.questions;
    const full50: Question[] = [];
    
    // Copy detailed db questions
    dbQuestions.forEach((q, i) => {
      full50.push({ ...q, id: `real_${selectedExam.id}_${i}` });
    });

    // Fill up to 50 questions using smart generators
    const subject = selectedExam.subject;
    const fillers = [
      {
        question: "Phương trình đường thẳng đi qua điểm cực đại và cực tiểu của đồ thị hàm số có đặc điểm gì?",
        options: ["Hệ số góc bằng 2", "Đi qua gốc tọa độ O", "Biểu diễn bằng phần dư của phép chia y cho y'", "Song song với trục hoành"],
        correct: 2,
        explanation: "Phương trình đường thẳng đi qua 2 điểm cực trị của đồ thị hàm số bậc ba chính là phần dư khi chia y cho y'.",
        formula: "y = q(x) * y' + r(x) ⇒ y_đt = r(x)"
      },
      {
        question: "Nguyên nhân chính gây ra tính bazơ yếu của anilin so với etylamin là gì?",
        options: ["Hiệu ứng hút electron của gốc phenyl (-C6H5)", "Hiệu ứng đẩy electron của nhóm alkyl", "Liên kết hydro liên phân tử", "Phản ứng thế gốc của dung dịch Br2"],
        correct: 0,
        explanation: "Nhóm phenyl hút electron cộng hưởng làm mật độ electron trên nguyên tử Nitơ trong nhóm amino của anilin giảm mạnh, dẫn đến lực bazơ giảm nhiều so với amoniac và alkylamin.",
      },
      {
        question: "Biên độ của dao động cưỡng bức khi có hiện tượng cộng hưởng phụ thuộc yếu tố nào?",
        options: ["Biên độ của lực cưỡng bức và lực cản của môi trường", "Tần số của lực cưỡng bức", "Chu kỳ dao động tự do", "Khối lượng của vật nặng"],
        correct: 0,
        explanation: "Biên độ dao động cộng hưởng đạt giá trị cực đại khi tần số cưỡng bức bằng tần số riêng, độ nâng cực đại phụ thuộc tỷ lệ nghịch vào lực cản của hệ môi trường vật chất.",
      },
      {
        question: "Chọn dạng đúng của Collocation: 'Minh Anh has to ______ immediate action to boost her GPA.'",
        options: ["make", "take", "do", "give"],
        correct: 1,
        explanation: "Collocation chính xác: 'take action' (hành động). Câu trên tạm dịch: Minh Anh phải hành động ngay tức khắc để cải thiện điểm trung bình học tập."
      }
    ];

    for (let c = dbQuestions.length + 1; c <= 50; c++) {
      const fillerSeed = fillers[(c + selectedExam.title.length) % fillers.length];
      full50.push({
        id: `filler_${selectedExam.id}_${c}`,
        question: `Câu ${c}: [Bộ Đề Tuyển Chọn 2026] - ${fillerSeed.question.slice(fillerSeed.question.indexOf(":") + 1 || 0)}`,
        options: fillerSeed.options,
        correctAnswer: fillerSeed.correct,
        explanation: fillerSeed.explanation,
        formula: fillerSeed.formula
      });
    }

    setExamQuestions(full50);
    setSelectedAnswers({});
    setCurrentIdx(0);
    setTimeLeft(selectedExam.durationMinutes * 60);
    setExamFinished(false);
    setFinalScoreStats(null);
    setActivePlayExam(selectedExam);
    setTimerRunning(true);
    playSfx('click');
  };

  // Timer Interval Engine
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setTimerRunning(false);
            // Auto submit paper!
            handleForceSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, timeLeft]);

  // Convert seconds to MM:SS format
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rsSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${rsSecs.toString().padStart(2, "0")}`;
  };

  // Skip / Select answer
  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIdx]: optIdx
    }));
    playSfx('click');
  };

  // Complete & Grade paper
  const handleForceSubmit = () => {
    if (!activePlayExam) return;
    setTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate score
    let correctCount = 0;
    examQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const totalCount = examQuestions.length; // 50
    // Vietnamese grading scale out of 10.0 (e.g. correctCount * 0.2)
    const finalScore = Math.round((correctCount / totalCount) * 10 * 10) / 10;
    
    // Earn XP based on score
    const baseXP = 80;
    const scoreBonusXP = Math.round(finalScore * 10);
    const totalXPEarned = baseXP + scoreBonusXP;

    setCurrentXP(prev => prev + totalXPEarned);

    const timeSpentSecs = (activePlayExam.durationMinutes * 60) - timeLeft;
    const spentMins = Math.floor(timeSpentSecs / 60);
    const spentSecs = timeSpentSecs % 60;
    const formattedSpent = `${spentMins.toString().padStart(2, "0")}:${spentSecs.toString().padStart(2, "0")}`;

    const newAttempt: ExamAttempt = {
      id: `attempt_${Date.now()}`,
      examTitle: activePlayExam.title,
      subject: activePlayExam.subject,
      score: finalScore,
      correctCount: correctCount,
      totalQuestions: totalCount,
      date: new Date().toLocaleDateString("vi-VN"),
      timeSpent: formattedSpent
    };

    saveAttempt(newAttempt);
    setFinalScoreStats(newAttempt);
    setExamFinished(true);
    setShowConfirmSubmit(false);
    playSfx('level');
    triggerParticles();

    // Log action to activity list
    const iconSym = activePlayExam.subject === "Toán học" ? "📐" : "🧪";
    addActivity(`Thi thử xong: ${activePlayExam.title} (${finalScore}/10)`, totalXPEarned, "🏆", 'complete');
    updateSubjectProgress(activePlayExam.subject, 8);
  };

  return (
    <div className="space-y-6 animate-slide-up" id="exams-view-root">
      
      {/* 1. Header Hero Card info */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-sky-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-left relative z-10">
          <span className="p-1 px-2.5 bg-white/20 text-white text-[10px] font-extrabold rounded-full tracking-wider uppercase">
            Môi trường khảo tuyển
          </span>
          <h2 className="text-xl sm:text-2xl font-black">Khảo Thử Đề THPT Quốc Gia</h2>
          <p className="text-xs sm:text-sm text-purple-100 max-w-lg">
            Khóa luyện thi tự động định dạng chuẩn 50 câu hỏi dạng bốc ngẫu nhiên. Đồng hồ tích tắc thời gian thực, bảng kiểm soát đáp án chi tiết bám sát áp lực phòng thi.
          </p>
        </div>
        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center shrink-0 min-w-32 relative z-10">
          <Clock className="w-8 h-8 mx-auto text-purple-200 mb-1" />
          <span className="text-xs font-semibold block text-purple-100">Đã làm thử</span>
          <span className="text-2xl font-black text-white">{attemptsList.length} đề</span>
        </div>
        <div className="absolute right-0 top-0 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {!activePlayExam ? (
        /* Exams Selection List Board dashboard */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-4 text-left">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Đề thi thử chính thức có sẵn
            </h3>

            <div className="space-y-4">
              {mockExams.map(exam => (
                <div 
                  key={exam.id}
                  className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between sm:items-center hover:shadow-md transition-all border-l-4 border-l-purple-600"
                >
                  <div className="space-y-1.5 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 rounded-full">
                        {exam.subject}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">• 50 Câu trắc nghiệm</span>
                    </div>
                    <h4 className="font-extrabold text-slate-800 dark:text-white text-sm sm:text-base leading-snug">
                      {exam.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      Thời lượng làm bài quy chuẩn: {exam.durationMinutes} phút • Giám sát tự động nộp bài
                    </p>
                  </div>

                  <button
                    onClick={() => handleStartExam(exam)}
                    className="px-5 py-2 whitespace-nowrap bg-purple-600 hover:bg-purple-700 hover:scale-[1.02] active:scale-[0.98] text-white rounded-xl text-xs font-black self-end sm:self-center uppercase transition-all shadow-md shadow-purple-500/10 cursor-pointer"
                  >
                    Vào Thi
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel attempting logs list */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left h-max">
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5 mb-3">
              <BarChart2 className="w-5 h-5 text-purple-500" />
              <span>Sổ điểm thi thử tốt nghiệp</span>
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 leading-relaxed">
              Thang điểm 10.0 quy chuẩn thi tuyển của Bộ Giáo dục & Đào tạo Việt Nam:
            </p>

            <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
              {attemptsList.map((at, idx) => (
                <div key={at.id || idx} className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs flex justify-between items-center gap-2">
                  <div className="min-w-0">
                    <p className="font-extrabold text-slate-800 dark:text-slate-200 truncate">{at.examTitle}</p>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                      {at.date} • Thời gian: {at.timeSpent}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-block font-black text-xs px-2.5 py-0.5 rounded-lg ${
                      at.score >= 8.0 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" : 
                      at.score >= 5.0 ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20" : "bg-red-50 text-red-600 dark:bg-red-950/20"
                    }`}>
                      {at.score} / 10
                    </span>
                  </div>
                </div>
              ))}

              {attemptsList.length === 0 && (
                <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 text-center text-slate-400 dark:text-slate-500 shadow-sm">
                  <TrendingUp className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <span className="font-semibold text-xs block text-slate-700 dark:text-slate-300">Chưa có lịch sử thi thử</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Vào thi thử bài viết ngay hôm nay để kiểm tra độ nhạy bén!</p>
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* ACTIVE MOCK EXAM IN PROGRESS */
        <div>
          {!examFinished ? (
            /* Running Exam Workspace layout splits in Main Board + Right status grid */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
              
              {/* Left Board Area: Active Question Box  */}
              <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between h-full">
                
                {/* Header state */}
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-600 dark:bg-purple-950/20 rounded-md">
                      CÂU HỎI {currentIdx + 1} / 50
                    </span>
                    <span className="text-xs text-slate-400 font-semibold ml-2">
                      {selectedAnswers[currentIdx] !== undefined ? "✓ Đã chọn" : "✗ Chưa chọn"}
                    </span>
                  </div>
                  
                  {/* Warning Exit trigger */}
                  <button 
                    onClick={() => {
                      if (confirm("🚨 Cậu muốn hủy bỏ đề thi thử này nửa chừng? Kết quả sẽ không được chấm lưu.")) {
                        setActivePlayExam(null);
                        setTimerRunning(false);
                      }
                    }} 
                    className="text-xs text-rose-500 font-semibold hover:underline"
                  >
                    Hủy thi
                  </button>
                </div>

                {/* Content question */}
                <div className="space-y-6 flex-1 min-h-60">
                  <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-150 dark:border-slate-850">
                    <p className="font-black text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
                      {examQuestions[currentIdx]?.question}
                    </p>
                  </div>

                  {/* Options layout */}
                  <div className="space-y-3">
                    {examQuestions[currentIdx]?.options.map((opt, oIdx) => {
                      const isSelected = selectedAnswers[currentIdx] === oIdx;
                      const optLetter = ["A", "B", "C", "D"][oIdx];

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(oIdx)}
                          className={`w-full p-4 rounded-xl border flex items-center gap-3.5 transition-all text-left ${
                            isSelected 
                              ? "border-purple-500 bg-purple-50/20 dark:border-purple-400 dark:bg-purple-950/10 shadow-sm" 
                              : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                          }`}
                        >
                          <span className={`w-7 h-7 rounded-lg border font-bold text-xs flex items-center justify-center shrink-0 ${
                            isSelected 
                              ? "bg-purple-600 border-purple-600 text-white dark:bg-purple-500 dark:border-purple-500" 
                              : "border-slate-200 text-slate-400 dark:border-slate-800"
                          }`}>
                            {optLetter}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {opt}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Next / Prev layout controls */}
                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
                  <button
                    disabled={currentIdx === 0}
                    onClick={() => { setCurrentIdx(prev => prev - 1); playSfx('click'); }}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Prev
                  </button>

                  <button
                    disabled={currentIdx === 49}
                    onClick={() => { setCurrentIdx(prev => prev + 1); playSfx('click'); }}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                  >
                    Next <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Right Sidebar: 1-50 bubbles sheets + submit button + countdown clock */}
              <div className="space-y-6">
                
                {/* Countdown Box */}
                <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 text-center space-y-2.5 shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-bold tracking-widest uppercase">
                    <Clock className="w-4 h-4 text-purple-400 animate-spin" />
                    <span>Thời Gian Còn Lại</span>
                  </div>
                  <h3 className="text-3xl font-mono font-black text-white tracking-widest">
                    {formatTime(timeLeft)}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">Hệ thống chuyển tự động khi bộ đong giây về 0:0</p>
                  <div className="absolute right-0 bottom-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                </div>

                {/* Grid Sheet 1-50 bubbles dashboard */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm text-left">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Phiếu Trả Lời Trắc Nghiệm
                    </h4>
                    <span className="text-[10px] bg-slate-50 dark:bg-slate-950 font-bold text-slate-500 px-2.5 py-0.5 rounded-full">
                      Đã chọn: {Object.keys(selectedAnswers).length} / 50
                    </span>
                  </div>

                  {/* Bubbles grid */}
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 overflow-y-auto max-h-72 pr-1" id="exam-bubble-grid">
                    {Array.from({ length: 50 }).map((_, i) => {
                      const isPlayed = selectedAnswers[i] !== undefined;
                      const isActive = currentIdx === i;

                      let bubbleStyle = "border-slate-200 text-slate-400 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700";
                      
                      if (isPlayed) {
                        bubbleStyle = "bg-purple-600 border-purple-600 text-white dark:bg-purple-500 dark:border-purple-500 dark:text-white";
                      }
                      
                      if (isActive) {
                        bubbleStyle += " ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-950";
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => { setCurrentIdx(i); playSfx('click'); }}
                          className={`w-7 h-7 rounded-full text-[10px] font-black border flex items-center justify-center transition-all cursor-pointer ${bubbleStyle}`}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>

                  {/* Submit CTA button */}
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <button
                      onClick={() => { setShowConfirmSubmit(true); playSfx('click'); }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider"
                    >
                      <Send className="w-4 h-4" /> Nộp bài thi
                    </button>
                  </div>

                </div>

              </div>

            </div>
          ) : (
            /* EXAM FINISHED/GRADED SCREEN RESULTS VIEW */
            <div className="max-w-xl mx-auto bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl space-y-6 text-left animate-slide-up">
              
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-sky-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Award className="w-9 h-9" />
                </div>
                <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                  Hoàn thành Đề thi thử Quốc Gia!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Chúc mừng Minh Anh! Kết quả bài thi thử của bạn đã được đối chiếu chấm tự động.
                </p>
              </div>

              {/* Major score indicator */}
              <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-150 dark:border-slate-850 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Điểm thi thử đạt được</span>
                <h1 className="text-5xl font-black text-purple-600 dark:text-purple-400 font-mono">
                  {finalScoreStats?.score} <span className="text-sm font-semibold text-slate-400">/ 10</span>
                </h1>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Số câu trả lời đúng Chuyên đề: {finalScoreStats?.correctCount} / 50 câu (Tỉ lệ: {Math.round((finalScoreStats?.correctCount || 0) / 50 * 100)}%)
                </p>
              </div>

              {/* Sub-bento metrics blocks */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-850">
                  <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">THỜI GIAN LÀM BÀI</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-100">{finalScoreStats?.timeSpent} phút</span>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-850">
                  <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">TÍCH LŨY KIẾN THỨC</span>
                  <span className="font-extrabold text-emerald-600">+{80 + Math.round((finalScoreStats?.score || 0) * 10)} XP Thưởng</span>
                </div>
              </div>

              {/* Subject Breakdown diagnostics */}
              <div className="p-4 bg-purple-50/20 dark:bg-purple-950/10 rounded-2xl border border-purple-200/20 text-xs text-slate-600 dark:text-slate-300 space-y-3">
                <p className="font-black text-purple-700 dark:text-purple-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <Sliders className="w-4 h-4" /> Báo cáo Phân tích Điểm tự động:
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between font-bold">
                    <span>Nhận xét phổ đề:</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {(finalScoreStats?.score || 0) >= 8.0 ? "Giỏi - Khả năng đỗ cao (Ứng tuyển ĐH Top đầu)" : 
                       (finalScoreStats?.score || 0) >= 5.0 ? "Khá - Mức ổn định (Tự tin đậu Tốt nghiệp)" : "Cần rà soát gấp mảng kỹ năng hổng"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(finalScoreStats?.score || 0) * 10}%` }} />
                  </div>
                </div>
                <p className="leading-relaxed mt-1 text-[11px] text-slate-400 leading-normal">
                  💡 Gợi ý AI: Bạn làm khá chuẩn ở các mảng lý thuyết, tuy nhiên các câu hỏi vận dụng cao 9+ có công thức nâng cao bạn đang xu hướng bỏ trống. Hãy chuyển sang phần **AI Tutor** để nhờ Trợ lý bốc các câu hỏi khó và giải đáp nhé!
                </p>
              </div>

              {/* Close CTAs */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => { setActivePlayExam(null); playSfx('click'); }}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-black transition-all"
                >
                  Kết thúc Chấn đoán
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* CONFIRM PAPER SUBMIT DIALOG MODAL */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-500/30 dark:bg-slate-950/65 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] w-full max-w-sm p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-left animate-slide-up">
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                Nộp Bài Thi Thử?
              </h4>
              <button onClick={() => setShowConfirmSubmit(false)}>
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <p>Khung câu hỏi trắc nghiệm tự thi:</p>
              <ul className="list-disc pl-5 font-semibold space-y-0.5 text-slate-700 dark:text-slate-200">
                <li>Số câu đã trả lời: {Object.keys(selectedAnswers).length} / 50</li>
                <li>Số câu chưa điền: {50 - Object.keys(selectedAnswers).length} câu</li>
              </ul>
              <p className="text-xs text-slate-400 pt-1 leading-normal">
                Minh Anh có chắc chắn muốn nộp câu trả lời ngay? Bạn vẫn còn {formatTime(timeLeft)} để suy nghĩ!
              </p>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button 
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 hover:bg-slate-100 font-bold text-xs rounded-xl text-slate-600 dark:text-slate-300"
              >
                Tiếp tục suy nghĩ
              </button>
              <button 
                onClick={handleForceSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 font-black text-xs text-white rounded-xl shadow-md"
              >
                Nộp bài luôn
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
