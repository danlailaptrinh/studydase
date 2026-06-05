import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Award, 
  ArrowRight, 
  RefreshCw, 
  Layers, 
  Clock, 
  BookOpen, 
  CheckSquare, 
  HelpCircle,
  TrendingUp,
  BrainCircuit
} from "lucide-react";
import { Quiz, Question, Activity } from "../types";
import { mockQuizzes } from "../data/mockDatabase";

interface PracticeViewProps {
  currentXP: number;
  setCurrentXP: React.Dispatch<React.SetStateAction<number>>;
  playSfx: (type: 'check' | 'level' | 'click') => void;
  triggerParticles: () => void;
  addActivity: (text: string, xp: number, icon: string, type: 'complete' | 'correct' | 'check' | 'subject') => void;
  updateSubjectProgress: (subjectName: string, pctAmount: number) => void;
}

interface QuizHistoryRecord {
  quizTitle: string;
  subject: string;
  scorePercent: number;
  totalQuestions: number;
  correctCount: number;
  xpEarned: number;
  date: string;
}

export default function PracticeView({
  currentXP,
  setCurrentXP,
  playSfx,
  triggerParticles,
  addActivity,
  updateSubjectProgress
}: PracticeViewProps) {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [history, setHistory] = useState<QuizHistoryRecord[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("studycase_practice_history");
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { setHistory([]); }
    }
  }, []);

  const saveHistory = (record: QuizHistoryRecord) => {
    const fresh = [record, ...history];
    setHistory(fresh);
    localStorage.setItem("studycase_practice_history", JSON.stringify(fresh));
  };

  // Select quiz to start
  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setCorrectAnswersCount(0);
    setQuizFinished(false);
    playSfx('click');
  };

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
    playSfx('click');
  };

  // Submit and verify single question
  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    
    const currentQuestion = activeQuiz!.questions[currentQuestionIdx];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
      playSfx('check');
      triggerParticles();
      // Incremental XP for correct option directly!
      setCurrentXP(prev => prev + 5);
    } else {
      playSfx('click');
    }
  };

  // Advance or Finish State
  const handleNextStep = () => {
    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < activeQuiz!.questions.length) {
      setCurrentQuestionIdx(nextIdx);
      setSelectedOption(null);
      setIsSubmitted(false);
      playSfx('click');
    } else {
      // Finished!
      setQuizFinished(true);
      playSfx('level');
      triggerParticles();

      const finalPercentage = Math.round((correctAnswersCount / activeQuiz!.questions.length) * 100);
      const bonusXP = activeQuiz!.xpReward;
      
      // Award major XP
      setCurrentXP(prev => prev + bonusXP);

      const subjectIcon = activeQuiz!.subject === "Toán học" ? "📐" : activeQuiz!.subject === "Vật lý" ? "🪐" : activeQuiz!.subject === "Hóa học" ? "🧪" : "🇬🇧";
      addActivity(`Luyện tập xong: ${activeQuiz!.title} (${correctAnswersCount}/${activeQuiz!.questions.length})`, bonusXP, subjectIcon, 'correct');
      updateSubjectProgress(activeQuiz!.subject, 5);

      // Save to local practice history logs
      const newRecord: QuizHistoryRecord = {
        quizTitle: activeQuiz!.title,
        subject: activeQuiz!.subject,
        scorePercent: finalPercentage,
        totalQuestions: activeQuiz!.questions.length,
        correctCount: correctAnswersCount,
        xpEarned: bonusXP + (correctAnswersCount * 5),
        date: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })
      };
      saveHistory(newRecord);
    }
  };

  const handleResetQuiz = () => {
    if (activeQuiz) {
      handleStartQuiz(activeQuiz);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up" id="practice-view-root">
      
      {/* 1. Dashboard Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-left relative z-10">
          <span className="p-1 px-2.5 bg-white/20 text-white text-[10px] font-extrabold rounded-full tracking-wider uppercase">
            Rèn luyện kỹ năng
          </span>
          <h2 className="text-xl sm:text-2xl font-black">Trung tâm Luyện tập Trắc nghiệm</h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-lg">
            Nơi tôi luyện trực tiếp các bài trắc nghiệm thông minh. Nhận chấm điểm tự động, bẻ khóa các dạng nâng cao bằng cơ chế phản hồi giải thích từng bước của AI.
          </p>
        </div>
        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center shrink-0 min-w-32 relative z-10">
          <TrendingUp className="w-8 h-8 mx-auto text-emerald-200 mb-1" />
          <span className="text-xs font-semibold block text-emerald-100">Lịch sử làm bài</span>
          <span className="text-2xl font-black text-white">{history.length} lần</span>
        </div>
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {!activeQuiz ? (
        /* Quiz Selection Dashboard Screen */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main selection board list */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white text-left">
              Chủ đề trắc nghiệm khả dụng
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockQuizzes.map(quiz => {
                const isMath = quiz.subject === "Toán học";
                const isChem = quiz.subject === "Hóa học";
                let colorClass = "from-blue-500 to-blue-700";
                let emoji = "📐";
                
                if (isChem) {
                  colorClass = "from-amber-400 to-amber-600";
                  emoji = "🧪";
                } else if (quiz.subject === "Vật lý") {
                  colorClass = "from-purple-500 to-purple-700";
                  emoji = "🪐";
                }

                return (
                  <div 
                    key={quiz.id}
                    className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between text-left group border-b-4 border-b-blue-600 dark:border-b-blue-400"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl">{emoji}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 rounded-full">
                          {quiz.subject}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                          {quiz.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-1">
                          Số câu hỏi: {quiz.questions.length} câu • Thời gian: {quiz.duration}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
                      <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">+{quiz.xpReward} XP Thưởng</span>
                      <button 
                        onClick={() => handleStartQuiz(quiz)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] text-white rounded-xl text-xs font-black transition-all cursor-pointer"
                      >
                        Bắt đầu
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side Panel: Practice History Log */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left h-max">
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5 mb-3">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Thành tựu & Nhật ký</span>
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 leading-relaxed">
              Các bài luyện tập hoàn tất sẽ ghi dấu năng lực của Minh Anh tức thì tại đây:
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {history.map((rec, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs flex justify-between items-center gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{rec.quizTitle}</p>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{rec.date} • +{rec.xpEarned} XP</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-block font-black text-xs px-2 py-0.5 rounded-md ${
                      rec.scorePercent >= 80 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" : 
                      rec.scorePercent >= 50 ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20" : "bg-red-50 text-red-600 dark:bg-red-950/20"
                    }`}>
                      {rec.scorePercent}%
                    </span>
                  </div>
                </div>
              ))}

              {history.length === 0 && (
                <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 text-center text-slate-400 dark:text-slate-500 shadow-sm">
                  <Layers className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <span className="font-semibold text-xs block text-slate-700 dark:text-slate-300">Chưa có lịch sử làm bài hôm nay</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Rèn luyện ngay các đề trắc nghiệm thông minh!</p>
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* ACTIVE QUIZ SCREEN PLAYING */
        <div className="max-w-2xl mx-auto">
          
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl text-left relative">
            
            {/* Header / Top Meta progress info */}
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <button 
                  onClick={() => { setActiveQuiz(null); playSfx('click'); }} 
                  className="text-xs text-blue-600 hover:underline font-bold"
                >
                  ← Thoát Luyện tập
                </button>
                <h3 className="font-black text-base text-slate-900 dark:text-white mt-1">
                  Đang làm: {activeQuiz.title}
                </h3>
              </div>
              <span className="text-xs font-black bg-blue-50 text-blue-600 dark:bg-blue-950/20 px-2.5 py-1 rounded-full">
                Môn học: {activeQuiz.subject}
              </span>
            </div>

            {!quizFinished ? (
              /* Questions interface */
              <div>
                {/* Visual Step progress */}
                <div className="space-y-1 mb-5">
                  <div className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-500 font-bold">
                    <span>CÂU HỎI {currentQuestionIdx + 1} / {activeQuiz.questions.length}</span>
                    <span>Tiến độ: {Math.round(((currentQuestionIdx) / activeQuiz.questions.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIdx) / activeQuiz.questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Box */}
                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 mb-5">
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-relaxed">
                    {activeQuiz.questions[currentQuestionIdx].question}
                  </h4>
                </div>

                {/* Option Items */}
                <div className="space-y-3">
                  {activeQuiz.questions[currentQuestionIdx].options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isQuestionCorrect = idx === activeQuiz.questions[currentQuestionIdx].correctAnswer;
                    
                    let itemColor = "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900";
                    let letterBadge = "border-slate-200 text-slate-400 dark:border-slate-800";

                    if (isSelected) {
                      itemColor = "border-blue-500 bg-blue-50/20 dark:border-blue-400 dark:bg-blue-950/10";
                      letterBadge = "bg-blue-600 border-blue-600 text-white dark:bg-blue-500 dark:border-blue-500";
                    }

                    if (isSubmitted) {
                      if (isQuestionCorrect) {
                        itemColor = "border-emerald-500 bg-emerald-500/10 dark:border-emerald-400 dark:bg-emerald-950/15";
                        letterBadge = "bg-emerald-600 border-emerald-600 text-white shadow-md";
                      } else if (isSelected) {
                        itemColor = "border-rose-500 bg-rose-500/10 dark:border-rose-400 dark:bg-rose-950/15";
                        letterBadge = "bg-rose-600 border-rose-600 text-white shadow-md";
                      } else {
                        itemColor = "border-slate-200 dark:border-slate-800 opacity-55 hover:border-slate-200 bg-white dark:bg-slate-900";
                      }
                    }

                    const optLetter = ["A", "B", "C", "D"][idx];

                    return (
                      <button
                        key={idx}
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all text-left group ${itemColor}`}
                      >
                        <span className={`w-7 h-7 rounded-lg border font-bold text-xs flex items-center justify-center shrink-0 ${letterBadge}`}>
                          {optLetter}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* AI Deep Explanation block */}
                {isSubmitted && (
                  <div className="mt-6 p-5 bg-gradient-to-r from-blue-50/40 via-purple-50/20 to-slate-50/30 dark:from-slate-900/60 dark:via-purple-950/5 dark:to-slate-900/40 border-2 border-dashed border-purple-200/50 dark:border-purple-900/20 rounded-2xl animate-slide-up">
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs font-black text-purple-700 dark:text-purple-400 uppercase tracking-widest">🤖 Trợ lý AI Deep Explanation</span>
                      </div>
                      
                      {selectedOption === activeQuiz.questions[currentQuestionIdx].correctAnswer ? (
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 rounded-full">
                          CHÍNH XÁC (+5 XP)
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-rose-50 text-rose-600 dark:bg-rose-950/20 rounded-full">
                          CẦN LƯU Ý
                        </span>
                      )}
                    </div>

                    {activeQuiz.questions[currentQuestionIdx].formula && (
                      <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850 font-mono text-center text-xs text-blue-600 dark:text-blue-400 font-bold mb-3">
                        {activeQuiz.questions[currentQuestionIdx].formula}
                      </div>
                    )}

                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                      <p className="font-bold text-slate-800 dark:text-slate-200">Các bước bẻ khóa đáp án đúng:</p>
                      <p className="whitespace-pre-line">{activeQuiz.questions[currentQuestionIdx].explanation}</p>
                    </div>
                  </div>
                )}

                {/* Actions Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
                  {!isSubmitted ? (
                    <button
                      disabled={selectedOption === null}
                      onClick={handleSubmitAnswer}
                      className="px-6 py-2.5 bg-blue-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-transparent dark:disabled:bg-slate-900 dark:disabled:text-slate-600 text-white rounded-xl text-xs font-extrabold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      Kiểm tra Kết quả
                    </button>
                  ) : (
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <span>
                        {currentQuestionIdx === activeQuiz.questions.length - 1 ? "Hoàn thành Luyện tập" : "Câu tiếp theo"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Quiz Finished Screen view */
              <div className="text-center py-6 space-y-5 animate-slide-up">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Award className="w-10 h-10 animate-bounce" />
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Tuyệt vời! Minh Anh đã về đích! 🎉
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Hệ thống đã ghi lại kết quả tự luyện thi để phục vụ chẩn đoán năng lực.
                  </p>
                </div>

                {/* Score Stats Layout bento box */}
                <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                  
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase">Đúng</span>
                    <span className="text-base sm:text-lg font-black text-emerald-500">
                      {correctAnswersCount} / {activeQuiz.questions.length}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase">Chính xác</span>
                    <span className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400">
                      {Math.round((correctAnswersCount / activeQuiz.questions.length) * 100)}%
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase">Tích Lũy</span>
                    <span className="text-base sm:text-lg font-black text-purple-600 dark:text-purple-400">
                      +{activeQuiz.xpReward + (correctAnswersCount * 5)} XP
                    </span>
                  </div>

                </div>

                <div className="p-4 bg-purple-50/50 dark:bg-purple-950/10 rounded-2xl max-w-md mx-auto text-xs text-slate-600 dark:text-slate-300 leading-relaxed border border-purple-100/30">
                  <span className="font-extrabold text-purple-700 dark:text-purple-400 flex items-center justify-center gap-1.5 mb-1">
                    <BrainCircuit className="w-4 h-4 text-purple-500" />
                    Chẩn đoán tư duy của AI:
                  </span>
                  {correctAnswersCount === activeQuiz.questions.length ? (
                    <span>Chinh phục triệt để {activeQuiz.subject}! Tư duy phần này của cậu vô cùng xuất sắc. Tớ rất tự hào về Minh Anh!</span>
                  ) : correctAnswersCount >= activeQuiz.questions.length / 2 ? (
                    <span>Khá tốt! Các bước tính toán cơ bản đã chuẩn, chỉ cần rà soát lại phần lý thuyết ở các công thức AI đã tóm tắt nhé!</span>
                  ) : (
                    <span>Hơi yếu một tí ở phản ứng/công thức đặc thù. Minh Anh hãy đọc lại Tóm tắt lý thuyết để nạp thêm đạn dược nhé!</span>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={handleResetQuiz}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Luyện lại</span>
                  </button>

                  <button
                    onClick={() => { setActiveQuiz(null); playSfx('click'); }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all"
                  >
                    Chủ đề khác
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
