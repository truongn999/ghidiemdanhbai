import { Search, UserPlus, Users, Edit2, Trash2, MoreVertical, Plus } from 'lucide-react';
import { Player } from '../types';

interface PlayersProps {
  players: Player[];
  onDelete: (id: string) => void;
  onCreateMatch: () => void;
}

export default function Players({ players, onDelete, onCreateMatch }: PlayersProps) {
  if (players.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between px-4 h-16">
            <h1 className="text-xl font-black tracking-tight">Người chơi</h1>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Users size={40} className="text-primary" />
            </div>
            <h2 className="text-xl font-black tracking-tight mb-2">Chưa có người chơi</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              Tạo một sòng mới để thêm người chơi và bắt đầu chơi.
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

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-4 h-16">
          <h1 className="text-xl font-black tracking-tight">Người chơi</h1>
          <button className="size-10 flex items-center justify-center rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <UserPlus size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-6">
        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm người chơi..." 
            className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all outline-none"
          />
        </div>

        {/* List */}
        <div className="space-y-3 pb-32">
          {players.map(player => (
            <div 
              key={player.id}
              className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-all group"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-base truncate tracking-tight">{player.name}</h3>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  ID: #{1000 + parseInt(player.id)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button className="size-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => onDelete(player.id)}
                  className="size-10 flex items-center justify-center rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Action Button */}
      <div className="fixed bottom-24 left-0 right-0 p-4 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/95 dark:via-background-dark/95 to-transparent z-20">
        <div className="max-w-md mx-auto">
          <button className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-3xl shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 transition-transform active:scale-[0.98]">
            <UserPlus size={24} />
            <span>Thêm người chơi mới</span>
          </button>
        </div>
      </div>
    </div>
  );
}
