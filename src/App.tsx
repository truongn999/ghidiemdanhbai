/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, 
  Trophy, 
  Users, 
  Settings as SettingsIcon,
  Plus,
  History
} from 'lucide-react';
import { Player, Match, AppTab, AppSettings } from './types';

// Components (will be created in next steps)
import Home from './components/Home';
import Scoreboard from './components/Scoreboard';
import Players from './components/Players';
import Settings from './components/Settings';
import Onboarding from './components/Onboarding';
import ScoreEntry from './components/ScoreEntry';
import CreateMatch from './components/CreateMatch';
import MatchHistory from './components/MatchHistory';

const MOCK_PLAYERS: Player[] = [
  { id: '1', name: 'Anh Quân', avatar: 'https://picsum.photos/seed/1/200', totalWins: 12, currentScore: 150, rank: 1 },
  { id: '2', name: 'Minh Tú', avatar: 'https://picsum.photos/seed/2/200', totalWins: 8, currentScore: 120, rank: 2 },
  { id: '3', name: 'Bảo Ngọc', avatar: 'https://picsum.photos/seed/3/200', totalWins: 15, currentScore: 90, rank: 3 },
  { id: '4', name: 'Thùy Chi', avatar: 'https://picsum.photos/seed/4/200', totalWins: 5, currentScore: -20, rank: 4 },
];

