import React, { useState } from "react";
import { Award, Gift, Sparkles, X, Check, ShoppingBag, Landmark } from "lucide-react";

interface MonthlyRewardCardProps {
  monthlyXp: number;
  lifetimeXp: number;
}

interface GiftItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  badge?: string;
}

export default function MonthlyRewardCard({ monthlyXp, lifetimeXp }: MonthlyRewardCardProps) {
  const [isGiftShopOpen, setIsGiftShopOpen] = useState(false);
  const [currentMonthlyXp, setCurrentMonthlyXp] = useState(monthlyXp);
  const [redeemedItems, setRedeemedItems] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Level computation: 1000 XP per level
  const computedLevel = Math.floor(lifetimeXp / 1000) + 1;
  const xpInCurrentLevel = lifetimeXp % 1000;
  const xpThreshold = 1000;
  const progressPercentage = Math.min(100, (xpInCurrentLevel / xpThreshold) * 100);

  // Vietnam high school student exam prep theme rewards
  const giftItems: GiftItem[] = [
    {
      id: "gift-1",
      name: "Tài liệu 100% Cực Phẩm Este 12",
      description: "Tóm gọn 34 dạng bài toán Este & Lipit kèm theo lời giải chi tiết và mẹo phá bẫy.",
      cost: 200,
      icon: "📚",
      badge: "Học tập Hot"
    },
    {
      id: "gift-2",
      name: "Voucher Free Trà Sữa Phúc Long",
      description: "Mã giảm giá trực tiếp 50K khi đặt trà sữa nạp năng lượng ôn thi đêm muộn.",
      cost: 800,
      icon: "🧋",
      badge: "Ẩm thực"
    },
    {
      id: "gift-3",
      name: "Tính năng AI Tutor siêu tốc (7 ngày)",
      description: "Tăng tốc độ phản hồi của trợ lý AI và mở rộng số lượt hỏi đáp chuyên sâu 24/7.",
      cost: 500,
      icon: "⚡",
      badge: "Hội viên"
    },
    {
      id: "gift-4",
      name: "Combo Đề thi thử chuyên sâu 4 môn",
      description: "Toán, Lý, Hóa, Anh bám sát ma trận đề minh họa của Bộ Giáo dục & Đào tạo.",
      cost: 400,
      icon: "📝"
    },
    {
      id: "gift-5",
      name: "Bộ Sticker Sĩ Tử Quyết Thi Đỗ Đại Học",
      description: "Vật phẩm số hóa cao cấp giúp trang trí tài khoản cá nhân, vinh danh bảng vàng.",
      cost: 150,
      icon: "🎨",
      badge: "Giới hạn"
    }
  ];

  const handleRedeem = (item: GiftItem) => {
    if (currentMonthlyXp < item.cost) {
      alert(`⚠️ Không đủ điểm! Cậu cần thêm ${item.cost - currentMonthlyXp} XP để đổi món quà này.`);
      return;
    }

    setCurrentMonthlyXp(prev => prev - item.cost);
    setRedeemedItems(prev => [...prev, item.id]);
    setSuccessMessage(`🎉 Chúc mừng sĩ tử! Đổi thành công: "${item.name}". Mã kích hoạt đã được gửi tới hòm thư.`);
    
    // Auto-clear success toast after 4 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  return (
    <div 
      id="monthly-reward-card-container" 
      className="bg-white dark:bg-white text-slate-800 border border-slate-200 shadow-sm rounded-2xl p-6 relative flex flex-col justify-between transition-all duration-300 hover:shadow-md"
    >
      {/* Upper part: Level based on lifetimeXp && Horizontal progress bar */}
      <div id="monthly-reward-card-header" className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold tracking-wide uppercase font-mono">Đẳng cấp học thuật</span>
              <h3 className="text-lg font-black text-slate-900 leading-tight">Cấp {computedLevel}</h3>
            </div>
          </div>
          <div className="text-right font-mono text-xs text-slate-500">
            <span className="font-bold text-slate-700">{xpInCurrentLevel}</span> / {xpThreshold} XP
          </div>
        </div>

        {/* Progress bar container */}
        <div className="space-y-1">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              id="monthly-level-progress-bar"
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>Tiến trình cấp học này</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 my-4" />

      {/* Lower part: Large bold font monthly Xp reward text */}
      <div id="monthly-reward-card-body" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-1">
        <div className="space-y-1">
          <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider font-mono">Tích lũy tháng này</p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
            Điểm đổi thưởng tháng này: <span className="text-blue-600">{currentMonthlyXp} XP</span>
          </h2>
        </div>

        {/* Action Button: Bottom right */}
        <button
          onClick={() => setIsGiftShopOpen(true)}
          className="sm:self-end px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm tracking-wide rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
          id="btn-open-gift-shop"
        >
          <span>🎁 Đổi quà ngay</span>
        </button>
      </div>

      {/* GIFT SHOP MODAL VIEW */}
      {isGiftShopOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          id="gift-shop-modal-container"
        >
          <div 
            className="bg-white dark:bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 text-slate-800"
            id="gift-shop-modal-card"
          >
            {/* Modal Header */}
            <header className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Cửa hàng quà tặng Sĩ Tử 12</h2>
                  <p className="text-xs text-slate-500 font-medium">Bứt phá điểm thi lý thuyết & rèn luyện nâng điểm</p>
                </div>
              </div>
              <button 
                onClick={() => setIsGiftShopOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
                aria-label="Đóng cửa hàng"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Sub-header showing balance */}
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-blue-900">Quỹ điểm đổi thưởng của bạn:</span>
              </div>
              <span className="text-base font-extrabold text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200 shadow-xs font-mono">
                {currentMonthlyXp} XP Available
              </span>
            </div>

            {/* Toast feedback messages */}
            {successMessage && (
              <div className="mx-6 mt-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold rounded-xl flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-200">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Scrollable Catalog of Rewards */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Vật phẩm đang có sẵn dồi dào</h4>
              <div className="grid grid-cols-1 gap-3">
                {giftItems.map(item => {
                  const hasRedeemed = redeemedItems.includes(item.id);
                  const canAfford = currentMonthlyXp >= item.cost;

                  return (
                    <div 
                      key={item.id}
                      className={`p-4 border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                        hasRedeemed 
                        ? "border-slate-100 bg-slate-50/50 opacity-90" 
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <span className="text-3xl p-2 bg-slate-50 rounded-xl leading-none block shrink-0">{item.icon}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">{item.name}</h5>
                            {item.badge && (
                              <span className="px-2 py-0.5 bg-rose-550/10 text-rose-600 text-[9px] font-bold rounded-md uppercase tracking-wider">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed mt-1">{item.description}</p>
                        </div>
                      </div>

                      {/* Redeem Controls */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 shrink-0 gap-2">
                        <span className="text-sm font-black text-orange-600 font-mono flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin duration-3000" />
                          {item.cost} XP
                        </span>

                        {hasRedeemed ? (
                          <div className="px-3 py-1 bg-emerald-550/10 text-emerald-600 text-xs font-bold rounded-lg flex items-center gap-1.5 border border-emerald-200/50">
                            <Check className="w-3.5 h-3.5" />
                            <span>Đã nhận!</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRedeem(item)}
                            disabled={!canAfford}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg tracking-wide transition-all ${
                              canAfford 
                              ? "bg-slate-900 hover:bg-slate-800 text-white active:scale-95 shadow-sm" 
                              : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            Đóng gói & Nhận
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <footer className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <p className="text-[10px] sm:text-xs text-slate-400 max-w-xs leading-relaxed">
                * Vật phẩm số hóa sẽ kích hoạt ngay lập tức. Với voucher trà sữa Phúc Long, mã quà tặng sẽ được lưu tại tài khoản học tập của bạn.
              </p>
              <button 
                onClick={() => setIsGiftShopOpen(false)}
                className="px-5 py-2 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                Đóng
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
