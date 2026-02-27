
import { useReducer, useCallback } from 'react';
import { GameState, GamePhase, Player, Role, Team, Quest, QuestResult } from '../types';
import { ROLE_CONFIGURATIONS, QUEST_RULES, ROLE_DATA, getExpandedConfig } from '../constants';
import { GAME_CONFIG } from '../game-config';

type Action =
  | { type: 'SETUP_GAME'; playerCount: number; playerNames: string[]; useNarratedNight: boolean; useExpansion: boolean }
  | { type: 'ADVANCE_ROLE_REVEAL' }
  | { type: 'ADVANCE_NIGHT_PHASE' }
  | { type: 'FINISH_NARRATION' }
  | { type: 'START_TEAM_PROPOSAL' }
  | { type: 'SELECT_TEAM_MEMBER'; player: Player }
  | { type: 'PROPOSE_TEAM' }
  | { type: 'HANDLE_TEAM_VOTE'; approved: boolean }
  | { type: 'SUBMIT_QUEST_OUTCOME'; outcome: 'Success' | 'Fail' }
  | { type: 'PROCESS_QUEST_RESULT' }
  | { type: 'START_ASSASSINATION' }
  | { type: 'ASSASSINATE'; target: Player }
  | { type: 'RESET_GAME' };

const createInitialState = (): GameState => ({
  players: [],
  phase: GamePhase.SETUP,
  currentRound: 0,
  currentLeaderIndex: 0,
  voteTrack: 0,
  quests: [],
  currentQuestTeam: [],
  gameMessage: null,
  winner: null,
  activePlayerIndex: 0,
  privateActionStep: 0,
  temporaryQuestOutcomes: [],
  assassin: null,
  useNarratedNight: false,
  useExpansion: false,
});

