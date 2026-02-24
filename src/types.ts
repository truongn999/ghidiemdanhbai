export interface Player {
  id: string;
  name: string;
  avatar: string;
  totalWins: number;
  currentScore: number;
  rank?: number;
}

export interface MatchRound {
  id: string;
  timestamp: number;
  scores: Record<string, number>; // playerId -> score change
}

export interface Match {
  id: string;
  name: string;
  status: 'ongoing' | 'completed';
  players: string[]; // playerIds
  rounds: MatchRound[];
  createdAt: number;
  completedAt?: number;
}

export type AppTab = 'home' | 'scoreboard' | 'players' | 'settings' | 'onboarding' | 'history';

export interface AppSettings {
  darkMode: boolean;
  accentColor: string;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}
