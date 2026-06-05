import { useState, useEffect } from "react";
import { 
  User, 
  Settings, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  BellRing, 
  Trash2, 
  ShieldAlert, 
  RotateCcw, 
  Save, 
  LogOut,
  Sparkles,
  Bot
} from "lucide-react";

interface SettingsViewProps {
  userName: string;
  setUserName: (n: string) => void;
  userAvatar: string;
  setUserAvatar: (a: string) => void;
  darkMode: boolean;
  setDarkMode: (d: boolean) => void;
  playSfx: (type: 'check' | 'level' | 'click') => void;
  triggerParticles: () => void;
  setIsLoggedIn?: (val: boolean) => void;
}

export default function SettingsView({
  userName,
  setUserName,
  userAvatar,
  setUserAvatar,
  darkMode,
  setDarkMode,
  playSfx,
  triggerParticles,
  setIsLoggedIn
}: SettingsViewProps) {
  const [localName, setLocalName] = useState(userName);
  const [localAvatar, setLocalAvatar] = useState(userAvatar);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [tipsEnabled, setTipsEnabled] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setLocalName(userName);
  }, [userName]);

  useEffect(() => {
    setLocalAvatar(userAvatar);
  }, [userAvatar]);

  // Load sound configurations
  useEffect(() => {
    const sEnabled = localStorage.getItem("studycase_sound_enabled") !== "false";
    setSoundEnabled(sEnabled);
    const tEnabled = localStorage.getItem("studycase_tips_enabled") !== "false";
    setTipsEnabled(tEnabled);
  }, []);

  const handleSaveSettingsByButton = () => {
    if (!localName.trim()) return;
    setUserName(localName);
    setUserAvatar(localAvatar);
    
    // Save to sound preference configurations
    localStorage.setItem("studycase_sound_enabled", soundEnabled ? "true" : "false");
    localStorage.setItem("studycase_tips_enabled", tipsEnabled ? "true" : "false");

    playSfx('check');
    triggerParticles();
    alert("💾 Cập nhật hồ sơ thành công! Chào mừng " + localName + " trở lại hành trình tranh tài.");
  };

  const handleSoundToggle = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("studycase_sound_enabled", next ? "true" : "false");
    if (next) playSfx('click');
  };

  const handleResetEverythingLocal = () => {
    localStorage.clear();
    playSfx('level');
    alert("🪫 Hệ thống đã thực hiện đặt lại dữ liệu học tập về mức mặc định và đăng xuất sạch tài khoản. Trang sẽ được tải lại!");
    window.location.reload();
  };

  // Avatar presets list
  const avatarPresets = [
    { label: "Mèo Chăm Chỉ 🐱", emoji: "🐱" },
    { label: "Sĩ Tử Ninja 🥷", emoji: "🥷" },
    { label: "Kêu Điểm 10 🚀", emoji: "🚀" },
    { label: "Nhà Bác Học 🧑‍🔬", emoji: "🧑‍🔬" },
    { label: "Cú Học Đêm 🦉", emoji: "🦉" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up text-left" id="settings-view-root">
      
      {/* Settings Card Base */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* Title row */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white"> Thiết lập Tài khoản & Hệ thống</h3>
        </div>

        {/* PROFILE EDITOR BOX */}
        <section className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest block">1. Thông tin Sĩ tử (Hồ sơ)</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Display Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Họ và tên hiển thị</label>
              <input 
                type="text" 
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-bold text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Avatar Selector Presets list */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Biểu tượng Đại diện</label>
              <div className="flex flex-wrap gap-2 pt-1 border border-transparent">
                {avatarPresets.map((av, i) => (
                  <button
                    key={i}
                    onClick={() => { setLocalAvatar(av.emoji); playSfx('click'); }}
                    className={`w-9 h-9 rounded-full text-base flex items-center justify-center transition-all ${
                      localAvatar === av.emoji 
                        ? "bg-blue-600 border-2 border-blue-200 shadow-md transform scale-110" 
                        : "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800"
                    }`}
                    title={av.label}
                  >
                    {av.emoji}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* SYSTEM CONFIGS BOX */}
        <section className="space-y-4 pt-2">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest block">2. Cấu hình Hệ thống & Giao diện</h4>
          
          <div className="space-y-3">
            
            {/* Theme Toggle option */}
            <div className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-850">
              <div className="space-y-0.5">
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">Chế độ hiển thị (Theme)</p>
                <p className="text-[10px] text-slate-400">Tự động cấu hình phông giảm nhức mỏi mắt</p>
              </div>
              <button
                onClick={() => { setDarkMode(!darkMode); playSfx('click'); }}
                className="p-2.5 rounded-lg bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-850 transition-all text-slate-600 dark:text-slate-300"
              >
                {darkMode ? (
                  <div className="flex items-center gap-1.5 text-xs text-blue-400 font-bold">
                    <Moon className="w-4 h-4 text-blue-400" />
                    <span>Dark Mode</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Light Mode</span>
                  </div>
                )}
              </button>
            </div>

            {/* Sound Toggle option */}
            <div className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-850">
              <div className="space-y-0.5">
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">Hiệu ứng Âm thanh SFX</p>
                <p className="text-[10px] text-slate-400">Phát âm điệu khi tích thành tích hoặc chọn đáp án đúng</p>
              </div>
              
              <button
                onClick={handleSoundToggle}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
                  soundEnabled 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20" 
                    : "bg-slate-200 text-slate-400 border-slate-300 dark:bg-slate-950"
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{soundEnabled ? "Kích hoạt" : "Đã tắt"}</span>
              </button>
            </div>

            {/* AI notifications tips banner */}
            <div className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-850">
              <div className="space-y-0.5">
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">Nhắc nhở Ôn thi từ AI</p>
                <p className="text-[10px] text-slate-400">Tính năng hiển thị popups khuyên giải chiến thuật học</p>
              </div>
              
              <button
                onClick={() => { setTipsEnabled(!tipsEnabled); playSfx('click'); }}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
                  tipsEnabled 
                    ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20" 
                    : "bg-slate-200 text-slate-400 border-slate-300 dark:bg-slate-950"
                }`}
              >
                <BellRing className="w-4 h-4 font-semibold" />
                <span>{tipsEnabled ? "Bật" : "Tắt"}</span>
              </button>
            </div>

          </div>
        </section>

        {/* SAVE PROFILE PROFILE ACTIONS */}
        <div className="pt-2 flex justify-end gap-3 flex-wrap">
          {setIsLoggedIn && (
            <button
              onClick={() => {
                playSfx('click');
                setIsLoggedIn(false);
              }}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black flex items-center gap-1.5 uppercase tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-slate-500" />
              <span>Đăng xuất</span>
            </button>
          )}
          <button
            onClick={handleSaveSettingsByButton}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 uppercase tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-blue-500/10 cursor-pointer"
          >
            <Save className="w-4 h-4 font-black" />
            <span>Xác nhận Lưu cấu hình</span>
          </button>
        </div>

        {/* DATA MANAGEMENT (RESET DESTRUCTIVE SETTINGS) */}
        <section className="pt-4 border-t border-red-100/50 dark:border-red-950/15">
          <div className="p-4 bg-red-50/40 dark:bg-red-950/5 rounded-2xl border border-red-200/40 flex justify-between items-center gap-4">
            <div className="space-y-0.5 text-left">
              <p className="text-xs font-black text-rose-700 dark:text-rose-400 flex items-center gap-1">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Khu vực Nguy hiểm
              </p>
              <p className="text-[11px] text-slate-400 leading-normal">Xóa sạch toàn bộ mốc dữ liệu cục bộ học lý thuyết, lịch sử đề thi, điểm thi thử tốt nghiệp và đăng xuất.</p>
            </div>

            {!showResetConfirm ? (
              <button
                onClick={() => { setShowResetConfirm(true); playSfx('click'); }}
                className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 dark:border-red-900/40 dark:text-red-400 text-xs font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1 shrink-0"
              >
                <LogOut className="w-4 h-4" /> 
                <span>Đăng xuất & Reset</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 text-slate-600 text-[10px] font-bold rounded-lg"
                >
                  Hủy
                </button>
                <button
                  onClick={handleResetEverythingLocal}
                  className="px-3 py-1.5 bg-rose-600 text-white text-[10px] font-black rounded-lg uppercase flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Chắc chắn xóa
                </button>
              </div>
            )}
          </div>
        </section>

      </div>

    </div>
  );
}
