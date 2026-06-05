import React, { useState, useEffect } from "react";
import { 
  Search, 
  BookOpen, 
  Clock, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  BookMarked,
  Filter
} from "lucide-react";
import { Lesson, SubjectProgress } from "../types";
import { mockLessons } from "../data/mockDatabase";

interface LessonsViewProps {
  currentXP: number;
  setCurrentXP: React.Dispatch<React.SetStateAction<number>>;
  playSfx: (type: 'check' | 'level' | 'click') => void;
  triggerParticles: () => void;
  addActivity: (text: string, xp: number, icon: string, type: 'complete' | 'correct' | 'check' | 'subject') => void;
  updateSubjectProgress: (subjectName: string, pctAmount: number) => void;
}

export default function LessonsView({
  currentXP,
  setCurrentXP,
  playSfx,
  triggerParticles,
  addActivity,
  updateSubjectProgress
}: LessonsViewProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("Tất cả");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Tất cả");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showAiSummary, setShowAiSummary] = useState(false);

  // Load state from mock database + LocalStorage persistent state
  useEffect(() => {
    const saved = localStorage.getItem("studycase_lessons");
    if (saved) {
      try {
        setLessons(JSON.parse(saved));
      } catch (e) {
        setLessons(mockLessons);
      }
    } else {
      setLessons(mockLessons);
    }
  }, []);

  // Save lesson states
  const saveLessons = (newLessons: Lesson[]) => {
    setLessons(newLessons);
    localStorage.setItem("studycase_lessons", JSON.stringify(newLessons));
  };

  // Mark lesson as completed/not completed
  const handleToggleComplete = (lessonId: string) => {
    const fresh = lessons.map(lesson => {
      if (lesson.id === lessonId) {
        const nextState = !lesson.completed;
        if (nextState) {
          playSfx('check');
          triggerParticles();
          const xpGained = 15;
          
          setCurrentXP(prev => {
            const nextXP = prev + xpGained;
            return nextXP;
          });

          // Add feedback activity
          const icon = lesson.subject === "Toán học" ? "📐" : lesson.subject === "Vật lý" ? "🪐" : lesson.subject === "Hóa học" ? "🧪" : "🇬🇧";
          addActivity(`Đã nghiền ngẫm xong: ${lesson.title}`, xpGained, icon, 'complete');
          updateSubjectProgress(lesson.subject, 4);
        }
        return { ...lesson, completed: nextState };
      }
      return lesson;
    });

    saveLessons(fresh);
    // If viewing the lesson details, update the active lesson reference
    if (activeLesson && activeLesson.id === lessonId) {
      setActiveLesson(prev => prev ? { ...prev, completed: !prev.completed } : null);
    }
  };

  // Subjects for filters
  const subjects = ["Tất cả", "Toán học", "Vật lý", "Hóa học", "Tiếng Anh"];

  // Filter lessons based on selection
  const filteredLessons = lessons.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "Tất cả" || l.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === "Tất cả" || l.difficulty === selectedDifficulty;
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  return (
    <div className="space-y-6 animate-slide-up" id="lessons-view-root">
      
      {/* 1. Header Hero Card matching original Dashboard feel */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 relative z-10 text-left">
          <span className="p-1 px-2.5 bg-white/20 text-white text-[10px] font-extrabold rounded-full tracking-wider uppercase">
            Học tập chủ động
          </span>
          <h2 className="text-xl sm:text-2xl font-black">Khám phá Bài giảng Chuyên sâu</h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-lg">
            Học lý thuyết, nghiên cứu công thức vàng tích lũy cực chuẩn, kích hoạt tóm tắt AI để thấu hiểu bài giảng trong 30 giây!
          </p>
        </div>
        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center shrink-0 min-w-32 relative z-10">
          <BookMarked className="w-8 h-8 mx-auto text-blue-200 mb-1" />
          <span className="text-xs font-semibold block text-blue-100">Đã học xong</span>
          <span className="text-2xl font-black text-white">
            {lessons.filter(l => l.completed).length}/{lessons.length}
          </span>
        </div>
        {/* Ambient Glows */}
        <div className="absolute right-0 bottom-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Controls Area (Search, Filter Buttons) */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Tìm theo tiêu đề bài học, chủ đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-950 dark:text-slate-100"
          />
        </div>

        {/* Action Filters Subject row */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {subjects.map(sub => (
            <button
              key={sub}
              onClick={() => { setSelectedSubject(sub); playSfx('click'); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                selectedSubject === sub 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                  : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

      </div>

      {/* 3. Grid of Lessons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map(lesson => {
          const isMath = lesson.subject === "Toán học";
          const isPhys = lesson.subject === "Vật lý";
          const isChem = lesson.subject === "Hóa học";
          
          let prefixBorder = "border-blue-500";
          let badgeColor = "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400";
          let subjIcon = "📐";

          if (isPhys) {
            prefixBorder = "border-purple-500";
            badgeColor = "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400";
            subjIcon = "🪐";
          } else if (isChem) {
            prefixBorder = "border-amber-500";
            badgeColor = "bg-amber-50 text-amber-600 dark:bg-amber-950/45 dark:text-amber-400";
            subjIcon = "🧪";
          } else if (lesson.subject === "Tiếng Anh") {
            prefixBorder = "border-emerald-500";
            badgeColor = "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400";
            subjIcon = "🇬🇧";
          }

          return (
            <div 
              key={lesson.id}
              id={`lesson-card-${lesson.id}`}
              className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative group"
            >
              <div className="space-y-3.5 text-left">
                {/* Upper Subject Badge & Difficulty */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{subjIcon}</span>
                    <span className={`text-[9px] font-black tracking-wide uppercase px-2 py-0.5 rounded-full ${badgeColor}`}>
                      {lesson.subject}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    lesson.difficulty === "Dễ" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" : 
                    lesson.difficulty === "Khó" ? "bg-red-50 text-red-600 dark:bg-red-950/20" : "bg-blue-50 text-blue-600 dark:bg-blue-950/20"
                  }`}>
                    {lesson.difficulty}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono tracking-wide uppercase">CHỦ ĐỀ: {lesson.topic}</p>
                  <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {lesson.title}
                  </h4>
                </div>

                {/* Duration & Task Metrics */}
                <div className="flex gap-4 text-xs text-slate-400 dark:text-slate-500 font-medium">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-300" />
                    <span>{lesson.duration}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span>💡 Hỗ trợ AI</span>
                  </div>
                </div>
              </div>

              {/* Card CTA Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2.5">
                {/* Complete checkbox */}
                <button
                  onClick={() => handleToggleComplete(lesson.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    lesson.completed 
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30" 
                      : "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 text-slate-400 dark:text-slate-500 border border-transparent"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lesson.completed ? "Hoàn thành" : "Chưa hoàn"}</span>
                </button>

                {/* View Lesson */}
                <button
                  onClick={() => { setActiveLesson(lesson); setShowAiSummary(false); playSfx('click'); }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] text-white rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>Học Ngay</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredLessons.length === 0 && (
          <div className="col-span-full bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 text-center text-slate-400 dark:text-slate-500 shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="font-bold text-slate-700 dark:text-slate-300">Không tìm thấy bài giảng tương ứng.</p>
            <p className="text-xs mt-1">Hãy thử đổi từ khóa tìm kiếm hoặc chọn bộ môn khác.</p>
          </div>
        )}
      </div>

      {/* 4. Lesson Reading Modal popup */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-500/30 dark:bg-slate-950/65 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#0f172a] w-full max-w-2xl p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl animate-slide-up flex flex-col max-h-[85vh] overflow-hidden text-left">
            
            {/* Header */}
            <header className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1 px-2.5 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 text-[10px] font-black rounded-full uppercase">
                    {activeLesson.subject}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">• {activeLesson.topic}</span>
                </div>
                <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white leading-snug">
                  {activeLesson.title}
                </h3>
              </div>
              <button 
                onClick={() => setActiveLesson(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Toggle tabs [Nội dung chi tiết / Tóm tắt AI] */}
            <div className="flex border-b border-slate-100 dark:border-slate-800/80 mt-4">
              <button 
                onClick={() => { setShowAiSummary(false); playSfx('click'); }}
                className={`flex-1 py-2.5 text-center text-xs font-bold transition-all border-b-2 outline-none ${
                  !showAiSummary 
                    ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400" 
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                📝 Chi tiết bài giảng
              </button>
              <button 
                onClick={() => { setShowAiSummary(true); playSfx('click'); }}
                className={`flex-1 py-2.5 text-center text-xs font-bold transition-all border-b-2 gap-1.5 justify-center items-center flex outline-none ${
                  showAiSummary 
                    ? "border-purple-500 text-purple-600 dark:text-purple-400 dark:border-purple-400" 
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span>💡 AI Summary & Công thức vàng</span>
              </button>
            </div>

            {/* Scrollable Contents Pane */}
            <div className="flex-1 overflow-y-auto py-5 pr-1 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-h-[50vh] prose dark:prose-invert">
              {!showAiSummary ? (
                /* Detail lesson content */
                <div className="space-y-4">
                  {activeLesson.content.split("\n\n").map((para, i) => {
                    if (para.startsWith("###")) {
                      return <h4 key={i} className="text-base font-black text-slate-900 dark:text-white pt-2">{para.replace("### ", "")}</h4>;
                    }
                    if (para.startsWith("####")) {
                      return <h5 key={i} className="text-sm font-bold text-slate-800 dark:text-slate-200 pt-1">{para.replace("#### ", "")}</h5>;
                    }
                    if (para.includes("* **")) {
                      return (
                        <ul key={i} className="list-disc pl-5 space-y-1">
                          {para.split("\n").map((line, idx) => (
                            <li key={idx} dangerouslySetInnerHTML={{ __html: line.replace("* **", "<strong>").replace("**: ", "</strong>: ") }} />
                          ))}
                        </ul>
                      );
                    }
                    return <p key={i} className="whitespace-pre-line">{para}</p>;
                  })}
                </div>
              ) : (
                /* AI Summary view */
                <div className="space-y-4 bg-purple-50/30 dark:bg-purple-950/10 p-5 rounded-2xl border border-purple-200/40 dark:border-purple-900/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-extrabold text-purple-700 dark:text-purple-400 uppercase tracking-widest">Trí tuệ nhân tạo tóm lược</span>
                  </div>
                  
                  {activeLesson.formula && (
                    <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 font-mono text-center text-xs text-blue-600 dark:text-blue-400 font-bold block overflow-x-auto">
                      {activeLesson.formula}
                    </div>
                  )}

                  <div className="space-y-3">
                    {activeLesson.summary.split("\n\n").map((para, i) => {
                      if (para.startsWith("###")) {
                        return <h4 key={i} className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white border-b border-purple-100/40 dark:border-purple-900/20 pb-1 pt-1">{para.replace("### ", "")}</h4>;
                      }
                      if (para.startsWith("* **")) {
                        return (
                          <div key={i} className="space-y-1 bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                            {para.split("\n").map((line, idx) => (
                              <p key={idx} className="text-xs text-slate-600 dark:text-slate-400 my-0.5">
                                {line.replace("* ", "")}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return <p key={i} className="whitespace-pre-line text-xs">{para}</p>;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with actionable items */}
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-auto flex items-center justify-between">
              {/* Completed toggler */}
              <button
                onClick={() => handleToggleComplete(activeLesson.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeLesson.completed 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400" 
                    : "bg-slate-50 dark:bg-slate-900 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 border border-transparent"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{activeLesson.completed ? "Hành trình hoàn tất" : "Đánh dấu hoàn thành (+15 XP)"}</span>
              </button>

              <button
                onClick={() => setActiveLesson(null)}
                className="px-5 py-2 bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold"
              >
                Đóng lại
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
