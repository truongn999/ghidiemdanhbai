import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Plus, UserPlus, Trash2, Check } from 'lucide-react';

interface CreateMatchProps {
  onClose: () => void;
  onSave: (matchName: string, playerNames: string[]) => void;
}

export default function CreateMatch({ onClose, onSave }: CreateMatchProps) {
  const [matchName, setMatchName] = useState('Trận đấu mới');
  const [playerNames, setPlayerNames] = useState<string[]>(['', '']);

  const addPlayerField = () => {
    setPlayerNames([...playerNames, '']);
  };

  const removePlayerField = (index: number) => {
    if (playerNames.length <= 2) return;
    const newNames = [...playerNames];
    newNames.splice(index, 1);
    setPlayerNames(newNames);
  };

  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleSave = () => {
    const validNames = playerNames.filter(name => name.trim() !== '');
    if (validNames.length < 2) {
      alert('Cần ít nhất 2 người chơi');
      return;
    }
    onSave(matchName, validNames);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center"
    >
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-md bg-slate-50 dark:bg-[#111622] rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-800" />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-40">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight">Tạo Sòng Mới</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Match Name */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 px-1">Tên sòng / Trận đấu</label>
              <input 
                type="text" 
                value={matchName}
                onChange={(e) => setMatchName(e.target.value)}
                placeholder="VD: Billiards, Tiến Lên, Poker..."
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-primary focus:border-transparent font-bold transition-all outline-none"
              />
            </div>

            {/* Players List */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Danh sách người chơi</label>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{playerNames.length} người</span>
              </div>
              
              <div className="space-y-3">
                {playerNames.map((name, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1 relative">
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => updatePlayerName(index, e.target.value)}
                        placeholder={`Tên người chơi ${index + 1}`}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-primary focus:border-transparent font-bold transition-all outline-none"
                      />
                    </div>
                    {playerNames.length > 2 && (
                      <button 
                        onClick={() => removePlayerField(index)}
                        className="size-14 flex items-center justify-center rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button 
                onClick={addPlayerField}
                className="w-full mt-4 py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 font-bold"
              >
                <Plus size={20} />
                <span>Thêm người chơi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-2 mb-2 bg-slate-50 dark:bg-[#111622] border-t border-slate-200 dark:border-slate-800 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 h-14 rounded-2xl font-black bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 active:scale-95 transition-all"
          >
            Hủy
          </button>
          <button 
            onClick={handleSave}
            className="flex-[2] h-14 rounded-2xl font-black bg-primary text-white shadow-2xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Check size={24} />
            Bắt đầu sòng
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
