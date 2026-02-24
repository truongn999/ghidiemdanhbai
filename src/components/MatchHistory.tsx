import { useState } from 'react';
import { History, Trophy, Users, Clock, ChevronRight, Trash2, ArrowLeft } from 'lucide-react';
import { Match, Player } from '../types';

interface MatchHistoryProps {
  matches: Match[];
  players: Player[];
  onDeleteMatch: (matchId: string) => void;
}

export default function MatchHistory({ matches, players, onDeleteMatch }: MatchHistoryProps) {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  const selectedMatch = selectedMatchId ? matches.find(m => m.id === selectedMatchId) : null;

  // ── Detail View ──
  if (selectedMatch) {
    const matchPlayers = selectedMatch.players
      .map(id => players.find(p => p.id === id))
      .filter(Boolean) as Player[];

    // Compute totals & ranks
    const totals = matchPlayers.map(p => ({
      id: p.id,
      name: p.name,
      total: selectedMatch.rounds.reduce((sum, r) => sum + (r.scores[p.id] || 0), 0),
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

    const matchDate = new Date(selectedMatch.createdAt);
    const dateStr = matchDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = matchDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 px-4 h-14">
            <button
              onClick={() => setSelectedMatchId(null)}
              className="size-9 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-black tracking-tight truncate">{selectedMatch.name}</h1>
              <p className="text-[10px] font-bold text-slate-400">{dateStr} · {timeStr} · {selectedMatch.rounds.length} ván</p>
            </div>
          </div>

          {/* Standings */}
          <div className="px-4 py-2 overflow-x-auto no-scrollbar flex gap-2">
            {matchPlayers.map(player => {
              const total = totals.find(t => t.id === player.id)!.total;
              const rank = rankMap[player.id];
              return (
                <div
                  key={player.id}
                  className="shrink-0 p-2 flex flex-col items-center justify-center"
                >
                  <p className={`text-[10px] uppercase tracking-widest font-black opacity-70 ${rank === 1 ? 'text-primary' : 'text-slate-500'}`}>
                    {player.name.split(' ').pop()}
                  </p>
                  <p className="text-md font-black mt-1 tracking-tighter rounded-full w-10 h-10 flex items-center justify-center border">
                    {total}
                  </p>
                  <div className={`mt-2 flex items-center gap-1 text-[8px] font-bold ${rank === 1 ? 'text-primary' : 'text-slate-500'}`}>
                    <span>H. {rank}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </header>

        <main className="flex-1 px-4 py-4 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg tracking-tight">Chi tiết các ván</h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {selectedMatch.rounds.length} ván
            </span>
          </div>

          <div className="space-y-4">
            {[...selectedMatch.rounds].reverse().map((round, idx) => (
              <div
                key={round.id}
                className="bg-white dark:bg-slate-800/40 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-black bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                    Ván #{selectedMatch.rounds.length - idx}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                    <Clock size={12} />
                    <span>{getTimeAgo(round.timestamp)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {selectedMatch.players.map(playerId => {
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
      </div>
    );
  }

  // ── List View ──
  if (matches.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between px-4 h-14">
            <h1 className="text-xl font-black tracking-tight">Lịch sử Sòng</h1>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <History size={40} className="text-primary" />
            </div>
            <h2 className="text-xl font-black tracking-tight mb-2">Chưa có lịch sử</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Khi kết thúc một sòng, nó sẽ được lưu vào đây để bạn xem lại.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-black tracking-tight">Lịch sử Sòng</h1>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {matches.length} sòng
          </span>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 space-y-3">
        {[...matches].reverse().map(match => {
          const matchPlayers = match.players
            .map(id => players.find(p => p.id === id))
            .filter(Boolean) as Player[];

          const totals = matchPlayers.map(p => ({
            player: p,
            total: match.rounds.reduce((sum, r) => sum + (r.scores[p.id] || 0), 0),
          }));
          const sorted = [...totals].sort((a, b) => b.total - a.total);
          const winner = sorted[0];

          const matchDate = new Date(match.createdAt);
          const dateStr = matchDate.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
          const timeStr = matchDate.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={match.id}
              className="bg-white dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:border-primary/30 transition-colors"
            >
              <button
                onClick={() => setSelectedMatchId(match.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-base tracking-tight truncate">{match.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <Clock size={10} />
                        <span>{dateStr} · {timeStr}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 mt-1 shrink-0" />
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    <Users size={10} />
                    <span>{matchPlayers.length} người chơi</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    <History size={10} />
                    <span>{match.rounds.length} ván</span>
                  </div>
                  {match.completedAt && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      <Clock size={10} />
                      <span>{formatDuration(match.completedAt - match.createdAt)}</span>
                    </div>
                  )}
                </div>

                {/* Winner */}
                {winner && (
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-primary/5 border border-primary/10">
                    <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <Trophy size={12} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Người thắng</p>
                      <p className="text-sm font-black truncate">{winner.player.name}</p>
                    </div>
                    <p className="text-lg font-black text-primary tracking-tighter">{winner.total}</p>
                  </div>
                )}
              </button>

              {/* Delete button */}
              <div className="px-4 pb-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteMatch(match.id);
                  }}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={10} />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          );
        })}
      </main>
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

function formatDuration(ms: number) {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours} giờ ${minutes} phút`;
  if (minutes > 0) return `${minutes} phút`;
  return 'Dưới 1 phút';
}
