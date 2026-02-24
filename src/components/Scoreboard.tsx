import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Trophy, Plus, Edit2, CheckCircle, Trash2, Crown } from 'lucide-react';
import { Player, Match } from '../types';

interface ScoreboardProps {
  match: Match | null;
  players: Player[];
  onAddScore: () => void;
  onCreateMatch: () => void;
  onEditRound: (roundId: string) => void;
  onDeleteRound: (roundId: string) => void;
  onEndMatch: () => void;
}

export default function Scoreboard({ match, players, onCreateMatch, onEditRound, onDeleteRound, onEndMatch }: ScoreboardProps) {
  if (!match) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between px-4 h-16">
            <h1 className="text-xl font-black tracking-tight">Bảng điểm</h1>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Trophy size={40} className="text-primary" />
            </div>
            <h2 className="text-xl font-black tracking-tight mb-2">Chưa có sòng nào</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              Tạo một sòng mới để bắt đầu ghi điểm và theo dõi thành tích.
            </p>
            <button
              onClick={onCreateMatch}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-3xl shadow-xl shadow-primary/30 flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
            >
              <Plus size={22} />
              <span>Tạo Sòng mới</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  const matchPlayers = match.players.map(id => players.find(p => p.id === id)).filter(Boolean) as typeof players;
  const [showSummary, setShowSummary] = useState(false);

  // Compute totals for summary
  const playerTotals = matchPlayers.map(p => ({
    player: p,
    total: match.rounds.reduce((sum, r) => sum + (r.scores[p.id] || 0), 0),
  }));
  const sortedTotals = [...playerTotals].sort((a, b) => b.total - a.total);
  const winner = sortedTotals[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-black tracking-tight">Bảng điểm</h1>
          <button 
            onClick={() => {
              if (window.confirm('Bạn có chắc muốn kết thúc sòng này?')) {
                setShowSummary(true);
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-colors"
          >
            <CheckCircle size={16} />
            <span>Kết thúc</span>
          </button>
        </div>
        
        {/* Horizontal Standings */}
        <div className="px-4 py-2 overflow-x-auto no-scrollbar flex gap-2">
          {(() => {
            const totals = matchPlayers.map(player => ({
              id: player.id,
              total: match.rounds.reduce((sum, round) => sum + (round.scores[player.id] || 0), 0),
            }));
            const sorted = [...totals].sort((a, b) => b.total - a.total);
            const rankMap: Record<string, number> = {};
            let currentRank = 1;
            sorted.forEach((entry, i) => {
              if (i > 0 && entry.total < sorted[i - 1].total) {
                currentRank = i + 1;
              }
              rankMap[entry.id] = currentRank;
            });

            return matchPlayers.map((player) => {
              const matchTotal = totals.find(t => t.id === player.id)!.total;
              const rank = rankMap[player.id];
              return (
                <div 
                  key={player.id}
                  className={`flex-shrink-0 p-2 transition-all flex flex-col items-center justify-center 
                  }`}
                >
                  <p className={`text-[10px] uppercase tracking-widest font-black opacity-70 ${rank === 1 ? 'text-primary' : 'text-slate-500'}`}>
                    {player.name.split(' ').pop()}
                  </p>
                  <p className="text-md font-black mt-1 tracking-tighter rounded-full w-10 h-10 flex items-center justify-center border">{matchTotal}</p>
                  <div className={`mt-2 flex items-center gap-1 text-[8px] font-bold ${
                    rank === 1 ? 'text-primary' : 'text-slate-500'
                  }`}>
                    <span>H. {rank}</span>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </header>

      {/* History List */}
      <main className="flex-1 px-4 py-4 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-lg tracking-tight">Lịch sử ván đấu</h3>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Tổng cộng {match.rounds.length} ván
          </span>
        </div>

        <div className="space-y-4">
          {[...match.rounds].reverse().map((round, idx) => (
            <div 
              key={round.id}
              className="bg-white dark:bg-slate-800/40 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/30 transition-colors"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                    Ván #{match.rounds.length - idx}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                    onClick={() => onEditRound(round.id)}
                    className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Bạn có chắc muốn xóa ván này?')) {
                        onDeleteRound(round.id);
                      }
                    }}
                    className="size-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                    <Clock size={12} />
                    <span>{getTimeAgo(round.timestamp)}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {match.players.map(playerId => {
                  const score = round.scores[playerId] || 0;
                  const player = players.find(p => p.id === playerId);
                  return (
                    <div key={playerId} className="text-center">
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter truncate">
                        {player?.name.split(' ').pop()}
                      </p>
                      <p className={`text-lg font-black tracking-tighter ${
                        score > 0 ? 'text-emerald-500' : score < 0 ? 'text-red-500' : 'text-slate-400'
                      }`}>
                        {score > 0 ? `+${score}` : score}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Match Summary Popup */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-primary/10 p-6 text-center">
                <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Trophy size={32} className="text-primary" />
                </div>
                <h2 className="text-xl font-black tracking-tight">Kết thúc sòng</h2>
                <p className="text-sm text-slate-500 mt-1">{match.name} · {match.rounds.length} ván</p>
              </div>

              {/* Player Rankings */}
              <div className="p-5 space-y-2">
                {sortedTotals.map((entry, idx) => (
                  <div
                    key={entry.player.id}
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${
                      idx === 0
                        ? 'bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/50'
                    }`}
                  >
                    <div className={`size-8 rounded-full flex items-center justify-center text-xs font-black ${
                      idx === 0 ? 'bg-amber-400 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}>
                      {idx === 0 ? <Crown size={16} /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold truncate ${idx === 0 ? 'text-amber-700 dark:text-amber-400' : ''}`}>
                        {entry.player.name}
                      </p>
                    </div>
                    <p className={`text-lg font-black tracking-tighter ${
                      idx === 0 ? 'text-amber-600 dark:text-amber-400' : entry.total >= 0 ? 'text-slate-600 dark:text-slate-300' : 'text-red-500'
                    }`}>
                      {entry.total}
                    </p>
                  </div>
                ))}
              </div>

              {/* OK Button */}
              <div className="px-5 pb-5">
                <button
                  onClick={() => {
                    setShowSummary(false);
                    onEndMatch();
                  }}
                  className="w-full py-4 bg-primary text-white font-black text-base rounded-2xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getTimeAgo(timestamp: number) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Vừa xong';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return new Date(timestamp).toLocaleDateString();
}