function shuffleArray<T,>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'RESET_GAME':
      return createInitialState();

    case 'SETUP_GAME': {
      const { playerCount, playerNames, useNarratedNight, useExpansion } = action;
      const rolesConfig = getExpandedConfig(playerCount, useExpansion);
      const roles: Role[] = shuffleArray([...rolesConfig.good, ...rolesConfig.evil]);
      
      const players: Player[] = playerNames.map((name, i) => {
        const role = roles[i];
        const team = ROLE_DATA[role].team;
        return { id: i, name, role, team };
      });

      const quests: Quest[] = QUEST_RULES[playerCount].teamSizes.map((size, i) => ({
        id: i,
        teamSize: size,
        failsRequired: QUEST_RULES[playerCount].failsRequired[i],
        result: QuestResult.PENDING,
        team: [],
        outcomes: [],
      }));

      return {
        ...createInitialState(),
        players,
        quests,
        useNarratedNight,
        useExpansion,
        phase: GamePhase.ROLE_REVEAL,
        currentLeaderIndex: Math.floor(Math.random() * playerCount),
      };
    }
    
    case 'ADVANCE_ROLE_REVEAL': {
        const nextIndex = state.activePlayerIndex + 1;
        if (nextIndex >= state.players.length) {
            if (state.useNarratedNight) {
                return { ...state, phase: GamePhase.NARRATED_NIGHT, activePlayerIndex: 0 };
            }
            const leader = state.players[state.currentLeaderIndex];
            return { 
              ...state, 
              phase: GamePhase.TEAM_PROPOSAL, 
              activePlayerIndex: 0,
              gameMessage: `دور ۱ - رأی ۱: نوبت ${leader.name} است تا تیم عملیات را انتخاب کند.`
            };
        }
        return { ...state, activePlayerIndex: nextIndex };
    }

    case 'ADVANCE_NIGHT_PHASE': {
        const nextIndex = state.privateActionStep + 1;
        if (nextIndex >= state.players.length) {
            const leader = state.players[state.currentLeaderIndex];
            return { 
                ...state, 
                phase: GamePhase.TEAM_PROPOSAL, 
                gameMessage: `دور ۱ - رأی ۱: نوبت ${leader.name} است تا تیم عملیات را انتخاب کند.`
            };
        }
        return { ...state, privateActionStep: nextIndex };
    }

    case 'FINISH_NARRATION': {
        const leader = state.players[state.currentLeaderIndex];
        return { 
            ...state, 
            phase: GamePhase.TEAM_PROPOSAL, 
            gameMessage: `دور ۱ - رأی ۱: نوبت ${leader.name} است تا تیم عملیات را انتخاب کند.`
        };
    }

    case 'START_TEAM_PROPOSAL': {
      const leader = state.players[state.currentLeaderIndex];
      return {
          ...state,
          phase: GamePhase.TEAM_PROPOSAL,
          currentQuestTeam: [],
          gameMessage: `دور ${state.currentRound + 1} - رأی ${state.voteTrack + 1}: ${leader.name}، لطفاً ${state.quests[state.currentRound].teamSize} نفر را برای عملیات انتخاب کن.`
      };
    }

    case 'SELECT_TEAM_MEMBER': {
      const { player } = action;
      const team = state.currentQuestTeam;
      const isSelected = team.some(p => p.id === player.id);
      const newTeam = isSelected ? team.filter(p => p.id !== player.id) : [...team, player];
      return { ...state, currentQuestTeam: newTeam };
    }

    case 'PROPOSE_TEAM': {
      if(state.currentQuestTeam.length !== state.quests[state.currentRound].teamSize) return state;
      return { ...state, phase: GamePhase.TEAM_VOTE };
    }
    
    case 'HANDLE_TEAM_VOTE': {
      const { approved } = action;

      if (approved) {
        return {
          ...state,
          phase: GamePhase.QUEST_EXECUTION,
          voteTrack: 0,
          quests: state.quests.map((q, i) => i === state.currentRound ? { ...q, team: state.currentQuestTeam } : q),
          activePlayerIndex: state.players.findIndex(p => p.id === state.currentQuestTeam[0].id),
          temporaryQuestOutcomes: [],
          gameMessage: `تیم تأیید شد! اعضای تیم عملیات لطفاً رأی خود را ثبت کنند.`
        };
      } else {
        const newVoteTrack = state.voteTrack + 1;
        if (newVoteTrack >= 5) {
          return { ...state, phase: GamePhase.GAME_OVER, winner: Team.Evil, gameMessage: '۵ رأی ناموفق متوالی! مافیا پیروز شد. 👎' };
        }
        const newLeaderIndex = (state.currentLeaderIndex + 1) % state.players.length;
        const leader = state.players[newLeaderIndex];
        return {
          ...state,
          phase: GamePhase.TEAM_PROPOSAL,
          voteTrack: newVoteTrack,
          currentLeaderIndex: newLeaderIndex,
          currentQuestTeam: [],
          gameMessage: `رأی‌گیری ناموفق بود. سرگروه جدید: ${leader.name}.`
        };
      }
    }

    case 'SUBMIT_QUEST_OUTCOME': {
        const newOutcomes = [...state.temporaryQuestOutcomes, action.outcome];
        
        const currentPlayerOnTeamIndex = state.currentQuestTeam.findIndex(p => p.id === state.players[state.activePlayerIndex].id);

        if (currentPlayerOnTeamIndex < state.currentQuestTeam.length - 1) {
            const nextPlayerOnTeam = state.currentQuestTeam[currentPlayerOnTeamIndex + 1];
            const nextGlobalPlayerIndex = state.players.findIndex(p => p.id === nextPlayerOnTeam.id);
            return { 
                ...state, 
                temporaryQuestOutcomes: newOutcomes, 
                activePlayerIndex: nextGlobalPlayerIndex 
            };
        }
        
        return { ...state, phase: GamePhase.QUEST_RESULT, temporaryQuestOutcomes: newOutcomes };
    }

    case 'PROCESS_QUEST_RESULT': {
      const outcomes = shuffleArray(state.temporaryQuestOutcomes);
      const failCount = outcomes.filter(o => o === 'Fail').length;
      const { failsRequired } = state.quests[state.currentRound];
      const didFail = failCount >= failsRequired;
      const result = didFail ? QuestResult.FAIL : QuestResult.SUCCESS;

      const updatedQuests = state.quests.map((q, i) =>
        i === state.currentRound ? { ...q, result, outcomes } : q
      );

      const goodWins = updatedQuests.filter(q => q.result === QuestResult.SUCCESS).length;
      const evilWins = updatedQuests.filter(q => q.result === QuestResult.FAIL).length;

      if (goodWins >= 3) {
        const assassin = state.players.find(p => p.role === Role.Assassin);
        return { ...state, phase: GamePhase.ASSASSINATION, assassin, quests: updatedQuests, gameMessage: "شهروندان در ۳ عملیات پیروز شدند! 🏆 قاتل حرفه‌ای باید شرلوک را پیدا کند." };
      }
      if (evilWins >= 3) {
        return { ...state, phase: GamePhase.GAME_OVER, winner: Team.Evil, quests: updatedQuests, gameMessage: "مافیا در ۳ عملیات پیروز شد! 💀" };
      }

      const newLeaderIndex = (state.currentLeaderIndex + 1) % state.players.length;
      const leader = state.players[newLeaderIndex];
      return {
        ...state,
        phase: GamePhase.TEAM_PROPOSAL,
        currentRound: state.currentRound + 1,
        currentLeaderIndex: newLeaderIndex,
        voteTrack: 0,
        quests: updatedQuests,
        currentQuestTeam: [],
        gameMessage: `عملیات ${didFail ? 'ناموفق بود ❌' : 'موفق بود ✅'}. سرگروه جدید: ${leader.name}.`,
      };
    }
    
    case 'START_ASSASSINATION': {
        const assassin = state.players.find(p => p.role === Role.Assassin);
        return { ...state, phase: GamePhase.ASSASSINATION, assassin, gameMessage: `${assassin?.name}، شما باید شرلوک را شناسایی و ترور کنید.` };
    }

    case 'ASSASSINATE': {
      const { target } = action;
      if (target.role === Role.Merlin) {
        return { ...state, phase: GamePhase.GAME_OVER, winner: Team.Evil, gameMessage: `قاتل حرفه‌ای شرلوک را ترور کرد! 🎯 مافیا پیروز شد.` };
      } else {
        return { ...state, phase: GamePhase.GAME_OVER, winner: Team.Good, gameMessage: `حدس قاتل حرفه‌ای اشتباه بود! شهروندان پیروز شدند. 🎉` };
      }
    }

    default:
      return state;
  }
}