const MOCK_MATCH: Match = {
  id: 'match_1',
  name: 'Billiards - 9 Ball',
  status: 'ongoing',
  players: ['1', '2', '3', '4'],
  rounds: [
    { id: 'r1', timestamp: Date.now() - 1500000, scores: { '1': 0, '2': 130, '3': 120, '4': 90 } },
    { id: 'r2', timestamp: Date.now() - 600000, scores: { '1': 100, '2': -30, '3': -20, '4': -50 } },
    { id: 'r3', timestamp: Date.now() - 60000, scores: { '1': 50, '2': 20, '3': -10, '4': -60 } },
  ],
  createdAt: Date.now() - 3600000,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showScoreEntry, setShowScoreEntry] = useState(false);
  const [showCreateMatch, setShowCreateMatch] = useState(false);
  const [editingRoundId, setEditingRoundId] = useState<string | null>(null);
  
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('app_players');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse players', e);
      }
    }
    return [];
  });

  const [currentMatch, setCurrentMatch] = useState<Match | null>(() => {
    const saved = localStorage.getItem('current_match');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse current match', e);
      }
    }
    return null;
  });

  const [matchHistory, setMatchHistory] = useState<Match[]>(() => {
    const saved = localStorage.getItem('match_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse match history', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('match_history', JSON.stringify(matchHistory));
  }, [matchHistory]);

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('app_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
    return {
      darkMode: true,
      accentColor: '#205eee',
      soundEnabled: true,
      vibrationEnabled: false,
    };
  });

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.style.setProperty('--primary-color', settings.accentColor);
    localStorage.setItem('app_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('app_players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    if (currentMatch) {
      localStorage.setItem('current_match', JSON.stringify(currentMatch));
    } else {
      localStorage.removeItem('current_match');
    }
  }, [currentMatch]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  const handleAddRound = (scores: Record<string, number>) => {
    if (!currentMatch) return;
    
    const newRound = {
      id: `r${currentMatch.rounds.length + 1}`,
      timestamp: Date.now(),
      scores,
    };

    const updatedMatch = {
      ...currentMatch,
      rounds: [...currentMatch.rounds, newRound],
    };

    setCurrentMatch(updatedMatch);
    
    // Update player current scores based on the new round
    const updatedPlayers = players.map(p => ({
      ...p,
      currentScore: p.currentScore + (scores[p.id] || 0)
    }));
    
    // Re-rank players
    const rankedPlayers = [...updatedPlayers].sort((a, b) => b.currentScore - a.currentScore);
    const finalPlayers = updatedPlayers.map(p => ({
      ...p,
      rank: rankedPlayers.findIndex(rp => rp.id === p.id) + 1
    }));

    setPlayers(finalPlayers);
    setShowScoreEntry(false);
  };

  const handleEditRound = (roundId: string) => {
    setEditingRoundId(roundId);
    setShowScoreEntry(true);
  };

  const handleSaveScoreEntry = (scores: Record<string, number>) => {
    if (editingRoundId && currentMatch) {
      // Editing existing round
      const updatedRounds = currentMatch.rounds.map(r =>
        r.id === editingRoundId ? { ...r, scores } : r
      );
      setCurrentMatch({ ...currentMatch, rounds: updatedRounds });
    } else {
      // Adding new round
      handleAddRound(scores);
      return; // handleAddRound already closes modal
    }
    setShowScoreEntry(false);
    setEditingRoundId(null);
  };

  const handleCloseScoreEntry = () => {
    setShowScoreEntry(false);
    setEditingRoundId(null);
  };

  const handleDeleteRound = (roundId: string) => {
    if (!currentMatch) return;
    setCurrentMatch({
      ...currentMatch,
      rounds: currentMatch.rounds.filter(r => r.id !== roundId),
    });
  };

  const handleEndMatch = () => {
    if (!currentMatch) return;
    const completedMatch: Match = { ...currentMatch, status: 'completed', completedAt: Date.now() };
    setMatchHistory(prev => [...prev, completedMatch]);
    setCurrentMatch(null);
    setActiveTab('history');
  };

  const handleDeleteHistoryMatch = (matchId: string) => {
    setMatchHistory(prev => prev.filter(m => m.id !== matchId));
  };

  const handleCreateMatch = (matchName: string, playerNames: string[]) => {
    // 1. Create new players if they don't exist (for simplicity, we create new ones for every new match in this flow)
    const newPlayers: Player[] = playerNames.map((name, index) => ({
      id: `p_${Date.now()}_${index}`,
      name,
      avatar: `https://picsum.photos/seed/${name}/200`,
      totalWins: 0,
      currentScore: 0,
      rank: index + 1
    }));

    // 2. Update global players list
    setPlayers(prev => [...prev, ...newPlayers]);

    // 3. Create new match
    const newMatch: Match = {
      id: `match_${Date.now()}`,
      name: matchName,
      status: 'ongoing',
      players: newPlayers.map(p => p.id),
      rounds: [],
      createdAt: Date.now()
    };

    setCurrentMatch(newMatch);
    setShowCreateMatch(false);
    setActiveTab('scoreboard');
  };

  const handleDeletePlayer = (playerId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người chơi này?')) {
      setPlayers(prev => prev.filter(p => p.id !== playerId));
      if (currentMatch && currentMatch.players.includes(playerId)) {
        setCurrentMatch({
          ...currentMatch,
          players: currentMatch.players.filter(id => id !== playerId)
        });
      }
    }
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-md mx-auto w-full"
          >
            {activeTab === 'home' && (
              <Home 
                currentMatch={currentMatch} 
                players={players} 
                matchHistory={matchHistory}
                onStartNew={() => setShowScoreEntry(true)} 
                onCreateMatch={() => setShowCreateMatch(true)}
                onViewMatch={() => setActiveTab('scoreboard')}
                onViewHistory={() => setActiveTab('history')}
                onViewPlayers={() => setActiveTab('players')}
              />
            )}
            {activeTab === 'scoreboard' && (
              <Scoreboard 
                match={currentMatch} 
                players={players} 
                onAddScore={() => setShowScoreEntry(true)}
                onCreateMatch={() => setShowCreateMatch(true)}
                onEditRound={handleEditRound}
                onDeleteRound={handleDeleteRound}
                onEndMatch={handleEndMatch}
              />
            )}
            {activeTab === 'players' && (
              <Players players={players} onDelete={handleDeletePlayer} onCreateMatch={() => setShowCreateMatch(true)} />
            )}
            {activeTab === 'settings' && (
              <Settings settings={settings} setSettings={setSettings} />
            )}
            {activeTab === 'history' && (
              <MatchHistory
                matches={matchHistory}
                players={players}
                onDeleteMatch={handleDeleteHistoryMatch}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Action Button for quick score entry */}
      {activeTab === 'scoreboard' && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowScoreEntry(true)}
          className="fixed right-6 bottom-24 size-14 bg-primary text-white rounded-full shadow-xl shadow-primary/30 flex items-center justify-center z-40"
        >
          <Plus size={32} />
        </motion.button>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-50 safe-pb">
        <div className="flex justify-around items-center h-20 px-4">
          <NavButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon={<HomeIcon size={24} />} 
            label="Trang chủ" 
          />
          <NavButton 
            active={activeTab === 'scoreboard'} 
            onClick={() => setActiveTab('scoreboard')} 
            icon={<Trophy size={24} />} 
            label="Bảng điểm" 
          />
          <NavButton 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            icon={<History size={24} />} 
            label="Lịch sử" 
          />
          <NavButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={<SettingsIcon size={24} />} 
            label="Cài đặt" 
          />
        </div>
      </nav>

      {/* Score Entry Modal */}
      <AnimatePresence>
        {showScoreEntry && currentMatch && (
          <ScoreEntry 
            players={players.filter(p => currentMatch.players.includes(p.id))}
            onClose={handleCloseScoreEntry}
            onSave={handleSaveScoreEntry}
            initialScores={editingRoundId ? currentMatch.rounds.find(r => r.id === editingRoundId)?.scores : undefined}
          />
        )}
      </AnimatePresence>

      {/* Create Match Modal */}
      <AnimatePresence>
        {showCreateMatch && (
          <CreateMatch 
            onClose={() => setShowCreateMatch(false)}
            onSave={handleCreateMatch}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
    >
      <motion.div
        animate={{ scale: active ? 1.1 : 1 }}
      >
        {icon}
      </motion.div>
      <span className={`text-[10px] font-medium ${active ? 'font-bold' : ''}`}>{label}</span>
    </button>
  );
}

