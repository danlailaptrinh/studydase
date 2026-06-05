import React, { useState, useEffect } from "react";
import {
  BrainCircuit,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LoginPageProps {
  onLoginSuccess: (username: string) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  // Login form field states
  const [emailOrUser, setEmailOrUser] = useState("admin@studycase.vn");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle mode: "login" or "register"
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Registration states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");

  // Testimonial auto-carousel slide state
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      text: "Studycase AI giúp mình học thông minh hơn và tiến bộ mỗi ngày!",
      user: "Minh Anh",
      grade: "Học sinh lớp 12",
      avatar: "🐱",
    },
    {
      text: "Nhờ có AI Tutor tóm tắt sơ đồ tư duy Este, mình không còn sợ đề Hóa nữa!",
      user: "Tuấn Kiệt",
      grade: "Lớp 12 chuyên Hóa",
      avatar: "🧪",
    },
    {
      text: "Kho đề thi thử THPT Quốc gia bám sát thực tế cùng hỗ trợ chỉ ra các bẫy lý thuyết cực kỳ hữu ích.",
      user: "Bảo Ngọc",
      grade: "Thủ khoa khối A01",
      avatar: "🎓",
    },
  ];

  // Auto-scroll testimonials every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);

    if (authMode === "login") {
      if (!emailOrUser.trim()) {
        setErrorText("Vui lòng nhập Email hoặc tên đăng nhập.");
        return;
      }
      setIsSubmitting(true);

      // Simulate real auth network latency
      setTimeout(() => {
        setIsSubmitting(false);
        // Extracts nickname / username from input intelligently so it populates the app state
        let finalName = "Minh Anh";
        if (emailOrUser.includes("@")) {
          const parts = emailOrUser.split("@")[0];
          finalName = parts.charAt(0).toUpperCase() + parts.slice(1);
        } else {
          finalName = emailOrUser;
        }
        onLoginSuccess(finalName);
      }, 800);
    } else {
      // Register Mode Validation
      if (!regName.trim() || !regEmail.trim() || !regPass.trim()) {
        setErrorText("Vui lòng điền đầy đủ tất cả thông tin đăng ký.");
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess(regName);
      }, 900);
    }
  };

  const handleSocialLogin = (platform: string) => {
    // Show a quick fancy login feedback to the user and log them in
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(`Học sinh ${platform}`);
    }, 600);
  };

  return (
    <div
      id="login-page-root"
      className="min-h-screen w-full flex flex-col lg:flex-row bg-[#1e3a8a] selection:bg-blue-200"
    >
      {/* LEFT COLUMN: BRAND INTRODUCTION (Hidden on mobile) */}
      <div
        id="login-brand-column"
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950"
      >
        {/* Ambient background glows */}
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Header Area with Logo */}
        <div className="flex items-center gap-3 relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30">
            <BrainCircuit className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Studydase</h1>
          </div>
        </div>

        {/* 2. Middle Title Area & Cute 3D Robot Illustration */}
        <div className="my-auto space-y-8 relative z-10 text-center lg:text-left">
          <div className="space-y-3 max-w-lg">
            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight">
              Welcome back! <br />
              <span className="text-blue-300">
                Continue your learning journey
              </span>
            </h2>
            <p className="text-sm xl:text-base text-slate-300">
              AI-powered learning designed just for you.
            </p>
          </div>

          {/* 3. Central Cute Robot Illustration */}
          <div className="flex justify-center xl:justify-start">
            <img
              src="/src/assets/images/study_robot_3d_1780638115373.png"
              alt="Cute Study Robot"
              referrerPolicy="no-referrer"
              className="w-72 xl:w-80 h-auto drop-shadow-xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* 4. Bottom Testimonial Slide */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 max-w-lg mt-4 shadow-xl">
          <div className="min-h-[80px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <p className="text-sm italic leading-relaxed text-slate-150">
                  "{testimonials[currentSlide].text}"
                </p>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">
                    {testimonials[currentSlide].avatar}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-white">
                      {testimonials[currentSlide].user}
                    </h5>
                    <p className="text-[10px] text-blue-200 mt-0.5">
                      {testimonials[currentSlide].grade}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Dots */}
          <div className="flex gap-1.5 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-4 bg-white"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Đi tới nhận định ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: DYNAMIC WHITE LOGIN FORM CONTAINER */}
      <div
        id="login-form-column"
        className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12 select-none relative"
      >
        {/* Star decorations or background circles for small screens */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-blue-800/40 rounded-full blur-2xl lg:hidden pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-indigo-800/40 rounded-full blur-2xl lg:hidden pointer-events-none" />

        {/* 1. Giant White Card container */}
        <div
          id="login-card"
          className="w-full max-w-md bg-white text-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-100 flex flex-col justify-between relative z-10"
        >
          <div>
            {/* Minimal App brand indicator for mobile */}
            <div className="flex items-center gap-2 mb-6 lg:hidden justify-center">
              <div className="p-1.5 bg-blue-600 rounded-lg text-white">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <span className="font-extrabold tracking-tight text-blue-900 text-base">
                Studycase AI
              </span>
            </div>

            {/* Title / Subtitle */}
            <div className="space-y-1 mb-8 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {authMode === "login"
                  ? "Welcome back 👋"
                  : "Tạo tài khoản học tập ✨"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {authMode === "login"
                  ? "Đăng nhập để tiếp tục lộ trình học tập cá nhân"
                  : "Mở khóa AI tóm gọn mọi kiến thức & bẫy trắc nghiệm lý thuyết"}
              </p>
            </div>

            {/* Error alerts */}
            {errorText && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl animate-shake">
                ⚠️ {errorText}
              </div>
            )}

            {/* Main Forms Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === "login" ? (
                <>
                  {/* Email & Username Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-widest block font-mono">
                      Email hoặc tên đăng nhập
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={emailOrUser}
                        onChange={(e) => setEmailOrUser(e.target.value)}
                        placeholder="Nhập email hoặc tên đăng nhập"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 sm:text-sm rounded-xl outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-widest block font-mono">
                        Mật khẩu
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          alert(
                            "🔑 Một link đặt lại mật khẩu đã được gửi đến email đăng ký của bạn!"
                          )
                        }
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Quên mật khẩu?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 sm:text-sm rounded-xl outline-none transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                        title={
                          showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Full Name for register */}
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-widest block font-mono">
                      Họ và tên của bạn
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Ví dụ: Minh Anh"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 sm:text-sm rounded-xl outline-none transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-widest block font-mono">
                      Địa chỉ Email
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 sm:text-sm rounded-xl outline-none transition-all"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-widest block font-mono">
                      Mật khẩu bảo mật
                    </label>
                    <input
                      type="password"
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      placeholder="Mật khẩu ít nhất 8 ký tự"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 sm:text-sm rounded-xl outline-none transition-all font-mono"
                    />
                  </div>
                </>
              )}

              {/* Submit Main Button with arrow icon */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[98%] text-white font-bold text-sm tracking-wide rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75 disabled:cursor-wait"
              >
                <span>
                  {isSubmitting
                    ? "Đang kết nối..."
                    : authMode === "login"
                    ? "Đăng nhập"
                    : "Tạo tài khoản"}
                </span>
                {!isSubmitting && (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </form>

            {/* Divider social */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-150" />
              </div>
              <div className="relative flex justify-center text-xs text-slate-400 font-medium bg-white px-3 uppercase tracking-wider font-mono">
                Hoặc đăng nhập với
              </div>
            </div>

            {/* 6. Social Logins component */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSocialLogin("Google")}
                className="py-2 px-4 border border-slate-200 hover:bg-slate-50 active:scale-95 rounded-xl text-slate-600 font-bold transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                title="Đăng nhập qua Google"
              >
                <span className="text-sm">🌐</span>
                <span className="hidden sm:inline">Google</span>
              </button>

              <button
                onClick={() => handleSocialLogin("Facebook")}
                className="py-2 px-4 border border-slate-200 hover:bg-slate-50 active:scale-95 rounded-xl text-slate-600 font-bold transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                title="Đăng nhập qua Facebook"
              >
                <span className="text-sm">🔵</span>
                <span className="hidden sm:inline">Facebook</span>
              </button>

              <button
                onClick={() => handleSocialLogin("Apple")}
                className="py-2 px-4 border border-slate-200 hover:bg-slate-50 active:scale-95 rounded-xl text-slate-600 font-bold transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                title="Đăng nhập qua Apple ID"
              >
                <span className="text-sm">🍎</span>
                <span className="hidden sm:inline">Apple</span>
              </button>
            </div>
          </div>

          {/* 7. Footer Toggle Auth Mode */}
          <div className="text-center mt-8 pt-4 border-t border-slate-50">
            <p className="text-xs sm:text-sm text-slate-500">
              {authMode === "login" ? (
                <>
                  Chưa có tài khoản?{" "}
                  <button
                    onClick={() => {
                      setAuthMode("register");
                      setErrorText(null);
                    }}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Đăng ký ngay
                  </button>
                </>
              ) : (
                <>
                  Đã có tài khoản?{" "}
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setErrorText(null);
                    }}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Đăng nhập tại đây
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
