
import React from 'react';

export enum Team {
  Good = 'شهروند',
  Evil = 'مافیا',
}

export enum Role {
  // Good Roles
  Merlin = 'شرلوک',
  Percival = 'واتسون',
  LoyalServant = 'شهروند ساده',
  Tristan = 'سرباز صفر (۱)',
  Isolde = 'سرباز صفر (۲)',
  // Evil Roles
  Morgana = 'جاسوس',
  Assassin = 'قاتل حرفه‌ای',
  Mordred = 'پدرخوانده',
  Oberon = 'شهروند خبیث',
  // Expansion Roles
  Agravaine = 'مافیای ساده',
  Lancelot = 'پلیس فاسد',
}

export interface RoleInfo {
  name: Role;
  team: Team;
  description: string;
  knowledge: (players: Player[], self: Player) => React.ReactNode;
  image: string;
}

export interface Player {
  id: number;
  name:string;
  role: Role;
  team: Team;
}

export enum GamePhase {
  SETUP = 'SETUP',
  ROLE_REVEAL = 'ROLE_REVEAL',
  NARRATED_NIGHT = 'NARRATED_NIGHT',
  TEAM_PROPOSAL = 'TEAM_PROPOSAL',
  TEAM_VOTE = 'TEAM_VOTE',
  QUEST_EXECUTION = 'QUEST_EXECUTION',
  QUEST_RESULT = 'QUEST_RESULT',
  ASSASSINATION = 'ASSASSINATION',
  GAME_OVER = 'GAME_OVER',
}

export enum QuestResult {
  SUCCESS = 'موفق',
  FAIL = 'ناموفق',
  PENDING = 'در انتظار',
}

export interface Quest {
  id: number;
  teamSize: number;
  failsRequired: number;
  result: QuestResult;
  team: Player[];
  outcomes: ('Success' | 'Fail')[];
}

export interface GameState {
  players: Player[];
  phase: GamePhase;
  currentRound: number;
  currentLeaderIndex: number;
  voteTrack: number;
  quests: Quest[];
  currentQuestTeam: Player[];
  gameMessage: string | null;
  winner: Team | null;
  activePlayerIndex: number;
  privateActionStep: number;
  temporaryQuestOutcomes: ('Success' | 'Fail')[];
  assassin: Player | null;
  useNarratedNight: boolean;
  useExpansion: boolean; // Track if expansion roles are active
}
