import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    title: "Nhập điểm nhanh chóng",
    description: "Ghi lại điểm số tức thì với bàn phím chuyên dụng được thiết kế tối ưu cho mọi trò chơi board game hay thể thao.",
    image: "https://picsum.photos/seed/score/800/600",
    color: "bg-primary"
  },
  {
    title: "Bảng xếp hạng realtime",
    description: "Tự động sắp xếp thứ hạng người chơi ngay sau khi cập nhật điểm. Theo dõi phong độ của mọi người.",
    image: "https://picsum.photos/seed/rank/800/600",
    color: "bg-emerald-500"
  },
  {
    title: "Quản lý người chơi",
    description: "Dễ dàng thêm, sửa hoặc xóa người chơi trong nhóm của bạn. Lưu lại lịch sử thắng thua.",
    image: "https://picsum.photos/seed/players/800/600",
    color: "bg-purple-500"
  }
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide === SLIDES.length - 1) {
      onComplete();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="flex items-center justify-end p-4">
        <button 
          onClick={onComplete}
          className="text-primary font-bold hover:opacity-80 transition-opacity"
        >
          Bỏ qua
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center"
          >
            <div className="w-full aspect-square max-w-sm rounded-3xl overflow-hidden shadow-2xl mb-12 relative">
              <img 
                src={SLIDES[currentSlide].image} 
                alt={SLIDES[currentSlide].title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <h2 className="text-3xl font-black text-center mb-4 tracking-tight">
              {SLIDES[currentSlide].title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-center max-w-xs leading-relaxed">
              {SLIDES[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2 mt-12">
          {SLIDES.map((_, i) => (
            <div 
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-slate-300 dark:bg-slate-700'}`}
            />
          ))}
        </div>
      </div>

      <div className="p-8 pb-12">
        <button 
          onClick={nextSlide}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          {currentSlide === SLIDES.length - 1 ? (
            <>Bắt đầu ngay <Check size={20} /></>
          ) : (
            <>Tiếp theo <ArrowRight size={20} /></>
          )}
        </button>
      </div>
    </div>
  );
}
