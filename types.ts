
export enum Language {
  ZH = 'zh',
  EN = 'en'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  gender: Gender;
  mysticTitle?: string;
  badges: string[];
  stats: {
    totalGames: number;
    wins: number;
    totalScore: number;
    playTimeMinutes: number;
    gameTypeCounts: Record<string, number>; // gameId -> count
  };
}

export interface ScoreRound {
  id: string;
  timestamp: number;
  scores: Record<string, number>;
}

export interface GameVariant {
  name_zh: string;
  name_en: string;
  description_zh: string;
  description_en: string;
}

export interface GamePreset {
  id: string;
  name_zh: string;
  name_en: string;
  players: number;
  decks: number;
  variants: GameVariant[];
}

export interface MysticTrial {
  id: string;
  title_zh: string;
  title_en: string;
  description_zh: string;
  description_en: string;
  goal: (session: GameSession) => boolean;
}

export interface GameSession {
  id: string;
  name: string;
  players: Player[];
  rounds: ScoreRound[];
  startTime: number;
  endTime?: number;
  totalDecks?: number;
  type: 'custom' | 'preset';
  presetId?: string;
  variantIndex?: number;
  limitTime?: number; 
  limitRounds?: number;
  activeTrialId?: string;
}

export interface UserProfile extends Player {
  phone: string;
  password?: string; // Stored in plain text for this demo implementation
}
