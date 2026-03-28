
import React from 'react';
import PrivacyScreen from './PrivacyScreen';
import { useGameLogic } from '../hooks/useGameLogic';
import { ROLE_DATA, STRINGS_FA, ROLE_TAGLINES } from '../constants';
import { Team, Player } from '../types';

type RoleRevealProps = ReturnType<typeof useGameLogic>;

const RoleCard: React.FC<{
  player: Player;
  allPlayers: Player[];
  onDismiss: () => void;
  isLast: boolean;
  progress: string;
}> = ({ player, allPlayers, onDismiss, isLast, progress }) => {
  const roleInfo = ROLE_DATA[player.role];
  const knowledgeText = roleInfo.knowledge(allPlayers, player);

  const isEvil = player.team === Team.Evil;
  const teamColor = isEvil ? 'text-red-400' : 'text-blue-400';
  const teamBorderColor = isEvil ? 'border-red-500/60' : 'border-blue-500/60';
  const teamGlow = isEvil
    ? 'shadow-[0_0_30px_rgba(239,68,68,0.15)]'
    : 'shadow-[0_0_30px_rgba(59,130,246,0.15)]';
  const teamRingGlow = isEvil
    ? 'border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
    : 'border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.25)]';

  return (
    <div className={`w-full max-w-sm bg-slate-900/95 backdrop-blur-3xl border-2 ${teamBorderColor} rounded-[2.5rem] ${teamGlow} flex flex-col items-center text-right animate-fade-in overflow-hidden`}>

      {/* Team color header strip */}
      <div className={`w-full h-1.5 ${isEvil ? 'bg-gradient-to-r from-red-600 to-rose-800' : 'bg-gradient-to-r from-blue-600 to-indigo-700'}`} />

      <div className="p-6 w-full flex flex-col items-center">
        {/* Progress + name badge */}
        <div className="w-full flex justify-between items-center mb-5">
          <span className="text-[10px] font-black text-gray-500 tracking-widest">{progress}</span>
          <span className="bg-yellow-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-md">
            {player.name}
          </span>
        </div>

        {/* Avatar */}
        <div className={`w-24 h-24 rounded-full overflow-hidden border-4 ${teamRingGlow} bg-slate-800 flex items-center justify-center mb-4`}>
          {roleInfo.image
            ? <img src={roleInfo.image} alt="" className="w-16 h-16 object-contain" />
            : <span className="text-5xl">{isEvil ? '😈' : '😇'}</span>
          }
        </div>

        {/* Role identity */}
        <div className="text-center mb-5 space-y-0.5">
          <h2 className="text-3xl font-black text-white tracking-tight">{roleInfo.name}</h2>
          {ROLE_TAGLINES[player.role] && (
            <p className="text-yellow-500/70 font-bold text-[10px] tracking-[0.2em] uppercase">{ROLE_TAGLINES[player.role]}</p>
          )}
          <p className={`${teamColor} font-bold text-xs tracking-widest uppercase`}>تیم {player.team}</p>
        </div>

        {/* Description */}
        <div className="w-full bg-black/30 p-4 rounded-2xl mb-3 border border-white/5">
          <p className="text-sm text-gray-200 leading-relaxed font-medium text-right">{roleInfo.description}</p>
        </div>

        {/* Knowledge */}
        <div className="w-full bg-gray-800/40 p-4 rounded-2xl border border-white/8 mb-5">
          <p className="font-black text-center text-yellow-500 mb-2 text-[10px] tracking-[0.2em] uppercase border-b border-white/10 pb-2">
            اطلاعات محرمانه
          </p>
          <div className="text-gray-100 text-base text-center leading-relaxed">
            {knowledgeText}
          </div>
        </div>

        {/* Explicit dismiss button */}
        <button
          onClick={onDismiss}
          className={`w-full py-4 rounded-2xl font-lalezar text-lg transition-all active:scale-95 border-t border-white/20 ${
            isLast
              ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-[0_8px_25px_rgba(22,163,74,0.4)]'
              : 'bg-gradient-to-r from-yellow-600 to-amber-700 text-slate-950 shadow-[0_8px_25px_rgba(202,138,4,0.35)]'
          }`}
        >
          {isLast ? 'پایان نمایش نقش‌ها — شروع شب ☾' : 'پنهان کردن نقش و ادامه →'}
        </button>
      </div>
    </div>
  );
};

const RoleReveal: React.FC<RoleRevealProps> = ({ gameState, advanceRoleReveal }) => {
  const { players, activePlayerIndex } = gameState;
  const currentPlayer = players[activePlayerIndex];
  const isLastPlayer = activePlayerIndex === players.length - 1;
  const progress = `بازیکن ${activePlayerIndex + 1} از ${players.length}`;

  return (
    <div className="w-full h-full flex items-center justify-center overflow-y-auto custom-scrollbar py-2">
      <PrivacyScreen
        key={currentPlayer.id}
        message={STRINGS_FA.passTo.replace('{player}', currentPlayer.name)}
        buttonText={STRINGS_FA.tapToReveal}
        onContinue={advanceRoleReveal}
      >
        {(hide) => (
          <RoleCard
            player={currentPlayer}
            allPlayers={players}
            onDismiss={hide}
            isLast={isLastPlayer}
            progress={progress}
          />
        )}
      </PrivacyScreen>
    </div>
  );
};

export default RoleReveal;
