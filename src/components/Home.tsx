import { Bell, ArrowRight, PlusCircle, Users, History, TrendingUp, Trophy, ChevronRight } from 'lucide-react';
import { Player, Match } from '../types';

interface HomeProps {
  currentMatch: Match | null;
  players: Player[];
  matchHistory: Match[];
  onStartNew: () => void;
  onCreateMatch: () => void;
  onViewMatch: () => void;
  onViewHistory: () => void;
  onViewPlayers: () => void;
}

export default function Home({ currentMatch, players, matchHistory, onStartNew, onCreateMatch, onViewMatch, onViewHistory, onViewPlayers }: HomeProps) {
  const totalRounds = matchHistory.reduce((sum, m) => sum + m.rounds.length, 0)
    + (currentMatch?.rounds.length || 0);
  const topPlayer = [...players].sort((a, b) => b.totalWins - a.totalWins)[0];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-full border-2 border-primary/30 p-0.5 overflow-hidden">
            <img 
              src="https://picsum.photos/seed/user/200" 
              alt="User" 
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-xs text-slate-500 dark:text-slate-400 font-medium">Chào mừng trở lại,</h1>
            <p className="text-base font-bold">Người chơi</p>
          </div>
        </div>
        <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <Bell size={20} />
        </button>
      </header>

      {/* Ongoing Match Card */}
      {/* {currentMatch && (
        <section className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-800 border border-white/5 p-6 shadow-2xl">
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live</span>
          </div>
          
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Trận đấu đang diễn ra</p>
          <h2 className="text-2xl font-black text-white mb-6">{currentMatch.name}</h2>
          
          <div className="flex justify-between items-center bg-white/5 backdrop-blur-sm p-5 rounded-2xl mb-6">
            <div className="text-center flex-1">
              <p className="text-xs text-slate-400 mb-2 font-medium">
                {players.find(p => p.id === currentMatch.players[0])?.name || 'Người chơi 1'}
              </p>
              <p className="text-4xl font-black text-white tracking-tighter">
                {players.find(p => p.id === currentMatch.players[0])?.currentScore || 0}
              </p>
            </div>
            <div className="px-4 text-slate-600 font-black text-sm italic">VS</div>
            <div className="text-center flex-1">
              <p className="text-xs text-slate-400 mb-2 font-medium">
                {players.find(p => p.id === currentMatch.players[1])?.name || 'Người chơi 2'}
              </p>
              <p className="text-4xl font-black text-white tracking-tighter">
                {players.find(p => p.id === currentMatch.players[1])?.currentScore || 0}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onViewMatch}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
          >
            <span>Xem chi tiết trận đấu</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </section>
      )} */}

      {/* Quick Actions */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] px-1">Thao tác nhanh</h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="grid grid-cols-2 gap-3">
            {/* <button 
              onClick={onStartNew}
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-3xl bg-primary text-white shadow-xl shadow-primary/20 hover:opacity-95 transition-all active:scale-[0.98]"
            >
              <PlusCircle size={28} />
              <p className="font-black text-sm">Ván mới</p>
            </button> */}
            <button 
              onClick={onCreateMatch}
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:opacity-95 transition-all active:scale-[0.98]"
            >
              <Users size={28} />
              <p className="font-black text-sm">Tạo Sòng</p>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* <button 
              onClick={onViewPlayers}
              className="flex flex-col items-start gap-3 p-5 rounded-3xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Users size={20} />
              </div>
              <p className="font-bold">Người chơi</p>
            </button> */}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] px-1">Số liệu thống kê</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tổng số ván</p>
            <p className="text-3xl font-black mt-1 tracking-tighter">{totalRounds}</p>
            <div className="mt-3 text-[10px] text-slate-400 flex items-center gap-1 font-bold">
              <History size={12} />
              <span>{matchHistory.length} sòng đã kết thúc</span>
            </div>
          </div>
          {(() => {
            // Find player with most match wins
            const winCounts: Record<string, number> = {};
            matchHistory.forEach(m => {
              const playerTotals = m.players.map(pid => ({
                id: pid,
                total: m.rounds.reduce((sum, r) => sum + (r.scores[pid] || 0), 0),
              }));
              const best = playerTotals.sort((a, b) => b.total - a.total)[0];
              if (best) winCounts[best.id] = (winCounts[best.id] || 0) + 1;
            });
            const topId = Object.entries(winCounts).sort((a, b) => b[1] - a[1])[0];
            const topPlayer = topId ? players.find(p => p.id === topId[0]) : null;
            const topWins = topId ? topId[1] : 0;

            return (
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vua sòng</p>
                <p className="text-2xl font-black mt-1 tracking-tighter truncate">
                  {topPlayer ? topPlayer.name : '—'}
                </p>
                <div className="mt-3 text-[10px] text-primary flex items-center gap-1 font-bold">
                  <Trophy size={12} />
                  <span>{topWins > 0 ? `${topWins} LẦN THẮNG` : 'CHƯA CÓ DỮ LIỆU'}</span>
                </div>
              </div>
            );
          })()}
        </div>
      </section>
    </div>
  );
}
