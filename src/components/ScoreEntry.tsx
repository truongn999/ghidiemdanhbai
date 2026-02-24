import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Delete, Minus, Check } from 'lucide-react';
import { Player } from '../types';

interface ScoreEntryProps {
  players: Player[];
  onClose: () => void;
  onSave: (scores: Record<string, number>) => void;
  initialScores?: Record<string, number>;
}

export default function ScoreEntry({ players, onClose, onSave, initialScores }: ScoreEntryProps) {
  const isEditing = !!initialScores;
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(players[0]?.id || '');
  const [scores, setScores] = useState<Record<string, string>>(
    players.reduce((acc, p) => ({ 
      ...acc, 
      [p.id]: initialScores ? String(Math.abs(initialScores[p.id] || 0)) : '0' 
    }), {})
  );
  const [negativeMap, setNegativeMap] = useState<Record<string, boolean>>(
    players.reduce((acc, p) => ({ 
      ...acc, 
      [p.id]: initialScores ? (initialScores[p.id] || 0) < 0 : false 
    }), {})
  );

  const handleNumberClick = (num: string) => {
    setScores(prev => {
      const current = prev[selectedPlayerId] || '0';
      const nextValue = current === '0' ? num : current + num;
      
      // Limit to 4 digits
      if (nextValue.length > 4) return prev;
      
      return { ...prev, [selectedPlayerId]: nextValue };
    });
  };

  const handleDelete = () => {
    setScores(prev => {
      const current = prev[selectedPlayerId] || '0';
      const nextValue = current.length > 1 ? current.slice(0, -1) : '0';
      return { ...prev, [selectedPlayerId]: nextValue };
    });
  };

  const toggleSign = () => {
    setNegativeMap(prev => ({ ...prev, [selectedPlayerId]: !prev[selectedPlayerId] }));
  };

  const handleSave = () => {
    const finalScores: Record<string, number> = {};
    Object.entries(scores).forEach(([id, val]) => {
      const num = parseInt(val as string);
      finalScores[id] = negativeMap[id] ? -num : num;
    });
    onSave(finalScores);
  };

  const totalScore = Object.entries(scores).reduce((acc: number, [id, val]: [string, string]) => {
    const num = parseInt(val);
    return acc + (negativeMap[id] ? -num : num);
  }, 0);

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

        {/* Scrollable content: header + player grid + total */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4">
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-2xl font-black tracking-tight">{isEditing ? 'Chỉnh sửa ván' : 'Nhập điểm ván mới'}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Player Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {players.map(player => (
              <button 
                key={player.id}
                onClick={() => setSelectedPlayerId(player.id)}
                className={`flex flex-col items-center gap-3 py-1 rounded-3xl border transition-all ${
                  selectedPlayerId === player.id 
                    ? 'bg-white dark:bg-slate-800 border-primary ring-2 ring-primary shadow-xl shadow-primary/10' 
                    : 'bg-white/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="text-center">
                  <p className="text-sm font-bold truncate w-24">{player.name}</p>
                  <p className={`text-xl font-black mt-1 tracking-tighter ${selectedPlayerId === player.id ? 'text-primary' : 'text-slate-400'}`}>
                    {negativeMap[player.id] ? '-' : ''}{scores[player.id]}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center mb-4">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Tổng điểm ván này: <span className="text-slate-900 dark:text-white font-black">{totalScore}</span>
            </p>
          </div>
        </div>

        {/* Sticky bottom: Number Pad + Action Bar */}
        <div className="shrink-0 px-4 pb-4 pt-3 bg-slate-50 dark:bg-[#111622] border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <NumberButton key={num} onClick={() => handleNumberClick(num.toString())} label={num.toString()} />
            ))}
            <NumberButton 
              onClick={toggleSign} 
              label={<Minus size={24} />} 
              secondary 
              active={negativeMap[selectedPlayerId]}
            />
            <NumberButton onClick={() => handleNumberClick('0')} label="0" />
            <NumberButton onClick={handleDelete} label={<Delete size={24} />} secondary />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 h-10 rounded-2xl font-black bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 active:scale-95 transition-all"
            >
              Hủy
            </button>
            <button 
              onClick={handleSave}
              className="flex-[2] h-10 rounded-2xl font-black bg-primary text-white shadow-2xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Check size={24} />
              Lưu điểm
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface NumberButtonProps {
  label: React.ReactNode;
  onClick: () => void;
  secondary?: boolean;
  active?: boolean;
  key?: React.Key;
}

function NumberButton({ label, onClick, secondary, active }: NumberButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`h-12 flex items-center justify-center rounded-2xl text-xl font-black shadow-sm active:scale-95 transition-all ${
        active 
          ? 'bg-primary text-white' 
          : secondary 
            ? 'bg-slate-200 dark:bg-slate-800 text-slate-500' 
            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
      }`}
    >
      {label}
    </button>
  );
}
