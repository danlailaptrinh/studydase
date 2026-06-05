/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import customLogoImg from "./assets/my-icon.png";
import { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Edit3,
  FileText,
  Bot,
  Calendar,
  BarChart2,
  Award,
  Settings,
  Clock,
  CheckSquare,
  TrendingUp,
  Bell,
  ChevronRight,
  HelpCircle,
  X,
  Send,
  Loader,
  BrainCircuit,
  Plus,
  RefreshCw,
  Sun,
  Moon,
  Sparkles,
  Search,
  CheckCircle2,
  Menu,
} from "lucide-react";
import { Task, Activity, SubjectProgress, ChatMessage } from "./types";
import LessonsView from "./components/LessonsView";
import PracticeView from "./components/PracticeView";
import ExamsView from "./components/ExamsView";
import AiTutorView from "./components/AiTutorView";
import SettingsView from "./components/SettingsView";
import MonthlyRewardCard from "./components/MonthlyRewardCard";
import LoginPage from "./components/LoginPage";

// Configurations for Sidebar and App Header Branding
const LOGO_TEXT = "Studydase";
const LOGO_SUBTEXT = " ";

export default function App() {
  // Theme state synced with local storage and root document element
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("studycase_dark_mode") === "true";
  });

  // Dynamic profile state parameters with localStorage persistency
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("studycase_logged_in") === "true";
  });

  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem("studycase_username") || "Minh Anh";
  });
  const [userAvatar, setUserAvatar] = useState<string>(() => {
    return localStorage.getItem("studycase_avatar") || "🐱";
  });

  // Custom XP and target tracking values loaded from localStorage
  const [currentXP, setCurrentXP] = useState<number>(() => {
    const saved = localStorage.getItem("studycase_total_xp");
    return saved ? parseInt(saved, 10) : 2850;
  });

  useEffect(() => {
    localStorage.setItem("studycase_logged_in", isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("studycase_username", userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem("studycase_avatar", userAvatar);
  }, [userAvatar]);

  useEffect(() => {
    localStorage.setItem("studycase_total_xp", currentXP.toString());
  }, [currentXP]);

  useEffect(() => {
    localStorage.setItem("studycase_dark_mode", darkMode ? "true" : "false");
    const doc = document.documentElement;
    if (darkMode) {
      doc.classList.add("dark");
    } else {
      doc.classList.remove("dark");
    }
  }, [darkMode]);

  const targetLevelXP = 4000;
  const currentGrade = "Lớp 12";
  const userRankLabel = "Xuất sắc cấp 4";

  // State of study tasks today (prepopulated exactly from screenshot)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "t1",
      title: "Bài tập: Toán hình học Oxyz nâng cao",
      subject: "TOÁN HỌC",
      duration: "30 phút",
      questions: "25 câu",
      xp: 20,
      completed: false,
      colorClass:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      icon: "📐",
    },
    {
      id: "t2",
      title: "Luyện tập Hóa học: Este 20 câu trắc nghiệm",
      subject: "HÓA HỌC",
      duration: "25 phút",
      questions: "20 câu",
      xp: 15,
      completed: false,
      colorClass:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
      icon: "🧪",
    },
    {
      id: "t3",
      title: "Thực hành đọc hiểu Tiếng Anh",
      subject: "TIẾNG ANH",
      duration: "20 phút",
      questions: "15 câu",
      xp: 12,
      completed: false,
      colorClass:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
      icon: "🇬🇧",
    },
    {
      id: "t4",
      title: "Phân tích lỗi thi thử cùng AI",
      subject: "TỔNG HỢP",
      duration: "15 phút",
      questions: "Mức AI",
      xp: 20,
      completed: false,
      colorClass:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/45 dark:text-purple-300",
      icon: "🤖",
    },
  ]);

  // Activity logs today
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "act-1",
      text: "Hoàn thành nhiệm vụ: Luyện tập Hóa",
      xp: 15,
      time: "10:30",
      icon: "🧪",
      type: "complete",
    },
    {
      id: "act-2",
      text: "Giải đúng 20 câu trắc nghiệm (Toán học)",
      xp: 12,
      time: "09:15",
      icon: "📐",
      type: "correct",
    },
    {
      id: "act-3",
      text: "Hoàn thành bài tập phân tích lỗi",
      xp: 18,
      time: "08:40",
      icon: "🤖",
      type: "check",
    },
    {
      id: "act-4",
      text: "Hoàn thành chuyên đề: Este",
      xp: 20,
      time: "07:20",
      icon: "🧬",
      type: "subject",
    },
  ]);

  // Subject Progress states
  const [subjectProgresses, setSubjectProgresses] = useState<SubjectProgress[]>(
    [
      {
        name: "Toán học",
        percentage: 88,
        colorValue: "#3b82f6",
        colorClass: "bg-blue-600",
        totalHours: "42h",
        rank: "Top 5%",
      },
      {
        name: "Vật lý",
        percentage: 74,
        colorValue: "#a855f7",
        colorClass: "bg-purple-600",
        totalHours: "31h",
        rank: "Top 12%",
      },
      {
        name: "Hóa học",
        percentage: 62,
        colorValue: "#f97316",
        colorClass: "bg-amber-500",
        totalHours: "18h",
        rank: "Top 25%",
      },
      {
        name: "Tiếng Anh",
        percentage: 81,
        colorValue: "#10b981",
        colorClass: "bg-emerald-500",
        totalHours: "29h",
        rank: "Top 9%",
      },
    ]
  );

  // Active view menu state
  const [activeMenu, setActiveMenu] = useState<string>("Tổng quan");

  // Chart data navigation state (matches week switch)
  const [chartWeek, setChartWeek] = useState<"current" | "previous">("current");
  const [selectedChartDay, setSelectedChartDay] = useState<string>("Thứ 5");

  // Interactive AI Tutor sidebar / chat dialog state
  const [isAiTutorOpen, setIsAiTutorOpen] = useState<boolean>(false);
  const [chatSubject, setChatSubject] = useState<string>("Tổng hợp");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);

  // Particles for celebration
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; color: string }[]
  >([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Additional detail view support
  const [showGoalModal, setShowGoalModal] = useState<boolean>(false);
  const [showRecommendModal, setShowRecommendModal] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] = useState<
    string | null
  >(null);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Interactive advice details
  const [selectedSubjectAdvice, setSelectedSubjectAdvice] =
    useState<SubjectProgress | null>(null);

  // Notifications demo content
  const notificationsList = [
    {
      id: "n1",
      text: "Trợ lý AI vừa phân tích kết quả bài tập Este. Bấm để xem chiến thuật mới!",
      unread: true,
      time: "5 phút trước",
    },
    {
      id: "n2",
      text: "Chúc mừng Minh Anh đạt tích lũy học tập ↑ 18% so với tuần trước! 🎉",
      unread: true,
      time: "2 giờ trước",
    },
    {
      id: "n3",
      text: "Kế hoạch tuần môn Lý: Cậu cần ôn tập lý thuyết phần Sóng cơ học trước Thứ 7.",
      unread: false,
      time: "1 ngày trước",
    },
  ];

  // Sync scroll on chat update
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isAiTyping]);

  // Bulletproof safety: Close AI Tutor when navigating away from "AI Tutor" tab/view
  useEffect(() => {
    if (activeMenu !== "AI Tutor") {
      setIsAiTutorOpen(false);
    }
  }, [activeMenu]);

  // Helper to obtain dynamic page header title and description based on current view
  const getHeaderContent = () => {
    switch (activeMenu) {
      case "Bài giảng":
        return {
          title: "Học liệu & Bài giảng chuyên sâu",
          subtitle:
            "Tổng hợp lý thuyết trọng tâm bám sát cấu trúc đề thi THPT Quốc Gia.",
          emoji: "📚",
        };
      case "Luyện tập":
        return {
          title: "Kho rèn luyện câu hỏi thích ứng",
          subtitle:
            "Luyện tập cá nhân hóa, phát hiện bẫy lỗi sai tức thì cùng Trợ lý học tập.",
          emoji: "✍️",
        };
      case "Đề thi":
        return {
          title: "Bộ đề ôn luyện & Thi thử THPT",
          subtitle:
            "Thử sức với các đề khảo sát bấm giờ bám sát cấu trúc đề minh họa của Bộ GD&ĐT.",
          emoji: "📝",
        };
      case "AI Tutor":
        return {
          title: "Trợ lý rèn luyện học tập AI Specialist",
          subtitle:
            "Giải đáp thắc mắc chuyên sâu, cung cấp lộ trình cá nhân tháo gỡ điểm nghẽn.",
          emoji: "🤖",
        };
      case "Cài đặt":
        return {
          title: "Thiết lập tài khoản sĩ tử",
          subtitle:
            "Cấu hình hồ sơ cá nhân, hình ảnh đại diện và chế độ hiển thị.",
          emoji: "⚙️",
        };
      case "Kế hoạch học tập":
        return {
          title: "Kế hoạch học tập cá nhân",
          subtitle:
            "Lộ trình học tập khoa học giúp tối ưu hóa thời gian và điểm số THPT.",
          emoji: "📅",
        };
      case "Phân tích":
        return {
          title: "Biểu đồ phân tích năng lực",
          subtitle:
            "Chi tiết điểm số, chẩn đoán điểm mạnh học thuật và lỗ hổng kiến thức.",
          emoji: "📊",
        };
      case "Thành tích":
        return {
          title: "Bảng vàng danh hiệu vinh danh",
          subtitle:
            "Nhìn lại phần thưởng, nhiệm vụ nâng cấp và vinh quang học tập tích dốc.",
          emoji: "🏆",
        };
      default:
        return {
          title: `Xin chào, ${userName}!`,
          subtitle:
            "Tiếp tục hành trình chinh phục mục tiêu THPT Quốc Gia cùng trí tuệ nhân tạo AI.",
          emoji: "👋",
        };
    }
  };

  const headerContent = getHeaderContent();

  // Dynamic action log append helper with instant XP increments and Level recalculations
  const addActivity = (
    text: string,
    xp: number,
    icon: string,
    type: "complete" | "correct" | "check" | "subject"
  ) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    const newAct: Activity = {
      id: `act-${Date.now()}`,
      text: text,
      xp: xp,
      time: timeStr,
      icon: icon,
      type: type,
    };
    setActivities((prev) => [newAct, ...prev]);

    // Live Level Tracker recalculation
    setCurrentXP((prev) => {
      const nextXP = prev + xp;
      if (nextXP >= targetLevelXP && prev < targetLevelXP) {
        setTimeout(() => {
          playSfx("level");
          alert(
            "🎉 Chúc mừng " +
              userName +
              " nâng cấp lên Cấp học 5! Cậu thật xuất sắc!"
          );
        }, 300);
      }
      return Math.max(0, nextXP);
    });
  };

  // Subject Progress dynamic increments helper
  const updateSubjectProgress = (subjectName: string, pctAmount: number) => {
    setSubjectProgresses((prev) =>
      prev.map((subj) => {
        const isMatch =
          subj.name.toLowerCase() === subjectName.toLowerCase() ||
          (subjectName.toLowerCase() === "math" && subj.name === "Toán học") ||
          (subjectName.toLowerCase() === "physics" && subj.name === "Vật lý") ||
          (subjectName.toLowerCase() === "chemistry" &&
            subj.name === "Hóa học") ||
          (subjectName.toLowerCase() === "english" &&
            subj.name === "Tiếng Anh");
        if (isMatch) {
          return {
            ...subj,
            percentage: Math.min(100, subj.percentage + pctAmount),
          };
        }
        return subj;
      })
    );
  };

  // Sound generator using HTML5 Web Audio API (No files required!)
  const playSfx = (type: "check" | "level" | "click") => {
    try {
      const audioCtx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "check") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(
          783.99,
          audioCtx.currentTime + 0.15
        ); // G5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          audioCtx.currentTime + 0.2
        );
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } else if (type === "level") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(392.0, audioCtx.currentTime); // G4
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime + 0.1); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.2); // E5
        osc.frequency.exponentialRampToValueAtTime(
          1046.5,
          audioCtx.currentTime + 0.35
        ); // C6
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          audioCtx.currentTime + 0.5
        );
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          audioCtx.currentTime + 0.08
        );
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      }
    } catch (e) {
      // Ignore audio failure if context state is blocked
    }
  };

  // Sparkle burst effects custom calculator
  const triggerParticles = () => {
    const fresh: { id: number; x: number; y: number; color: string }[] = [];
    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#a855f7",
      "#ec4899",
      "#ef4444",
    ];
    for (let i = 0; i < 20; i++) {
      fresh.push({
        id: Math.random() + i,
        x: 40 + Math.random() * 20,
        y: 40 + Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setParticles(fresh);
    setTimeout(() => setParticles([]), 1500);
  };

  // Check off task interactively
  const handleToggleTask = (id: string) => {
    let checkedTaskXP = 0;
    let checkedTaskTitle = "";
    let checkedSubject = "";

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          if (nextState) {
            checkedTaskXP = t.xp;
            checkedTaskTitle = t.title;
            checkedSubject = t.subject;
          } else {
            // Subtract XP if user unchecks
            checkedTaskXP = -t.xp;
          }
          return { ...t, completed: nextState };
        }
        return t;
      })
    );

    if (checkedTaskXP !== 0) {
      if (checkedTaskXP > 0) {
        playSfx("check");
        triggerParticles();

        // Push to activity logs
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes()
        ).padStart(2, "0")}`;
        const newAct: Activity = {
          id: `act-${Date.now()}`,
          text: `Hoàn thành: ${checkedTaskTitle
            .replace("Bài tập: ", "")
            .replace("Luyện tập ", "")}`,
          xp: checkedTaskXP,
          time: timeStr,
          icon:
            checkedSubject === "TOÁN HỌC"
              ? "📐"
              : checkedSubject === "HÓA HỌC"
              ? "🧪"
              : checkedSubject === "TIẾNG ANH"
              ? "🇬🇧"
              : "🤖",
          type: "complete",
        };
        setActivities((prev) => [newAct, ...prev]);

        // Increment specific progress percentages
        setSubjectProgresses((prev) =>
          prev.map((subj) => {
            if (
              (checkedSubject === "TOÁN HỌC" && subj.name === "Toán học") ||
              (checkedSubject === "HÓA HỌC" && subj.name === "Hóa học") ||
              (checkedSubject === "TIẾNG ANH" && subj.name === "Tiếng Anh")
            ) {
              return {
                ...subj,
                percentage: Math.min(100, subj.percentage + 2),
              };
            }
            return subj;
          })
        );
      }

      // Live Level Tracker recalculation
      setCurrentXP((prev) => {
        const nextXP = prev + checkedTaskXP;
        if (nextXP >= targetLevelXP && prev < targetLevelXP) {
          // Level up celebration!
          setTimeout(() => {
            playSfx("level");
            alert(
              "🎉 Chúc mừng Minh Anh nâng cấp lên Cấp học 5! Cậu thật xuất sắc!"
            );
          }, 300);
        }
        return Math.max(0, nextXP);
      });
    }
  };

  // Launch pre-loaded AI Chat modal handler
  const handleAskTutor = (
    subjectName: string,
    initialPromptMessage: string
  ) => {
    setActiveMenu("AI Tutor"); // visually highlights AI Tutor
    setChatSubject(subjectName);
    setIsAiTutorOpen(true);
    playSfx("click");

    // Build unique customized introduction
    const welcomeMsgs: ChatMessage[] = [
      {
        id: "wel-1",
        role: "model",
        content: `Chào **${userName}**! Tớ là trợ lý rèn luyện học tập AI của cậu. 🌟\nTớ nhận thấy cậu đang muốn tháo gỡ thử thách ở chủ đề: **${subjectName}**.\n\nYêu cầu cụ thể: *"${initialPromptMessage}"*\n\nTớ đã chuẩn bị sẵn sơ đồ giải nhanh và bài thử nghiệm thú vị. Hãy chat gì đó dưới đây hoặc bấm **Gửi** để tớ hỗ trợ ngay nhé!`,
        timestamp: new Date(),
      },
    ];
    setChatMessages(welcomeMsgs);
  };

  // Call the real backend Gemini proxy endpoint
  const handleSendChatMessage = async () => {
    if (!userInput.trim()) return;
    playSfx("click");

    const userMsg: ChatMessage = {
      id: `chat-usr-${Date.now()}`,
      role: "user",
      content: userInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const originalInput = userInput;
    setUserInput("");
    setIsAiTyping(true);

    try {
      // Build context history payload strictly format matching
      const historyPayload = chatMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: originalInput,
          history: historyPayload,
          contextSubject: chatSubject,
        }),
      });

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `chat-bot-${Date.now()}`,
        role: "model",
        content: data.text,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: `chat-err-${Date.now()}`,
        role: "model",
        content: `Hệ thống đang bận một chút, tớ xin lỗi ${userName}. Có một giải pháp thay thế rất tốt: xà phòng hóa este hữu cơ của phenol rất quan trọng, hãy bảo đảm tỷ lệ phản ứng thích hợp!`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Curve configurations for trend charts:
  // Week 1 (Tuần này):
  const weekDataThis = {
    "Thứ 2": { value: 65, text: "2h 30m" },
    "Thứ 3": { value: 110, text: "3h 45m" },
    "Thứ 4": { value: 80, text: "3h 00m" },
    "Thứ 5": { value: 160, text: "4h 15m" }, // exact point image
    "Thứ 6": { value: 70, text: "2h 50m" },
    "Thứ 7": { value: 185, text: "6h 10m" },
    CN: { value: 145, text: "5h 20m" },
  };

  // Week 2 (Tuần trước):
  const weekDataLast = {
    "Thứ 2": { value: 85, text: "3h 10m" },
    "Thứ 3": { value: 95, text: "3h 25m" },
    "Thứ 4": { value: 140, text: "4h 00m" },
    "Thứ 5": { value: 100, text: "3h 30m" },
    "Thứ 6": { value: 120, text: "3h 50m" },
    "Thứ 7": { value: 150, text: "5h 45m" },
    CN: { value: 110, text: "3h 15m" },
  };

  const activePoints = chartWeek === "current" ? weekDataThis : weekDataLast;

  // Render SVG Path calculation smoothly
  const daysKeys = Object.keys(activePoints);
  const computeSvgPath = () => {
    // Canvas dimensions: width=600, height=200
    // Maps 7 days to x values from 40 to 560
    // Maps values (0 to 200) to y values from 170 to 30
    const points = daysKeys.map((day, index) => {
      const x = 40 + index * 85;
      const progressValue = (activePoints as any)[day].value;
      const y = 175 - (progressValue / 200) * 140;
      return { x, y };
    });

    // Make smooth cubic bezier curve
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpX1 = curr.x + 40;
      const cpY1 = curr.y;
      const cpX2 = next.x - 40;
      const cpY2 = next.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const computeSvgGradientArea = () => {
    const points = daysKeys.map((day, index) => {
      const x = 40 + index * 85;
      const progressValue = (activePoints as any)[day].value;
      const y = 175 - (progressValue / 200) * 140;
      return { x, y };
    });

    let d = computeSvgPath();
    // Add close lines to bottom to fill colors
    d += ` L ${points[points.length - 1].x} 185 L ${points[0].x} 185 Z`;
    return d;
  };

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLoginSuccess={(username) => {
          setUserName(username);
          setIsLoggedIn(true);
          playSfx("click");
          triggerParticles();
        }}
      />
    );
  }

  return (
    <div
      id="studycase-dashboard-root"
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#090d16] text-[#e2e8f0] dark"
          : "bg-[#f5f7fb] text-[#1e293b]"
      }`}
    >
      {/* Floating particles for task completed celebration */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute z-50 pointer-events-none rounded-full w-2.5 h-2.5 animate-ping"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
          }}
        />
      ))}

      {/* MOBILE TOP BAR HEADER */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/10">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
              {LOGO_TEXT}
            </h1>
            <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500 tracking-wider font-mono uppercase">
              {LOGO_SUBTEXT}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
            playSfx("click");
          }}
          className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          ) : (
            <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          )}
        </button>
      </div>

      {/* MOBILE DRAWER OVERLAY MENU */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm flex justify-start animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-4/5 max-w-xs bg-white dark:bg-[#0f172a] h-full shadow-2xl flex flex-col justify-between p-5 overflow-y-auto border-r border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Logo and Close Head */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 px-1">
                  <div className="p-2 bg-blue-600 rounded-lg text-white">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-850 dark:text-white">
                      {LOGO_TEXT}
                    </h4>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase font-mono leading-none">
                      {LOGO_SUBTEXT}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    playSfx("click");
                  }}
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Menu Items */}
              <nav className="space-y-1">
                {[
                  {
                    name: "Tổng quan",
                    icon: <BarChart2 className="w-4 h-4" />,
                  },
                  { name: "Bài giảng", icon: <BookOpen className="w-4 h-4" /> },
                  { name: "Luyện tập", icon: <Edit3 className="w-4 h-4" /> },
                  { name: "Đề thi", icon: <FileText className="w-4 h-4" /> },
                  { name: "AI Tutor", icon: <Bot className="w-4 h-4" /> },
                  {
                    name: "Kế hoạch học tập",
                    icon: <Calendar className="w-4 h-4" />,
                  },
                  {
                    name: "Phân tích",
                    icon: <TrendingUp className="w-4 h-4" />,
                  },
                  { name: "Thành tích", icon: <Award className="w-4 h-4" /> },
                  { name: "Cài đặt", icon: <Settings className="w-4 h-4" /> },
                ].map((item) => {
                  const isActive = activeMenu === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveMenu(item.name);
                        setIsMobileMenuOpen(false);
                        playSfx("click");
                        if (item.name === "AI Tutor") {
                          setIsAiTutorOpen(true);
                          if (chatMessages.length === 0) {
                            handleAskTutor(
                              "Tư vấn chung",
                              "Chào trợ lý AI, tớ muốn nâng điểm thi THPT Quốc Gia"
                            );
                          }
                        } else {
                          setIsAiTutorOpen(false);
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-950/45 dark:text-blue-400"
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <span
                        className={
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-400"
                        }
                      >
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Footer Area */}
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              {/* Unique profile element */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="relative w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0">
                    <span className="text-base leading-none select-none">
                      {userAvatar || "🐱"}
                    </span>
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-white dark:border-[#0f172a] rounded-full" />
                  </div>
                  <div className="text-left min-w-0">
                    <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 truncate">
                      {userName}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-none mt-0.5 font-medium">
                      Lớp 12 • Grade 12
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
                    <span className="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/55 px-1.5 py-0.5 rounded">
                      Cấp 4
                    </span>
                    <span className="font-mono">
                      {currentXP} / {targetLevelXP} XP
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 dark:bg-purple-500 h-full rounded-full transition-all duration-355"
                      style={{ width: `${(currentXP / targetLevelXP) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Theme toggle sync list */}
              <div className="flex items-center justify-between px-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 pl-1">
                  Giao diện
                </span>
                <div className="flex bg-white dark:bg-slate-800 rounded-lg p-0.5 shadow-sm border border-slate-200/50 dark:border-slate-700">
                  <button
                    onClick={() => {
                      setDarkMode(false);
                      playSfx("click");
                    }}
                    className={`p-1 rounded-md transition-all ${
                      !darkMode
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Sun className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      setDarkMode(true);
                      playSfx("click");
                    }}
                    className={`p-1 rounded-md transition-all ${
                      darkMode
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden min-h-screen">
        {/* =================================SIDEBAR================================= */}
        <aside
          id="sidebar-panel"
          className="hidden lg:flex lg:flex-col lg:w-64 lg:h-screen lg:sticky lg:top-0 bg-white dark:bg-[#0f172a] lg:border-r border-slate-200 dark:border-slate-800 justify-between p-5 z-20 shrink-0 flex-shrink-0 overflow-y-auto"
        >
          <div>
            {/* Logo Head */}
            <div className="flex items-center gap-3 mb-8 px-2">
              <div
                id="app-logo-box"
                className="p-2.5 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20"
              >
                <BrainCircuit className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                  {LOGO_TEXT}
                </h1>
                <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wider uppercase font-mono">
                  {LOGO_SUBTEXT}
                </p>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="space-y-1.5" id="sidebar-nav">
              {[
                { name: "Tổng quan", icon: <BarChart2 className="w-4 h-4" /> },
                { name: "Bài giảng", icon: <BookOpen className="w-4 h-4" /> },
                { name: "Luyện tập", icon: <Edit3 className="w-4 h-4" /> },
                { name: "Đề thi", icon: <FileText className="w-4 h-4" /> },
                { name: "AI Tutor", icon: <Bot className="w-4 h-4" /> },
                {
                  name: "Kế hoạch học tập",
                  icon: <Calendar className="w-4 h-4" />,
                },
                { name: "Phân tích", icon: <TrendingUp className="w-4 h-4" /> },
                { name: "Thành tích", icon: <Award className="w-4 h-4" /> },
                { name: "Cài đặt", icon: <Settings className="w-4 h-4" /> },
              ].map((item) => {
                const isActive = activeMenu === item.name;
                return (
                  <button
                    key={item.name}
                    id={`nav-item-${item.name
                      .toLowerCase()
                      .replace(/ /g, "-")}`}
                    onClick={() => {
                      setActiveMenu(item.name);
                      playSfx("click");
                      if (item.name === "AI Tutor") {
                        setIsAiTutorOpen(true);
                        if (chatMessages.length === 0) {
                          handleAskTutor(
                            "Tư vấn chung",
                            "Chào trợ lý AI, tớ muốn nâng điểm thi THPT Quốc Gia"
                          );
                        }
                      } else {
                        setIsAiTutorOpen(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/45 dark:text-blue-400"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`transition-transform duration-300 group-hover:scale-110 ${
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    {isActive && (
                      <span className="absolute right-0 top-1/4 bottom-1/4 w-1 bg-blue-600 dark:bg-blue-400 rounded-l" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Foot: User profile & Light/Dark toggler */}
          <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
            {/* Sĩ tử profile card */}
            <div
              id="profile-container"
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-2.5">
                <div className="relative w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0">
                  <span className="text-xl leading-none select-none">
                    {userAvatar || "🐱"}
                  </span>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-white dark:border-[#0f172a] rounded-full" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200 truncate max-w-[120px]">
                    {userName}
                  </h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    Lớp 12 • Grade 12
                  </p>
                </div>
              </div>

              {/* Progress visualizer */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-1.5 py-0.5 rounded">
                    Cấp 4
                  </span>
                  <span className="font-mono text-slate-500 dark:text-slate-400 font-medium">
                    {currentXP} / {targetLevelXP} XP
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    id="sidebar-level-progress-bar"
                    className="bg-purple-600 dark:bg-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(currentXP / targetLevelXP) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Premium Theme Switcher */}
            <div
              id="theme-switcher"
              className="flex items-center justify-between px-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl"
            >
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 pl-1.5">
                Giao diện
              </span>
              <div className="flex bg-white dark:bg-slate-800 rounded-lg p-0.5 shadow-sm border border-slate-200/50 dark:border-slate-700">
                <button
                  id="theme-light-btn"
                  onClick={() => {
                    setDarkMode(false);
                    playSfx("click");
                  }}
                  className={`p-1.5 rounded-md transition-all ${
                    !darkMode
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                  title="Chế độ Sáng"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  id="theme-dark-btn"
                  onClick={() => {
                    setDarkMode(true);
                    playSfx("click");
                  }}
                  className={`p-1.5 rounded-md transition-all ${
                    darkMode
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                  title="Chế độ Tối"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* =================================MAIN AREA================================= */}
        <main
          className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-8 overflow-x-hidden lg:overflow-y-auto lg:h-screen min-w-0"
          id="main-content-panel"
        >
          <div className="max-w-6xl mx-auto w-full space-y-8 flex flex-col">
            {/* TOP BAR / HEADER */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white"
                    id="main-welcome-greeting"
                  >
                    {headerContent.title}
                  </h2>
                  <span className="text-2xl sm:text-3xl animate-bounce duration-1000 select-none">
                    {headerContent.emoji}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                  {headerContent.subtitle}
                </p>
              </div>

              {/* Right badges & Alerts */}
              <div className="flex items-center gap-3">
                {/* Notification Center */}
                <div className="relative">
                  <button
                    id="notification-bell-btn"
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      playSfx("click");
                    }}
                    className="p-3 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl relative hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-200"
                  >
                    <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-[#0f172a]" />
                  </button>

                  {/* Notification Dropdown Drawer */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-40 space-y-3 animate-slide-up">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          Thông báo mới nhất
                        </h4>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {notificationsList.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              setSelectedNotification(n.text);
                              setShowNotifications(false);
                            }}
                            className={`p-2.5 rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer ${
                              n.unread
                                ? "border-l-4 border-blue-600 bg-blue-50/40 dark:bg-blue-950/20"
                                : ""
                            }`}
                          >
                            <p className="text-slate-800 dark:text-slate-200 line-clamp-2">
                              {n.text}
                            </p>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              {n.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Outstanding Badge exactly aligned with the screenshot */}
                <div
                  id="header-rank-badge"
                  onClick={() => {
                    setShowGoalModal(true);
                    playSfx("click");
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:shadow-sm transition-all duration-300"
                >
                  <div className="text-left">
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                      Luyện thi tích cực
                    </p>
                    <p className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                      {userRankLabel}
                    </p>
                  </div>
                  <div className="p-1 px-1.5 bg-purple-100 dark:bg-purple-950/80 rounded-lg text-purple-600 dark:text-purple-400">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </header>

            {(() => {
              switch (activeMenu) {
                case "Tổng quan":
                  return (
                    <>
                      {/* ======================= TOP 4 STATUS CARDS GRID ======================= */}
                      <section
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                        id="metric-cards-grid"
                      >
                        {[
                          {
                            id: "card-hours",
                            title: "Thời gian học hôm nay",
                            value: "3h 30m",
                            badge: "↑ 18p",
                            badgeColor:
                              "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50",
                            icon: <Clock className="w-5 h-5 text-blue-600" />,
                            iconBg: "bg-blue-50 dark:bg-blue-950/60",
                          },
                          {
                            id: "card-days",
                            title: "Tổng số ngày học",
                            value: "21 ngày",
                            badge: "Mục tiêu 100%",
                            badgeColor:
                              "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/50",
                            icon: (
                              <Calendar className="w-5 h-5 text-amber-500" />
                            ),
                            iconBg: "bg-amber-50 dark:bg-amber-950/60",
                          },
                          {
                            id: "card-units",
                            title: "Đã học chuyên đề",
                            value: "34 chuyên đề",
                            badge: "Xem thêm",
                            badgeColor:
                              "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50 cursor-pointer hover:underline",
                            icon: (
                              <BookOpen className="w-5 h-5 text-purple-500" />
                            ),
                            iconBg: "bg-purple-50 dark:bg-purple-950/60",
                            badgeAction: () => {
                              playSfx("click");
                              handleAskTutor(
                                "Xem danh sách",
                                "Tớ muốn xem báo cáo chi tiết 34 chuyên đề của tớ!"
                              );
                            },
                          },
                          {
                            id: "card-accuracy",
                            title: "Tỷ lệ chính xác bình quân",
                            value: "98.6%",
                            badge: "↑ 2.6%",
                            badgeColor:
                              "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50",
                            icon: (
                              <TrendingUp className="w-5 h-5 text-emerald-500" />
                            ),
                            iconBg: "bg-emerald-50 dark:bg-emerald-950/60",
                          },
                        ].map((card) => (
                          <div
                            key={card.id}
                            id={card.id}
                            className="bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:shadow-md transition-shadow duration-300"
                          >
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 truncate">
                                {card.title}
                              </p>
                              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                {card.value}
                              </p>

                              {card.badgeAction ? (
                                <span
                                  onClick={card.badgeAction}
                                  className={`inline-block text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-bold ${card.badgeColor}`}
                                >
                                  {card.badge}
                                </span>
                              ) : (
                                <span
                                  className={`inline-block text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-medium ${card.badgeColor}`}
                                >
                                  {card.badge}
                                </span>
                              )}
                            </div>

                            <div
                              className={`p-3.5 rounded-xl ${card.iconBg} shrink-0`}
                            >
                              {card.icon}
                            </div>
                          </div>
                        ))}
                      </section>

                      {/* ================================= ROW 2 ================================= */}
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* AI Recommendation Banner Widget (2 Columns width on XL) */}
                        <section
                          className="xl:col-span-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border border-transparent p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-indigo-300/30 dark:shadow-indigo-950/30 hover:shadow-xl transition-all duration-300"
                          id="ai-recommender-banner"
                        >
                          {/* Abs decorative background gradient glows */}
                          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                          <div className="absolute left-1/4 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                          {/* Graphic/Robot and Text Content Column */}
                          <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                            {/* Simulated cute assistant vector */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-white/10 text-white border-2 border-white/40 animate-float">
                              <Bot className="w-10 h-10 text-white animate-pulse" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="p-1 px-2.5 bg-white text-blue-600 text-[10px] font-black rounded-full tracking-wider uppercase shadow-sm">
                                  AI gợi ý hôm nay
                                </span>
                                <span className="text-white/40">•</span>
                                <span
                                  className="text-white/80 hover:text-white text-xs font-bold cursor-pointer transition-colors"
                                  onClick={() => setShowGoalModal(true)}
                                >
                                  THPT Quốc Gia
                                </span>
                              </div>

                              {/* Dynamic diagnosis highlight */}
                              <h3 className="text-lg sm:text-xl font-bold mt-2 text-white">
                                Bạn còn yếu phần{" "}
                                <span className="text-amber-300 underline decoration-wavy decoration-amber-400 underline-offset-4">
                                  Este và Muối
                                </span>
                                .
                              </h3>
                              <p className="text-xs sm:text-sm text-blue-100 mt-1 font-medium">
                                Hãy làm 20 câu để cải thiện ngay hôm nay!
                              </p>
                            </div>
                          </div>

                          {/* Target metric progress arc and detail action */}
                          <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-white/10 w-full md:w-auto justify-between md:justify-end shrink-0 relative z-10">
                            {/* 87% progress Ring exactly styled with screenshot layout */}
                            <div className="relative flex items-center justify-center">
                              <svg className="w-16 h-16 transform -rotate-90">
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="26"
                                  stroke="currentColor"
                                  strokeWidth="5"
                                  className="text-white/20"
                                  fill="transparent"
                                />
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="26"
                                  stroke="currentColor"
                                  strokeWidth="5"
                                  className="text-emerald-400"
                                  fill="transparent"
                                  strokeDasharray="163.3"
                                  strokeDashoffset={163.3 - (163.3 * 87) / 100}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute flex flex-col items-center">
                                <span className="text-xs font-black text-white">
                                  87%
                                </span>
                              </div>
                            </div>

                            <div className="text-left max-w-40">
                              <p className="text-[10px] font-extrabold tracking-wider uppercase text-blue-100/70">
                                Mục tiêu đỗ đề
                              </p>
                              <p className="text-xs font-extrabold text-white">
                                Xác suất đạt mục tiêu
                              </p>

                              <button
                                id="ai-banner-detail-btn"
                                onClick={() => {
                                  setShowRecommendModal(true);
                                  playSfx("click");
                                }}
                                className="text-xs font-black text-amber-300 hover:text-amber-200 hover:underline flex items-center gap-1 mt-1 group transition-colors cursor-pointer"
                              >
                                Xem chi tiết
                                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </section>

                        {/* AI Learning Assistant Right Card exactly matched colors */}
                        <section
                          className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm p-5 rounded-3xl flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
                          id="ai-learning-assistant-card"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                  AI Learning Assistant
                                </h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                  Trợ lý học tập cá nhân dành cho bạn
                                </p>
                              </div>
                              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/80 rounded-xl">
                                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                              </div>
                            </div>

                            {/* Grid matrix of highlights */}
                            <div className="grid grid-cols-2 gap-3 mb-5 text-left">
                              <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/15 rounded-2xl border border-emerald-100/30">
                                <span className="inline-block text-[9px] font-extrabold px-1.5 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 rounded mb-1.5 uppercase">
                                  Điểm mạnh
                                </span>
                                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                  Toán, Lý
                                </h5>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                                  Tư duy tốt
                                </p>
                              </div>

                              <div className="p-3 bg-amber-50/30 dark:bg-amber-950/10 rounded-2xl border border-amber-100/30">
                                <span className="inline-block text-[9px] font-extrabold px-1.5 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 rounded mb-1.5 uppercase">
                                  Điểm yếu
                                </span>
                                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                  Hóa (Este, Muối)
                                </h5>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                                  Cần chuyên sâu
                                </p>
                              </div>

                              <div className="p-3 bg-blue-50/30 dark:bg-blue-950/10 rounded-2xl border border-blue-100/30">
                                <span className="inline-block text-[9px] font-extrabold px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded mb-1.5 uppercase">
                                  Gợi ý hôm nay
                                </span>
                                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                  20 câu Este
                                </h5>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                                  +1 đề tổng hợp
                                </p>
                              </div>

                              <div className="p-3 bg-pink-50/30 dark:bg-pink-950/10 rounded-2xl border border-pink-100/30">
                                <span className="inline-block text-[9px] font-extrabold px-1.5 py-0.5 bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 rounded mb-1.5 uppercase">
                                  Mục tiêu
                                </span>
                                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                  Đạt 27+ điểm
                                </h5>
                                <p className="text-[10px] text-rose-500 font-extrabold mt-0.5">
                                  Còn 36 ngày
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Action Button that wakes the AI dialogue up */}
                          <div className="flex justify-center pt-2">
                            <button
                              id="ai-assistant-learn-btn"
                              onClick={() =>
                                handleAskTutor(
                                  "Hóa học Este",
                                  "Tớ muốn học cách tư duy bài toán Este nâng cao cùng cậu!"
                                )
                              }
                              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] text-white font-extrabold rounded-xl shadow-md shadow-blue-500/15 transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              🚀 Bắt đầu học cùng AI
                            </button>
                          </div>
                        </section>
                      </div>

                      {/* ================================= ROW 3 (Main column / Split context) ================================= */}
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Mission Panel (Tasks list) */}
                        <section
                          className="xl:col-span-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-5 rounded-3xl"
                          id="daily-missions-section"
                        >
                          <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                                Nhiệm vụ hôm nay
                              </h3>
                              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300 rounded-full font-bold">
                                Lớp: Grade 12
                              </span>
                            </div>

                            {/* Simulated task action refresh */}
                            <button
                              id="reset-tasks-btn"
                              onClick={() => {
                                setTasks((prev) =>
                                  prev.map((t) => ({ ...t, completed: false }))
                                );
                                playSfx("click");
                              }}
                              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                              title="Đặt lại nhiệm vụ"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Tasks mapping with absolute precision */}
                          <div className="space-y-4" id="daily-tasks-list">
                            {tasks.map((task) => (
                              <div
                                key={task.id}
                                id={`task-row-${task.id}`}
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                                  task.completed
                                    ? "bg-slate-50 dark:bg-slate-900/60 border-slate-150 dark:border-slate-850 opacity-70"
                                    : "bg-white dark:bg-[#12192e] border-slate-200 dark:border-slate-800/80 hover:border-slate-300"
                                }`}
                              >
                                {/* Checkbox and Text column */}
                                <div className="flex items-center gap-4 min-w-0">
                                  {/* Interactive Custom Styled Checkbox */}
                                  <button
                                    id={`task-checkbox-${task.id}`}
                                    onClick={() => handleToggleTask(task.id)}
                                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                                      task.completed
                                        ? "bg-blue-600 border-blue-600 text-white"
                                        : "border-slate-300 dark:border-slate-600 hover:border-blue-400"
                                    }`}
                                  >
                                    {task.completed && (
                                      <CheckSquare className="w-4 h-4" />
                                    )}
                                  </button>

                                  {/* Icon background matching exactly */}
                                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 text-lg">
                                    {task.icon}
                                  </div>

                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span
                                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${task.colorClass}`}
                                      >
                                        {task.subject}
                                      </span>
                                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                        • Thời lượng: {task.duration} •{" "}
                                        {task.questions}
                                      </span>
                                    </div>
                                    <h4
                                      className={`text-xs sm:text-sm font-bold mt-1 text-slate-900 dark:text-white truncate ${
                                        task.completed
                                          ? "line-through text-slate-400"
                                          : ""
                                      }`}
                                    >
                                      {task.title}
                                    </h4>
                                  </div>
                                </div>

                                {/* Reward tracker and ask link */}
                                <div className="flex items-center gap-4 shrink-0">
                                  <div className="text-right">
                                    <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 block">
                                      +{task.xp} XP
                                    </span>

                                    <button
                                      id={`task-ask-ai-${task.id}`}
                                      onClick={() =>
                                        handleAskTutor(
                                          task.subject,
                                          `Bài toán rèn luyện: "${task.title}"`
                                        )
                                      }
                                      className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 px-3 py-1 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/60 hover:scale-[1.02] active:scale-[0.98] border border-indigo-100/30 transition-all cursor-pointer whitespace-nowrap block mt-1"
                                    >
                                      Hỏi AI bài này
                                    </button>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-slate-300" />
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Load more dialog simulator */}
                          <div className="text-center mt-4 pt-1">
                            <button
                              id="view-all-tasks-link"
                              onClick={() => {
                                alert(
                                  "📅 Toàn bộ nhiệm vụ hôm nay đã hiển thị. Cậu hãy nỗ lực hoàn thành để bứt phá nhé!"
                                );
                                playSfx("click");
                              }}
                              className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
                            >
                              Xem tất cả nhiệm vụ{" "}
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </section>

                        {/* Bottom Left Widget: Progress Bars (Tiến độ học tập) */}
                        <section
                          className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-5 rounded-3xl"
                          id="subject-progress-section"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                                Tiến độ học tập
                              </h3>
                              <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300 rounded-full font-bold">
                                Lớp: Grade 12
                              </span>
                            </div>
                          </div>

                          <div className="space-y-4" id="progress-bars-list">
                            {subjectProgresses.map((subject) => (
                              <div
                                key={subject.name}
                                id={`progress-row-${subject.name.toLowerCase()}`}
                                onClick={() => {
                                  setSelectedSubjectAdvice(subject);
                                  playSfx("click");
                                }}
                                className="space-y-1.5 cursor-pointer group p-1 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all"
                              >
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {subject.name}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                      Giờ tích lũy: {subject.totalHours}
                                    </span>
                                    <span className="font-mono font-black text-slate-900 dark:text-white">
                                      {subject.percentage}%
                                    </span>
                                  </div>
                                </div>
                                {/* Custom high accuracy colored progress bars exactly coded from image color themes */}
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-700 ${subject.colorClass}`}
                                    style={{ width: `${subject.percentage}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-2 text-center border-t border-slate-100 dark:border-slate-800/80">
                            <button
                              id="view-progress-btn"
                              onClick={() => {
                                playSfx("click");
                                handleAskTutor(
                                  "Khảo sát toàn khóa",
                                  "Tớ muốn xem báo cáo tiến độ chi tiết 4 môn chính!"
                                );
                              }}
                              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1 mx-auto"
                            >
                              Xem chi tiết{" "}
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </section>
                      </div>

                      {/* ================================= BOTTOM AREA (Line charts & logs) ================================= */}
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Trending interactive SVG graph (Biểu đồ xu hướng rèn luyện) */}
                        <section
                          className="xl:col-span-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-5 rounded-3xl"
                          id="learning-trend-section"
                        >
                          <div className="flex justify-between items-center mb-5">
                            <div>
                              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                                Biểu đồ xu hướng rèn luyện
                              </h3>
                              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                Đối chiếu khối lượng tự học thông minh
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <select
                                id="chart-week-selector"
                                value={chartWeek}
                                onChange={(e) => {
                                  setChartWeek(e.target.value as any);
                                  playSfx("click");
                                }}
                                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-xl outline-none focus:border-blue-500 dark:text-slate-300"
                              >
                                <option value="current">Tuần này</option>
                                <option value="previous">Tuần trước</option>
                              </select>
                            </div>
                          </div>

                          {/* Render beautiful premium vertical bar chart using pure Tailwind CSS columns */}
                          <div className="pt-6" id="trend-chart-container">
                            {/* Chart Legends */}
                            <div className="flex gap-4 items-center justify-end mb-4 text-xs font-bold px-1">
                              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-350">
                                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full inline-block" />
                                <span>Tuần này</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-350">
                                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full inline-block" />
                                <span>Tuần trước</span>
                              </div>
                            </div>

                            <div className="relative flex items-end h-56 pl-10 pr-2 pb-2 border-b border-slate-150 dark:border-slate-800">
                              {/* Grid Lines behind bars */}
                              <div className="absolute inset-y-0 left-10 right-2 flex flex-col justify-between pointer-events-none">
                                <div className="w-full border-t border-slate-100 dark:border-slate-800/40" />
                                <div className="w-full border-t border-slate-100 dark:border-slate-800/40" />
                                <div className="w-full border-t border-slate-100 dark:border-slate-800/40" />
                                <div className="w-full border-t border-slate-150 dark:border-slate-800" />
                              </div>

                              {/* Simulated Y-Axis markers */}
                              <div className="absolute left-0 top-0 bottom-2 flex flex-col justify-between text-[10px] font-mono font-black text-slate-400 tracking-wider">
                                <span>6h</span>
                                <span>4h</span>
                                <span>2h</span>
                                <span>0p</span>
                              </div>

                              {/* Columns rendering side-by-side using Tailwind CSS with custom heights */}
                              <div className="w-full h-full flex justify-between items-end relative z-10 pl-2">
                                {daysKeys.map((day) => {
                                  const thisVal = (weekDataThis as any)[day];
                                  const lastVal = (weekDataLast as any)[day];
                                  // Scale heights out of max value 200
                                  const percentThis = Math.max(
                                    10,
                                    Math.min(100, (thisVal.value / 200) * 100)
                                  );
                                  const percentLast = Math.max(
                                    10,
                                    Math.min(100, (lastVal.value / 200) * 100)
                                  );

                                  const isSelected = selectedChartDay === day;

                                  return (
                                    <div
                                      key={day}
                                      className={`flex-1 flex flex-col items-center group cursor-pointer px-1 py-1.5 rounded-xl transition-all duration-250 ${
                                        isSelected
                                          ? "bg-blue-50/70 dark:bg-blue-950/20 ring-1 ring-blue-105/50 dark:ring-blue-900/30"
                                          : "hover:bg-slate-50/50 dark:hover:bg-slate-900/15"
                                      }`}
                                      onClick={() => {
                                        setSelectedChartDay(day);
                                        playSfx("click");
                                      }}
                                    >
                                      {/* Vertical Column Bars container */}
                                      <div className="w-full h-36 flex items-end justify-center gap-1 sm:gap-2 relative">
                                        {/* Bar 1: This Week (Blue color as requested) */}
                                        <div
                                          className={`w-2.5 sm:w-3 bg-blue-600 rounded-t-sm transition-all duration-300 hover:brightness-110 relative ${
                                            isSelected
                                              ? "filter brightness-110 shadow-sm"
                                              : ""
                                          } group-hover:scale-y-105`}
                                          style={{ height: `${percentThis}%` }}
                                          title={`Tuần này: ${thisVal.text}`}
                                        >
                                          {/* Hover Tooltip bubble */}
                                          <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                            Tuần này: {thisVal.text}
                                          </div>
                                        </div>

                                        {/* Bar 2: Last Week (Purple color as requested) */}
                                        <div
                                          className={`w-2.5 sm:w-3 bg-purple-500 rounded-t-sm transition-all duration-300 hover:brightness-110 relative ${
                                            isSelected
                                              ? "filter brightness-110 shadow-sm"
                                              : ""
                                          } group-hover:scale-y-105`}
                                          style={{ height: `${percentLast}%` }}
                                          title={`Tuần trước: ${lastVal.text}`}
                                        >
                                          {/* Hover Tooltip bubble */}
                                          <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                            Tuần trước: {lastVal.text}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Day Label underneath */}
                                      <span
                                        className={`text-[10px] sm:text-xs font-black mt-2 transition-colors duration-250 ${
                                          isSelected
                                            ? "text-blue-600 dark:text-blue-400"
                                            : "text-slate-500 dark:text-slate-400"
                                        }`}
                                      >
                                        {day}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Summary Advice Banner below the Column Chart */}
                            <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-2xl border border-blue-100/30 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                              <div className="flex items-center gap-2">
                                <span className="text-base">📈</span>
                                <span>
                                  Đang phân tích{" "}
                                  <strong>{selectedChartDay}</strong>: Cậu đạt{" "}
                                  <strong className="text-blue-600 dark:text-blue-400">
                                    {
                                      (weekDataThis as any)[selectedChartDay]
                                        .text
                                    }
                                  </strong>{" "}
                                  rèn luyện tuần này.
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono font-medium shrink-0">
                                Chạm từng cột để đối chiếu khối học
                              </span>
                            </div>
                          </div>
                        </section>

                        {/* Activity Logs Right column (Nhật ký hoạt động) */}
                        <section
                          className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-5 rounded-3xl"
                          id="activity-logs-section"
                        >
                          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <div>
                              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                                Nhật ký hoạt động
                              </h3>
                              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                {activities.length} hoạt động
                              </span>
                            </div>
                          </div>

                          {/* Logs item maps */}
                          <div
                            className="space-y-4 max-h-[220px] overflow-y-auto pr-1"
                            id="activity-logs-list"
                          >
                            {activities.map((act) => (
                              <div
                                key={act.id}
                                className="flex justify-between items-center text-xs group"
                                id={`activity-row-${act.id}`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 text-sm">
                                    {act.icon}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-700 dark:text-slate-300 truncate">
                                      {act.text}
                                    </p>
                                    <span className="text-[10px] text-slate-400 block font-mono">
                                      {act.time}
                                    </span>
                                  </div>
                                </div>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400 pl-1 shrink-0">
                                  +{act.xp} XP
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-3 text-center border-t border-slate-100 dark:border-slate-800">
                            <button
                              id="view-all-activities-btn"
                              onClick={() => {
                                alert(
                                  "📜 Nhật ký hoạt động học tập hôm nay đã đầy đủ!"
                                );
                                playSfx("click");
                              }}
                              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1 mx-auto"
                            >
                              Xem tất cả{" "}
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </section>
                      </div>
                    </>
                  );
                case "Bài giảng":
                  return (
                    <div
                      className="max-w-6xl mx-auto p-6 space-y-6 w-full flex flex-col"
                      id="lessons-view-container"
                    >
                      <LessonsView
                        currentXP={currentXP}
                        setCurrentXP={setCurrentXP}
                        playSfx={playSfx}
                        triggerParticles={triggerParticles}
                        addActivity={addActivity}
                        updateSubjectProgress={updateSubjectProgress}
                      />
                    </div>
                  );
                case "Luyện tập":
                  return (
                    <div
                      className="max-w-6xl mx-auto p-6 space-y-6 w-full flex flex-col"
                      id="practice-view-container"
                    >
                      <PracticeView
                        currentXP={currentXP}
                        setCurrentXP={setCurrentXP}
                        playSfx={playSfx}
                        triggerParticles={triggerParticles}
                        addActivity={addActivity}
                        updateSubjectProgress={updateSubjectProgress}
                      />
                    </div>
                  );
                case "Đề thi":
                  return (
                    <div
                      className="max-w-6xl mx-auto p-6 space-y-6 w-full flex flex-col"
                      id="exams-view-container"
                    >
                      <ExamsView
                        currentXP={currentXP}
                        setCurrentXP={setCurrentXP}
                        playSfx={playSfx}
                        triggerParticles={triggerParticles}
                        addActivity={addActivity}
                        updateSubjectProgress={updateSubjectProgress}
                      />
                    </div>
                  );
                case "AI Tutor":
                  return (
                    <div
                      className="max-w-6xl mx-auto p-6 space-y-6 w-full flex flex-col"
                      id="aitutor-view-container"
                    >
                      <AiTutorView
                        currentXP={currentXP}
                        setCurrentXP={setCurrentXP}
                        playSfx={playSfx}
                        triggerParticles={triggerParticles}
                        addActivity={addActivity}
                      />
                    </div>
                  );
                case "Cài đặt":
                  return (
                    <div
                      className="max-w-6xl mx-auto p-6 space-y-6 w-full flex flex-col"
                      id="settings-view-container"
                    >
                      <SettingsView
                        userName={userName}
                        setUserName={setUserName}
                        userAvatar={userAvatar}
                        setUserAvatar={setUserAvatar}
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                        playSfx={playSfx}
                        triggerParticles={triggerParticles}
                        setIsLoggedIn={setIsLoggedIn}
                      />
                    </div>
                  );
                case "Thành tích":
                  return (
                    <div
                      className="max-w-6xl mx-auto p-6 space-y-6 w-full flex flex-col"
                      id="achievements-view-panel"
                    >
                      {/* Primary Focus Card: Monthly Reward Card */}
                      <div className="grid grid-cols-1">
                        <MonthlyRewardCard
                          monthlyXp={Math.max(150, Math.floor(currentXP * 0.4))}
                          lifetimeXp={currentXP}
                        />
                      </div>

                      {/* Secondary Accomplishment Section: Badge Showcase */}
                      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base sm:text-lg font-black text-slate-850 dark:text-white flex items-center gap-2">
                              <span>🏆</span> Bảng danh hiệu Sĩ tử tích cực
                            </h3>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                              Hoàn thành các mốc học tập để mở khóa thêm huy
                              hiệu cao quý
                            </p>
                          </div>
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg">
                            Đã đạt: 3/5
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            {
                              id: "badge-1",
                              title: "🦉 Vua Lý Thuyết",
                              desc: "Nắm chắc kiến thức cốt lõi thông qua việc ôn tập 5 chuyên đề lý thuyết liên tục.",
                              xp: "+300 XP",
                              status: "Đã đạt",
                              color: "emerald",
                            },
                            {
                              id: "badge-2",
                              title: "🔥 Chiến Thần Tự Học",
                              desc: "Tích lũy tối thiểu 10 giờ rèn luyện các câu hỏi thích ứng có phản hồi tức tốc từ AI.",
                              xp: "+500 XP",
                              status: "Đã đạt",
                              color: "emerald",
                            },
                            {
                              id: "badge-3",
                              title: "🎯 Sát Thủ Điểm Tuyệt Đối",
                              desc: "Đạt trọn vẹn điểm tối đa 10/10 trong ít nhất 3 đề ôn tập hóa hữu cơ hoặc Este.",
                              xp: "+600 XP",
                              status: "Đã đạt",
                              color: "emerald",
                            },
                            {
                              id: "badge-4",
                              title: "⚡ Tốc Độ Chi Lực",
                              desc: "Trực tiếp xử lý chính xác 15 câu trắc nghiệm khó trong khoảng thời gian dưới 5 phút.",
                              xp: "+400 XP",
                              status: "9/15 câu",
                              color: "blue",
                            },
                            {
                              id: "badge-5",
                              title: "🌟 Người Bạn Trí Tuệ",
                              desc: "Tương tác hỏi đáp và tháo gỡ điểm nghẽn cùng Trợ lý AI đặc biệt trên 4 môn mục tiêu.",
                              xp: "+500 XP",
                              status: "2/4 môn",
                              color: "purple",
                            },
                          ].map((badge) => (
                            <div
                              key={badge.id}
                              className="p-4 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex items-start gap-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all"
                            >
                              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-500 flex items-center justify-center text-xl shrink-0 select-none">
                                🎖️
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                    {badge.title}
                                  </h4>
                                  <span className="text-[10px] font-bold font-mono text-slate-400 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                                    {badge.xp}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                                  {badge.desc}
                                </p>

                                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50 dark:border-slate-900">
                                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                                    Mốc thành tựu
                                  </span>
                                  <span
                                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                      badge.color === "emerald"
                                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
                                        : badge.color === "blue"
                                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600"
                                        : "bg-purple-50 dark:bg-purple-950/40 text-purple-600"
                                    }`}
                                  >
                                    {badge.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                default:
                  return (
                    // For other secondary menus
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-xl">
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto">
                        <Sparkles className="w-8 h-8 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-black text-slate-850 dark:text-white">
                          Tính năng hỗ trợ THPT
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                          Chuyên mục <strong>{activeMenu}</strong> đang cập nhật
                          thông tin đồng bộ cùng lộ trình cá nhân của {userName}
                          .
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveMenu("Tổng quan")}
                        className="px-5 py-2 bg-blue-600 text-white font-black text-xs uppercase tracking-wide rounded-xl shadow-md transition-all hover:bg-blue-700"
                      >
                        Quay lại Tổng quan
                      </button>
                    </div>
                  );
              }
            })()}
          </div>
        </main>
      </div>

      {/* ================================= MODALS & ACTIVE SIDE-PANELS ================================= */}

      {/* 1. CHAT BOT DIALOG PANEL (AI TUTOR MODAL) */}
      {isAiTutorOpen && (
        <div
          id="ai-tutor-side-panel"
          className="fixed inset-0 z-50 bg-[#090d16]/75 backdrop-blur-sm flex justify-end animate-fade-in"
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#0f172a] h-full shadow-2xl flex flex-col justify-between"
            id="ai-chat-panel-container"
          >
            {/* Header */}
            <header className="p-5 border-b border-slate-150 dark:border-slate-850 flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tl-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl relative">
                  <Bot className="w-6 h-6 text-white" />
                  <span className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">
                    Studycase AI Specialist
                  </h3>
                  <p className="text-[11px] text-blue-100">
                    Chủ đề: {chatSubject}
                  </p>
                </div>
              </div>
              <button
                id="close-chat-btn"
                onClick={() => {
                  setIsAiTutorOpen(false);
                  playSfx("click");
                }}
                className="p-1 px-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Messages Pane */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50 dark:bg-slate-900/40">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-5 text-slate-400">
                  <BrainCircuit className="w-12 h-12 text-slate-300 dark:text-slate-700 animate-pulse mb-3" />
                  <p className="text-sm font-semibold">
                    Tớ đã học hết giáo trình THPT Quốc Gia.
                  </p>
                  <p className="text-xs">
                    Hãy đặt câu hỏi bất kỳ về Toán, Lý, Hóa hay Anh để tớ giải
                    nhanh nhé!
                  </p>
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isModel = msg.role === "model";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isModel ? "justify-start" : "justify-end"
                      } animate-slide-up`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm shadow-sm ${
                          isModel
                            ? "bg-white dark:bg-[#151c31] text-slate-800 dark:text-slate-200"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {/* Title marker for bot */}
                        {isModel && (
                          <div className="flex items-center gap-1.5 mb-1.5 text-[10px] uppercase font-mono tracking-wider font-extrabold text-blue-600 dark:text-blue-400">
                            <BrainCircuit className="w-3.5 h-3.5" />
                            <span>Studycase Tutor</span>
                          </div>
                        )}

                        <div className="whitespace-pre-line leading-relaxed">
                          {msg.content}
                        </div>

                        <span
                          className={`text-[9px] block text-right mt-1.5 ${
                            isModel ? "text-slate-400" : "text-blue-200"
                          }`}
                        >
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Bot typing indicator */}
              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#151c31] rounded-2xl p-4 shadow-sm text-slate-400 flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-xs font-semibold">
                      AI đang phân tích lời giải...
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Helper Prompts */}
            <div className="p-3 border-t border-slate-150 dark:border-slate-800 bg-white dark:bg-[#0f172a] overflow-x-auto whitespace-nowrap flex gap-2">
              <button
                onClick={() => {
                  setUserInput("Giải thích phần đồng phân Este không no?");
                  playSfx("click");
                }}
                className="p-1.5 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:text-slate-300 shrink-0"
              >
                🧪 Đồng phân Este không no
              </button>
              <button
                onClick={() => {
                  setUserInput("Bài toán mẫu khoảng cách trong Oxyz?");
                  playSfx("click");
                }}
                className="p-1.5 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:text-slate-300 shrink-0"
              >
                📐 Bài tập khoảng cách Oxyz
              </button>
              <button
                onClick={() => {
                  setUserInput("Điểm ngữ pháp đề thi Tiếng Anh hay lặp lại?");
                  playSfx("click");
                }}
                className="p-1.5 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:text-slate-300 shrink-0"
              >
                🇬🇧 Ngữ pháp Tiếng Anh tốt
              </button>
            </div>

            {/* Footer Input Form */}
            <footer className="p-4 border-t border-slate-150 dark:border-slate-800 bg-white dark:bg-[#0f172a] rounded-bl-lg">
              <div className="flex gap-2">
                <input
                  type="text"
                  id="chat-user-textbox"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendChatMessage();
                  }}
                  placeholder="Hỏi tớ về bài tập, công thức hay đề ôn..."
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-blue-500 rounded-xl text-xs sm:text-sm outline-none text-slate-800 dark:text-white"
                />
                <button
                  id="send-chat-btn"
                  onClick={handleSendChatMessage}
                  disabled={!userInput.trim()}
                  className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shadow-md shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}

      {/* 2. CHOOSE GOALS MODAL SCREEN */}
      {showGoalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm"
          id="goals-management-modal"
        >
          <div className="bg-white dark:bg-[#0f172a] w-full max-w-md p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl animate-slide-up space-y-4">
            <header className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Luyện thi Quốc Gia
                </h4>
              </div>
              <button onClick={() => setShowGoalModal(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </header>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <p>
                Mục tiêu lớn nhất của **Minh Anh** hiện nay là đạt tối thiểu
                **27+ điểm** trong kỳ thi THPT Quốc Gia sắp tới.
              </p>

              <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl space-y-2">
                <p className="font-black text-blue-700 dark:text-blue-400">
                  Chiến thuật đề nghị từ AI:
                </p>
                <ul className="list-disc list-inside space-y-1 block leading-relaxed">
                  <li>Tập trung dứt điểm 4 môn chính (Toán, Lý, Hóa, Anh).</li>
                  <li>
                    Tăng thời lượng học bổ trợ Hóa Học từ 2h lên 3.5h mỗi tuần.
                  </li>
                  <li>Làm lại tối thiểu 3 đề chuyên sâu Hóa Este mỗi tuần.</li>
                </ul>
              </div>

              <div className="flex justify-between items-center p-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                <div>
                  <p className="font-bold">Hạn nộp mục tiêu:</p>
                  <p className="text-slate-400 font-medium">
                    Kỳ thi dự kiến: Tháng 7
                  </p>
                </div>
                <span className="font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  Còn 36 ngày
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowGoalModal(false);
                playSfx("click");
              }}
              className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl"
            >
              Đồng ý chiến thuật
            </button>
          </div>
        </div>
      )}

      {/* 3. PERFORMANCE RECOMMEND DIAL DETAILS */}
      {showRecommendModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm"
          id="recommendations-modal"
        >
          <div className="bg-white dark:bg-[#0f172a] w-full max-w-md p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl animate-slide-up space-y-4">
            <header className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-black text-base text-slate-900 dark:text-white">
                Báo cáo năng lực chi tiết
              </h4>
              <button onClick={() => setShowRecommendModal(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </header>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl justify-between">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    Xác suất đỗ:
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Dựa trên kết quả tự luyện thi thử
                  </p>
                </div>
                <span className="text-2xl font-black text-emerald-500">
                  87%
                </span>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  Đánh giá rủi ro chuyên đề:
                </p>
                <div>
                  {/* Este */}
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Mức hiểu biết hữu cơ (Este)</span>
                    <span className="text-amber-500 font-bold">
                      Cần cải thiện (62%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: "62%" }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2">
                  {/* Oxyz */}
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Tư duy không gian (Oxyz)</span>
                    <span className="text-blue-600 font-bold">
                      Xuất sắc (88%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: "88%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-normal">
                Studycase AI khuyên rằng bạn cần thêm 15 bài trắc nghiệm nhanh
                phần este để củng cố trước ngày thi tiếp theo!
              </p>
            </div>

            <button
              onClick={() => {
                setShowRecommendModal(false);
                playSfx("click");
                handleAskTutor(
                  "Hóa học Este",
                  "Cung cấp cho tớ 15 câu trắc nghiệm chuyên sâu Este"
                );
              }}
              className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl"
            >
              Luyện ngay cùng Trợ Lý
            </button>
          </div>
        </div>
      )}

      {/* 4. DISCOVER SUBJECT TIPS DETAIL */}
      {selectedSubjectAdvice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] w-full max-w-md p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl animate-slide-up space-y-4">
            <header className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Chiến lược môn {selectedSubjectAdvice.name}
              </h4>
              <button onClick={() => setSelectedSubjectAdvice(null)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </header>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Tiến độ học tập:</span>
                <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                  {selectedSubjectAdvice.percentage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Số giờ ôn tập tích lũy:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {selectedSubjectAdvice.totalHours}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Xếp hạng toàn khóa:</span>
                <span className="font-bold text-emerald-500">
                  {selectedSubjectAdvice.rank}
                </span>
              </div>

              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl space-y-1.5 mt-2">
                <p className="font-bold text-indigo-700 dark:text-indigo-400">
                  Lời khuyên nâng điểm:
                </p>
                {selectedSubjectAdvice.name === "Hóa học" ? (
                  <p className="leading-relaxed">
                    Tập trung ghi nhớ kỹ tính chất vật lý của Este (nhiệt độ sôi
                    thấp hơn axit và ancol tương ứng do không có liên kết
                    hydro), đặc biệt học phản ứng tráng gương của Este fomat.
                  </p>
                ) : selectedSubjectAdvice.name === "Toán học" ? (
                  <p className="leading-relaxed">
                    Coi kỹ kỹ thuật bấm máy tìm khoảng cách giữa hai đường thẳng
                    chéo nhau trong Oxyz để nâng tốc độ xử lý câu hỏi lấy điểm
                    9+.
                  </p>
                ) : selectedSubjectAdvice.name === "Vật lý" ? (
                  <p className="leading-relaxed">
                    Rèn luyện kỹ phần đồ thị sóng cơ học, nắm vững độ lệch pha
                    giữa hai phần tử trên cùng phương truyền sóng.
                  </p>
                ) : (
                  <p className="leading-relaxed">
                    Lên danh sách 50 Collocation thông dụng hay xuất hiện trong
                    các đề chính thức trước đó để tự tin giành điểm phần viết
                    lại câu.
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                const subj = selectedSubjectAdvice.name;
                setSelectedSubjectAdvice(null);
                playSfx("click");
                handleAskTutor(subj, `Luyện nâng điểm môn ${subj}`);
              }}
              className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl"
            >
              Hỏi AI bài mẫu {selectedSubjectAdvice.name}
            </button>
          </div>
        </div>
      )}

      {/* 5. FLOATING ALERT TOASTS */}
      {selectedNotification && (
        <div className="fixed bottom-5 right-5 z-50 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl max-w-sm border border-slate-700 flex justify-between gap-3 animate-slide-up">
          <div className="text-xs">
            <p className="font-bold text-blue-400 mb-0.5 uppercase tracking-wide">
              Lời khuyên trực tiếp
            </p>
            <p className="leading-relaxed">{selectedNotification}</p>
          </div>
          <button
            onClick={() => setSelectedNotification(null)}
            className="text-slate-400 hover:text-white shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
