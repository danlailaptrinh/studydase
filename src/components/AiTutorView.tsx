import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  BookOpen, 
  Flame, 
  RotateCcw, 
  CheckCircle, 
  Trash2, 
  HelpCircle, 
  BrainCircuit, 
  GraduationCap,
  MessageSquare,
  ListRestart
} from "lucide-react";
import { ChatMessage } from "../types";

interface AiTutorViewProps {
  currentXP: number;
  setCurrentXP: React.Dispatch<React.SetStateAction<number>>;
  playSfx: (type: 'check' | 'level' | 'click') => void;
  triggerParticles: () => void;
  addActivity: (text: string, xp: number, icon: string, type: 'complete' | 'correct' | 'check' | 'subject') => void;
}

interface ChatSession {
  id: string;
  title: string;
  subject: string;
  messages: ChatMessage[];
  date: string;
}

export default function AiTutorView({
  currentXP,
  setCurrentXP,
  playSfx,
  triggerParticles,
  addActivity
}: AiTutorViewProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [activeSubject, setActiveSubject] = useState<string>("Toán học");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Default welcome system starters
  const defaultStartersBySubject: Record<string, string[]> = {
    "Toán học": [
      "📚 Gợi ý bài giảng hình học Oxyz",
      "📝 Thử thách: Cho tớ một câu trắc nghiệm tích phân 8+",
      "💡 Mẹo bấm Casio tìm nhanh cực trị hàm số",
      "🔍 Giải thích chi tiết các phương pháp tích phân"
    ],
    "Vật lý": [
      "📚 Gợi ý bài học sóng cơ nâng cao",
      "📝 Thử thách: Đố tớ một câu đồ thị dao động điều hòa",
      "💡 Công thức nhanh giải tụ điện xoay",
      "🔍 Giải thích hiện tượng cộng hưởng cơ"
    ],
    "Hóa học": [
      "📚 Gợi ý bài este no đơn chức",
      "📝 Thử thách: Cho tớ bài tập tính kiềm este phenol 9+",
      "💡 Mẹo phân biệt các đồng phân este chuỗi",
      "🔍 Giải thích cơ chế phản ứng xà phòng hóa"
    ],
    "Tiếng Anh": [
      "📚 Gợi ý cách làm bài đọc hiểu tốt",
      "📝 Thử thách: Cho tớ 3 câu hỏi phrasal verbs khó",
      "💡 Các cụm từ Collocations nâng cao hay gặp",
      "🔍 Hướng dẫn Skimming & Scanning thần tốc"
    ]
  };

  // Load chat sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("studycase_ai_tutor_sessions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          setActiveSubject(parsed[0].subject || "Toán học");
        } else {
          initDefaultSessions();
        }
      } catch (e) {
        initDefaultSessions();
      }
    } else {
      initDefaultSessions();
    }
  }, []);

  const initDefaultSessions = () => {
    const defaultSessions: ChatSession[] = [
      {
        id: "sess_math",
        title: "Chuyên đề Oxyz nâng cao",
        subject: "Toán học",
        messages: [
          {
            id: "m_init_m1",
            role: "model",
            content: "Chào Minh Anh! Tớ là Trợ lý Chuyên mục Toán học. Tớ đã nạp toàn bộ lý thuyết Oxyz, nguyên hàm tích phân, hàm số mũ bậc cao. Hôm nay cậu muốn tớ giải đáp lý thuyết hay bốc một câu đố thử thách Toán học 9+?",
            timestamp: new Date()
          }
        ],
        date: new Date().toLocaleDateString("vi-VN")
      },
      {
        id: "sess_chem",
        title: "Bẻ khóa Este & Lipit",
        subject: "Hóa học",
        messages: [
          {
            id: "m_init_c1",
            role: "model",
            content: "Chào cậu! Cậu cần bẫy lý thuyết Este fomat, đồng phân Lipit hay các câu toán xà phòng hóa điểm 9+? Trợ lý Hóa học đã sẵn sàng!",
            timestamp: new Date()
          }
        ],
        date: new Date().toLocaleDateString("vi-VN")
      }
    ];
    setSessions(defaultSessions);
    setActiveSessionId(defaultSessions[0].id);
    setActiveSubject(defaultSessions[0].subject);
    localStorage.setItem("studycase_ai_tutor_sessions", JSON.stringify(defaultSessions));
  };

  // Save current sessions list
  const saveSessionsList = (newSessions: ChatSession[]) => {
    setSessions(newSessions);
    localStorage.setItem("studycase_ai_tutor_sessions", JSON.stringify(newSessions));
  };

  // Auto scroll to message bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sessions, activeSessionId, isSending]);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  // Send new message to Server endpoint `/api/tutor`
  const handleSendMessage = async (textToSend?: string) => {
    const queryText = textToSend || inputText;
    if (!queryText.trim() || isSending || !activeSessionId) return;

    setInputText("");
    setIsSending(true);
    playSfx('click');

    const updatedSessions = sessions.map(sess => {
      if (sess.id === activeSessionId) {
        return {
          ...sess,
          messages: [
            ...sess.messages,
            {
              id: `msg_u_${Date.now()}`,
              role: "user" as const,
              content: queryText,
              timestamp: new Date()
            }
          ]
        };
      }
      return sess;
    });

    saveSessionsList(updatedSessions);

    // Call server AI Proxy route
    try {
      const activeSessRef = updatedSessions.find(s => s.id === activeSessionId);
      const hostPayload = {
        message: queryText,
        history: activeSessRef?.messages.slice(0, -1), // skip the newly appended user message
        contextSubject: activeSession?.subject || activeSubject
      };

      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(hostPayload)
      });

      const resData = await response.json();
      
      const aiReply = resData.text || "Xin lỗi cậu, tớ tốn nhiều năng lượng để tính toán. Hãy thử lại lúc khác nhé!";
      
      const finishedSessions = updatedSessions.map(sess => {
        if (sess.id === activeSessionId) {
          return {
            ...sess,
            messages: [
              ...sess.messages,
              {
                id: `msg_ai_${Date.now()}`,
                role: "model" as const,
                content: aiReply,
                timestamp: new Date()
              }
            ]
          };
        }
        return sess;
      });

      // Award XP for asking AI constructively
      setCurrentXP(prev => prev + 5);
      
      saveSessionsList(finishedSessions);

    } catch (e) {
      console.error(e);
      // Fallback response inside client
      const errorSessions = updatedSessions.map(sess => {
        if (sess.id === activeSessionId) {
          return {
            ...sess,
            messages: [
              ...sess.messages,
              {
                id: `msg_ai_err_${Date.now()}`,
                role: "model" as const,
                content: "⚠️ Tớ không liên lạc được với máy chủ. Kiểm tra mạng hoặc thêm API Key trong Settings nhé!",
                timestamp: new Date()
              }
            ]
          };
        }
        return sess;
      });
      saveSessionsList(errorSessions);
    } finally {
      setIsSending(false);
    }
  };

  // Create new blank topic session
  const handleCreateNewSession = () => {
    playSfx('click');
    const newId = `sess_${Date.now()}`;
    const newSess: ChatSession = {
      id: newId,
      title: `Nhóm thảo luận ${activeSubject}`,
      subject: activeSubject,
      messages: [
        {
          id: `m_wel_${newId}`,
          role: "model",
          content: `Xin chào Minh Anh! Nhóm chat mới chuyên đề môn **${activeSubject}** đã sẵn sàng. Cậu hãy viết câu hỏi hoặc chọn một gợi ý hành động nhanh ở dưới để bắt đầu giải đề nhé!`,
          timestamp: new Date()
        }
      ],
      date: new Date().toLocaleDateString("vi-VN")
    };

    const updated = [newSess, ...sessions];
    setSessions(updated);
    setActiveSessionId(newId);
    saveSessionsList(updated);
  };

  // Delete session
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Cậu muốn xóa lịch sử cuộc hội thoại này?")) return;
    playSfx('click');
    const remaining = sessions.filter(s => s.id !== id);
    setSessions(remaining);
    
    if (remaining.length > 0) {
      setActiveSessionId(remaining[0].id);
      setActiveSubject(remaining[0].subject);
      saveSessionsList(remaining);
    } else {
      initDefaultSessions();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[75vh] animate-slide-up" id="ai-tutor-view-root">
      
      {/* LEFT SIDEBAR PANEL: Discussion Group Session Lists */}
      <div className="lg:col-span-1 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex flex-col justify-between space-y-4">
        
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col text-left">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span>Chủ đề Hội thoại</span>
            </h3>
          </div>

          {/* Subject creator picker selection */}
          <div className="space-y-1 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-850">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Môn học thảo luận:</label>
            <select
              value={activeSubject}
              onChange={(e) => setActiveSubject(e.target.value)}
              className="w-full text-xs font-bold p-1 px-2 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="Toán học">Toán học (📐)</option>
              <option value="Vật lý">Vật lý (🪐)</option>
              <option value="Hóa học">Hóa học (🧪)</option>
              <option value="Tiếng Anh">Tiếng Anh (🇬🇧)</option>
            </select>
            
            <button
              onClick={handleCreateNewSession}
              className="w-full mt-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1 shadow-sm transition-all"
            >
              + Tạo Chat Mới
            </button>
          </div>

          {/* Session selection lists */}
          <div className="space-y-2 flex-1 overflow-y-auto pr-1">
            {sessions.map(sess => {
              const isActive = sess.id === activeSessionId;
              let itemIcon = "📐";
              if (sess.subject === "Vật lý") itemIcon = "🪐";
              else if (sess.subject === "Hóa học") itemIcon = "🧪";
              else if (sess.subject === "Tiếng Anh") itemIcon = "🇬🇧";

              return (
                <div
                  key={sess.id}
                  onClick={() => { setActiveSessionId(sess.id); setActiveSubject(sess.subject); playSfx('click'); }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex justify-between items-center gap-2 group transition-all ${
                    isActive 
                      ? "bg-blue-50/60 border-blue-200 text-blue-900 dark:bg-blue-950/20 dark:border-blue-900 dark:text-blue-200" 
                      : "bg-white dark:bg-slate-900/10 border-slate-100 dark:border-slate-800 hover:bg-slate-50 hover:border-slate-200 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="text-sm shrink-0">{itemIcon}</span>
                    <div className="min-w-0">
                      <p className="font-extrabold truncate leading-tight">{sess.title}</p>
                      <p className="text-[9px] text-slate-400 font-medium block mt-0.5">{sess.subject} • {sess.date}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => handleDeleteSession(sess.id, e)}
                    className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic score summary indicator */}
        <div className="p-3.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white text-left space-y-1">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-blue-100">
            <span>Sử dụng AI hữu ích</span>
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          </div>
          <p className="text-xs font-black">Mỗi lần hỏi AI và hoàn thành thử thách: Nhận ngay +5 XP rèn luyện!</p>
        </div>

      </div>

      {/* RIGHT CHAT AREA: Interactive messaging pane */}
      <div className="lg:col-span-3 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col justify-between h-[75vh]">
        
        {/* Chat view Header meta details */}
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 relative shrink-0">
              <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
            <div>
              <h4 className="font-black text-sm sm:text-base text-slate-800 dark:text-white leading-tight">
                Studycase AI Specialist
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mt-0.5">
                Chuyên ngành học tập: {activeSession?.subject || activeSubject}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                if (confirm("Làm mới lại toàn bộ tin nhắn mốc chủ đề này?")) {
                  initDefaultSessions();
                }
              }} 
              className="p-1 px-2 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 rounded-lg text-xs font-medium flex items-center gap-1 transition-all"
            >
              <ListRestart className="w-3.5 h-3.5" />
              <span>Nạp lại</span>
            </button>
          </div>
        </div>

        {/* Messaging Logs Panel */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4 pr-1 text-xs sm:text-sm">
          {activeSession && activeSession.messages.map((msg, idx) => {
            const isAI = msg.role === "model";
            
            return (
              <div 
                key={msg.id || idx}
                className={`flex gap-3 max-w-[85%] text-left ${isAI ? "self-start" : "ml-auto flex-row-reverse"}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
                    <bot-icon className="text-base text-purple-600">🤖</bot-icon>
                  </div>
                )}
                
                <div className={`p-4 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-sm ${
                  isAI 
                    ? "bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-300 border border-slate-100 dark:border-slate-850 rounded-tl-none font-medium" 
                    : "bg-blue-600 text-white rounded-tr-none font-bold shadow-md shadow-blue-500/10"
                }`}>
                  {msg.content}
                </div>
              </div>
            );
          })}

          {/* Loader typing state */}
          {isSending && (
            <div className="flex gap-3 max-w-[85%] text-left">
              <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
                <BrainCircuit className="w-4 h-4 text-purple-600 animate-spin" />
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 text-slate-400 rounded-2xl rounded-tl-none border border-slate-150 animate-pulse text-xs font-semibold">
                Studycase AI đang bẻ khóa lý thuyết và viết lời giải...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick starter prompts selection bar */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          
          <div className="flex flex-wrap items-center gap-1.5 justify-start">
            {defaultStartersBySubject[activeSession?.subject || activeSubject]?.map((str, i) => (
              <button
                key={i}
                disabled={isSending}
                onClick={() => handleSendMessage(str)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 text-[10px] text-slate-500 dark:text-slate-400 font-extrabold border border-slate-150 dark:border-slate-800 text-left transition-all"
              >
                {str}
              </button>
            ))}
          </div>

          {/* Interactive Form submission */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex gap-2.5 items-center bg-slate-50 dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800"
          >
            <input
              type="text"
              placeholder={`Viết câu hỏi ôn thi tốt nghiệp môn ${activeSession?.subject || activeSubject}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isSending}
              className="flex-1 bg-transparent border-none pl-3 text-xs sm:text-sm focus:outline-none text-slate-950 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="p-2.5 bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 text-white rounded-xl transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