export const useGameLogic = () => {
    const [gameState, dispatch] = useReducer(gameReducer, createInitialState());

    const setupGame = useCallback((playerCount: number, playerNames: string[], useNarratedNight: boolean, useExpansion: boolean) => {
        dispatch({ type: 'SETUP_GAME', playerCount, playerNames, useNarratedNight, useExpansion });
    }, []);
    const advanceRoleReveal = useCallback(() => dispatch({ type: 'ADVANCE_ROLE_REVEAL' }), []);
    const advanceNightPhase = useCallback(() => dispatch({ type: 'ADVANCE_NIGHT_PHASE' }), []);
    const finishNarration = useCallback(() => dispatch({ type: 'FINISH_NARRATION' }), []);
    const selectTeamMember = useCallback((player: Player) => dispatch({ type: 'SELECT_TEAM_MEMBER', player }), []);
    const proposeTeam = useCallback(() => dispatch({ type: 'PROPOSE_TEAM' }), []);
    const handleTeamVote = useCallback((approved: boolean) => dispatch({ type: 'HANDLE_TEAM_VOTE', approved }), []);
    const submitQuestOutcome = useCallback((outcome: 'Success' | 'Fail') => dispatch({ type: 'SUBMIT_QUEST_OUTCOME', outcome }), []);
    const processQuestResult = useCallback(() => dispatch({ type: 'PROCESS_QUEST_RESULT'}), []);
    
    const assassinate = useCallback((target: Player) => {
        dispatch({ type: 'ASSASSINATE', target });
    }, []);
    
    const resetGame = useCallback(() => {
        if (window.confirm(GAME_CONFIG.ui.resetConfirm)) {
            dispatch({ type: 'RESET_GAME' });
        }
    }, []);

    return {
        gameState,
        setupGame,
        advanceRoleReveal,
        advanceNightPhase,
        finishNarration,
        selectTeamMember,
        proposeTeam,
        handleTeamVote,
        submitQuestOutcome,
        processQuestResult,
        assassinate,
        resetGame,
    };
};
